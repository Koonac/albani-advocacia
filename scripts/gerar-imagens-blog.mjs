// Gera as imagens dos artigos (capa + imagem do meio do texto) no ComfyUI (Flux2), a partir de
// assets-src/blog/prompts.json, e salva os PNG em assets-src/blog/. Usa o script do projeto Vekta AI
// (que lê as credenciais do servidor em interface/.env de lá).
//
//   node scripts/gerar-imagens-blog.mjs                 gera as que ainda não existem
//   node scripts/gerar-imagens-blog.mjs visto-d7-ou-d8-capa   gera (ou refaz) só essas
//
// Depois: node scripts/optimize-blog-images.mjs (converte para WebP em public/img/blog/)
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const COMFY = process.env.COMFYUI_SCRIPT || 'C:/Projetos/henrique-rodrigues/Vekta AI/.scripts/comfyui.py'
const DIR = resolve('assets-src/blog')
const { _estilo: estilo, imagens } = JSON.parse(readFileSync(resolve(DIR, 'prompts.json'), 'utf8'))

const pedidas = process.argv.slice(2)
const fila = pedidas.length ? imagens.filter((i) => pedidas.includes(i.nome)) : imagens.filter((i) => !existsSync(resolve(DIR, `${i.nome}.png`)))

for (const img of fila) {
  console.log(`[imagens] ${img.nome} (${img.w}x${img.h})`)
  const out = execFileSync(
    'python',
    [COMFY, 'imagem', '-p', `${img.prompt} ${estilo}`, '-o', resolve(DIR, `${img.nome}.png`), '--width', String(img.w), '--height', String(img.h)],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
  )
  const res = JSON.parse(out)
  if (!res.ok) throw new Error(`[imagens] ${img.nome}: ${res.erro}`)
  console.log(`  ok, seed ${res.seed}`)
}
console.log(`[imagens] ${fila.length} geradas`)
