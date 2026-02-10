"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AGENT_STATUS_CONFIG } from "@/lib/constants";
import type { Agent } from "@/lib/mock-data";

export function AgentRow({ agent }: { agent: Agent }) {
  const statusConfig = AGENT_STATUS_CONFIG[agent.status];

  return (
    <Link
      href={`/dashboard/agents/${agent.id}`}
      className="flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className="relative">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff543d]/15 text-[13px] font-semibold text-[#ff6b56]">
          {agent.avatar}
        </div>
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card",
            statusConfig.dotColor
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium">{agent.name}</span>
          <span className="text-[11px] text-muted-foreground">{agent.role}</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{agent.tasksActive} active</span>
          <span>{agent.tasksCompleted} done</span>
          <span className="font-mono">${agent.costToday.toFixed(2)}</span>
        </div>
      </div>
      <span className={cn("text-[11px] font-medium", statusConfig.color)}>
        {statusConfig.label}
      </span>
    </Link>
  );
}
