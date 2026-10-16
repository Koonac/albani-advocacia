#!/usr/bin/env bash
# Prepara uma VPS nova (Ubuntu 22.04/24.04 ou Debian 12) para receber projetos Docker atrás do nginx.
# Roda uma vez, como root:  bash vps-bootstrap.sh <usuario>
# O que faz: atualiza o sistema, liga as atualizações automáticas de segurança, cria o usuário
# (sudo + docker) copiando as chaves SSH do root, firewall (SSH/80/443), Docker, nginx, certbot,
# e desliga o login SSH por senha (só se o usuário já tiver uma chave autorizada).
set -euo pipefail

USERNAME=${1:-}
if [ "$(id -u)" -ne 0 ] || [ -z "$USERNAME" ]; then
  echo "Uso (como root): bash $0 <usuario>" >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
log() { printf '\n\033[1;33m==> %s\033[0m\n' "$*"; }

log "Atualizando o sistema"
apt-get update
apt-get -y upgrade
apt-get install -y ca-certificates curl git sqlite3 ufw unattended-upgrades openssl
dpkg-reconfigure -f noninteractive unattended-upgrades

log "Usuário $USERNAME"
if ! id "$USERNAME" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$USERNAME"
fi
usermod -aG sudo "$USERNAME"
if [ -f /root/.ssh/authorized_keys ]; then
  install -d -m 700 -o "$USERNAME" -g "$USERNAME" "/home/$USERNAME/.ssh"
  install -m 600 -o "$USERNAME" -g "$USERNAME" /root/.ssh/authorized_keys "/home/$USERNAME/.ssh/authorized_keys"
fi

log "Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
usermod -aG docker "$USERNAME"
# Logs dos containers com tamanho limitado (o padrão cresce sem limite)
if [ ! -f /etc/docker/daemon.json ]; then
  cat > /etc/docker/daemon.json <<'EOF'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
EOF
  systemctl restart docker
fi

log "nginx + certbot"
apt-get install -y nginx certbot python3-certbot-nginx
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

log "Firewall"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

log "Pastas"
install -d -o "$USERNAME" -g "$USERNAME" /opt/apps
install -d /var/www

log "SSH"
if [ -s "/home/$USERNAME/.ssh/authorized_keys" ]; then
  # "00-" para vir antes do 50-cloud-init.conf (no sshd vale o primeiro valor lido)
  cat > /etc/ssh/sshd_config.d/00-hardening.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
EOF
  sshd -t
  if systemctl list-unit-files ssh.service >/dev/null 2>&1; then systemctl reload ssh; else systemctl reload sshd; fi
  echo "Login por senha desligado. Root continua entrando só com chave."
else
  echo "AVISO: $USERNAME não tem chave SSH; o login por senha continua ligado." >&2
  echo "Copie sua chave (ssh-copy-id $USERNAME@<ip>) e rode este script de novo." >&2
fi

log "Pronto"
echo "Teste num NOVO terminal, antes de fechar este: ssh $USERNAME@<ip>  e depois  docker ps"
