"use client";

import { useState, useEffect, useCallback } from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Key,
  Save,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  Wifi,
  Globe,
} from "lucide-react";

const tabs = [
  { label: "General", value: "general" },
  { label: "API Keys", value: "api-keys" },
  { label: "Gateway", value: "gateway" },
  { label: "Notifications", value: "notifications" },
  { label: "Team", value: "team" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Workspace state
  const [workspaceName, setWorkspaceName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [gatewayUrl, setGatewayUrl] = useState("");
  const [gatewayToken, setGatewayToken] = useState("");
  const [showGatewayToken, setShowGatewayToken] = useState(false);
  const [plan, setPlan] = useState("free");
  const [maxAgents, setMaxAgents] = useState(2);

  const loadWorkspace = useCallback(async () => {
    try {
      const res = await fetch("/api/workspace");
      if (res.ok) {
        const ws = await res.json();
        setWorkspaceName(ws.name || "");
        setGatewayUrl(ws.gateway_url || "");
        setPlan(ws.plan || "free");
        setMaxAgents(ws.max_agents || 2);
      }
    } catch {
      // Workspace not loaded — user might be on demo
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  async function handleSave(fields: Record<string, string>) {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // ignore
    }
    setSaving(false);
  }

  const SaveButton = ({ onClick }: { onClick: () => void }) => (
    <Button
      onClick={onClick}
      disabled={saving}
      className="h-8 bg-[#ff543d] text-[11px] hover:bg-[#e04030]"
    >
      {saving ? (
        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
      ) : saved ? (
        <CheckCircle2 className="mr-1.5 h-3 w-3" />
      ) : (
        <Save className="mr-1.5 h-3 w-3" />
      )}
      {saved ? "Saved" : "Save Changes"}
    </Button>
  );

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
            </button>
          ))}
        </div>

        {/* General */}
        {activeTab === "general" && (
          <div className="max-w-2xl space-y-4">
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">Workspace</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                General workspace settings
              </p>
              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="text-[11px] font-medium">
                    Workspace Name
                  </label>
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="My Workspace"
                    className="mt-1 h-8 text-[12px]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium">Plan</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-[10px] uppercase"
                    >
                      {plan}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {maxAgents} agents · {plan === "free" ? "10" : plan === "pro" ? "100" : "500"}{" "}
                      tasks/day
                    </span>
                  </div>
                </div>
              </div>
              <SaveButton
                onClick={() => handleSave({ name: workspaceName })}
              />
            </div>

            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">Cost Limits</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Set spending alerts and hard limits
              </p>
              <div className="mt-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium">
                      Daily Spending Alert
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Get notified when daily cost exceeds threshold
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue="25"
                      className="h-7 w-16 text-right font-mono text-[12px]"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      USD
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-medium">
                      Hard Spending Limit
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Pause all agents when limit is reached
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue="100"
                      className="h-7 w-16 text-right font-mono text-[12px]"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Keys */}
        {activeTab === "api-keys" && (
          <div className="max-w-2xl space-y-4">
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-[#ff6b56]" />
                <h3 className="text-[13px] font-semibold">
                  Anthropic API Key
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Your agents use Claude to think. BYOK — we never touch your key.
                Get one from{" "}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#ff543d] hover:underline"
                >
                  console.anthropic.com
                </a>
              </p>
              <div className="mt-4">
                <div className="relative">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    className="h-9 pr-10 font-mono text-[12px]"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showApiKey ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Stored encrypted in your workspace. Never shared or logged.
                </p>
              </div>
              <div className="mt-4">
                <SaveButton
                  onClick={() =>
                    handleSave({ anthropic_api_key: apiKey })
                  }
                />
              </div>
            </div>

            <div className="glass-panel rounded-xl border-dashed p-5 opacity-50">
              <h3 className="text-[13px] font-semibold">
                More providers coming soon
              </h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                OpenAI, Google AI, and other providers will be supported in
                future updates.
              </p>
            </div>
          </div>
        )}

        {/* Gateway */}
        {activeTab === "gateway" && (
          <div className="max-w-2xl space-y-4">
            <div className="glass-panel rounded-xl p-5">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-[#ff6b56]" />
                <h3 className="text-[13px] font-semibold">
                  OpenClaw Gateway
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Connect to your OpenClaw Gateway running on your VPS. This
                manages agent sessions, persistent memory, and messaging.
              </p>

              <div className="mt-4 space-y-3.5">
                <div>
                  <label className="text-[11px] font-medium">
                    Gateway URL
                  </label>
                  <div className="relative mt-1">
                    <Globe className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={gatewayUrl}
                      onChange={(e) => setGatewayUrl(e.target.value)}
                      placeholder="wss://api.crewstation.app/gateway"
                      className="h-9 pl-8 font-mono text-[12px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-medium">
                    Gateway Token
                  </label>
                  <div className="relative mt-1">
                    <Key className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showGatewayToken ? "text" : "password"}
                      value={gatewayToken}
                      onChange={(e) => setGatewayToken(e.target.value)}
                      placeholder="your-gateway-auth-token"
                      className="h-9 pl-8 pr-10 font-mono text-[12px]"
                    />
                    <button
                      onClick={() =>
                        setShowGatewayToken(!showGatewayToken)
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showGatewayToken ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <SaveButton
                  onClick={() =>
                    handleSave({
                      gateway_url: gatewayUrl,
                      gateway_token: gatewayToken,
                    })
                  }
                />
              </div>
            </div>

            <div className="glass-panel rounded-xl p-4">
              <h4 className="text-[12px] font-semibold">Setup Guide</h4>
              <ol className="mt-2 space-y-1.5 text-[11px] text-muted-foreground">
                <li>
                  1. Get a Hetzner VPS ($5/mo) — Ubuntu 22.04
                </li>
                <li>
                  2. Point your domain (e.g. api.crewstation.app) to the VPS IP
                </li>
                <li>
                  3. Run{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                    sudo ./deploy/setup.sh
                  </code>{" "}
                  from the repo
                </li>
                <li>
                  4. Paste the Gateway URL above
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <div className="max-w-2xl">
            <div className="glass-panel rounded-xl p-5">
              <h3 className="text-[13px] font-semibold">
                In-App Notifications
              </h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Choose what to be notified about
              </p>
              <div className="mt-4 space-y-3.5">
                {[
                  {
                    label: "Task Completed",
                    desc: "When an agent finishes a task",
                  },
                  {
                    label: "Task Failed",
                    desc: "When a task fails or errors out",
                  },
                  {
                    label: "Agent Offline",
                    desc: "When an agent disconnects",
                  },
                  {
                    label: "Cost Alert",
                    desc: "When spending exceeds your threshold",
                  },
                  {
                    label: "Meeting Reminder",
                    desc: "Before a scheduled agent meeting",
                  },
                  {
                    label: "Workflow Complete",
                    desc: "When a workflow pipeline finishes",
                  },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-[12px] font-medium">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.desc}
                      </p>
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
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    People with access to this workspace
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                >
                  Invite
                </Button>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff543d]/15 text-[11px] font-semibold text-[#ff6b56]">
                      P
                    </div>
                    <div>
                      <p className="text-[12px] font-medium">You</p>
                      <p className="text-[10px] text-muted-foreground">
                        Workspace owner
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[9px]">
                    Owner
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
