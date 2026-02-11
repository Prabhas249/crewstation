-- Check if workspaces table exists and see its structure
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'workspaces';

-- If it exists, show all columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'workspaces'
ORDER BY ordinal_position;

-- Show all your tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
