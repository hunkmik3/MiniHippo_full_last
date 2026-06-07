-- Mini Hippo VSTEP: bổ sung cột để hỗ trợ lịch học 246/357,
-- giờ học, số buổi cố định theo band, sessions[] auto-compute và
-- ngày khai giảng riêng cho từng học viên.
-- Idempotent — chạy lại nhiều lần đều an toàn.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===========================================================
-- vstep_classes: lịch học cấu trúc 246/357 + sessions[]
-- ===========================================================
ALTER TABLE public.vstep_classes
  ADD COLUMN IF NOT EXISTS schedule_type text,
  ADD COLUMN IF NOT EXISTS start_time text,
  ADD COLUMN IF NOT EXISTS num_sessions integer,
  ADD COLUMN IF NOT EXISTS sessions jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Constraint nhẹ: schedule_type chỉ chấp nhận 246 / 357 / NULL (legacy)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint c
    WHERE conname = 'vstep_classes_schedule_type_check'
      AND conrelid = 'public.vstep_classes'::regclass
  ) THEN
    ALTER TABLE public.vstep_classes
      ADD CONSTRAINT vstep_classes_schedule_type_check
      CHECK (schedule_type IS NULL OR schedule_type IN ('246', '357'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_vstep_classes_band_schedule
  ON public.vstep_classes(band, schedule_type, starts_at);

-- ===========================================================
-- vstep_students: ngày khai giảng riêng để compute expires_at
-- (thường = class.starts_at nhưng HV có thể join muộn nên giữ
--  cột riêng cho linh hoạt).
-- ===========================================================
ALTER TABLE public.vstep_students
  ADD COLUMN IF NOT EXISTS started_on date;

CREATE INDEX IF NOT EXISTS idx_vstep_students_started_on
  ON public.vstep_students(started_on);

-- Per-class buổi học: lưu class_id + session_number bên trong vstep_contents.data
-- jsonb (vstep_class_id, vstep_session_number, vstep_session_due_at). Không cần
-- DB column riêng — query qua jsonb operators khi filter theo lớp.
