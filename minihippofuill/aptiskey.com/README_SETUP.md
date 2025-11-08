# Mini Hippo Backend Setup Guide

## Overview

Hệ thống backend cho Mini Hippo bao gồm:
1. **Lesson Upload System** - Upload bài học qua GitHub API
2. **Authentication System** - Xác thực người dùng với Supabase
3. **Lesson Display** - Hiển thị bài học đã upload trên frontend

## Prerequisites

- GitHub account với repository
- Supabase account (free tier)
- Vercel account để deploy

## Setup Instructions

### 1. GitHub Setup

1. Tạo GitHub Personal Access Token:
   - Vào GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Tạo token mới với scope: `repo` (full control of private repositories)
   - Copy token (chỉ hiển thị 1 lần)

2. Lưu thông tin:
   - `GITHUB_TOKEN`: Personal Access Token vừa tạo
   - `GITHUB_OWNER`: GitHub username của bạn
   - `GITHUB_REPO`: Tên repository

### 2. Supabase Setup

1. Tạo Supabase project:
   - Vào https://supabase.com
   - Tạo project mới
   - Lưu Project URL và API keys

2. Tạo database tables:

**Table: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);
```

**Table: lessons**
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part INTEGER NOT NULL CHECK (part IN (1, 2, 4, 5)),
  file_path TEXT NOT NULL,
  title TEXT,
  topic TEXT,
  num_sets INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(part, file_path)
);
```

3. Lưu thông tin:
   - `SUPABASE_URL`: Project URL (https://xxxxx.supabase.co)
   - `SUPABASE_ANON_KEY`: Anon/public key
   - `SUPABASE_SERVICE_KEY`: Service role key (secret)

### 3. Vercel Deployment

1. Connect repository to Vercel:
   - Import GitHub repository vào Vercel
   - Vercel sẽ tự động detect và deploy

2. Add Environment Variables:
   - Vào Project Settings → Environment Variables
   - Thêm các biến sau:
     ```
     GITHUB_TOKEN=your_token_here
     GITHUB_OWNER=your_username
     GITHUB_REPO=your_repo_name
     SUPABASE_URL=https://xxxxx.supabase.co
     SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_SERVICE_KEY=your_service_key
     ```

3. Deploy:
   - Vercel sẽ tự động deploy khi có commit
   - Hoặc deploy manually từ Vercel dashboard

### 4. Create Admin Account

1. Vào Supabase Dashboard → Authentication → Users
2. Tạo user mới với email và password
3. Vào Table Editor → users table
4. Update user record:
   - Set `role` = 'admin'
   - Set `status` = 'active'

### 5. Frontend Setup

Các file đã được cập nhật tự động:
- `login.html` - Trang đăng nhập
- `js/auth.js` - Authentication utilities
- `reading_question-2.html` - Hiển thị bài học đã upload
- `js/reading_question_list.js` - Load và hiển thị lessons
- `admin_upload.html` - Protected với admin check

## Usage

### Upload Lesson

1. Đăng nhập với tài khoản admin
2. Vào `admin_upload.html`
3. Chọn part (1, 2, 4, hoặc 5)
4. Thêm bộ đề mới và điền thông tin
5. Click "Upload to GitHub"
6. Bài học sẽ được commit vào GitHub và tự động deploy

### View Uploaded Lessons

1. Đăng nhập với tài khoản user
2. Vào `reading_question-2.html`
3. Các bài học đã upload sẽ hiển thị dưới mỗi part button

## API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - Đăng xuất

### User Management (Admin only)
- `POST /api/users/create` - Tạo user
- `GET /api/users/list` - Danh sách users
- `PUT /api/users/update` - Update user
- `DELETE /api/users/delete` - Xóa user

### Lessons
- `POST /api/upload-lesson` - Upload lesson (commit to GitHub)
- `GET /api/lessons/list?part=1` - Danh sách lessons theo part

## Troubleshooting

### GitHub API Errors
- Kiểm tra token có đúng scope `repo` không
- Kiểm tra repository name và owner có đúng không
- Kiểm tra branch name (main hoặc master)

### Supabase Errors
- Kiểm tra API keys có đúng không
- Kiểm tra tables đã được tạo chưa
- Kiểm tra RLS (Row Level Security) policies nếu có

### Authentication Issues
- Clear localStorage và thử đăng nhập lại
- Kiểm tra token expiration
- Kiểm tra user role trong database

## Notes

- GitHub API rate limit: 5000 requests/hour
- Supabase free tier: 500MB database, unlimited users
- Vercel tự động deploy khi có commit mới
- Frontend vẫn load từ file JS như cũ (backward compatible)

