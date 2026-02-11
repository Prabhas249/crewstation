import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/tasks/[taskId]/run — execute a task with Claude
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get workspace with API key
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, anthropic_api_key")
    .eq("user_id", user.id)
    .single();

  if (!workspace) return NextResponse.json({ error: "No workspace" }, { status: 404 });
  if (!workspace.anthropic_api_key) {
    return NextResponse.json(
      { error: "No Anthropic API key. Add one in Settings." },
      { status: 400 }
    );
  }

  // Get task + assigned agent
  const { data: task } = await supabase
    .from("tasks")
    .select("*, agents(*)")
    .eq("id", taskId)
    .single();

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });
  if (!task.assigned_agent_id) {
    return NextResponse.json({ error: "No agent assigned to this task" }, { status: 400 });
  }

  const agent = task.agents;

  // Update task status to in_progress
  await supabase
    .from("tasks")
    .update({ status: "in_progress" })
    .eq("id", taskId);

  // Update agent status to busy
  await supabase
    .from("agents")
    .update({ status: "busy" })
    .eq("id", agent.id);

  // Log activity
  await supabase.from("activities").insert({
    workspace_id: workspace.id,
    type: "agent_run",
    description: `${agent.name} started working on: ${task.title}`,
    agent_id: agent.id,
  });

  try {
    // Get previous messages for context
    const { data: prevMessages } = await supabase
      .from("messages")
      .select("content, role")
      .eq("task_id", taskId)
      .order("created_at", { ascending: true });

    // Build messages for Claude API
    const messages = [
      ...(prevMessages ?? []).map((m) => ({
        role: m.role === "agent" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
      {
        role: "user" as const,
        content: req.headers.get("x-user-message") || task.description || task.title,
      },
    ];

    // Call Claude API (BYOK — user's API key)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": workspace.anthropic_api_key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: agent.model || "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        system: agent.personality,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Claude API error");
    }

    const result = await response.json();
    const assistantContent =
      result.content?.[0]?.text || "No response generated.";
    const tokensUsed =
      (result.usage?.input_tokens || 0) + (result.usage?.output_tokens || 0);

    // Estimate cost (Sonnet: $3/M input, $15/M output)
    const inputCost = ((result.usage?.input_tokens || 0) / 1_000_000) * 3;
    const outputCost = ((result.usage?.output_tokens || 0) / 1_000_000) * 15;
    const cost = parseFloat((inputCost + outputCost).toFixed(4));

    // Save user message
    if (req.headers.get("x-user-message")) {
      await supabase.from("messages").insert({
        task_id: taskId,
        agent_id: null,
        content: req.headers.get("x-user-message")!,
        role: "user",
        tokens_used: 0,
      });
    }

    // Save agent response
    await supabase.from("messages").insert({
      task_id: taskId,
      agent_id: agent.id,
      content: assistantContent,
      role: "agent",
      tokens_used: tokensUsed,
    });

    // Update task tokens + cost
    await supabase
      .from("tasks")
      .update({
        status: "done",
        tokens_used: (task.tokens_used || 0) + tokensUsed,
        cost: parseFloat(((Number(task.cost) || 0) + cost).toFixed(4)),
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    // Update agent stats
    await supabase
      .from("agents")
      .update({
        status: "idle",
        tokens_used: (agent.tokens_used || 0) + tokensUsed,
        cost_total: parseFloat(
          ((Number(agent.cost_total) || 0) + cost).toFixed(4)
        ),
        tasks_completed: (agent.tasks_completed || 0) + 1,
      })
      .eq("id", agent.id);

    // Log completion
    await supabase.from("activities").insert({
      workspace_id: workspace.id,
      type: "task_completed",
      description: `${agent.name} completed: ${task.title}`,
      agent_id: agent.id,
    });

    return NextResponse.json({
      content: assistantContent,
      tokens_used: tokensUsed,
      cost,
    });
  } catch (err) {
    // Reset statuses on error
    await supabase
      .from("tasks")
      .update({ status: "failed" })
      .eq("id", taskId);
    await supabase
      .from("agents")
      .update({ status: "error" })
      .eq("id", agent.id);

    // Log error
    await supabase.from("activities").insert({
      workspace_id: workspace.id,
      type: "error",
      description: `${agent.name} failed on: ${task.title} — ${err instanceof Error ? err.message : "Unknown error"}`,
      agent_id: agent.id,
    });

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Execution failed" },
      { status: 500 }
    );
  }
}
