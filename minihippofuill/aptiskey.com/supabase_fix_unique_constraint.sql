-- Fix: Remove UNIQUE constraint on (part, file_path) to allow multiple lessons per part
-- Run this in Supabase SQL Editor

-- Drop the unique constraint if it exists
ALTER TABLE lessons DROP CONSTRAINT IF EXISTS lessons_part_file_path_key;

-- Alternative: If the constraint has a different name, you can find it with:
-- SELECT constraint_name 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'lessons' AND constraint_type = 'UNIQUE';

-- Now you can have multiple lessons with the same part but different file_path
-- Each lesson will have a unique file_path (with timestamp), so no conflicts

