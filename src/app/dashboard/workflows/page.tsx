"use client";

import { TopBar } from "@/components/layout/top-bar";
import { mockWorkflows } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { GitBranch, PlayCircle, Pause, FileEdit, ArrowRight } from "lucide-react";

const workflowStatusConfig = {
  active: { label: "Active", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: PlayCircle },
  paused: { label: "Paused", color: "text-amber-400", bg: "bg-amber-400/10", icon: Pause },
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted", icon: FileEdit },
};

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col">
      <TopBar
        title="Workflows"
        description="Automated multi-agent pipelines"
        action={{ label: "New Workflow" }}
      />

      <div className="p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockWorkflows.map((wf) => {
            const status = workflowStatusConfig[wf.status];
            const steps = wf.description.split(" → ");

            return (
              <div
                key={wf.id}
                className="glass rounded-xl p-5"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", status.bg)}>
                      <GitBranch className={cn("h-4 w-4", status.color)} />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-semibold">{wf.name}</h3>
                      <span className={cn("text-[11px] font-medium", status.color)}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Flow visualization */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-medium">
                        {step}
                      </span>
                      {i < steps.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border pt-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Runs Today</p>
                    <p className="mt-0.5 font-mono text-[14px] font-semibold tabular-nums">{wf.runsToday}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Success</p>
                    <p className={cn("mt-0.5 font-mono text-[14px] font-semibold tabular-nums", wf.successRate >= 90 ? "text-emerald-400" : wf.successRate >= 80 ? "text-amber-400" : "text-red-400")}>
                      {wf.successRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Last Run</p>
                    <p className="mt-0.5 text-[12px]">{wf.lastRun}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
