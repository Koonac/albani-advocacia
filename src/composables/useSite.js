import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import pt from '../content/site.pt.js'
import en from '../content/site.en.js'
import { waLink } from '../config/site.js'
import { BOOKING_URL, RATING } from '../content/home.js'
import { pathFor } from '../config/routes-map.js'

const CONTENT = { pt, en }

export function useSite() {
  const { locale, d } = useI18n({ useScope: 'global' })
  const c = computed(() => CONTENT[locale.value] ?? pt)
  const lp = (key, params) => pathFor(key, locale.value, params)
  const wa = (text) => waLink(text ?? c.value.whatsappDefault)
  const waService = (service) => waLink(c.value.whatsappService + service)
  // "Agendar consulta": link de agendamento quando configurado (CMS ou config/site.js); senão, WhatsApp
  const hasBooking = !!BOOKING_URL
  const book = () => BOOKING_URL || wa()
  const bookService = (service) => BOOKING_URL || waService(service)
  const formatDate = (iso) => d(new Date(`${iso}T12:00:00Z`), 'long')
  // Textos com {nota}/{total} das avaliações do Google (CMS): "5,0" em PT, "5.0" em EN
  const rating = (text) =>
    text
      .replace('{nota}', locale.value === 'pt' ? RATING.value.replace('.', ',') : RATING.value)
      .replace('{total}', String(RATING.count))
  return { c, locale, lp, wa, waService, book, bookService, hasBooking, formatDate, rating }
}
