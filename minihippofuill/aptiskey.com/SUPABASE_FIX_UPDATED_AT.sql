-- Quick fix for error:
--   record "new" has no field "updated_at"
-- Run in Supabase SQL Editor (safe, idempotent).

ALTER TABLE IF EXISTS public.practice_sets
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW();

ALTER TABLE IF EXISTS public.practice_results
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW();

-- Ensure trigger function exists
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on practice_results
DROP TRIGGER IF EXISTS trg_practice_results_updated_at ON public.practice_results;
CREATE TRIGGER trg_practice_results_updated_at
BEFORE UPDATE ON public.practice_results
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
