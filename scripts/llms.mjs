// Gera /llms.txt (resumo com links, padrão https://llmstxt.org) e /llms-full.txt (conteúdo completo
// em Markdown) para assistentes de IA (ChatGPT, Claude, Perplexity, Gemini...). Chamado pelo
// onFinished do vite-ssg (vite.config.js); tudo vem da mesma copy e dos mesmos posts do site.
import pt from '../src/content/site.pt.js'
import en from '../src/content/site.en.js'
import { SITE_URL, CONTACT } from '../src/config/site.js'
import { PAGES, postPath } from '../src/config/routes-map.js'
import { POSTS, bodyHtml, categoryLabel } from '../src/content/posts/index.js'

// Mesma regra de src/config/features.js (lá via import.meta.env, que não existe aqui)
const enabled = (flag) => !flag || (flag === 'nacionalidadeBisnetos' && process.env.VITE_FEATURE_BISNETOS === 'true')

const url = (path) => `${SITE_URL}${path}`
const PAGE_ORDER = ['home', 'about', 'areas', 'faq', 'blog', 'contact']

const htmlToText = (html) =>
  html
    .replace(/<\/(p|h2|h3|li|blockquote)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()

/** Serviços de uma categoria de "Áreas de atuação", em lista simples */
function areaServices(cat) {
  const out = []
  for (const g of cat.groups ?? []) out.push(...g.items.map((i) => (g.title ? `${g.title}: ${i}` : i)))
  out.push(...(cat.highlights ?? []), ...(cat.also ?? []))
  if (cat.nationality) {
    const n = cat.nationality
    out.push(...n.items.filter((i) => enabled(i.flag)).map((i) => `${n.title}: ${i.label}`))
    if (n.related?.length) out.push(`${n.relatedTitle}: ${n.related.join(', ')}`)
  }
  if (cat.complementary) out.push(`${cat.complementary.title}: ${cat.complementary.items.join(', ')}`)
  return out
}

const facts = () => [
  `- Advogado responsável: Dr. Ivan Albani, Cédula Profissional da Ordem dos Advogados de Portugal 67498E e OAB/SC 62.722`,
  `- Atuação: Portugal, Brasil e Estados Unidos (clientes em português e inglês)`,
  `- Endereço: ${CONTACT.address.full} (atendimento presencial e online)`,
  `- WhatsApp Portugal: ${CONTACT.whatsappPTLabel} (https://wa.me/${CONTACT.whatsappPT})`,
  `- WhatsApp Brasil: ${CONTACT.whatsappBRLabel} (https://wa.me/${CONTACT.whatsappBR})`,
  `- E-mail: ${CONTACT.email}`,
  `- Avaliação no Google: ${CONTACT.rating.value}/5 em ${CONTACT.rating.count} avaliações (${CONTACT.googleMaps})`,
  `- Instagram: ${CONTACT.instagram} · YouTube: ${CONTACT.youtube}`,
]

export function buildLlmsTxt() {
  const lines = [
    '# Albani Advocacia',
    '',
    `> Escritório de advocacia luso-brasileiro com sede em Palmela (Portugal), dirigido pelo Dr. Ivan Albani, advogado inscrito na Ordem dos Advogados de Portugal e na OAB. Atua em imigração para Portugal (vistos D1 a D8, autorização de residência, AIMA, reagrupamento familiar, golden visa), nacionalidade portuguesa, documentos e registos, e direito empresarial para brasileiros e estrangeiros que vivem, investem ou empreendem em Portugal.`,
    '',
    ...facts(),
    '',
    'As informações do site têm caráter informativo e não substituem uma consulta jurídica.',
    '',
    '## Páginas (português)',
    '',
    ...PAGE_ORDER.map((k) => `- [${pt.meta[k].title}](${url(PAGES[k].pt)}): ${pt.meta[k].description}`),
    '',
    '## Áreas de atuação',
    '',
    ...pt.areas.categories.map(
      (cat) => `- [${cat.title}](${url(`${PAGES.areas.pt}#${cat.id}`)}): ${cat.opening ?? areaServices(cat).join('; ')}`,
    ),
    '',
    '## Artigos do blog',
    '',
    ...POSTS.map((p) => `- [${p.title.pt}](${url(postPath(p, 'pt'))}): ${p.excerpt.pt}`),
    '',
    '## English',
    '',
    ...PAGE_ORDER.map((k) => `- [${en.meta[k].title}](${url(PAGES[k].en)}): ${en.meta[k].description}`),
    ...POSTS.map((p) => `- [${p.title.en}](${url(postPath(p, 'en'))}): ${p.excerpt.en}`),
    '',
    '## Optional',
    '',
    `- [Conteúdo completo do site em Markdown](${url('/llms-full.txt')}): sobre o escritório, serviços, perguntas frequentes e artigos na íntegra`,
    `- [Sitemap](${url('/sitemap.xml')})`,
    '',
  ]
  return lines.join('\n')
}

export function buildLlmsFullTxt() {
  const a = pt.about
  const out = [
    '# Albani Advocacia',
    '',
    `> ${pt.meta.home.description}`,
    '',
    ...facts(),
    '',
    `Fonte: ${url('/')} · Versão resumida: ${url('/llms.txt')}`,
    '',
    '## Sobre o escritório',
    '',
    a.intro,
    '',
    `### ${a.ivan.title} (${a.ivan.credentials})`,
    '',
    ...a.ivan.paragraphs.flatMap((p) => [p, '']),
    ...a.where.map((w) => `- ${w.title}: ${w.text}`),
    '',
    `### ${a.valuesTitle}`,
    '',
    ...a.values.map((v) => `- ${v.title}: ${v.text}`),
    '',
    `## Áreas de atuação (${url(PAGES.areas.pt)})`,
    '',
    pt.areas.intro,
    '',
  ]
  for (const cat of pt.areas.categories) {
    out.push(`### ${cat.title}`, '', ...(cat.opening ? [cat.opening, ''] : []), ...areaServices(cat).map((s) => `- ${s}`), '')
  }
  out.push(`## Perguntas frequentes (${url(PAGES.faq.pt)})`, '')
  for (const g of pt.faq.groups) {
    out.push(`### ${g.title}`, '')
    for (const i of g.items) out.push(`**${i.q}**`, '', i.a, '')
  }
  out.push('## Artigos do blog', '')
  for (const p of POSTS) {
    out.push(
      `### ${p.title.pt}`,
      '',
      `${url(postPath(p, 'pt'))} · ${categoryLabel(p.category, 'pt')} · ${p.date} · Dr. Ivan Albani`,
      '',
      htmlToText(bodyHtml(p, 'pt')),
      '',
    )
  }
  return out.join('\n')
}
