"use client";

import { use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Bot, Sparkles, Send, Activity, MessageSquare, Wifi } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { cn } from "@/lib/utils";
import { AGENT_STATUS_CONFIG, TASK_STATUS_CONFIG } from "@/lib/constants";
import { mockAgents, mockTasks, PRIYA_ID } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

const TokenChart = dynamic(
  () => import("@/components/dashboard/token-chart").then((mod) => mod.TokenChart),
  { ssr: false, loading: () => <div className="h-[200px] animate-pulse rounded-lg bg-muted/50" /> }
);

function generateAgentActivity(seed: number) {
  const data = [];
  let s = seed;
  for (let i = 0; i < 24; i++) {
    s = (s * 16807) % 2147483647;
    data.push({
      hour: `${i}:00`,
      tokens: Math.floor(((s - 1) / 2147483646) * 50000) + 2000,
    });
  }
  return data;
}

export default function AgentDetailPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = use(params);
  const agent = mockAgents.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Bot className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-[14px] text-muted-foreground">Agent not found</p>
        <Link href="/dashboard/agents" className="mt-2 text-[13px] text-[#ff6b56] hover:underline">
          Back to agents
        </Link>
      </div>
    );
  }

  const statusConf = AGENT_STATUS_CONFIG[agent.status];
  const isPriya = agent.id === PRIYA_ID;

  // Priya orchestrator layout
  if (isPriya) {
    const otherAgents = mockAgents.filter((a) => a.id !== PRIYA_ID);
    const activeCount = otherAgents.filter((a) => a.status === "online" || a.status === "busy").length;
    const delegationHistory = [
      { task: "Complete JWT auth middleware", agent: "Coder", time: "9:01 AM", status: "in_progress" },
      { task: "Create pricing model from competitor research", agent: "Analyst", time: "9:06 AM", status: "in_progress" },
      { task: "Draft pricing philosophy blog post", agent: "Writer", time: "9:06 AM", status: "in_progress" },
      { task: "Test search performance fix", agent: "QA Tester", time: "8:45 AM", status: "completed" },
      { task: "Research competitor pricing strategies", agent: "Researcher", time: "8:30 AM", status: "completed" },
    ];

    return (
      <div className="flex flex-col">
        <TopBar title="Priya" description="AI Orchestrator" />
        <div className="space-y-5 p-5">
          <Link
            href="/dashboard/agents"
            className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Agents
          </Link>

          {/* Header card */}
          <div
            className="glass-panel rounded-xl p-5 relative overflow-hidden"
            style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 90% 0%, rgba(255,84,61,0.08), transparent)" }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff543d]/20">
                    <Sparkles className="h-7 w-7 text-[#ff6b56]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-400 live-dot" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">Priya</h2>
                    <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-400">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 live-dot" />
                      Always Online
                    </span>
                  </div>
                  <p className="text-[13px] text-muted-foreground">{agent.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
                      {agent.model}
                    </span>
                    <span className="rounded-full bg-[#ff543d]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ff6b56]">
                      Orchestrator
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[12px] border-border hover:bg-muted">
                Edit SOUL.md
              </Button>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-4 border-t border-border pt-5">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Delegations</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{agent.tasksCompleted}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Active Agents</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{activeCount}/{otherAgents.length}</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Telegram Msgs</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums">142</p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Uptime</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{agent.uptime}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Delegation History */}
            <div className="lg:col-span-2 glass-panel rounded-xl overflow-hidden">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-[13px] font-semibold">Delegation History</h3>
              </div>
              <div className="divide-y divide-border">
                {delegationHistory.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff543d]/10">
                      <Sparkles className="h-3.5 w-3.5 text-[#ff6b56]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[13px] font-medium">{d.task}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Assigned to <span className="text-foreground">{d.agent}</span> · {d.time}
                      </p>
                    </div>
                    <span className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                      d.status === "completed"
                        ? "bg-emerald-400/10 text-emerald-400"
                        : "bg-blue-400/10 text-blue-400"
                    )}>
                      {d.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connected Channels + SOUL.md */}
            <div className="space-y-4">
              <div className="glass-panel rounded-xl p-5">
                <h3 className="mb-4 text-[13px] font-semibold">Connected Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5 text-[#229ED9]" />
                      <span className="text-[12px]">Telegram</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-[#ff6b56]" />
                      <span className="text-[12px]">Dashboard</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-[12px]">API</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-medium text-blue-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-xl p-5">
                <h3 className="mb-3 text-[13px] font-semibold">SOUL.md</h3>
                <div className="rounded-lg bg-muted/50 p-3 border border-border">
                  <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground">
{`# Priya
## Role: AI Orchestrator

Your right-hand coordinator for CrewStation.
Manages the crew, delegates tasks, and
keeps everything running smoothly.

## Personality
- Calm, efficient, always available
- Proactive in reporting status
- Delegates to the right agent
- Summarizes without over-explaining`}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="glass-panel rounded-xl p-5">
            <h3 className="mb-4 text-[13px] font-semibold">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((cap) => (
                <span key={cap} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular agent layout
  const agentTasks = mockTasks.filter((t) => t.assignedTo === agent.id);
  const activityData = generateAgentActivity(parseInt(agent.id.replace("agent-", "")) * 100);

  return (
    <div className="flex flex-col">
      <TopBar title={agent.name} description={agent.role} />

      <div className="space-y-5 p-5">
        <Link
          href="/dashboard/agents"
          className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Agents
        </Link>

        {/* Agent header card */}
        <div className="glass-panel rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#ff543d]/15 text-xl font-bold text-[#ff6b56]">
                  {agent.avatar}
                </div>
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-background",
                    statusConf.dotColor
                  )}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{agent.name}</h2>
                <p className="text-[13px] text-muted-foreground">{agent.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
                    {agent.model}
                  </span>
                  <span className={cn("flex items-center gap-1.5 text-[12px] font-medium", statusConf.color)}>
                    <div className={cn("h-2 w-2 rounded-full", statusConf.dotColor)} />
                    {statusConf.label}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-[12px] border-border hover:bg-muted">
                Edit SOUL.md
              </Button>
              <Button variant="outline" size="sm" className="text-[12px] border-border hover:bg-muted">
                Restart
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-5 gap-4 border-t border-border pt-5">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Tasks Done</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{agent.tasksCompleted}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Active Tasks</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{agent.tasksActive}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Tokens Used</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{(agent.tokensUsed / 1000).toFixed(0)}k</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Cost Today</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">${agent.costToday.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">Uptime</p>
              <p className="mt-1 font-mono text-lg font-semibold tabular-nums">{agent.uptime}</p>
            </div>
          </div>
        </div>

        {/* Activity chart + Capabilities */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 glass-panel rounded-xl p-5">
            <h3 className="mb-4 text-[13px] font-semibold">Token Usage (24h)</h3>
            <div className="h-[200px]">
              <TokenChart data={activityData} />
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <h3 className="mb-4 text-[13px] font-semibold">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((cap) => (
                <span key={cap} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
                  {cap}
                </span>
              ))}
            </div>

            <h3 className="mb-3 mt-6 text-[13px] font-semibold">SOUL.md</h3>
            <div className="rounded-lg bg-muted/50 p-3 border border-border">
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-muted-foreground">
{`# ${agent.name}
## Role: ${agent.role}

${agent.description}

## Personality
- Professional and thorough
- Proactive in reporting progress
- Asks for clarification when needed`}
              </pre>
            </div>
          </div>
        </div>

        {/* Agent's tasks */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-[13px] font-semibold">Assigned Tasks ({agentTasks.length})</h3>
          </div>
          <div className="divide-y divide-border">
            {agentTasks.map((task) => {
              const taskStatus = TASK_STATUS_CONFIG[task.status];
              return (
                <div key={task.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted">
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-medium">{task.title}</p>
                    <p className="text-[11px] text-muted-foreground">{task.updatedAt}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium", taskStatus.bg, taskStatus.color)}>
                    {taskStatus.label}
                  </span>
                </div>
              );
            })}
            {agentTasks.length === 0 && (
              <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
                No tasks assigned
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
