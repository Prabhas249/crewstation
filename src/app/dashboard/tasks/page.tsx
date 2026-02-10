"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { cn } from "@/lib/utils";
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, type TaskStatus } from "@/lib/constants";
import { mockTasks } from "@/lib/mock-data";
import { NewTaskDialog } from "@/components/dashboard/new-task-dialog";

const filterTabs: { label: string; value: TaskStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "in_progress" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
];

export default function TasksPage() {
  const [filter, setFilter] = useState<TaskStatus | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTasks =
    filter === "all" ? mockTasks : mockTasks.filter((t) => t.status === filter);

  return (
    <div className="flex flex-col">
      <TopBar
        title="Tasks"
        description={`${mockTasks.length} total tasks`}
        action={{ label: "New Task", onClick: () => setDialogOpen(true) }}
      />
      <NewTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <div className="p-5">
        {/* Filter tabs */}
        <div className="mb-4 flex items-center gap-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                filter === tab.value
                  ? "bg-[#ff543d] text-white shadow-[0_0_12px_rgba(255,84,61,0.2)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {tab.label}
              <span className="ml-1.5 font-mono tabular-nums text-[10px]">
                {tab.value === "all"
                  ? mockTasks.length
                  : mockTasks.filter((t) => t.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* Task table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_120px_100px_90px_80px_80px] items-center gap-4 border-b border-border px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Task</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Agent</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Status</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Priority</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground text-right">Cost</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground text-right">Duration</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {filteredTasks.map((task) => {
              const statusConf = TASK_STATUS_CONFIG[task.status];
              const priorityConf = TASK_PRIORITY_CONFIG[task.priority];
              return (
                <div
                  key={task.id}
                  className="grid grid-cols-[1fr_120px_100px_90px_80px_80px] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium">{task.title}</p>
                    <p className="text-[11px] text-muted-foreground">{task.updatedAt}</p>
                  </div>
                  <span className="text-[12px] text-muted-foreground">{task.agentName}</span>
                  <span className={cn("inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium", statusConf.bg, statusConf.color)}>
                    {statusConf.label}
                  </span>
                  <span className={cn("text-[12px] font-medium", priorityConf.color)}>
                    {priorityConf.label}
                  </span>
                  <span className="text-right font-mono text-[12px] tabular-nums text-muted-foreground">
                    ${task.cost.toFixed(2)}
                  </span>
                  <span className="text-right font-mono text-[12px] tabular-nums text-muted-foreground">
                    {task.duration}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
