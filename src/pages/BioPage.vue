<script setup>
// Link na bio do Instagram (/bio): página enxuta, sem cabeçalho e rodapé do site (meta.bare no
// router). Links editáveis no CMS ("Link na bio"); sem CMS, valem os de src/content/bio-links.js.
import { computed } from 'vue'
import { useSite } from '../composables/useSite.js'
import { useSeo } from '../composables/useSeo.js'
import { CONTACT } from '../config/site.js'
import { PAGES, pathFor, postPath } from '../config/routes-map.js'
import { BIO, BIO_ICONS } from '../content/bio.js'
import { POSTS, coverFor } from '../content/posts/index.js'
import AppIcon from '../components/AppIcon.vue'

const { c, locale, lp, wa, book, formatDate } = useSite()

useSeo(() => ({ key: 'bio', robots: 'noindex, follow' }))

const title = computed(() => BIO.title || c.value.bio.title)

/** Páginas do site escritas em PT no painel (/blog, /blog/<slug>...) viram a versão do idioma atual */
function sitePath(url) {
  const [path, hash = ''] = url.split('#')
  const page = Object.values(PAGES).find((p) => p.pt === path)
  if (page) return page[locale.value] + (hash && `#${hash}`)
  const post = POSTS.find((p) => `/blog/${p.slug.pt}` === path)
  return post ? postPath(post, locale.value) : url
}

const links = computed(() =>
  BIO.links.map((link) => {
    const base = { label: link.label[locale.value] || link.label.pt, icon: BIO_ICONS[link.icon] ?? 'arrow', featured: link.featured }
    if (link.url === 'agendar') return { ...base, href: book(), external: true }
    if (link.url === 'whatsapp') return { ...base, href: wa(), external: true }
    if (link.url.startsWith('/')) return { ...base, to: sitePath(link.url) }
    return { ...base, href: link.url, external: /^https?:/.test(link.url) }
  }),
)

const posts = computed(() => (BIO.showPosts ? POSTS.slice(0, 3) : []))

const socials = [
  { href: CONTACT.instagram, icon: 'instagram', label: 'Instagram' },
  { href: CONTACT.youtube, icon: 'youtube', label: 'YouTube' },
  { href: CONTACT.facebook, icon: 'facebook', label: 'Facebook' },
]

const otherLocale = computed(() => (locale.value === 'pt' ? 'en' : 'pt'))
</script>

<template>
  <div class="bio relative isolate px-4 pb-14 pt-10 sm:pt-16">
    <!-- Fundo: os monumentos do hero do site (Brasil/EUA e Lisboa), esmaecidos atrás do retrato -->
    <picture class="bio__backdrop" aria-hidden="true">
      <source type="image/avif" srcset="/img/hero-monumentos-960.avif 960w, /img/hero-monumentos-1536.avif 1536w" sizes="100vw" />
      <source type="image/webp" srcset="/img/hero-monumentos-960.webp 960w, /img/hero-monumentos-1536.webp 1536w" sizes="100vw" />
      <img src="/img/hero-monumentos-960.webp" width="960" height="536" alt="" decoding="async" />
    </picture>
    <div class="relative mx-auto w-full max-w-[30rem]">
      <header class="flex flex-col items-center text-center">
        <img
          src="/img/dr-ivan-busto-480.webp"
          width="480"
          height="602"
          alt="Dr. Ivan Albani"
          class="h-28 w-28 rounded-full border-2 border-brass/70 object-cover object-[50%_12%] shadow-[0_12px_40px_-12px_rgba(201,165,90,0.45)]"
          fetchpriority="high"
        />
        <h1 class="mt-5 font-display text-[2rem] leading-tight text-ivory">{{ title }}</h1>
        <p class="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-mist">{{ c.bio.credentials }}</p>
        <ul class="mt-5 flex items-center gap-2" :aria-label="c.bio.socialLabel">
          <li v-for="s in socials" :key="s.icon">
            <a
              :href="s.href"
              target="_blank"
              rel="noopener"
              class="flex h-11 w-11 items-center justify-center rounded-full border border-slate-line bg-slate/60 text-ivory/85 backdrop-blur-sm transition-colors hover:border-brass/60 hover:text-brass-light"
              :aria-label="s.label"
            >
              <AppIcon :name="s.icon" :size="19" />
            </a>
          </li>
        </ul>
      </header>

      <nav class="mt-9 flex flex-col gap-3" :aria-label="c.bio.linksLabel">
        <template v-for="link in links" :key="link.label">
          <RouterLink v-if="link.to" :to="link.to" class="bio-link" :class="{ 'bio-link--featured': link.featured }">
            <span class="bio-link__icon"><AppIcon :name="link.icon" :size="20" /></span>
            <span class="flex-1">{{ link.label }}</span>
            <AppIcon name="arrow" :size="16" class="bio-link__arrow" />
          </RouterLink>
          <a
            v-else
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener' : undefined"
            class="bio-link"
            :class="{ 'bio-link--featured': link.featured }"
          >
            <span class="bio-link__icon"><AppIcon :name="link.icon" :size="20" /></span>
            <span class="flex-1">{{ link.label }}</span>
            <AppIcon name="arrow" :size="16" class="bio-link__arrow" />
          </a>
        </template>
      </nav>

      <section v-if="posts.length" class="mt-11" aria-labelledby="bio-posts">
        <div class="flex items-center gap-3">
          <h2 id="bio-posts" class="text-xs font-semibold uppercase tracking-[0.18em] text-brass-text">{{ c.bio.latestPosts }}</h2>
          <hr class="rule-brass flex-1" />
        </div>
        <ul class="mt-4 flex flex-col gap-2">
          <li v-for="p in posts" :key="p.id">
            <RouterLink :to="postPath(p, locale)" class="group flex items-center gap-3.5 rounded-[10px] p-2 transition-colors hover:bg-slate-raised">
              <img :src="coverFor(p)" alt="" width="96" height="60" class="h-[3.75rem] w-24 shrink-0 rounded-[6px] object-cover" loading="lazy" />
              <span class="min-w-0">
                <span class="line-clamp-2 text-[0.95rem] leading-snug text-ivory transition-colors group-hover:text-brass-light">{{ p.title[locale] }}</span>
                <time :datetime="p.date" class="mt-0.5 block text-xs text-mist">{{ formatDate(p.date) }}</time>
              </span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <footer class="mt-12 flex flex-col items-center">
        <div class="flex items-center gap-4 text-sm text-mist">
          <RouterLink :to="lp('home')" class="link-brass">{{ c.bio.site }}</RouterLink>
          <span aria-hidden="true">·</span>
          <RouterLink :to="pathFor('bio', otherLocale)" class="uppercase tracking-wider transition-colors hover:text-brass-light" :lang="otherLocale">
            {{ otherLocale }}
          </RouterLink>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* Monumentos ao fundo do topo, sumindo no fundo da página. No celular a imagem fica mais baixa
   para caber a Estátua da Liberdade à esquerda e a Torre de Belém à direita do retrato. */
.bio__backdrop {
  position: absolute;
  inset: 0 0 auto;
  z-index: -1;
  height: 19rem;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(to bottom, #000 45%, transparent);
  mask-image: linear-gradient(to bottom, #000 45%, transparent);
}
.bio__backdrop img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 58% 45%;
  opacity: 0.6;
}
@media (min-width: 640px) {
  .bio__backdrop {
    height: clamp(22rem, 42vw, 34rem);
  }
}

/* Luz de latão difusa atrás do retrato */
.bio::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  z-index: -1;
  height: 22rem;
  background: radial-gradient(50% 60% at 50% 0%, rgba(201, 165, 90, 0.14), transparent 70%);
  pointer-events: none;
}

.bio-link {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  min-height: 3.6rem;
  padding: 0.7rem 1.1rem 0.7rem 0.75rem;
  border: 1px solid var(--color-slate-line);
  border-radius: 12px;
  background: var(--color-slate-raised);
  color: var(--color-ivory);
  font-weight: 500;
  line-height: 1.3;
  transition:
    border-color 0.25s ease,
    transform 0.25s var(--ease-out-soft),
    background-color 0.25s ease;
}
.bio-link:hover {
  border-color: rgba(201, 165, 90, 0.6);
  transform: translateY(-1px);
}
.bio-link:active {
  transform: translateY(0);
}
.bio-link__icon {
  display: flex;
  height: 2.4rem;
  width: 2.4rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  background: var(--color-slate-deep);
  color: var(--color-brass);
}
.bio-link__arrow {
  color: var(--color-mist);
  transition:
    transform 0.25s var(--ease-out-soft),
    color 0.25s ease;
}
.bio-link:hover .bio-link__arrow {
  transform: translateX(3px);
  color: var(--color-brass-light);
}

/* Link em destaque: latão, como os botões principais do site */
.bio-link--featured {
  border-color: transparent;
  background: linear-gradient(100deg, var(--color-brass-deep), var(--color-brass) 35%, var(--color-brass-light) 60%, var(--color-brass) 85%);
  color: #1a1408;
  font-weight: 600;
  box-shadow:
    inset 0 1px 0 rgba(255, 244, 214, 0.55),
    0 14px 36px -16px rgba(232, 207, 142, 0.5);
}
.bio-link--featured:hover {
  border-color: transparent;
}
.bio-link--featured .bio-link__icon {
  background: rgba(26, 20, 8, 0.12);
  color: #1a1408;
}
.bio-link--featured .bio-link__arrow,
.bio-link--featured:hover .bio-link__arrow {
  color: #1a1408;
}
</style>
