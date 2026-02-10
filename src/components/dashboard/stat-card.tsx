"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  suffix?: string;
}

export function StatCard({ label, value, change, changeType = "neutral", icon: Icon, suffix }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="font-mono text-2xl font-semibold tabular-nums tracking-tight">
          {value}
        </span>
        {suffix && (
          <span className="text-[12px] text-muted-foreground">{suffix}</span>
        )}
      </div>
      {change && (
        <p
          className={cn(
            "mt-1 text-[11px] font-medium",
            changeType === "positive" && "text-emerald-400",
            changeType === "negative" && "text-red-400",
            changeType === "neutral" && "text-muted-foreground"
          )}
        >
          {change}
        </p>
      )}
    </div>
  );
}
