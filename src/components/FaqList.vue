<script setup>
// Lista de perguntas e respostas em acordeão (<details> nativo: funciona sem JS e é indexável)
defineProps({ items: { type: Array, required: true } })
</script>

<template>
  <ul class="border-t border-slate-line">
    <li v-for="(item, i) in items" :key="i" class="border-b border-slate-line">
      <details class="faq-item group">
        <summary class="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left">
          <span class="font-display text-[1.25rem] leading-snug text-ivory transition-colors group-hover:text-brass-light sm:text-[1.4rem]">{{
            item.q
          }}</span>
          <span class="faq-plus relative mt-2 h-4 w-4 shrink-0" aria-hidden="true"></span>
        </summary>
        <p class="max-w-3xl pb-7 pr-10 leading-relaxed text-mist">{{ item.a }}</p>
      </details>
    </li>
  </ul>
</template>

<style scoped>
.faq-item summary::-webkit-details-marker {
  display: none;
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
