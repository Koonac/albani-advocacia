<script setup>
import { useSite } from '../composables/useSite.js'
import { CONTACT, waLink } from '../config/site.js'
import AppIcon from './AppIcon.vue'

const { c, lp, wa } = useSite()
const year = 2026
const nav = ['home', 'about', 'areas', 'blog', 'faq', 'contact']
</script>

<template>
  <footer class="relative mt-auto bg-slate-deep/80">
    <hr class="rule-brass" />
    <div class="container-site grid gap-12 py-16 md:grid-cols-12 lg:py-20">
      <div class="md:col-span-5">
        <img src="/img/logo-completo.webp" width="640" height="265" alt="Albani Advocacia" class="h-auto w-56" loading="lazy" />
        <p class="mt-6 max-w-sm text-mist">{{ c.footer.signature }}</p>
        <p class="mt-5 text-sm text-ivory/80">{{ c.footer.credentials }}</p>
      </div>

      <nav class="md:col-span-2" :aria-label="c.footer.navTitle">
        <h2 class="mb-4 font-display text-lg text-brass-text">{{ c.footer.navTitle }}</h2>
        <ul class="space-y-2.5">
          <li v-for="k in nav" :key="k">
            <RouterLink :to="lp(k)" class="text-ivory/80 transition-colors hover:text-brass-light">{{ c.nav[k] }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="md:col-span-5 lg:col-span-5">
        <h2 class="mb-4 font-display text-lg text-brass-text">{{ c.footer.contactTitle }}</h2>
        <ul class="space-y-3 text-ivory/85">
          <li>
            <a :href="wa()" target="_blank" rel="noopener" class="group flex items-start gap-3 hover:text-brass-light">
              <AppIcon name="whatsapp" :size="18" class="mt-1 shrink-0 text-brass" />
              <span>{{ c.footer.whatsappPT }} {{ CONTACT.whatsappPTLabel }}</span>
            </a>
          </li>
          <li>
            <a :href="waLink(c.whatsappDefault, CONTACT.whatsappBR)" target="_blank" rel="noopener" class="flex items-start gap-3 hover:text-brass-light">
              <AppIcon name="whatsapp" :size="18" class="mt-1 shrink-0 text-brass" />
              <span>{{ c.footer.whatsappBR }} {{ CONTACT.whatsappBRLabel }}</span>
            </a>
          </li>
          <li>
            <a :href="`mailto:${CONTACT.email}`" class="flex items-start gap-3 hover:text-brass-light">
              <AppIcon name="mail" :size="18" class="mt-1 shrink-0 text-brass" />
              <span>{{ CONTACT.email }}</span>
            </a>
          </li>
          <li>
            <a :href="`mailto:${CONTACT.emailOrdem}`" class="flex items-start gap-3 break-all hover:text-brass-light">
              <AppIcon name="mail" :size="18" class="mt-1 shrink-0 text-brass" />
              <span>{{ CONTACT.emailOrdem }}</span>
            </a>
          </li>
          <li>
            <a :href="CONTACT.instagram" target="_blank" rel="noopener" class="flex items-start gap-3 hover:text-brass-light">
              <AppIcon name="instagram" :size="18" class="mt-1 shrink-0 text-brass" />
              <span>{{ c.footer.instagram }} {{ CONTACT.instagramHandle }}</span>
            </a>
          </li>
          <li>
            <a :href="CONTACT.facebook" target="_blank" rel="noopener" class="flex items-start gap-3 hover:text-brass-light">
              <AppIcon name="facebook" :size="18" class="mt-1 shrink-0 text-brass" />
              <span>{{ c.footer.facebook }} {{ CONTACT.facebookHandle }}</span>
            </a>
          </li>
          <li class="flex items-start gap-3 pt-1">
            <AppIcon name="pin" :size="18" class="mt-1 shrink-0 text-brass" />
            <address class="not-italic">{{ c.footer.address }}</address>
          </li>
        </ul>
      </div>
    </div>
    <div class="border-t border-slate-line/70">
      <div class="container-site flex flex-col gap-2 py-6 text-sm text-mist sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <p>{{ c.footer.legal.replace('©', `© ${year}`) }}</p>
        <p class="shrink-0">
          {{ c.footer.devBy }}
          <a href="https://henrique.kaedai.com.br" target="_blank" rel="noopener" class="link-brass">KaedAI</a>
        </p>
      </div>
    </div>
  </footer>
</template>
