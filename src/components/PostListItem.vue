<script setup>
import { computed } from 'vue'
import { useSite } from '../composables/useSite.js'
import { categoryLabel, readingMinutes, coverFor } from '../content/posts/index.js'
import { postPath } from '../config/routes-map.js'

const props = defineProps({
  post: { type: Object, required: true },
  compact: Boolean,
  headingTag: { type: String, default: 'h2' },
})
const { c, locale } = useSite()
const to = computed(() => postPath(props.post, locale.value))
const cover = computed(() => coverFor(props.post))
const excerpt = computed(() => {
  const t = (props.post.excerpt[locale.value] || '').trim()
  if (!t) return '...'
  if (t.endsWith('...')) return t
  if (/[.!?…]$/.test(t)) return `${t.slice(0, -1)}...`
  return `${t}...`
})
const cardDate = computed(() => {
  const [y, m, d] = props.post.date.split('-')
  return locale.value === 'en' ? `${m}/${d}/${y}` : `${d}/${m}/${y}`
})
</script>

<template>
  <article
    class="post-card group relative flex h-full flex-col overflow-hidden rounded-[12px] border border-slate-line/80 bg-slate-raised shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brass/45 hover:shadow-[0_22px_48px_-20px_rgba(0,0,0,0.75)]"
    :class="compact ? 'max-w-none' : ''"
  >
    <RouterLink :to="to" class="absolute inset-0 z-10" :aria-label="post.title[locale]">
      <span class="sr-only">{{ post.title[locale] }}</span>
    </RouterLink>

    <div class="relative aspect-[16/10] overflow-hidden bg-slate-deep">
      <img
        :src="cover"
        :alt="''"
        width="800"
        height="500"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      <span
        class="absolute right-3 top-3 z-[1] rounded-full bg-brass/90 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.08em] text-slate-deep uppercase"
      >
        {{ categoryLabel(post.category, locale) }}
      </span>
    </div>

    <div class="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <component
        :is="headingTag"
        class="font-display text-[1.35rem] leading-snug text-ivory transition-colors group-hover:text-brass-light sm:text-[1.5rem]"
      >
        {{ post.title[locale] }}
      </component>

      <p class="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-mist">{{ excerpt }}</p>

      <span class="mt-4 text-[0.8rem] font-semibold tracking-[0.12em] text-brass-text uppercase">
        {{ c.blog.readMore }}
      </span>

      <div class="mt-5 flex items-center gap-3 border-t border-slate-line/80 pt-4">
        <img
          :src="c.blog.authorAvatar"
          width="40"
          height="40"
          :alt="c.blog.authorName"
          class="h-10 w-10 shrink-0 rounded-full border border-brass/40 object-cover"
          loading="lazy"
        />
        <div class="min-w-0 text-[0.82rem] leading-snug text-brass-text">
          <p class="truncate font-medium text-brass-light">{{ c.blog.authorName }}</p>
          <p class="mt-0.5 truncate text-mist">
            <time :datetime="post.date">{{ cardDate }}</time>
            <span class="mx-1.5 text-slate-line" aria-hidden="true">·</span>
            <span>{{ readingMinutes(post, locale) }} {{ c.ui.minRead }}</span>
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
