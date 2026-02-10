"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TopBar } from "@/components/layout/top-bar";
import { AGENT_STATUS_CONFIG } from "@/lib/constants";
import { mockAgents, PRIYA_ID } from "@/lib/mock-data";
import { Cpu, Zap, CheckCircle2, Clock, Sparkles, Send, Bot, Activity } from "lucide-react";
import { NewAgentDialog } from "@/components/dashboard/new-agent-dialog";

export default function AgentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <TopBar
        title="Agents"
        description={`${mockAgents.length} agents configured`}
        action={{ label: "New Agent", onClick: () => setDialogOpen(true) }}
      />
      <NewAgentDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <div className="p-5 space-y-4">
        {/* Priya Hero Card */}
        {(() => {
          const priya = mockAgents.find((a) => a.id === PRIYA_ID);
          if (!priya) return null;
          const otherAgents = mockAgents.filter((a) => a.id !== PRIYA_ID);
          const managedCount = otherAgents.length;
          const onlineCount = otherAgents.filter((a) => a.status === "online" || a.status === "busy").length;
          return (
            <Link
              href={`/dashboard/agents/${PRIYA_ID}`}
              className="glass rounded-xl p-5 block relative overflow-hidden"
              style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 90% 0%, rgba(255,84,61,0.08), transparent)" }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff543d]/20">
                      <Sparkles className="h-6 w-6 text-[#ff6b56]" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-400 live-dot" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[16px] font-semibold text-foreground">{priya.name}</h3>
                      <span className="rounded-full bg-[#ff543d]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ff6b56]">
                        Orchestrator
                      </span>
                    </div>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{priya.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#ff6b56]" />
                  <span className="font-mono text-[11px] tabular-nums">{priya.tasksCompleted} delegations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bot className="h-3 w-3 text-cyan-400" />
                  <span className="font-mono text-[11px] tabular-nums">{onlineCount}/{managedCount} agents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-emerald-400" />
                  <span className="text-[11px]">{priya.uptime} uptime</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Send className="h-3 w-3 text-[#229ED9]" />
                  <span className="text-[11px] text-emerald-400">Telegram active</span>
                </div>
              </div>
            </Link>
          );
        })()}

        {/* Agent Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockAgents.filter((a) => a.id !== PRIYA_ID).map((agent) => {
            const statusConf = AGENT_STATUS_CONFIG[agent.status];
            return (
              <Link
                key={agent.id}
                href={`/dashboard/agents/${agent.id}`}
                className="glass rounded-xl p-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff543d]/15 text-[15px] font-semibold text-[#ff6b56]">
                        {agent.avatar}
                      </div>
                      <div
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background",
                          statusConf.dotColor
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold">{agent.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                  {agent.description}
                </p>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span className="font-mono text-[11px] tabular-nums">{agent.tasksCompleted} done</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span className="font-mono text-[11px] tabular-nums">{(agent.tokensUsed / 1000).toFixed(0)}k tok</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-blue-400" />
                    <span className="text-[11px]">{agent.model.split("-").slice(0, 2).join("-")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px]">{agent.lastActive}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className={cn("flex items-center gap-1.5 text-[11px] font-medium", statusConf.color)}>
                    <div className={cn("h-1.5 w-1.5 rounded-full", statusConf.dotColor)} />
                    {statusConf.label}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    ${agent.costToday.toFixed(2)} today
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
