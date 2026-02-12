/**
 * Quick test script to verify Sprites API works
 * Run: npx tsx test-sprites.ts
 */

import { spritesClient } from "./src/lib/sprites/client";

async function test() {
  console.log("🧪 Testing Sprites API connection...\n");

  try {
    // Test 1: List sprites
    console.log("1️⃣ Listing existing sprites...");
    const sprites = await spritesClient.listSprites();
    console.log(`✅ Found ${sprites.sprites?.length || 0} sprites`);

    if (sprites.sprites && sprites.sprites.length > 0) {
      sprites.sprites.forEach((s) => {
        console.log(`  - ${s.name} (${s.status})`);
      });
    }

    console.log("\n✅ Sprites API is working!\n");
  } catch (error) {
    console.error("❌ Sprites API test failed:");
    console.error(error);
    process.exit(1);
  }
}

test();
