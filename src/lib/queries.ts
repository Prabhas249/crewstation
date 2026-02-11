import { createClient } from "@/lib/supabase/server";

// ── Get current user's workspace ─────────────────────────────────────

export async function getWorkspace() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

// ── Agents ───────────────────────────────────────────────────────────

export async function getAgents(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("agents")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function getAgent(agentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("agents")
    .select("*")
    .eq("id", agentId)
    .single();

  return data;
}

// ── Tasks ────────────────────────────────────────────────────────────

export async function getTasks(workspaceId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*, agents(name, avatar)")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getTask(taskId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*, agents(name, avatar), messages(*)")
    .eq("id", taskId)
    .single();

  return data;
}

// ── Activities ───────────────────────────────────────────────────────

export async function getActivities(workspaceId: string, limit = 20) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

// ── Messages ─────────────────────────────────────────────────────────

export async function getMessages(taskId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*, agents(name, avatar)")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

// ── Stats ────────────────────────────────────────────────────────────

export async function getWorkspaceStats(workspaceId: string) {
  const supabase = await createClient();

  const [agents, tasks, activities] = await Promise.all([
    supabase
      .from("agents")
      .select("id, status, tokens_used, cost_total, tasks_completed")
      .eq("workspace_id", workspaceId),
    supabase
      .from("tasks")
      .select("id, status, cost, tokens_used")
      .eq("workspace_id", workspaceId),
    supabase
      .from("activities")
      .select("id")
      .eq("workspace_id", workspaceId)
      .gte("created_at", new Date(Date.now() - 86_400_000).toISOString()),
  ]);

  const agentList = agents.data ?? [];
  const taskList = tasks.data ?? [];

  return {
    totalAgents: agentList.length,
    activeAgents: agentList.filter(
      (a) => a.status === "online" || a.status === "busy"
    ).length,
    totalTasks: taskList.length,
    activeTasks: taskList.filter((t) => t.status === "in_progress").length,
    completedTasks: taskList.filter((t) => t.status === "done").length,
    totalTokens: agentList.reduce((sum, a) => sum + (a.tokens_used || 0), 0),
    totalCost: agentList.reduce(
      (sum, a) => sum + Number(a.cost_total || 0),
      0
    ),
    activitiesToday: activities.data?.length ?? 0,
  };
}
