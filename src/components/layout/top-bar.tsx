"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell, Search, Plus, Wifi, Sun, Moon, Menu, X, Zap,
  LayoutDashboard, Bot, ListChecks, MessageSquare, Users, GitBranch, DollarSign, Settings, Sparkles,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/components/layout/dashboard-shell";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { mockAgents, mockStats, PRIYA_ID } from "@/lib/mock-data";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, Bot, ListChecks, MessageSquare, Users, GitBranch, DollarSign, Settings,
};

interface TopBarProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

export function TopBar({ title, description, action }: TopBarProps) {
  const { openCommandPalette } = useDashboard();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const onlineAgents = mockAgents.filter((a) => a.id !== PRIYA_ID && (a.status === "online" || a.status === "busy"));

  return (
    <>
      <header className="flex h-12 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 lg:px-5">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-[14px] font-semibold tracking-tight">{title}</h1>
          </div>
          {description && (
            <>
              <div className="hidden h-4 w-px bg-border sm:block" />
              <p className="hidden text-[11px] text-muted-foreground sm:block">{description}</p>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* System status — hidden on small mobile */}
          <div className="mr-2 hidden items-center gap-1.5 rounded-md border border-border bg-emerald-500/5 px-2 py-1 sm:flex">
            <Wifi className="h-3 w-3 text-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-400">All Systems Online</span>
          </div>

          {/* Search */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 rounded-md border border-border bg-transparent px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
            onClick={openCommandPalette}
          >
            <Search className="h-3 w-3" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="ml-1 hidden rounded border border-border bg-muted px-1 py-px font-mono text-[9px] sm:inline-block">
              ⌘K
            </kbd>
          </Button>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-7 w-7">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#ff543d] text-[8px] font-bold text-white shadow-[0_0_8px_rgba(255,84,61,0.4)]">
              3
            </span>
          </Button>

          {action && (
            <Button
              size="sm"
              className="h-7 gap-1 rounded-md bg-[#ff543d] px-2.5 text-[11px] font-medium text-white shadow-[0_0_12px_rgba(255,84,61,0.2)] hover:bg-[#e04030]"
              onClick={action.onClick}
            >
              <Plus className="h-3 w-3" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          )}
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <nav className="absolute left-0 top-0 flex h-full w-[260px] flex-col border-r border-border bg-background shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#ff543d]">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[14px] font-semibold tracking-tight">{APP_NAME}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Nav items */}
            <div className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
              <p className="mb-2 px-2.5 text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                Command Center
              </p>
              {NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[13px] font-medium transition-all",
                      isActive
                        ? "bg-[#ff543d]/10 text-[#ff543d]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {item.label === "Agents" && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff543d]/15 px-1.5 text-[10px] font-bold text-[#ff543d]">
                        {mockStats.activeAgents}
                      </span>
                    )}
                    {item.label === "Tasks" && (
                      <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500/12 px-1.5 text-[10px] font-bold text-amber-400">
                        {mockStats.activeTasks}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Priya pinned */}
            <div className="mx-2 mb-2">
              <Link
                href={`/dashboard/agents/${PRIYA_ID}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-2 transition-colors hover:bg-muted"
              >
                <div className="relative">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff543d]/20">
                    <Sparkles className="h-3 w-3 text-[#ff6b56]" />
                  </div>
                  <div className="absolute -bottom-px -right-px h-[6px] w-[6px] rounded-full border border-background bg-emerald-400" />
                </div>
                <span className="flex-1 text-[12px] font-medium">Priya</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#ff6b56]">AI</span>
              </Link>
            </div>

            {/* Active crew */}
            <div className="mx-2 mb-2">
              <p className="mb-2 px-2 text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                Active Crew
              </p>
              <div className="space-y-0.5">
                {onlineAgents.slice(0, 5).map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/dashboard/agents/${agent.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff543d]/10 text-[9px] font-bold text-[#ff543d]">
                      {agent.avatar}
                    </div>
                    <span className="flex-1 truncate text-[11px] text-muted-foreground">{agent.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* User */}
            <div className="border-t border-border p-2">
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff543d]/15 text-[10px] font-bold text-[#ff543d]">
                  P
                </div>
                <p className="text-[11px] font-medium text-muted-foreground">Prabhas</p>
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
