/**
 * GET /api/sprites/[spriteId]/status
 * Gets current status for a Sprite VM
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSpriteStatus } from "@/lib/sprites/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ spriteId: string }> }
) {
  try {
    const { spriteId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get sprite from database
    const { data: sprite, error } = await supabase
      .from("user_sprites")
      .select("*")
      .eq("sprite_name", spriteId)
      .eq("user_id", user.id)
      .single();

    if (error || !sprite) {
      return NextResponse.json({ error: "Sprite not found" }, { status: 404 });
    }

    // Get real-time status from Sprites API
    const status = await getSpriteStatus(sprite.sprite_name);

    // Update database with latest status
    await supabase
      .from("user_sprites")
      .update({
        status: status.status,
        last_active: new Date().toISOString(),
      })
      .eq("sprite_name", sprite.sprite_name);

    return NextResponse.json({
      spriteName: sprite.sprite_name,
      status: status.status,
      createdAt: status.createdAt,
      updatedAt: status.updatedAt,
      gatewayUrl: sprite.gateway_url,
      ramMB: sprite.ram_mb,
    });
  } catch (error) {
    console.error("Failed to get Sprite status:", error);
    return NextResponse.json(
      {
        error: "Failed to get Sprite status",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
