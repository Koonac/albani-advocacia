#!/usr/bin/env bash
# Gera deploy/.env com segredos aleatórios.
# Uso: ./init-env.sh albani.kaedai.com.br cms.albani.kaedai.com.br voce@email.com [email-do-editor]
set -euo pipefail
cd "$(dirname "$0")"

if [ $# -lt 3 ]; then
  echo "Uso: $0 <domínio-do-site> <domínio-do-cms> <email-do-admin> [email-do-editor]" >&2
  exit 1
fi
if [ -f .env ]; then
  echo "deploy/.env já existe; apague-o antes se quiser gerar de novo." >&2
  exit 1
fi

SITE_DOMAIN=$1
CMS_DOMAIN=$2
ADMIN_EMAIL=$3
EDITOR_EMAIL=${4:-}

secret() { openssl rand -hex 32; }
password() { openssl rand -base64 18 | tr -d '/+=' | cut -c1-20; }

ADMIN_PASSWORD=$(password)
EDITOR_PASSWORD=""
[ -n "$EDITOR_EMAIL" ] && EDITOR_PASSWORD=$(password)

umask 077
cat > .env <<EOF
VITE_SITE_URL=https://$SITE_DOMAIN

DIRECTUS_KEY=$(secret)
DIRECTUS_SECRET=$(secret)
CMS_PUBLIC_URL=https://$CMS_DOMAIN

ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD

BUILD_TOKEN=$(secret)
REBUILD_SECRET=$(secret)

EDITOR_EMAIL=$EDITOR_EMAIL
EDITOR_PASSWORD=$EDITOR_PASSWORD

SITE_ROOT=/var/www/albani
EOF

echo "deploy/.env criado (permissão 600). Guarde as senhas num gerenciador de senhas:"
echo "  admin  $ADMIN_EMAIL  $ADMIN_PASSWORD"
[ -n "$EDITOR_EMAIL" ] && echo "  editor $EDITOR_EMAIL  $EDITOR_PASSWORD"
exit 0
