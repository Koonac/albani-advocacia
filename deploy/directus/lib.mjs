// Cliente REST mínimo do Directus para os scripts de setup/importação.
// Roda dentro do container builder (CMS_URL=http://directus:8055) ou no host
// com `node --env-file=deploy/.env ...` (padrão http://localhost:8055).
export const CMS_URL = (process.env.CMS_URL || 'http://localhost:8055').replace(/\/$/, '')

export function requireEnv(...names) {
  const missing = names.filter((n) => !process.env[n])
  if (missing.length) {
    console.error(`Variáveis ausentes: ${missing.join(', ')} (veja deploy/.env.example)`)
    process.exit(1)
  }
}

let token = null

export async function api(method, path, body) {
  const res = await fetch(`${CMS_URL}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (res.status === 204) return null
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(json.errors ?? json)}`)
    err.status = res.status
    throw err
  }
  return json.data
}

/** Espera o Directus responder (logo após um `docker compose up` ele leva ~30 s para subir) */
async function waitForServer(timeoutMs = 120_000) {
  const until = Date.now() + timeoutMs
  let warned = false
  while (true) {
    try {
      const res = await fetch(`${CMS_URL}/server/health`)
      if (res.ok) return
    } catch {
      // ainda não está ouvindo
    }
    if (Date.now() > until) {
      console.error(`O Directus não respondeu em ${CMS_URL} após ${timeoutMs / 1000}s. Veja: docker compose logs directus`)
      process.exit(1)
    }
    if (!warned) console.log('aguardando o Directus subir...'), (warned = true)
    await new Promise((r) => setTimeout(r, 2000))
  }
}

export async function login() {
  requireEnv('ADMIN_EMAIL', 'ADMIN_PASSWORD')
  await waitForServer()
  const data = await api('POST', '/auth/login', { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD })
  token = data.access_token
}

/** Envia um arquivo local para a biblioteca do Directus; devolve o id */
export async function uploadFile(path, { title, type }) {
  const { readFile } = await import('node:fs/promises')
  const { basename } = await import('node:path')
  const form = new FormData()
  form.append('title', title)
  // o campo "file" precisa ser o último do formulário
  form.append('file', new Blob([await readFile(path)], { type }), basename(path))
  const res = await fetch(`${CMS_URL}/files`, { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: form })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`upload ${path} -> ${res.status}: ${JSON.stringify(json.errors ?? json)}`)
  return json.data.id
}

/** Primeiro item que casa com o filtro { campo: valor }, ou null */
export async function findOne(path, filter) {
  const qs = Object.entries(filter)
    .map(([k, v]) => `filter[${k}][_eq]=${encodeURIComponent(v)}`)
    .join('&')
  const list = await api('GET', `${path}?${qs}&limit=1`)
  return list?.[0] ?? null
}

export const pt = (translation) => [{ language: 'pt-BR', translation }]
