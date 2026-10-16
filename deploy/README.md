# Deploy na VPS: site estático + CMS do blog

O blog é editado no **Directus** (`https://cms.albaniadv.com`). Ao salvar um post, um Flow do Directus chama o **builder**. O builder espera 15 s sem novas edições, roda `npm run build` (que busca os posts publicados na API) e publica o `dist/` em `/var/www/albani/releases/<data>`, trocando o symlink `/var/www/albani/current`. O nginx do host serve esse symlink. O site continua 100% estático: se o CMS cair, o site no ar não é afetado.

```
deploy/
├─ docker-compose.yml     Directus (SQLite) + builder
├─ .env.example           variáveis (copiar para .env)
├─ builder/server.mjs     recebe o webhook, builda e publica
├─ directus/setup.mjs     cria coleção, perfis, token e Flow (idempotente)
├─ directus/import-posts.mjs  importa os posts de src/content/posts/*.js
└─ nginx/albani.conf      site + proxy do CMS
```

## 1. Pré-requisitos

- Docker com o plugin compose (`docker compose version`).
- nginx e certbot no host.
- DNS: `albaniadv.com`, `www` e `cms` apontando para a VPS.

## 2. Código e configuração

```bash
sudo mkdir -p /opt/albani && sudo chown $USER /opt/albani
git clone <repo> /opt/albani && cd /opt/albani/deploy
cp .env.example .env
# preencha .env; para cada segredo: openssl rand -hex 32
mkdir -p data/database data/uploads && sudo chown -R 1000:1000 data   # o Directus roda como uid 1000
sudo mkdir -p /var/www/albani                                          # precisa estar vazia (sem "current")
```

## 3. Subir o CMS e configurar

```bash
docker compose up -d directus
docker compose logs -f directus          # espere "Server started at http://0.0.0.0:8055"
docker compose run --rm builder node deploy/directus/setup.mjs
docker compose run --rm builder node deploy/directus/import-posts.mjs
```

Os scripts rodam dentro do container do builder, então não é preciso ter Node no host. Rodar o `setup.mjs` de novo é seguro: ele só cria o que falta e reaplica o `BUILD_TOKEN` e o `REBUILD_SECRET`.

## 4. Subir o builder

```bash
docker compose up -d builder
docker compose logs -f builder           # 1º start: npm install + build inicial -> "publicado: releases/..."
ls -l /var/www/albani/current
```

## 5. nginx + HTTPS

```bash
sudo cp nginx/albani.conf /etc/nginx/sites-available/albani.conf
sudo ln -s /etc/nginx/sites-available/albani.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d albaniadv.com -d www.albaniadv.com -d cms.albaniadv.com
```

Ajuste os domínios no `albani.conf`, no `CMS_PUBLIC_URL` e em `src/config/site.js` (`SITE_URL`) se forem outros.

## Uso no dia a dia

- O Dr. Ivan entra em `https://cms.albaniadv.com` (perfil **Editor**), abre **Posts do blog** e cria ou edita um post. Com status **Publicado**, o site é atualizado em cerca de 1 minuto.
- **Rascunho** não aparece no site. **Arquivado** tira o post do ar.
- Não troque o slug de um post já publicado: o link antigo (e o Google) passa a dar 404.
- Estado do último build: `docker compose exec builder wget -qO- http://localhost:9000/health`.

## Atualizar o código do site

```bash
cd /opt/albani && git pull
docker compose -f deploy/docker-compose.yml restart builder   # reinstala deps se o lockfile mudou e builda
```

## Backup

Tudo o que importa está em `deploy/data/` (banco SQLite + imagens enviadas). Exemplo de cron diário:

```bash
0 3 * * * cd /opt/albani/deploy && sqlite3 data/database/data.db ".backup data/backup.db" && tar czf /root/backups/albani-$(date +\%F).tgz data/backup.db data/uploads && rm data/backup.db
```

## Problemas comuns

- **Build falha com `Cannot find module @rollup/rollup-linux-x64-musl`** (ou outro binário nativo): apague o volume de dependências e reinicie. Rode `docker compose down builder && docker volume rm deploy_node_modules && docker compose up -d builder`.
- **Post salvo, mas o site não muda**: veja `docker compose logs builder`. Se aparecer "post ignorado: faltam ...", o post publicado está sem algum campo obrigatório em PT ou EN.
- **Rollback**: `ln -sfn releases/<data-anterior> /var/www/albani/current` (as 5 últimas releases ficam guardadas).
