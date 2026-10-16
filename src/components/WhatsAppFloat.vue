<script setup>
import { useSite } from '../composables/useSite.js'
import AppIcon from './AppIcon.vue'
const { c, wa } = useSite()
</script>

<template>
  <a
    :href="wa()"
    target="_blank"
    rel="noopener"
    class="group fixed bottom-5 right-5 z-40 flex items-center gap-3 sm:bottom-8 sm:right-8"
    :aria-label="c.whatsappFloat"
  >
    <span
      class="pointer-events-none hidden translate-x-2 items-center gap-2.5 rounded-[2px] border border-slate-line bg-slate-raised/95 py-1.5 pl-1.5 pr-4 text-sm text-ivory opacity-0 shadow-xl transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:flex"
      role="tooltip"
    >
      <img src="/img/dr-ivan-avatar-96.webp" width="32" height="32" alt="" class="h-8 w-8 rounded-full object-cover" loading="lazy" />
      {{ c.whatsappFloat }}
    </span>
    <span
      class="wa-btn relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full text-[#1a1408] ring-2 ring-[#f3e2b0]/60 shadow-[0_14px_34px_-6px_rgba(201,165,90,0.75)] transition-transform duration-300 group-hover:scale-105 sm:h-[4.75rem] sm:w-[4.75rem]"
      style="background: linear-gradient(135deg, #ecd59a, #c9a55a 55%, #9c7a37)"
    >
      <span class="wa-pulse absolute inset-0 rounded-full" aria-hidden="true"></span>
      <AppIcon name="whatsapp" :size="36" class="relative" />
    </span>
  </a>
</template>

<style scoped>
/* Anel pulsante discreto para chamar atenção ao botão */
.wa-pulse {
  border: 2px solid rgba(232, 207, 142, 0.7);
  animation: wa-pulse 2.6s ease-out infinite;
}
@keyframes wa-pulse {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.55); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .wa-pulse { display: none; }
}
</style>
