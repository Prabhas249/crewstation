// ── Database row types ───────────────────────────────────────────────

export interface Workspace {
  id: string;
  user_id: string;
  name: string;
  anthropic_api_key: string | null;
  gateway_url: string | null;
  gateway_token: string | null;
  plan: "free" | "pro" | "agency";
  max_agents: number;
  max_tasks_per_day: number;
  created_at: string;
}

export interface Agent {
  id: string;
  workspace_id: string;
  name: string;
  role: string;
  personality: string;
  model: string;
  status: "idle" | "busy" | "offline" | "error";
  session_key: string | null;
  avatar: string | null;
  tokens_used: number;
  cost_total: number;
  tasks_completed: number;
  created_at: string;
}

export interface Task {
  id: string;
  workspace_id: string;
  title: string;
  description: string;
  status: "inbox" | "assigned" | "in_progress" | "review" | "done" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  assigned_agent_id: string | null;
  tokens_used: number;
  cost: number;
  created_at: string;
  completed_at: string | null;
}

export interface Message {
  id: string;
  task_id: string;
  agent_id: string | null;
  content: string;
  role: "user" | "agent";
  tokens_used: number;
  created_at: string;
}

export interface Activity {
  id: string;
  workspace_id: string;
  type:
    | "task_created"
    | "task_completed"
    | "task_failed"
    | "agent_run"
    | "agent_started"
    | "agent_offline"
    | "message_sent"
    | "error";
  description: string;
  agent_id: string | null;
  created_at: string;
}
