"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Bot,
  Zap,
  DollarSign,
  ArrowUpRight,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Clock,
  Activity,
  Send,
  Users,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { cn } from "@/lib/utils";
import {
  mockStats,
  mockAgents,
  mockActivity,
  mockCostData,
  mockTasks,
  mockMeetings,
  mockMessages,
  PRIYA_ID,
} from "@/lib/mock-data";
import { AGENT_STATUS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CostChart = dynamic(
  () =>
    import("@/components/dashboard/cost-chart").then((mod) => mod.CostChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-[180px] animate-pulse rounded-lg bg-muted/50" />
    ),
  }
);

const typeIcons: Record<string, React.ElementType> = {
  task_completed: CheckCircle2,
  agent_started: Bot,
  meeting_started: PlayCircle,
  workflow_run: Zap,
  message: MessageSquare,
  error: AlertCircle,
  delegation: Sparkles,
};
const typeColors: Record<string, string> = {
  task_completed: "text-emerald-400",
  agent_started: "text-[#ff6b56]",
  meeting_started: "text-cyan-400",
  workflow_run: "text-amber-400",
  message: "text-blue-400",
  error: "text-red-400",
  delegation: "text-[#ff6b56]",
};

const statCards = [
  {
    label: "Agents Online",
    value: String(mockStats.activeAgents),
    total: String(mockStats.totalAgents),
    icon: Bot,
    color: "red",
    change: "+2",
    changeUp: true,
    iconBg: "bg-[#ff543d]/15",
    iconColor: "text-[#ff6b56]",
  },
  {
    label: "Active Tasks",
    value: String(mockStats.activeTasks),
    total: String(mockStats.totalTasks),
    icon: Activity,
    color: "amber",
    change: "+5",
    changeUp: true,
    iconBg: "bg-amber-400/15",
    iconColor: "text-amber-400",
  },
  {
    label: "Tokens Used",
    value: `${(mockStats.totalTokens / 1_000_000).toFixed(1)}M`,
    total: null,
    icon: Zap,
    color: "cyan",
    change: "+18%",
    changeUp: true,
    iconBg: "bg-cyan-400/15",
    iconColor: "text-cyan-400",
  },
  {
    label: "Cost Today",
    value: `$${mockStats.totalCostToday.toFixed(2)}`,
    total: null,
    icon: DollarSign,
    color: "emerald",
    change: "-8%",
    changeUp: false,
    iconBg: "bg-emerald-400/15",
    iconColor: "text-emerald-400",
  },
];

export default function DashboardPage() {
  const activeTasks = mockTasks.filter((t) => t.status === "in_progress");
  const recentCompleted = mockTasks
    .filter((t) => t.status === "completed")
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      <TopBar title="Command Center" description="All systems operational" />

      <div className="space-y-5 p-5">
        {/* ── Row 1: Hero Stats ── */}
        <div className="grid gap-4 lg:grid-cols-4">
          {statCards.map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "glass rounded-xl p-4 fade-in-up",
                `fade-in-up-${i + 1}`,
                `accent-top-${stat.color}`,
                `stat-gradient-${stat.color}`
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {stat.label}
                </span>
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg",
                    stat.iconBg
                  )}
                >
                  <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="stat-value font-mono text-[28px] font-bold tabular-nums tracking-tight">
                  {stat.value}
                </span>
                {stat.total && (
                  <span className="text-[13px] text-muted-foreground">
                    / {stat.total}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {stat.changeUp ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-emerald-400" />
                )}
                <span className="text-[10px] font-medium text-emerald-400">
                  {stat.change}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  vs yesterday
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Row 2: Main Grid ── */}
        <div className="grid gap-4 lg:grid-cols-12">
          {/* Left: Crew Status */}
          <div className="lg:col-span-3 glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-1">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-[#ff6b56]" />
                <span className="text-[13px] font-semibold">Crew Status</span>
              </div>
              <Link
                href="/dashboard/agents"
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="p-1.5">
              {mockAgents.map((agent) => {
                const sc = AGENT_STATUS_CONFIG[agent.status];
                const isPriya = agent.id === PRIYA_ID;
                return (
                  <Link
                    key={agent.id}
                    href={`/dashboard/agents/${agent.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all hover:bg-muted"
                  >
                    <div className="relative">
                      {isPriya ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff543d]/20">
                          <Sparkles className="h-4 w-4 text-[#ff6b56]" />
                        </div>
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff543d]/10 text-[12px] font-bold text-[#ff6b56]">
                          {agent.avatar}
                        </div>
                      )}
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                          sc.dotColor,
                          (agent.status === "online" ||
                            agent.status === "busy") &&
                            "live-dot"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-[12px] font-medium", isPriya && "text-foreground")}>
                          {agent.name}
                        </span>
                        {agent.status === "busy" && (
                          <div className="flex gap-[2px]">
                            <div className="h-[3px] w-[3px] rounded-full bg-amber-400 typing-dot" />
                            <div className="h-[3px] w-[3px] rounded-full bg-amber-400 typing-dot" />
                            <div className="h-[3px] w-[3px] rounded-full bg-amber-400 typing-dot" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {isPriya ? "Orchestrator" : agent.role}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={cn("text-[10px] font-medium", sc.color)}
                      >
                        {sc.label}
                      </span>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        ${agent.costToday.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Center: Cost Chart + Active Tasks */}
          <div className="lg:col-span-5 space-y-4">
            {/* Cost chart */}
            <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-2">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span className="text-[13px] font-semibold">
                    Spending (14d)
                  </span>
                </div>
                <Link
                  href="/dashboard/costs"
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Details <ArrowUpRight className="h-2.5 w-2.5" />
                </Link>
              </div>
              <div className="p-4">
                <div className="h-[180px]">
                  <CostChart data={mockCostData} />
                </div>
              </div>
            </div>

            {/* Active Tasks */}
            <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-3">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <span className="text-[13px] font-semibold">
                    Active Tasks
                  </span>
                  <span className="flex h-5 items-center rounded-full bg-amber-400/10 px-2 text-[10px] font-bold text-amber-400">
                    {activeTasks.length}
                  </span>
                </div>
                <Link
                  href="/dashboard/tasks"
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  All tasks
                </Link>
              </div>
              <div className="divide-y divide-border">
                {activeTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400 live-dot" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[12px] font-medium">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {task.agentName} · {task.updatedAt}
                      </p>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ${task.cost.toFixed(2)}
                    </span>
                  </div>
                ))}
                {recentCompleted.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 opacity-50"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-[12px] font-medium">
                        {task.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {task.agentName} · {task.duration}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                      Done
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Live Feed + Agent Chat */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Activity Feed */}
            <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-3">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#ff543d] live-dot" />
                  <span className="text-[13px] font-semibold">Live Feed</span>
                </div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Real-time
                </span>
              </div>
              <div className="max-h-[240px] overflow-y-auto">
                {mockActivity.map((item) => {
                  const Icon = typeIcons[item.type] || Zap;
                  const color = typeColors[item.type] || "text-muted-foreground";
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-b-0"
                    >
                      <Icon
                        className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", color)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] leading-relaxed">
                          {item.description}
                        </p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agent Chat */}
            <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-4">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-cyan-400" />
                  <span className="text-[13px] font-semibold">Agent Chat</span>
                </div>
                <Link
                  href="/dashboard/conversations"
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  All chats
                </Link>
              </div>
              <div className="max-h-[200px] space-y-3 overflow-y-auto p-4">
                {mockMessages.slice(0, 4).map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2.5">
                    {msg.agentName === "Priya" ? (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff543d]/20">
                        <Sparkles className="h-3 w-3 text-[#ff6b56]" />
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff543d]/10 text-[9px] font-bold text-[#ff6b56]">
                        {msg.agentName[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold">
                          {msg.agentName}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Message your crew..."
                    className="h-8 bg-muted/50 text-[11px] border-border"
                  />
                  <Button
                    size="icon"
                    className="h-8 w-8 shrink-0 bg-[#ff543d] hover:bg-[#e04030] shadow-[0_0_16px_rgba(255,84,61,0.3)]"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Meetings + Leaderboard ── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Upcoming Meetings */}
          <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-5">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#ff6b56]" />
                <span className="text-[13px] font-semibold">Meetings</span>
              </div>
              <Link
                href="/dashboard/meetings"
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                Schedule
              </Link>
            </div>
            <div className="divide-y divide-border">
              {mockMeetings.slice(0, 3).map((meeting) => {
                const isActive = meeting.status === "in_progress";
                const isDone = meeting.status === "completed";
                return (
                  <div
                    key={meeting.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3",
                      isDone && "opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg",
                        isActive
                          ? "bg-amber-400/10"
                          : isDone
                            ? "bg-emerald-400/10"
                            : "bg-blue-400/10"
                      )}
                    >
                      {isActive ? (
                        <PlayCircle className="h-4 w-4 text-amber-400" />
                      ) : isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium">
                        {meeting.title}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>{meeting.scheduledAt}</span>
                        <span>·</span>
                        <span>{meeting.participants.length} agents</span>
                      </div>
                    </div>
                    {isActive && (
                      <span className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-medium text-amber-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 live-dot" />{" "}
                        Live
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agent Leaderboard */}
          <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-6">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-[13px] font-semibold">
                  Agent Leaderboard
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">Today</span>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {[...mockAgents]
                  .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
                  .slice(0, 5)
                  .map((agent, i) => {
                    const maxTasks = mockAgents.reduce(
                      (m, a) => Math.max(m, a.tasksCompleted),
                      0
                    );
                    const pct = (agent.tasksCompleted / maxTasks) * 100;
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <div key={agent.id} className="flex items-center gap-3">
                        <span className="w-5 text-center text-[12px]">
                          {i < 3 ? (
                            medals[i]
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              {i + 1}
                            </span>
                          )}
                        </span>
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff543d]/10 text-[10px] font-bold text-[#ff6b56]">
                          {agent.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-medium">
                              {agent.name}
                            </span>
                            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                              {agent.tasksCompleted} tasks
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#ff543d] to-[#ff8a75] transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
