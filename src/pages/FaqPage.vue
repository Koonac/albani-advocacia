<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import { matchesAll, searchTerms } from '../composables/search.js'
import AppIcon from '../components/AppIcon.vue'
import FaqList from '../components/FaqList.vue'

const { c, book, hasBooking } = useSite()

// `n` guarda a posição original do tema, para a numeração não mudar durante a busca
const groups = computed(() => c.value.faq.groups.map((g, n) => ({ ...g, n })))
const allItems = computed(() => groups.value.flatMap((g) => g.items))
const countLabel = computed(() =>
  c.value.faq.count.replace('{q}', allItems.value.length).replace('{t}', groups.value.length),
)
const num = (i) => String(i + 1).padStart(2, '0')

useSeo(() => ({
  key: 'faq',
  title: c.value.meta.faq.title,
  description: c.value.meta.faq.description,
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.value.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  },
}))

// Busca: título do tema + pergunta + resposta, todos os termos, sem diferenciar acentos
// ("renovação" traz o tema inteiro). No HTML pré-renderizado (e sem JS) a busca fica vazia e
// todas as perguntas aparecem.
const query = ref('')
const terms = computed(() => searchTerms(query.value))
const searching = computed(() => terms.value.length > 0)
const visibleGroups = computed(() =>
  searching.value
    ? groups.value
        .map((g) => ({ ...g, items: g.items.filter((i) => matchesAll(terms.value, g.title, g.short, i.q, i.a)) }))
        .filter((g) => g.items.length)
    : groups.value,
)
const resultCount = computed(() => visibleGroups.value.reduce((n, g) => n + g.items.length, 0))
const resultLabel = computed(() => {
  const s = c.value.faq.search
  return resultCount.value === 1 ? s.resultsOne : s.results.replace('{n}', resultCount.value)
})

// Índice de temas: âncoras comuns (funcionam sem JS); com JS, rolagem suave que respeita o
// scroll-margin das seções (o scrollBehavior do router usaria um deslocamento menor que o
// cabeçalho + barra de temas) e destaque do tema visível.
const active = ref(null)
let observer = null

function goTo(id, behavior = 'smooth') {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior, block: 'start' })
  // Mantém o state do vue-router no histórico
  history.replaceState(history.state, '', `#${id}`)
  active.value = id
}

function observeSections() {
  if (!observer) return
  observer.disconnect()
  for (const g of visibleGroups.value) {
    const el = document.getElementById(g.id)
    if (el) observer.observe(el)
  }
}

onMounted(async () => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id
    },
    { rootMargin: '-35% 0px -60% 0px' },
  )
  observeSections()
  const hash = decodeURIComponent(location.hash.slice(1))
  if (hash && groups.value.some((g) => g.id === hash)) {
    await nextTick()
    requestAnimationFrame(() => goTo(hash, 'auto'))
  }
})
onBeforeUnmount(() => observer?.disconnect())

// No celular a barra de temas rola na horizontal: mantém o tema ativo visível nela
const chips = ref(null)
watch(active, (id) => {
  const chip = chips.value?.querySelector(`a[href="#${id}"]`)
  const bar = chips.value
  if (!chip || bar.scrollWidth <= bar.clientWidth) return
  bar.scrollTo({ left: chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' })
})

// A cada busca: as seções mudam (observa de novo) e, se o início dos resultados ficou acima
// da tela, volta até ele, logo abaixo da barra fixa
const nav = ref(null)
const results = ref(null)
watch(terms, async () => {
  await nextTick()
  observeSections()
  active.value = visibleGroups.value[0]?.id ?? null
  const navBottom = nav.value?.getBoundingClientRect().bottom ?? 0
  const top = results.value?.getBoundingClientRect().top ?? 0
  if (top < navBottom) window.scrollTo({ top: window.scrollY + top - navBottom })
})

function clearSearch() {
  query.value = ''
}
</script>

<template>
  <section class="faq-band relative isolate overflow-hidden pb-14 pt-32 lg:pb-16 lg:pt-44">
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
      <h1 class="mt-6 max-w-[22ch] text-[2.4rem] leading-[1.08] text-ivory sm:text-[3.4rem] lg:text-[4rem]">{{ c.faq.title }}</h1>
      <p class="mt-6 max-w-xl text-lg text-mist lg:text-xl">{{ c.faq.intro }}</p>
      <p class="mt-5 text-sm tracking-wide text-brass-text">{{ countLabel }}</p>
    </div>
  </section>

  <!-- Busca + índice de temas -->
  <nav ref="nav" class="sticky top-[4.5rem] z-30 border-y border-slate-line/70 bg-slate/90 backdrop-blur-md lg:top-20" :aria-label="c.faq.navLabel">
    <div class="container-site flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
      <div class="relative lg:order-2 lg:w-64 lg:shrink-0">
        <label for="faq-search" class="sr-only">{{ c.faq.search.label }}</label>
        <AppIcon name="search" :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
        <input
          id="faq-search"
          v-model="query"
          type="search"
          autocomplete="off"
          enterkeyhint="search"
          :placeholder="c.faq.search.placeholder"
          class="faq-search w-full rounded-full border border-slate-line bg-slate-raised/60 py-2.5 pl-11 pr-10 text-sm text-ivory placeholder:text-mist/80 focus:border-brass/70 focus:outline-none"
          @keydown.esc="clearSearch"
        />
        <button
          v-if="query"
          type="button"
          class="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-mist transition-colors hover:text-ivory"
          :aria-label="c.faq.search.clear"
          @click="clearSearch"
        >
          <AppIcon name="close" :size="16" />
        </button>
      </div>
      <ul ref="chips" class="no-scrollbar relative -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0 lg:order-1" role="list">
        <li v-for="g in visibleGroups" :key="g.id" class="shrink-0">
          <a
            :href="`#${g.id}`"
            class="block rounded-full border px-4 py-2 text-sm transition-colors"
            :class="active === g.id ? 'border-brass bg-brass/15 text-brass-light' : 'border-slate-line text-ivory/80 hover:border-brass/60 hover:text-ivory'"
            :aria-current="active === g.id ? 'true' : undefined"
            @click.prevent="goTo(g.id)"
          >
            {{ g.short }}
          </a>
        </li>
      </ul>
    </div>
  </nav>

  <div ref="results" class="container-site">
    <!-- Resultado da busca (também anunciado para leitores de tela) -->
    <p class="sr-only" aria-live="polite">{{ searching ? resultLabel : '' }}</p>
    <div v-if="searching && resultCount" class="flex flex-wrap items-center gap-x-4 gap-y-1 pt-8 text-sm text-mist">
      <span>{{ resultLabel }}</span>
      <button type="button" class="text-brass-text underline-offset-4 hover:underline" @click="clearSearch">{{ c.faq.search.clear }}</button>
    </div>

    <div v-if="searching && !resultCount" class="py-20">
      <p class="font-display text-[1.6rem] leading-snug text-ivory sm:text-[2rem]">{{ c.faq.search.empty.replace('{q}', query.trim()) }}</p>
      <p class="mt-4 max-w-xl text-mist">{{ c.faq.search.emptyHint }}</p>
      <button type="button" class="mt-6 text-sm text-brass-text underline-offset-4 hover:underline" @click="clearSearch">{{ c.faq.search.clear }}</button>
    </div>

    <section
      v-for="g in visibleGroups"
      :id="g.id"
      :key="g.id"
      class="grid scroll-mt-48 gap-8 border-b border-slate-line/70 py-16 last-of-type:border-b-0 lg:scroll-mt-40 lg:grid-cols-12 lg:gap-16 lg:py-24"
      :aria-labelledby="`${g.id}-title`"
    >
      <header class="lg:col-span-4">
        <div class="lg:sticky lg:top-44">
          <!-- Sem font-display: no Marcellus o "01" parece "OI" -->
          <p class="text-sm font-semibold tabular-nums tracking-[0.2em] text-brass-text" aria-hidden="true">{{ num(g.n) }}</p>
          <h2 :id="`${g.id}-title`" class="mt-2 text-[2rem] leading-tight text-ivory sm:text-[2.5rem]">{{ g.title }}</h2>
        </div>
      </header>
      <div class="lg:col-span-8">
        <FaqList :items="g.items" :terms="terms" />
      </div>
    </section>

    <div class="flex flex-col items-start gap-5 pb-24 pt-14 sm:flex-row sm:items-center lg:pb-32">
      <p class="text-lg text-mist">{{ c.faq.ctaLead }}</p>
      <a :href="book()" target="_blank" rel="noopener" class="btn-brass">
        <AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ hasBooking ? c.ui.book : c.ui.bookWa }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.faq-watermark {
  opacity: 0.06;
}
/* O "x" nativo do input de busca duplicaria o botão de limpar */
.faq-search::-webkit-search-cancel-button {
  display: none;
}
</style>
