"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  Plus,
} from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { cn } from "@/lib/utils";
import { AGENT_STATUS_CONFIG } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

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

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
        const DEV_USER_UUID = "00000000-0000-0000-0000-000000000001";
        const userId = user?.id || (isLocalhost ? DEV_USER_UUID : null);

        if (!userId) {
          setLoading(false);
          return;
        }

        // Fetch workspace
        const { data: ws } = await supabase
          .from("workspaces")
          .select("*")
          .eq("user_id", userId)
          .single();

        setWorkspace(ws);

        if (ws) {
          // Fetch agents
          const { data: agentsData } = await supabase
            .from("agents")
            .select("*")
            .eq("workspace_id", ws.id)
            .order("created_at", { ascending: true });
          setAgents(agentsData || []);

          // Fetch tasks
          const { data: tasksData } = await supabase
            .from("tasks")
            .select("*")
            .eq("workspace_id", ws.id)
            .order("created_at", { ascending: false })
            .limit(20);
          setTasks(tasksData || []);

          // Fetch activities
          const { data: activitiesData } = await supabase
            .from("activities")
            .select("*")
            .eq("workspace_id", ws.id)
            .order("created_at", { ascending: false})
            .limit(10);
          setActivities(activitiesData || []);
        }
      } catch (error) {
        console.error("Dashboard load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff543d]" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No workspace found</p>
          <Link href="/onboarding" className="mt-4 text-[#ff543d] underline">
            Complete onboarding
          </Link>
        </div>
      </div>
    );
  }

  const activeTasks = tasks.filter((t) => t.status === "in_progress");
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const onlineAgents = agents.filter((a) => a.status === "online" || a.status === "busy");
  const recentCompleted = completedTasks.slice(0, 2);

  // Mock cost data for chart
  const mockCostData = Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cost: Math.random() * 5 + 2,
  }));

  const statCards = [
    {
      label: "Agents Online",
      value: String(onlineAgents.length),
      total: String(agents.length),
      icon: Bot,
      color: "red",
      change: agents.length > 0 ? `${agents.length} total` : "Create first agent",
      changeUp: true,
      iconBg: "bg-[#ff543d]/15",
      iconColor: "text-[#ff6b56]",
    },
    {
      label: "Active Tasks",
      value: String(activeTasks.length),
      total: String(tasks.length),
      icon: Activity,
      color: "amber",
      change: tasks.length > 0 ? `${tasks.length} total` : "No tasks yet",
      changeUp: true,
      iconBg: "bg-amber-400/15",
      iconColor: "text-amber-400",
    },
    {
      label: "Conversations",
      value: "0",
      total: null,
      icon: MessageSquare,
      color: "cyan",
      change: "Connect gateway",
      changeUp: true,
      iconBg: "bg-cyan-400/15",
      iconColor: "text-cyan-400",
    },
    {
      label: "Activities",
      value: String(activities.length),
      total: null,
      icon: Zap,
      color: "emerald",
      change: activities.length > 0 ? "Recent activity" : "No activity yet",
      changeUp: false,
      iconBg: "bg-emerald-400/15",
      iconColor: "text-emerald-400",
    },
  ];

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
              {agents.length === 0 ? (
                <div className="py-12 text-center">
                  <Bot className="mx-auto h-12 w-12 text-muted-foreground/30" />
                  <p className="mt-3 text-[13px] font-medium text-muted-foreground">
                    No agents yet
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">
                    Create your first AI agent
                  </p>
                  <Link href="/dashboard/agents">
                    <Button
                      size="sm"
                      className="mt-4 bg-[#ff543d] hover:bg-[#e04030]"
                    >
                      <Plus className="mr-2 h-3.5 w-3.5" />
                      Create Agent
                    </Button>
                  </Link>
                </div>
              ) : (
                agents.map((agent) => {
                  const sc = AGENT_STATUS_CONFIG[agent.status || "idle"];
                  return (
                    <Link
                      key={agent.id}
                      href={`/dashboard/agents/${agent.id}`}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-all hover:bg-muted"
                    >
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff543d]/10 text-[12px] font-bold text-[#ff6b56]">
                          {agent.avatar || agent.name.charAt(0).toUpperCase()}
                        </div>
                        <div
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                            sc.dotColor,
                            (agent.status === "online" || agent.status === "busy") && "live-dot"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium">
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
                          {agent.role || "Assistant"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-[10px] font-medium", sc.color)}>
                          {sc.label}
                        </span>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          Ready
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
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
                {activeTasks.length === 0 && completedTasks.length === 0 ? (
                  <div className="py-12 text-center">
                    <Activity className="mx-auto h-10 w-10 text-muted-foreground/30" />
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      No tasks yet
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground/70">
                      Create agents to start tasks
                    </p>
                  </div>
                ) : (
                  <>
                    {activeTasks.slice(0, 3).map((task) => (
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
                            {new Date(task.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-[10px] font-medium text-blue-400">
                          Active
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
                            {new Date(task.completed_at || task.created_at).toLocaleString()}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[9px] font-medium text-emerald-400">
                          Done
                        </span>
                      </div>
                    ))}
                  </>
                )}
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
                {activities.length === 0 ? (
                  <div className="py-12 text-center">
                    <Activity className="mx-auto h-10 w-10 text-muted-foreground/30" />
                    <p className="mt-3 text-[11px] text-muted-foreground">
                      No activity yet
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground/70">
                      Activity will appear here
                    </p>
                  </div>
                ) : (
                  activities.map((item) => {
                    const Icon = typeIcons[item.type] || Zap;
                    const color = typeColors[item.type] || "text-muted-foreground";
                    const timeAgo = new Date(item.created_at).toLocaleString();
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
                            {timeAgo}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
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
              <div className="flex h-[240px] items-center justify-center p-4">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-[11px] font-medium text-muted-foreground">
                    Connect OpenClaw to chat
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground/70">
                    Add gateway token in Settings
                  </p>
                  <Link href="/dashboard/settings">
                    <Button
                      size="sm"
                      className="mt-4 bg-[#ff543d] hover:bg-[#e04030]"
                    >
                      Go to Settings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Quick Actions ── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-5">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#ff6b56]" />
                <span className="text-[13px] font-semibold">Quick Actions</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {agents.length === 0 && (
                <Link
                  href="/dashboard/agents"
                  className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-[#ff543d] hover:bg-muted/30"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff543d]/10">
                    <Bot className="h-5 w-5 text-[#ff6b56]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium">Create Your First Agent</p>
                    <p className="text-[11px] text-muted-foreground">
                      Start building your AI crew
                    </p>
                  </div>
                </Link>
              )}
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-all hover:border-[#ff543d] hover:bg-muted/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/10">
                  <Zap className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[13px] font-medium">Connect OpenClaw Gateway</p>
                  <p className="text-[11px] text-muted-foreground">
                    Add token to enable agent chat
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Getting Started */}
          <div className="glass-panel rounded-xl overflow-hidden fade-in-up fade-in-up-6">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-[13px] font-semibold">
                  Getting Started
                </span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[12px] font-medium">Workspace Created</p>
                  <p className="text-[10px] text-muted-foreground">
                    {workspace.name}
                  </p>
                </div>
              </div>
              {agents.length > 0 ? (
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium">First Agent Created</p>
                    <p className="text-[10px] text-muted-foreground">
                      {agents[0].name} is ready
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-muted-foreground">
                      Create your first agent
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-muted-foreground">
                    Connect OpenClaw gateway
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                </div>
                <div>
                  <p className="text-[12px] font-medium text-muted-foreground">
                    Start your first conversation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
