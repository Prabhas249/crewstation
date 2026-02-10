"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles,
  Send,
  X,
  ArrowRight,
  Pause,
  FileText,
  Plus,
  BarChart3,
} from "lucide-react";
import { mockAgents, mockStats, PRIYA_ID } from "@/lib/mock-data";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PriyaPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PriyaFABProps {
  onClick: () => void;
}

type MessageRole = "priya" | "user" | "system";

interface Message {
  role: MessageRole;
  content: string;
  time: string;
}

/* ------------------------------------------------------------------ */
/*  Mock conversation                                                  */
/* ------------------------------------------------------------------ */

const messages: Message[] = [
  {
    role: "priya",
    content:
      "Good morning, Prabhas. Your crew is operational \u2014 6 of 8 agents online. I\u2019ve coordinated with the Coder to continue the auth middleware task from yesterday.",
    time: "9:00 AM",
  },
  {
    role: "system",
    content: "\u2192 Delegated to Coder: Complete JWT auth middleware",
    time: "9:01 AM",
  },
  {
    role: "user",
    content: "What\u2019s the status on the competitor analysis?",
    time: "9:05 AM",
  },
  {
    role: "priya",
    content:
      "Researcher completed it 20 minutes ago. Key finding: 78% of competitors charge per-agent pricing. I\u2019ve put together a summary \u2014 want me to delegate to Analyst to create a pricing model based on this?",
    time: "9:05 AM",
  },
  {
    role: "user",
    content:
      "Yes, and have Writer draft a blog post about our pricing philosophy",
    time: "9:06 AM",
  },
  {
    role: "system",
    content:
      "\u2192 Delegated to Analyst: Create pricing model from competitor research",
    time: "9:06 AM",
  },
  {
    role: "system",
    content: "\u2192 Delegated to Writer: Draft pricing philosophy blog post",
    time: "9:06 AM",
  },
  {
    role: "priya",
    content:
      "Done. I\u2019ve assigned both \u2014 Analyst is modeling 3 pricing tiers and Writer will have a draft within the hour. I\u2019ll notify you when both are ready.",
    time: "9:07 AM",
  },
];

/* ------------------------------------------------------------------ */
/*  Quick-action definitions                                           */
/* ------------------------------------------------------------------ */

const quickActions = [
  { label: "Status Report", icon: BarChart3 },
  { label: "Pause All", icon: Pause },
  { label: "Cost Summary", icon: FileText },
  { label: "New Task", icon: Plus },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PriyaAvatar({ size = "sm" }: { size?: "sm" | "md" }) {
  const dims = size === "md" ? "h-8 w-8" : "h-6 w-6";
  const iconSize = size === "md" ? "h-4 w-4" : "h-3 w-3";
  return (
    <div
      className={`${dims} shrink-0 rounded-full bg-[#ff543d]/20 flex items-center justify-center`}
    >
      <Sparkles className={`${iconSize} text-[#ff6b56]`} />
    </div>
  );
}

function PriyaMessage({ content, time }: { content: string; time: string }) {
  return (
    <div className="flex gap-2 items-start max-w-[92%]">
      <PriyaAvatar size="sm" />
      <div className="flex flex-col gap-0.5">
        <div className="bg-muted rounded-lg rounded-tl-sm px-3 py-2.5">
          <p className="text-[12px] leading-relaxed text-foreground/80">{content}</p>
        </div>
        <span className="text-[9px] text-muted-foreground pl-1">{time}</span>
      </div>
    </div>
  );
}

function UserMessage({ content, time }: { content: string; time: string }) {
  return (
    <div className="flex flex-col items-end gap-0.5 max-w-[92%] ml-auto">
      <div className="bg-[#ff543d]/10 rounded-lg rounded-tr-sm px-3 py-2.5">
        <p className="text-[12px] leading-relaxed text-foreground/80">{content}</p>
      </div>
      <span className="text-[9px] text-muted-foreground pr-1">{time}</span>
    </div>
  );
}

function SystemMessage({ content, time }: { content: string; time: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-0.5">
      <div className="flex items-center gap-1.5">
        <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground italic">{content}</p>
      </div>
      <span className="text-[9px] text-muted-foreground">{time}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PriyaPanel                                                         */
/* ------------------------------------------------------------------ */

export function PriyaPanel({ open, onOpenChange }: PriyaPanelProps) {
  const priya = mockAgents.find((a) => a.id === PRIYA_ID);
  const otherAgents = mockAgents.filter((a) => a.id !== PRIYA_ID);
  const onlineCount = otherAgents.filter((a) => a.status === "online" || a.status === "busy").length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[420px] sm:max-w-[420px] border-border bg-background p-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(255,84,61,0.06), transparent)",
        }}
      >
        {/* ---- A11y header (sr-only) ---- */}
        <SheetHeader className="sr-only">
          <SheetTitle>Priya — AI Orchestrator</SheetTitle>
          <SheetDescription>
            Chat with Priya to manage and delegate tasks to your agent crew.
          </SheetDescription>
        </SheetHeader>

        {/* ---- Visible header ---- */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <PriyaAvatar size="md" />
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-foreground">
                Priya
              </span>
              <span className="text-[10px] text-muted-foreground">
                AI Orchestrator · {onlineCount}/{otherAgents.length} agents online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Online indicator */}
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[10px] text-green-400">Online</span>
            </div>

            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ---- Messages area ---- */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-3 px-4 py-4">
            {messages.map((msg, i) => {
              switch (msg.role) {
                case "priya":
                  return (
                    <PriyaMessage
                      key={i}
                      content={msg.content}
                      time={msg.time}
                    />
                  );
                case "user":
                  return (
                    <UserMessage
                      key={i}
                      content={msg.content}
                      time={msg.time}
                    />
                  );
                case "system":
                  return (
                    <SystemMessage
                      key={i}
                      content={msg.content}
                      time={msg.time}
                    />
                  );
              }
            })}
          </div>
        </ScrollArea>

        {/* ---- Quick actions bar ---- */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-t border-border overflow-x-auto">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-1 rounded-full bg-muted border border-border px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap"
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </button>
          ))}
        </div>

        {/* ---- Input area ---- */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask Priya anything..."
              className="flex-1 h-9 bg-muted border-border text-[12px] text-foreground placeholder:text-muted-foreground focus-visible:ring-[#ff543d]/30 focus-visible:border-[#ff543d]/40"
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 bg-[#ff543d] hover:bg-[#e04030] border-0"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
          <p className="text-[9px] text-muted-foreground mt-2 text-center">
            Priya can delegate tasks, manage your crew, and answer questions
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/*  PriyaFAB (Floating Action Button)                                  */
/* ------------------------------------------------------------------ */

export function PriyaFAB({ onClick }: PriyaFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full bg-[#ff543d] shadow-[0_0_24px_rgba(255,84,61,0.4)] hover:shadow-[0_0_32px_rgba(255,84,61,0.6)] hover:scale-105 transition-all flex items-center justify-center core-pulse"
    >
      <Sparkles className="h-5 w-5 text-white" />
    </button>
  );
}
