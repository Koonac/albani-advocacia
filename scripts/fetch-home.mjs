// Busca no Directus o vídeo da página inicial (coleção singleton `pagina_inicial`) e grava
// src/content/home-cms.json, que o site lê no build. A miniatura (capa enviada no CMS ou, sem
// ela, a do próprio YouTube) é gerada em public/img/cms/, para nada carregar do YouTube antes do clique.
// Com o vídeo padrão e sem capa, o JSON fica vazio e vale a miniatura local de public/img/.
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

function done(data, msg) {
  writeFileSync(OUT_JSON, JSON.stringify(data, null, 2) + '\n')
  console.log(`[cms] ${msg}`)
  process.exit(0)
}

rmSync(IMG_DIR, { recursive: true, force: true })

if (!baseUrl || process.argv.includes('--skip')) done({}, 'página inicial: vídeo padrão (sem CMS)')

const res = await fetch(`${baseUrl}/items/pagina_inicial`, { headers })
// Antes do setup.mjs criar a coleção, o build segue com o vídeo padrão
if (res.status === 403 || res.status === 404) done({}, `página inicial: coleção indisponível (${res.status}), vídeo padrão`)
if (!res.ok) throw new Error(`[cms] ${res.status} em /items/pagina_inicial: ${await res.text()}`)
const home = (await res.json()).data ?? {}

const videoId = home.video_url?.match(VIDEO_ID_RE)?.[1]
if (!videoId) {
  if (home.video_url) console.warn(`[cms] link do vídeo inválido ("${home.video_url}"): usando o vídeo padrão`)
  done({}, 'página inicial: vídeo padrão')
}
if (videoId === CONTACT.videoId && !home.video_capa) done({}, 'página inicial: vídeo padrão')

async function download(url, init) {
  const r = await fetch(url, init)
  return r.ok ? Buffer.from(await r.arrayBuffer()) : null
}

// maxresdefault não existe em vídeos antigos ou de baixa resolução; hqdefault (4:3) sempre existe
const source = home.video_capa
  ? await download(`${baseUrl}/assets/${home.video_capa}?width=1600&format=jpg&withoutEnlargement=true`, { headers })
  : (await download(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)) ?? (await download(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`))
if (!source) throw new Error(`[cms] não foi possível baixar a miniatura do vídeo ${videoId}`)

// Nome muda junto com o vídeo/capa, para o cache do navegador não mostrar a miniatura antiga
const name = `video-thumb-${home.video_capa ? home.video_capa.slice(0, 8) : videoId}`
mkdirSync(IMG_DIR, { recursive: true })
for (const [w, h] of [[640, 360], [1280, 720]]) {
  const img = sharp(source).resize(w, h, { fit: 'cover' })
  await img.clone().webp({ quality: 80 }).toFile(resolve(IMG_DIR, `${name}-${w}.webp`))
  await img.clone().avif({ quality: 55 }).toFile(resolve(IMG_DIR, `${name}-${w}.avif`))
}

done({ videoId, thumb: `${IMG_URL}/${name}` }, `página inicial: vídeo ${videoId}`)
