// Blog sem banco de dados: cada artigo é um arquivo JS nesta pasta.
// Para adicionar um artigo: crie um novo arquivo seguindo o formato de qualquer post existente
// (id, category, date, slug.pt/en, title.pt/en, excerpt.pt/en, body.pt/en = lista de parágrafos)
// e importe-o abaixo. O build gera automaticamente a página PT e EN e atualiza o sitemap.
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

export const POSTS = [goldenVisa, aima, carta, apostila, empresa, netos, d7d8, holding].sort((a, b) =>
  b.date.localeCompare(a.date),
)

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

export const readingMinutes = (post, locale) => {
  const words = post.body[locale].join(' ').split(/\s+/).length
  return Math.max(1, Math.ceil(words / 180))
}

export const findPostBySlug = (slug, locale) => POSTS.find((p) => p.slug[locale] === slug)
