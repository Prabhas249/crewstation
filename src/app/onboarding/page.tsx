"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, Key, Bot, ArrowRight, Loader2, Check, ExternalLink, Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["Workspace", "API Key", "Agent"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  // Get user name for personalized placeholder
  useEffect(() => {
    async function getUserName() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        const firstName = user.user_metadata.full_name.split(" ")[0];
        setUserName(firstName);
      }
    }
    getUserName();
  }, []);

  // Step 1: Workspace
  const [workspaceName, setWorkspaceName] = useState("");

  // Step 2: API Key
  const [provider, setProvider] = useState<"anthropic" | "openai" | "gemini">("anthropic");
  const [apiKey, setApiKey] = useState("");

  // Step 3: First Agent
  const [agentName, setAgentName] = useState("");
  const [agentRole, setAgentRole] = useState("");

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (loading) return;

      if (e.key === "Escape") {
        e.preventDefault();
        if (step > 0) {
          setStep(step - 1);
        } else {
          router.push("/");
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (step < 2) {
          setStep(step + 1);
        } else if (step === 2) {
          handleComplete();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, loading, router]);

  async function handleComplete() {
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // Dev mode: use a fixed dev UUID
      const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
      const DEV_USER_UUID = "00000000-0000-0000-0000-000000000001";
      const userId = user?.id || (isLocalhost ? DEV_USER_UUID : null);

      if (!userId) throw new Error("Not authenticated");

      // Create workspace
      const keyField =
        provider === "anthropic" ? "anthropic_api_key" :
        provider === "openai" ? "openai_api_key" :
        "gemini_api_key";

      const { data: workspace, error: wsError } = await supabase
        .from("workspaces")
        .insert({
          user_id: userId,
          name: workspaceName || "My Workspace",
          [keyField]: apiKey || null,
        })
        .select()
        .single();

      if (wsError) {
        console.error("Workspace error:", wsError);
        throw new Error(wsError.message || "Failed to create workspace");
      }

      // Create first agent
      if (agentName && workspace) {
        const { error: agentError } = await supabase.from("agents").insert({
          workspace_id: workspace.id,
          name: agentName,
          role: agentRole || "General Assistant",
          personality: `You are ${agentName}, a ${agentRole || "general assistant"}. You are helpful, thorough, and proactive.`,
          avatar: agentName.charAt(0).toUpperCase(),
        });
        if (agentError) {
          console.error("Agent error:", agentError);
          throw new Error(agentError.message || "Failed to create agent");
        }

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
      console.error("Onboarding error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-[#ff543d]/[0.02] p-4 sm:p-6">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#ff543d] to-[#ff6b56] shadow-xl shadow-[#ff543d]/20">
            <Zap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
            Welcome!
          </h1>
          <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
            Let's set up your AI command center
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span>{STEPS[step]}</span>
            <span>{step + 1} of {STEPS.length}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
            <motion.div
              className="h-full bg-gradient-to-r from-[#ff543d] to-[#ff6b56] shadow-sm"
              initial={{ width: "0%" }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="rounded-[24px] border border-border/50 bg-card/80 p-8 shadow-2xl shadow-black/[0.03] backdrop-blur-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Workspace */}
            {step === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-5"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-[17px] font-semibold tracking-tight">
                    Name your workspace
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    Your AI command center starts here
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      placeholder={userName ? `${userName}'s AI Lab` : "Priya's AI Lab"}
                      className="h-14 rounded-xl border-border/50 pl-12 text-[15px] placeholder:text-muted-foreground/40 transition-all focus:border-[#ff543d]/30 focus:ring-4 focus:ring-[#ff543d]/10"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground/60">
                    You can change this later
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    className="h-12 w-full rounded-xl bg-gradient-to-b from-[#ff543d] to-[#ff5a47] text-[15px] font-semibold text-white shadow-lg shadow-[#ff543d]/20 transition-all hover:shadow-xl hover:shadow-[#ff543d]/30 active:scale-[0.98]"
                    onClick={() => setStep(1)}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <button
                    onClick={async () => {
                      await handleComplete();
                    }}
                    className="mt-4 w-full text-center text-[12px] text-muted-foreground/30 transition-colors hover:text-muted-foreground/50"
                  >
                    Skip to Dashboard
                  </button>
                </motion.div>
              </motion.div>
            )}

          {/* Step 2: API Key */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-[17px] font-semibold tracking-tight">
                  Connect your AI provider
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  We'll use this to power your agents
                </p>
              </motion.div>

              {/* Provider cards */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-3"
              >
                {[
                  {
                    value: "anthropic",
                    label: "Claude",
                    badge: "Most Capable",
                    logo: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128"
                  },
                  {
                    value: "openai",
                    label: "OpenAI",
                    badge: "Most Popular",
                    logo: "https://www.google.com/s2/favicons?domain=openai.com&sz=128"
                  },
                  {
                    value: "gemini",
                    label: "Gemini",
                    badge: "Most Creative",
                    logo: "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128"
                  }
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
                    <div className="flex flex-col items-center">
                      <img src={p.logo} alt={p.label} className="h-8 w-8 mb-1.5 rounded-lg object-contain" />
                      <p className="text-[15px] font-semibold">{p.label}</p>
                      <p className="mt-1.5 text-[11px] text-muted-foreground/70">{p.badge}</p>
                    </div>
                    {provider === p.value && (
                      <div className="absolute right-2 top-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff543d]">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder={
                        provider === "anthropic" ? "Paste your Claude API key" :
                        provider === "openai" ? "Paste your OpenAI API key" :
                        "Paste your Gemini API key"
                      }
                      className="h-12 rounded-xl border-border/50 pl-12 text-[14px] placeholder:text-muted-foreground/40 transition-all focus:border-[#ff543d]/30 focus:ring-4 focus:ring-[#ff543d]/10"
                    />
                  </div>

                  {/* Inline help link */}
                  <p className="text-[11px] text-muted-foreground/70">
                    Don't have a key?{" "}
                    {provider === "anthropic" && (
                      <a
                        href="https://console.anthropic.com/settings/keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#ff543d] underline decoration-[#ff543d]/30 underline-offset-2 hover:text-[#ff6b56] hover:decoration-[#ff6b56]/50 transition-colors"
                      >
                        Get one from Anthropic
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {provider === "openai" && (
                      <a
                        href="https://platform.openai.com/api-keys"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#ff543d] underline decoration-[#ff543d]/30 underline-offset-2 hover:text-[#ff6b56] hover:decoration-[#ff6b56]/50 transition-colors"
                      >
                        Get one from OpenAI
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {provider === "gemini" && (
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-[#ff543d] underline decoration-[#ff543d]/30 underline-offset-2 hover:text-[#ff6b56] hover:decoration-[#ff6b56]/50 transition-colors"
                      >
                        Get one from Google
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </p>
                </div>

                <p className="text-[11px] text-center text-muted-foreground/60">
                  You can change this later in Settings
                </p>

                {/* Security badge - subtle green pill */}
                <div className="flex items-center justify-center gap-2 rounded-full bg-emerald-500/5 px-3 py-1.5">
                  <Lock className="h-3 w-3 text-emerald-600/70 dark:text-emerald-400/70" />
                  <p className="text-[11px] font-medium text-emerald-600/80 dark:text-emerald-400/80">
                    Stored encrypted • Never shared
                  </p>
                </div>
              </motion.div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-12 flex-1 rounded-xl border-border/50 text-[15px] font-medium hover:bg-background"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button
                  className="h-12 flex-1 rounded-xl bg-gradient-to-b from-[#ff543d] to-[#ff5a47] text-[15px] font-semibold text-white shadow-lg shadow-[#ff543d]/20 transition-all hover:shadow-xl hover:shadow-[#ff543d]/30 active:scale-[0.98]"
                  onClick={() => setStep(2)}
                >
                  {apiKey ? "Continue" : "Skip"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: First Agent */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-5"
            >
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
                  className="h-12 flex-1 rounded-xl bg-gradient-to-b from-[#ff543d] to-[#ff5a47] text-[15px] font-semibold text-white shadow-lg shadow-[#ff543d]/20 transition-all hover:shadow-xl hover:shadow-[#ff543d]/30 active:scale-[0.98] disabled:opacity-50"
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
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
