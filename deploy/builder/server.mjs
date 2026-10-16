// Builder do site: recebe POST /rebuild (Flow do Directus), espera as edições pararem,
// roda `npm run build` e publica o dist/ em /site/releases/<ts>, trocando o symlink
// /site/current de forma atômica. Sem dependências: só Node nativo.
import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { createHash, timingSafeEqual } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, readlinkSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const APP = '/app'
const SITE = '/site'
const RELEASES = join(SITE, 'releases')
const KEEP_RELEASES = 5
const DEBOUNCE_MS = 15_000
const PORT = 9000
const SECRET = process.env.REBUILD_SECRET || ''

const log = (...a) => console.log(new Date().toISOString(), ...a)

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: APP, stdio: 'inherit', env: process.env })
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} saiu com código ${code}`))))
  })
}

/** Instala dependências só quando o package-lock.json mudou (node_modules fica num volume) */
async function ensureDeps() {
  const lockPath = join(APP, 'package-lock.json')
  const lock = readFileSync(lockPath)
  const hash = createHash('sha256').update(lock).digest('hex')
  const marker = join(APP, 'node_modules', '.lock-hash')
  if (existsSync(marker) && readFileSync(marker, 'utf8') === hash) return
  log('instalando dependências...')
  // `npm install` e não `npm ci`: o ci tenta apagar node_modules, que aqui é ponto de montagem.
  // O lockfile é restaurado depois, para o `git pull` no host nunca encontrar alterações locais.
  try {
    await run('npm', ['install', '--no-audit', '--no-fund'])
  } finally {
    writeFileSync(lockPath, lock)
  }
  writeFileSync(marker, hash)
}

function publish() {
  const id = new Date().toISOString().replace(/[:.]/g, '-')
  mkdirSync(RELEASES, { recursive: true })
  cpSync(join(APP, 'dist'), join(RELEASES, id), { recursive: true })
  // Symlink relativo: o mesmo caminho vale dentro do container e no host
  const tmp = join(SITE, 'current.tmp')
  rmSync(tmp, { force: true })
  symlinkSync(join('releases', id), tmp)
  renameSync(tmp, join(SITE, 'current'))

  const current = readlinkSync(join(SITE, 'current'))
  const old = readdirSync(RELEASES).sort().reverse().slice(KEEP_RELEASES)
  for (const dir of old) if (!current.endsWith(dir)) rmSync(join(RELEASES, dir), { recursive: true, force: true })
  log(`publicado: releases/${id}`)
}

let timer = null
let building = false
let pending = false
let lastResult = 'nenhum build ainda'

async function build() {
  if (building) {
    pending = true
    return
  }
  building = true
  pending = false
  const started = Date.now()
  try {
    await ensureDeps()
    await run('npm', ['run', 'build'])
    publish()
    lastResult = `ok em ${new Date().toISOString()} (${Math.round((Date.now() - started) / 1000)}s)`
  } catch (err) {
    // O site no ar continua sendo a última release que deu certo
    lastResult = `falhou em ${new Date().toISOString()}: ${err.message}`
    log('build falhou:', err.message)
  } finally {
    building = false
    if (pending) build()
  }
}

function schedule() {
  clearTimeout(timer)
  timer = setTimeout(build, DEBOUNCE_MS)
}

function validSecret(value) {
  if (!SECRET || typeof value !== 'string') return false
  const a = Buffer.from(value)
  const b = Buffer.from(SECRET)
  return a.length === b.length && timingSafeEqual(a, b)
}

createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/rebuild') {
    req.resume()
    if (!validSecret(req.headers['x-rebuild-secret'])) {
      res.writeHead(401).end('unauthorized')
      return
    }
    log('rebuild solicitado')
    schedule()
    res.writeHead(202).end('scheduled')
    return
  }
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ building, pending, lastResult }))
    return
  }
  res.writeHead(404).end()
}).listen(PORT, () => {
  if (!SECRET) log('AVISO: REBUILD_SECRET vazio, todo POST /rebuild será recusado')
  log(`builder ouvindo na porta ${PORT}`)
  build()
})
