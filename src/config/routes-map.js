// Mapa de rotas PT <-> EN. PT sem prefixo; EN sob /en com slugs traduzidos.
// Usado pelo router, pelo seletor de idioma, pelo hreflang e pelo sitemap.
import { POSTS } from '../content/posts/index.js'

export const PAGES = {
  home: { pt: '/', en: '/en' },
  about: { pt: '/sobre', en: '/en/about' },
  areas: { pt: '/areas-de-atuacao', en: '/en/practice-areas' },
  blog: { pt: '/blog', en: '/en/blog' },
  faq: { pt: '/perguntas-frequentes', en: '/en/faq' },
  contact: { pt: '/contato', en: '/en/contact' },
  // Link na bio do Instagram: página enxuta, fora do sitemap e com noindex
  bio: { pt: '/bio', en: '/en/bio' },
}

const NOT_IN_SITEMAP = ['bio']

export const postPath = (post, locale) => (locale === 'en' ? `/en/blog/${post.slug.en}` : `/blog/${post.slug.pt}`)

export function pathFor(key, locale, params = {}) {
  if (key === 'post') {
    const post = POSTS.find((p) => p.id === params.id)
    return post ? postPath(post, locale) : PAGES.blog[locale]
  }
  return PAGES[key]?.[locale] ?? PAGES.home[locale]
}

export function allRoutePairs() {
  return [
    ...Object.entries(PAGES)
      .filter(([key]) => !NOT_IN_SITEMAP.includes(key))
      .map(([, { pt, en }]) => ({ pt, en })),
    ...POSTS.map((p) => ({ pt: postPath(p, 'pt'), en: postPath(p, 'en'), date: p.updated || p.date })),
  ]
}
