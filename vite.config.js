import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_URL } from './src/config/site.js'
import { allRoutePairs } from './src/config/routes-map.js'
import { buildLlmsTxt, buildLlmsFullTxt } from './scripts/llms.mjs'

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
      // sitemap.xml com alternates hreflang PT/EN. lastmod só nos artigos, que têm data real: a data
      // do build mudaria a cada publicação em todas as páginas, e o Google passa a ignorar o campo
      const urls = allRoutePairs()
        .flatMap(({ pt, en, date }) => [pt, en].map((loc) => ({ loc, pt, en, date })))
        .map(({ loc, pt, en, date }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>${date ? `\n    <lastmod>${date}</lastmod>` : ''}
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
      // robots.txt: tudo liberado (inclusive robôs de IA), menos o painel do CMS
      writeFileSync(
        resolve('dist/robots.txt'),
        `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /cms/\n\n# Resumo do site para assistentes de IA: ${SITE_URL}/llms.txt\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      )
      console.log(`[sitemap] ${allRoutePairs().length * 2} URLs -> dist/sitemap.xml`)

      // llms.txt / llms-full.txt (https://llmstxt.org)
      writeFileSync(resolve('dist/llms.txt'), buildLlmsTxt())
      writeFileSync(resolve('dist/llms-full.txt'), buildLlmsFullTxt())
      console.log('[llms] dist/llms.txt e dist/llms-full.txt')
    },
  },
})
