<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSite } from '../composables/useSite.js'
import { useSeo, orgJsonLd } from '../composables/useSeo.js'
import { SITE_URL } from '../config/site.js'
import { postPath } from '../config/routes-map.js'
import { POSTS, findPostBySlug, readingMinutes, bodyHtml } from '../content/posts/index.js'
import AppIcon from '../components/AppIcon.vue'
import PostListItem from '../components/PostListItem.vue'

const route = useRoute()
const { c, locale, lp, bookService, hasBooking, formatDate } = useSite()
const post = computed(() => findPostBySlug(route.params.slug, locale.value))
const related = computed(() => {
  if (!post.value) return []
  const same = POSTS.filter((p) => p.id !== post.value.id && p.category === post.value.category)
  const rest = POSTS.filter((p) => p.id !== post.value.id && p.category !== post.value.category)
  return [...same, ...rest].slice(0, 2)
})

const subtitle = computed(() => {
  const p = post.value
  if (!p) return ''
  return (p.subtitle?.[locale.value] || p.excerpt?.[locale.value] || '').trim()
})

const shareUrl = computed(() => (post.value ? `${SITE_URL}${postPath(post.value, locale.value)}` : SITE_URL))
const shareTitle = computed(() => post.value?.title[locale.value] ?? '')
const shareLinks = computed(() => {
  const url = encodeURIComponent(shareUrl.value)
  const text = encodeURIComponent(shareTitle.value)
  return [
    { id: 'facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${url}`, label: 'Facebook' },
    { id: 'x', icon: 'x', href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`, label: 'X' },
    { id: 'linkedin', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`, label: 'LinkedIn' },
    { id: 'whatsapp', icon: 'whatsapp', href: `https://wa.me/?text=${encodeURIComponent(`${shareTitle.value} ${shareUrl.value}`)}`, label: 'WhatsApp' },
  ]
})

useSeo(() => {
  const p = post.value
  if (!p) return { key: 'blog', title: c.value.meta.blog.title, description: c.value.meta.blog.description }
  const l = locale.value
  const org = orgJsonLd(l)
  return {
    key: 'post',
    params: { id: p.id },
    type: 'article',
    title: `${p.title[l]} | Albani Advocacia`,
    description: p.excerpt[l],
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        ...org['@graph'],
        {
          '@type': 'BlogPosting',
          headline: p.title[l],
          description: p.excerpt[l],
          datePublished: p.date,
          inLanguage: l === 'en' ? 'en' : 'pt-BR',
          mainEntityOfPage: `${SITE_URL}${postPath(p, l)}`,
          author: { '@id': `${SITE_URL}/#ivan` },
          publisher: { '@id': `${SITE_URL}/#office` },
          image: `${SITE_URL}${p.cover || '/img/og-albani.jpg'}`,
        },
      ],
    },
  }
})
</script>

<template>
  <article v-if="post" class="pt-24 lg:pt-28">
    <header class="container-site">
      <div class="mx-auto max-w-[52rem]">
        <RouterLink :to="lp('blog')" class="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-brass-light">
          <AppIcon name="arrow-left" :size="16" />{{ c.ui.backToBlog }}
        </RouterLink>

        <h1 class="mt-6 text-[2.15rem] leading-[1.12] text-ivory sm:text-[2.85rem] lg:text-[3.25rem]">{{ post.title[locale] }}</h1>
        <p v-if="subtitle" class="mt-4 max-w-[44rem] text-lg leading-relaxed text-mist sm:text-xl">{{ subtitle }}</p>

        <ul class="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mist">
          <li class="inline-flex items-center gap-2">
            <AppIcon name="user" :size="16" class="text-brass-text" />
            <span>{{ c.blog.authorName }}</span>
          </li>
          <li class="inline-flex items-center gap-2">
            <AppIcon name="calendar" :size="16" class="text-brass-text" />
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          </li>
          <li class="inline-flex items-center gap-2">
            <AppIcon name="clock" :size="16" class="text-brass-text" />
            <span>{{ readingMinutes(post, locale) }} {{ c.ui.minRead }}</span>
          </li>
        </ul>

        <div class="mt-7 flex flex-wrap items-center gap-3">
          <span class="text-sm font-semibold tracking-wide text-ivory">{{ c.blog.share }}</span>
          <div class="flex items-center gap-1.5" role="list">
            <a
              v-for="s in shareLinks"
              :key="s.id"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="flex h-10 w-10 items-center justify-center rounded-full border border-slate-line text-ivory/85 transition-colors hover:border-brass/60 hover:text-brass-light"
              :aria-label="`${c.blog.shareOn} ${s.label}`"
              role="listitem"
            >
              <AppIcon :name="s.icon" :size="18" />
            </a>
          </div>
        </div>

        <hr class="rule-brass mt-9" />
      </div>
    </header>

    <div class="container-site mt-10 lg:mt-12">
      <div class="paper mx-auto max-w-[52rem] rounded-[6px] px-6 py-9 sm:px-12 sm:py-14">
        <!-- HTML sanitizado no build (scripts/fetch-posts.mjs) ou gerado de texto escapado -->
        <div class="prose-albani prose-light" v-html="bodyHtml(post, locale)"></div>
      </div>
    </div>

    <!-- CTA no fim do artigo -->
    <aside class="container-site mt-16">
      <div class="cta-box mx-auto flex max-w-[52rem] flex-col gap-6 border border-brass/45 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div class="flex items-center gap-4">
          <img
            :src="c.blog.authorAvatar"
            width="56"
            height="56"
            alt=""
            class="h-14 w-14 shrink-0 rounded-full border border-brass/50 object-cover"
            loading="lazy"
          />
          <p class="font-display text-[1.45rem] leading-snug text-ivory">{{ c.blog.endCtaTitle }}</p>
        </div>
        <a :href="bookService(post.title[locale])" target="_blank" rel="noopener" class="btn-brass shrink-0">
          <AppIcon :name="hasBooking ? 'calendar' : 'whatsapp'" :size="20" />{{ hasBooking ? c.ui.book : c.blog.endCta }}
        </a>
      </div>
    </aside>

    <section class="container-site pb-24 pt-20 lg:pb-32" :aria-label="c.ui.related">
      <div class="mx-auto max-w-5xl">
        <h2 class="mb-8 font-display text-[1.6rem] text-ivory">{{ c.ui.related }}</h2>
        <div class="grid gap-6 sm:grid-cols-2">
          <PostListItem v-for="p in related" :key="p.id" :post="p" compact heading-tag="h3" />
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
/* Folha clara para leitura longa: texto escuro sobre branco quente */
.paper {
  background: #fdfcf9;
  box-shadow: 0 24px 60px -30px rgba(0, 0, 0, 0.8);
  border-top: 3px solid var(--color-brass);
}
.prose-light :deep(p),
.prose-light :deep(li) {
  color: #2a2d33;
}
.prose-light :deep(p:first-child::first-letter) {
  color: #8c6a2e;
}
.prose-light > :deep(:last-child) {
  margin-bottom: 0;
}
/* Elementos que o editor do CMS pode gerar */
.prose-light :deep(h2),
.prose-light :deep(h3) {
  font-family: var(--font-display);
  color: #1b1e23;
  line-height: 1.25;
  margin: 1.6em 0 0.6em;
}
.prose-light :deep(h2) {
  font-size: 1.55em;
}
.prose-light :deep(h3) {
  font-size: 1.25em;
}
.prose-light :deep(ul),
.prose-light :deep(ol) {
  margin: 0 0 1.55em;
  padding-left: 1.4em;
  max-width: 70ch;
}
.prose-light :deep(ul) {
  list-style: disc;
}
.prose-light :deep(ol) {
  list-style: decimal;
}
.prose-light :deep(li) {
  margin-bottom: 0.4em;
}
.prose-light :deep(li::marker) {
  color: #8c6a2e;
}
.prose-light :deep(a) {
  color: #7a5a22;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose-light :deep(a:hover) {
  color: #4f3a14;
}
.prose-light :deep(strong) {
  color: #1b1e23;
  font-weight: 600;
}
.prose-light :deep(blockquote) {
  margin: 0 0 1.55em;
  padding-left: 1.1em;
  border-left: 3px solid var(--color-brass);
  font-style: italic;
}
.prose-light :deep(img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 0 1.55em;
  border-radius: 4px;
}
.cta-box {
  background: radial-gradient(80% 140% at 0% 0%, rgba(201, 165, 90, 0.12), transparent 60%), #1f232a;
}
</style>
