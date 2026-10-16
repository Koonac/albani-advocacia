# Integrações: albani-advocacia (site institucional, cliente externo)

Stack: Vue 3 + Vite 7 + Tailwind CSS 4 + vue-router 4 + vue-i18n 11 + vite-ssg 28 (pré-renderização de todas as rotas) + @unhead/vue 2.
Não há nenhuma ferramenta de analytics, pixel ou CRM integrada, porque nenhum ID foi fornecido. Não foi colocado nenhum placeholder.

| Integração | Onde no código | Config / ID |
|---|---|---|
| WhatsApp principal (PT) | `src/config/site.js` (`CONTACT.whatsappPT`, `waLink`); usado no header, hero, CTAs, botão flutuante, rodapé, artigos e Áreas | `https://wa.me/351931759247?text=...`, com texto pré-preenchido em PT ou EN conforme o idioma (`whatsappDefault` em `src/content/site.{pt,en}.js`) |
| WhatsApp Brasil | Contato (cartão) e rodapé | `https://wa.me/5548984586987` |
| "Falar sobre este serviço" | `src/components/ServiceList.vue`, `src/pages/AreasPage.vue` | Mensagem: "Olá, Dr. Ivan! Gostaria de falar sobre: <serviço>" (EN: "Hello, Dr. Ivan! I would like to talk about: <service>") |
| Formulário de contato (sem backend) | `src/pages/ContactPage.vue` | Monta Nome/País/Assunto/Mensagem e abre `wa.me/351931759247`. O checkbox de consentimento é obrigatório. Nenhum dado é guardado no site |
| Blog / CMS (Directus) | `scripts/fetch-posts.mjs`, `src/content/posts/index.js`, `deploy/` | Os posts são editados no Directus (painel em `/admin`, servido em `/cms/` no mesmo domínio; SQLite, Docker). Antes do build, `fetch-posts.mjs` grava os posts publicados em `src/content/posts/cms-posts.json` e baixa as imagens para `public/img/blog/cms/`. Sem `DIRECTUS_URL`, valem os arquivos `src/content/posts/*.js`. Ao salvar um post, um Flow chama o builder, que refaz e publica o site. Detalhes em `deploy/README.md` |
| Agendamento (Google Calendar) | `src/config/site.js` (`CONTACT.bookingUrl`), `useSite()` (`book`, `bookService`); header, hero, CTA final, Sobre, FAQ, Áreas (exceto Documentos e Registos) e fim dos artigos | **Pendente:** colar o link da página de agendamento do Google Agenda em `bookingUrl`. Enquanto vazio, os botões caem no WhatsApp |
| Facebook | Rodapé e JSON-LD (`sameAs`) | `CONTACT.facebook` = `https://www.facebook.com/albaniadvocacia` (**não confirmado**) |
| E-mail / Instagram | Contato e rodapé | `mailto:juridico@albaniadv.com`, `mailto:ivanalbani-67498e@adv.oa.pt`, `https://www.instagram.com/albaniadvocacia/` |
| YouTube (vídeo após o hero) | `src/components/VideoFacade.vue` | Vídeo `hMMvhygn3bs`. Usa uma fachada lite: a miniatura é servida localmente (`public/img/video-thumb-*`) e o iframe `youtube-nocookie.com` só carrega depois do clique |
| Google Maps | `src/pages/ContactPage.vue`, `src/config/site.js` (`mapsEmbed`, `mapsDirections`, `CONTACT.googleMaps`) | Embed sem chave: `maps.google.com/maps?q=Albani Advocacia, <endereço>&z=17&output=embed` (loading lazy, cores originais). "Como chegar" usa `google.com/maps/dir/?api=1&destination=...`; "Ver no Google Maps" abre a ficha pelo CID `15702313322506232491` |
| Avaliações Google | Hero, seção Avaliações e JSON-LD | Link: `https://www.google.com/search?q=Albani+Advocacia#lrd=0xd1941a55ddc5053:0xd9e9d2c5bbde22ab,1,,,,`. Os depoimentos são estáticos (copy.md), sem widget/API |
| JSON-LD | `src/composables/useSeo.js` | `LegalService`+`Attorney` (endereço, telefone, e-mail, aggregateRating 5.0/46) + `Person` (Dr. Ivan, OA 67498E, OAB/SC 62.722). Nos artigos acrescenta `BlogPosting` |
| SEO por página | `src/composables/useSeo.js` | title, description, canonical, hreflang pt/en/x-default, Open Graph (`/img/og-albani.jpg`), Twitter card e `<html lang>` |
| sitemap.xml / robots.txt | Gerados no build: `vite.config.js` → `ssgOptions.onFinished` | URLs (páginas + posts, PT e EN) com alternates hreflang. Domínio vindo de `VITE_SITE_URL` (`deploy/.env`; hoje `https://albani.kaedai.com.br`). Sem a variável, `src/config/site.js` usa `https://albaniadv.com` |
| Fontes | `src/main.js` (via @fontsource, auto-hospedadas) | Marcellus (títulos) e Instrument Sans Variable (corpo). Nenhum pedido ao Google Fonts (melhor para o RGPD) |

## Pendências para produção
- Confirmar o domínio e trocar `SITE_URL` se for diferente. Depois, `npm run build`.
- IDs de GA4 / Meta Pixel / GTM, se o cliente quiser. Antes de ativar qualquer um, é preciso um banner de cookies com consentimento prévio (o RGPD se aplica, sede em Portugal).
- Política de privacidade: o formulário e os links de WhatsApp tratam dados pessoais. Recomenda-se uma página de privacidade com a finalidade, a base legal e o responsável pelo tratamento, além de um link junto ao checkbox. O Google Maps e o YouTube (este só depois do clique) carregam conteúdo de terceiros.
- Hospedagem estática: o build usa `dirStyle: 'flat'` (`/sobre` → `sobre.html`). Netlify e Cloudflare Pages servem isso sem configuração. A Vercel não: o `cleanUrls` dela vem `false` por padrão e acessos diretos a `/sobre`, `/en/about` etc. dão 404. Por isso existe `vercel.json` na raiz do projeto com `"cleanUrls": true`. Na Vercel, o Root Directory precisa ser esta pasta, para o arquivo ser lido. No nginx, use `try_files $uri $uri.html $uri/ =404;`.
- VPS (destino atual): Directus + builder em Docker e nginx do host servindo `/var/www/albani/current`. Passo a passo e config do nginx em `deploy/`.
