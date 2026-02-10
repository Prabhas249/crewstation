"use client";

import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { mockConversations } from "@/lib/mock-data";
import { MessageSquare, Users } from "lucide-react";

export default function ConversationsPage() {
  return (
    <div className="flex flex-col">
      <TopBar
        title="Conversations"
        description={`${mockConversations.length} agent conversations`}
        action={{ label: "New Chat" }}
      />

      <div className="p-5">
        <div className="space-y-3">
          {mockConversations.map((conv) => (
            <Link
              key={conv.id}
              href={`/dashboard/conversations/${conv.id}`}
              className="block glass rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/15">
                    <MessageSquare className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-semibold">{conv.title}</h3>
                      {conv.status === "active" && (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 live-dot" />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-[12px] text-muted-foreground">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {conv.lastMessageAt}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {conv.participants.join(", ")}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  {conv.messageCount} messages
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
