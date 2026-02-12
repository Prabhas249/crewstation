-- Enable HTTP extension for making API calls from Supabase
-- Run this FIRST in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS http;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Verify extensions are enabled
SELECT * FROM pg_extension WHERE extname IN ('http', 'pg_cron');

-- Done!
SELECT 'HTTP and pg_cron extensions enabled! ✅' as status;
