"use client";

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
import { mockAgents, mockStats, PRIYA_ID } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Bot, ListChecks, MessageSquare, Users, GitBranch, DollarSign, Settings,
};

export function Sidebar() {
  const pathname = usePathname();
  const onlineAgents = mockAgents.filter((a) => a.id !== PRIYA_ID && (a.status === "online" || a.status === "busy"));
  const isPriyaActive = pathname === `/dashboard/agents/${PRIYA_ID}` || pathname.startsWith(`/dashboard/agents/${PRIYA_ID}/`);

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
              {item.label === "Agents" && (
                <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ff543d]/15 px-1 text-[9px] font-bold text-[#ff543d]">
                  {mockStats.activeAgents}
                </span>
              )}
              {item.label === "Tasks" && (
                <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500/12 px-1 text-[9px] font-bold text-amber-400">
                  {mockStats.activeTasks}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Priya — Pinned */}
      <div className="mx-2 mb-1">
        <Link
          href={`/dashboard/agents/${PRIYA_ID}`}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
            isPriyaActive
              ? "bg-[#ff543d]/10 shadow-[inset_0_0_0_1px_rgba(255,84,61,0.15)]"
              : "hover:bg-muted"
          )}
        >
          <div className="relative">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff543d]/20">
              <Sparkles className="h-2.5 w-2.5 text-[#ff6b56]" />
            </div>
            <div className="absolute -bottom-px -right-px h-[6px] w-[6px] rounded-full border border-background bg-emerald-400 live-dot" />
          </div>
          <span className="flex-1 truncate text-[11px] font-medium text-foreground">Priya</span>
          <span className="text-[8px] font-bold uppercase tracking-wider text-[#ff6b56]">AI</span>
        </Link>
      </div>

      {/* Active Agents Mini */}
      <div className="mx-2 mb-2">
        <p className="mb-2 px-2 text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
          Active Crew
        </p>
        <div className="space-y-0.5">
          {onlineAgents.slice(0, 4).map((agent) => (
            <Link
              key={agent.id}
              href={`/dashboard/agents/${agent.id}`}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
            >
              <div className="relative">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff543d]/10 text-[9px] font-bold text-[#ff543d]">
                  {agent.avatar}
                </div>
                <div className={cn(
                  "absolute -bottom-px -right-px h-[6px] w-[6px] rounded-full border border-background",
                  agent.status === "online" ? "bg-emerald-400" : "bg-amber-400"
                )} />
              </div>
              <span className="flex-1 truncate text-[11px] text-muted-foreground">{agent.name}</span>
              {agent.status === "busy" && (
                <div className="flex gap-0.5">
                  <div className="h-1 w-1 rounded-full bg-[#ff543d] typing-dot" />
                  <div className="h-1 w-1 rounded-full bg-[#ff543d] typing-dot" />
                  <div className="h-1 w-1 rounded-full bg-[#ff543d] typing-dot" />
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Gateway Status */}
      <div className="mx-2 mb-2 rounded-lg border border-border bg-muted/50 p-2.5 scan-line">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-medium text-muted-foreground">Gateway</span>
          </div>
          <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-400">Online</span>
        </div>
        <p className="mt-1 font-mono text-[9px] text-muted-foreground/70">wss://••••••••:••••</p>
        <div className="mt-1.5 h-[2px] w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-full shimmer rounded-full" />
        </div>
      </div>

      {/* User */}
      <div className="border-t border-border p-2">
        <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff543d]/15 text-[10px] font-bold text-[#ff543d]">
            P
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[11px] font-medium text-muted-foreground">Prabhas</p>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </button>
      </div>
    </aside>
  );
}
