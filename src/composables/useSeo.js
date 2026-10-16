import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { SITE_URL, CONTACT } from '../config/site.js'
import { pathFor } from '../config/routes-map.js'
import { useSite } from './useSite.js'

const OG_IMAGE = `${SITE_URL}/img/og-albani.jpg`

// JSON-LD do escritório (LegalService) + advogado (Person/Attorney)
export function orgJsonLd(locale) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
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
        knowsLanguage: ['pt', 'en'],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: CONTACT.rating.value,
          reviewCount: CONTACT.rating.count,
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
        jobTitle: locale === 'en' ? 'Lawyer' : 'Advogado',
        email: CONTACT.emailOrdem,
        worksFor: { '@id': `${SITE_URL}/#office` },
        image: `${SITE_URL}/img/dr-ivan-busto-760.webp`,
        hasCredential: [
          { '@type': 'EducationalOccupationalCredential', name: 'Ordem dos Advogados, Cédula Profissional 67498E' },
          { '@type': 'EducationalOccupationalCredential', name: 'OAB/SC 62.722' },
        ],
      },
    ],
  }
}

/**
 * Head por página e idioma: title, description, canonical, hreflang (pt/en/x-default), Open Graph,
 * Twitter e JSON-LD opcional.
 * @param {() => {key:string, params?:object, title:string, description:string, type?:string, jsonLd?:object, image?:string}} getter
 */
export function useSeo(getter) {
  const { locale } = useSite()
  const s = computed(getter)
  const url = (loc) => `${SITE_URL}${pathFor(s.value.key, loc, s.value.params)}`

  useHead({
    htmlAttrs: { lang: () => (locale.value === 'en' ? 'en' : 'pt') },
    title: () => s.value.title,
    meta: [
      { name: 'description', content: () => s.value.description },
      { property: 'og:site_name', content: 'Albani Advocacia' },
      { property: 'og:type', content: () => s.value.type ?? 'website' },
      { property: 'og:title', content: () => s.value.title },
      { property: 'og:description', content: () => s.value.description },
      { property: 'og:url', content: () => url(locale.value) },
      { property: 'og:image', content: () => s.value.image ?? OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:locale', content: () => (locale.value === 'en' ? 'en_US' : 'pt_BR') },
      { property: 'og:locale:alternate', content: () => (locale.value === 'en' ? 'pt_BR' : 'en_US') },
      { name: 'twitter:card', content: 'summary_large_image' },
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
