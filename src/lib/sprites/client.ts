/**
 * Sprites.dev Client
 * Handles per-user VM provisioning for OpenClaw instances
 * Uses @fly/sprites SDK
 */

import { SpritesClient } from "@fly/sprites";

if (!process.env.SPRITES_API_TOKEN) {
  throw new Error("SPRITES_API_TOKEN environment variable is required");
}

export const spritesClient = new SpritesClient(process.env.SPRITES_API_TOKEN);

export interface SpriteConfig {
  userId: string;
  workspaceId: string;
  ramMB?: number; // Default: 4096 (4GB)
  storageGB?: number; // Default: 10GB
}

export interface SpriteInfo {
  spriteId: string;
  spriteName: string;
  status: string;
  gatewayUrl: string;
  gatewayToken: string;
}

/**
 * Create a new Sprite VM for a user
 */
export async function createUserSprite(
  config: SpriteConfig
): Promise<SpriteInfo> {
  const spriteName = `claw-${config.workspaceId}`;

  try {
    // Create Sprite with basic config
    const sprite = await spritesClient.createSprite(spriteName, {
      environment: {
        USER_ID: config.userId,
        WORKSPACE_ID: config.workspaceId,
      },
    });

    // Install OpenClaw (this will be slow - 15 min)
    await sprite.exec(
      "curl -fsSL https://openclaw.ai/install.sh | bash && openclaw start"
    );

    return {
      spriteId: sprite.id || spriteName,
      spriteName,
      status: sprite.status || "running",
      gatewayUrl: `wss://${spriteName}.sprites.dev:8080`,
      gatewayToken: process.env.SPRITES_API_TOKEN!,
    };
  } catch (error) {
    console.error("Failed to create Sprite:", error);
    throw new Error(`Sprite creation failed: ${error}`);
  }
}

/**
 * Wake up a Sprite by sending a command (they auto-sleep)
 */
export async function wakeSprite(spriteName: string): Promise<void> {
  try {
    const sprite = spritesClient.sprite(spriteName);
    // Simple ping command to wake it up
    await sprite.exec("echo 'heartbeat'");
  } catch (error) {
    console.error(`Failed to wake Sprite ${spriteName}:`, error);
    throw error;
  }
}

/**
 * Get Sprite status and info
 */
export async function getSpriteStatus(spriteName: string) {
  try {
    const sprite = await spritesClient.getSprite(spriteName);
    return {
      status: sprite.status || "unknown",
      id: sprite.id,
      createdAt: sprite.createdAt,
      updatedAt: sprite.updatedAt,
    };
  } catch (error) {
    console.error(`Failed to get Sprite status ${spriteName}:`, error);
    throw error;
  }
}

/**
 * Delete a Sprite VM
 */
export async function deleteSprite(spriteName: string): Promise<void> {
  try {
    await spritesClient.deleteSprite(spriteName);
  } catch (error) {
    console.error(`Failed to delete Sprite ${spriteName}:`, error);
    throw error;
  }
}

/**
 * Execute a command on a Sprite
 */
export async function execSpriteCommand(
  spriteName: string,
  command: string
): Promise<{ stdout: string; stderr: string; exitCode: number }> {
  try {
    const sprite = spritesClient.sprite(spriteName);
    const result = await sprite.exec(command);
    return {
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      exitCode: result.exitCode || 0,
    };
  } catch (error) {
    console.error(`Failed to exec command on Sprite ${spriteName}:`, error);
    throw error;
  }
}

/**
 * Send heartbeat to keep Sprite alive (wake it up)
 */
export async function sendSpriteHeartbeat(spriteName: string): Promise<void> {
  try {
    await wakeSprite(spriteName);
  } catch (error) {
    console.error(`Failed to send heartbeat to Sprite ${spriteName}:`, error);
    throw error;
  }
}

/**
 * Clone from checkpoint (fast provisioning - 1 second)
 */
export async function cloneFromCheckpoint(
  templateName: string,
  checkpointId: string,
  config: SpriteConfig
): Promise<SpriteInfo> {
  const spriteName = `claw-${config.workspaceId}`;

  try {
    // Create new sprite
    const sprite = await spritesClient.createSprite(spriteName, {
      environment: {
        USER_ID: config.userId,
        WORKSPACE_ID: config.workspaceId,
      },
    });

    // Restore from checkpoint
    await sprite.restoreCheckpoint(checkpointId);

    return {
      spriteId: sprite.id || spriteName,
      spriteName,
      status: "running",
      gatewayUrl: `wss://${spriteName}.sprites.dev:8080`,
      gatewayToken: process.env.SPRITES_API_TOKEN!,
    };
  } catch (error) {
    console.error("Failed to clone from checkpoint:", error);
    throw new Error(`Checkpoint clone failed: ${error}`);
  }
}

/**
 * Create a checkpoint of a Sprite (for template cloning)
 */
export async function createCheckpoint(
  spriteName: string,
  comment: string
): Promise<string> {
  try {
    const sprite = spritesClient.sprite(spriteName);
    const response = await sprite.createCheckpoint(comment);

    // Parse NDJSON stream to get checkpoint ID
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let checkpointId = "";

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.checkpoint_id) {
              checkpointId = data.checkpoint_id;
            }
          } catch {}
        }
      }
    }

    return checkpointId;
  } catch (error) {
    console.error(`Failed to create checkpoint for ${spriteName}:`, error);
    throw error;
  }
}
