// Gera o mapa-múndi pontilhado (dot-matrix) usado no hero.
// Roda só em desenvolvimento (npm run assets): world-atlas + topojson + d3-geo
// ficam fora do bundle de runtime. Saída:
//   public/img/world-dots.svg  -> camada estática de pontos (cacheável)
//   src/data/map.json          -> viewBox + projeção dos pontos de destaque
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { feature } from 'topojson-client'
import { geoContains } from 'd3-geo'

const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/land-110m.json', import.meta.url)))
const land = feature(topo, topo.objects.land)

// Recorte centrado no Atlântico (Américas + Europa/África ocidental)
export const BOUNDS = { lonMin: -135, lonMax: 55, latMax: 72, latMin: -56 }
const STEP = 1.55 // graus
const SCALE = 10 // px por grau no viewBox
const W = (BOUNDS.lonMax - BOUNDS.lonMin) * SCALE
const H = (BOUNDS.latMax - BOUNDS.latMin) * SCALE
const project = (lon, lat) => [(lon - BOUNDS.lonMin) * SCALE, (BOUNDS.latMax - lat) * SCALE]

let d = ''
let count = 0
let row = 0
for (let lat = BOUNDS.latMax; lat >= BOUNDS.latMin; lat -= STEP, row++) {
  const offset = row % 2 ? STEP / 2 : 0
  for (let lon = BOUNDS.lonMin + offset; lon <= BOUNDS.lonMax; lon += STEP) {
    if (geoContains(land, [lon, lat])) {
      const [x, y] = project(lon, lat)
      d += `M${x.toFixed(0)} ${y.toFixed(0)}h0`
      count++
    }
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path d="${d}" stroke="#C9A55A" stroke-width="5.2" stroke-linecap="round" fill="none"/></svg>`
mkdirSync(new URL('../public/img/', import.meta.url), { recursive: true })
writeFileSync(new URL('../public/img/world-dots.svg', import.meta.url), svg)

const places = {
  pt: { lon: -8.9, lat: 38.6 },   // Palmela / Lisboa
  br: { lon: -48.5, lat: -27.6 }, // Florianópolis (OAB/SC)
  us: { lon: -74.0, lat: 40.7 },  // Nova Iorque
}
const out = { width: W, height: H, places: {} }
for (const [k, p] of Object.entries(places)) {
  const [x, y] = project(p.lon, p.lat)
  out.places[k] = { x: Math.round(x), y: Math.round(y) }
}
mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true })
writeFileSync(new URL('../src/data/map.json', import.meta.url), JSON.stringify(out, null, 2))
console.log(`world-dots.svg: ${count} pontos, ${(svg.length / 1024).toFixed(1)} KB`, out)
