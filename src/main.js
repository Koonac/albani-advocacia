import { ViteSSG } from 'vite-ssg'
import '@fontsource/marcellus/latin.css'
import '@fontsource/marcellus/latin-ext.css'
import '@fontsource-variable/instrument-sans/wght.css'
import './style.css'
import App from './App.vue'
import { routes } from './router.js'
import { createSiteI18n, localeFromPath } from './i18n.js'
import { postPath } from './config/routes-map.js'
import { POSTS } from './content/posts/index.js'
import { reveal } from './composables/reveal.js'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, from, saved) {
      if (saved) return saved
      if (to.hash) return { el: to.hash, top: 96, behavior: 'smooth' }
      if (to.path === from.path) return false
      return { top: 0 }
    },
  },
  ({ app, router }) => {
    const i18n = createSiteI18n()
    app.use(i18n)
    app.directive('reveal', reveal)
    router.beforeEach((to) => {
      i18n.global.locale.value = localeFromPath(to.path)
    })
  },
)

// Rotas dinâmicas pré-renderizadas: um HTML por artigo, em PT e EN
export async function includedRoutes(paths) {
  const staticPaths = paths.filter((p) => !p.includes(':'))
  const postPaths = POSTS.flatMap((p) => [postPath(p, 'pt'), postPath(p, 'en')])
  return [...staticPaths, ...postPaths]
}
