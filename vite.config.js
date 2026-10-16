import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_URL } from './src/config/site.js'
import { allRoutePairs } from './src/config/routes-map.js'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  ssgOptions: {
    dirStyle: 'flat', // /sobre -> sobre.html (URLs sem barra final; o host serve .html sem extensão)
    formatting: 'none',
    script: 'async',
    onFinished() {
      // sitemap.xml com alternates hreflang PT/EN
      const today = new Date().toISOString().slice(0, 10)
      const urls = allRoutePairs()
        .flatMap(({ pt, en }) => [pt, en].map((loc) => ({ loc, pt, en })))
        .map(({ loc, pt, en }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt" href="${SITE_URL}${pt}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${pt}"/>
  </url>`)
        .join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`
      writeFileSync(resolve('dist/sitemap.xml'), xml)
      writeFileSync(resolve('dist/robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /cms/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      console.log(`[sitemap] ${allRoutePairs().length * 2} URLs -> dist/sitemap.xml`)
    },
  },
})
