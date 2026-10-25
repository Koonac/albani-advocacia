<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSite } from '../composables/useSite.js'
import { useSeo, orgJsonLd, OG_IMAGE } from '../composables/useSeo.js'
import { SITE_URL } from '../config/site.js'
import { pathFor, postPath } from '../config/routes-map.js'
import { POSTS, findPostBySlug, readingMinutes, articleBody, keyPointsFor, faqFor, categoryLabel } from '../content/posts/index.js'
import AppIcon from '../components/AppIcon.vue'
import FaqList from '../components/FaqList.vue'
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

// Capa no topo só quando é foto do CMS (as artes SVG por categoria ficam só nos cards)
const cover = computed(() => (post.value?.cover && !post.value.cover.endsWith('.svg') ? post.value.cover : ''))
const article = computed(() => (post.value ? articleBody(post.value, locale.value) : { html: '', toc: [] }))
const keyPoints = computed(() => (post.value ? keyPointsFor(post.value, locale.value) : []))
const faq = computed(() => (post.value ? faqFor(post.value, locale.value) : []))

// Sumário "Neste artigo": seções (H2) do texto + perguntas frequentes; só vale a pena a partir de 3 itens
const toc = computed(() => [...article.value.toc, ...(faq.value.length ? [{ id: 'faq', text: c.value.blog.faqTitle }] : [])])
const showToc = computed(() => toc.value.length >= 3)

// Destaca no sumário lateral a seção que está sendo lida (só no navegador)
const activeId = ref('')
let observer
function observeSections() {
  observer?.disconnect()
  activeId.value = ''
  if (!showToc.value || typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) activeId.value = e.target.id
    },
    { rootMargin: '-20% 0px -70% 0px' },
  )
  for (const { id } of toc.value) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
}
onMounted(observeSections)
watch(toc, () => nextTick(observeSections))
onBeforeUnmount(() => observer?.disconnect())

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
  const section = categoryLabel(p.category, l)
  const pageUrl = `${SITE_URL}${postPath(p, l)}`
  // Google não aceita SVG como imagem de artigo: capas por categoria (SVG) caem na imagem Open Graph
  const image = p.cover && !p.cover.endsWith('.svg') ? `${SITE_URL}${p.cover}` : OG_IMAGE
  const faqItems = faqFor(p, l)
  const description = p.seo?.description?.[l] || p.excerpt[l]
  return {
    key: 'post',
    params: { id: p.id },
    type: 'article',
    title: p.seo?.title?.[l] || `${p.title[l]} | Albani Advocacia`,
    description,
    keywords: `${p.title[l]}, ${c.value.meta.categoryKeywords[p.category]}`,
    published: p.date,
    modified: p.updated,
    section,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        ...org['@graph'],
        {
          '@type': 'BlogPosting',
          headline: p.title[l],
          description,
          datePublished: p.date,
          dateModified: p.updated || p.date,
          inLanguage: l === 'en' ? 'en' : 'pt-BR',
          articleSection: section,
          mainEntityOfPage: pageUrl,
          author: { '@id': `${SITE_URL}/#ivan` },
          publisher: { '@id': `${SITE_URL}/#office` },
          image,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Albani Advocacia', item: `${SITE_URL}${pathFor('home', l)}` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}${pathFor('blog', l)}` },
            { '@type': 'ListItem', position: 3, name: p.title[l], item: pageUrl },
          ],
        },
        ...(faqItems.length
          ? [
              {
                '@type': 'FAQPage',
                '@id': `${pageUrl}#faq`,
                inLanguage: l === 'en' ? 'en' : 'pt-BR',
                mainEntity: faqItems.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
              },
            ]
          : []),
      ],
    },
  }
})
</script>

<template>
  <article v-if="post" class="pt-24 lg:pt-28">
    <!-- Em telas largas, coluna do artigo + sumário fixo à direita; abaixo disso, uma coluna só -->
    <div class="container-site">
      <div class="post-grid mx-auto max-w-[52rem]" :class="{ 'has-toc': showToc }">
        <header class="post-main">
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
            <li v-if="post.updated && post.updated > post.date" class="inline-flex items-center gap-2">
              <AppIcon name="check" :size="16" class="text-brass-text" />
              <span>{{ c.blog.updatedOn }} <time :datetime="post.updated">{{ formatDate(post.updated) }}</time></span>
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
        </header>

        <figure v-if="cover" class="post-main mt-10 overflow-hidden rounded-[6px] border border-slate-line/80 lg:mt-12">
          <img :src="cover" alt="" width="1200" height="750" class="aspect-[16/10] w-full object-cover" fetchpriority="high" />
        </figure>

        <div class="post-main paper mt-10 rounded-[6px] px-6 py-9 sm:px-12 sm:py-14 lg:mt-12">
          <section v-if="keyPoints.length" class="key-points" aria-labelledby="key-points-title">
            <h2 id="key-points-title" class="key-points-title">{{ c.blog.keyPoints }}</h2>
            <ul class="mt-4 space-y-3">
              <li v-for="k in keyPoints" :key="k" class="flex gap-3">
                <AppIcon name="check" :size="18" class="mt-[0.3rem] shrink-0 text-[#8c6a2e]" />
                <span>{{ k }}</span>
              </li>
            </ul>
          </section>

          <!-- Sumário recolhível no lugar do lateral (telas menores) -->
          <details v-if="showToc" class="toc-inline xl:hidden">
            <summary>{{ c.blog.toc }}</summary>
            <ol>
              <li v-for="t in toc" :key="t.id">
                <a :href="`#${t.id}`">{{ t.text }}</a>
              </li>
            </ol>
          </details>

          <!-- HTML sanitizado no build (scripts/fetch-posts.mjs) ou gerado de texto escapado -->
          <div class="prose-albani prose-light" v-html="article.html"></div>
        </div>

        <section v-if="faq.length" id="faq" class="post-main faq-section mt-16" aria-labelledby="faq-title">
          <h2 id="faq-title" class="mb-6 font-display text-[1.9rem] leading-tight text-ivory">{{ c.blog.faqTitle }}</h2>
          <FaqList :items="faq" />
        </section>

        <!-- CTA no fim do artigo -->
        <aside class="post-main mt-16">
          <div class="cta-box flex flex-col gap-6 border border-brass/45 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
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

        <aside v-if="showToc" class="toc-aside hidden xl:block">
          <nav class="sticky top-28" :aria-label="c.blog.toc">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-mist">{{ c.blog.toc }}</p>
            <ol class="mt-4 border-l border-slate-line">
              <li v-for="t in toc" :key="t.id">
                <a
                  :href="`#${t.id}`"
                  class="-ml-px block border-l py-1.5 pl-4 text-sm leading-snug transition-colors"
                  :class="activeId === t.id ? 'border-brass text-brass-light' : 'border-transparent text-mist hover:text-ivory'"
                  :aria-current="activeId === t.id ? 'location' : undefined"
                  >{{ t.text }}</a
                >
              </li>
            </ol>
          </nav>
        </aside>
      </div>
    </div>

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
/* Imagens no meio do texto: largura da folha, com respiro */
.prose-light :deep(img) {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
  margin: 2em 0;
  border-radius: 4px;
  box-shadow: 0 10px 30px -18px rgba(27, 30, 35, 0.55);
}
.cta-box {
  background: radial-gradient(80% 140% at 0% 0%, rgba(201, 165, 90, 0.12), transparent 60%), #1f232a;
}

/* Coluna do artigo (52rem, a mesma de antes) + sumário lateral fixo, a partir de 1280px */
@media (min-width: 1280px) {
  .post-grid.has-toc {
    max-width: 71rem;
    display: grid;
    grid-template-columns: minmax(0, 52rem) 15rem;
    column-gap: 4rem;
  }
  .post-grid.has-toc > .post-main {
    grid-column: 1;
  }
  /* Começa na capa/folha (linha 2) e vai até o fim, para o sumário acompanhar a leitura */
  .post-grid.has-toc > .toc-aside {
    grid-column: 2;
    grid-row: 2 / span 5;
  }
}

/* Âncoras do sumário param abaixo do cabeçalho fixo */
.prose-light :deep(h2),
.prose-light :deep(h3),
.faq-section {
  scroll-margin-top: 6.5rem;
}

/* Pontos-chave: quadro antes do texto */
.key-points {
  margin-bottom: 2.25rem;
  padding: 1.5rem 1.5rem 1.6rem;
  background: #f4eee2;
  border-left: 3px solid var(--color-brass);
  border-radius: 4px;
  color: #2a2d33;
  font-size: 1.05rem;
  line-height: 1.6;
}
.key-points-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  line-height: 1.2;
  color: #1b1e23;
}
@media (min-width: 640px) {
  .key-points {
    padding: 1.75rem 2rem 1.9rem;
  }
}

/* Sumário dentro da folha (telas menores) */
.toc-inline {
  margin-bottom: 2.25rem;
  border-top: 1px solid #e4dccb;
  border-bottom: 1px solid #e4dccb;
  color: #2a2d33;
}
.toc-inline summary {
  cursor: pointer;
  padding: 0.95rem 0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5d5649;
}
.toc-inline summary::marker {
  color: #8c6a2e;
}
.toc-inline ol {
  list-style: decimal;
  padding: 0 0 1.1rem 1.4rem;
  font-size: 1rem;
  line-height: 1.5;
}
.toc-inline li {
  margin-bottom: 0.45rem;
}
.toc-inline li::marker {
  color: #8c6a2e;
}
.toc-inline a {
  color: #2a2d33;
  text-decoration: underline;
  text-decoration-color: #d8ccb2;
  text-underline-offset: 3px;
}
.toc-inline a:hover {
  color: #7a5a22;
}

.prose-light :deep(hr) {
  margin: 2.4em auto;
  width: 5rem;
  border: 0;
  border-top: 1px solid var(--color-brass);
}

/* Tabelas (comparativos): rolagem própria no celular */
.prose-light :deep(.table-wrap) {
  margin: 0 0 1.8em;
  overflow-x: auto;
  border: 1px solid #e4dccb;
  border-radius: 4px;
}
.prose-light :deep(table) {
  width: 100%;
  min-width: 32rem;
  border-collapse: collapse;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #2a2d33;
}
.prose-light :deep(th),
.prose-light :deep(td) {
  padding: 0.75rem 1rem;
  text-align: left;
  vertical-align: top;
  border-bottom: 1px solid #ece5d6;
}
.prose-light :deep(th) {
  background: #f4eee2;
  color: #1b1e23;
  font-weight: 600;
}
.prose-light :deep(tr:last-child > td) {
  border-bottom: 0;
}
.prose-light :deep(td p),
.prose-light :deep(th p) {
  margin: 0;
  font-size: inherit;
}
</style>
