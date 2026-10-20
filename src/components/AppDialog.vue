<script setup>
// Modal nativo (<dialog> + showModal): foco preso, Esc fecha e o resto da página fica inerte sem JS
// extra. Clique no backdrop (fora da caixa) também fecha. Estilos em style.css (.app-dialog).
import { ref } from 'vue'

defineProps({ closeLabel: { type: String, required: true } })

const el = ref(null)
const open = () => el.value?.showModal()
const close = () => el.value?.close()

function onClick(e) {
  if (e.target !== el.value) return
  const r = el.value.getBoundingClientRect()
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close()
}

defineExpose({ open, close })
</script>

<template>
  <dialog ref="el" class="app-dialog" @click="onClick">
    <button
      type="button"
      class="absolute right-3.5 top-3 grid h-9 w-9 place-items-center text-[1.75rem] leading-none text-[#d9bd85] transition-colors hover:text-brass-light"
      :aria-label="closeLabel"
      @click="close"
    >
      ×
    </button>
    <slot />
  </dialog>
</template>
