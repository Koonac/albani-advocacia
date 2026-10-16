<script setup>
import { ref, computed } from 'vue'
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import { POSTS, CATEGORIES } from '../content/posts/index.js'
import PostListItem from '../components/PostListItem.vue'

const { c, locale } = useSite()
useSeo(() => ({ key: 'blog', title: c.value.meta.blog.title, description: c.value.meta.blog.description }))

const filter = ref('all')
const pills = computed(() => [{ id: 'all', label: c.value.blog.all }, ...CATEGORIES.map((cat) => ({ id: cat.id, label: cat[locale.value] }))])
const list = computed(() => (filter.value === 'all' ? POSTS : POSTS.filter((p) => p.category === filter.value)))

function setFilter(id) {
  if (id === filter.value) return
  filter.value = id
}
</script>

<template>
  <section class="pt-32 lg:pt-44">
    <div class="container-site">
      <h1 class="text-[3.4rem] leading-none text-ivory sm:text-[4.6rem] lg:text-[5.6rem]">{{ c.blog.headline }}</h1>
      <p class="mt-6 max-w-xl text-lg text-mist lg:text-xl">{{ c.blog.intro }}</p>

      <div class="mt-12 flex flex-wrap gap-2" role="group" :aria-label="c.blog.filterLabel">
        <button
          v-for="p in pills"
          :key="p.id"
          type="button"
          class="rounded-full border px-4 py-2 text-sm transition-colors"
          :class="filter === p.id ? 'border-brass bg-brass/15 text-brass-light' : 'border-slate-line text-ivory/80 hover:border-brass/60 hover:text-ivory'"
          :aria-pressed="filter === p.id"
          @click="setFilter(p.id)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>
  </section>

  <section class="pb-24 pt-10 lg:pb-32" aria-live="polite">
    <div class="container-site">
      <Transition name="blog-filter" mode="out-in">
        <div :key="filter" class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          <PostListItem v-for="p in list" :key="p.id" :post="p" />
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.blog-filter-enter-active,
.blog-filter-leave-active {
  transition:
    opacity 0.28s ease,
    transform 0.28s ease;
}
.blog-filter-enter-from {
  opacity: 0;
  transform: translateY(0.65rem);
}
.blog-filter-leave-to {
  opacity: 0;
  transform: translateY(-0.35rem);
}
</style>
