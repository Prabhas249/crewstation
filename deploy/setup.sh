#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
# CrewStation VPS Setup Script
# Run on a fresh Hetzner VPS (Ubuntu 22.04+)
# Usage: chmod +x setup.sh && sudo ./setup.sh
# ══════════════════════════════════════════════════════════════════════

set -e

DOMAIN="api.crewstation.app"
EMAIL="prabhas@crewstation.app"

echo "═══ CrewStation VPS Setup ═══"
echo "Domain: $DOMAIN"
echo ""

# ── 1. System updates ────────────────────────────────────────────────
echo "→ Updating system..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Install Docker ────────────────────────────────────────────────
echo "→ Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    apt-get install -y docker-compose-plugin
fi

echo "  Docker $(docker --version | cut -d' ' -f3)"
echo "  $(docker compose version)"

# ── 3. Firewall ──────────────────────────────────────────────────────
echo "→ Configuring firewall..."
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (redirect to HTTPS)
ufw allow 443/tcp   # HTTPS
ufw --force enable

# ── 4. Create directories ────────────────────────────────────────────
echo "→ Setting up directories..."
mkdir -p /opt/crewstation/openclaw-config
mkdir -p /opt/crewstation/nginx/conf.d

# Copy configs
cp docker-compose.yml /opt/crewstation/
cp nginx/nginx.conf /opt/crewstation/nginx/

# ── 5. Get TLS certificate ───────────────────────────────────────────
echo "→ Getting TLS certificate..."
# First, start nginx without SSL for certbot challenge
cat > /opt/crewstation/nginx/temp.conf << 'TEMPNGINX'
events { worker_connections 1024; }
http {
    server {
        listen 80;
        location /.well-known/acme-challenge/ { root /var/www/certbot; }
        location / { return 200 'ok'; }
    }
}
TEMPNGINX

docker run -d --name temp-nginx -p 80:80 \
    -v /opt/crewstation/nginx/temp.conf:/etc/nginx/nginx.conf:ro \
    -v /opt/crewstation/certbot-www:/var/www/certbot \
    nginx:alpine

# Get certificate
docker run --rm \
    -v /opt/crewstation/certbot-conf:/etc/letsencrypt \
    -v /opt/crewstation/certbot-www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot --webroot-path=/var/www/certbot \
    --email "$EMAIL" --agree-tos --no-eff-email \
    -d "$DOMAIN"

docker stop temp-nginx && docker rm temp-nginx
rm /opt/crewstation/nginx/temp.conf

# ── 6. Start the stack ───────────────────────────────────────────────
echo "→ Starting CrewStation..."
cd /opt/crewstation
docker compose up -d

echo ""
echo "═══ CrewStation is LIVE ═══"
echo "Gateway: wss://$DOMAIN/gateway"
echo "Health:  https://$DOMAIN/health"
echo ""
echo "Next steps:"
echo "  1. Point DNS: $DOMAIN → $(curl -s ifconfig.me)"
echo "  2. Update .env.local: NEXT_PUBLIC_GATEWAY_URL=wss://$DOMAIN/gateway"
echo "  3. Redeploy Vercel"
