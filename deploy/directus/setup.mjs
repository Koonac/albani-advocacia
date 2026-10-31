// Configura o Directus para o blog (idempotente: pode rodar de novo sem duplicar nada).
// - coleção `posts` com campos PT/EN no mesmo formato que o site usa
// - coleção singleton `pagina_inicial`, no painel "Configurações do site": vídeo do YouTube da
//   home, destino do botão "Agendar consulta" (WhatsApp ou link de agendamento) e avaliações
//   do Google (nota, total e depoimentos do carrossel)
// - coleção singleton `link_bio` ("Link na bio"): topo e links da página /bio
// - perfil "Editor" (Dr. Ivan): cria/edita posts, edita a página inicial e envia imagens,
//   com o painel enxuto (CSS abaixo)
// - usuário "build" com token estático só de leitura (BUILD_TOKEN), usado pelo fetch-posts/fetch-home
// - Flow que chama o builder (POST /rebuild) quando um post ou a página inicial muda
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CONTACT } from '../../src/config/site.js'
import sitePt from '../../src/content/site.pt.js'
import siteEn from '../../src/content/site.en.js'
import { BIO_DEFAULT_LINKS } from '../../src/content/bio-links.js'
import { api, findOne, login, pt, requireEnv, uploadFile } from './lib.mjs'

const BRANDING = join(dirname(fileURLToPath(import.meta.url)), 'branding')

requireEnv('BUILD_TOKEN', 'REBUILD_SECRET')

const CATEGORY_CHOICES = [
  { text: 'Imigração', value: 'imigracao' },
  { text: 'Nacionalidade', value: 'nacionalidade' },
  { text: 'Documentos', value: 'documentos' },
  { text: 'Empresas', value: 'empresas' },
  { text: 'Investimento', value: 'investimento' },
]

const TOOLBAR = ['bold', 'italic', 'h2', 'h3', 'bullist', 'numlist', 'blockquote', 'customLink', 'customImage', 'table', 'hr', 'removeformat', 'undo', 'redo', 'code', 'fullscreen']
const BODY_NOTE =
  'Divida o artigo em seções com "Título 2" (viram o sumário "Neste artigo"; perguntas funcionam bem, ex.: "Quem pode pedir o visto D7?") e "Título 3" para subseções. Use listas, links para outros artigos e fontes oficiais, tabelas para comparar e o botão de imagem para ilustrar no meio do texto.'
const SLUG_RE = '^[a-z0-9]+(-[a-z0-9]+)*$'

const SLUG_NOTE = {
  pt: 'Gerado a partir do título enquanto você digita (pode editar). Fica em /blog/<slug>. Não altere depois de publicado: o link antigo deixa de existir.',
  en: 'Gerado a partir do título em inglês enquanto você digita (pode editar). Fica em /en/blog/<slug>.',
}
const SLUG_PLACEHOLDER = { pt: 'ex.: visto-d7-ou-d8', en: 'e.g. d7-or-d8-visa' }

// Grupo de cada idioma, dentro do grupo "idiomas" (abas; ver ensureLanguageTabs)
function localeFields(l, label, sort) {
  const group = `grupo_${l}`
  return [
    {
      field: group,
      type: 'alias',
      meta: { interface: 'group-raw', special: ['alias', 'no-data', 'group'], group: 'idiomas', translations: pt(label), sort, width: 'full' },
    },
    {
      field: `title_${l}`,
      type: 'string',
      meta: { group, interface: 'input', required: true, translations: pt('Título'), sort: 1, width: 'full' },
      schema: {},
    },
    {
      field: `subtitle_${l}`,
      type: 'string',
      meta: { group, interface: 'input', translations: pt('Subtítulo (opcional)'), note: 'Se vazio, o resumo aparece abaixo do título.', sort: 2, width: 'full' },
      schema: {},
    },
    {
      field: `slug_${l}`,
      type: 'string',
      meta: {
        group,
        interface: 'input',
        options: { slug: true, trim: true, placeholder: SLUG_PLACEHOLDER[l] },
        required: true,
        translations: pt('Endereço (slug)'),
        note: SLUG_NOTE[l],
        validation: { _and: [{ [`slug_${l}`]: { _regex: SLUG_RE } }] },
        validation_message: 'Use só letras minúsculas, números e hífens.',
        sort: 3,
        width: 'full',
      },
      schema: { is_unique: true },
    },
    {
      field: `excerpt_${l}`,
      type: 'text',
      meta: { group, interface: 'input-multiline', required: true, translations: pt('Resumo'), note: 'Aparece na lista do blog e no Google (até ~160 caracteres).', sort: 4, width: 'full' },
      schema: {},
    },
    {
      field: `body_${l}`,
      type: 'text',
      meta: { group, interface: 'input-rich-text-html', options: { toolbar: TOOLBAR }, required: true, translations: pt('Texto'), note: BODY_NOTE, sort: 5, width: 'full' },
      schema: {},
    },
    {
      field: `key_points_${l}`,
      type: 'json',
      meta: {
        group,
        interface: 'list',
        special: ['cast-json'],
        options: {
          template: '{{texto}}',
          addLabel: 'Adicionar ponto-chave',
          fields: [
            {
              field: 'texto',
              name: 'Ponto-chave',
              type: 'text',
              meta: { field: 'texto', type: 'text', interface: 'input-multiline', required: true, width: 'full' },
            },
          ],
        },
        translations: pt('Pontos-chave (opcional)'),
        note: 'Aparecem num quadro antes do texto: 3 a 5 frases curtas com o essencial do artigo. Arraste para mudar a ordem.',
        sort: 6,
        width: 'full',
      },
      schema: {},
    },
    {
      field: `faq_${l}`,
      type: 'json',
      meta: {
        group,
        interface: 'list',
        special: ['cast-json'],
        options: {
          template: '{{pergunta}}',
          addLabel: 'Adicionar pergunta',
          fields: [
            {
              field: 'pergunta',
              name: 'Pergunta',
              type: 'string',
              meta: { field: 'pergunta', type: 'string', interface: 'input', required: true, width: 'full' },
            },
            {
              field: 'resposta',
              name: 'Resposta',
              type: 'text',
              meta: { field: 'resposta', type: 'text', interface: 'input-multiline', required: true, width: 'full' },
            },
          ],
        },
        translations: pt('Perguntas frequentes (opcional)'),
        note: 'Aparecem no fim do artigo e entram nos dados estruturados (FAQ) que o Google e as IAs leem. Respostas diretas, de 1 a 3 frases.',
        sort: 7,
        width: 'full',
      },
      schema: {},
    },
    {
      field: `seo_title_${l}`,
      type: 'string',
      meta: {
        group,
        interface: 'input',
        options: { softLength: 60, placeholder: 'Vazio: usa o título do artigo' },
        translations: pt('Título para o Google (opcional)'),
        note: 'Título azul no resultado de busca. Até 60 caracteres.',
        sort: 8,
        width: 'full',
      },
      schema: {},
    },
    {
      field: `seo_description_${l}`,
      type: 'text',
      meta: {
        group,
        interface: 'input-multiline',
        options: { softLength: 160, placeholder: 'Vazio: usa o resumo' },
        translations: pt('Descrição para o Google (opcional)'),
        note: 'Texto abaixo do título no resultado de busca e na prévia do link no WhatsApp. Até 160 caracteres.',
        sort: 9,
        width: 'full',
      },
      schema: {},
    },
  ]
}

const FIELDS = [
  {
    field: 'status',
    type: 'string',
    meta: {
      interface: 'select-dropdown',
      display: 'labels',
      options: {
        choices: [
          { text: 'Rascunho', value: 'draft' },
          { text: 'Publicado', value: 'published' },
          { text: 'Arquivado', value: 'archived' },
        ],
      },
      display_options: {
        choices: [
          { text: 'Rascunho', value: 'draft', background: '#A2B5CD' },
          { text: 'Publicado', value: 'published', background: '#2ECDA7' },
          { text: 'Arquivado', value: 'archived', background: '#6B7280' },
        ],
      },
      translations: pt('Status'),
      note: 'Só posts "Publicado" vão para o site. O site é atualizado cerca de 1 minuto depois de salvar.',
      sort: 1,
      width: 'half',
    },
    schema: { default_value: 'draft', is_nullable: false },
  },
  {
    field: 'date',
    type: 'date',
    meta: { interface: 'datetime', display: 'datetime', required: true, translations: pt('Data de publicação'), sort: 2, width: 'half' },
    schema: {},
  },
  {
    field: 'updated',
    type: 'date',
    meta: {
      interface: 'datetime',
      display: 'datetime',
      translations: pt('Atualizado em (opcional)'),
      note: 'Preencha ao revisar um artigo publicado (ex.: mudou a lei). Aparece como "Atualizado em" e o Google usa como data de modificação.',
      sort: 2,
      width: 'half',
    },
    schema: {},
  },
  {
    field: 'category',
    type: 'string',
    meta: { interface: 'select-dropdown', options: { choices: CATEGORY_CHOICES }, required: true, translations: pt('Categoria'), sort: 3, width: 'half' },
    schema: {},
  },
  {
    field: 'cover',
    type: 'uuid',
    meta: {
      interface: 'file-image',
      special: ['file'],
      display: 'image',
      translations: pt('Imagem de capa (opcional)'),
      note: 'Se vazio, usa a arte padrão da categoria. Ideal: 1200×750 ou maior.',
      sort: 4,
      width: 'half',
    },
    schema: {},
  },
  {
    field: 'idiomas',
    type: 'alias',
    meta: { interface: 'group-raw', special: ['alias', 'no-data', 'group'], translations: pt('Idiomas'), sort: 5, width: 'full' },
  },
  ...localeFields('pt', 'Português', 1),
  ...localeFields('en', 'English', 2),
]

/** Extensões do painel carregadas e ativas (pelo nome do package.json) */
async function loadedExtensions() {
  const extensions = await api('GET', '/extensions')
  return new Set(extensions.filter((e) => e.meta?.enabled !== false).map((e) => e.schema?.name ?? e.name))
}

// Colunas da lista de posts. O painel só escolhe sozinho campos soltos, e o título fica dentro do
// grupo do idioma: sem isto a lista não mostra de qual post se trata. A vista global vale para
// quem ainda não tem a sua; a vista pessoal (gravada ao abrir a lista) tem prioridade sobre ela,
// por isso as que estão sem o título também são corrigidas. As demais ficam como a pessoa deixou.
const POST_COLUMNS = ['title_pt', 'category', 'status', 'date', 'updated']

async function ensurePostColumns() {
  const views = await api('GET', '/presets?filter[collection][_eq]=posts&filter[bookmark][_null]=true&limit=-1&fields=id,user,role,layout_query,layout_options')
  const withColumns = (view) => ({
    layout: 'tabular',
    layout_query: { ...view?.layout_query, tabular: { sort: ['-date'], page: 1, ...view?.layout_query?.tabular, fields: POST_COLUMNS } },
    layout_options: { ...view?.layout_options, tabular: { ...view?.layout_options?.tabular, widths: { title_pt: 460 } } },
  })

  const shared = views.find((v) => !v.user && !v.role)
  if (shared) await api('PATCH', `/presets/${shared.id}`, withColumns(shared))
  else await api('POST', '/presets', { collection: 'posts', user: null, role: null, ...withColumns() })

  const personal = views.filter((v) => v.user && !v.layout_query?.tabular?.fields?.includes('title_pt'))
  for (const view of personal) await api('PATCH', `/presets/${view.id}`, withColumns(view))
  console.log(`lista de posts: título na primeira coluna (${personal.length} vista(s) pessoal(is) corrigida(s))`)
}

// Português e English em abas, com a interface "Abas" (deploy/directus/extensions/abas-de-grupo).
// Vale também para instalações antigas, em que os dois grupos ficavam soltos, um embaixo do outro.
// Sem a extensão carregada, ficam como antes: dois grupos recolhíveis, já abertos.
const TABS_EXTENSION = 'directus-extension-abas-de-grupo'

async function ensureLanguageTabs() {
  const tabs = (await loadedExtensions()).has(TABS_EXTENSION)
  await api('PATCH', '/fields/posts/idiomas', { meta: { interface: tabs ? 'abas-de-grupo' : 'group-raw', sort: 5 } })
  for (const [l, sort] of [['pt', 1], ['en', 2]]) {
    await api('PATCH', `/fields/posts/grupo_${l}`, {
      meta: tabs ? { group: 'idiomas', sort, interface: 'group-raw', options: null } : { group: 'idiomas', sort, interface: 'group-detail', options: { start: 'open' } },
    })
  }
  console.log(tabs ? 'idiomas: Português e English em abas' : `idiomas: extensão ${TABS_EXTENSION} não carregada, grupos um embaixo do outro`)
}

// Slugs com a interface "Slug do título" (deploy/directus/extensions/slug-do-titulo), que
// preenche o slug a partir do título enquanto se digita. Vale também para instalações antigas.
// Sem a extensão carregada (pasta não montada no container), fica o campo de texto comum.
const SLUG_EXTENSION = 'directus-extension-slug-do-titulo'

async function ensureSlugInterface() {
  const installed = (await loadedExtensions()).has(SLUG_EXTENSION)
  for (const l of ['pt', 'en']) {
    const meta = installed
      ? { interface: 'slug-do-titulo', options: { source: `title_${l}`, placeholder: SLUG_PLACEHOLDER[l] }, note: SLUG_NOTE[l] }
      : { interface: 'input', options: { slug: true, trim: true, placeholder: SLUG_PLACEHOLDER[l] }, note: SLUG_NOTE[l] }
    await api('PATCH', `/fields/posts/slug_${l}`, { meta })
  }
  console.log(installed ? 'slugs: gerados a partir do título' : `slugs: extensão ${SLUG_EXTENSION} não carregada, campo de texto comum`)
}

async function ensureCollection() {
  try {
    await api('GET', '/collections/posts')
    console.log('coleção posts: já existe')
  } catch {
    await api('POST', '/collections', {
      collection: 'posts',
      meta: {
        icon: 'article',
        note: 'Artigos do blog (PT e EN)',
        display_template: '{{title_pt}}',
        archive_field: 'status',
        archive_value: 'archived',
        unarchive_value: 'draft',
        sort_field: null,
        translations: [{ language: 'pt-BR', translation: 'Posts do blog', singular: 'Post', plural: 'Posts' }],
      },
      schema: {},
      fields: [
        {
          field: 'id',
          type: 'uuid',
          meta: { hidden: true, readonly: true, interface: 'input', special: ['uuid'] },
          schema: { is_primary_key: true, length: 36, has_auto_increment: false },
        },
      ],
    })
    console.log('coleção posts: criada')
  }

  const existing = new Set((await api('GET', '/fields/posts')).map((f) => f.field))
  for (const def of FIELDS) {
    if (existing.has(def.field)) continue
    await api('POST', '/fields/posts', def)
    console.log(`  campo ${def.field}: criado`)
  }
  // Instalações antigas: barra do editor (tabela, linha) e orientação de estrutura no campo Texto
  for (const l of ['pt', 'en']) {
    await api('PATCH', `/fields/posts/body_${l}`, { meta: { options: { toolbar: TOOLBAR }, note: BODY_NOTE } })
  }

  const relations = await api('GET', '/relations/posts')
  if (!relations.some((r) => r.field === 'cover')) {
    await api('POST', '/relations', { collection: 'posts', field: 'cover', related_collection: 'directus_files', schema: { on_delete: 'SET NULL' } })
    console.log('  relação cover -> directus_files: criada')
  }
}

// Links aceitos: youtube.com/watch?v=, youtu.be/, /shorts/, /embed/ e /live/ (o fetch-home extrai o id)
const YOUTUBE_RE = '^https?://((www|m)\\.)?(youtube\\.com/(watch\\?(.*&)?v=|shorts/|embed/|live/)|youtu\\.be/)[A-Za-z0-9_-]{11}'

const divider = (field, title, icon, sort) => ({
  field,
  type: 'alias',
  meta: { interface: 'presentation-divider', special: ['alias', 'no-data'], options: { title, icon, inlineTitle: true }, sort, width: 'full' },
})

const HOME_FIELDS = [
  divider('divisor_video', 'Vídeo da página inicial', 'smart_display', 0),
  {
    field: 'video_url',
    type: 'string',
    meta: {
      interface: 'input',
      options: { placeholder: 'https://www.youtube.com/watch?v=...', trim: true, iconLeft: 'smart_display' },
      required: true,
      translations: pt('Link do vídeo no YouTube'),
      note: 'Vídeo que aparece logo abaixo do topo da página inicial. Cole o link copiado do YouTube.',
      validation: { _and: [{ video_url: { _regex: YOUTUBE_RE } }] },
      validation_message: 'Cole um link de vídeo do YouTube (ex.: https://www.youtube.com/watch?v=...).',
      sort: 1,
      width: 'full',
    },
    schema: {},
  },
  {
    field: 'video_capa',
    type: 'uuid',
    meta: {
      interface: 'file-image',
      special: ['file'],
      display: 'image',
      translations: pt('Miniatura do vídeo (opcional)'),
      note: 'Imagem mostrada antes de dar play. Se vazio, usa a miniatura do próprio YouTube. Ideal: 1280×720.',
      sort: 2,
      width: 'full',
    },
    schema: {},
  },
  {
    field: 'videos_extras',
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      options: {
        template: '{{titulo}} {{url}}',
        addLabel: 'Adicionar vídeo',
        fields: [
          {
            field: 'url',
            name: 'Link do vídeo no YouTube',
            type: 'string',
            meta: {
              field: 'url',
              type: 'string',
              interface: 'input',
              required: true,
              options: { placeholder: 'https://www.youtube.com/watch?v=...', trim: true, iconLeft: 'smart_display' },
              width: 'full',
            },
          },
          {
            field: 'titulo',
            name: 'Título (opcional)',
            type: 'string',
            meta: {
              field: 'titulo',
              type: 'string',
              interface: 'input',
              options: { placeholder: 'Se vazio, usa o título do YouTube' },
              width: 'full',
            },
          },
        ],
      },
      translations: pt('Outros vídeos'),
      note: 'Aparecem em miniatura abaixo do vídeo principal; ao clicar, o vídeo toca no lugar dele. Use vídeos públicos, diferentes do principal e entre si: repetidos não aparecem. Arraste para mudar a ordem.',
      sort: 3,
      width: 'full',
    },
    schema: {},
  },
  divider('divisor_cta', 'Botão "Agendar consulta"', 'event', 4),
  {
    field: 'cta_tipo',
    type: 'string',
    meta: {
      interface: 'select-radio',
      options: {
        choices: [
          { text: 'WhatsApp', value: 'whatsapp' },
          { text: 'Link de agendamento (ex.: Google Agenda)', value: 'agenda' },
        ],
      },
      required: true,
      translations: pt('Para onde o botão leva'),
      note: 'Vale para todos os botões de agendar do site (topo, página inicial, artigos, perguntas frequentes...).',
      sort: 5,
      width: 'full',
    },
    schema: { default_value: 'whatsapp' },
  },
  {
    field: 'cta_link',
    type: 'string',
    meta: {
      interface: 'input',
      options: { placeholder: 'https://calendar.app.google/...', trim: true, iconLeft: 'event' },
      translations: pt('Link de agendamento'),
      note: 'No Google Agenda: crie uma "Agenda de horários", clique em Compartilhar e copie o link da página de agendamento.',
      // Só aparece (e é obrigatório) com "Link de agendamento" escolhido
      hidden: true,
      conditions: [{ name: 'Com agenda', rule: { _and: [{ cta_tipo: { _eq: 'agenda' } }] }, hidden: false, required: true }],
      validation: { _and: [{ cta_link: { _regex: '^https://' } }] },
      validation_message: 'Cole o link completo, começando com https://',
      sort: 6,
      width: 'full',
    },
    schema: {},
  },
  divider('divisor_avaliacoes', 'Avaliações do Google', 'star', 7),
  {
    field: 'avaliacoes_nota',
    type: 'float',
    meta: {
      interface: 'input',
      options: { min: 1, max: 5, step: 0.1, placeholder: '5.0' },
      translations: pt('Nota no Google'),
      note: 'Nota média que aparece no perfil do Google (de 1 a 5).',
      sort: 8,
      width: 'half',
    },
    schema: {},
  },
  {
    field: 'avaliacoes_total',
    type: 'integer',
    meta: {
      interface: 'input',
      options: { min: 0, placeholder: '46' },
      translations: pt('Quantidade de avaliações'),
      note: 'Total de avaliações no Google. Atualize quando chegarem novas.',
      sort: 9,
      width: 'half',
    },
    schema: {},
  },
  {
    field: 'depoimentos',
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      options: {
        template: '{{autor}}',
        addLabel: 'Adicionar depoimento',
        fields: [
          {
            field: 'autor',
            name: 'Nome de quem avaliou',
            type: 'string',
            meta: { field: 'autor', type: 'string', interface: 'input', required: true, width: 'full' },
          },
          {
            field: 'texto_pt',
            name: 'Texto (português)',
            type: 'text',
            meta: { field: 'texto_pt', type: 'text', interface: 'input-multiline', required: true, width: 'full' },
          },
          {
            field: 'texto_en',
            name: 'Texto (inglês, opcional)',
            type: 'text',
            meta: {
              field: 'texto_en',
              type: 'text',
              interface: 'input-multiline',
              options: { placeholder: 'Se vazio, a versão em inglês do site mostra o texto em português' },
              width: 'full',
            },
          },
        ],
      },
      translations: pt('Depoimentos'),
      note: 'Avaliações que passam no carrossel da página inicial. Arraste para mudar a ordem.',
      sort: 10,
      width: 'full',
    },
    schema: {},
  },
]

async function ensureHome() {
  try {
    await api('GET', '/collections/pagina_inicial')
    console.log('coleção pagina_inicial: já existe')
  } catch {
    await api('POST', '/collections', {
      collection: 'pagina_inicial',
      meta: {
        icon: 'home',
        note: 'Conteúdo editável da página inicial do site',
        singleton: true,
        sort: 2,
        translations: [{ language: 'pt-BR', translation: 'Página inicial', singular: 'Página inicial', plural: 'Página inicial' }],
      },
      schema: {},
      fields: [{ field: 'id', type: 'integer', meta: { hidden: true, readonly: true, interface: 'input' }, schema: { is_primary_key: true, has_auto_increment: true } }],
    })
    // Posts primeiro no menu
    await api('PATCH', '/collections/posts', { meta: { sort: 1 } })
    console.log('coleção pagina_inicial: criada')
  }
  // Nome no painel: além do vídeo da home, guarda o botão de agendar do site todo
  await api('PATCH', '/collections/pagina_inicial', {
    meta: {
      icon: 'tune',
      note: 'Vídeos da página inicial, botão "Agendar consulta" e avaliações do Google',
      translations: [{ language: 'pt-BR', translation: 'Configurações do site', singular: 'Configurações do site', plural: 'Configurações do site' }],
    },
  })

  const existing = new Set((await api('GET', '/fields/pagina_inicial')).map((f) => f.field))
  for (const def of HOME_FIELDS) {
    if (existing.has(def.field)) {
      // Instalações antigas: reaplica a ordem (campos novos entram no meio) e a orientação do campo
      await api('PATCH', `/fields/pagina_inicial/${def.field}`, { meta: { sort: def.meta.sort, note: def.meta.note } })
      continue
    }
    await api('POST', '/fields/pagina_inicial', def)
    console.log(`  campo ${def.field}: criado`)
  }

  const relations = await api('GET', '/relations/pagina_inicial')
  if (!relations.some((r) => r.field === 'video_capa')) {
    await api('POST', '/relations', { collection: 'pagina_inicial', field: 'video_capa', related_collection: 'directus_files', schema: { on_delete: 'SET NULL' } })
    console.log('  relação video_capa -> directus_files: criada')
  }

  // Já abre preenchido com o vídeo atual do site
  const home = await api('GET', '/items/pagina_inicial')
  if (!home?.video_url) {
    await api('PATCH', '/items/pagina_inicial', { video_url: `https://www.youtube.com/watch?v=${CONTACT.videoId}` })
    console.log('  vídeo atual da página inicial: gravado')
  }
  // Avaliações: abre preenchido com o que o site mostra hoje (nota, total e depoimentos PT/EN)
  if (home?.avaliacoes_nota == null && home?.avaliacoes_total == null) {
    await api('PATCH', '/items/pagina_inicial', { avaliacoes_nota: Number(CONTACT.rating.value), avaliacoes_total: CONTACT.rating.count })
    console.log('  nota e total de avaliações atuais: gravados')
  }
  if (!home?.depoimentos?.length) {
    const depoimentos = sitePt.home.reviews.items.map((r, i) => ({ autor: r.author, texto_pt: r.text, texto_en: siteEn.home.reviews.items[i]?.text ?? '' }))
    await api('PATCH', '/items/pagina_inicial', { depoimentos })
    console.log(`  ${depoimentos.length} depoimentos atuais: gravados`)
  }
}

// Link na bio (/bio): singleton com o nome no topo da página e a lista de links, na ordem do painel.
// O fetch-bio.mjs valida os destinos; a validação aqui é só orientação para quem edita.
const BIO_ICON_CHOICES = [
  { text: 'Agenda', value: 'agenda' },
  { text: 'WhatsApp', value: 'whatsapp' },
  { text: 'Site', value: 'site' },
  { text: 'Artigo / blog', value: 'blog' },
  { text: 'Instagram', value: 'instagram' },
  { text: 'YouTube', value: 'youtube' },
  { text: 'Facebook', value: 'facebook' },
  { text: 'LinkedIn', value: 'linkedin' },
  { text: 'Google', value: 'google' },
  { text: 'Localização', value: 'localizacao' },
  { text: 'E-mail', value: 'email' },
  { text: 'Estrela', value: 'estrela' },
  { text: 'Link (seta)', value: 'link' },
]

const listField = (field, name, type, meta) => ({ field, name, type, meta: { field, type, width: 'full', ...meta } })

const BIO_FIELDS = [
  divider('divisor_topo', 'Topo da página', 'account_circle', 0),
  {
    field: 'titulo',
    type: 'string',
    meta: { interface: 'input', options: { placeholder: 'Dr. Ivan Albani' }, translations: pt('Nome'), note: 'Vazio: "Dr. Ivan Albani".', sort: 1, width: 'full' },
    schema: {},
  },
  divider('divisor_links', 'Links', 'link', 4),
  {
    field: 'links',
    type: 'json',
    meta: {
      interface: 'list',
      special: ['cast-json'],
      options: {
        template: '{{rotulo_pt}}',
        addLabel: 'Adicionar link',
        fields: [
          listField('rotulo_pt', 'Texto do botão', 'string', { interface: 'input', required: true, options: { placeholder: 'ex.: Agendar consulta' } }),
          listField('rotulo_en', 'Texto do botão (inglês, opcional)', 'string', {
            interface: 'input',
            options: { placeholder: 'Se vazio, a versão em inglês mostra o texto em português' },
          }),
          listField('url', 'Destino', 'string', {
            interface: 'input',
            required: true,
            options: { placeholder: 'https://... ou /blog', trim: true, iconLeft: 'link' },
            note: 'Link completo (https://...), página do site (/blog, /contato, /blog/nome-do-artigo), "agendar" (mesmo destino do botão Agendar consulta do site) ou "whatsapp".',
          }),
          listField('icone', 'Ícone', 'string', { interface: 'select-dropdown', options: { choices: BIO_ICON_CHOICES }, width: 'half' }),
          listField('destaque', 'Botão em destaque (dourado)', 'boolean', { interface: 'boolean', options: { label: 'Destacar' }, width: 'half' }),
        ],
      },
      translations: pt('Links'),
      note: 'Botões da página, de cima para baixo. Arraste para mudar a ordem. Use o destaque em 1 ou 2 links, no máximo.',
      sort: 5,
      width: 'full',
    },
    schema: {},
  },
  {
    field: 'mostrar_artigos',
    type: 'boolean',
    meta: {
      interface: 'boolean',
      options: { label: 'Mostrar os 3 artigos mais recentes do blog abaixo dos links' },
      translations: pt('Artigos recentes'),
      sort: 6,
      width: 'full',
    },
    schema: { default_value: true },
  },
]

async function ensureBio() {
  try {
    await api('GET', '/collections/link_bio')
    console.log('coleção link_bio: já existe')
  } catch {
    await api('POST', '/collections', {
      collection: 'link_bio',
      meta: {
        icon: 'link',
        note: 'Página com os links da bio do Instagram (albaniadv.com/bio)',
        singleton: true,
        sort: 3,
        translations: [{ language: 'pt-BR', translation: 'Link na bio', singular: 'Link na bio', plural: 'Link na bio' }],
      },
      schema: {},
      fields: [{ field: 'id', type: 'integer', meta: { hidden: true, readonly: true, interface: 'input' }, schema: { is_primary_key: true, has_auto_increment: true } }],
    })
    console.log('coleção link_bio: criada')
  }

  const existing = new Set((await api('GET', '/fields/link_bio')).map((f) => f.field))
  for (const def of BIO_FIELDS) {
    if (existing.has(def.field)) continue
    await api('POST', '/fields/link_bio', def)
    console.log(`  campo ${def.field}: criado`)
  }

  // Já abre preenchido com os links que o site mostra sem CMS
  const bio = await api('GET', '/items/link_bio')
  if (!bio?.links?.length) {
    const links = BIO_DEFAULT_LINKS.map((l) => ({ rotulo_pt: l.label.pt, rotulo_en: l.label.en, url: l.url, icone: l.icon, destaque: l.featured }))
    await api('PATCH', '/items/link_bio', { links, mostrar_artigos: bio?.mostrar_artigos ?? true })
    console.log(`  ${links.length} links padrão: gravados`)
  }
}

/** Política + papel com as permissões dadas; devolve o id do papel */
async function ensureRole({ name, icon, description, appAccess, permissions }) {
  let policy = await findOne('/policies', { name })
  if (!policy) {
    policy = await api('POST', '/policies', { name, icon, description, app_access: appAccess, admin_access: false })
    console.log(`política "${name}": criada`)
  }
  // Acrescenta as permissões que faltam (instalações antigas ganham as coleções novas)
  const current = await api('GET', `/permissions?filter[policy][_eq]=${policy.id}&limit=-1&fields=collection,action`)
  const has = new Set(current.map((p) => `${p.collection}:${p.action}`))
  const missing = permissions.filter((p) => !has.has(`${p.collection}:${p.action}`))
  if (missing.length) {
    await api('POST', '/permissions', missing.map((p) => ({ policy: policy.id, fields: ['*'], permissions: {}, validation: {}, ...p })))
    console.log(`política "${name}": ${missing.length} permissões adicionadas`)
  }
  let role = await findOne('/roles', { name })
  if (!role) {
    role = await api('POST', '/roles', { name, icon, description, policies: [{ policy: policy.id }] })
    console.log(`papel "${name}": criado`)
  }
  return role.id
}

const crud = (collection) => ['create', 'read', 'update', 'delete'].map((action) => ({ collection, action }))

async function ensureUsers(editorRole, buildRole) {
  // Usuário técnico sem senha (só o token entra); o domínio do admin garante um e-mail válido
  const buildEmail = `build@${process.env.ADMIN_EMAIL.split('@')[1]}`
  const buildUser = await findOne('/users', { email: buildEmail })
  if (buildUser) {
    await api('PATCH', `/users/${buildUser.id}`, { token: process.env.BUILD_TOKEN, role: buildRole })
  } else {
    await api('POST', '/users', { email: buildEmail, first_name: 'Build', last_name: 'do site', role: buildRole, token: process.env.BUILD_TOKEN, status: 'active' })
  }
  console.log(`usuário ${buildEmail}: token BUILD_TOKEN aplicado`)

  const { EDITOR_EMAIL, EDITOR_PASSWORD } = process.env
  if (EDITOR_EMAIL && EDITOR_PASSWORD && !(await findOne('/users', { email: EDITOR_EMAIL }))) {
    await api('POST', '/users', { email: EDITOR_EMAIL, password: EDITOR_PASSWORD, first_name: 'Ivan', last_name: 'Albani', role: editorRole, language: 'pt-BR', status: 'active' })
    console.log(`usuário editor ${EDITOR_EMAIL}: criado`)
  }
}

async function ensureFlow() {
  const name = 'Atualizar o site'
  const operationOptions = {
    method: 'POST',
    url: 'http://builder:9000/rebuild',
    headers: [{ header: 'x-rebuild-secret', value: process.env.REBUILD_SECRET }],
    body: '{}',
  }
  const flowOptions = { type: 'action', scope: ['items.create', 'items.update', 'items.delete'], collections: ['posts', 'pagina_inicial', 'link_bio'] }
  const flow = await findOne('/flows', { name })
  if (flow) {
    await api('PATCH', `/flows/${flow.id}`, { options: flowOptions })
    const op = await findOne('/operations', { flow: flow.id, key: 'rebuild' })
    if (op) await api('PATCH', `/operations/${op.id}`, { options: operationOptions })
    console.log(`flow "${name}": já existe (coleções e segredo atualizados)`)
    return
  }
  const created = await api('POST', '/flows', {
    name,
    icon: 'rocket_launch',
    color: '#C9A55A',
    description: 'Refaz o site estático quando um post ou a página inicial muda',
    status: 'active',
    trigger: 'event',
    accountability: 'all',
    options: flowOptions,
  })
  const op = await api('POST', '/operations', {
    flow: created.id,
    name: 'Chamar o builder',
    key: 'rebuild',
    type: 'request',
    position_x: 19,
    position_y: 1,
    options: operationOptions,
  })
  await api('PATCH', `/flows/${created.id}`, { operation: op.id })
  console.log(`flow "${name}": criado`)
}

// Painel enxuto para quem não é admin (o Editor). O CSS do projeto vale para todos, então as
// regras ficam sob ED, que só casa quando a barra de módulos não tem o link de Configurações
// (exclusivo de admins). Para o Editor:
// - some a barra de módulos (logo, Conteúdo, Usuários, Arquivos, Ajuda); notificações, sair e
//   perfil viram um rodapé dentro do menu "Posts do blog / Página inicial", de largura fixa
// - some o painel lateral direito (informações, revisões, comentários) e o botão que o abre
// Seletores conferidos no código do app do Directus 11.17 (module-bar*.vue, private-view-*.vue).
const ED = 'html:not(:has(.module-bar a[href$="/settings"]))'
// Fora do módulo de conteúdo (perfil, arquivos, ou rotas que o Editor não pode abrir, como
// configurações e insights, que mostram "Página não encontrada" com o menu vazio). Sem a barra
// de módulos, nessas telas o único caminho de volta é o atalho abaixo. :has() não pode ser
// aninhado em :has(), mas pode ficar dentro de :not().
const OUT = `${ED}:not(:has(.module-nav-content a[href*="/content/"]))`
const EDITOR_CSS = `
${ED} .module-bar :is(.module-bar-logo, .modules) { display: none !important; }
${ED} .module-bar { justify-content: flex-end; }

${ED} .private-view { position: relative; }
${ED} .root-split:not(.sp-collapsed) { grid-template-columns: 15rem 0 minmax(0, 1fr) !important; }
${ED} .root-split > .sp-divider { visibility: hidden; pointer-events: none; }
${ED} .project-info .nav-toggle { display: none !important; }
${ED} :is(.root-split:not(.sp-collapsed), .panel) .module-nav-content { padding-block-end: 4rem; }

/* Rodapé: no menu fixo (telas largas) e na gaveta (.panel) que o substitui nas menores */
${ED} .private-view:has(> .root-split.sp-collapsed) > .module-bar { display: none !important; }
${ED} .panel > .module-bar { inline-size: 100% !important; }
${ED} .private-view > .module-bar { inline-size: 15rem !important; }
${ED} :is(.private-view, .panel) > .module-bar {
  --theme--navigation--modules--background: var(--theme--navigation--background);
  --theme--navigation--modules--button--foreground: var(--theme--navigation--list--icon--foreground);
  --theme--navigation--modules--button--foreground-hover: var(--theme--navigation--list--foreground-hover);
  position: absolute !important;
  inset-block-end: 0;
  inset-inline-start: 0;
  z-index: 5;
  flex-direction: row !important;
  box-sizing: border-box !important;
  block-size: auto !important;
  border-inline-end: var(--theme--navigation--border-width) solid var(--theme--navigation--border-color) !important;
  border-block-start: 1px solid var(--theme--navigation--list--divider--border-color);
}
${ED} :is(.private-view, .panel) > .module-bar .module-bar-avatar { display: flex; align-items: center; inline-size: 100%; }
${ED} :is(.private-view, .panel) > .module-bar .space-bar { display: contents; }
${ED} :is(.private-view, .panel) > .module-bar .avatar-btn { order: 0; margin-inline-end: auto; display: flex; align-items: center; gap: 0.5rem; color: var(--theme--navigation--list--foreground); }
${ED} :is(.private-view, .panel) > .module-bar .avatar-btn::after { content: 'Meu perfil'; font-size: 0.8125rem; }
${ED} :is(.private-view, .panel) > .module-bar .v-avatar.no-avatar::after { display: none; }
${ED} :is(.private-view, .panel) > .module-bar .notifications-badge { order: 1; }
${ED} :is(.private-view, .panel) > .module-bar .sign-out {
  order: 2;
  position: static !important;
  opacity: 1 !important;
  transform: none !important;
}

/* Fora do conteúdo (ex.: "Meu perfil", que abre no módulo de usuários): some a navegação
   daquele módulo e o botão de voltar do cabeçalho (que leva à lista de usuários); no lugar,
   o botão do módulo de conteúdo vira um atalho "Voltar ao blog" no topo do menu */
${OUT} .module-nav-content > *,
${OUT} .header-bar .title-outer-prepend { display: none !important; }
${OUT} .module-bar .modules {
  display: block !important;
  position: fixed;
  inset-block-start: 4.25rem;
  inset-inline-start: 0.75rem;
  inline-size: 13.5rem;
  overflow: visible;
}
${OUT} .module-bar .modules > .v-button { inline-size: 100%; }
${OUT} .module-bar .modules > .v-button:not(:has(a[href$="/content"])) { display: none; }
${OUT} .module-bar .modules a[href$="/content"] {
  inline-size: 100% !important;
  block-size: 2.25rem !important;
  justify-content: flex-start;
  gap: 0.5rem;
  padding-inline: 0.625rem;
  border-radius: var(--theme--border-radius);
  color: var(--theme--navigation--list--foreground);
  background-color: var(--theme--navigation--list--background-hover);
  font-size: 0.8125rem;
}
${OUT} .module-bar .modules a[href$="/content"] .content { display: flex; align-items: center; gap: 0.5rem; }
${OUT} .module-bar .modules a[href$="/content"] .content::after { content: 'Voltar ao blog'; }
${OUT} .module-bar .modules a[href$="/content"] .v-icon { --v-icon-color: var(--theme--navigation--list--icon--foreground); }

${ED} .main-split { grid-template-columns: minmax(0, 1fr) !important; }
${ED} .main-split > :is(.sp-divider, .sp-end),
${ED} .header-bar .sidebar-toggle { display: none !important; }
`

// Identidade na tela de login e na barra lateral: símbolo no quadrado (fundo grafite, porque
// o dourado do símbolo some sobre a cor do projeto) e a logo completa grande e desfocada à direita.
// As regras do Directus são escopadas ([data-v-*]) e por isso pedem !important.
const CUSTOM_CSS = `
.public-view .logo,
.module-bar-logo { background-color: #1f232a !important; }
.public-view .logo img,
.module-bar-logo .custom-logo { inline-size: 2.6rem !important; block-size: 2.6rem !important; }
.public-view .art .foreground {
  inline-size: 88% !important;
  max-inline-size: 60rem !important;
  filter: blur(5px);
  opacity: 0.7;
}
${EDITOR_CSS}`

async function ensureLogo(file, title, type) {
  const existing = await findOne('/files', { title })
  return existing ? existing.id : uploadFile(join(BRANDING, file), { title, type })
}

async function ensureBranding() {
  const symbol = await ensureLogo('logo-simbolo.png', 'Albani · símbolo', 'image/png')
  const full = await ensureLogo('logo-completo.webp', 'Albani · logo completa', 'image/webp')
  await api('PATCH', '/settings', {
    project_name: 'Albani Advocacia · Blog',
    project_color: '#C9A55A',
    default_language: 'pt-BR',
    project_logo: symbol,
    public_foreground: full,
    custom_css: CUSTOM_CSS,
  })
  console.log('identidade visual (logos, cores, CSS): aplicada')
}

await login()
await ensureBranding()
await ensureCollection()
await ensureSlugInterface()
await ensureLanguageTabs()
await ensurePostColumns()
await ensureHome()
await ensureBio()
const editorRole = await ensureRole({
  name: 'Editor',
  icon: 'edit_note',
  description: 'Escreve e publica os posts do blog',
  appAccess: true,
  permissions: [
    ...crud('posts'),
    ...['create', 'read', 'update'].map((action) => ({ collection: 'pagina_inicial', action })),
    ...['create', 'read', 'update'].map((action) => ({ collection: 'link_bio', action })),
    ...crud('directus_files'),
    { collection: 'directus_folders', action: 'read' },
  ],
})
const buildRole = await ensureRole({
  name: 'Build',
  icon: 'smart_toy',
  description: 'Leitura usada pelo build do site (token estático)',
  appAccess: false,
  permissions: [
    { collection: 'posts', action: 'read' },
    { collection: 'pagina_inicial', action: 'read' },
    { collection: 'link_bio', action: 'read' },
    { collection: 'directus_files', action: 'read' },
  ],
})
await ensureUsers(editorRole, buildRole)
await ensureFlow()
console.log('\nPronto. Próximo passo: importar os posts atuais (deploy/directus/import-posts.mjs).')
