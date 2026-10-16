<script setup>
// Lista de serviços: cada item abre o agendamento (Google Calendar) ou, com `whatsapp`, o WhatsApp com
// "Olá, Dr. Ivan! Gostaria de falar sobre: <serviço>". Sem link de agendamento configurado, tudo cai no WhatsApp.
import { useSite } from '../composables/useSite.js'
import AppIcon from './AppIcon.vue'

const props = defineProps({ items: { type: Array, required: true }, cols: { type: Number, default: 2 }, whatsapp: Boolean })
const { c, waService, bookService, hasBooking } = useSite()
const href = (item) => (props.whatsapp ? waService(item) : bookService(item))
const icon = props.whatsapp || !hasBooking ? 'whatsapp' : 'calendar'
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
</script>

<template>
  <ul class="grid gap-x-8" :class="cols === 2 ? 'sm:grid-cols-2' : cols === 3 ? 'sm:grid-cols-2 xl:grid-cols-3' : ''">
    <li v-for="item in items" :key="item" class="border-b border-slate-line/70">
      <a
        :href="href(cap(item))"
        target="_blank"
        rel="noopener"
        class="group flex items-center justify-between gap-4 py-3.5 text-ivory/90 transition-colors hover:text-brass-light"
        :aria-label="`${c.ui.serviceAria} ${cap(item)} ${c.ui.newTab}`"
      >
        <span>{{ cap(item) }}</span>
        <AppIcon :name="icon" :size="16" class="shrink-0 text-brass/45 transition-colors duration-300 group-hover:text-brass-light group-focus-visible:text-brass-light" />
      </a>
    </li>
  </ul>
</template>
