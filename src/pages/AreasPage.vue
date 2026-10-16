<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import { isEnabled } from '../config/features.js'
import AppIcon from '../components/AppIcon.vue'
import ServiceList from '../components/ServiceList.vue'

const { c, wa, waService, bookService, hasBooking } = useSite()

// Serviços vão para o agendamento da consulta; "Documentos e Registos" vai direto para o WhatsApp
const viaWhatsApp = (cat) => cat.id === 'documentos'
const ctaHref = (cat, label) => (viaWhatsApp(cat) ? waService(label) : bookService(label))
const ctaIcon = (cat) => (viaWhatsApp(cat) || !hasBooking ? 'whatsapp' : 'calendar')
useSeo(() => ({ key: 'areas', title: c.value.meta.areas.title, description: c.value.meta.areas.description }))

const route = useRoute()
const router = useRouter()

const cats = computed(() => c.value.areas.categories)
const nationalityItems = (n) => n.items.filter((i) => isEnabled(i.flag)).map((i) => i.label)

const filter = ref('all')
const pendingScroll = ref(null)
const visibleCats = computed(() =>
  filter.value === 'all' ? cats.value : cats.value.filter((cat) => cat.id === filter.value),
)

/** Resolve âncora (categoria ou sub-seção) → id da categoria pai */
function categoryForHash(hash) {
  if (!hash) return null
  const id = hash.replace(/^#/, '')
  for (const cat of cats.value) {
    if (cat.id === id) return cat.id
    if (cat.nationality?.id === id) return cat.id
    if (cat.complementary?.id === id) return cat.id
    if (id === 'golden-visa' && cat.golden) return cat.id
  }
  return null
}

function applyHash(hash) {
  const next = categoryForHash(hash) ?? 'all'
  if (next === filter.value) return
  pendingScroll.value = next === 'all' ? null : next
  filter.value = next
}

function setFilter(id) {
  if (id === filter.value) return
  pendingScroll.value = id === 'all' ? null : id
  filter.value = id
  const path = route.path
  if (id === 'all') {
    if (route.hash) router.replace({ path, hash: '' })
  } else {
    router.replace({ path, hash: `#${id}` })
  }
}

function onFilterEntered() {
  const id = pendingScroll.value
  pendingScroll.value = null
  if (!id) return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(
  () => route.hash,
  (hash) => applyHash(hash),
  { immediate: true },
)
</script>

<template>
  <section class="pt-32 lg:pt-44">
    <div class="container-site">
      <h1 class="text-[3rem] leading-none text-ivory sm:text-[4.4rem] lg:text-[5.2rem]">{{ c.areas.headline }}</h1>
      <p class="mt-7 max-w-2xl text-lg leading-relaxed text-mist lg:text-xl">{{ c.areas.intro }}</p>
    </div>
  </section>

  <!-- Filtros por categoria -->
  <nav class="sticky top-[4.5rem] z-30 mt-12 border-y border-slate-line/70 bg-slate/90 backdrop-blur-md lg:top-20" :aria-label="c.nav.areas">
    <div class="container-site">
      <ul class="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-3 md:mx-0 md:flex-wrap md:px-0" role="list">
        <li class="shrink-0">
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-sm transition-colors"
            :class="filter === 'all' ? 'border-brass bg-brass/15 text-brass-light' : 'border-slate-line text-ivory/80 hover:border-brass/60 hover:text-ivory'"
            :aria-pressed="filter === 'all'"
            @click="setFilter('all')"
          >
            {{ c.areas.filterAll }}
          </button>
        </li>
        <li v-for="cat in cats" :key="cat.id" class="shrink-0">
          <button
            type="button"
            class="rounded-full border px-4 py-2 text-sm transition-colors"
            :class="filter === cat.id ? 'border-brass bg-brass/15 text-brass-light' : 'border-slate-line text-ivory/80 hover:border-brass/60 hover:text-ivory'"
            :aria-pressed="filter === cat.id"
            @click="setFilter(cat.id)"
          >
            {{ cat.title }}
          </button>
        </li>
      </ul>
    </div>
  </nav>

  <div class="container-site">
    <Transition name="areas-filter" mode="out-in" @after-enter="onFilterEntered">
      <div :key="filter">
    <section
      v-for="cat in visibleCats"
      :id="cat.id"
      :key="cat.id"
      class="grid scroll-mt-40 gap-10 border-b border-slate-line/70 py-20 last:border-b-0 lg:grid-cols-12 lg:gap-16 lg:py-28"
      :aria-labelledby="`${cat.id}-title`"
    >
      <!-- Coluna de título -->
      <header class="lg:col-span-4">
        <div class="lg:sticky lg:top-44">
          <h2 :id="`${cat.id}-title`" class="text-[2.2rem] text-ivory sm:text-[2.8rem]">{{ cat.title }}</h2>
          <p v-if="cat.opening" class="mt-5 font-display text-[1.3rem] leading-snug text-brass-text">{{ cat.opening }}</p>
          <p v-if="cat.text" class="mt-5 text-mist">{{ cat.text }}</p>
          <a :href="ctaHref(cat, cat.title)" target="_blank" rel="noopener" class="btn-brass mt-8">
            <AppIcon :name="ctaIcon(cat)" :size="20" />{{ cat.cta ?? c.areas.serviceCta }}
          </a>
        </div>
      </header>

      <!-- Conteúdo -->
      <div class="space-y-14 lg:col-span-8">
        <!-- destaque (imobiliário/laboral) -->
        <a
          v-if="cat.featured"
          :href="ctaHref(cat, cat.featured)"
          target="_blank"
          rel="noopener"
          class="group flex items-center justify-between gap-6 border border-brass/45 bg-gradient-to-r from-brass/12 to-transparent px-6 py-6 transition-colors hover:border-brass-light sm:px-8"
        >
          <span class="font-display text-[1.5rem] leading-tight text-ivory group-hover:text-brass-light sm:text-[1.8rem]">{{ cat.featured }}</span>
          <AppIcon :name="ctaIcon(cat)" :size="22" class="shrink-0 text-brass" />
        </a>

        <!-- cartões grandes (documentos) -->
        <ul v-if="cat.highlights" class="grid gap-px border border-slate-line bg-slate-line sm:grid-cols-2">
          <li v-for="h in cat.highlights" :key="h">
            <a
              :href="ctaHref(cat, h)"
              target="_blank"
              rel="noopener"
              class="group flex h-full min-h-[8.5rem] flex-col justify-between gap-6 bg-slate p-6 transition-colors hover:bg-slate-raised sm:p-7"
            >
              <span class="font-display text-[1.4rem] leading-snug text-ivory group-hover:text-brass-light">{{ h }}</span>
              <span class="flex items-center gap-2 text-sm text-brass-text"><AppIcon :name="ctaIcon(cat)" :size="16" />{{ c.areas.serviceCta }}</span>
            </a>
          </li>
        </ul>
        <div v-if="cat.also">
          <h3 class="mb-3 text-sm text-mist">{{ c.areas.alsoLabel }}</h3>
          <ServiceList :items="cat.also" :whatsapp="viaWhatsApp(cat)" />
        </div>

        <!-- grupos -->
        <div v-for="(g, gi) in cat.groups ?? []" :key="gi">
          <h3 v-if="g.title" class="mb-4 font-display text-[1.45rem] text-ivory">{{ g.title }}</h3>
          <ServiceList :items="g.items" :whatsapp="viaWhatsApp(cat)" />
        </div>

        <!-- Golden Visa (cartão em destaque, copy do bloco da Início) -->
        <article v-if="cat.golden" id="golden-visa" class="golden-card relative scroll-mt-40 overflow-hidden border border-brass/50 p-7 sm:p-10">
          <p class="kicker">{{ c.home.golden.eyebrow }}</p>
          <h3 class="mt-5 text-[1.9rem] leading-tight text-metal sm:text-[2.4rem]">{{ c.home.golden.title }}</h3>
          <p class="mt-5 text-ivory/85">{{ c.home.golden.text }}</p>
          <ul class="mt-6 grid gap-3 sm:grid-cols-2">
            <li v-for="b in c.home.golden.bullets" :key="b" class="flex gap-3 text-ivory">
              <AppIcon name="check" :size="18" class="mt-1 shrink-0 text-brass-light" />{{ b }}
            </li>
          </ul>
          <a :href="bookService('Golden Visa')" target="_blank" rel="noopener" class="btn-brass mt-8">
            <AppIcon :name="ctaIcon(cat)" :size="20" />{{ c.home.golden.cta }}
          </a>
          <p class="mt-6 text-sm text-mist">{{ c.home.golden.note }}</p>
        </article>

        <!-- Nacionalidade -->
        <div v-if="cat.nationality" :id="cat.nationality.id" class="scroll-mt-40">
          <h3 class="mb-4 font-display text-[1.45rem] text-ivory">{{ cat.nationality.title }}</h3>
          <ServiceList :items="nationalityItems(cat.nationality)" />
          <h4 class="mb-3 mt-8 text-sm text-mist">{{ cat.nationality.relatedTitle }}</h4>
          <ServiceList :items="cat.nationality.related" />
        </div>

        <!-- Complementares / AIMA -->
        <div v-if="cat.complementary" :id="cat.complementary.id" class="scroll-mt-40">
          <h3 class="mb-4 font-display text-[1.45rem] text-ivory">{{ cat.complementary.title }}</h3>
          <ServiceList :items="cat.complementary.items" />
        </div>
      </div>
    </section>
      </div>
    </Transition>
  </div>

  <div class="container-site pb-24">
    <div class="flex flex-col items-start gap-5 border-t border-brass/40 pt-10 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-lg text-mist">
        {{ c.megaMenu.footerLead }}
        <a :href="wa()" target="_blank" rel="noopener" class="link-brass ml-1 font-semibold">{{ c.megaMenu.footerLink }}</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.golden-card {
  background: radial-gradient(90% 120% at 100% 0%, rgba(201, 165, 90, 0.14), transparent 60%), #1f232a;
}
.areas-filter-enter-active,
.areas-filter-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}
.areas-filter-enter-from {
  opacity: 0;
  transform: translateY(0.65rem);
}
.areas-filter-leave-to {
  opacity: 0;
  transform: translateY(-0.35rem);
}
</style>
