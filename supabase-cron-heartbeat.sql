-- Supabase pg_cron Heartbeat Setup
-- Run this in Supabase SQL Editor

-- Enable pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create function to call heartbeat API
CREATE OR REPLACE FUNCTION trigger_sprite_heartbeat()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  response http_response;
BEGIN
  -- Call the heartbeat API endpoint
  SELECT http_post(
    'https://crewstation.vercel.app/api/cron/heartbeat',
    '{}',
    'application/json',
    ARRAY[
      http_header('Authorization', 'Bearer 6196dc48cda5d12476cf70780f3d52a59520166abaa154ba80b23eaff93c59d2')
    ]
  ) INTO response;

  -- Log the result
  IF response.status = 200 THEN
    RAISE NOTICE 'Heartbeat successful';
  ELSE
    RAISE WARNING 'Heartbeat failed with status: %', response.status;
  END IF;
END;
$$;

-- Schedule cron job to run every 15 minutes
SELECT cron.schedule(
  'sprite-heartbeat',           -- job name
  '*/15 * * * *',                -- every 15 minutes
  'SELECT trigger_sprite_heartbeat();'
);

-- Check if cron job was created
SELECT * FROM cron.job WHERE jobname = 'sprite-heartbeat';

-- Done!
SELECT 'Supabase cron heartbeat configured! ✅' as status;
