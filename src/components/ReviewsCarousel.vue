<script setup>
// Faixa contínua de avaliações (marquee): desliza devagar, em loop infinito, e pode ser arrastada.
// - A lista é renderizada duas vezes; o deslocamento é tomado em módulo da largura de uma cópia,
//   então a faixa recomeça sem emenda (para os dois lados).
// - Movimento via requestAnimationFrame + transform (compositor/GPU): leve no mobile.
// - Arraste com mouse ou toque (touch-action: pan-y mantém a rolagem vertical da página), com inércia.
// - Pausa com hover do mouse, foco, fora da viewport; rAF já para sozinho com a aba oculta.
// - prefers-reduced-motion: sem movimento automático (o arraste continua funcionando).
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  items: { type: Array, required: true },
  sourceLabel: String,
})

const SECONDS_PER_CARD = 11 // quanto maior, mais devagar
const RESUME_AFTER = 1500 // ms parado depois de soltar, antes de voltar a deslizar

const root = ref(null)
const track = ref(null)
const firstCopy = ref(null)
const dragging = ref(false)

let offset = 0 // px já percorridos para a esquerda
let span = 0 // largura de uma cópia da lista
let speed = 0 // px/s do movimento automático
let velocity = 0 // px/ms da inércia após soltar
let raf = 0
let last = 0
let resumeAt = 0
let inView = false
let hovering = false
let focused = false
let reduced = false
let startX = 0
let startOffset = 0
let lastX = 0
let lastT = 0
let moved = false
let io
let ro

function measure() {
  span = firstCopy.value?.offsetWidth || 0
  speed = span / (props.items.length * SECONDS_PER_CARD)
}
function paint() {
  if (!span) return
  const x = ((offset % span) + span) % span
  track.value.style.transform = `translate3d(${-x}px, 0, 0)`
}

function frame(t) {
  const dt = last ? Math.min(t - last, 64) : 0
  last = t
  if (!dragging.value) {
    if (Math.abs(velocity) > 0.01) {
      // Inércia do arraste, decaindo
      offset += velocity * dt
      velocity *= Math.pow(0.94, dt / 16)
    } else if (!reduced && inView && !hovering && !focused && t >= resumeAt) {
      offset += (speed * dt) / 1000
    }
  }
  paint()
  raf = requestAnimationFrame(frame)
}

function onDown(e) {
  if (e.button !== undefined && e.button !== 0) return
  dragging.value = true
  moved = false
  velocity = 0
  startX = lastX = e.clientX
  startOffset = offset
  lastT = performance.now()
}
function onMove(e) {
  if (!dragging.value) return
  if (!moved && Math.abs(e.clientX - startX) > 4) {
    moved = true
    root.value.setPointerCapture?.(e.pointerId)
  }
  offset = startOffset - (e.clientX - startX)
  const now = performance.now()
  if (now > lastT) velocity = -(e.clientX - lastX) / (now - lastT)
  lastX = e.clientX
  lastT = now
}
function onUp(e) {
  if (!dragging.value) return
  dragging.value = false
  if (performance.now() - lastT > 80) velocity = 0 // soltou parado: sem inércia
  velocity = Math.max(-3, Math.min(3, velocity))
  resumeAt = performance.now() + RESUME_AFTER
  if (root.value.hasPointerCapture?.(e.pointerId)) root.value.releasePointerCapture(e.pointerId)
}
function onKey(e) {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
  e.preventDefault()
  velocity = e.key === 'ArrowRight' ? 1.2 : -1.2
}

const onEnter = (e) => e.pointerType === 'mouse' && (hovering = true)
const onLeave = () => (hovering = false)
// Só pausa no foco de teclado (o clique/arraste com mouse também foca, e não deve travar a faixa)
const onFocusIn = (e) => (focused = e.target.matches(':focus-visible'))
const onFocusOut = (e) => !root.value?.contains(e.relatedTarget) && (focused = false)

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  measure()
  ro = new ResizeObserver(measure)
  ro.observe(firstCopy.value)
  io = new IntersectionObserver(([e]) => (inView = e.isIntersecting))
  io.observe(root.value)
  raf = requestAnimationFrame(frame)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  io?.disconnect()
  ro?.disconnect()
})
</script>

<template>
  <div
    ref="root"
    class="marquee -mx-5 overflow-hidden md:-mx-8 xl:mx-0"
    :class="dragging ? 'cursor-grabbing select-none' : 'cursor-grab'"
    tabindex="0"
    :aria-label="sourceLabel"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="onUp"
    @pointercancel="onUp"
    @pointerenter="onEnter"
    @pointerleave="onLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown="onKey"
    @dragstart.prevent
  >
    <div ref="track" class="marquee-track flex w-max">
      <ul
        v-for="copy in 2"
        :key="copy"
        :ref="copy === 1 ? (el) => (firstCopy = el) : undefined"
        class="flex shrink-0 gap-6 pr-6"
        :aria-hidden="copy === 2 ? 'true' : undefined"
      >
        <li
          v-for="r in props.items"
          :key="`${copy}-${r.author}`"
          class="flex w-[19rem] shrink-0 flex-col border-t border-brass/50 pt-7 sm:w-[22rem] lg:w-[24rem]"
        >
          <figure class="flex h-full flex-col">
            <div class="mb-5 flex gap-1 text-brass-light" role="img" aria-label="5/5">
              <AppIcon v-for="n in 5" :key="n" name="star" :size="15" />
            </div>
            <blockquote class="flex-1 font-display text-[1.3rem] leading-[1.45] text-ivory">“{{ r.text }}”</blockquote>
            <figcaption class="mt-6 flex items-center gap-3 text-sm">
              <span class="text-ivory">{{ r.author }}</span>
              <span class="h-px w-6 bg-slate-line"></span>
              <span class="flex items-center gap-1.5 text-mist"><AppIcon name="google" :size="14" />{{ sourceLabel }}</span>
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  /* Arraste horizontal fica com o componente; a rolagem vertical da página continua normal */
  touch-action: pan-y;
  /* Bordas esmaecidas: os cards entram e saem suavemente */
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.marquee-track {
  will-change: transform;
}
</style>
