-- Add OpenAI and Gemini API key columns to workspaces table
-- Run this in your Supabase SQL Editor

ALTER TABLE workspaces
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT;

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'workspaces'
ORDER BY ordinal_position;
