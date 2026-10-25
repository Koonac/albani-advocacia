// Busca no Directus os posts publicados e grava src/content/posts/cms-posts.json,
// que o site lê no build. Capas e imagens do corpo são baixadas para public/img/blog/cms/,
// para o site estático não depender do CMS depois de publicado.
//
// Variáveis: DIRECTUS_URL (sem ela, o script só garante que o JSON existe) e DIRECTUS_TOKEN.
// `--skip` ignora o CMS mesmo com DIRECTUS_URL definido (usado por `npm run build:static`).
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sanitizeHtml from 'sanitize-html'

const OUT_JSON = resolve('src/content/posts/cms-posts.json')
const IMG_DIR = resolve('public/img/blog/cms')
const IMG_URL = '/img/blog/cms'
const CATEGORIES = ['imigracao', 'nacionalidade', 'documentos', 'empresas', 'investimento']
const REQUIRED = ['date', 'category', 'title_pt', 'title_en', 'slug_pt', 'slug_en', 'excerpt_pt', 'excerpt_en', 'body_pt', 'body_en']
const ASSET_RE = /\/assets\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i

const baseUrl = process.env.DIRECTUS_URL?.replace(/\/$/, '')
const token = process.env.DIRECTUS_TOKEN
const skip = process.argv.includes('--skip')

if (!baseUrl || skip) {
  if (skip || !existsSync(OUT_JSON)) writeFileSync(OUT_JSON, '[]\n')
  console.log('[cms] DIRECTUS_URL ausente ou --skip: usando os posts locais (src/content/posts/*.js)')
  process.exit(0)
}

const headers = token ? { Authorization: `Bearer ${token}` } : {}

async function api(path) {
  const res = await fetch(`${baseUrl}${path}`, { headers })
  if (!res.ok) throw new Error(`[cms] ${res.status} em ${path}: ${await res.text()}`)
  return (await res.json()).data
}

async function downloadAsset(id, file, width) {
  const res = await fetch(`${baseUrl}/assets/${id}?width=${width}&format=webp&quality=82&withoutEnlargement=true`, { headers })
  if (!res.ok) throw new Error(`[cms] falha ao baixar a imagem ${id}: ${res.status}`)
  writeFileSync(resolve(IMG_DIR, file), Buffer.from(await res.arrayBuffer()))
  return `${IMG_URL}/${file}`
}

/** Baixa as imagens do corpo e devolve o HTML sanitizado, com os src apontando para o site */
async function cleanBody(html) {
  const local = new Map()
  for (const [, id] of html.matchAll(new RegExp(ASSET_RE, 'gi'))) {
    if (!local.has(id)) local.set(id, await downloadAsset(id, `${id}-body.webp`, 1600))
  }
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'hr', 'h2', 'h3', 'ul', 'ol', 'li', 'strong', 'b', 'em', 'i', 'a', 'blockquote', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
    allowedAttributes: { a: ['href', 'target', 'rel'], img: ['src', 'alt', 'width', 'height', 'loading'], th: ['colspan', 'rowspan'], td: ['colspan', 'rowspan'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      img: (tagName, attribs) => {
        const id = attribs.src?.match(ASSET_RE)?.[1]
        return { tagName, attribs: { ...attribs, src: id ? local.get(id) : attribs.src, loading: 'lazy' } }
      },
      a: (tagName, attribs) =>
        /^https?:/.test(attribs.href || '')
          ? { tagName, attribs: { href: attribs.href, target: '_blank', rel: 'noopener noreferrer' } }
          : { tagName, attribs: { href: attribs.href } },
    },
    exclusiveFilter: (frame) => frame.tag === 'p' && !frame.text.trim() && !frame.mediaChildren?.length,
  })
}

const text = (v) => String(v ?? '').trim()

/** Campo opcional por idioma; só entra no post se algum idioma tiver conteúdo */
function byLocale(it, read) {
  const value = { pt: read(it, 'pt'), en: read(it, 'en') }
  const filled = (v) => (Array.isArray(v) ? v.length : v)
  return filled(value.pt) || filled(value.en) ? value : undefined
}
const keyPoints = (it, l) => (it[`key_points_${l}`] ?? []).map((k) => text(k?.texto)).filter(Boolean)
const faq = (it, l) =>
  (it[`faq_${l}`] ?? []).map((f) => ({ q: text(f?.pergunta), a: text(f?.resposta) })).filter((f) => f.q && f.a)
const seo = (it) => {
  const title = byLocale(it, (x, l) => text(x[`seo_title_${l}`]))
  const description = byLocale(it, (x, l) => text(x[`seo_description_${l}`]))
  return title || description ? { title, description } : undefined
}

const items = await api('/items/posts?filter[status][_eq]=published&limit=-1&sort=-date')

rmSync(IMG_DIR, { recursive: true, force: true })
mkdirSync(IMG_DIR, { recursive: true })

const posts = []
for (const it of items) {
  const missing = REQUIRED.filter((f) => !String(it[f] ?? '').trim())
  if (missing.length || !CATEGORIES.includes(it.category)) {
    console.warn(`[cms] post "${it.title_pt || it.id}" ignorado: faltam ${missing.join(', ') || 'categoria válida'}`)
    continue
  }
  const post = {
    id: String(it.id),
    category: it.category,
    date: String(it.date).slice(0, 10),
    slug: { pt: it.slug_pt.trim(), en: it.slug_en.trim() },
    title: { pt: it.title_pt.trim(), en: it.title_en.trim() },
    excerpt: { pt: it.excerpt_pt.trim(), en: it.excerpt_en.trim() },
    body: { pt: await cleanBody(it.body_pt), en: await cleanBody(it.body_en) },
  }
  if (it.subtitle_pt || it.subtitle_en) post.subtitle = { pt: it.subtitle_pt || '', en: it.subtitle_en || '' }
  if (it.cover) post.cover = await downloadAsset(it.cover, `${it.cover}.webp`, 1200)
  if (it.updated) post.updated = String(it.updated).slice(0, 10)
  const extras = { keyPoints: byLocale(it, keyPoints), faq: byLocale(it, faq), seo: seo(it) }
  for (const [k, v] of Object.entries(extras)) if (v) post[k] = v
  posts.push(post)
}

const dupes = ['pt', 'en'].flatMap((l) => posts.map((p) => p.slug[l]).filter((s, i, all) => all.indexOf(s) !== i))
if (dupes.length) throw new Error(`[cms] slugs repetidos: ${[...new Set(dupes)].join(', ')}`)

writeFileSync(OUT_JSON, JSON.stringify(posts, null, 2) + '\n')
console.log(`[cms] ${posts.length} posts publicados -> src/content/posts/cms-posts.json`)
