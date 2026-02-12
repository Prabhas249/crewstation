# ClawDirector Architecture

**Last Updated:** Feb 11, 2026
**Status:** Building OpenClaw Wrapper

---

## What We're Building

**ClawDirector = Beautiful Dashboard + Multi-User SaaS Wrapper Around OpenClaw**

Not a direct Claude API wrapper. We're wrapping OpenClaw to give users:
- ✅ Web automation (order from Swiggy)
- ✅ Email monitoring (Gmail integration)
- ✅ Smart home control
- ✅ Multi-step complex tasks
- ✅ 53+ built-in tools/skills
- ✅ WhatsApp/Telegram integration

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│                                                               │
│  Dashboard UI (Next.js on Vercel)                           │
│  - Auth (Google OAuth)                                       │
│  - Onboarding (API key setup)                               │
│  - Agent management                                          │
│  - Task tracking                                             │
│  - Real-time updates                                         │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│            VERCEL (Next.js Backend)                          │
│                                                               │
│  API Routes:                                                 │
│  - GET/POST /api/agents - Manage agents                     │
│  - GET/POST /api/tasks - Manage tasks                       │
│  - GET/PATCH /api/workspace - Config                        │
│  - WebSocket proxy to OpenClaw Gateway                      │
│                                                               │
│  Key Library:                                                │
│  - lib/gateway.ts - OpenClaw WebSocket client               │
│    (Protocol v3, handles connect/request/response)          │
└─────────────────────────────────────────────────────────────┘
          │                              │
          │                              │
          ▼                              ▼
┌──────────────────────┐      ┌──────────────────────┐
│   Supabase DB        │      │  VPS (Hetzner 4GB)   │
│                      │      │                      │
│  Tables:             │      │  OpenClaw Gateway    │
│  - workspaces        │      │  - Docker            │
│  - agents            │      │  - Nginx SSL proxy   │
│  - tasks             │      │  - Port: 18789       │
│  - messages          │      │                      │
│  - activities        │      │  wss://              │
│                      │      │  api.clawdirector.com│
│  Stores:             │      └──────────────────────┘
│  - User data         │                 │
│  - Gateway tokens    │                 │
│  - API keys (encrypt)│                 ▼
│  - Session history   │      ┌──────────────────────┐
└──────────────────────┘      │  LLM APIs            │
                               │  - Claude (Anthropic)│
                               │  - GPT-4 (OpenAI)    │
                               │  - Gemini (Google)   │
                               └──────────────────────┘
```

---

## Key Design Decisions

### 1. OpenClaw Gateway Architecture

**Shared Gateway Model:**
- ONE OpenClaw instance for ALL users
- Running on VPS (not per-user containers)
- User isolation via session management
- Each user's API key passed to OpenClaw per request

**Why Shared?**
- ✅ Simple infrastructure
- ✅ Cost effective ($20/mo VPS vs $100s for containers)
- ✅ Easy to scale (1 gateway can handle 1000s users)
- ✅ No deployment complexity

### 2. BYOK (Bring Your Own Key)

Users provide their own:
- Anthropic API key (Claude)
- OpenAI API key (GPT-4)
- Google API key (Gemini)

**Why BYOK?**
- ✅ Zero API cost risk for us
- ✅ Users control spending
- ✅ No billing complexity
- ✅ Launch fast, validate demand

### 3. WebSocket Communication

Frontend → Backend → OpenClaw Gateway via WebSocket

**Why WebSocket?**
- ✅ Real-time streaming responses
- ✅ Long-running agent tasks
- ✅ Bidirectional communication
- ✅ OpenClaw native protocol

### 4. Data Storage

**Supabase for Everything:**
- User auth (Google OAuth)
- Workspace config
- Agent definitions
- Task history
- Message logs
- Activity feed

**NOT storing in OpenClaw:**
- OpenClaw is stateless orchestrator
- All persistence in our DB
- We control user data

---

## Tech Stack

### Frontend
- **Next.js 16.1.6** - App Router, React Server Components
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Lucide Icons** - Icons

### Backend
- **Next.js API Routes** - REST endpoints
- **Supabase** - PostgreSQL + Auth + Storage
- **WebSocket** - OpenClaw Gateway connection

### Infrastructure
- **Vercel** - Frontend + API hosting (free tier)
- **Supabase** - Database (free tier → $25/mo)
- **Hetzner VPS** - OpenClaw Gateway (€4.50/mo)
- **Nginx** - Reverse proxy + SSL

### OpenClaw
- **Version:** 2026.1.24+
- **Protocol:** v3
- **Gateway URL:** wss://api.clawdirector.com
- **Port:** 18789 (internal), 443 (external via Nginx)

---

## OpenClaw Integration

### Connection Flow

1. **User completes onboarding:**
   - Provides Anthropic/OpenAI/Gemini API key
   - Creates first agent
   - Stored in Supabase (encrypted)

2. **Dashboard loads:**
   - Fetches workspace config (includes gateway_token)
   - Opens WebSocket to `wss://api.clawdirector.com`
   - Sends `connect` handshake with token

3. **User sends agent command:**
   - Frontend: calls `sendRequest('agent.run', { ... })`
   - WebSocket: sends JSON request to Gateway
   - Gateway: executes agent with user's API key
   - Response: streams back via WebSocket
   - Frontend: displays real-time updates

4. **Task completes:**
   - Save result to Supabase
   - Log activity
   - Update agent stats

### Protocol v3 Message Format

```typescript
// Request (from us to OpenClaw)
{
  type: "req",
  id: "unique-request-id",
  method: "agent.run",
  params: {
    agentId: "agent-uuid",
    message: "Order food from Swiggy",
    apiKey: "user-claude-key",
    model: "claude-sonnet-4-5"
  }
}

// Response (from OpenClaw to us)
{
  type: "res",
  id: "unique-request-id",
  ok: true,
  payload: {
    content: "I've opened browser and navigating to Swiggy...",
    tokens: 2500,
    cost: 0.0375
  }
}

// Event (real-time updates)
{
  type: "event",
  event: "agent.progress",
  payload: {
    step: "filling_form",
    message: "Entering delivery address..."
  }
}
```

---

## File Structure

```
crewstation/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── auth/page.tsx               # Google OAuth
│   │   ├── onboarding/page.tsx         # 3-step setup
│   │   ├── dashboard/
│   │   │   ├── page.tsx                # Overview
│   │   │   ├── agents/                 # Agent management
│   │   │   ├── tasks/                  # Task tracking
│   │   │   ├── conversations/          # Chat history
│   │   │   └── settings/               # Config
│   │   └── api/
│   │       ├── workspace/route.ts      # Workspace CRUD
│   │       ├── agents/route.ts         # Agent CRUD
│   │       └── tasks/route.ts          # Task CRUD
│   ├── components/
│   │   ├── dashboard/                  # Dashboard components
│   │   ├── layout/                     # Sidebar, topbar
│   │   └── ui/                         # shadcn components
│   └── lib/
│       ├── gateway.ts                  # ⭐ OpenClaw WebSocket client
│       ├── supabase/                   # DB clients
│       ├── types.ts                    # TypeScript types
│       └── constants.ts                # App constants
├── ARCHITECTURE.md                     # This file
├── IMPLEMENTATION-PLAN.md              # Step-by-step plan
└── PRICING-PLAN.md                     # Business model
```

---

## Database Schema

### workspaces
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES auth.users
name                TEXT
gateway_url         TEXT  -- wss://api.clawdirector.com
gateway_token       TEXT  -- OpenClaw auth token (encrypted)
anthropic_api_key   TEXT  -- User's Claude key (encrypted)
openai_api_key      TEXT  -- User's GPT key (encrypted)
plan                TEXT  -- free/pro/agency
max_agents          INT
max_tasks_per_day   INT
created_at          TIMESTAMPTZ
```

### agents
```sql
id                  UUID PRIMARY KEY
workspace_id        UUID REFERENCES workspaces
name                TEXT
role                TEXT
personality         TEXT  -- System prompt
model               TEXT  -- claude-sonnet-4-5-20250929
status              TEXT  -- idle/busy/offline/error
session_key         TEXT  -- OpenClaw session ID
avatar              TEXT
tokens_used         BIGINT
cost_total          DECIMAL
tasks_completed     INT
created_at          TIMESTAMPTZ
```

### tasks
```sql
id                  UUID PRIMARY KEY
workspace_id        UUID REFERENCES workspaces
title               TEXT
description         TEXT
status              TEXT  -- inbox/assigned/in_progress/done/failed
priority            TEXT  -- low/medium/high/critical
assigned_agent_id   UUID REFERENCES agents
tokens_used         BIGINT
cost                DECIMAL
created_at          TIMESTAMPTZ
completed_at        TIMESTAMPTZ
```

### messages
```sql
id                  UUID PRIMARY KEY
task_id             UUID REFERENCES tasks
agent_id            UUID REFERENCES agents
content             TEXT
role                TEXT  -- user/agent
tokens_used         INT
created_at          TIMESTAMPTZ
```

### activities
```sql
id                  UUID PRIMARY KEY
workspace_id        UUID REFERENCES workspaces
type                TEXT  -- task_created/agent_started/etc
description         TEXT
agent_id            UUID REFERENCES agents
created_at          TIMESTAMPTZ
```

---

## Security

### API Key Encryption
- User's Claude/GPT keys stored encrypted in Supabase
- Decrypted only when sending to OpenClaw
- Never exposed to frontend
- Encrypted at rest using Supabase vault

### Gateway Token
- Single token per workspace
- Used to authenticate WebSocket connection
- Stored encrypted in Supabase
- Rotatable by user

### Row Level Security (RLS)
- Supabase RLS enabled on all tables
- Users can only access their workspace data
- Policies enforce user_id matching

### HTTPS/WSS Only
- All traffic encrypted (TLS 1.3)
- No HTTP/WS allowed
- Nginx handles SSL termination

---

## Scaling Strategy

### Current Setup (Launch)
- Vercel: Free tier (enough for 100s users)
- Supabase: Free tier → $25/mo
- VPS: €4.50/mo (4GB RAM)
- **Total: ~$30/mo for 100+ users**

### Scale to 1K Users
- Vercel: Pro tier ($20/mo)
- Supabase: Pro tier ($25/mo)
- VPS: Upgrade to 8GB RAM (€10/mo)
- **Total: ~$55/mo**

### Scale to 10K Users
- Vercel: Pro tier ($20/mo)
- Supabase: Team tier ($599/mo)
- VPS: Multiple gateways + load balancer (~$50/mo)
- **Total: ~$670/mo**

**Margins:** 70-80% on unified billing (Phase 2)

---

## Launch Checklist

### Phase 1: OpenClaw Connection (This Week)
- [x] Architecture documented
- [ ] Delete direct Claude API code
- [ ] Wire useGateway hook to dashboard
- [ ] Test WebSocket connection
- [ ] Agent execution working
- [ ] Real-time updates showing
- [ ] Replace all mock data

### Phase 2: Polish & Launch (Next Week)
- [ ] Error handling
- [ ] Loading states
- [ ] Toast notifications
- [ ] Settings page (gateway token input)
- [ ] Onboarding polish
- [ ] Landing page final copy
- [ ] Deploy to production

### Phase 3: Post-Launch (Month 1)
- [ ] Analytics (Mixpanel/PostHog)
- [ ] Razorpay integration
- [ ] Usage tracking
- [ ] Customer support (Intercom)
- [ ] Documentation site
- [ ] First 50 users

---

## Troubleshooting

### Gateway Connection Fails
1. Check VPS: `docker ps` - is OpenClaw running?
2. Check SSL: `curl -I https://api.clawdirector.com`
3. Check WebSocket: `websocat wss://api.clawdirector.com`
4. Check token: Is gateway_token correct in DB?

### Agent Doesn't Respond
1. Check user's API key is valid
2. Check OpenClaw logs: `docker logs openclaw`
3. Check request ID matches response ID
4. Check timeout (30s default)

### Performance Issues
1. Check VPS CPU/RAM: `htop`
2. Check concurrent connections: `ss -s`
3. Check OpenClaw queue length
4. Consider upgrading VPS or adding second gateway

---

## Next Steps

See [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) for step-by-step build plan.
