// Configuração central do site.
// Domínio usado em canonical, hreflang, Open Graph e sitemap. No deploy vem de VITE_SITE_URL
// (deploy/.env); lido via process.env no Node (vite.config e pré-renderização) e via
// import.meta.env no bundle do navegador, para os dois lados gerarem o mesmo valor.
export const SITE_URL = (
  (typeof process !== 'undefined' && process.env.VITE_SITE_URL) ||
  (import.meta.env && import.meta.env.VITE_SITE_URL) ||
  'https://albaniadv.com'
).replace(/\/$/, '')

export const CONTACT = {
  whatsappPT: '351931759247',
  whatsappPTLabel: '+351 931 759 247',
  whatsappBR: '5548984586987',
  whatsappBRLabel: '+55 48 98458-6987',
  email: 'juridico@albaniadv.com',
  emailOrdem: 'ivanalbani-67498e@adv.oa.pt',
  instagram: 'https://www.instagram.com/albaniadvocacia/',
  instagramHandle: '@albaniadvocacia',
  youtube: 'https://www.youtube.com/@AlbaniAdvocacia',
  // ATENÇÃO: URL do Facebook não confirmada (deduzida do usuário do Instagram). Confirmar com o cliente.
  facebook: 'https://www.facebook.com/albaniadvocacia',
  facebookHandle: '/albaniadvocacia',
  // Link de agendamento do Google Calendar (página de "Agendamento de horários" do Google Agenda).
  // Enquanto estiver vazio, os botões "Agendar consulta" caem no WhatsApp.
  // Com o CMS ligado, vale a escolha de "Configurações do site" no painel (src/content/home.js).
  bookingUrl: '',
  // Ficha do escritório no Google Maps (CID extraído do link das avaliações)
  googleMaps: 'https://maps.google.com/?cid=15702313322506232491',
  googleReviews: 'https://www.google.com/search?q=Albani+Advocacia#lrd=0xd1941a55ddc5053:0xd9e9d2c5bbde22ab,1,,,,',
  address: {
    street: 'Estrada Nacional 379, Hab. 1, São Julião',
    postalCode: '2950-302',
    locality: 'Palmela',
    country: 'Portugal',
    full: 'Estrada Nacional 379, Hab. 1, São Julião, 2950-302 Palmela, Portugal',
  },
  rating: { value: '5.0', count: 46 },
  videoId: 'hMMvhygn3bs',
}

export const waLink = (text, number = CONTACT.whatsappPT) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`

// Embed pela ficha do Google (nome + endereço) para o marcador cair no escritório, com zoom de rua
export const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`Albani Advocacia, ${CONTACT.address.full}`)}&z=17&output=embed`
