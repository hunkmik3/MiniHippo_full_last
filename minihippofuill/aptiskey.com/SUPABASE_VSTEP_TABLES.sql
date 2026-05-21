-- Mini Hippo: dedicated VSTEP module tables
-- Run in Supabase SQL Editor before using /api/vstep/* endpoints.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.vstep_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  email text NOT NULL UNIQUE,
  username text,
  account_code text UNIQUE,
  full_name text,
  phone_number text,
  band text,
  practice_access boolean NOT NULL DEFAULT true,
  class_id uuid,
  last_import_batch text,
  status text NOT NULL DEFAULT 'active',
  device_limit integer NOT NULL DEFAULT 2,
  expires_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE public.vstep_students
  ADD COLUMN IF NOT EXISTS band text,
  ADD COLUMN IF NOT EXISTS practice_access boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS class_id uuid,
  ADD COLUMN IF NOT EXISTS last_import_batch text;

CREATE INDEX IF NOT EXISTS idx_vstep_students_status_created
  ON public.vstep_students(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vstep_students_band_status
  ON public.vstep_students(band, status, created_at DESC);

ALTER TABLE public.vstep_students ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trg_vstep_students_updated_at
BEFORE UPDATE ON public.vstep_students
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS public.vstep_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type text NOT NULL DEFAULT 'file',
  title text NOT NULL,
  file_url text,
  file_path text,
  mime_type text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT vstep_resources_type_check CHECK (resource_type IN ('audio', 'image', 'text', 'document', 'file'))
);

CREATE INDEX IF NOT EXISTS idx_vstep_resources_type_created
  ON public.vstep_resources(resource_type, created_at DESC);

ALTER TABLE public.vstep_resources ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trg_vstep_resources_updated_at
BEFORE UPDATE ON public.vstep_resources
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS public.vstep_classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  band text NOT NULL DEFAULT 'B1',
  teacher_name text,
  teacher_user_id uuid,
  starts_at timestamptz,
  ends_at timestamptz,
  schedule jsonb NOT NULL DEFAULT '{}'::jsonb,
  holidays jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT vstep_classes_band_check CHECK (band IN ('B1', 'B2')),
  CONSTRAINT vstep_classes_status_check CHECK (status IN ('active', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_vstep_classes_band_status
  ON public.vstep_classes(band, status, created_at DESC);

ALTER TABLE public.vstep_classes ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trg_vstep_classes_updated_at
BEFORE UPDATE ON public.vstep_classes
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS public.vstep_class_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.vstep_classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.vstep_students(id) ON DELETE CASCADE,
  user_id uuid,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT vstep_class_students_unique UNIQUE (class_id, student_id),
  CONSTRAINT vstep_class_students_status_check CHECK (status IN ('active', 'archived'))
);

CREATE INDEX IF NOT EXISTS idx_vstep_class_students_student
  ON public.vstep_class_students(student_id, status);

ALTER TABLE public.vstep_class_students ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trg_vstep_class_students_updated_at
BEFORE UPDATE ON public.vstep_class_students
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS public.vstep_contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow text NOT NULL DEFAULT 'practice',
  content_kind text NOT NULL DEFAULT 'mock_test',
  title text NOT NULL,
  description text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  duration_minutes integer NOT NULL DEFAULT 177,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT vstep_contents_flow_check CHECK (flow IN ('practice', 'lesson_exam')),
  CONSTRAINT vstep_contents_kind_check CHECK (content_kind IN ('mock_test', 'lesson', 'assigned_exam')),
  CONSTRAINT vstep_contents_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT vstep_contents_duration_check CHECK (duration_minutes > 0)
);

CREATE INDEX IF NOT EXISTS idx_vstep_contents_flow_status_created
  ON public.vstep_contents(flow, status, created_at DESC);

ALTER TABLE public.vstep_contents ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trg_vstep_contents_updated_at
BEFORE UPDATE ON public.vstep_contents
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS public.vstep_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES public.vstep_contents(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.vstep_classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES public.vstep_students(id) ON DELETE CASCADE,
  user_id uuid,
  assigned_by uuid,
  available_from timestamptz,
  due_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  notes text,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT vstep_assignments_status_check CHECK (status IN ('active', 'closed', 'archived'))
);

ALTER TABLE public.vstep_assignments
  ADD COLUMN IF NOT EXISTS class_id uuid REFERENCES public.vstep_classes(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS available_from timestamptz;

CREATE INDEX IF NOT EXISTS idx_vstep_assignments_content
  ON public.vstep_assignments(content_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vstep_assignments_student
  ON public.vstep_assignments(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vstep_assignments_class_due
  ON public.vstep_assignments(class_id, due_at);

ALTER TABLE public.vstep_assignments ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trg_vstep_assignments_updated_at
BEFORE UPDATE ON public.vstep_assignments
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS public.vstep_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.vstep_students(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  content_id uuid REFERENCES public.vstep_contents(id) ON DELETE SET NULL,
  assignment_id uuid REFERENCES public.vstep_assignments(id) ON DELETE SET NULL,
  flow text NOT NULL DEFAULT 'practice',
  content_kind text NOT NULL DEFAULT 'mock_test',
  content_title text,
  total_score numeric(10,2) NOT NULL DEFAULT 0,
  max_score numeric(10,2) NOT NULL DEFAULT 0,
  manual_score numeric(10,2),
  manual_feedback text,
  graded_by uuid,
  graded_at timestamptz,
  part_scores jsonb,
  duration_seconds integer,
  device_id text,
  metadata jsonb,
  submitted_at timestamptz NOT NULL DEFAULT NOW(),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  CONSTRAINT vstep_results_flow_check CHECK (flow IN ('practice', 'lesson_exam')),
  CONSTRAINT vstep_results_kind_check CHECK (content_kind IN ('mock_test', 'lesson', 'assigned_exam')),
  CONSTRAINT vstep_results_duration_check CHECK (duration_seconds IS NULL OR duration_seconds >= 0)
);

ALTER TABLE public.vstep_results
  ADD COLUMN IF NOT EXISTS manual_score numeric(10,2),
  ADD COLUMN IF NOT EXISTS manual_feedback text,
  ADD COLUMN IF NOT EXISTS graded_by uuid,
  ADD COLUMN IF NOT EXISTS graded_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_vstep_results_user_submitted
  ON public.vstep_results(user_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_vstep_results_content_submitted
  ON public.vstep_results(content_id, submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_vstep_results_flow_submitted
  ON public.vstep_results(flow, submitted_at DESC);

ALTER TABLE public.vstep_results ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE TRIGGER trg_vstep_results_updated_at
BEFORE UPDATE ON public.vstep_results
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
