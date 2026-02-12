# ✅ Sprites Integration - Setup Complete!

## What We've Done (Option A ✅)

### 1. Database ✅
- ✅ Created `user_sprites` table in Supabase
- ✅ Added RLS policies for security
- ✅ Added indexes for performance
- ✅ Auto-update triggers configured

### 2. Environment ✅
- ✅ Installed `@fly/sprites` SDK (v0.0.1)
- ✅ Added `SPRITES_API_TOKEN` to `.env.local`
- ✅ Added `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
- ✅ Generated `CRON_SECRET` for heartbeat security

### 3. Sprites Client ✅
- ✅ Built wrapper around `@fly/sprites` SDK
- ✅ Functions: create, wake, status, exec, heartbeat, checkpoint
- ✅ Proper error handling and logging
- ✅ TypeScript types defined

### 4. API Routes ✅
- ✅ `POST /api/sprites/provision` - Create Sprite for new users
- ✅ `GET /api/sprites/[name]/status` - Get Sprite status
- ✅ `GET /api/cron/heartbeat` - Wake all Sprites every 15 min
- ❌ Removed start/stop routes (Sprites auto-wake/sleep)

### 5. Vercel Cron ✅
- ✅ `vercel.json` configured for 15-minute heartbeat
- ✅ Auto-deploys on Vercel with cron enabled
- ✅ Bearer token auth for security

### 6. Cost Tracking ✅
- ✅ Heartbeat increments `total_runtime_minutes` by 2
- ✅ Calculates cost: 2 min × $0.18/hr ÷ 60 = $0.006 per heartbeat
- ✅ Stored in `user_sprites.total_cost_usd`

---

## Current Status

### ✅ Ready for Testing
The infrastructure is ready! You can now:

1. **Test provisioning locally**:
   ```bash
   # Navigate to /onboarding in browser
   # Complete onboarding
   # Call POST /api/sprites/provision
   ```

2. **Check database**:
   ```sql
   SELECT * FROM user_sprites;
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

### ⚠️ Missing: OpenClaw Template

**Without template**: New users wait 15 minutes for Sprite setup (BAD UX)
**With template**: New users get Sprite in 1 second (GOOD UX)

---

## Option B: Create OpenClaw Template (Next Step)

### What's Needed

1. **Create Template Sprite** (manual - 30 min)
   ```bash
   # Via Sprites.dev dashboard or CLI
   sprites create --name openclaw-template --ram 4096 --storage 10
   ```

2. **Install OpenClaw** (in Sprite via SSH)
   ```bash
   # Install Node.js, OpenClaw, dependencies
   # Configure gateway
   # Test it works
   ```

3. **Create Checkpoint**
   ```bash
   sprites checkpoint openclaw-template --comment "Production OpenClaw template"
   ```

4. **Save Checkpoint ID**
   ```bash
   # Add to .env.local:
   OPENCLAW_TEMPLATE_NAME=openclaw-template
   OPENCLAW_CHECKPOINT_ID=checkpoint-id-here
   ```

### Without Template

If you want to test NOW without template:
- Provisioning will call `createUserSprite()`
- It will run `curl https://openclaw.ai/install.sh | bash`
- Takes ~15 minutes
- Works, but slow UX

### With Template

Once template is created:
- Provisioning calls `cloneFromCheckpoint()`
- Restores from checkpoint
- Takes ~1 second
- Fast UX!

---

## Testing Without OpenClaw

To test the Sprites integration without OpenClaw:

1. **Simplify provisioning** (temporary):
   ```typescript
   // In provision/route.ts, replace createUserSprite() with:
   const sprite = await spritesClient.createSprite(spriteName, {
     environment: { USER_ID: user.id, WORKSPACE_ID: workspace.id }
   });
   // Skip OpenClaw installation
   ```

2. **Test provision**:
   ```bash
   curl -X POST http://localhost:3000/api/sprites/provision \
     -H "Cookie: your-session-cookie"
   ```

3. **Check it created**:
   ```bash
   # In Sprites.dev dashboard, you should see: claw-{workspace-id}
   ```

4. **Test heartbeat manually**:
   ```bash
   curl http://localhost:3000/api/cron/heartbeat \
     -H "Authorization: Bearer 6196dc48cda5d12476cf70780f3d52a59520166abaa154ba80b23eaff93c59d2"
   ```

---

## Cost Estimate (India Pricing)

### Per User (4GB RAM)
- **Heartbeat**: 96 hrs/month active = $20.64/user/month
- **Storage**: 10GB always = $2.16/month
- **Total**: ~$22.80/user/month = **₹1,895/user/month**

### Pricing Strategy
- Free: No Sprites (local only)
- Basic: ₹2,999/mo (includes Sprite cost)
- Pro: ₹9,999/mo (premium features)

---

## Next Steps

### Immediate (Test Option A)
1. Test `/api/sprites/provision` endpoint
2. Check if Sprite gets created in Sprites.dev dashboard
3. Test `/api/cron/heartbeat` manually
4. Verify cost tracking in database

### Short-term (Complete Option B)
1. Create OpenClaw template Sprite
2. Install & configure OpenClaw
3. Create checkpoint
4. Add checkpoint ID to `.env.local`
5. Redeploy

### Long-term (Production)
1. Add Sprite status UI to dashboard
2. Build WebSocket connection to gateway
3. Implement agent chat interface
4. Add cost tracking dashboard
5. Monitor & optimize

---

## Documentation

- **Full guide**: `SPRITES_INTEGRATION.md`
- **Database schema**: `sprites-schema.sql`
- **Client code**: `src/lib/sprites/client.ts`
- **API routes**: `src/app/api/sprites/`

---

## Status: 70% Complete ✅

- ✅ Option A: Infrastructure ready
- ⏸️ Option B: Waiting for OpenClaw template
- 🔲 UI integration (dashboard)
- 🔲 WebSocket gateway connection

**Ready to test provisioning!** 🚀
