/**
 * POST /api/sprites/provision
 * Creates a new Sprite VM for a user after onboarding
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createUserSprite,
  cloneFromCheckpoint,
} from "@/lib/sprites/client";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's workspace
    const { data: workspace, error: wsError } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Check if Sprite already exists
    const { data: existingSprite } = await supabase
      .from("user_sprites")
      .select("*")
      .eq("workspace_id", workspace.id)
      .single();

    if (existingSprite) {
      return NextResponse.json(
        {
          message: "Sprite already exists",
          sprite: existingSprite,
        },
        { status: 200 }
      );
    }

    // Check for template checkpoint
    const OPENCLAW_TEMPLATE_NAME = process.env.OPENCLAW_TEMPLATE_NAME;
    const OPENCLAW_CHECKPOINT_ID = process.env.OPENCLAW_CHECKPOINT_ID;

    let spriteInfo;

    if (OPENCLAW_TEMPLATE_NAME && OPENCLAW_CHECKPOINT_ID) {
      // Clone from checkpoint (fast - 1 second)
      spriteInfo = await cloneFromCheckpoint(
        OPENCLAW_TEMPLATE_NAME,
        OPENCLAW_CHECKPOINT_ID,
        {
          userId: user.id,
          workspaceId: workspace.id,
          ramMB: 4096,
          storageGB: 10,
        }
      );
    } else {
      // Create from scratch (slow - 15 minutes)
      spriteInfo = await createUserSprite({
        userId: user.id,
        workspaceId: workspace.id,
        ramMB: 4096,
        storageGB: 10,
      });
    }

    // Store Sprite info in database
    const { data: userSprite, error: insertError } = await supabase
      .from("user_sprites")
      .insert({
        user_id: user.id,
        workspace_id: workspace.id,
        sprite_name: spriteInfo.spriteName,
        sprite_id: spriteInfo.spriteId,
        gateway_url: spriteInfo.gatewayUrl,
        gateway_token: spriteInfo.gatewayToken,
        status: spriteInfo.status,
        ram_mb: 4096,
        storage_gb: 10,
        last_active: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to save Sprite to database:", insertError);
      return NextResponse.json(
        { error: "Failed to save Sprite" },
        { status: 500 }
      );
    }

    // Create activity log
    await supabase.from("activities").insert({
      workspace_id: workspace.id,
      type: "sprite_created",
      description: `Sprite VM provisioned: ${spriteInfo.spriteName}`,
    });

    return NextResponse.json(
      {
        message: "Sprite provisioned successfully",
        sprite: userSprite,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sprite provisioning error:", error);
    return NextResponse.json(
      {
        error: "Failed to provision Sprite",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
