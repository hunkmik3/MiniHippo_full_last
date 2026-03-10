-- Mini Hippo: Practice tables setup (reading/listening/writing/speaking)
-- Run in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Keep updated_at fresh on UPDATE
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =============================
-- practice_sets
-- =============================
CREATE TABLE IF NOT EXISTS public.practice_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  description text DEFAULT '',
  duration_minutes integer NOT NULL DEFAULT 35,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Backfill for older deployments where table existed before updated_at was introduced.
ALTER TABLE public.practice_sets
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW();

-- Ensure duration is valid
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'practice_sets_duration_minutes_check'
      AND conrelid = 'public.practice_sets'::regclass
  ) THEN
    ALTER TABLE public.practice_sets
      ADD CONSTRAINT practice_sets_duration_minutes_check CHECK (duration_minutes > 0);
  END IF;
END $$;

-- Replace old type constraints with one that supports speaking
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'practice_sets'
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%type%'
      AND c.conname <> 'practice_sets_duration_minutes_check'
  LOOP
    EXECUTE format('ALTER TABLE public.practice_sets DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.practice_sets
  ADD CONSTRAINT practice_sets_type_check
  CHECK (type IN ('reading', 'listening', 'writing', 'speaking'));

CREATE INDEX IF NOT EXISTS idx_practice_sets_type_created_at
  ON public.practice_sets(type, created_at DESC);

DROP TRIGGER IF EXISTS trg_practice_sets_updated_at ON public.practice_sets;
CREATE TRIGGER trg_practice_sets_updated_at
BEFORE UPDATE ON public.practice_sets
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- =============================
-- practice_results
-- =============================
CREATE TABLE IF NOT EXISTS public.practice_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  practice_type text NOT NULL,
  practice_mode text NOT NULL DEFAULT 'set',
  set_id text,
  set_title text,
  total_score numeric(10,2) NOT NULL DEFAULT 0,
  max_score numeric(10,2) NOT NULL DEFAULT 0,
  part_scores jsonb,
  duration_seconds integer,
  device_id text,
  metadata jsonb,
  submitted_at timestamptz NOT NULL DEFAULT NOW(),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- Backfill for older deployments where table existed before updated_at was introduced.
ALTER TABLE public.practice_results
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'practice_results_duration_seconds_check'
      AND conrelid = 'public.practice_results'::regclass
  ) THEN
    ALTER TABLE public.practice_results
      ADD CONSTRAINT practice_results_duration_seconds_check CHECK (duration_seconds IS NULL OR duration_seconds >= 0);
  END IF;
END $$;

DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'practice_results'
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) ILIKE '%practice_type%'
  LOOP
    EXECUTE format('ALTER TABLE public.practice_results DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.practice_results
  ADD CONSTRAINT practice_results_practice_type_check
  CHECK (practice_type IN ('reading', 'listening', 'writing', 'speaking'));

CREATE INDEX IF NOT EXISTS idx_practice_results_user_submitted
  ON public.practice_results(user_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_practice_results_type_submitted
  ON public.practice_results(practice_type, submitted_at DESC);

DROP TRIGGER IF EXISTS trg_practice_results_updated_at ON public.practice_results;
CREATE TRIGGER trg_practice_results_updated_at
BEFORE UPDATE ON public.practice_results
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
