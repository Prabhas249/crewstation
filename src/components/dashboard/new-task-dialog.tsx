"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockAgents } from "@/lib/mock-data";
import { AGENT_STATUS_CONFIG } from "@/lib/constants";

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-zinc-400", bg: "bg-zinc-400", ring: "border-zinc-400/30", activeBg: "bg-zinc-400/15" },
  { value: "medium", label: "Medium", color: "text-blue-400", bg: "bg-blue-400", ring: "border-blue-400/30", activeBg: "bg-blue-400/15" },
  { value: "high", label: "High", color: "text-amber-400", bg: "bg-amber-400", ring: "border-amber-400/30", activeBg: "bg-amber-400/15" },
  { value: "critical", label: "Critical", color: "text-red-400", bg: "bg-red-400", ring: "border-red-400/30", activeBg: "bg-red-400/15" },
] as const;

export function NewTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("auto");
  const [priority, setPriority] = useState<string>("medium");

  function handleCreate() {
    // Future: wire to backend
    onOpenChange(false);
    setTitle("");
    setDescription("");
    setAssignedTo("auto");
    setPriority("medium");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-border shadow-[0_0_60px_rgba(255,84,61,0.05)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[13px] font-semibold text-foreground">
            Create New Task
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Define a task and assign it to an agent.
          </DialogDescription>
        </DialogHeader>

        {/* Task Title */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground">
            Task Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Research competitor pricing strategies"
            className="mt-1.5 h-8 bg-muted border-border text-[12px] text-foreground placeholder:text-muted-foreground focus-visible:border-[#ff543d]/40 focus-visible:ring-[#ff543d]/10"
          />
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be done..."
            rows={3}
            className="mt-1.5 bg-muted border-border text-[12px] text-foreground placeholder:text-muted-foreground min-h-[68px] focus-visible:border-[#ff543d]/40 focus-visible:ring-[#ff543d]/10"
          />
        </div>

        {/* Assign To */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">
            Assign To
          </label>
          <Select value={assignedTo} onValueChange={setAssignedTo}>
            <SelectTrigger className="mt-1.5 w-full h-8 bg-muted border-border text-[12px] text-foreground data-[placeholder]:text-muted-foreground/40 focus-visible:border-[#ff543d]/40 focus-visible:ring-[#ff543d]/10">
              <SelectValue placeholder="Select an agent..." />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border">
              <SelectItem
                value="auto"
                className="text-[12px] text-foreground/70 focus:bg-muted focus:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff543d]" />
                  Auto-assign (Priya)
                </span>
              </SelectItem>
              {mockAgents.map((agent) => {
                const statusCfg = AGENT_STATUS_CONFIG[agent.status];
                return (
                  <SelectItem
                    key={agent.id}
                    value={agent.id}
                    className="text-[12px] text-foreground/70 focus:bg-muted focus:text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusCfg.dotColor}`}
                      />
                      {agent.name}
                      <span className="text-[10px] text-muted-foreground/60">
                        ({agent.role})
                      </span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">
            Priority
          </label>
          <div className="mt-1.5 flex gap-1.5">
            {PRIORITIES.map((p) => {
              const active = priority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex-1 rounded-md border px-2 py-1.5 text-[11px] font-medium transition-colors ${
                    active
                      ? `${p.activeBg} ${p.color} ${p.ring}`
                      : "bg-muted text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        active ? p.bg : "bg-muted-foreground/30"
                      }`}
                    />
                    {p.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-8 border-border bg-muted text-[12px] text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title}
            className="h-8 bg-[#ff543d] text-[12px] text-white hover:bg-[#ff6b56] disabled:opacity-40"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
