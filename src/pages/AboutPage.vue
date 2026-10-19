<script setup>
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import AppIcon from '../components/AppIcon.vue'

const { c, book, hasBooking } = useSite()
useSeo(() => ({ key: 'about', title: c.value.meta.about.title, description: c.value.meta.about.description }))
</script>

<template>
  <!-- Abertura -->
  <section class="relative isolate overflow-hidden pt-32 lg:pt-44">
    <img
      src="/img/logo-simbolo.webp"
      width="124"
      height="112"
      alt=""
      aria-hidden="true"
      class="pointer-events-none absolute -right-16 top-24 -z-10 w-[20rem] opacity-[0.1] sm:w-[28rem] lg:-right-10 lg:top-20 lg:w-[38rem] lg:opacity-[0.12]"
    />
    <div class="container-site">
      <p class="kicker">{{ c.about.eyebrow }}</p>
      <h1 class="mt-6 max-w-[22ch] text-[2.4rem] leading-[1.08] text-ivory sm:text-[3.4rem] lg:text-[4rem]">{{ c.about.headline }}</h1>
      <p class="mt-8 max-w-2xl text-lg leading-relaxed text-mist lg:text-xl">{{ c.about.intro }}</p>
    </div>
  </section>

  <!-- Dr. Ivan -->
  <section class="section" aria-labelledby="ivan-title">
    <div class="container-site grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
      <div class="relative lg:col-span-6">
        <div class="absolute inset-x-8 bottom-0 top-16 border border-brass/30" aria-hidden="true"></div>
        <picture>
          <source type="image/avif" srcset="/img/dr-ivan-busto-480.avif 480w, /img/dr-ivan-busto-760.avif 760w, /img/dr-ivan-busto-1120.avif 1120w" sizes="(min-width: 1024px) 36rem, 92vw" />
          <source type="image/webp" srcset="/img/dr-ivan-busto-480.webp 480w, /img/dr-ivan-busto-760.webp 760w, /img/dr-ivan-busto-1120.webp 1120w" sizes="(min-width: 1024px) 36rem, 92vw" />
          <img src="/img/dr-ivan-busto-760.webp" width="760" height="953" :alt="c.about.ivan.photoAlt" decoding="async" class="busto relative mx-auto w-full max-w-xl" />
        </picture>
      </div>
      <div class="lg:col-span-6" v-reveal>
        <h2 id="ivan-title" class="text-[2.6rem] text-ivory sm:text-[3.4rem]">{{ c.about.ivan.title }}</h2>
        <p class="mt-4 text-brass-text">{{ c.about.ivan.credentials }}</p>
        <hr class="rule-brass mt-8 max-w-xs" />
        <p class="mt-8 text-lg leading-relaxed text-ivory/85">{{ c.about.ivan.text }}</p>
        <a :href="book()" target="_blank" rel="noopener" class="btn-brass mt-10"
          ><AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ hasBooking ? c.ui.book : c.about.cta }}</a
        >
      </div>
    </div>
  </section>

  <!-- Minha história (primeira pessoa, do Dr. Ivan) -->
  <section class="section border-t border-slate-line/70" aria-labelledby="historia-title">
    <div class="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
      <header class="lg:col-span-4">
        <div class="lg:sticky lg:top-32">
          <p class="kicker">{{ c.about.story.eyebrow }}</p>
          <h2 id="historia-title" class="mt-6 text-[2.2rem] leading-tight text-ivory sm:text-[2.8rem]">{{ c.about.story.title }}</h2>
          <hr class="rule-brass mt-8 max-w-[8rem]" />
        </div>
      </header>
      <div class="lg:col-span-8">
        <div class="max-w-[42rem]">
          <p class="text-lg leading-relaxed text-ivory/85">{{ c.about.story.lead }}</p>
          <div v-for="section in c.about.story.sections" :key="section.title" class="mt-12">
            <h3 class="font-display text-[1.55rem] leading-snug text-ivory sm:text-[1.85rem]">{{ section.title }}</h3>
            <div class="mt-5 space-y-6 text-lg leading-relaxed text-ivory/80">
              <p v-for="(p, i) in section.paragraphs" :key="i">{{ p }}</p>
            </div>
          </div>
        </div>
        <figure class="mt-12 max-w-[42rem] border-l-2 border-brass pl-6 sm:pl-8" v-reveal>
          <blockquote class="font-display text-[1.55rem] leading-snug text-ivory sm:text-[1.9rem]">{{ c.about.story.closing }}</blockquote>
          <figcaption class="mt-5 text-sm tracking-wide text-brass-text">— {{ c.about.story.signature }}</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <!-- Valores -->
  <section class="section border-y border-slate-line/70 bg-slate-deep/40" aria-labelledby="valores-title">
    <div class="container-site grid gap-12 lg:grid-cols-12">
      <h2 id="valores-title" class="text-[2.2rem] text-ivory sm:text-[2.8rem] lg:col-span-4">{{ c.about.valuesTitle }}</h2>
      <dl class="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-8">
        <div v-for="(v, i) in c.about.values" :key="v.title" v-reveal="(i % 2) * 90" class="border-t border-brass/40 pt-6">
          <dt class="font-display text-[1.7rem] text-metal">{{ v.title }}</dt>
          <dd class="mt-3 text-mist">{{ v.text }}</dd>
        </div>
      </dl>
    </div>
  </section>

  <!-- Onde atuamos -->
  <section class="section" aria-labelledby="onde-title">
    <div class="container-site">
      <h2 id="onde-title" class="text-[2.2rem] text-ivory sm:text-[2.8rem]">{{ c.about.whereTitle }}</h2>
      <ul class="mt-12 grid gap-px border border-slate-line bg-slate-line md:grid-cols-3">
        <li v-for="(w, i) in c.about.where" :key="w.title" v-reveal="i * 90" class="bg-slate p-8 lg:p-10">
          <span class="text-3xl" aria-hidden="true">{{ w.flag }}</span>
          <h3 class="mt-5 font-display text-[1.8rem] text-ivory">{{ w.title }}</h3>
          <p class="mt-3 text-mist">{{ w.text }}</p>
        </li>
      </ul>
      <div class="mt-14">
        <a :href="book()" target="_blank" rel="noopener" class="btn-brass"
          ><AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ hasBooking ? c.ui.book : c.about.cta }}</a
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
.busto {
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 8%, #000 80%, transparent 100%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, #000 8%, #000 80%, transparent 100%);
  mask-composite: intersect;
}
</style>
