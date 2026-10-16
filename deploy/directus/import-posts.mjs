// Importa para o Directus os posts que hoje estão em src/content/posts/*.js.
// Não duplica: pula os posts cujo slug PT já existe no CMS.
import { readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { api, findOne, login } from './lib.mjs'

const POSTS_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../../src/content/posts')
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toHtml = (paragraphs) => paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('\n')

await login()

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.js') && f !== 'index.js')
let created = 0
for (const file of files) {
  const { default: post } = await import(pathToFileURL(join(POSTS_DIR, file)).href)
  if (await findOne('/items/posts', { slug_pt: post.slug.pt })) {
    console.log(`já existe: ${post.slug.pt}`)
    continue
  }
  await api('POST', '/items/posts', {
    status: 'published',
    date: post.date,
    category: post.category,
    title_pt: post.title.pt,
    title_en: post.title.en,
    subtitle_pt: post.subtitle?.pt ?? null,
    subtitle_en: post.subtitle?.en ?? null,
    slug_pt: post.slug.pt,
    slug_en: post.slug.en,
    excerpt_pt: post.excerpt.pt,
    excerpt_en: post.excerpt.en,
    body_pt: toHtml(post.body.pt),
    body_en: toHtml(post.body.en),
  })
  created++
  console.log(`importado: ${post.slug.pt}`)
}
console.log(`\n${created} posts importados. O Flow vai disparar um rebuild do site.`)
