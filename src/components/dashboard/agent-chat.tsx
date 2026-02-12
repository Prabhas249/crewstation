"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "agent";
  content: string;
  tokens?: number;
  cost?: number;
  timestamp: string;
}

interface AgentChatProps {
  agentId: string;
  agentName?: string;
}

export function AgentChat({ agentId, agentName = "Agent" }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setError(null);

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    setLoading(true);

    try {
      const res = await fetch(`/api/agents/${agentId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: data.content,
            tokens: data.tokens,
            cost: data.cost,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setError(data.error || "Failed to get response");
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: `❌ Error: ${data.error}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "❌ Network error. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px]">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-muted/20 rounded-t-xl">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff543d]/10">
              <Sparkles className="h-6 w-6 text-[#ff6b56]" />
            </div>
            <div>
              <p className="font-medium">Start a conversation</p>
              <p className="text-sm text-muted-foreground mt-1">
                Send a message to {agentName} to get started
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-xl p-4 shadow-sm",
                msg.role === "user"
                  ? "bg-[#ff543d] text-white"
                  : "bg-card border border-border"
              )}
            >
              <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              {msg.tokens && (
                <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-3 text-xs opacity-70">
                  <span className="font-mono">{msg.tokens.toLocaleString()} tokens</span>
                  <span>·</span>
                  <span className="font-mono">${msg.cost?.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#ff6b56]" />
                <span className="text-sm text-muted-foreground">
                  {agentName} is thinking...
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="border-t border-border bg-card rounded-b-xl p-4">
        {error && (
          <div className="mb-3 p-2 rounded-lg bg-red-500/10 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${agentName}...`}
            disabled={loading}
            className="flex-1 h-12 text-[14px]"
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="h-12 px-6 bg-gradient-to-b from-[#ff543d] to-[#ff5a47] hover:opacity-90 shadow-lg shadow-[#ff543d]/20"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="mt-2 text-xs text-muted-foreground text-center">
          Powered by OpenClaw · Press Enter to send
        </p>
      </div>
    </div>
  );
}
