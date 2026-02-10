"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Key, Bell, Eye, EyeOff, Copy, Radio, Send, MessageSquare, Bot, CheckCircle2, AlertCircle, DollarSign, Users, Shield, Sparkles } from "lucide-react";

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
  const [showKey, setShowKey] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(true);

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
              {tab.value === "telegram" && (
                <span className="ml-1.5 inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
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
                  <Input defaultValue="claude-sonnet-4-5-20250929" className="mt-1 h-8 font-mono text-[12px]" />
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
          <div className="max-w-2xl space-y-4">
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[13px] font-semibold">OpenClaw Gateway</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Connection to your OpenClaw instance</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 live-dot" />
                  <span className="text-[10px] font-medium text-emerald-400">Connected</span>
                </div>
              </div>
              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="text-[11px] font-medium">Gateway URL</label>
                  <Input defaultValue="ws://localhost:18789" className="mt-1 h-8 font-mono text-[12px]" />
                </div>
                <div>
                  <label className="text-[11px] font-medium">Auth Token</label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      type={showKey ? "text" : "password"}
                      defaultValue="sk-openclaw-xxxxxxxxxxxxx"
                      className="h-8 font-mono text-[12px]"
                    />
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => setShowKey(!showKey)}>
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="h-8 bg-[#ff543d] text-[11px] hover:bg-[#e04030]">Test Connection</Button>
                <Button variant="outline" className="h-8 text-[11px]">Save</Button>
              </div>
            </div>

            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">Gateway Status</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {[
                  { label: "Version", value: "1.0.42" },
                  { label: "Uptime", value: "23h 14m" },
                  { label: "Active Sessions", value: "5" },
                  { label: "Memory Usage", value: "342 MB" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{item.label}</p>
                    <p className="mt-0.5 font-mono text-[13px] font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Telegram Integration */}
        {activeTab === "telegram" && (
          <div className="max-w-2xl space-y-4">
            {/* Connection card */}
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff543d]/15">
                    <Sparkles className="h-5 w-5 text-[#ff6b56]" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-semibold">Priya on Telegram</h3>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Priya answers your commands and sends crew updates via Telegram
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 live-dot" />
                  <span className="text-[10px] font-medium text-emerald-400">Connected</span>
                </div>
              </div>

              <div className="mt-5 space-y-3.5">
                <div>
                  <label className="text-[11px] font-medium">Bot Token</label>
                  <div className="mt-1 flex gap-2">
                    <Input
                      type={showKey ? "text" : "password"}
                      defaultValue="7234567890:AAF1x2y3z4-abcdefghij1234567890"
                      className="h-8 font-mono text-[12px]"
                    />
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" onClick={() => setShowKey(!showKey)}>
                      {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Get from <span className="font-medium text-[#229ED9]">@BotFather</span> on Telegram
                  </p>
                </div>
                <div>
                  <label className="text-[11px] font-medium">Chat ID</label>
                  <Input defaultValue="-1001234567890" className="mt-1 h-8 font-mono text-[12px]" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Your Telegram user or group chat ID</p>
                </div>
                <div>
                  <label className="text-[11px] font-medium">Webhook URL</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      readOnly
                      value="https://crewstation.ai/api/telegram/webhook"
                      className="h-8 font-mono text-[12px] text-muted-foreground"
                    />
                    <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="h-8 bg-[#229ED9] text-[11px] text-white hover:bg-[#1a8cc4]">
                  <Send className="mr-1.5 h-3 w-3" /> Test Message
                </Button>
                <Button variant="outline" className="h-8 text-[11px]">Save</Button>
              </div>
            </div>

            {/* Commands reference */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">Priya responds to:</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Commands available in Telegram</p>
              <div className="mt-4 space-y-2">
                {[
                  { cmd: "/priya", desc: "Talk directly to Priya" },
                  { cmd: "/status", desc: "Crew overview — agents, tasks, costs" },
                  { cmd: "/agents", desc: "List all agents with current status" },
                  { cmd: "/tasks", desc: "Show active and recent tasks" },
                  { cmd: '/task "description"', desc: "Create and assign a new task" },
                  { cmd: "/pause [agent]", desc: "Pause an agent" },
                  { cmd: "/resume [agent]", desc: "Resume a paused agent" },
                  { cmd: "/costs", desc: "Today's spending breakdown" },
                  { cmd: '/meeting "title"', desc: "Schedule an agent meeting" },
                  { cmd: "/logs [agent]", desc: "Recent activity logs for an agent" },
                  { cmd: "/help", desc: "Show all available commands" },
                ].map((item) => (
                  <div key={item.cmd} className="flex items-start gap-3 rounded-md bg-muted px-3 py-2">
                    <code className="shrink-0 font-mono text-[11px] font-medium text-[#ff6b56]">
                      {item.cmd}
                    </code>
                    <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification preferences */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">Priya will notify you about:</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Choose what Priya sends to Telegram</p>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Task Completed", desc: "When an agent finishes a task", icon: CheckCircle2, color: "text-emerald-400", on: true },
                  { label: "Task Failed", desc: "When a task errors out", icon: AlertCircle, color: "text-red-400", on: true },
                  { label: "Agent Offline", desc: "When an agent disconnects", icon: Bot, color: "text-amber-400", on: true },
                  { label: "Cost Alert", desc: "Spending exceeds threshold", icon: DollarSign, color: "text-emerald-400", on: true },
                  { label: "Meeting Summary", desc: "After a meeting completes", icon: Users, color: "text-[#ff6b56]", on: false },
                  { label: "Daily Digest", desc: "End-of-day summary at 6 PM", icon: MessageSquare, color: "text-cyan-400", on: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                      <div>
                        <p className="text-[12px] font-medium">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={item.on} />
                  </div>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber-400" />
                <h3 className="text-[13px] font-semibold">Security</h3>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium">Require PIN for commands</p>
                    <p className="text-[10px] text-muted-foreground">Add a 4-digit PIN before executing commands</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium">Restrict to verified users</p>
                    <p className="text-[10px] text-muted-foreground">Only allow whitelisted Telegram user IDs</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <label className="text-[11px] font-medium">Allowed User IDs</label>
                  <Input defaultValue="123456789" className="mt-1 h-8 font-mono text-[12px]" />
                  <p className="mt-1 text-[10px] text-muted-foreground">Comma-separated Telegram user IDs</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeTab === "api-keys" && (
          <div className="max-w-2xl space-y-4">
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[13px] font-semibold">LLM Provider Keys</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">API keys for AI model providers</p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[11px]">
                  <Key className="mr-1.5 h-3 w-3" /> Add Key
                </Button>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { provider: "Anthropic", key: "sk-ant-api03-xxxx...xxxx", status: "active" },
                  { provider: "OpenAI", key: "sk-xxxx...xxxx", status: "active" },
                  { provider: "Google AI", key: "AIza...xxxx", status: "inactive" },
                ].map((item) => (
                  <div key={item.provider} className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <Key className="h-3.5 w-3.5 text-muted-foreground" />
                      <div>
                        <p className="text-[12px] font-medium">{item.provider}</p>
                        <p className="font-mono text-[10px] text-muted-foreground">{item.key}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[9px]",
                          item.status === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {item.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
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
                      <p className="text-[10px] text-muted-foreground">prabhas@crewstation.ai</p>
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
