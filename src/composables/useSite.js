import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import pt from '../content/site.pt.js'
import en from '../content/site.en.js'
import { waLink, CONTACT } from '../config/site.js'
import { pathFor } from '../config/routes-map.js'

const CONTENT = { pt, en }

export function useSite() {
  const { locale, d } = useI18n({ useScope: 'global' })
  const c = computed(() => CONTENT[locale.value] ?? pt)
  const lp = (key, params) => pathFor(key, locale.value, params)
  const wa = (text) => waLink(text ?? c.value.whatsappDefault)
  const waService = (service) => waLink(c.value.whatsappService + service)
  // "Agendar consulta": Google Calendar quando houver link configurado; senão, WhatsApp
  const hasBooking = !!CONTACT.bookingUrl
  const book = () => CONTACT.bookingUrl || wa()
  const bookService = (service) => CONTACT.bookingUrl || waService(service)
  const formatDate = (iso) => d(new Date(`${iso}T12:00:00Z`), 'long')
  return { c, locale, lp, wa, waService, book, bookService, hasBooking, formatDate }
}
