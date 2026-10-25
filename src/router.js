import { PAGES } from './config/routes-map.js'

const Home = () => import('./pages/HomePage.vue')
const About = () => import('./pages/AboutPage.vue')
const Areas = () => import('./pages/AreasPage.vue')
const Blog = () => import('./pages/BlogPage.vue')
const Post = () => import('./pages/PostPage.vue')
const Faq = () => import('./pages/FaqPage.vue')
const Contact = () => import('./pages/ContactPage.vue')
const Bio = () => import('./pages/BioPage.vue')
const NotFound = () => import('./pages/NotFoundPage.vue')

// `bare`: página sem cabeçalho, rodapé e botão flutuante do WhatsApp (link na bio)
const pages = [
  ['home', Home],
  ['about', About],
  ['areas', Areas],
  ['blog', Blog],
  ['faq', Faq],
  ['contact', Contact],
  ['bio', Bio, { bare: true }],
]

export const routes = [
  ...pages.flatMap(([key, component, meta]) =>
    ['pt', 'en'].map((locale) => ({
      path: PAGES[key][locale],
      name: `${key}-${locale}`,
      component,
      meta: { key, locale, ...meta },
    })),
  ),
  { path: '/blog/:slug', name: 'post-pt', component: Post, meta: { key: 'post', locale: 'pt' } },
  { path: '/en/blog/:slug', name: 'post-en', component: Post, meta: { key: 'post', locale: 'en' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { key: 'home', locale: 'pt' } },
]
