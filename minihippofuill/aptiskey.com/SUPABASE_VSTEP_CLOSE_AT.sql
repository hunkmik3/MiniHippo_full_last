-- ===================================================================
-- VSTEP — feedback 13/11 (chạy 1 lần trong Supabase SQL Editor, chạy lại vẫn an toàn)
-- 1) "Mở đến" cho bài giao theo nhóm (Nhóm ôn / Nhóm học): hết deadline học viên
--    vẫn làm được (hiện "Trễ deadline") cho tới thời điểm này.
-- 2) Đếm sẵn số câu / part của từng bộ đề vào data.__counts để danh sách bộ đề
--    chỉ tải bản tóm tắt (không kèm câu hỏi) → trang tải nhanh, đỡ băng thông.
--    Bộ đề lưu từ nay được server tự đếm khi lưu.
-- ===================================================================

alter table public.vstep_assignments
  add column if not exists close_at timestamptz;

comment on column public.vstep_assignments.close_at is
  'Mở đến: sau deadline vẫn cho làm (trễ) tới mốc này. Ôn thi: trống = đóng khi hết deadline. Lớp học: trống = không đóng.';

update public.vstep_contents c
set data = c.data || jsonb_build_object('__counts', jsonb_build_object(
  'listening', (
    select coalesce(sum(case when jsonb_typeof(p->'questions') = 'array' then jsonb_array_length(p->'questions') else 0 end), 0)
    from jsonb_array_elements(case when jsonb_typeof(c.data->'listening'->'parts') = 'array' then c.data->'listening'->'parts' else '[]'::jsonb end) p
  ),
  'reading', (
    select coalesce(sum(case when jsonb_typeof(p->'questions') = 'array' then jsonb_array_length(p->'questions') else 0 end), 0)
    from jsonb_array_elements(case when jsonb_typeof(c.data->'reading'->'parts') = 'array' then c.data->'reading'->'parts' else '[]'::jsonb end) p
  ),
  'writing', case when jsonb_typeof(c.data->'writing'->'parts') = 'array' then jsonb_array_length(c.data->'writing'->'parts') else 0 end,
  'speaking', case when jsonb_typeof(c.data->'speaking'->'parts') = 'array' then jsonb_array_length(c.data->'speaking'->'parts') else 0 end,
  'parts', jsonb_build_object(
    'listening', case when jsonb_typeof(c.data->'listening'->'parts') = 'array' then jsonb_array_length(c.data->'listening'->'parts') else 0 end,
    'reading', case when jsonb_typeof(c.data->'reading'->'parts') = 'array' then jsonb_array_length(c.data->'reading'->'parts') else 0 end,
    'writing', case when jsonb_typeof(c.data->'writing'->'parts') = 'array' then jsonb_array_length(c.data->'writing'->'parts') else 0 end,
    'speaking', case when jsonb_typeof(c.data->'speaking'->'parts') = 'array' then jsonb_array_length(c.data->'speaking'->'parts') else 0 end
  )
))
where jsonb_typeof(c.data) = 'object';

-- Báo PostgREST đọc lại cấu trúc bảng (cột mới dùng được ngay).
notify pgrst, 'reload schema';
