// Vídeo da página inicial: editável no CMS (Directus, "Página inicial"). `scripts/fetch-home.mjs`
// roda antes do dev/build e grava `home-cms.json` (fora do git); vazio, vale o padrão de config/site.js.
import cms from './home-cms.json'
import { CONTACT } from '../config/site.js'

export const HOME_VIDEO = {
  id: cms.videoId || CONTACT.videoId,
  // prefixo das miniaturas: <thumb>-640/-1280 em .avif e .webp
  thumb: cms.thumb || '/img/video-thumb',
}
