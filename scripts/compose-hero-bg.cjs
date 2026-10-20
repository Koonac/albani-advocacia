// Recompõe o fundo do hero (rodar antes de optimize-images):
//   node scripts/compose-hero-bg.cjs assets-src/hero-monumentos.png assets-src/hero-monumentos-composto.png
// Acrescenta FILL px à esquerda (céu desfocado + textura real do mar) para a Estátua da Liberdade
// terminar exatamente em 25% da largura final — o CSS do hero (HomePage.vue, .hero-landmarks) usa
// essa fração para encostar a estátua à esquerda do texto em qualquer largura de tela.
const sharp = require('sharp')
const [src, out] = process.argv.slice(2)
const W = 1536, H = 1024
const STATUE_RIGHT = 160 // borda direita da estátua (pedestal) na imagem original
const FILL = Math.round((0.25 * W - STATUE_RIGHT) / 0.75) // (FILL + 160) / (W + FILL) = 0.25
const FEATHER = 90, HORIZON = 700

async function rampLeft(buf, w, h, n, axis = 'x') {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const p = axis === 'x' ? x : y
      if (p >= n) continue
      const t = p / n
      data[(y * w + x) * 4 + 3] = Math.round(255 * t * t * (3 - 2 * t))
    }
  return sharp(data, { raw: info }).png().toBuffer()
}

;(async () => {
  const fw = FILL + FEATHER
  // céu: coluna da borda esticada e muito desfocada (sem listras)
  const sky = await sharp(src).extract({ left: 0, top: 0, width: 3, height: H }).resize({ width: fw, height: H, fit: 'fill' }).blur(45).modulate({ brightness: 0.85 }).png().toBuffer()
  // mar: textura real de uma área vazia da água
  const sea = await rampLeft(await sharp(src).extract({ left: 420, top: HORIZON, width: fw, height: H - HORIZON }).png().toBuffer(), fw, H - HORIZON, 40, 'y')
  const fill = await sharp(sky).composite([{ input: sea, left: 0, top: HORIZON }]).png().toBuffer()
  const photo = await rampLeft(await sharp(src).png().toBuffer(), W, H, FEATHER)
  await sharp({ create: { width: W + FILL, height: H, channels: 3, background: '#000' } })
    .composite([{ input: fill, left: 0, top: 0 }, { input: photo, left: FILL, top: 0 }])
    .png().toFile(out)
  console.log('ok', W + FILL, 'x', H)
})()
