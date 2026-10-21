<script setup>
// Mapa-múndi pontilhado + arcos animados Brasil · EUA · Portugal.
// - Pontos de terra: SVG estático pré-gerado (scripts/build-map.mjs) servido como <img> (cacheável,
//   zero JS de geografia no runtime).
// - Arcos, cometas e pulsos: SVG inline leve, animado só com CSS (GPU-friendly).
// - Pausa fora da viewport (IntersectionObserver) e com a aba oculta; respeita prefers-reduced-motion.
import { ref, onMounted, onBeforeUnmount } from 'vue'
import map from '../data/map.json'

const props = defineProps({ labels: { type: Object, required: true } })

const { width: W, height: H, places } = map
const P = places

// Arco quadrático curvado "para fora" do triângulo (afasta-se do centróide)
const cx = (P.pt.x + P.br.x + P.us.x) / 3
const cy = (P.pt.y + P.br.y + P.us.y) / 3
function arc(a, b, bend = 0.28) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  let nx = -dy / len
  let ny = dx / len
  if ((mx - cx) * nx + (my - cy) * ny < 0) {
    nx = -nx
    ny = -ny
  }
  const k = len * bend
  return `M${a.x} ${a.y} Q${(mx + nx * k).toFixed(1)} ${(my + ny * k).toFixed(1)} ${b.x} ${b.y}`
}

const arcs = [
  { id: 'br-pt', d: arc(P.br, P.pt, 0.22), delay: 0 },
  { id: 'us-pt', d: arc(P.us, P.pt, 0.2), delay: 0.35, back: true },
  { id: 'br-us', d: arc(P.br, P.us, 0.2), delay: 0.7 },
]
// EUA–Portugal passa por trás da cabeça; os outros dois arcos ficam sobre a foto
const backArcs = arcs.filter((a) => a.back)
const frontArcs = arcs.filter((a) => !a.back)
const points = [
  { id: 'pt', ...P.pt, main: true },
  { id: 'br', ...P.br },
  { id: 'us', ...P.us },
]
const pct = (v, total) => `${((v / total) * 100).toFixed(3)}%`

const root = ref(null)
const live = ref(false)
const paused = ref(false)
let io
let inView = true
const onVisibility = () => (paused.value = document.hidden || !inView)

onMounted(() => {
  requestAnimationFrame(() => (live.value = true))
  io = new IntersectionObserver(([e]) => {
    inView = e.isIntersecting
    paused.value = !inView || document.hidden
  })
  io.observe(root.value)
  document.addEventListener('visibilitychange', onVisibility)
})
onBeforeUnmount(() => {
  io?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <!-- Camada de fundo (atrás da foto): pontos de terra + arco de cima -->
  <div
    ref="root"
    class="hero-map map-geo pointer-events-none absolute z-0 select-none"
    :class="{ 'is-live': live, 'is-paused': paused }"
    aria-hidden="true"
  >
    <img src="/img/world-dots.svg" :width="W" :height="H" alt="" class="map-dots absolute inset-0 h-full w-full" loading="eager" decoding="async" fetchpriority="low" />
    <svg :viewBox="`0 0 ${W} ${H}`" class="absolute inset-0 h-full w-full overflow-visible">
      <g v-for="a in backArcs" :key="a.id" :style="{ '--d': `${a.delay}s` }">
        <path :d="a.d" pathLength="1000" class="arc-base" stroke="url(#arcGrad)" />
        <path :d="a.d" pathLength="1000" class="arc-comet-glow" />
        <path :d="a.d" pathLength="1000" class="arc-comet" />
      </g>
    </svg>
  </div>
  <!-- Camada da frente (sobre a foto): arcos de baixo, pontos pulsantes + rótulos -->
  <div class="hero-map map-geo pointer-events-none absolute z-[2] select-none" :class="{ 'is-live': live, 'is-paused': paused }" aria-hidden="true">
    <!-- Brasil por cima da foto (recorte da mesma imagem): o contorno do país aparece sobre o terno -->
    <img src="/img/world-dots.svg" :width="W" :height="H" alt="" class="map-dots-br absolute inset-0 h-full w-full" loading="eager" decoding="async" fetchpriority="low" />
    <svg :viewBox="`0 0 ${W} ${H}`" class="absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#8c6a2e" />
          <stop offset=".5" stop-color="#e8cf8e" />
          <stop offset="1" stop-color="#8c6a2e" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stop-color="#fff1c8" stop-opacity=".95" />
          <stop offset=".35" stop-color="#e8cf8e" stop-opacity=".55" />
          <stop offset="1" stop-color="#e8cf8e" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g v-for="a in frontArcs" :key="a.id" :style="{ '--d': `${a.delay}s` }">
        <path :d="a.d" pathLength="1000" class="arc-base" stroke="url(#arcGrad)" />
        <path :d="a.d" pathLength="1000" class="arc-comet-glow" />
        <path :d="a.d" pathLength="1000" class="arc-comet" />
      </g>
      <g v-for="(p, i) in points" :key="p.id" :style="{ '--d': `${i * 0.6}s` }">
        <circle :cx="p.x" :cy="p.y" :r="p.main ? 72 : 62" fill="url(#glow)" class="pt-glow" />
        <circle :cx="p.x" :cy="p.y" r="9" class="pt-ring" />
        <circle :cx="p.x" :cy="p.y" r="9" class="pt-ring pt-ring-2" />
        <circle :cx="p.x" :cy="p.y" :r="p.main ? 8.5 : 7.2" class="pt-halo" />
        <circle :cx="p.x" :cy="p.y" :r="p.main ? 6.2 : 5.5" class="pt-core" />
      </g>
    </svg>
    <span
      v-for="p in points"
      :key="`l-${p.id}`"
      class="map-label absolute"
      :class="`map-label-${p.id}`"
      :style="{ left: pct(p.x, W), top: pct(p.y, H) }"
      >{{ props.labels[p.id] }}</span
    >
  </div>
</template>

<style scoped>
/* Geometria: o componente vive dentro de um elemento com container-type: inline-size (a figura
   da foto). 1 unidade do mapa = 1.1/651 da largura da foto => EUA à esquerda da cabeça,
   Portugal à direita, Brasil no pé da figura. */
.map-geo {
  width: 321cqw;
  left: -108cqw;
  top: -25cqw;
  aspect-ratio: 1900 / 1280;
}
/* Máscara centrada na altura do rosto (≈51% / 30% do mapa): os pontos chegam junto à cabeça
   e só se dissolvem longe da figura. */
.map-dots {
  opacity: 0.5;
  -webkit-mask-image: radial-gradient(farthest-side at 51% 30%, #000 50%, transparent 100%);
  mask-image: radial-gradient(farthest-side at 51% 30%, #000 50%, transparent 100%);
}
/* América do Sul ≈ x 540–1000, y 710–1280 do mapa: recorte retangular sem esfumar, para o contorno
   do continente (e do Brasil) ficar inteiro por cima da foto */
.map-dots-br {
  opacity: 0.55;
  -webkit-mask-image: linear-gradient(90deg, transparent 27.5%, #000 27.5%, #000 54%, transparent 54%), linear-gradient(transparent 55%, #000 55%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(90deg, transparent 27.5%, #000 27.5%, #000 54%, transparent 54%), linear-gradient(transparent 55%, #000 55%);
  mask-composite: intersect;
}
.hero-map.is-live .map-dots-br {
  animation: dots-br-in 1.6s ease-out both;
}
@keyframes dots-br-in {
  from { opacity: 0; }
  to { opacity: 0.55; }
}
.hero-map.is-live .map-dots {
  animation: dots-in 1.6s ease-out both;
}
@keyframes dots-in {
  from { opacity: 0; }
  to { opacity: 0.5; }
}

.arc-base {
  fill: none;
  stroke-width: 2.2;
  stroke-linecap: round;
  opacity: 0;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}
.is-live .arc-base {
  animation: arc-draw 1.8s cubic-bezier(0.65, 0, 0.35, 1) calc(0.5s + var(--d)) forwards;
}
@keyframes arc-draw {
  0% { opacity: 0.55; stroke-dashoffset: 1000; }
  100% { opacity: 0.55; stroke-dashoffset: 0; }
}

.arc-comet,
.arc-comet-glow {
  fill: none;
  stroke-linecap: round;
  stroke-dasharray: 70 930;
  stroke-dashoffset: 1000;
  opacity: 0;
}
.arc-comet { stroke: #fff1c8; stroke-width: 3; }
.arc-comet-glow { stroke: #e8cf8e; stroke-width: 10.5; }
.is-live .arc-comet {
  animation: comet 4.8s cubic-bezier(0.45, 0, 0.25, 1) calc(2.4s + var(--d) * 2.6) infinite;
}
.is-live .arc-comet-glow {
  animation: comet-glow 4.8s cubic-bezier(0.45, 0, 0.25, 1) calc(2.4s + var(--d) * 2.6) infinite;
}
@keyframes comet {
  0% { stroke-dashoffset: 1070; opacity: 0; }
  8% { opacity: 1; }
  62% { opacity: 1; }
  70% { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}
@keyframes comet-glow {
  0% { stroke-dashoffset: 1070; opacity: 0; }
  8% { opacity: 0.16; }
  62% { opacity: 0.16; }
  70% { stroke-dashoffset: 0; opacity: 0; }
  100% { stroke-dashoffset: 0; opacity: 0; }
}

.pt-core { fill: #fff6dc; filter: drop-shadow(0 0 6px #f3e2b0); }
.pt-halo { fill: none; stroke: #f0dca0; stroke-width: 1.6; opacity: 0.85; }
.pt-ring {
  fill: none;
  stroke: #f0dca0;
  stroke-width: 2;
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}
.is-live .pt-ring { animation: pulse 3.2s ease-out calc(1s + var(--d)) infinite; }
.is-live .pt-ring-2 { animation-delay: calc(2.6s + var(--d)); }
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.85; }
  100% { transform: scale(5.2); opacity: 0; }
}
.pt-glow { opacity: 1; }

.map-label {
  transform: translate(-50%, calc(-100% - 18px));
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #f3e2b0;
  white-space: nowrap;
  text-shadow: 0 1px 8px rgba(18, 20, 25, 0.9);
}
.map-label-br { transform: translate(-50%, 18px); }
@media (min-width: 1024px) {
  .map-label { font-size: 0.875rem; }
}
@media (max-width: 760px) {
  .map-label { font-size: 11px; }
}

.is-paused * { animation-play-state: paused !important; }

@media (prefers-reduced-motion: reduce) {
  .map-dots, .hero-map.is-live .map-dots { animation: none; opacity: 0.5; }
  .map-dots-br, .hero-map.is-live .map-dots-br { animation: none; opacity: 0.55; }
  .arc-base, .is-live .arc-base { animation: none; opacity: 0.55; stroke-dashoffset: 0; }
  .arc-comet, .arc-comet-glow, .pt-ring { display: none; }
}
</style>
