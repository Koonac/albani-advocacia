// Importa para o Directus os posts que hoje estão em src/content/posts/*.js.
// Sem flags, não duplica: pula os posts cujo slug PT já existe no CMS.
// Com `--atualizar`, sobrescreve o conteúdo (textos, pontos-chave, perguntas, SEO, capa e imagens)
// dos posts que já existem, mantendo status e data de publicação. Atenção: edições feitas no
// painel nesses posts são substituídas pela versão dos arquivos.
// As imagens (capa e as do corpo, em /img/blog/) sobem para a biblioteca do Directus uma vez só.
import { readdirSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { CMS_URL, api, findOne, login, uploadFile } from './lib.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const POSTS_DIR = join(ROOT, 'src/content/posts')
// Endereço que o navegador enxerga: as imagens do corpo também aparecem no editor do painel
const PUBLIC_CMS = (process.env.CMS_PUBLIC_URL || CMS_URL).replace(/\/$/, '')
const update = process.argv.includes('--atualizar')

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toHtml = (body) => (Array.isArray(body) ? body.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n') : body)

// Campos opcionais por idioma, no formato das listas do painel
const extras = (post, l) => ({
  [`key_points_${l}`]: post.keyPoints?.[l]?.map((texto) => ({ texto })) ?? null,
  [`faq_${l}`]: post.faq?.[l]?.map(({ q, a }) => ({ pergunta: q, resposta: a })) ?? null,
  [`seo_title_${l}`]: post.seo?.title?.[l] ?? null,
  [`seo_description_${l}`]: post.seo?.description?.[l] ?? null,
})

/** Sobe /img/blog/<arquivo> para a biblioteca (reaproveita se já subiu) e devolve o id */
async function ensureImage(src) {
  const title = `Blog · ${basename(src)}`
  const existing = await findOne('/files', { title })
  return existing ? existing.id : uploadFile(join(ROOT, 'public', src), { title, type: 'image/webp' })
}

/** Corpo em HTML com as imagens locais trocadas pelas da biblioteca do Directus */
async function cmsBody(body) {
  let html = toHtml(body)
  for (const [, src] of html.matchAll(/src="(\/img\/blog\/[^"]+)"/g)) {
    html = html.replaceAll(`src="${src}"`, `src="${PUBLIC_CMS}/assets/${await ensureImage(src)}"`)
  }
  return html
}

await login()

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.js') && f !== 'index.js')
let created = 0
let updated = 0
for (const file of files) {
  const { default: post } = await import(pathToFileURL(join(POSTS_DIR, file)).href)
  const existing = await findOne('/items/posts', { slug_pt: post.slug.pt })
  if (existing && !update) {
    console.log(`já existe: ${post.slug.pt}`)
    continue
  }
  const content = {
    category: post.category,
    updated: post.updated ?? null,
    cover: post.cover && !post.cover.endsWith('.svg') ? await ensureImage(post.cover) : null,
    title_pt: post.title.pt,
    title_en: post.title.en,
    subtitle_pt: post.subtitle?.pt ?? null,
    subtitle_en: post.subtitle?.en ?? null,
    slug_pt: post.slug.pt,
    slug_en: post.slug.en,
    excerpt_pt: post.excerpt.pt,
    excerpt_en: post.excerpt.en,
    body_pt: await cmsBody(post.body.pt),
    body_en: await cmsBody(post.body.en),
    ...extras(post, 'pt'),
    ...extras(post, 'en'),
  }
  if (existing) {
    await api('PATCH', `/items/posts/${existing.id}`, content)
    updated++
    console.log(`atualizado: ${post.slug.pt}`)
  } else {
    await api('POST', '/items/posts', { status: 'published', date: post.date, ...content })
    created++
    console.log(`importado: ${post.slug.pt}`)
  }
}
console.log(`\n${created} posts importados, ${updated} atualizados. O Flow vai disparar um rebuild do site.`)
