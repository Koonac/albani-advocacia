<script setup>
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import AppIcon from '../components/AppIcon.vue'
import FaqList from '../components/FaqList.vue'

const { c, book, hasBooking } = useSite()
useSeo(() => ({
  key: 'faq',
  title: c.value.meta.faq.title,
  description: c.value.meta.faq.description,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: c.value.faq.items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  },
}))
</script>

<template>
  <section class="faq-band relative isolate overflow-hidden pb-24 pt-32 lg:pb-32 lg:pt-44">
    <img
      src="/img/logo-completo.webp"
      width="640"
      height="265"
      alt=""
      aria-hidden="true"
      class="faq-watermark pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(64rem,120vw)] -translate-x-1/2 -translate-y-1/2"
    />
    <div class="container-site">
      <p class="kicker">{{ c.faq.eyebrow }}</p>
      <h1 class="mt-6 max-w-[18ch] text-[2.6rem] leading-[1.06] text-ivory sm:text-[3.8rem] lg:text-[4.4rem]">{{ c.faq.title }}</h1>
      <p class="mt-6 max-w-xl text-lg text-mist lg:text-xl">{{ c.faq.intro }}</p>
      <div class="mt-14 max-w-4xl">
        <FaqList :items="c.faq.items" />
      </div>
      <div class="mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <p class="text-lg text-mist">{{ c.faq.ctaLead }}</p>
        <a :href="book()" target="_blank" rel="noopener" class="btn-brass">
          <AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ hasBooking ? c.ui.book : c.ui.bookWa }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq-watermark {
  opacity: 0.06;
}
</style>
