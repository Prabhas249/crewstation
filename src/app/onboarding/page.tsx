"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Key, Bot, ArrowRight, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const STEPS = ["Workspace", "API Key", "Agent"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Workspace
  const [workspaceName, setWorkspaceName] = useState("");

  // Step 2: API Key
  const [provider, setProvider] = useState<"anthropic" | "openai" | "gemini">("anthropic");
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
      const keyField =
        provider === "anthropic" ? "anthropic_api_key" :
        provider === "openai" ? "openai_api_key" :
        "gemini_api_key";

      const { data: workspace, error: wsError } = await supabase
        .from("workspaces")
        .insert({
          user_id: user.id,
          name: workspaceName || "My Workspace",
          [keyField]: apiKey || null,
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
          description: `${agentName} joined as ${agentRole || "General Assistant"}`,
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-[#ff543d]/[0.02] p-6">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#ff543d] to-[#ff6b56] shadow-xl shadow-[#ff543d]/20">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-[32px] font-semibold tracking-tight text-foreground">
            Welcome!
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
            30 seconds to your first agent
          </p>
        </div>

        {/* Progress */}
        <div className="mb-10 flex items-center justify-center gap-3">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300",
                    i < step
                      ? "bg-emerald-500 text-white shadow-sm"
                      : i === step
                        ? "bg-[#ff543d] text-white shadow-lg shadow-[#ff543d]/30"
                        : "bg-muted/50 text-muted-foreground"
                  )}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn(
                  "text-[11px] font-medium transition-colors",
                  i === step ? "text-foreground" : "text-muted-foreground/60"
                )}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "h-[1px] w-12 transition-colors",
                  i < step ? "bg-emerald-500/30" : "bg-border/50"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-[24px] border border-border/50 bg-card/80 p-10 shadow-2xl shadow-black/[0.03] backdrop-blur-xl">
          {/* Step 1: Workspace */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight">
                  Name your workspace
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Give your team a name. Think project or company.
                </p>
              </div>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Acme Corp"
                className="h-12 rounded-xl border-border/50 text-[15px] transition-all focus:border-[#ff543d]/30 focus:ring-4 focus:ring-[#ff543d]/10"
                autoFocus
              />
              <Button
                className="h-12 w-full rounded-xl bg-gradient-to-b from-[#ff543d] to-[#ff5a47] text-[15px] font-semibold shadow-lg shadow-[#ff543d]/20 transition-all hover:shadow-xl hover:shadow-[#ff543d]/30"
                onClick={() => setStep(1)}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: API Key */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight">
                  Choose your AI
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Select a provider and add your API key.
                </p>
              </div>

              {/* Provider cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "anthropic", label: "Claude", badge: "Best" },
                  { value: "openai", label: "OpenAI", badge: "Popular" },
                  { value: "gemini", label: "Gemini", badge: "Fast" }
                ].map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setProvider(p.value as any)}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border p-4 text-center transition-all duration-200",
                      provider === p.value
                        ? "border-[#ff543d] bg-[#ff543d]/5 shadow-sm"
                        : "border-border/50 bg-background/50 hover:border-border hover:bg-background"
                    )}
                  >
                    <p className="text-[13px] font-semibold">{p.label}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{p.badge}</p>
                    {provider === p.value && (
                      <div className="absolute right-2 top-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff543d]">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <Input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  provider === "anthropic" ? "sk-ant-..." :
                  provider === "openai" ? "sk-..." :
                  "AIza..."
                }
                className="h-12 rounded-xl border-border/50 font-mono text-[14px] transition-all focus:border-[#ff543d]/30 focus:ring-4 focus:ring-[#ff543d]/10"
              />

              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Stored encrypted. Skip for now and add later in settings.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-border/50 text-[15px] font-medium hover:bg-background"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button
                  className="h-12 flex-1 rounded-xl bg-gradient-to-b from-[#ff543d] to-[#ff5a47] text-[15px] font-semibold shadow-lg shadow-[#ff543d]/20 transition-all hover:shadow-xl hover:shadow-[#ff543d]/30"
                  onClick={() => setStep(2)}
                >
                  {apiKey ? "Continue" : "Skip"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: First Agent */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight">
                  Create your first agent
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  Give it a name and role. You can add more later.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Agent name (e.g., Jarvis)"
                  className="h-12 rounded-xl border-border/50 text-[15px] transition-all focus:border-[#ff543d]/30 focus:ring-4 focus:ring-[#ff543d]/10"
                  autoFocus
                />
                <Input
                  value={agentRole}
                  onChange={(e) => setAgentRole(e.target.value)}
                  placeholder="Role (e.g., Content Writer)"
                  className="h-12 rounded-xl border-border/50 text-[15px] transition-all focus:border-[#ff543d]/30 focus:ring-4 focus:ring-[#ff543d]/10"
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 p-4">
                  <p className="text-[13px] text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-border/50 text-[15px] font-medium hover:bg-background"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  disabled={loading}
                  className="h-12 flex-1 rounded-xl bg-gradient-to-b from-[#ff543d] to-[#ff5a47] text-[15px] font-semibold shadow-lg shadow-[#ff543d]/20 transition-all hover:shadow-xl hover:shadow-[#ff543d]/30 disabled:opacity-50"
                  onClick={handleComplete}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      Launch
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-[12px] text-muted-foreground/60">
          Press Enter to continue • ESC to go back
        </p>
      </div>
    </div>
  );
}
