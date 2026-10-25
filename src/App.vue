<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import WhatsAppFloat from './components/WhatsAppFloat.vue'
import IconSprite from './components/IconSprite.vue'
import { useHead } from '@unhead/vue'
import marcellusLatin from '@fontsource/marcellus/files/marcellus-latin-400-normal.woff2?url'
import instrumentLatin from '@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2?url'

// Preload das fontes latin (título e texto do hero): evita o atraso de descobri-las só depois do CSS
useHead({
  link: [marcellusLatin, instrumentLatin].map((href) => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossorigin: '' })),
})

// Páginas "bare" (link na bio) ficam sem a moldura do site
const route = useRoute()
const bare = computed(() => !!route.meta.bare)
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <IconSprite />
    <SiteHeader v-if="!bare" />
    <main id="conteudo" class="flex-1">
      <RouterView />
    </main>
    <SiteFooter v-if="!bare" />
    <WhatsAppFloat v-if="!bare" />
  </div>
</template>
