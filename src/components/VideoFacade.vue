<script setup>
// Fachada "lite": mostra a miniatura (servida localmente) e só injeta o iframe
// youtube-nocookie depois do clique: nenhum pedido ao YouTube antes disso.
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  thumbAlt: { type: String, required: true },
  playLabel: { type: String, required: true },
  // prefixo das miniaturas locais: <thumb>-640/-1280 em .avif e .webp
  thumb: { type: String, default: '/img/video-thumb' },
  // já começa tocando (vídeo escolhido numa miniatura: o clique do usuário já aconteceu)
  autoplay: { type: Boolean, default: false },
})
const active = ref(props.autoplay)
</script>

<template>
  <div class="relative aspect-video w-full overflow-hidden bg-slate-deep">
    <iframe
      v-if="active"
      :src="`https://www.youtube-nocookie.com/embed/${props.id}?autoplay=1&rel=0&modestbranding=1`"
      :title="props.title"
      class="absolute inset-0 h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
    <button v-else type="button" class="group absolute inset-0 block h-full w-full" :aria-label="`${props.playLabel}: ${props.title}`" @click="active = true">
      <picture>
        <source type="image/avif" :srcset="`${props.thumb}-640.avif 640w, ${props.thumb}-1280.avif 1280w`" sizes="(min-width: 1024px) 900px, 100vw" />
        <source type="image/webp" :srcset="`${props.thumb}-640.webp 640w, ${props.thumb}-1280.webp 1280w`" sizes="(min-width: 1024px) 900px, 100vw" />
        <img
          :src="`${props.thumb}-1280.webp`"
          width="1280"
          height="720"
          :alt="props.thumbAlt"
          loading="lazy"
          decoding="async"
          class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
        />
      </picture>
      <span class="absolute inset-0 bg-gradient-to-t from-slate-deep/80 via-slate-deep/20 to-slate-deep/10 transition-opacity group-hover:opacity-80"></span>
      <span class="absolute inset-0 flex items-center justify-center">
        <span
          class="flex h-20 w-20 items-center justify-center rounded-full border border-brass-light/60 bg-slate-deep/60 text-brass-light backdrop-blur-sm transition duration-300 group-hover:scale-105 group-hover:border-brass-light group-hover:bg-slate-deep/75 sm:h-24 sm:w-24"
        >
          <AppIcon name="play" :size="34" class="translate-x-0.5" />
        </span>
      </span>
    </button>
  </div>
</template>
