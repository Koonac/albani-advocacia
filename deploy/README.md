# Deploy na VPS: site estático + CMS do blog

O blog é editado no **Directus**, no mesmo domínio do site: o painel abre em `https://albani.kaedai.com.br/admin` (o nginx serve o Directus em `/cms/`). Ao salvar um post, um Flow do Directus chama o **builder**. O builder espera 15 s sem novas edições, roda `npm run build` (que busca os posts publicados na API) e publica o `dist/` em `/var/www/albani/releases/<data>`, trocando o symlink `/var/www/albani/current`. O nginx do host serve esse symlink. O site continua 100% estático: se o CMS cair, o site no ar não é afetado.

```
deploy/
├─ vps-bootstrap.sh       prepara uma VPS nova (usuário, firewall, Docker, nginx, certbot)
├─ init-env.sh            gera o .env com segredos aleatórios
├─ docker-compose.yml     Directus (SQLite) + builder
├─ .env.example           variáveis (referência)
├─ builder/server.mjs     recebe o webhook, builda e publica
├─ directus/setup.mjs     cria coleção, perfis, token e Flow (idempotente)
├─ directus/extensions/   extensões do painel (ex.: slug gerado a partir do título)
├─ directus/import-posts.mjs  importa os posts de src/content/posts/*.js
└─ nginx/albani.conf      site + proxy do CMS
```

## 0. DNS (antes de tudo)

No painel DNS do `kaedai.com.br`, crie um registro **A** apontando para o IP da VPS:

| Nome | Tipo | Valor |
|---|---|---|
| `albani` | A | IP da VPS |

Confira com `nslookup albani.kaedai.com.br`. O certbot (passo 5) só funciona depois que ele responder com o IP certo.

## 1. Preparar a VPS (uma vez por servidor)

No seu PC:

```bash
scp deploy/vps-bootstrap.sh root@IP_DA_VPS:/root/
ssh root@IP_DA_VPS "bash /root/vps-bootstrap.sh henrique"
```

O script atualiza o sistema e liga as atualizações automáticas de segurança. Também cria o usuário `henrique` (com sudo e docker, usando a mesma chave SSH do root), configura o firewall (SSH, 80 e 443), instala Docker, nginx e certbot, e desliga o login SSH por senha. Pode rodar de novo sem problema.

**Antes de fechar a sessão de root**, abra outro terminal e teste `ssh henrique@IP_DA_VPS` e depois `docker ps`. Daqui em diante, use sempre esse usuário.

## 2. Código e configuração

```bash
ssh henrique@IP_DA_VPS
git clone https://github.com/Koonac/albani-advocacia.git /opt/apps/albani-advocacia
cd /opt/apps/albani-advocacia/deploy

./init-env.sh albani.kaedai.com.br SEU_EMAIL EMAIL_DO_DR_IVAN
#   -> mostra as senhas do admin e do editor: guarde num gerenciador de senhas

mkdir -p data/database data/uploads && sudo chown -R 1000:1000 data   # o Directus roda como uid 1000
sudo mkdir -p /var/www/albani                                          # precisa estar vazia (sem "current")
```

O e-mail do Dr. Ivan é opcional: sem ele, crie o usuário depois pelo painel, com o papel **Editor**.

## 3. Subir o CMS e configurar

```bash
docker compose up -d directus
docker compose logs -f directus          # espere "Server started at http://0.0.0.0:8055", depois Ctrl+C
docker compose run --rm builder node deploy/directus/setup.mjs
docker compose run --rm builder node deploy/directus/import-posts.mjs
```

Os scripts rodam dentro do container do builder, então não é preciso ter Node no host. Rodar o `setup.mjs` de novo é seguro: ele só cria o que falta e reaplica o `BUILD_TOKEN` e o `REBUILD_SECRET`.

## 4. Subir o builder

```bash
docker compose up -d builder
docker compose logs -f builder           # 1º start: npm install + build -> "publicado: releases/...", depois Ctrl+C
ls -l /var/www/albani/current
```

## 5. nginx + HTTPS

```bash
sudo cp nginx/albani.conf /etc/nginx/sites-available/albani.conf
sudo ln -s /etc/nginx/sites-available/albani.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d albani.kaedai.com.br
```

O certbot pede um e-mail, adiciona os blocos HTTPS ao `albani.conf` e agenda a renovação automática. Teste: abra `https://albani.kaedai.com.br` e `https://albani.kaedai.com.br/admin`.

**Antes de o DNS estar pronto**, dá para acessar adicionando `IP_DA_VPS albani.kaedai.com.br` ao arquivo hosts do seu PC (`C:WindowsSystem32driversetchosts`) e abrindo `http://albani.kaedai.com.br/admin`. Um túnel direto para a porta 8055 não funciona: o painel espera estar em `/cms/`.

## Uso no dia a dia

- O Dr. Ivan entra em `https://albani.kaedai.com.br/admin` (perfil **Editor**), abre **Posts do blog** e cria ou edita um post. Com status **Publicado**, o site é atualizado em cerca de 1 minuto.
- **Rascunho** não aparece no site. **Arquivado** tira o post do ar.
- Não troque o slug de um post já publicado: o link antigo (e o Google) passa a dar 404.
- Estado do último build: `docker compose exec builder wget -qO- http://localhost:9000/health`.

## Atualizar o código do site

```bash
cd /opt/apps/albani-advocacia && git pull
cd deploy && docker compose restart builder   # reinstala deps se o lockfile mudou e builda
```

Se o `git pull` trouxe mudanças em `deploy/directus/` (extensões ou `setup.mjs`), aplique também:

```bash
docker compose up -d directus                                     # recria o container se o docker-compose.yml mudou; senão, use restart
docker compose run --rm builder node deploy/directus/setup.mjs    # reaplica campos e configurações
```

## Trocar para o domínio definitivo

1. Crie o DNS do novo domínio.
2. No `deploy/.env`, troque `VITE_SITE_URL` e `CMS_PUBLIC_URL`.
3. No `/etc/nginx/sites-available/albani.conf`, troque o `server_name`.
4. Rode `docker compose up -d` (recria os containers com o `.env` novo).
5. Rode `sudo nginx -t && sudo systemctl reload nginx` e o `certbot --nginx -d ...` com os novos nomes.

## Backup

Tudo o que importa está em `deploy/data/` (banco SQLite + imagens enviadas) e no `deploy/.env`. Exemplo de cron diário (`crontab -e`):

```bash
0 3 * * * cd /opt/apps/albani-advocacia/deploy && sqlite3 data/database/data.db ".backup /tmp/albani.db" && tar czf $HOME/backups/albani-$(date +\%F).tgz -C /tmp albani.db -C $PWD data/uploads .env && rm /tmp/albani.db
```

Crie a pasta antes (`mkdir -p ~/backups`) e copie os backups para fora da VPS de vez em quando.

## Outros projetos na mesma VPS

O nginx do host é a única porta de entrada (80/443). Cada projeto Docker publica a porta **só em `127.0.0.1`**, com um número diferente (este usa `127.0.0.1:8055`), e ganha um arquivo próprio em `/etc/nginx/sites-available/` com `proxy_pass http://127.0.0.1:<porta>`. Não publique portas sem o prefixo `127.0.0.1:`: o Docker ignora o ufw e a porta ficaria aberta para a internet.

## Problemas comuns

- **Build falha com `Cannot find module @rollup/rollup-linux-x64-musl`** (ou outro binário nativo): apague o volume de dependências e reinicie. Rode `docker compose down builder && docker volume rm deploy_node_modules && docker compose up -d builder`.
- **Post salvo, mas o site não muda**: veja `docker compose logs builder`. Se aparecer "post ignorado: faltam ...", o post publicado está sem algum campo obrigatório em PT ou EN.
- **certbot falha com "unauthorized" / "NXDOMAIN"**: o DNS ainda não aponta para a VPS (passo 0).
- **Rollback**: `ln -sfn releases/<data-anterior> /var/www/albani/current` (as 5 últimas releases ficam guardadas).
