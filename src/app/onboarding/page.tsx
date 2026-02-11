"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Key, Bot, ArrowRight, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const STEPS = ["Workspace", "API Key", "First Agent"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Workspace
  const [workspaceName, setWorkspaceName] = useState("My Workspace");

  // Step 2: API Key
  const [apiKey, setApiKey] = useState("");

  // Step 3: First Agent
  const [agentName, setAgentName] = useState("");
  const [agentRole, setAgentRole] = useState("");

  async function handleComplete() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create workspace
      const { data: workspace, error: wsError } = await supabase
        .from("workspaces")
        .insert({
          user_id: user.id,
          name: workspaceName,
          anthropic_api_key: apiKey || null,
        })
        .select()
        .single();

      if (wsError) throw wsError;

      // Create first agent
      if (agentName && workspace) {
        const { error: agentError } = await supabase.from("agents").insert({
          workspace_id: workspace.id,
          name: agentName,
          role: agentRole || "General Assistant",
          personality: `You are ${agentName}, a ${agentRole || "general assistant"}. You are helpful, thorough, and proactive.`,
          avatar: agentName.charAt(0).toUpperCase(),
        });
        if (agentError) throw agentError;

        // Log activity
        await supabase.from("activities").insert({
          workspace_id: workspace.id,
          type: "agent_started",
          description: `${agentName} joined the crew as ${agentRole || "General Assistant"}`,
        });
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff543d]">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight">Welcome to {APP_NAME}</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">Let&apos;s set up your crew in 3 steps</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                  i < step
                    ? "bg-emerald-500 text-white"
                    : i === step
                      ? "bg-[#ff543d] text-white"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn(
                "text-[11px] font-medium",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="mx-1 h-px w-6 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-xl border border-border bg-card p-6">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#ff543d]" />
                <h2 className="text-[14px] font-semibold">Name your workspace</h2>
              </div>
              <p className="text-[12px] text-muted-foreground">
                This is where your AI crew operates. You can change this later.
              </p>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="e.g. My Startup, Content Team, Dev Crew"
                className="h-10 text-[13px]"
              />
              <Button
                className="h-10 w-full bg-[#ff543d] text-[13px] hover:bg-[#e04030]"
                onClick={() => setStep(1)}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-[#ff543d]" />
                <h2 className="text-[14px] font-semibold">Add your Anthropic API key</h2>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Your agents use Claude to think. Get a key from{" "}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#ff543d] hover:underline"
                >
                  console.anthropic.com
                </a>
              </p>
              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="h-10 font-mono text-[13px]"
              />
              <p className="text-[10px] text-muted-foreground">
                Stored encrypted. Never shared. You can skip and add later.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="h-10 flex-1 text-[13px]" onClick={() => setStep(0)}>
                  Back
                </Button>
                <Button
                  className="h-10 flex-1 bg-[#ff543d] text-[13px] hover:bg-[#e04030]"
                  onClick={() => setStep(2)}
                >
                  {apiKey ? "Next" : "Skip for now"} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#ff543d]" />
                <h2 className="text-[14px] font-semibold">Create your first agent</h2>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Give your agent a name and role. You can add more agents later.
              </p>
              <Input
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. Priya, Jarvis, Friday"
                className="h-10 text-[13px]"
              />
              <Input
                value={agentRole}
                onChange={(e) => setAgentRole(e.target.value)}
                placeholder="e.g. Content Writer, Researcher, Developer"
                className="h-10 text-[13px]"
              />

              {error && (
                <p className="text-[12px] text-red-400">{error}</p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="h-10 flex-1 text-[13px]" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  disabled={loading}
                  className="h-10 flex-1 bg-[#ff543d] text-[13px] hover:bg-[#e04030]"
                  onClick={handleComplete}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Bot className="mr-2 h-4 w-4" />
                  )}
                  Launch Crew
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
