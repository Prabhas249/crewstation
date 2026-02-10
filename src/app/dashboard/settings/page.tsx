"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Key, Send, Lock, ShieldAlert } from "lucide-react";

const tabs = [
  { label: "General", value: "general" },
  { label: "Gateway", value: "gateway" },
  { label: "Telegram", value: "telegram" },
  { label: "API Keys", value: "api-keys" },
  { label: "Notifications", value: "notifications" },
  { label: "Team", value: "team" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex flex-col">
      <TopBar title="Settings" description="Configure your workspace" />

      <div className="p-5">
        {/* Tabs */}
        <div className="mb-5 flex items-center gap-0.5 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "cursor-pointer border-b-2 px-3.5 py-2 text-[12px] font-medium transition-colors",
                activeTab === tab.value
                  ? "border-[#ff543d] text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {(tab.value === "gateway" || tab.value === "telegram" || tab.value === "api-keys") && (
                <Lock className="ml-1.5 inline h-2.5 w-2.5 text-red-400" />
              )}
            </button>
          ))}
        </div>

        {/* General */}
        {activeTab === "general" && (
          <div className="max-w-2xl space-y-4">
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">Workspace</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">General workspace settings</p>
              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="text-[11px] font-medium">Workspace Name</label>
                  <Input defaultValue="My Workspace" className="mt-1 h-8 text-[12px]" />
                </div>
                <div>
                  <label className="text-[11px] font-medium">Default Model</label>
                  <Input defaultValue="claude-sonnet-••••" readOnly className="mt-1 h-8 font-mono text-[12px] text-muted-foreground" />
                </div>
                <div>
                  <label className="text-[11px] font-medium">Max Concurrent Agents</label>
                  <Input type="number" defaultValue="10" className="mt-1 h-8 text-[12px]" />
                </div>
              </div>
              <Button className="mt-4 h-8 bg-[#ff543d] text-[11px] hover:bg-[#e04030]">Save Changes</Button>
            </div>

            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">Cost Limits</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Set spending alerts and hard limits</p>
              <div className="mt-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium">Daily Spending Alert</p>
                    <p className="text-[10px] text-muted-foreground">Get notified when daily cost exceeds threshold</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="25" className="h-7 w-16 text-right font-mono text-[12px]" />
                    <span className="text-[10px] text-muted-foreground">USD</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium">Hard Spending Limit</p>
                    <p className="text-[10px] text-muted-foreground">Pause all agents when limit is reached</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input defaultValue="100" className="h-7 w-16 text-right font-mono text-[12px]" />
                    <span className="text-[10px] text-muted-foreground">USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gateway */}
        {activeTab === "gateway" && (
          <div className="max-w-2xl">
            <div className="glass-panel rounded-xl border-red-500/20 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <ShieldAlert className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold">Gateway Configuration Locked</h3>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Connection details are hidden for security.
              </p>
              <div className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 w-fit">
                <Lock className="h-3 w-3 text-red-400" />
                <span className="text-[10px] font-medium text-red-400">Access Restricted</span>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Want your own CrewStation dashboard?{" "}
                <span className="font-semibold text-[#ff543d]">Contact Prabhas</span>
              </p>
            </div>
          </div>
        )}

        {/* Telegram Integration */}
        {activeTab === "telegram" && (
          <div className="max-w-2xl">
            <div className="glass-panel rounded-xl border-red-500/20 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <Send className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold">Telegram Integration Locked</h3>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                Bot tokens, chat IDs, and webhook details are hidden for security.
              </p>
              <div className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 w-fit">
                <Lock className="h-3 w-3 text-red-400" />
                <span className="text-[10px] font-medium text-red-400">Access Restricted</span>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Want your own CrewStation dashboard?{" "}
                <span className="font-semibold text-[#ff543d]">Contact Prabhas</span>
              </p>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeTab === "api-keys" && (
          <div className="max-w-2xl">
            <div className="glass-panel rounded-xl border-red-500/20 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <Key className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold">API Keys Locked</h3>
              <p className="mt-1.5 text-[12px] text-muted-foreground">
                LLM provider keys are hidden for security.
              </p>
              <div className="mt-4 space-y-1.5">
                {["Anthropic", "OpenAI", "Google AI"].map((provider) => (
                  <div key={provider} className="mx-auto flex w-fit items-center gap-2 rounded-md border border-border px-3 py-1.5">
                    <Key className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] font-medium">{provider}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">••••••••••••</span>
                  </div>
                ))}
              </div>
              <div className="mx-auto mt-4 flex items-center justify-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1.5 w-fit">
                <Lock className="h-3 w-3 text-red-400" />
                <span className="text-[10px] font-medium text-red-400">Access Restricted</span>
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Want your own CrewStation dashboard?{" "}
                <span className="font-semibold text-[#ff543d]">Contact Prabhas</span>
              </p>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="max-w-2xl">
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">In-App Notifications</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Choose what to be notified about</p>
              <div className="mt-4 space-y-3.5">
                {[
                  { label: "Task Completed", desc: "When an agent finishes a task" },
                  { label: "Task Failed", desc: "When a task fails or errors out" },
                  { label: "Agent Offline", desc: "When an agent disconnects" },
                  { label: "Cost Alert", desc: "When spending exceeds your threshold" },
                  { label: "Meeting Reminder", desc: "Before a scheduled agent meeting" },
                  { label: "Workflow Complete", desc: "When a workflow pipeline finishes" },
                ].map((item, i) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-[12px] font-medium">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={i < 4} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team */}
        {activeTab === "team" && (
          <div className="max-w-2xl">
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[13px] font-semibold">Team Members</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">People with access to this workspace</p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[11px]">Invite</Button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff543d]/15 text-[11px] font-semibold text-[#ff6b56]">
                      P
                    </div>
                    <div>
                      <p className="text-[12px] font-medium">Prabhas</p>
                      <p className="text-[10px] text-muted-foreground">p••••••@crewstation.ai</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[9px]">Owner</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
