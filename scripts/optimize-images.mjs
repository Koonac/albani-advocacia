// Otimiza os assets do cliente (assets-src/ <- materiais/albani-advocacia/) para public/img/
// Gera AVIF + WebP em larguras responsivas, favicons e a imagem Open Graph.
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = (f) => fileURLToPath(new URL(`../assets-src/${f}`, import.meta.url))
const out = (f) => fileURLToPath(new URL(`../public/img/${f}`, import.meta.url))
mkdirSync(out(''), { recursive: true })

async function responsive(input, name, widths, { avif = true, prep } = {}) {
  for (const w of widths) {
    let img = sharp(input)
    if (prep) img = prep(img)
    const buf = await img.toBuffer()
    const base = sharp(buf).resize({ width: w, withoutEnlargement: true })
    const aq = name === 'dr-ivan-corpo' ? 100 : 90
    await base.clone().webp({ quality: 80, alphaQuality: aq }).toFile(out(`${name}-${w}.webp`))
    if (avif) await base.clone().avif({ quality: name === 'dr-ivan-corpo' ? 60 : 55 }).toFile(out(`${name}-${w}.avif`))
  }
}

// 1) Dr. Ivan corpo inteiro: usa a versão com borda limpa gerada por scripts/defringe.py
//    (python scripts/defringe.py assets-src/dr-ivan-corpo-transparente.png assets-src/dr-ivan-corpo-limpo.png)
const corpoClean = await sharp(src('dr-ivan-corpo-limpo.png')).png().toBuffer()
const { width: cw, height: ch } = await sharp(corpoClean).metadata()
await responsive(corpoClean, 'dr-ivan-corpo', [420, 640, 772])
console.log('corpo', cw, ch)

// 2) Busto (fundo preto) — página Sobre e teaser
await responsive(src('dr-ivan-busto-fundo-preto.png'), 'dr-ivan-busto', [480, 760, 1120])

// 3) Avatar
await sharp(src('dr-ivan-restaurante.png')).resize(96, 96).webp({ quality: 82 }).toFile(out('dr-ivan-avatar-96.webp'))

// 4) Logo: símbolo e wordmark recortados do arquivo oficial (fundo transparente)
const logo = src('logo-completo-fundo-branco.png')
// wordmark = linhas 663-775 do arquivo oficial (gap entre símbolo e texto: y 653-673)
const wordBuf = await sharp(await sharp(logo).extract({ left: 0, top: 663, width: 1352, height: 113 }).png().toBuffer()).trim({ threshold: 1 }).png().toBuffer()
await sharp(wordBuf).resize({ height: 40 }).webp({ quality: 90, alphaQuality: 100 }).toFile(out('logo-wordmark.webp'))
await sharp(src('logo-simbolo.png')).trim({ threshold: 1 }).resize({ height: 112 }).webp({ quality: 90, alphaQuality: 100 }).toFile(out('logo-simbolo.webp'))
await sharp(src('logo-simbolo.png')).trim({ threshold: 1 }).resize({ height: 160 }).png().toFile(out('logo-simbolo.png'))
await sharp(logo).trim({ threshold: 1 }).resize({ width: 640 }).webp({ quality: 88 }).toFile(out('logo-completo.webp'))

// 5) Favicons (símbolo dourado sobre ardósia)
const BG = { r: 27, g: 30, b: 36, alpha: 1 }
for (const size of [32, 180, 512]) {
  const inner = Math.round(size * 0.78)
  const sym = await sharp(src('logo-simbolo.png')).trim({ threshold: 1 }).resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } }).composite([{ input: sym, gravity: 'center' }]).png().toFile(out(`favicon-${size}.png`))
}

// 6) Open Graph (mockup do logo sobre pedra escura)
await sharp(src('logo-mockup-fundo-escuro.jpg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82, mozjpeg: true }).toFile(out('og-albani.jpg'))

// 7) Thumbnail do vídeo (servida localmente: nada carrega do YouTube antes do clique)
await responsive(src('video-thumb.jpg'), 'video-thumb', [640, 1280], { avif: true })

// 8) Fundo do hero: Estátua da Liberdade + Torre de Belém (composição ilustrativa, bem escura;
//    a versão "composto" aproxima a estátua — ver scripts/compose-hero-bg.cjs)
for (const w of [960, 1536, 2304]) {
  const base = sharp(src('hero-monumentos-composto.png')).resize({ width: w })
  await base.clone().webp({ quality: 72 }).toFile(out(`hero-monumentos-${w}.webp`))
  await base.clone().avif({ quality: 50 }).toFile(out(`hero-monumentos-${w}.avif`))
}
console.log('ok')
