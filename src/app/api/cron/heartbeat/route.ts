/**
 * GET /api/cron/heartbeat
 * Cron job that wakes up all active Sprites every 15 minutes
 * Mission Control pattern: wake → check tasks → work 2 min → sleep
 *
 * Deploy this with Vercel Cron or similar service:
 * vercel.json: { "crons": [{ "path": "/api/cron/heartbeat", "schedule": "*/15 * * * *" }] }
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSpriteHeartbeat, getSpriteStatus } from "@/lib/sprites/client";

// Use service role key for cron jobs (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // Verify cron authorization
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active Sprites (not deleted)
    const { data: sprites, error } = await supabase
      .from("user_sprites")
      .select("*")
      .neq("status", "deleted")
      .order("last_heartbeat", { ascending: true, nullsFirst: true });

    if (error) {
      console.error("Failed to fetch sprites:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!sprites || sprites.length === 0) {
      return NextResponse.json({
        message: "No sprites to wake",
        processed: 0,
      });
    }

    const results = await Promise.allSettled(
      sprites.map(async (sprite) => {
        try {
          // Send heartbeat to wake Sprite (simple echo command)
          await sendSpriteHeartbeat(sprite.sprite_name);

          // Get updated status
          const status = await getSpriteStatus(sprite.sprite_name);

          // Update database
          await supabase
            .from("user_sprites")
            .update({
              status: status.status,
              last_heartbeat: new Date().toISOString(),
              last_active: new Date().toISOString(),
              // Increment runtime by 2 minutes (heartbeat duration)
              total_runtime_minutes: (sprite.total_runtime_minutes || 0) + 2,
              // Calculate cost: 2 min * $0.18/hour / 60 min = $0.006
              total_cost_usd: ((sprite.total_cost_usd || 0) + (2 * 0.18 / 60)).toFixed(4),
            })
            .eq("id", sprite.id);

          return {
            spriteName: sprite.sprite_name,
            status: "success",
          };
        } catch (error) {
          console.error(
            `Failed to heartbeat sprite ${sprite.sprite_name}:`,
            error
          );

          // Mark as error in database
          await supabase
            .from("user_sprites")
            .update({
              status: "error",
            })
            .eq("id", sprite.id);

          return {
            spriteName: sprite.sprite_name,
            status: "error",
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      message: "Heartbeat completed",
      total: sprites.length,
      successful,
      failed,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Heartbeat cron error:", error);
    return NextResponse.json(
      {
        error: "Heartbeat failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
