"use client";

import { useState, useCallback } from "react";
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

const MODELS = [
  { value: "claude-sonnet-4-5-20250929", label: "Claude Sonnet 4.5" },
  { value: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5" },
  { value: "claude-opus-4-20250115", label: "Claude Opus 4" },
  { value: "gpt-4o", label: "GPT-4o" },
  { value: "deepseek-r1", label: "DeepSeek R1" },
];

const CAPABILITIES = [
  "web_search",
  "browser",
  "shell",
  "file_read",
  "file_write",
  "code_review",
  "summarize",
] as const;

const SOUL_TEMPLATE = `# SOUL.md — Agent Identity

## Role
You are a {role} agent.

## Personality
- Professional and concise
- Ask clarifying questions when needed
- Always cite sources

## Constraints
- Stay within assigned scope
- Escalate blockers immediately
- Max 4096 tokens per response`;

export function NewAgentDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [model, setModel] = useState("");
  const [description, setDescription] = useState("");
  const [capabilities, setCapabilities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleCapability(cap: string) {
    setCapabilities((prev) => {
      const next = new Set(prev);
      if (next.has(cap)) {
        next.delete(cap);
      } else {
        next.add(cap);
      }
      return next;
    });
  }

  const handleCreate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const personality = SOUL_TEMPLATE.replace("{role}", role);
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          personality,
          model: model || "claude-sonnet-4-5-20250929",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create agent");
      }

      onOpenChange(false);
      onCreated?.();
      setName("");
      setRole("");
      setModel("");
      setDescription("");
      setCapabilities(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create agent");
    }
    setLoading(false);
  }, [name, role, model, onOpenChange, onCreated]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-xl border-border shadow-[0_0_60px_rgba(255,84,61,0.05)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[13px] font-semibold text-foreground">
            Create New Agent
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Configure an AI agent to join your crew.
          </DialogDescription>
        </DialogHeader>

        {/* Agent Name */}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground">
            Agent Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya, Messi, Curry..."
            className="mt-1.5 h-8 bg-muted border-border text-[12px] text-foreground placeholder:text-muted-foreground focus-visible:border-[#ff543d]/40 focus-visible:ring-[#ff543d]/10"
          />
        </div>

        {/* Role */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">Role</label>
          <Input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Research Agent, Software Engineer..."
            className="mt-1.5 h-8 bg-muted border-border text-[12px] text-foreground placeholder:text-muted-foreground focus-visible:border-[#ff543d]/40 focus-visible:ring-[#ff543d]/10"
          />
        </div>

        {/* Model */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">
            Model
          </label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger className="mt-1.5 w-full h-8 bg-muted border-border text-[12px] text-foreground data-[placeholder]:text-muted-foreground/40 focus-visible:border-[#ff543d]/40 focus-visible:ring-[#ff543d]/10">
              <SelectValue placeholder="Select a model..." />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-xl border-border">
              {MODELS.map((m) => (
                <SelectItem
                  key={m.value}
                  value={m.value}
                  className="text-[12px] text-foreground/70 focus:bg-muted focus:text-foreground"
                >
                  {m.label}
                  <span className="ml-2 text-[10px] text-muted-foreground/60 font-mono">
                    {m.value}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What should this agent do?"
            rows={2}
            className="mt-1.5 bg-muted border-border text-[12px] text-foreground placeholder:text-muted-foreground min-h-[56px] focus-visible:border-[#ff543d]/40 focus-visible:ring-[#ff543d]/10"
          />
        </div>

        {/* Capabilities */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">
            Capabilities
          </label>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {CAPABILITIES.map((cap) => {
              const active = capabilities.has(cap);
              return (
                <button
                  key={cap}
                  type="button"
                  onClick={() => toggleCapability(cap)}
                  className={`rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                    active
                      ? "bg-[#ff543d]/15 text-[#ff6b56] border-[#ff543d]/30"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted"
                  }`}
                >
                  {cap}
                </button>
              );
            })}
          </div>
        </div>

        {/* SOUL.md Template */}
        <div className="mt-4">
          <label className="text-[11px] font-medium text-muted-foreground">
            SOUL.md Template
          </label>
          <div className="mt-1.5 rounded-md border border-border bg-muted/30 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground/60 max-h-[120px] overflow-y-auto">
            <pre className="whitespace-pre-wrap">{SOUL_TEMPLATE}</pre>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-[11px] text-red-400">{error}</p>
        )}

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
            disabled={!name || !role || !model || loading}
            className="h-8 bg-[#ff543d] text-[12px] text-white hover:bg-[#ff6b56] disabled:opacity-40"
          >
            {loading ? "Creating..." : "Create Agent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
