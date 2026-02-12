# ClawDirector VPS Information

**Provider:** Hetzner Cloud
**Server Name:** ubuntu-4gb-nbg1-2
**Server Type:** cpx22
**Specs:** 2 vCPU, 4GB RAM, 80GB Disk
**Location:** Nuremberg, Germany (nbg1)
**Created:** Feb 11, 2026 (6 hours ago)
**Status:** ✅ Running

---

## Server Details

### SSH Access
**IP Address:** 128.140.96.13
**IPv6:** 2a01:4f8:1c1b:e1a9::/64
**User:** root
**Initial Password:** qtFqT9WLNktd34JRJHMs
**Note:** You'll be prompted to change password on first login

```bash
# Connect via SSH:
ssh root@128.140.96.13

# When prompted:
# 1. Enter initial password: qtFqT9WLNktd34JRJHMs
# 2. Enter new password (choose your own)
# 3. Confirm new password
```

### OpenClaw Gateway
- **URL:** wss://api.clawdirector.com
- **Port:** 18789 (internal), 443 (external via Nginx)
- **Container Name:** openclaw

### Docker Commands
```bash
# Check if running
docker ps | grep openclaw

# Get gateway token
docker exec openclaw cat /workspace/.openclaw/gateway.json

# View logs
docker logs openclaw --tail 50

# Restart if needed
docker restart openclaw

# Stop
docker stop openclaw

# Start
docker start openclaw
```

---

## Network Configuration

### DNS Records
- **Domain:** clawdirector.com
- **Subdomain:** api.clawdirector.com
- **Type:** A record
- **Points to:** [VPS IP ADDRESS]

### Nginx (Reverse Proxy)
```bash
# Check Nginx status
systemctl status nginx

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Firewall
```bash
# Check open ports
ufw status

# Should show:
# 22/tcp (SSH)
# 80/tcp (HTTP)
# 443/tcp (HTTPS)
# 18789/tcp should be CLOSED (only internal)
```

---

## OpenClaw Configuration

### Gateway Token
**Location:** `/workspace/.openclaw/gateway.json`

**Get token:**
```bash
docker exec openclaw cat /workspace/.openclaw/gateway.json | grep token
```

**Format:**
```json
{
  "token": "gw_xxxxxxxxxxxxxxxxxx"
}
```

### API Keys Storage
**User API keys stored in:** Supabase (encrypted)
- anthropic_api_key
- openai_api_key
- gemini_api_key

**NOT stored on VPS** (for security)

---

## Monitoring

### Check CPU/RAM Usage
```bash
# On VPS
htop

# Docker stats
docker stats openclaw
```

### Check Disk Space
```bash
df -h
```

### Check OpenClaw Health
```bash
# Test WebSocket connection
apt install -y websocat
websocat wss://api.clawdirector.com

# Should connect (press Ctrl+C to exit)
```

---

## Backup & Maintenance

### Hetzner Snapshots
- Backups: Not enabled (€1.40/mo extra)
- Manual snapshots: Available from Hetzner console

### Update OpenClaw
```bash
# Pull latest image
docker pull openclaw/openclaw:latest

# Stop current
docker stop openclaw

# Remove old container
docker rm openclaw

# Run new version
docker run -d \
  --name openclaw \
  -p 18789:18789 \
  -v openclaw-data:/workspace \
  openclaw/openclaw:latest

# Check logs
docker logs openclaw -f
```

---

## Cost

**Monthly:** €6.99 (~₹650)
**Traffic:** 20TB included
**Current usage:** 0.08 usage

---

## Security Checklist

- [ ] SSH key authentication enabled (disable password)
- [ ] Firewall configured (ufw)
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] OpenClaw port 18789 NOT exposed externally
- [ ] Regular security updates
- [ ] Monitoring alerts configured

---

## Troubleshooting

### OpenClaw won't start
```bash
# Check logs
docker logs openclaw

# Check if port is in use
netstat -tulpn | grep 18789

# Remove and recreate
docker stop openclaw
docker rm openclaw
# Re-run docker run command
```

### Can't connect via SSH
```bash
# From local machine:
ping YOUR_IP_ADDRESS
telnet YOUR_IP_ADDRESS 22

# If fails: check Hetzner firewall rules
```

### Gateway timeout from dashboard
1. Check OpenClaw is running: `docker ps`
2. Check Nginx is running: `systemctl status nginx`
3. Check SSL cert: `certbot certificates`
4. Test locally: `curl http://localhost:18789`

---

## Quick Reference

**Hetzner Console:** https://console.hetzner.cloud/
**Server:** ubuntu-4gb-nbg1-2
**Gateway:** wss://api.clawdirector.com
**Dashboard:** https://clawdirector.com (Vercel)
**Database:** Supabase (pqojhnvpjljgtcevtyuf.supabase.co)

---

**Last Updated:** Feb 11, 2026
