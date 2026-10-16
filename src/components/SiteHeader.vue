<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSite } from '../composables/useSite.js'
import { pathFor } from '../config/routes-map.js'
import { findPostBySlug } from '../content/posts/index.js'
import AppIcon from './AppIcon.vue'

const { c, locale, lp, wa, book, hasBooking } = useSite()
const route = useRoute()

const scrolled = ref(false)
const megaOpen = ref(false)
const mobileOpen = ref(false)
const mobileAreasOpen = ref(false)
let closeTimer = null

const links = computed(() => [
  { key: 'home', label: c.value.nav.home },
  { key: 'about', label: c.value.nav.about },
  { key: 'areas', label: c.value.nav.areas, mega: true },
  { key: 'blog', label: c.value.nav.blog },
  { key: 'contact', label: c.value.nav.contact },
])

const isActive = (key) => route.meta.key === key || (key === 'blog' && route.meta.key === 'post')

// Rota equivalente no outro idioma (inclui artigo do blog com slug traduzido)
const otherLocale = computed(() => (locale.value === 'pt' ? 'en' : 'pt'))
const altPath = computed(() => {
  const key = route.meta.key
  if (key === 'post') {
    const post = findPostBySlug(route.params.slug, locale.value)
    return post ? pathFor('post', otherLocale.value, { id: post.id }) : pathFor('blog', otherLocale.value)
  }
  return pathFor(key ?? 'home', otherLocale.value) + (route.hash || '')
})

const areaHref = (anchor) => `${lp('areas')}#${anchor}`

function openMega() {
  clearTimeout(closeTimer)
  megaOpen.value = true
}
function scheduleClose() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => (megaOpen.value = false), 160)
}
function onKey(e) {
  if (e.key === 'Escape') {
    megaOpen.value = false
    mobileOpen.value = false
  }
}
function onDocClick(e) {
  if (megaOpen.value && !e.target.closest('#mega-areas, [aria-controls="mega-areas"]')) megaOpen.value = false
}
const onScroll = () => (scrolled.value = window.scrollY > 24)

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', onKey)
  document.addEventListener('click', onDocClick)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', onKey)
  document.removeEventListener('click', onDocClick)
})

watch(
  () => route.fullPath,
  () => {
    megaOpen.value = false
    mobileOpen.value = false
  },
)
watch(mobileOpen, (v) => {
  if (typeof document !== 'undefined') document.documentElement.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
    :class="
      scrolled || megaOpen || mobileOpen
        ? 'border-b border-slate-line/70 bg-slate/[0.97] lg:bg-slate/90 lg:backdrop-blur-md'
        : 'border-b border-transparent bg-gradient-to-b from-slate-deep/80 to-transparent'
    "
  >
    <a
      href="#conteudo"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-slate-raised focus:px-4 focus:py-2"
      >{{ c.ui.skip }}</a
    >
    <div class="container-site flex h-[4.5rem] items-center gap-3 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
      <RouterLink :to="lp('home')" class="shrink-0 lg:justify-self-start" :aria-label="c.meta.siteName">
        <img src="/img/logo-simbolo.webp" width="124" height="112" alt="" class="h-10 w-auto sm:h-11 lg:h-12" decoding="async" />
      </RouterLink>

      <nav class="hidden lg:block" :aria-label="c.ui.mainNav">
        <ul class="flex items-center justify-center gap-1">
          <li v-for="l in links" :key="l.key" class="relative">
            <div v-if="l.mega" @mouseenter="openMega" @mouseleave="scheduleClose">
              <button
                type="button"
                class="group flex items-center gap-1.5 px-3 py-2 text-[0.95rem] transition-colors hover:text-brass-light"
                :class="isActive(l.key) || megaOpen ? 'text-brass-light' : 'text-ivory/85'"
                :aria-expanded="megaOpen"
                aria-controls="mega-areas"
                @click.stop="megaOpen = !megaOpen"
              >
                {{ l.label }}
                <AppIcon name="chevron" :size="16" class="transition-transform duration-300" :class="megaOpen && 'rotate-180'" />
              </button>
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                leave-active-class="transition duration-100 ease-in"
                leave-to-class="opacity-0 -translate-y-0.5"
              >
                <div
                  v-show="megaOpen"
                  id="mega-areas"
                  class="absolute left-0 top-full z-50 mt-1 hidden min-w-[15.5rem] border border-slate-line/80 bg-[#16191e] py-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.65)] lg:block"
                >
                  <ul>
                    <li v-for="col in c.megaMenu.columns" :key="col.anchor">
                      <RouterLink
                        :to="areaHref(col.anchor)"
                        class="block px-4 py-2 text-[0.92rem] leading-snug text-ivory/85 transition-colors hover:bg-slate-raised hover:text-brass-light"
                        >{{ col.title }}</RouterLink
                      >
                    </li>
                  </ul>
                  <div class="mt-1 border-t border-slate-line/70 px-4 py-2">
                    <RouterLink :to="lp('areas')" class="text-sm text-brass-text transition-colors hover:text-brass-light">{{
                      c.nav.areas
                    }}</RouterLink>
                  </div>
                </div>
              </Transition>
            </div>
            <RouterLink
              v-else
              :to="lp(l.key)"
              class="block px-3 py-2 text-[0.95rem] transition-colors hover:text-brass-light"
              :class="isActive(l.key) ? 'text-brass-light' : 'text-ivory/85'"
              :aria-current="isActive(l.key) ? 'page' : undefined"
              >{{ l.label }}</RouterLink
            >
          </li>
        </ul>
      </nav>

      <div class="ml-auto flex items-center justify-end gap-2 sm:gap-3 lg:ml-0 lg:justify-self-end">
        <RouterLink
          :to="altPath"
          :hreflang="otherLocale"
          :aria-label="c.ui.switchTo"
          class="flex h-10 items-center rounded-[2px] border border-slate-line px-2 text-sm sm:px-2.5 tracking-wide text-mist transition-colors hover:border-brass hover:text-brass-light"
        >
          <span :class="locale === 'pt' ? 'text-brass-light' : ''">PT</span>
          <span class="mx-1.5 h-3.5 w-px bg-slate-line" aria-hidden="true"></span>
          <span :class="locale === 'en' ? 'text-brass-light' : ''">EN</span>
        </RouterLink>
        <a :href="book()" target="_blank" rel="noopener" class="btn-brass hidden !min-h-11 !px-5 !py-2 text-[0.95rem] md:inline-flex">
          <AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="18" />{{ c.nav.cta }}
        </a>
        <button
          type="button"
          class="flex h-11 w-11 items-center justify-center rounded-[2px] border border-slate-line text-ivory lg:hidden"
          :aria-expanded="mobileOpen"
          aria-controls="menu-mobile"
          :aria-label="mobileOpen ? c.ui.closeMenu : c.ui.openMenu"
          @click="mobileOpen = !mobileOpen"
        >
          <AppIcon :name="mobileOpen ? 'close' : 'menu'" :size="22" />
        </button>
      </div>
    </div>

  </header>

  <!-- Menu mobile -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-show="mobileOpen"
      id="menu-mobile"
      class="fixed inset-x-0 bottom-0 top-[4.5rem] z-[45] overflow-y-auto bg-slate-deep lg:hidden"
    >
      <nav class="container-site flex min-h-full flex-col pb-10 pt-6">
        <ul class="divide-y divide-slate-line/70 border-y border-slate-line/70">
          <li v-for="l in links" :key="l.key">
            <template v-if="l.mega">
              <button
                type="button"
                class="flex w-full items-center justify-between py-4 text-left font-display text-2xl"
                :class="isActive(l.key) ? 'text-brass-light' : 'text-ivory'"
                :aria-expanded="mobileAreasOpen"
                aria-controls="mobile-areas"
                @click="mobileAreasOpen = !mobileAreasOpen"
              >
                {{ l.label }}
                <AppIcon name="chevron" :size="22" class="text-brass transition-transform" :class="mobileAreasOpen && 'rotate-180'" />
              </button>
              <ul v-show="mobileAreasOpen" id="mobile-areas" class="border-l border-slate-line pb-4 pl-3">
                <li v-for="col in c.megaMenu.columns" :key="col.anchor">
                  <RouterLink :to="areaHref(col.anchor)" class="block py-1.5 text-[0.95rem] text-ivory/85">{{ col.title }}</RouterLink>
                </li>
              </ul>
            </template>
            <RouterLink
              v-else
              :to="lp(l.key)"
              class="block py-4 font-display text-2xl"
              :class="isActive(l.key) ? 'text-brass-light' : 'text-ivory'"
              :aria-current="isActive(l.key) ? 'page' : undefined"
              >{{ l.label }}</RouterLink
            >
          </li>
        </ul>
        <a :href="book()" target="_blank" rel="noopener" class="btn-brass mt-8 w-full">
          <AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ c.nav.cta }}
        </a>
        <p class="mt-6 text-sm text-mist">
          {{ c.megaMenu.footerLead }}
          <a :href="wa()" target="_blank" rel="noopener" class="link-brass font-semibold">{{ c.megaMenu.footerLink }}</a>
        </p>
      </nav>
    </div>
  </Transition>
</template>
