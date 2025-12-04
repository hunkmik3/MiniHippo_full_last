# Cập nhật Supabase cho quản lý tài khoản & điểm số

Chạy các lệnh SQL dưới đây trong Supabase SQL editor để thêm các bảng/cột phục vụ giới hạn thiết bị và ghi nhận kết quả luyện tập.

```sql
-- Bổ sung thông tin cho bảng users
alter table public.users
    add column if not exists account_code text unique,
    add column if not exists full_name text,
    add column if not exists phone_number text,
    add column if not exists device_limit int default 2,
    add column if not exists expires_at date,
    add column if not exists notes text;

alter table public.users
    add column if not exists last_login timestamptz;

-- Lưu danh sách thiết bị đã đăng nhập
create table if not exists public.user_devices (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users (id) on delete cascade,
    device_id text not null,
    device_name text,
    user_agent text,
    status text default 'active',
    last_seen timestamptz default now(),
    created_at timestamptz default now()
);

create index if not exists user_devices_user_id_idx on public.user_devices(user_id);
create unique index if not exists user_devices_unique_idx on public.user_devices(user_id, device_id);

-- Lưu kết quả luyện tập
create table if not exists public.practice_results (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users (id) on delete cascade,
    practice_type text not null, -- reading | listening
    practice_mode text default 'set',
    set_id text,
    set_title text,
    total_score numeric,
    max_score numeric,
    part_scores jsonb,
    duration_seconds int,
    device_id text,
    metadata jsonb,
    submitted_at timestamptz default now()
);

create index if not exists practice_results_user_idx on public.practice_results(user_id);
create index if not exists practice_results_type_idx on public.practice_results(practice_type);
```

> **Ghi chú**
> - `device_limit` có thể chỉnh trên từng tài khoản (mặc định = 2).
> - Sau khi tạo bảng mới, phân quyền `select/insert/update` cho role `service_role`/`anon` theo nhu cầu.

