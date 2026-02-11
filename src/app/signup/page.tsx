"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { APP_NAME } from "@/lib/constants";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Check if email confirmation is required
    if (data?.user && !data.session) {
      // Email confirmation required - show check email message
      setCheckEmail(true);
      setLoading(false);
    } else {
      // Auto-confirmed or instant login - proceed to onboarding
      router.push("/onboarding");
      router.refresh();
    }
  }

  async function handleGoogleSignUp() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-[#ff543d]/5 p-4">
      <div className="w-full max-w-[440px]">
        {/* Single Premium Card */}
        <div className="rounded-3xl border border-border/50 bg-card/80 backdrop-blur-xl p-10 shadow-2xl shadow-black/10">
          {/* Logo + Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff543d] to-[#ff6b56] shadow-lg shadow-[#ff543d]/30">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">ClawDirector</h1>
            <p className="mt-2 text-[13px] text-muted-foreground">
              Direct your AI agent team to production
            </p>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">
                Get Started Free
              </span>
            </div>
          </div>

          {/* Google Button */}
          <Button
            className="h-[52px] w-full bg-white text-[15px] font-semibold text-gray-900 hover:bg-gray-50 shadow-sm border border-gray-200 transition-all hover:shadow-md"
            onClick={handleGoogleSignUp}
          >
            <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Free forever • No credit card • Setup in 30 seconds
          </p>

          {/* Footer */}
          <div className="mt-8 border-t border-border/50 pt-6 text-center">
            <p className="text-[13px] text-muted-foreground">
              Already using ClawDirector?{" "}
              <Link href="/login" className="font-semibold text-[#ff543d] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
