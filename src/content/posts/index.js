// Os artigos vêm do CMS (Directus): `scripts/fetch-posts.mjs` roda antes do dev/build e grava
// os posts publicados em `cms-posts.json` (fora do git). Se o arquivo estiver vazio, porque o
// build foi feito sem CMS, valem os arquivos JS desta pasta (formato: id, category, date,
// slug.pt/en, title.pt/en, excerpt.pt/en, body.pt/en = lista de parágrafos).
// O build gera automaticamente a página PT e EN de cada artigo e atualiza o sitemap.
import cmsPosts from './cms-posts.json'
import goldenVisa from './golden-visa-portugal.js'
import aima from './processo-parado-aima.js'
import carta from './troca-carta-conducao.js'
import apostila from './apostila-de-haia.js'
import empresa from './abrir-empresa-portugal.js'
import netos from './nacionalidade-netos.js'
import d7d8 from './visto-d7-ou-d8.js'
import holding from './holding-portugal.js'

export const CATEGORIES = [
  { id: 'imigracao', pt: 'Imigração', en: 'Immigration' },
  { id: 'nacionalidade', pt: 'Nacionalidade', en: 'Nationality' },
  { id: 'documentos', pt: 'Documentos', en: 'Documents' },
  { id: 'empresas', pt: 'Empresas', en: 'Business' },
  { id: 'investimento', pt: 'Investimento', en: 'Investment' },
]

export const LOCAL_POSTS = [goldenVisa, aima, carta, apostila, empresa, netos, d7d8, holding]

export const POSTS = [...(cmsPosts.length ? cmsPosts : LOCAL_POSTS)].sort((a, b) => b.date.localeCompare(a.date))

export const categoryLabel = (id, locale) => CATEGORIES.find((c) => c.id === id)?.[locale] ?? id

export const COVER_BY_CATEGORY = {
  imigracao: '/img/blog/cover-imigracao.svg',
  nacionalidade: '/img/blog/cover-nacionalidade.svg',
  documentos: '/img/blog/cover-documentos.svg',
  empresas: '/img/blog/cover-empresas.svg',
  investimento: '/img/blog/cover-investimento.svg',
}

/** Capa do card: `post.cover` opcional, senão arte por categoria */
export const coverFor = (post) => post.cover || COVER_BY_CATEGORY[post.category] || COVER_BY_CATEGORY.imigracao

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Corpo em HTML: posts do CMS já vêm em HTML sanitizado; posts locais são listas de parágrafos */
export const bodyHtml = (post, locale) => {
  const body = post.body[locale]
  return Array.isArray(body) ? body.map((p) => `<p>${escapeHtml(p)}</p>`).join('') : body
}

export const readingMinutes = (post, locale) => {
  const text = bodyHtml(post, locale).replace(/<[^>]+>/g, ' ')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 180))
}

export const findPostBySlug = (slug, locale) => POSTS.find((p) => p.slug[locale] === slug)
