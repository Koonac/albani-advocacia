// Busca no Directus a página "Link na bio" (coleção singleton `link_bio`) e grava
// src/content/bio-cms.json, que o site lê no build (src/content/bio.js). Sem CMS, ou antes de o
// setup.mjs criar a coleção, o JSON fica vazio e valem os links padrão.
//
// Variáveis: DIRECTUS_URL e DIRECTUS_TOKEN (as mesmas do fetch-posts). `--skip` ignora o CMS.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const OUT_JSON = resolve('src/content/bio-cms.json')
// Destinos aceitos: palavras especiais, páginas do site (/...), http(s), e-mail e telefone
const URL_RE = /^(agendar|whatsapp|\/\S*|https?:\/\/\S+|mailto:\S+|tel:\S+)$/

const baseUrl = process.env.DIRECTUS_URL?.replace(/\/$/, '')
const token = process.env.DIRECTUS_TOKEN
const headers = token ? { Authorization: `Bearer ${token}` } : {}

function done(data, msg) {
  writeFileSync(OUT_JSON, JSON.stringify(data, null, 2) + '\n')
  console.log(`[cms] ${msg}`)
  process.exit(0)
}

if (!baseUrl || process.argv.includes('--skip')) done({}, 'link na bio: padrão (sem CMS)')

const res = await fetch(`${baseUrl}/items/link_bio`, { headers })
if (res.status === 403 || res.status === 404) done({}, `link na bio: coleção indisponível (${res.status}), padrão`)
if (!res.ok) throw new Error(`[cms] ${res.status} em /items/link_bio: ${await res.text()}`)
const bio = (await res.json()).data ?? {}

const text = (v) => String(v ?? '').trim()

// Link sem texto ou com destino inválido é ignorado com aviso, sem quebrar o build
const links = []
for (const item of Array.isArray(bio.links) ? bio.links : []) {
  const label = text(item?.rotulo_pt)
  const url = text(item?.url)
  if (!label && !url) continue
  if (!label || !URL_RE.test(url)) {
    console.warn(`[cms] link na bio "${label || url}" ignorado: falta o texto ou o destino é inválido`)
    continue
  }
  links.push({ label: { pt: label, en: text(item.rotulo_en) || label }, url, icon: text(item.icone) || 'link', featured: !!item.destaque })
}

const data = { links, showPosts: bio.mostrar_artigos !== false }
if (text(bio.titulo)) data.title = text(bio.titulo)
done(data, `link na bio: ${links.length || 'padrão,'} link(s)${data.showPosts ? ' + últimos artigos' : ''}`)
