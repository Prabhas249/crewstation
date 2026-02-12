# Sprites.dev Integration Guide

## Overview

ClawDirector uses **Sprites.dev** for per-user isolated OpenClaw instances. Each user gets their own Firecracker VM with complete hardware isolation.

## Architecture

### Mission Control Pattern
- **Wake**: Every 15 minutes via cron heartbeat
- **Work**: Check for tasks, run agents for ~2 minutes
- **Sleep**: Auto-sleep to save costs (only storage billing)

### Cost Structure (4GB RAM)
- **Active**: $0.18/hour
- **Storage**: $0.0003/GB/hour (10GB = $0.003/hour)
- **Heartbeat pattern**: ~96 hours/month active = **$20.64/user/month**
- **Indian pricing**: ~₹1,586/user/month

## Database Schema

Run `sprites-schema.sql` in Supabase SQL Editor:
```bash
psql $DATABASE_URL < sprites-schema.sql
```

## Environment Variables

Required in `.env.local`:
```bash
# Sprites API
SPRITES_API_TOKEN=your-token-from-sprites.dev

# Supabase Service Role (for cron jobs)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cron Security
CRON_SECRET=generate-random-secret
```

## Setup Steps

### 1. Create OpenClaw Template Sprite (One-Time)

```bash
# SSH into Sprites.dev and create template
sprites create --name openclaw-template --ram 4096 --storage 10

# Install OpenClaw
sprites exec openclaw-template "
  curl -fsSL https://raw.githubusercontent.com/openclaw/openclaw/main/install.sh | bash
  # Configure OpenClaw gateway
  # Test that everything works
"

# Checkpoint the template
sprites checkpoint openclaw-template

# Get template ID
sprites list | grep openclaw-template
# Copy the ID and set in environment:
# OPENCLAW_TEMPLATE_ID=template-id-here
```

### 2. Deploy Cron Job

**Vercel**: Already configured in `vercel.json` (deploys automatically)

**Other platforms**:
- Railway: Use cron addon
- Fly.io: Use fly-cron
- Manual: Setup external cron to hit `/api/cron/heartbeat` every 15 min

### 3. Test Provisioning

After user completes onboarding:
```bash
curl -X POST http://localhost:3000/api/sprites/provision \
  -H "Cookie: your-auth-cookie" \
  -H "Content-Type: application/json"
```

### 4. Monitor Sprites

```bash
# Get status
curl http://localhost:3000/api/sprites/{spriteId}/status

# Start manually
curl -X POST http://localhost:3000/api/sprites/{spriteId}/start

# Stop manually
curl -X POST http://localhost:3000/api/sprites/{spriteId}/stop
```

## API Endpoints

### User-facing
- `POST /api/sprites/provision` - Create Sprite for current user
- `GET /api/sprites/[spriteId]/status` - Get Sprite status
- `POST /api/sprites/[spriteId]/start` - Start Sprite
- `POST /api/sprites/[spriteId]/stop` - Stop Sprite

### Internal
- `GET /api/cron/heartbeat` - Cron job (secured with CRON_SECRET)

## Integration Flow

### New User Signup
1. User completes onboarding → workspace created
2. Call `POST /api/sprites/provision`
3. Sprite cloned from template (~1 second)
4. Gateway details saved to `user_sprites` table
5. User dashboard connects to their Sprite's gateway

### Active Usage
1. Cron wakes Sprite every 15 minutes
2. Sprite checks for new tasks
3. Runs agents for ~2 minutes
4. Auto-sleeps (storage-only billing)

### User Dashboard
1. Frontend fetches Sprite status: `GET /api/sprites/{id}/status`
2. Connect WebSocket to `sprite.gateway_url` with `sprite.gateway_token`
3. User interacts with their isolated OpenClaw instance

## Monitoring

Add to dashboard:
- Sprite status indicator (online/sleeping/stopped)
- Last heartbeat timestamp
- Total runtime hours
- Estimated monthly cost

Query:
```sql
SELECT
  sprite_name,
  status,
  last_heartbeat,
  total_runtime_minutes,
  total_cost_usd
FROM user_sprites
WHERE user_id = $1;
```

## Cost Tracking

Update after each heartbeat:
```sql
UPDATE user_sprites
SET
  total_runtime_minutes = total_runtime_minutes + 2,
  total_cost_usd = total_cost_usd + (2 * 0.18 / 60)
WHERE sprite_id = $1;
```

## Security

✅ **Hardware isolation** - Firecracker VMs per user
✅ **Network policies** - DNS allow-lists
✅ **Gateway tokens** - Unique per Sprite
✅ **RLS policies** - Database row-level security
✅ **Cron auth** - Bearer token required

## Troubleshooting

### Sprite won't start
- Check `sprite.status` in database
- Verify `SPRITES_API_TOKEN` is valid
- Check Sprites.dev dashboard for errors

### Heartbeat failing
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check cron logs (Vercel dashboard → Functions → Cron)
- Ensure `CRON_SECRET` matches in both places

### High costs
- Check `total_runtime_minutes` per user
- Verify auto-sleep is working (status should be "sleeping")
- Adjust heartbeat frequency in `vercel.json` (15min default)

## Next Steps

1. ✅ Install `@fly/sprites` package
2. ✅ Add environment variables
3. ✅ Run `sprites-schema.sql` in Supabase
4. 🔲 Create OpenClaw template Sprite
5. 🔲 Deploy to Vercel (cron auto-enabled)
6. 🔲 Test provisioning flow
7. 🔲 Add Sprite status to dashboard UI
8. 🔲 Connect WebSocket gateway to chat

## References

- [Sprites.dev Docs](https://docs.sprites.dev)
- [Sprites.dev Quickstart](https://docs.sprites.dev/quickstart/)
- [Sprites API Reference](https://docs.sprites.dev/api/v001-rc30/)
- [GitHub: superfly/sprites-js](https://github.com/superfly/sprites-js)
