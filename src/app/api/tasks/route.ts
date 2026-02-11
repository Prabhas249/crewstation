import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/tasks — list tasks for current workspace
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!workspace) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*, agents(id, name, avatar)")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(tasks);
}

// POST /api/tasks — create a new task
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, max_tasks_per_day")
    .eq("user_id", user.id)
    .single();

  if (!workspace) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  // Check daily task limit
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspace.id)
    .gte("created_at", todayStart.toISOString());

  if ((count ?? 0) >= workspace.max_tasks_per_day) {
    return NextResponse.json(
      { error: `Daily task limit reached (${workspace.max_tasks_per_day}). Upgrade your plan.` },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { title, description, priority, assigned_agent_id } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      workspace_id: workspace.id,
      title,
      description: description || "",
      priority: priority || "medium",
      assigned_agent_id: assigned_agent_id || null,
      status: assigned_agent_id ? "assigned" : "inbox",
    })
    .select("*, agents(id, name, avatar)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log activity
  await supabase.from("activities").insert({
    workspace_id: workspace.id,
    type: "task_created",
    description: `Task created: ${title}`,
    agent_id: assigned_agent_id || null,
  });

  return NextResponse.json(task, { status: 201 });
}
