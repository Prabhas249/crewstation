import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/chat — send a message to an agent and get a response
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  const body = await req.json();
  const { agent_id, message, task_id } = body;

  if (!agent_id || !message) {
    return NextResponse.json({ error: "agent_id and message are required" }, { status: 400 });
  }

  // Get agent
  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", agent_id)
    .single();

  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  // If there's a task_id, get conversation history
  let history: { role: "user" | "assistant"; content: string }[] = [];
  if (task_id) {
    const { data: prevMessages } = await supabase
      .from("messages")
      .select("content, role")
      .eq("task_id", task_id)
      .order("created_at", { ascending: true })
      .limit(20);

    history = (prevMessages ?? []).map((m) => ({
      role: m.role === "agent" ? "assistant" as const : "user" as const,
      content: m.content,
    }));
  }

  // Update agent to busy
  await supabase.from("agents").update({ status: "busy" }).eq("id", agent_id);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": workspace.anthropic_api_key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: agent.model || "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        system: agent.personality,
        messages: [...history, { role: "user", content: message }],
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

    const inputCost = ((result.usage?.input_tokens || 0) / 1_000_000) * 3;
    const outputCost = ((result.usage?.output_tokens || 0) / 1_000_000) * 15;
    const cost = parseFloat((inputCost + outputCost).toFixed(4));

    // Save messages if task_id provided
    if (task_id) {
      await supabase.from("messages").insert([
        {
          task_id,
          agent_id: null,
          content: message,
          role: "user",
          tokens_used: 0,
        },
        {
          task_id,
          agent_id: agent.id,
          content: assistantContent,
          role: "agent",
          tokens_used: tokensUsed,
        },
      ]);
    }

    // Update agent stats
    await supabase
      .from("agents")
      .update({
        status: "idle",
        tokens_used: (agent.tokens_used || 0) + tokensUsed,
        cost_total: parseFloat(
          ((Number(agent.cost_total) || 0) + cost).toFixed(4)
        ),
      })
      .eq("id", agent_id);

    return NextResponse.json({
      content: assistantContent,
      tokens_used: tokensUsed,
      cost,
      agent_name: agent.name,
    });
  } catch (err) {
    await supabase.from("agents").update({ status: "idle" }).eq("id", agent_id);

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Chat failed" },
      { status: 500 }
    );
  }
}
