<script setup>
// Logo oficial do cliente: símbolo (monograma IA) + wordmark, ambos recortados do arquivo
// logo-completo-fundo-branco.png (fundo transparente), sem redesenho.
defineProps({ size: { type: String, default: 'header' } })
</script>

<template>
  <span class="flex items-center gap-2 sm:gap-3">
    <img
      src="/img/logo-simbolo.webp"
      width="124"
      height="112"
      alt=""
      :class="size === 'header' ? 'h-9 w-auto sm:h-10 lg:h-11' : 'h-14 w-auto'"
      decoding="async"
    />
    <img
      src="/img/logo-wordmark.webp"
      width="486"
      height="40"
      alt="Albani Advocacia"
      :class="size === 'header' ? 'h-[0.78rem] w-auto sm:h-[1.05rem]' : 'h-5 w-auto'"
      decoding="async"
    />
  </span>
</template>
