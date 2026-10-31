// Busca no Directus as configurações do site (coleção singleton `pagina_inicial`, no painel
// "Configurações do site") e grava src/content/home-cms.json, que o site lê no build:
// - vídeo da home: a miniatura (capa enviada no CMS ou, sem ela, a do próprio YouTube) é gerada
//   em public/img/cms/, para nada carregar do YouTube antes do clique. Com o vídeo padrão e sem
//   capa, fica fora do JSON e vale a miniatura local de public/img/.
// - outros vídeos (`videos_extras`): miniaturas também geradas em public/img/cms/; só os itens
//   com link aparecem no site.
// - avaliações do Google: nota, total e depoimentos (PT/EN) do carrossel.
// - botão "Agendar consulta": `bookingUrl` vazio = WhatsApp; com link = página de agendamento.
//   Sem CMS, a chave fica fora do JSON e vale CONTACT.bookingUrl (src/config/site.js).
//
// Variáveis: DIRECTUS_URL e DIRECTUS_TOKEN (as mesmas do fetch-posts). `--skip` ignora o CMS.
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { CONTACT } from '../src/config/site.js'

const OUT_JSON = resolve('src/content/home-cms.json')
const IMG_DIR = resolve('public/img/cms')
const IMG_URL = '/img/cms'
const VIDEO_ID_RE = /(?:[?&]v=|youtu\.be\/|\/(?:shorts|embed|live)\/)([A-Za-z0-9_-]{11})/

const baseUrl = process.env.DIRECTUS_URL?.replace(/\/$/, '')
const token = process.env.DIRECTUS_TOKEN
const headers = token ? { Authorization: `Bearer ${token}` } : {}

function done(data, ...msgs) {
  writeFileSync(OUT_JSON, JSON.stringify(data, null, 2) + '\n')
  for (const msg of msgs) console.log(`[cms] ${msg}`)
  process.exit(0)
}

rmSync(IMG_DIR, { recursive: true, force: true })

if (!baseUrl || process.argv.includes('--skip')) done({}, 'configurações do site: padrão (sem CMS)')

const res = await fetch(`${baseUrl}/items/pagina_inicial`, { headers })
// Antes do setup.mjs criar a coleção, o build segue com o padrão
if (res.status === 403 || res.status === 404) done({}, `configurações do site: coleção indisponível (${res.status}), padrão`)
if (!res.ok) throw new Error(`[cms] ${res.status} em /items/pagina_inicial: ${await res.text()}`)
const home = (await res.json()).data ?? {}

function booking() {
  if (home.cta_tipo !== 'agenda') return { url: '', msg: 'botão de agendar: WhatsApp' }
  const url = home.cta_link?.trim() ?? ''
  // Link ausente ou inválido não pode quebrar os botões do site: volta para o WhatsApp
  if (!/^https:\/\/\S+$/.test(url)) return { url: '', msg: `botão de agendar: link inválido ("${url}"), usando WhatsApp` }
  return { url, msg: `botão de agendar: ${url}` }
}

// Falha de rede conta como "sem imagem": um YouTube fora do ar não pode impedir a publicação do site
async function download(url, init) {
  try {
    const r = await fetch(url, init)
    return r.ok ? Buffer.from(await r.arrayBuffer()) : null
  } catch {
    return null
  }
}

async function video() {
  const videoId = home.video_url?.match(VIDEO_ID_RE)?.[1]
  if (!videoId) {
    if (home.video_url) console.warn(`[cms] link do vídeo inválido ("${home.video_url}"): usando o vídeo padrão`)
    return { data: {}, msg: 'página inicial: vídeo padrão' }
  }
  if (videoId === CONTACT.videoId && !home.video_capa) return { data: {}, msg: 'página inicial: vídeo padrão' }

  // maxresdefault não existe em vídeos antigos ou de baixa resolução; hqdefault (4:3) sempre existe
  const source = home.video_capa
    ? await download(`${baseUrl}/assets/${home.video_capa}?width=1600&format=jpg&withoutEnlargement=true`, { headers })
    : (await download(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)) ?? (await download(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`))
  if (!source) throw new Error(`[cms] não foi possível baixar a miniatura do vídeo ${videoId}`)

  // Nome muda junto com o vídeo/capa, para o cache do navegador não mostrar a miniatura antiga
  const name = `video-thumb-${home.video_capa ? home.video_capa.slice(0, 8) : videoId}`
  await writeThumbs(source, name)
  return { data: { videoId, thumb: `${IMG_URL}/${name}` }, msg: `página inicial: vídeo ${videoId}` }
}

async function writeThumbs(source, name) {
  mkdirSync(IMG_DIR, { recursive: true })
  for (const [w, h] of [[640, 360], [1280, 720]]) {
    const img = sharp(source).resize(w, h, { fit: 'cover' })
    await img.clone().webp({ quality: 80 }).toFile(resolve(IMG_DIR, `${name}-${w}.webp`))
    await img.clone().avif({ quality: 55 }).toFile(resolve(IMG_DIR, `${name}-${w}.avif`))
  }
}

// "Outros vídeos": miniaturas abaixo do vídeo principal. Título em branco = o do YouTube (oEmbed).
// Item sem link não aparece. Link inválido, igual ao vídeo principal, repetido ou vídeo
// indisponível (privado/removido) é ignorado com aviso, sem quebrar o build.
async function extraVideos(mainId) {
  const seen = new Set([mainId ?? CONTACT.videoId])
  const videos = []
  for (const item of Array.isArray(home.videos_extras) ? home.videos_extras : []) {
    if (!item?.url?.trim()) continue
    const id = item.url.match(VIDEO_ID_RE)?.[1]
    if (!id) {
      console.warn(`[cms] outro vídeo com link inválido ("${item?.url ?? ''}"): ignorado`)
      continue
    }
    if (seen.has(id)) {
      console.warn(`[cms] outro vídeo ${id}: igual ao vídeo principal ou repetido na lista, ignorado`)
      continue
    }
    seen.add(id)
    const source = (await download(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)) ?? (await download(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`))
    if (!source) {
      console.warn(`[cms] outro vídeo ${id}: miniatura indisponível, ignorado`)
      continue
    }
    await writeThumbs(source, `video-thumb-${id}`)
    videos.push({ id, title: await videoTitle(id, item.titulo), thumb: `${IMG_URL}/video-thumb-${id}` })
  }
  return { data: videos.length ? { videos } : {}, msg: `página inicial: ${videos.length} outro(s) vídeo(s)` }
}

async function videoTitle(id, custom) {
  if (custom?.trim()) return custom.trim()
  try {
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`)
    return r.ok ? (await r.json()).title : ''
  } catch {
    return ''
  }
}

// Avaliações do Google: nota/total inválidos ou vazios ficam fora do JSON (vale CONTACT.rating);
// depoimentos sem nome ou sem texto em PT são ignorados; sem nenhum, valem os da copy.
function reviews() {
  const data = {}
  const value = Number(home.avaliacoes_nota)
  const count = Number(home.avaliacoes_total)
  if (home.avaliacoes_nota != null && value >= 1 && value <= 5 && Number.isInteger(count) && count > 0) {
    data.rating = { value: value.toFixed(1), count }
  }
  const items = (Array.isArray(home.depoimentos) ? home.depoimentos : [])
    .filter((d) => d?.autor?.trim() && d?.texto_pt?.trim())
    .map((d) => ({ author: d.autor.trim(), pt: d.texto_pt.trim(), en: d.texto_en?.trim() ?? '' }))
  if (items.length) data.reviews = items
  const rating = data.rating ? `${data.rating.value} (${data.rating.count})` : 'padrão'
  return { data, msg: `avaliações: nota ${rating}, ${items.length || 'padrão'} depoimento(s)` }
}

const cta = booking()
const vid = await video()
const extras = await extraVideos(vid.data.videoId)
const rev = reviews()
done({ ...vid.data, ...extras.data, ...rev.data, bookingUrl: cta.url }, vid.msg, extras.msg, rev.msg, cta.msg)
