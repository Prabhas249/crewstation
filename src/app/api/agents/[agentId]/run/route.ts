import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import WebSocket from "ws";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get workspace + agent
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, gateway_url, gateway_token, anthropic_api_key")
    .eq("user_id", user.id)
    .single();

  if (!workspace) {
    return NextResponse.json({ error: "No workspace" }, { status: 404 });
  }

  if (!workspace.gateway_token) {
    return NextResponse.json(
      {
        error: "OpenClaw Gateway not configured. Please go to Settings and add your gateway token.",
      },
      { status: 400 }
    );
  }

  const { data: agent } = await supabase
    .from("agents")
    .select("*")
    .eq("id", agentId)
    .single();

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  // Get message from body
  const { message } = await req.json();
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  // Update agent status to busy
  await supabase.from("agents").update({ status: "busy" }).eq("id", agent.id);

  // Connect to OpenClaw Gateway
  try {
    const ws = new WebSocket(workspace.gateway_url || "wss://api.clawdirector.com");

    return new Promise<NextResponse>((resolve) => {
      let timeout: NodeJS.Timeout;
      const requestId = `run-${Date.now()}`;

      ws.on("open", () => {
        console.log("[OpenClaw] Connected to gateway");

        // Send connect handshake
        ws.send(
          JSON.stringify({
            type: "req",
            id: "connect-" + Date.now(),
            method: "connect",
            params: {
              minProtocol: 3,
              maxProtocol: 3,
              client: {
                id: "clawdirector",
                version: "1.0.0",
                platform: "web",
                mode: "api",
              },
              auth: {
                token: workspace.gateway_token,
              },
            },
          })
        );

        // After connect, send agent run command
        setTimeout(() => {
          console.log("[OpenClaw] Sending agent.run command");
          ws.send(
            JSON.stringify({
              type: "req",
              id: requestId,
              method: "agent.run",
              params: {
                agentId: agent.id,
                message,
                apiKey: workspace.anthropic_api_key,
                model: agent.model || "claude-sonnet-4-5-20250929",
                systemPrompt: agent.personality,
              },
            })
          );
        }, 500);

        // Timeout after 60 seconds
        timeout = setTimeout(() => {
          ws.close();
          supabase
            .from("agents")
            .update({ status: "idle" })
            .eq("id", agent.id);
          resolve(
            NextResponse.json({ error: "Gateway timeout" }, { status: 504 })
          );
        }, 60000);
      });

      ws.on("message", async (data: Buffer) => {
        try {
          const msg = JSON.parse(data.toString());
          console.log("[OpenClaw] Received:", msg.type, msg.id);

          // Handle agent run response
          if (msg.type === "res" && msg.id === requestId) {
            clearTimeout(timeout);
            ws.close();

            if (msg.ok) {
              // Success - extract response data
              const content = msg.payload?.content || msg.payload?.response || "No response";
              const tokens = msg.payload?.tokens || msg.payload?.usage?.total_tokens || 0;
              const cost = msg.payload?.cost || 0;

              // Update agent stats
              await supabase
                .from("agents")
                .update({
                  status: "idle",
                  tokens_used: (agent.tokens_used || 0) + tokens,
                  cost_total: Number(
                    ((Number(agent.cost_total) || 0) + cost).toFixed(4)
                  ),
                  tasks_completed: (agent.tasks_completed || 0) + 1,
                })
                .eq("id", agent.id);

              // Log activity
              await supabase.from("activities").insert({
                workspace_id: workspace.id,
                type: "agent_run",
                description: `${agent.name} completed task: ${message.substring(0, 50)}...`,
                agent_id: agent.id,
              });

              resolve(
                NextResponse.json({
                  content,
                  tokens,
                  cost,
                  agent_name: agent.name,
                })
              );
            } else {
              // Error from OpenClaw
              await supabase
                .from("agents")
                .update({ status: "idle" })
                .eq("id", agent.id);

              resolve(
                NextResponse.json(
                  {
                    error: msg.error?.message || msg.error || "Gateway error",
                  },
                  { status: 500 }
                )
              );
            }
          }
        } catch (err) {
          console.error("[OpenClaw] Parse error:", err);
        }
      });

      ws.on("error", async (err) => {
        console.error("[OpenClaw] WebSocket error:", err);
        clearTimeout(timeout);
        await supabase.from("agents").update({ status: "idle" }).eq("id", agent.id);
        resolve(
          NextResponse.json(
            { error: "Gateway error: " + err.message },
            { status: 500 }
          )
        );
      });

      ws.on("close", async () => {
        console.log("[OpenClaw] Connection closed");
        await supabase.from("agents").update({ status: "idle" }).eq("id", agent.id);
      });
    });
  } catch (err) {
    await supabase.from("agents").update({ status: "idle" }).eq("id", agent.id);
    return NextResponse.json(
      { error: "Failed to connect: " + (err as Error).message },
      { status: 500 }
    );
  }
}
