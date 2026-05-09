-- Mini Hippo: bổ sung cột `assigned_class_id` cho bảng users.
-- Cột này dùng để gán học viên vào 1 lớp homework_class cụ thể.
-- Chạy 1 lần trong Supabase SQL Editor (idempotent, an toàn nếu đã tồn tại).

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS assigned_class_id text;

CREATE INDEX IF NOT EXISTS users_assigned_class_id_idx
    ON public.users(assigned_class_id);
