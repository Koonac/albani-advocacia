<script setup>
import { useHead } from '@unhead/vue'
import { useSite } from '../composables/useSite.js'
const { c, lp } = useSite()
useHead({ title: 'Albani Advocacia', meta: [{ name: 'robots', content: 'noindex' }] })
</script>

<template>
  <section class="flex min-h-[70vh] items-center pt-32">
    <div class="container-site">
      <p class="font-display text-[5rem] leading-none text-metal">404</p>
      <RouterLink :to="lp('home')" class="link-brass mt-8 inline-block text-lg">{{ c.nav.home }}</RouterLink>
    </div>
  </section>
</template>
