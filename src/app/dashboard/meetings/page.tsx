"use client";

import { TopBar } from "@/components/layout/top-bar";
import { mockMeetings } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Users, Clock, Calendar, CheckCircle2, PlayCircle } from "lucide-react";

const statusConfig = {
  scheduled: { label: "Scheduled", color: "text-blue-400", bg: "bg-blue-400/10", icon: Calendar },
  in_progress: { label: "In Progress", color: "text-amber-400", bg: "bg-amber-400/10", icon: PlayCircle },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2 },
};

export default function MeetingsPage() {
  return (
    <div className="flex flex-col">
      <TopBar
        title="Meetings"
        description="Agent-to-agent collaboration sessions"
        action={{ label: "Schedule Meeting" }}
      />

      <div className="p-5 space-y-4">
        {mockMeetings.map((meeting) => {
          const status = statusConfig[meeting.status];
          const StatusIcon = status.icon;
          return (
            <div
              key={meeting.id}
              className="glass-panel rounded-xl p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", status.bg)}>
                    <StatusIcon className={cn("h-5 w-5", status.color)} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold">{meeting.title}</h3>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{meeting.description}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {meeting.scheduledAt}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {meeting.duration}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {meeting.participants.length} agents
                      </div>
                    </div>
                  </div>
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", status.bg, status.color)}>
                  {status.label}
                </span>
              </div>

              {/* Participants */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {meeting.participants.map((p) => (
                  <span key={p} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium">
                    {p}
                  </span>
                ))}
              </div>

              {/* Summary + decisions for completed meetings */}
              {meeting.summary && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3 border border-border">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Summary</p>
                  <p className="mt-1 text-[12px] leading-relaxed">{meeting.summary}</p>

                  {meeting.decisions && meeting.decisions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Decisions</p>
                      <ul className="mt-1 space-y-1">
                        {meeting.decisions.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-[12px]">
                            <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
