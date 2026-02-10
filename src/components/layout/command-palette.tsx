"use client";

import { useState, useEffect, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";
import { NAV_ITEMS, AGENT_STATUS_CONFIG, TASK_PRIORITY_CONFIG } from "@/lib/constants";
import { mockAgents, mockTasks, mockConversations } from "@/lib/mock-data";
import {
  Bot,
  ListChecks,
  MessageSquare,
  LayoutDashboard,
  Users,
  GitBranch,
  DollarSign,
  Settings,
  ArrowRight,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
  LayoutDashboard,
  Bot,
  ListChecks,
  MessageSquare,
  Users,
  GitBranch,
  DollarSign,
  Settings,
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  const runCommand = (callback: () => void) => {
    onOpenChange(false);
    callback();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      className="[&_[data-slot=dialog-content]]:bg-card/95 [&_[data-slot=dialog-content]]:backdrop-blur-xl [&_[data-slot=dialog-content]]:border-border [&_[data-slot=dialog-content]]:shadow-[0_0_60px_rgba(255,84,61,0.08)]"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Pages */}
        <CommandGroup heading="Pages">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            return (
              <CommandItem
                key={item.href}
                className="[&[data-selected=true]]:bg-muted"
                onSelect={() => runCommand(() => router.push(item.href))}
              >
                {Icon && <Icon className="mr-2 size-4 text-muted-foreground" />}
                <span className="text-[13px]">{item.label}</span>
                <ArrowRight className="ml-auto size-3 text-muted-foreground" />
              </CommandItem>
            );
          })}
        </CommandGroup>

        {/* Agents */}
        <CommandGroup heading="Agents">
          {mockAgents.map((agent) => {
            const statusConfig = AGENT_STATUS_CONFIG[agent.status];
            return (
              <CommandItem
                key={agent.id}
                className="[&[data-selected=true]]:bg-muted"
                onSelect={() =>
                  runCommand(() => router.push(`/dashboard/agents/${agent.id}`))
                }
              >
                <span
                  className={`mr-2 inline-block size-2 rounded-full ${statusConfig.dotColor}`}
                />
                <span className="text-[13px]">{agent.name}</span>
                <span className="ml-2 text-[11px] text-muted-foreground">
                  {agent.role}
                </span>
                <CommandShortcut className="text-[11px]">
                  {statusConfig.label}
                </CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {/* Tasks */}
        <CommandGroup heading="Tasks">
          {mockTasks.slice(0, 5).map((task) => {
            const priorityConfig = TASK_PRIORITY_CONFIG[task.priority];
            return (
              <CommandItem
                key={task.id}
                className="[&[data-selected=true]]:bg-muted"
                onSelect={() => onOpenChange(false)}
              >
                <span
                  className={`mr-2 text-[11px] font-semibold uppercase ${priorityConfig.color}`}
                >
                  {priorityConfig.label}
                </span>
                <span className="truncate text-[13px]">{task.title}</span>
                <CommandShortcut className="font-mono text-[11px]">
                  {task.agentName}
                </CommandShortcut>
              </CommandItem>
            );
          })}
        </CommandGroup>

        {/* Conversations */}
        <CommandGroup heading="Conversations">
          {mockConversations.map((conv) => (
            <CommandItem
              key={conv.id}
              className="[&[data-selected=true]]:bg-muted"
              onSelect={() =>
                runCommand(() =>
                  router.push(`/dashboard/conversations/${conv.id}`)
                )
              }
            >
              <MessageSquare className="mr-2 size-4 text-muted-foreground" />
              <span className="truncate text-[13px]">{conv.title}</span>
              <CommandShortcut className="font-mono text-[11px]">
                {conv.participants.length} participants
              </CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return { open, setOpen };
}
