// Favicons (símbolo dourado sobre ardósia) em public/img/ + public/favicon.ico.
// O Google só mostra o ícone nos resultados de busca se ele tiver 48×48 ou mais, em múltiplos de 48
// (48, 96, 192...), e costuma buscar /favicon.ico na raiz. 180 = apple-touch-icon; 512 = PWA/JSON-LD.
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = (f) => fileURLToPath(new URL(`../assets-src/${f}`, import.meta.url))
const pub = (f) => fileURLToPath(new URL(`../public/${f}`, import.meta.url))
mkdirSync(pub('img'), { recursive: true })

const BG = { r: 27, g: 30, b: 36, alpha: 1 }

async function icon(size) {
  const inner = Math.round(size * 0.78)
  const sym = await sharp(src('logo-simbolo.png'))
    .trim({ threshold: 1 })
    .resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()
  return sharp({ create: { width: size, height: size, channels: 4, background: BG } }).composite([{ input: sym, gravity: 'center' }]).png().toBuffer()
}

for (const size of [32, 48, 96, 180, 192, 512]) {
  writeFileSync(pub(`img/favicon-${size}.png`), await icon(size))
}

// favicon.ico com PNGs embutidos (16, 32, 48): cabeçalho ICONDIR + uma ICONDIRENTRY por tamanho
const sizes = [16, 32, 48]
const pngs = await Promise.all(sizes.map(icon))
const header = Buffer.alloc(6 + 16 * sizes.length)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
sizes.forEach((size, i) => {
  const e = 6 + 16 * i
  header.writeUInt8(size, e)
  header.writeUInt8(size, e + 1)
  header.writeUInt16LE(1, e + 4) // planos
  header.writeUInt16LE(32, e + 6) // bits por pixel
  header.writeUInt32LE(pngs[i].length, e + 8)
  header.writeUInt32LE(offset, e + 12)
  offset += pngs[i].length
})
writeFileSync(pub('favicon.ico'), Buffer.concat([header, ...pngs]))
console.log('favicons ok')
