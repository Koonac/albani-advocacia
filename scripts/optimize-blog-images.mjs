// Converte as imagens dos artigos (assets-src/blog/*.png, geradas por scripts/gerar-imagens-blog.mjs)
// para WebP em public/img/blog/. Capas: 1200px (mesma largura das capas do CMS); imagens do meio
// do texto: 1440px (a folha do artigo tem ~730px de texto, 2x para telas retina).
import sharp from 'sharp'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('../assets-src/blog/', import.meta.url))
const out = fileURLToPath(new URL('../public/img/blog/', import.meta.url))

for (const file of readdirSync(src).filter((f) => f.endsWith('.png'))) {
  const name = file.replace(/\.png$/, '')
  const width = name.endsWith('-capa') ? 1200 : 1440
  await sharp(src + file).resize({ width }).webp({ quality: 78 }).toFile(`${out}${name}.webp`)
  console.log(`blog: ${name}.webp (${width}px)`)
}
