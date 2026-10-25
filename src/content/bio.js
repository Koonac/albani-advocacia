// Página /bio (link na bio do Instagram), editável no CMS (Directus, "Link na bio").
// `scripts/fetch-bio.mjs` roda antes do dev/build e grava `bio-cms.json` (fora do git); sem CMS,
// valem os links padrão de bio-links.js.
import cms from './bio-cms.json'
import { BIO_DEFAULT_LINKS } from './bio-links.js'

export { BIO_ICONS } from './bio-links.js'

export const BIO = {
  // Nome no topo: vazio = o da copy (site.pt/en.js -> bio)
  title: cms.title || '',
  links: cms.links?.length ? cms.links : BIO_DEFAULT_LINKS,
  showPosts: cms.showPosts ?? true,
}
