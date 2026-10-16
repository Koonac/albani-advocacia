<script setup>
import { computed } from 'vue'
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import { CONTACT } from '../config/site.js'
import { HOME_VIDEO } from '../content/home.js'
import AppIcon from '../components/AppIcon.vue'
import HeroMap from '../components/HeroMap.vue'
import VideoFacade from '../components/VideoFacade.vue'
import ReviewsCarousel from '../components/ReviewsCarousel.vue'

const { c, lp, wa, book, hasBooking } = useSite()
useSeo(() => ({ key: 'home', title: c.value.meta.home.title, description: c.value.meta.home.description }))

const eyebrowParts = computed(() => c.value.home.hero.eyebrow.split(' · '))
const areaHref = (anchor) => `${lp('areas')}#${anchor}`
</script>

<template>
  <!-- HERO -->
  <!-- Grade: no mobile a ordem é título → foto → subtítulo e CTAs; no desktop o texto ocupa a coluna da
       esquerda (2 linhas) e a foto a da direita. -->
  <section class="relative isolate overflow-hidden pt-[4.5rem] lg:pt-20">
    <div class="container-site grid gap-0 lg:min-h-[min(100svh-5rem,52rem)] lg:grid-cols-12 lg:grid-rows-[1fr_auto_auto_1fr] lg:gap-x-8">
      <div class="relative z-10 pt-10 sm:pt-16 lg:col-span-7 lg:row-start-2 lg:pt-0">
        <p class="hero-brand font-display text-[1.35rem] uppercase leading-none tracking-[0.14em] text-metal sm:text-[1.6rem] lg:text-[1.85rem]">
          {{ c.meta.siteName }}
        </p>
        <p class="kicker mt-4 !text-[0.85rem] sm:!text-[0.9375rem]">
          <span class="flex flex-wrap gap-x-1.5"
            ><span v-for="(seg, i) in eyebrowParts" :key="seg" class="whitespace-nowrap">{{ seg }}<template v-if="i < eyebrowParts.length - 1"> ·</template></span></span
          >
        </p>
        <h1 class="mt-5 max-w-[17ch] text-[2rem] leading-[1.08] text-ivory sm:mt-6 sm:text-[3.3rem] lg:text-[3.7rem] xl:text-[4.1rem]">
          {{ c.home.hero.headline }}
        </h1>
      </div>

      <!-- Foto + mapa ancorado à figura (unidades cqw: o triângulo BR/EUA/PT acompanha a foto em qualquer tela). -->
      <div
        class="hero-figure relative mx-auto mt-10 w-[78%] max-w-[22rem] sm:max-w-[26rem] lg:col-span-5 lg:col-start-8 lg:row-span-4 lg:row-start-1 lg:ml-auto lg:mr-0 lg:mt-0 lg:w-full lg:max-w-[33rem] lg:self-end"
      >
        <HeroMap :labels="c.home.hero.mapLabels" />
        <picture class="relative z-[1] block">
          <source
            type="image/avif"
            srcset="/img/dr-ivan-corpo-420.avif 420w, /img/dr-ivan-corpo-640.avif 640w, /img/dr-ivan-corpo-772.avif 772w"
            sizes="(min-width: 1024px) 33rem, 78vw"
          />
          <source
            type="image/webp"
            srcset="/img/dr-ivan-corpo-420.webp 420w, /img/dr-ivan-corpo-640.webp 640w, /img/dr-ivan-corpo-772.webp 772w"
            sizes="(min-width: 1024px) 33rem, 78vw"
          />
          <img
            src="/img/dr-ivan-corpo-640.webp"
            width="772"
            height="1223"
            :alt="c.home.hero.photoAlt"
            fetchpriority="high"
            decoding="async"
            class="hero-photo block h-auto w-full"
          />
        </picture>
        <div
          class="absolute bottom-[22%] -left-6 z-[3] max-w-[16rem] border border-brass/40 bg-slate-deep/80 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3 lg:bottom-[25%] lg:-left-12"
        >
          <p class="font-display text-[0.95rem] leading-tight text-ivory sm:text-[1.05rem]">{{ c.home.hero.badge.name }}</p>
          <p class="mt-1 text-[0.72rem] tracking-wide text-brass-text sm:text-[0.8rem]">{{ c.home.hero.badge.credentials }}</p>
        </div>
      </div>

      <div class="relative z-10 pb-14 pt-8 lg:col-span-7 lg:row-start-3 lg:pb-0 lg:pt-7">
        <p class="max-w-[34rem] text-[1rem] leading-relaxed text-mist sm:text-lg lg:text-[1.2rem]">{{ c.home.hero.sub }}</p>
        <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-10">
          <a :href="book()" target="_blank" rel="noopener" class="btn-brass">
            <AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ hasBooking ? c.ui.book : c.home.hero.ctaPrimary }}
          </a>
          <RouterLink :to="lp('areas')" class="btn-ghost">{{ c.home.hero.ctaSecondary }}</RouterLink>
        </div>
        <a
          :href="CONTACT.googleReviews"
          target="_blank"
          rel="noopener"
          class="mt-7 inline-flex items-center gap-2.5 text-sm text-ivory/85 transition-colors hover:text-brass-light"
        >
          <AppIcon name="google" :size="18" />
          <span>{{ c.home.hero.proof }}</span>
        </a>
      </div>
    </div>
    <hr class="rule-brass relative z-[3]" />
  </section>

  <!-- VÍDEO -->
  <section class="section !pt-14 lg:!pt-20" aria-labelledby="video-title">
    <div class="container-site grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div class="lg:col-span-4">
        <p class="kicker">{{ c.home.video.eyebrow }}</p>
        <h2 id="video-title" class="mt-5 text-[2rem] text-ivory sm:text-[2.5rem]">{{ c.home.video.title }}</h2>
      </div>
      <div class="relative lg:col-span-8">
        <div class="absolute -inset-px bg-gradient-to-br from-brass-light/50 via-brass/10 to-brass-deep/40" aria-hidden="true"></div>
        <div class="relative">
          <VideoFacade :id="HOME_VIDEO.id" :thumb="HOME_VIDEO.thumb" :title="c.home.video.iframeTitle" :thumb-alt="c.home.video.thumbAlt" :play-label="c.ui.playVideo" />
        </div>
      </div>
    </div>
  </section>

  <!-- CREDENCIAIS -->
  <section class="relative isolate overflow-hidden border-y border-slate-line/70 bg-slate-deep/50" :aria-label="c.ui.credentials">
    <dl class="container-site grid grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(s, i) in c.home.stats"
        :key="s.strong"
        class="flex flex-col gap-1.5 py-8 lg:py-10"
        :class="[i % 2 === 1 ? 'pl-5 border-l border-slate-line/70 lg:pl-8' : 'pr-4', i >= 2 ? 'border-t border-slate-line/70 lg:border-t-0' : '', i === 2 ? 'lg:border-l lg:border-slate-line/70 lg:pl-8' : '']"
      >
        <dt class="font-display text-[1.55rem] leading-tight text-metal sm:text-[1.9rem]">{{ s.strong }}</dt>
        <dd class="text-[0.95rem] text-mist">{{ s.text }}</dd>
      </div>
    </dl>
  </section>

  <!-- DORES -->
  <section class="section relative isolate overflow-hidden" aria-labelledby="dores-title">
    <img
      src="/img/logo-completo.webp"
      width="640"
      height="265"
      alt=""
      aria-hidden="true"
      loading="lazy"
      class="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(64rem,130vw)] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.07]"
    />
    <div class="container-site grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-5">
        <h2 id="dores-title" class="text-[2.2rem] text-ivory sm:text-[2.8rem] lg:sticky lg:top-32">{{ c.home.pains.title }}</h2>
      </div>
      <div class="lg:col-span-7">
        <ul>
          <li
            v-for="(p, i) in c.home.pains.items"
            :key="i"
            v-reveal="i * 80"
            class="flex gap-5 border-t border-slate-line py-6 text-[1.15rem] leading-relaxed text-ivory/90 last:border-b sm:text-[1.25rem]"
          >
            <span class="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-brass" aria-hidden="true"></span>
            {{ p }}
          </li>
        </ul>
        <div class="mt-10" v-reveal>
          <p class="max-w-xl text-lg text-mist">
            <strong class="font-display text-[1.5rem] font-normal text-brass-text">{{ c.home.pains.closingStrong }}</strong>
            <br />
            {{ c.home.pains.closing }}
          </p>
          <a :href="wa()" target="_blank" rel="noopener" class="btn-brass mt-8">
            <AppIcon name="whatsapp" :size="20" />{{ c.home.pains.cta }}
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ÁREAS (destaques) -->
  <section class="section bg-slate-deep/40 !pt-20" aria-labelledby="areas-title">
    <div class="container-site">
      <div class="max-w-3xl">
        <h2 id="areas-title" class="text-[2.2rem] text-ivory sm:text-[2.8rem]">{{ c.home.areas.title }}</h2>
        <p class="mt-5 max-w-2xl text-lg text-mist">{{ c.home.areas.intro }}</p>
      </div>
      <div class="mt-14 grid gap-px overflow-hidden border border-slate-line bg-slate-line md:grid-cols-2">
        <RouterLink
          v-for="(a, i) in c.home.areas.items"
          :key="a.anchor"
          v-reveal="(i % 2) * 90"
          :to="areaHref(a.anchor)"
          class="group relative flex flex-col bg-slate p-8 transition-colors duration-300 hover:bg-slate-raised sm:p-10 lg:min-h-[19rem] lg:p-12"
        >
          <span
            class="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-brass-deep via-brass-light to-brass-deep transition-transform duration-500 group-hover:scale-x-100"
            aria-hidden="true"
          ></span>
          <h3 class="font-display text-[1.75rem] leading-tight text-ivory transition-colors group-hover:text-brass-light sm:text-[2rem]">{{ a.title }}</h3>
          <p class="mt-4 max-w-md flex-1 text-mist">{{ a.text }}</p>
          <span class="mt-8 text-sm font-semibold text-brass-text">{{ c.home.areas.link }}</span>
        </RouterLink>
      </div>
    </div>
  </section>
  
  <!-- AVALIAÇÕES -->
  <section class="section" aria-labelledby="reviews-title">
    <div class="container-site">
      <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="reviews-title" class="text-[2.2rem] text-ivory sm:text-[2.8rem]">{{ c.home.reviews.title }}</h2>
          <p class="mt-4 flex items-center gap-2 text-brass-text"><AppIcon name="google" :size="18" />{{ c.home.reviews.sub }}</p>
        </div>
        <a :href="CONTACT.googleReviews" target="_blank" rel="noopener" class="link-brass self-start font-semibold md:self-auto">{{ c.home.reviews.link }}</a>
      </div>
      <div class="mt-12">
        <ReviewsCarousel :items="c.home.reviews.items" :source-label="c.ui.reviewsFrom" />
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="relative overflow-hidden" aria-labelledby="final-title">
    <hr class="rule-brass" />
    <div class="final-band">
      <div class="container-site section relative">
        <img
          src="/img/logo-simbolo.webp"
          width="124"
          height="112"
          alt=""
          aria-hidden="true"
          loading="lazy"
          class="pointer-events-none absolute -right-6 top-1/2 hidden w-[26rem] -translate-y-1/2 opacity-[0.07] lg:block"
        />
        <div class="relative max-w-3xl" v-reveal>
          <h2 id="final-title" class="text-[2.4rem] leading-[1.08] text-ivory sm:text-[3.4rem]">{{ c.home.final.title }}</h2>
          <p class="mt-6 max-w-xl text-lg text-mist">{{ c.home.final.text }}</p>
          <div class="mt-10 flex flex-col gap-3 sm:flex-row">
            <a :href="book()" target="_blank" rel="noopener" class="btn-brass"
              ><AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ hasBooking ? c.ui.book : c.home.final.ctaPrimary }}</a
            >
            <a :href="`mailto:${CONTACT.email}`" class="btn-ghost"><AppIcon name="mail" :size="18" />{{ c.home.final.ctaSecondary }}</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-figure {
  container-type: inline-size;
}
.hero-photo {
  -webkit-mask-image: linear-gradient(to bottom, #000 72%, transparent 99%), linear-gradient(to left, transparent 0%, #000 6%);
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(to bottom, #000 72%, transparent 99%), linear-gradient(to left, transparent 0%, #000 6%);
  mask-composite: intersect;
}
.golden-band {
  background:
    radial-gradient(80% 120% at 85% 10%, rgba(201, 165, 90, 0.11), transparent 60%),
    linear-gradient(180deg, #20242b, #1a1d23);
}
.final-band {
  background: radial-gradient(70% 140% at 20% 100%, rgba(201, 165, 90, 0.09), transparent 60%), #15181d;
}
</style>
