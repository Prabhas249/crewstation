"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  MessageSquare,
  PlayCircle,
  Zap,
  AlertCircle,
  Bot,
  Sparkles,
} from "lucide-react";
import type { ActivityItem } from "@/lib/mock-data";

const typeConfig: Record<
  ActivityItem["type"],
  { icon: React.ElementType; color: string }
> = {
  task_completed: { icon: CheckCircle2, color: "text-emerald-400" },
  agent_started: { icon: Bot, color: "text-blue-400" },
  meeting_started: { icon: PlayCircle, color: "text-[#ff6b56]" },
  workflow_run: { icon: Zap, color: "text-amber-400" },
  message: { icon: MessageSquare, color: "text-cyan-400" },
  error: { icon: AlertCircle, color: "text-red-400" },
  delegation: { icon: Sparkles, color: "text-[#ff6b56]" },
};

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  return (
    <div className="space-y-0">
      {activities.map((item, i) => {
        const config = typeConfig[item.type];
        const Icon = config.icon;
        return (
          <div
            key={item.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3",
              i < activities.length - 1 && "border-b border-border"
            )}
          >
            <div className={cn("mt-0.5 shrink-0", config.color)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px]">{item.description}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {item.timestamp}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
