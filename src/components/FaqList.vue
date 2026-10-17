<script setup>
// Lista de perguntas e respostas em acordeão (<details> nativo: funciona sem JS e é indexável).
// Com `terms` (busca), destaca os termos e abre as respostas onde está a correspondência.
import { highlight, matchesAll } from '../composables/search.js'

const props = defineProps({
  items: { type: Array, required: true },
  terms: { type: Array, default: () => [] },
})

// Abre quando algum termo está na resposta e não na pergunta (o resultado só se explica por ela)
const openFor = (item) => props.terms.some((t) => !matchesAll([t], item.q) && matchesAll([t], item.a))
</script>

<template>
  <ul class="border-t border-slate-line">
    <li v-for="item in items" :key="item.q" class="border-b border-slate-line">
      <details class="faq-item group" :open="openFor(item)">
        <summary class="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left">
          <!-- highlight() escapa o texto antes de inserir as marcações -->
          <span
            class="font-display text-[1.25rem] leading-snug text-ivory transition-colors group-hover:text-brass-light sm:text-[1.4rem]"
            v-html="highlight(item.q, terms)"
          ></span>
          <span class="faq-plus relative mt-2 h-4 w-4 shrink-0" aria-hidden="true"></span>
        </summary>
        <p class="max-w-3xl pb-7 pr-10 leading-relaxed text-mist" v-html="highlight(item.a, terms)"></p>
      </details>
    </li>
  </ul>
</template>

<style scoped>
.faq-item summary::-webkit-details-marker {
  display: none;
}
.faq-item :deep(mark) {
  background: rgba(201, 165, 90, 0.28);
  color: inherit;
  border-radius: 2px;
  padding: 0 1px;
}
.faq-plus::before,
.faq-plus::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1.5px;
  background: var(--color-brass);
  transition: transform 0.3s var(--ease-out-soft);
}
.faq-plus::after {
  transform: rotate(90deg);
}
.faq-item[open] .faq-plus::after {
  transform: rotate(0deg);
}
</style>
