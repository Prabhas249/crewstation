import Link from "next/link";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[#ff543d]/[0.02]">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff543d] to-[#ff6b56] shadow-lg shadow-[#ff543d]/20">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-[17px] font-semibold tracking-tight">ClawDirector</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#ff543d] to-[#ff6b56] shadow-2xl shadow-[#ff543d]/30">
            <Zap className="h-10 w-10 text-white" />
          </div>
        </div>

        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Direct your AI agents
          <br />
          <span className="bg-gradient-to-r from-[#ff543d] to-[#ff6b56] bg-clip-text text-transparent">
            to production
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground">
          Create, coach, and orchestrate AI agents. Built on OpenClaw.
          <br />
          Bring your own API key. Deploy in 30 seconds.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/auth">
            <Button className="h-14 px-8 text-[15px] font-semibold bg-gradient-to-b from-[#ff543d] to-[#ff5a47] hover:opacity-95 shadow-xl shadow-[#ff543d]/30 transition-all duration-200 hover:shadow-2xl hover:shadow-[#ff543d]/40 hover:scale-[1.02]">
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Get Started Free
            </Button>
          </Link>
        </div>

        <p className="mt-5 text-[13px] text-muted-foreground/70">
          Free forever • No credit card • Claude, GPT-4, or Gemini
        </p>

        {/* Features */}
        <div className="mx-auto mt-24 grid max-w-3xl gap-5 sm:grid-cols-3">
          {[
            {
              icon: <Zap className="h-5 w-5 text-[#ff6b56]" />,
              title: "Deploy in seconds",
              desc: "Sign in with Google and start directing agents immediately"
            },
            {
              icon: <CheckCircle2 className="h-5 w-5 text-[#ff6b56]" />,
              title: "Bring your own key",
              desc: "Use your Anthropic, OpenAI, or Google API key"
            },
            {
              icon: <ArrowRight className="h-5 w-5 text-[#ff6b56]" />,
              title: "Built on OpenClaw",
              desc: "Powerful agent orchestration under the hood"
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-[20px] border border-border/50 bg-card/50 p-6 text-left backdrop-blur-sm transition-all duration-200 hover:border-border hover:bg-card/80 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff543d]/10">
                {feature.icon}
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight">{feature.title}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground/80">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto max-w-6xl px-6 text-center text-[13px] text-muted-foreground/70">
          <p>Built with OpenClaw • Powered by Claude, GPT-4, and Gemini</p>
        </div>
      </footer>
    </div>
  );
}
