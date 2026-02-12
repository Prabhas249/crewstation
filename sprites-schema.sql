-- User Sprites Table for ClawDirector
-- Tracks per-user Sprite VMs (isolated OpenClaw instances)

CREATE TABLE IF NOT EXISTS user_sprites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- Sprite identification
  sprite_name TEXT NOT NULL UNIQUE,
  sprite_id TEXT NOT NULL,

  -- Gateway connection details
  gateway_token TEXT NOT NULL,
  gateway_url TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'stopped', -- stopped, starting, running, sleeping, error
  last_active TIMESTAMPTZ,
  last_heartbeat TIMESTAMPTZ,

  -- Resource tracking
  ram_mb INTEGER DEFAULT 4096,
  storage_gb INTEGER DEFAULT 10,

  -- Billing tracking
  total_runtime_minutes INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10, 4) DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_sprites_user_id ON user_sprites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sprites_workspace_id ON user_sprites(workspace_id);
CREATE INDEX IF NOT EXISTS idx_user_sprites_sprite_id ON user_sprites(sprite_id);
CREATE INDEX IF NOT EXISTS idx_user_sprites_status ON user_sprites(status);

-- Enable RLS
ALTER TABLE user_sprites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sprites"
  ON user_sprites FOR SELECT
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own sprites"
  ON user_sprites FOR INSERT
  WITH CHECK (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own sprites"
  ON user_sprites FOR UPDATE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own sprites"
  ON user_sprites FOR DELETE
  USING (workspace_id IN (SELECT id FROM workspaces WHERE user_id = auth.uid()));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_sprites_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_user_sprites_updated_at_trigger
  BEFORE UPDATE ON user_sprites
  FOR EACH ROW
  EXECUTE FUNCTION update_user_sprites_updated_at();

-- Done!
SELECT 'user_sprites table created successfully! ✅' as status;
