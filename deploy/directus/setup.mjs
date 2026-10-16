// Configura o Directus para o blog (idempotente: pode rodar de novo sem duplicar nada).
// - coleção `posts` com campos PT/EN no mesmo formato que o site usa
// - perfil "Editor" (Dr. Ivan): cria/edita posts e envia imagens
// - usuário "build" com token estático só de leitura (BUILD_TOKEN), usado pelo fetch-posts
// - Flow que chama o builder (POST /rebuild) quando um post é criado, alterado ou apagado
import { api, findOne, login, pt, requireEnv } from './lib.mjs'

requireEnv('BUILD_TOKEN', 'REBUILD_SECRET')

const CATEGORY_CHOICES = [
  { text: 'Imigração', value: 'imigracao' },
  { text: 'Nacionalidade', value: 'nacionalidade' },
  { text: 'Documentos', value: 'documentos' },
  { text: 'Empresas', value: 'empresas' },
  { text: 'Investimento', value: 'investimento' },
]

const TOOLBAR = ['bold', 'italic', 'h2', 'h3', 'bullist', 'numlist', 'blockquote', 'customLink', 'customImage', 'removeformat', 'undo', 'redo', 'code', 'fullscreen']
const SLUG_RE = '^[a-z0-9]+(-[a-z0-9]+)*$'

function localeFields(l, label, sort) {
  const group = `grupo_${l}`
  return [
    {
      field: group,
      type: 'alias',
      meta: { interface: 'group-detail', special: ['alias', 'no-data', 'group'], options: { start: 'open' }, translations: pt(label), sort, width: 'full' },
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
        options: { slug: true, trim: true, placeholder: l === 'pt' ? 'ex.: visto-d7-ou-d8' : 'e.g. d7-or-d8-visa' },
        required: true,
        translations: pt('Endereço (slug)'),
        note: l === 'pt' ? 'Fica em /blog/<slug>. Não altere depois de publicado: o link antigo deixa de existir.' : 'Fica em /en/blog/<slug>.',
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
      meta: { group, interface: 'input-rich-text-html', options: { toolbar: TOOLBAR }, required: true, translations: pt('Texto'), sort: 5, width: 'full' },
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
  ...localeFields('pt', 'Português', 5),
  ...localeFields('en', 'English', 6),
]

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

  const relations = await api('GET', '/relations/posts')
  if (!relations.some((r) => r.field === 'cover')) {
    await api('POST', '/relations', { collection: 'posts', field: 'cover', related_collection: 'directus_files', schema: { on_delete: 'SET NULL' } })
    console.log('  relação cover -> directus_files: criada')
  }
}

/** Política + papel com as permissões dadas; devolve o id do papel */
async function ensureRole({ name, icon, description, appAccess, permissions }) {
  let policy = await findOne('/policies', { name })
  if (!policy) {
    policy = await api('POST', '/policies', { name, icon, description, app_access: appAccess, admin_access: false })
    await api('POST', '/permissions', permissions.map((p) => ({ policy: policy.id, fields: ['*'], permissions: {}, validation: {}, ...p })))
    console.log(`política "${name}": criada`)
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
  const flow = await findOne('/flows', { name })
  if (flow) {
    const op = await findOne('/operations', { flow: flow.id, key: 'rebuild' })
    if (op) await api('PATCH', `/operations/${op.id}`, { options: operationOptions })
    console.log(`flow "${name}": já existe (segredo atualizado)`)
    return
  }
  const created = await api('POST', '/flows', {
    name,
    icon: 'rocket_launch',
    color: '#C9A55A',
    description: 'Refaz o site estático quando um post muda',
    status: 'active',
    trigger: 'event',
    accountability: 'all',
    options: { type: 'action', scope: ['items.create', 'items.update', 'items.delete'], collections: ['posts'] },
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

await login()
await api('PATCH', '/settings', { project_name: 'Albani Advocacia · Blog', project_color: '#C9A55A', default_language: 'pt-BR' })
await ensureCollection()
const editorRole = await ensureRole({
  name: 'Editor',
  icon: 'edit_note',
  description: 'Escreve e publica os posts do blog',
  appAccess: true,
  permissions: [...crud('posts'), ...crud('directus_files'), { collection: 'directus_folders', action: 'read' }],
})
const buildRole = await ensureRole({
  name: 'Build',
  icon: 'smart_toy',
  description: 'Leitura usada pelo build do site (token estático)',
  appAccess: false,
  permissions: [
    { collection: 'posts', action: 'read' },
    { collection: 'directus_files', action: 'read' },
  ],
})
await ensureUsers(editorRole, buildRole)
await ensureFlow()
console.log('\nPronto. Próximo passo: importar os posts atuais (deploy/directus/import-posts.mjs).')
