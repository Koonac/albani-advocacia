// Configurações editáveis no CMS (Directus, "Configurações do site"). `scripts/fetch-home.mjs`
// roda antes do dev/build e grava `home-cms.json` (fora do git); o que faltar nele usa o padrão
// de config/site.js.
import cms from './home-cms.json'
import { CONTACT } from '../config/site.js'

export const HOME_VIDEO = {
  id: cms.videoId || CONTACT.videoId,
  // prefixo das miniaturas: <thumb>-640/-1280 em .avif e .webp
  thumb: cms.thumb || '/img/video-thumb',
}

// Outros vídeos (miniaturas abaixo do principal): [{ id, title, thumb }]
export const HOME_VIDEOS = cms.videos || []

// Destino dos botões "Agendar consulta": link de agendamento, ou '' para usar o WhatsApp.
// Com o CMS, a escolha dele vale mesmo quando é o WhatsApp ('' no JSON).
export const BOOKING_URL = 'bookingUrl' in cms ? cms.bookingUrl : CONTACT.bookingUrl
