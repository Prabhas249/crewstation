"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Bot, Sparkles } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { mockConversations, mockConversationMessages, mockMessages } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ConversationDetailPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const conversation = mockConversations.find((c) => c.id === conversationId);

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Bot className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-[14px] text-muted-foreground">Conversation not found</p>
        <Link href="/dashboard/conversations" className="mt-2 text-[13px] text-[#ff6b56] hover:underline">
          Back to conversations
        </Link>
      </div>
    );
  }

  const agentColors: Record<string, string> = {
    Priya: "bg-[#ff543d]/15 text-[#ff6b56]",
    PM: "bg-[#ff543d]/15 text-[#ff6b56]",
    Coder: "bg-emerald-500/15 text-emerald-400",
    Researcher: "bg-amber-500/15 text-amber-400",
    Analyst: "bg-cyan-500/15 text-cyan-400",
    "QA Tester": "bg-purple-500/15 text-purple-400",
    Designer: "bg-pink-500/15 text-pink-400",
    Writer: "bg-orange-500/15 text-orange-400",
    DevOps: "bg-red-500/15 text-red-400",
  };

  return (
    <div className="flex h-screen flex-col">
      <TopBar title={conversation.title} description={`${conversation.participants.join(", ")}`} />

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col">
          {/* Back link */}
          <div className="border-b border-border px-6 py-2">
            <Link
              href="/dashboard/conversations"
              className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Conversations
            </Link>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            {(mockConversationMessages[conversationId] || mockMessages).map((msg) => {
              const colorClass = agentColors[msg.agentName] || "bg-muted text-muted-foreground";
              return (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold", colorClass)}>
                    {msg.agentName === "Priya" ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      msg.agentName[0]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold">{msg.agentName}</span>
                      <span className="text-[11px] text-muted-foreground">{msg.timestamp}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {msg.tokensUsed.toLocaleString()} tok
                      </span>
                    </div>
                    <div className="mt-1 rounded-lg bg-muted px-3 py-2.5 text-[13px] leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Send a message to the conversation..."
                className="h-10 bg-muted text-[13px]"
              />
              <Button size="icon" className="h-10 w-10 shrink-0 bg-[#ff543d] hover:bg-[#e04030]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
