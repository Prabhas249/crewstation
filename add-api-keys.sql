-- Just add the 2 new API key columns
-- Paste this in Supabase SQL Editor

ALTER TABLE workspaces
ADD COLUMN IF NOT EXISTS openai_api_key TEXT,
ADD COLUMN IF NOT EXISTS gemini_api_key TEXT;

-- Show the result
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'workspaces'
ORDER BY ordinal_position;
