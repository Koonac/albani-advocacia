// vue-i18n: guarda o idioma ativo (definido pela rota: /en/* = EN, resto = PT) e formata datas.
// A copy completa vive em src/content/site.{pt,en}.js e é lida por useSite(); assim textos com
// "@", "{" ou "|" (e-mails, etc.) não colidem com a sintaxe de mensagens do vue-i18n.
import { createI18n } from 'vue-i18n'

export const LOCALES = ['pt', 'en']
export const localeFromPath = (path) => (path === '/en' || path.startsWith('/en/') ? 'en' : 'pt')

export function createSiteI18n() {
  return createI18n({
    legacy: false,
    locale: 'pt',
    fallbackLocale: 'pt',
    messages: { pt: {}, en: {} },
    datetimeFormats: {
      pt: { long: { year: 'numeric', month: 'long', day: 'numeric' } },
      en: { long: { year: 'numeric', month: 'long', day: 'numeric' } },
    },
  })
}
