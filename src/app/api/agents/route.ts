import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/agents — list agents for current workspace
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

  const { data: agents, error } = await supabase
    .from("agents")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(agents);
}

// POST /api/agents — create a new agent
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, max_agents")
    .eq("user_id", user.id)
    .single();

  if (!workspace) return NextResponse.json({ error: "No workspace" }, { status: 404 });

  // Check agent limit
  const { count } = await supabase
    .from("agents")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspace.id);

  if ((count ?? 0) >= workspace.max_agents) {
    return NextResponse.json(
      { error: `Agent limit reached (${workspace.max_agents}). Upgrade your plan.` },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { name, role, personality, model } = body;

  if (!name || !role) {
    return NextResponse.json({ error: "Name and role are required" }, { status: 400 });
  }

  const { data: agent, error } = await supabase
    .from("agents")
    .insert({
      workspace_id: workspace.id,
      name,
      role,
      personality: personality || `You are ${name}, a ${role}. You are helpful and proactive.`,
      model: model || "claude-sonnet-4-5-20250929",
      avatar: name.charAt(0).toUpperCase(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log activity
  await supabase.from("activities").insert({
    workspace_id: workspace.id,
    type: "agent_started",
    description: `${name} joined the crew as ${role}`,
    agent_id: agent.id,
  });

  return NextResponse.json(agent, { status: 201 });
}
