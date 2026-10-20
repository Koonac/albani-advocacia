<script setup>
import { ref, computed } from 'vue'
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import { CONTACT } from '../config/site.js'
import { HOME_VIDEO } from '../content/home.js'
import AppIcon from '../components/AppIcon.vue'
import AppDialog from '../components/AppDialog.vue'
import HeroMap from '../components/HeroMap.vue'
import VideoFacade from '../components/VideoFacade.vue'
import ReviewsCarousel from '../components/ReviewsCarousel.vue'

const { c, wa, waService, book, hasBooking } = useSite()
useSeo(() => ({ key: 'home', title: c.value.meta.home.title, description: c.value.meta.home.description }))

// Modal de serviço: guarda o índice (e não o objeto) para acompanhar a troca de idioma
const serviceDialog = ref(null)
const serviceIndex = ref(0)
const service = computed(() => c.value.home.services.items[serviceIndex.value])
function openService(i) {
  serviceIndex.value = i
  serviceDialog.value.open()
}
const pad = (i) => String(i + 1).padStart(2, '0')
</script>

<template>
  <!-- HERO -->
  <!-- Fundo: Estátua da Liberdade + Torre de Belém, escurecido e dissolvido na base. Desktop: texto à
       esquerda, foto + mapa à direita (a figura ocupa a coluna inteira, por isso o mapa pontilhado,
       medido em cqw da figura, fica maior). Mobile: texto e depois a foto. -->
  <section class="hero relative isolate overflow-hidden border-b border-white/5 pt-[4.5rem] lg:pt-20">
    <picture class="hero-landmarks" aria-hidden="true">
      <source
        type="image/avif"
        srcset="/img/hero-monumentos-960.avif 960w, /img/hero-monumentos-1536.avif 1536w, /img/hero-monumentos-2304.avif 2304w"
        sizes="(min-width: 761px) 140vw, 1150px"
      />
      <source
        type="image/webp"
        srcset="/img/hero-monumentos-960.webp 960w, /img/hero-monumentos-1536.webp 1536w, /img/hero-monumentos-2304.webp 2304w"
        sizes="(min-width: 761px) 140vw, 1150px"
      />
      <img src="/img/hero-monumentos-1536.webp" width="1835" height="1024" alt="" decoding="async" fetchpriority="low" />
    </picture>
    <div class="hero-inner container-site">
      <div class="hero-copy">
        <p class="eyebrow hero-eyebrow">{{ c.home.hero.eyebrow }}</p>
        <h1 class="hero-title text-ivory">
          {{ c.home.hero.headline }} <em class="not-italic text-[#d8ba7a]">{{ c.home.hero.headlineEm }}</em>
        </h1>
        <p class="hero-lead">{{ c.home.hero.lead }}</p>
        <p class="hero-description">{{ c.home.hero.description }}</p>
        <div class="hero-actions">
          <a href="#servicos" class="btn-brass">{{ c.home.hero.ctaPrimary }} <span aria-hidden="true">↗</span></a>
          <a :href="wa()" target="_blank" rel="noopener" class="hero-link">{{ c.home.hero.ctaSecondary }} →</a>
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
        <p class="hero-credential">
          <span class="tiny-line" aria-hidden="true"></span>{{ c.home.hero.credential }}<br />
          <span class="text-[#d6b777]">{{ c.home.hero.credentialNumbers }}</span>
        </p>
      </div>

      <!-- Foto + mapa ancorado à figura (unidades cqw: o triângulo BR/EUA/PT acompanha a foto em qualquer tela). -->
      <div class="hero-figure">
        <HeroMap :labels="c.home.hero.mapLabels" />
        <picture class="relative z-[1] block">
          <source
            type="image/avif"
            srcset="/img/dr-ivan-corpo-420.avif 420w, /img/dr-ivan-corpo-640.avif 640w, /img/dr-ivan-corpo-772.avif 772w"
            sizes="(min-width: 1024px) 40rem, 80vw"
          />
          <source
            type="image/webp"
            srcset="/img/dr-ivan-corpo-420.webp 420w, /img/dr-ivan-corpo-640.webp 640w, /img/dr-ivan-corpo-772.webp 772w"
            sizes="(min-width: 1024px) 40rem, 80vw"
          />
          <img
            src="/img/dr-ivan-corpo-640.webp"
            width="772"
            height="1223"
            :alt="c.home.hero.photoAlt"
            fetchpriority="high"
            decoding="async"
            class="hero-photo"
          />
        </picture>
        <div class="name-tag">
          <p class="font-display text-ivory">{{ c.home.hero.badge.name }}</p>
          <p class="mt-[3px] text-[0.625rem] text-[#d0b67f]">{{ c.home.hero.badge.role }}</p>
        </div>
      </div>
    </div>
    <a href="#servicos" class="scroll-note">{{ c.home.hero.scrollNote }} <span aria-hidden="true">↓</span></a>
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

  <!-- ETAPAS -->
  <section class="section bg-[#1d2227]" aria-labelledby="etapas-title">
    <div class="container-site">
      <p class="eyebrow">{{ c.home.steps.eyebrow }}</p>
      <h2 id="etapas-title" class="mt-6 text-[2.1875rem] text-ivory sm:text-[clamp(2rem,3.2vw,3rem)]">{{ c.home.steps.title }}</h2>
      <ol class="steps mt-8 grid gap-8 md:mt-12 md:grid-cols-3 md:gap-10">
        <li v-for="(s, i) in c.home.steps.items" :key="s.title" v-reveal="i * 90" class="step">
          <span class="step-number" aria-hidden="true">{{ pad(i) }}</span>
          <h3 class="step-title text-ivory">{{ s.title }}</h3>
          <p class="step-text">{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>

  <!-- ÁREAS DE ATUAÇÃO (grade 3x2; cada cartão abre o modal do serviço) -->
  <section id="servicos" class="section" aria-labelledby="areas-title">
    <div class="container-site">
      <div class="mb-8 md:mb-11 md:flex md:items-end md:justify-between md:gap-14">
        <div>
          <p class="eyebrow">{{ c.home.services.eyebrow }}</p>
          <h2 id="areas-title" class="mt-6 text-[2.1875rem] text-ivory sm:text-[clamp(2rem,3.2vw,3rem)]">
            {{ c.home.services.title }}<br /><em class="not-italic text-[#d8ba7a]">{{ c.home.services.titleEm }}</em>
          </h2>
        </div>
        <p class="mt-5 text-[0.875rem] text-[#babfc2] md:mb-0.5 md:mt-0 md:max-w-[21.5rem] md:text-[0.9375rem]">{{ c.home.services.intro }}</p>
      </div>
      <div class="service-grid">
        <button
          v-for="(s, i) in c.home.services.items"
          :key="s.title"
          type="button"
          class="service-card group"
          aria-haspopup="dialog"
          @click="openService(i)"
        >
          <span class="card-top"><span>{{ s.country }}</span><span class="text-[#697076]">{{ pad(i) }}</span></span>
          <h3 class="service-title text-ivory transition-colors group-hover:text-brass-light">{{ s.title }}</h3>
          <p class="service-summary">{{ s.summary }}</p>
          <span class="card-link">{{ c.home.services.cardLink }} <span aria-hidden="true">↗</span></span>
        </button>
      </div>
      <p class="mt-7 text-center text-[0.75rem] text-[#babfc2] sm:text-[0.8125rem]">
        {{ c.home.services.footLead }}
        <a :href="wa()" target="_blank" rel="noopener" class="text-[#dec38c] transition-colors hover:text-brass-light">{{ c.home.services.footLink }}</a>
      </p>
    </div>
  </section>

  <AppDialog ref="serviceDialog" :close-label="c.ui.close">
    <p class="eyebrow">{{ service.country }}</p>
    <h2 class="text-ivory">{{ service.title }}</h2>
    <p>{{ service.description }}</p>
    <ul>
      <li v-for="b in service.bullets" :key="b">{{ b }}</li>
    </ul>
    <p class="border-t border-white/12 pt-5 !text-[0.75rem]">{{ c.home.services.dialogNote }}</p>
    <a :href="waService(service.title)" target="_blank" rel="noopener" class="btn-brass">
      <AppIcon name="whatsapp" :size="20" />{{ c.home.services.dialogCta }} <span aria-hidden="true">↗</span>
    </a>
  </AppDialog>

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
/* ---------- Hero (medidas da prévia aprovada pelo escritório) ---------- */
.hero-landmarks {
  position: absolute;
  inset: 0;
  z-index: -2;
  opacity: 0.34;
  -webkit-mask-image: linear-gradient(#000 70%, transparent);
  mask-image: linear-gradient(#000 70%, transparent);
}
/* --cl = início do texto (borda interna do .container-site). A estátua termina em 25% da largura da
   imagem (scripts/compose-hero-bg.cjs), então translate(-25%) a encosta à esquerda do texto, sem
   ficar atrás dele. A largura é a menor que ainda cobre o hero inteiro (direita, esquerda e altura). */
.hero {
  --pad: 2rem;
  --cl: max(var(--pad), calc((100% - 80rem) / 2 + var(--pad)));
}
@media (min-width: 1280px) {
  .hero { --pad: 3rem; }
}
.hero-landmarks img {
  position: absolute;
  top: 58%;
  left: calc(var(--cl) - 1.25rem);
  width: max(calc((100% - var(--cl) + 1.25rem) / 0.75), calc((var(--cl) - 1.25rem) * 4), calc(100svh * 1.8));
  max-width: none;
  height: auto;
  transform: translate(-25%, -58%);
}
/* Escurece atrás do texto, mas deixa a faixa da estátua (antes do texto) mais clara */
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    90deg,
    rgba(26, 29, 35, 0.25) 0%,
    rgba(26, 29, 35, 0.25) calc(var(--cl) - 1.5rem),
    rgba(26, 29, 35, 0.83) calc(var(--cl) + 3rem),
    rgba(26, 29, 35, 0.55) 43%,
    transparent 100%
  );
}
.hero-inner {
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 20px;
  min-height: 710px;
}
.hero-copy {
  position: relative;
  z-index: 5;
  padding: 55px 0 100px;
}
.hero-eyebrow { margin-bottom: 23px; }
.hero-title {
  font-size: clamp(42px, 4.4vw, 68px);
  line-height: 1.14;
  letter-spacing: -1.6px;
}
.hero-lead {
  max-width: 430px;
  margin: 25px 0 12px;
  font-size: 19px;
  color: #e5dfd4;
}
.hero-description {
  max-width: 445px;
  font-size: 15px;
  line-height: 1.75;
  color: #babfc2;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 30px;
}
.hero-link {
  font-size: 14px;
  color: #dfc387;
  transition: color 0.2s ease;
}
.hero-link:hover { color: #ecd49d; }
.hero-credential {
  margin-top: 35px;
  font-size: 12px;
  line-height: 1.8;
  color: #c5c6c3;
}
.tiny-line {
  display: inline-block;
  width: 24px;
  height: 1px;
  margin-right: 9px;
  vertical-align: middle;
  background: #c8a969;
}
.hero-figure {
  position: relative;
  align-self: end;
  justify-self: start;
  /* A figura tem a largura exata da foto (o mapa em cqw é calibrado sobre ela: EUA à esquerda da
     cabeça, Portugal à direita, Brasil aos pés). A altura da tela limita o tamanho, para o Brasil
     não sair pela base do hero. Margem esquerda negativa puxa foto + mapa para o centro. */
  width: 100%;
  max-width: clamp(28rem, calc((100svh - 5rem) * 0.66), 36rem);
  min-width: 0;
  margin-left: -40px;
  container-type: inline-size;
}
.hero-photo {
  position: relative;
  display: block;
  width: 100%;
  height: auto;
  -webkit-mask-image: linear-gradient(#000 75%, transparent 99%);
  mask-image: linear-gradient(#000 75%, transparent 99%);
}
.name-tag {
  position: absolute;
  /* Na altura das mãos, à esquerda: deixa livre o Brasil do mapa, aos pés da figura */
  bottom: 30%;
  left: -8%;
  z-index: 4;
  padding: 14px 22px;
  background: rgba(21, 25, 29, 0.91);
  border-left: 2px solid #caaa65;
  backdrop-filter: blur(8px);
}
.name-tag > p:first-child { font-size: 23px; line-height: 1.14; }
.scroll-note {
  position: absolute;
  bottom: 28px;
  left: 4%;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #a8adb1;
  transition: color 0.2s ease;
}
.scroll-note:hover { color: #ecd49d; }
.scroll-note span { padding-left: 18px; color: #d6b777; }

@media (min-width: 1400px) {
  .hero-inner { min-height: 740px; }
  .hero-copy { padding-top: 65px; }
  .hero-figure { margin-left: -55px; }
}
@media (max-width: 1050px) {
  .hero-inner { min-height: 630px; }
  .hero-copy { padding-bottom: 80px; }
  .hero-title { font-size: 49px; }
  .hero-figure { margin-left: -20px; }
  .hero-description { font-size: 14px; }
  .hero-actions { gap: 16px; flex-wrap: wrap; }
}
@media (max-width: 760px) {
  .hero-inner { grid-template-columns: 1fr; gap: 0; min-height: 0; }
  .hero-copy { padding: 43px 0 12px; }
  .hero-eyebrow { font-size: 9px; letter-spacing: 1.5px; margin-bottom: 22px; }
  .hero-title { font-size: 42px; line-height: 1.13; letter-spacing: -1px; max-width: 540px; }
  .hero-lead { font-size: 17px; margin-top: 22px; }
  .hero-description { font-size: 14px; max-width: 100%; }
  .hero-credential { margin-top: 25px; }
  .hero-actions { margin-top: 24px; gap: 18px; }
  .hero-actions .btn-brass { min-height: 0; padding: 12px 16px; font-size: 12px; }
  .hero-link { font-size: 12px; }
  .hero-figure { justify-self: center; margin: 5px auto 0; width: 80%; max-width: 340px; }
  .name-tag { left: -4%; bottom: 30%; padding: 11px 16px; }
  .name-tag > p:first-child { font-size: 21px; }
  .scroll-note { display: none; }
  .hero-landmarks { opacity: 0.32; }
  .hero-landmarks img {
    position: absolute;
    top: auto;
    bottom: 0;
    left: 50%;
    width: auto;
    max-width: none;
    height: 640px;
    transform: translateX(-50%);
  }
  .hero::before { background: linear-gradient(#1a1d23 0%, rgba(26, 29, 35, 0.75) 50%, transparent); }
}

/* ---------- Etapas ---------- */
.step {
  padding-top: 25px;
  border-top: 1px solid #665b42;
}
.step-number {
  font-family: var(--font-display);
  font-size: 50px;
  line-height: 1.14;
  color: #d0ae6c;
}
.step-title { margin: 24px 0 16px; font-size: 25px; }
.step-text { font-size: 14px; color: #babfc2; }
@media (max-width: 767.98px) {
  .step { display: grid; grid-template-columns: 55px 1fr; column-gap: 20px; }
  .step-number { grid-row: span 2; font-size: 42px; }
  .step-title { margin: 5px 0 12px; font-size: 24px; }
  .step-text { grid-column: 2; }
}

/* ---------- Áreas de atuação ---------- */
.service-grid {
  display: grid;
  grid-template-columns: 1fr;
  border-left: 1px solid rgba(255, 255, 255, 0.094);
  border-top: 1px solid rgba(255, 255, 255, 0.094);
}
@media (min-width: 640px) { .service-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .service-grid { grid-template-columns: repeat(3, 1fr); } }
.service-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 285px;
  padding: 29px;
  text-align: left;
  border-right: 1px solid rgba(255, 255, 255, 0.094);
  border-bottom: 1px solid rgba(255, 255, 255, 0.094);
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.service-card:hover { background: #22282d; }
.card-top {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 26px;
  font-size: 10px;
  letter-spacing: 1.3px;
  text-transform: uppercase;
  color: #c7aa71;
}
.service-title { max-width: 240px; margin-bottom: 16px; font-size: 25px; }
.service-summary { max-width: 280px; font-size: 14px; line-height: 1.65; color: #babfc2; }
.card-link {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  padding-top: 15px;
  font-size: 12px;
  color: #dec38c;
}
@media (max-width: 1050px) { .service-card { padding: 24px; } }
@media (max-width: 639.98px) {
  .service-card { min-height: 0; padding: 25px; }
  .card-top { margin-bottom: 18px; }
  .service-title, .service-summary { max-width: none; }
  .card-link { padding-top: 7px; }
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
