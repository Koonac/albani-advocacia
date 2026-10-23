import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { SITE_URL, CONTACT, GOOGLE_SITE_VERIFICATION } from '../config/site.js'
import { pathFor } from '../config/routes-map.js'
import { RATING } from '../content/home.js'
import { useSite } from './useSite.js'

// Open Graph fica em JPG: WhatsApp, LinkedIn e alguns leitores de link não mostram prévia em WebP
export const OG_IMAGE = `${SITE_URL}/img/og-albani.jpg`

// Temas de atuação (schema.org knowsAbout): ajudam buscadores e IAs a associar o escritório às buscas
const KNOWS_ABOUT = {
  pt: [
    'Imigração para Portugal',
    'Vistos para Portugal',
    'Visto D7',
    'Visto D8 (nómadas digitais)',
    'Autorização de residência em Portugal',
    'Nacionalidade portuguesa',
    'Reagrupamento familiar',
    'Processos na AIMA',
    'Golden Visa (ARI)',
    'Apostila de Haia',
    'Abertura de empresas em Portugal',
    'Direito empresarial e societário',
  ],
  en: [
    'Immigration to Portugal',
    'Portugal visas',
    'D7 visa',
    'D8 digital nomad visa',
    'Portugal residence permit',
    'Portuguese citizenship',
    'Family reunification',
    'AIMA cases',
    'Golden Visa (ARI)',
    'Hague apostille',
    'Company formation in Portugal',
    'Corporate law',
  ],
}

// JSON-LD do site (WebSite) + escritório (LegalService) + advogado (Person/Attorney)
export function orgJsonLd(locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Albani Advocacia',
        inLanguage: ['pt', 'en'],
        publisher: { '@id': `${SITE_URL}/#office` },
      },
      {
        '@type': ['LegalService', 'Attorney'],
        '@id': `${SITE_URL}/#office`,
        name: 'Albani Advocacia',
        url: `${SITE_URL}${pathFor('home', locale)}`,
        logo: `${SITE_URL}/img/logo-simbolo.png`,
        image: OG_IMAGE,
        email: CONTACT.email,
        telephone: '+351931759247',
        priceRange: '€€',
        address: {
          '@type': 'PostalAddress',
          streetAddress: CONTACT.address.street,
          postalCode: CONTACT.address.postalCode,
          addressLocality: CONTACT.address.locality,
          addressCountry: 'PT',
        },
        areaServed: [
          { '@type': 'Country', name: 'Portugal' },
          { '@type': 'Country', name: 'Brasil' },
          { '@type': 'Country', name: 'United States' },
        ],
        description:
          locale === 'en'
            ? 'Lawyer in Portugal for Brazilians, admitted to the Portuguese Bar (OA) and the Brazilian Bar (OAB): visas, residence permits, Portuguese citizenship and companies.'
            : 'Advogado em Portugal para brasileiros, inscrito na Ordem dos Advogados (OA) e na OAB: vistos, autorização de residência, nacionalidade portuguesa e empresas.',
        // Público principal: brasileiros que moram ou querem morar/empreender em Portugal
        audience: {
          '@type': 'Audience',
          audienceType: locale === 'en' ? 'Brazilians living in or moving to Portugal' : 'Brasileiros que vivem ou querem viver em Portugal',
          geographicArea: [
            { '@type': 'Country', name: 'Brasil' },
            { '@type': 'Country', name: 'Portugal' },
          ],
        },
        knowsLanguage: ['pt-BR', 'pt-PT', 'en'],
        knowsAbout: KNOWS_ABOUT[locale] ?? KNOWS_ABOUT.pt,
        hasMap: CONTACT.googleMaps,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: RATING.value,
          reviewCount: RATING.count,
          bestRating: '5',
          worstRating: '1',
        },
        sameAs: [CONTACT.instagram, CONTACT.facebook, CONTACT.youtube, CONTACT.googleMaps],
        founder: { '@id': `${SITE_URL}/#ivan` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#ivan`,
        name: 'Ivan Albani',
        honorificPrefix: 'Dr.',
        jobTitle: locale === 'en' ? 'Lawyer in Portugal for Brazilians' : 'Advogado em Portugal para brasileiros',
        knowsLanguage: ['pt-BR', 'pt-PT', 'en'],
        email: CONTACT.emailOrdem,
        worksFor: { '@id': `${SITE_URL}/#office` },
        image: `${SITE_URL}/img/dr-ivan-busto-760.webp`,
        url: `${SITE_URL}${pathFor('about', locale)}`,
        knowsAbout: KNOWS_ABOUT[locale] ?? KNOWS_ABOUT.pt,
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', name: 'Ordem dos Advogados, Cédula Profissional 67498E' },
          { '@type': 'EducationalOccupationalCredential', name: 'OAB/SC 62.722' },
        ],
      },
    ],
  }
}

/**
 * Head por página e idioma: title, description, keywords, robots, canonical, hreflang (pt/en/x-default),
 * Open Graph, Twitter e JSON-LD opcional. title/description/keywords não informados vêm de
 * `meta[key]` da copy (src/content/site.{pt,en}.js).
 * @param {() => {key:string, params?:object, title?:string, description?:string, keywords?:string, type?:string, published?:string, section?:string, jsonLd?:object, image?:string}} getter
 */
export function useSeo(getter) {
  const { c, locale } = useSite()
  const s = computed(() => {
    const page = getter()
    return { ...c.value.meta[page.key], ...page }
  })
  const url = (loc) => `${SITE_URL}${pathFor(s.value.key, loc, s.value.params)}`
  const image = () => s.value.image ?? OG_IMAGE
  const isArticle = () => s.value.type === 'article'

  useHead({
    htmlAttrs: { lang: () => (locale.value === 'en' ? 'en' : 'pt') },
    title: () => s.value.title,
    meta: [
      { name: 'description', content: () => s.value.description },
      { name: 'keywords', content: () => s.value.keywords },
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'author', content: 'Dr. Ivan Albani' },
      ...(GOOGLE_SITE_VERIFICATION ? [{ name: 'google-site-verification', content: GOOGLE_SITE_VERIFICATION }] : []),
      { property: 'og:site_name', content: 'Albani Advocacia' },
      { property: 'og:type', content: () => s.value.type ?? 'website' },
      { property: 'og:title', content: () => s.value.title },
      { property: 'og:description', content: () => s.value.description },
      { property: 'og:url', content: () => url(locale.value) },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: () => s.value.title },
      { property: 'og:locale', content: () => (locale.value === 'en' ? 'en_US' : 'pt_BR') },
      { property: 'og:locale:alternate', content: () => (locale.value === 'en' ? 'pt_BR' : 'en_US') },
      { property: 'article:published_time', content: () => (isArticle() ? s.value.published : undefined) },
      { property: 'article:section', content: () => (isArticle() ? s.value.section : undefined) },
      { property: 'article:author', content: () => (isArticle() ? `${SITE_URL}${pathFor('about', locale.value)}` : undefined) },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: () => s.value.title },
      { name: 'twitter:description', content: () => s.value.description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: () => url(locale.value) },
      { rel: 'alternate', hreflang: 'pt', href: () => url('pt') },
      { rel: 'alternate', hreflang: 'en', href: () => url('en') },
      { rel: 'alternate', hreflang: 'x-default', href: () => url('pt') },
    ],
    script: [
      {
        type: 'application/ld+json',
        key: 'ld-page',
        innerHTML: () => JSON.stringify(s.value.jsonLd ?? orgJsonLd(locale.value)),
      },
    ],
  })
}
