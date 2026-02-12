# ClawDirector Implementation Plan

**Goal:** Wire dashboard to OpenClaw Gateway
**Timeline:** 2-3 days
**Status:** In Progress

---

## Phase 1: Cleanup & Setup (1 hour)

### ✅ Step 1: Delete Direct Claude API Code
**Problem:** `/api/chat/route.ts` calls Anthropic directly, bypassing OpenClaw

**Action:**
```bash
# Delete the direct API route
rm src/app/api/chat/route.ts
```

**Why:** We're building OpenClaw wrapper, not direct Claude wrapper.

---

### ✅ Step 2: Remove Mock Data Usage (find & replace later)
**Problem:** All dashboard pages use `mock-data.ts`

**Action:** Mark for replacement (don't delete yet, use for UI reference)
```typescript
// We'll replace these imports one by one as we build real data fetching
// import { mockAgents, mockTasks } from '@/lib/mock-data'
```

---

### ✅ Step 3: Get OpenClaw Gateway Token
**Problem:** Need auth token to connect to OpenClaw

**Action:**
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Get gateway token from OpenClaw config
docker exec openclaw cat /workspace/.openclaw/gateway.json | grep token

# Copy the token, we'll need it
```

**Expected output:**
```json
{
  "token": "gw_xxxxxxxxxxxxxxxxxx"
}
```

---

## Phase 2: Backend - Gateway Connection (2 hours)

### Step 4: Add Settings Page - Gateway Token Input

**File:** `src/app/dashboard/settings/page.tsx`

**Add:**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const [gatewayToken, setGatewayToken] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch current config
    fetch('/api/workspace')
      .then(r => r.json())
      .then(data => {
        if (data.gateway_token) {
          setGatewayToken('gw_' + '•'.repeat(20)) // Masked
        }
      })
  }, [])

  const saveToken = async () => {
    setSaving(true)
    await fetch('/api/workspace', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gateway_url: 'wss://api.clawdirector.com',
        gateway_token: gatewayToken
      })
    })
    setSaving(false)
    alert('Saved!')
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">OpenClaw Gateway</h2>
        <p className="text-sm text-muted-foreground">
          Connect your dashboard to OpenClaw Gateway
        </p>
      </div>

      <div className="space-y-2">
        <Label>Gateway URL</Label>
        <Input value="wss://api.clawdirector.com" disabled />
      </div>

      <div className="space-y-2">
        <Label>Gateway Token</Label>
        <Input
          type="password"
          value={gatewayToken}
          onChange={e => setGatewayToken(e.target.value)}
          placeholder="gw_xxxxxxxxxxxxxxxxxx"
        />
        <p className="text-xs text-muted-foreground">
          Get this from your OpenClaw Gateway settings
        </p>
      </div>

      <Button onClick={saveToken} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </Button>
    </div>
  )
}
```

**Test:**
1. Go to Settings
2. Paste your gateway token
3. Click Save
4. Check Supabase - token should be in workspaces table

---

### Step 5: Create Agent Execution API Route

**File:** `src/app/api/agents/[agentId]/run/route.ts`

**Create:**
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: { agentId: string } }
) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get workspace + agent
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id, gateway_url, gateway_token, anthropic_api_key')
    .eq('user_id', user.id)
    .single()

  if (!workspace) {
    return NextResponse.json({ error: 'No workspace' }, { status: 404 })
  }

  if (!workspace.gateway_token) {
    return NextResponse.json({
      error: 'Gateway not configured. Go to Settings.'
    }, { status: 400 })
  }

  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.agentId)
    .single()

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Get message from body
  const { message } = await req.json()
  if (!message) {
    return NextResponse.json({ error: 'Message required' }, { status: 400 })
  }

  // Connect to OpenClaw Gateway
  try {
    const ws = new (await import('ws')).default(workspace.gateway_url)

    return new Promise((resolve) => {
      let timeout: NodeJS.Timeout

      ws.on('open', () => {
        // Send connect handshake
        ws.send(JSON.stringify({
          type: 'req',
          id: 'connect-' + Date.now(),
          method: 'connect',
          params: {
            minProtocol: 3,
            maxProtocol: 3,
            client: { id: 'clawdirector', version: '1.0.0' },
            auth: { token: workspace.gateway_token }
          }
        }))

        // After connect, send agent run
        setTimeout(() => {
          ws.send(JSON.stringify({
            type: 'req',
            id: 'run-' + Date.now(),
            method: 'agent.run',
            params: {
              agentId: agent.id,
              message,
              apiKey: workspace.anthropic_api_key,
              model: agent.model || 'claude-sonnet-4-5-20250929',
              systemPrompt: agent.personality
            }
          }))
        }, 100)

        // Timeout after 60s
        timeout = setTimeout(() => {
          ws.close()
          resolve(NextResponse.json({
            error: 'Gateway timeout'
          }, { status: 504 }))
        }, 60000)
      })

      ws.on('message', async (data: Buffer) => {
        const msg = JSON.parse(data.toString())

        if (msg.type === 'res' && msg.ok && msg.id?.startsWith('run-')) {
          clearTimeout(timeout)
          ws.close()

          // Save to database
          const tokens = msg.payload?.tokens || 0
          const cost = msg.payload?.cost || 0

          await supabase
            .from('agents')
            .update({
              tokens_used: (agent.tokens_used || 0) + tokens,
              cost_total: (Number(agent.cost_total) || 0) + cost,
              tasks_completed: (agent.tasks_completed || 0) + 1
            })
            .eq('id', agent.id)

          resolve(NextResponse.json({
            content: msg.payload?.content || 'No response',
            tokens,
            cost
          }))
        }
      })

      ws.on('error', (err) => {
        clearTimeout(timeout)
        resolve(NextResponse.json({
          error: 'Gateway error: ' + err.message
        }, { status: 500 }))
      })
    })
  } catch (err) {
    return NextResponse.json({
      error: 'Failed to connect: ' + (err as Error).message
    }, { status: 500 })
  }
}
```

**Install ws package:**
```bash
npm install ws
npm install --save-dev @types/ws
```

---

## Phase 3: Frontend - Wire UI (3 hours)

### Step 6: Create Agent Chat Component

**File:** `src/components/dashboard/agent-chat.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'agent'
  content: string
  tokens?: number
  cost?: number
}

export function AgentChat({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch(`/api/agents/${agentId}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      const data = await res.json()

      if (res.ok) {
        setMessages(prev => [...prev, {
          role: 'agent',
          content: data.content,
          tokens: data.tokens,
          cost: data.cost
        }])
      } else {
        setMessages(prev => [...prev, {
          role: 'agent',
          content: '❌ Error: ' + data.error
        }])
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'agent',
        content: '❌ Network error'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            Send a message to start...
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block max-w-[80%] rounded-lg p-3 ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.tokens && (
                <p className="text-xs opacity-70 mt-1">
                  {msg.tokens} tokens · ${msg.cost?.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-left">
            <div className="inline-block bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

### Step 7: Wire Agent Detail Page

**File:** `src/app/dashboard/agents/[agentId]/page.tsx`

**Replace with:**
```typescript
import { AgentChat } from '@/components/dashboard/agent-chat'
import { TopBar } from '@/components/layout/top-bar'

export default function AgentDetailPage({
  params
}: {
  params: { agentId: string }
}) {
  return (
    <div className="flex flex-col">
      <TopBar title="Agent Chat" description="Talk to your agent" />

      <div className="p-6">
        <AgentChat agentId={params.agentId} />
      </div>
    </div>
  )
}
```

---

## Phase 4: Testing (30 mins)

### Step 8: Test End-to-End

1. **Check VPS:**
   ```bash
   ssh root@your-vps
   docker ps  # OpenClaw should be running
   docker logs openclaw --tail 50
   ```

2. **Test WebSocket from terminal:**
   ```bash
   websocat wss://api.clawdirector.com
   # Should connect (press Ctrl+C to exit)
   ```

3. **Go to dashboard:**
   - Settings → Enter gateway token → Save
   - Agents → Click any agent
   - Type message → Send
   - **Should get response from OpenClaw!**

4. **Check Supabase:**
   - agents table → tokens_used should increase
   - activities table → should have new entries

---

## Phase 5: Replace All Mock Data (2 hours)

### Step 9: Wire Agents List Page

**File:** `src/app/dashboard/agents/page.tsx`

Replace `mockAgents` with real data from `/api/agents`

### Step 10: Wire Dashboard Overview

**File:** `src/app/dashboard/page.tsx`

Replace all mock data with real API calls

### Step 11: Wire Tasks Page

**File:** `src/app/dashboard/tasks/page.tsx`

Replace `mockTasks` with real data from `/api/tasks`

---

## Done! 🎉

After these steps:
- ✅ Dashboard connects to OpenClaw
- ✅ Agents execute real tasks
- ✅ All mock data replaced
- ✅ Real-time responses
- ✅ Database tracking working

**Next:** Polish, error handling, then launch!
