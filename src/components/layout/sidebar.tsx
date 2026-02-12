"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  ListChecks,
  MessageSquare,
  Users,
  GitBranch,
  DollarSign,
  Settings,
  Zap,
  Radio,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Bot, ListChecks, MessageSquare, Users, GitBranch, DollarSign, Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const [agents, setAgents] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSidebarData() {
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
          .select("id")
          .eq("user_id", userId)
          .single();

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
            .eq("status", "in_progress");

          setTasks(tasksData || []);
        }
      } catch (error) {
        console.error("Sidebar load error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadSidebarData();
  }, []);

  const onlineAgents = agents.filter((a) => a.status === "online" || a.status === "busy");
  const activeAgents = agents.length;
  const activeTasks = tasks.length;

  return (
    <aside className="sidebar-glow fixed left-0 top-0 z-40 hidden h-screen w-[220px] flex-col border-r border-border bg-background lg:flex">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ff543d] core-pulse">
          <Zap className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-[14px] font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-[#ff543d] live-dot" />
          <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-[#ff543d]">Live</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        <p className="mb-2 px-2.5 text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          Command Center
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[12px] font-medium transition-all duration-200",
                isActive
                  ? "bg-[#ff543d]/10 text-[#ff543d] shadow-[inset_0_0_0_1px_rgba(255,84,61,0.15)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
              {item.label === "Agents" && activeAgents > 0 && (
                <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff543d]/15 px-1 text-[9px] font-bold text-[#ff543d]">
                  {activeAgents}
                </span>
              )}
              {item.label === "Tasks" && activeTasks > 0 && (
                <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500/12 px-1 text-[9px] font-bold text-amber-400">
                  {activeTasks}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Your Agents */}
      <div className="mx-2 mb-2">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Active Crew
          </p>
          {agents.length > 0 && (
            <span className="text-[8px] font-bold text-muted-foreground/40">
              {agents.length}
            </span>
          )}
        </div>
        <div className="space-y-0.5">
          {agents.length === 0 ? (
            <div className="px-2 py-3 text-center">
              <p className="text-[10px] text-muted-foreground/60">No agents yet</p>
              <Link
                href="/dashboard/agents"
                className="mt-1.5 inline-flex text-[9px] font-medium text-[#ff543d] hover:text-[#ff6b56]"
              >
                Create Agent +
              </Link>
            </div>
          ) : (
            agents.slice(0, 5).map((agent) => {
              const isActive = pathname === `/dashboard/agents/${agent.id}` || pathname.startsWith(`/dashboard/agents/${agent.id}/`);
              return (
                <Link
                  key={agent.id}
                  href={`/dashboard/agents/${agent.id}`}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
                    isActive
                      ? "bg-[#ff543d]/10 shadow-[inset_0_0_0_1px_rgba(255,84,61,0.15)]"
                      : "hover:bg-muted"
                  )}
                >
                  <div className="relative">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff543d]/10 text-[9px] font-bold text-[#ff543d]">
                      {agent.avatar || agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={cn(
                      "absolute -bottom-px -right-px h-[6px] w-[6px] rounded-full border border-background",
                      agent.status === "online" ? "bg-emerald-400 live-dot" : "bg-muted-foreground/30"
                    )} />
                  </div>
                  <span className={cn(
                    "flex-1 truncate text-[11px]",
                    isActive ? "font-medium text-foreground" : "text-muted-foreground"
                  )}>
                    {agent.name}
                  </span>
                  {agent.status === "busy" && (
                    <div className="flex gap-0.5">
                      <div className="h-1 w-1 rounded-full bg-[#ff543d] typing-dot" />
                      <div className="h-1 w-1 rounded-full bg-[#ff543d] typing-dot" />
                      <div className="h-1 w-1 rounded-full bg-[#ff543d] typing-dot" />
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Gateway Status */}
      <div className="mx-2 mb-2 rounded-lg border border-border bg-muted/50 p-2.5 scan-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[10px] font-medium text-muted-foreground">Gateway</span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground/50">
            Not Set
          </span>
        </div>
        <Link href="/dashboard/settings" className="mt-1 block">
          <p className="font-mono text-[9px] text-muted-foreground/70 hover:text-[#ff543d]">
            Configure in Settings →
          </p>
        </Link>
      </div>

      {/* User */}
      <div className="border-t border-border p-2">
        <Link href="/dashboard/settings" className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff543d]/15 text-[10px] font-bold text-[#ff543d]">
            P
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[11px] font-medium text-muted-foreground">Settings</p>
          </div>
          <Settings className="h-3 w-3 text-muted-foreground/50" />
        </Link>
      </div>
    </aside>
  );
}
