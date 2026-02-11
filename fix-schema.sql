-- Simple fix: Just add the missing columns
-- Run this in Supabase SQL Editor

-- Add new API key columns to workspaces (if it exists)
ALTER TABLE workspaces
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT;

-- Add agent_id to conversations if missing
ALTER TABLE conversations
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;

-- Add agent_id to tasks if missing
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS agent_id UUID REFERENCES agents(id) ON DELETE SET NULL;

-- Check what we have now
SELECT 'workspaces columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'workspaces';

SELECT 'conversations columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'conversations';

SELECT 'tasks columns:' as info;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tasks';
