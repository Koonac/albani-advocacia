// Links padrão da página /bio e ícones aceitos. Separado de bio.js (que lê o JSON do CMS) para o
// deploy/directus/setup.mjs poder importar e gravar estes links no painel na 1ª vez.
import { CONTACT } from '../config/site.js'

// url "agendar" = mesmo destino dos botões "Agendar consulta" do site (agenda ou WhatsApp).
// url "whatsapp" = WhatsApp de Portugal com a mensagem padrão do idioma da página.
export const BIO_DEFAULT_LINKS = [
  { label: { pt: 'Agendar consulta', en: 'Book a consultation' }, url: 'agendar', icon: 'agenda', featured: true },
  { label: { pt: 'Falar no WhatsApp', en: 'Chat on WhatsApp' }, url: 'whatsapp', icon: 'whatsapp', featured: false },
  { label: { pt: 'Conheça o escritório', en: 'About the firm' }, url: '/', icon: 'site', featured: false },
  { label: { pt: 'Artigos e guias', en: 'Articles and guides' }, url: '/blog', icon: 'blog', featured: false },
  { label: { pt: 'Vídeos no YouTube', en: 'Videos on YouTube' }, url: CONTACT.youtube, icon: 'youtube', featured: false },
  { label: { pt: 'Como chegar', en: 'Directions' }, url: CONTACT.googleMaps, icon: 'localizacao', featured: false },
]

// Ícones que o painel oferece (valor no CMS -> símbolo do sprite)
export const BIO_ICONS = {
  agenda: 'calendar',
  whatsapp: 'whatsapp',
  site: 'globe',
  blog: 'article',
  instagram: 'instagram',
  youtube: 'youtube',
  facebook: 'facebook',
  linkedin: 'linkedin',
  google: 'google',
  localizacao: 'pin',
  email: 'mail',
  estrela: 'star',
  link: 'arrow',
}
