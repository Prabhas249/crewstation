export const APP_NAME = "CrewStation";
export const APP_DESCRIPTION = "AI Agent Orchestration Dashboard";

export type AgentStatus = "online" | "busy" | "idle" | "offline" | "error";
export type TaskStatus = "pending" | "in_progress" | "completed" | "failed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type MeetingStatus = "scheduled" | "in_progress" | "completed";

export const AGENT_STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; dotColor: string }> = {
  online: { label: "Online", color: "text-emerald-400", dotColor: "bg-emerald-400" },
  busy: { label: "Busy", color: "text-amber-400", dotColor: "bg-amber-400" },
  idle: { label: "Idle", color: "text-blue-400", dotColor: "bg-blue-400" },
  offline: { label: "Offline", color: "text-muted-foreground", dotColor: "bg-muted-foreground" },
  error: { label: "Error", color: "text-red-400", dotColor: "bg-red-400" },
};

export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-muted-foreground", bg: "bg-muted" },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10" },
  completed: { label: "Completed", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  failed: { label: "Failed", color: "text-red-400", bg: "bg-red-400/10" },
  cancelled: { label: "Cancelled", color: "text-muted-foreground", bg: "bg-muted" },
};

export const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "text-muted-foreground" },
  medium: { label: "Medium", color: "text-blue-400" },
  high: { label: "High", color: "text-amber-400" },
  critical: { label: "Critical", color: "text-red-400" },
};

export type ActivityType = "task_completed" | "agent_started" | "meeting_started" | "workflow_run" | "message" | "error" | "delegation";

export const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Agents", href: "/dashboard/agents", icon: "Bot" },
  { label: "Tasks", href: "/dashboard/tasks", icon: "ListChecks" },
  { label: "Conversations", href: "/dashboard/conversations", icon: "MessageSquare" },
  { label: "Meetings", href: "/dashboard/meetings", icon: "Users" },
  { label: "Workflows", href: "/dashboard/workflows", icon: "GitBranch" },
  { label: "Costs", href: "/dashboard/costs", icon: "DollarSign" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;
