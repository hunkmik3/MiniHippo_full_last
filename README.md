# Mini Hippo - Learning Platform

Hệ thống học tập Mini Hippo với backend đầy đủ: authentication, lesson upload, và user management.

## 🚀 Quick Start

### Prerequisites
- GitHub account
- Supabase account (free tier)
- Vercel account (free tier)

### Setup Instructions

Xem chi tiết trong file: [`minihippofuill/aptiskey.com/SETUP_CHECKLIST.md`](minihippofuill/aptiskey.com/SETUP_CHECKLIST.md)

### Quick Setup Steps:

1. **Setup Supabase**
   - Tạo project trên https://supabase.com
   - Chạy SQL script từ `minihippofuill/aptiskey.com/supabase_setup.sql`
   - Lấy API keys (URL, anon key, service key)

2. **Setup GitHub Token**
   - Tạo Personal Access Token với scope `repo`
   - Lưu token, username, và repo name

3. **Deploy lên Vercel**
   - Import repository này vào Vercel
   - Thêm 6 environment variables:
     - `GITHUB_TOKEN`
     - `GITHUB_OWNER`
     - `GITHUB_REPO`
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_KEY`
   - Deploy

4. **Create Admin User**
   - Tạo user trong Supabase Auth
   - Set role = 'admin' trong users table

## 📁 Project Structure

```
minihippofuill/aptiskey.com/
├── api/                    # Backend API endpoints
│   ├── auth/              # Authentication APIs
│   ├── users/             # User management APIs
│   ├── lessons/           # Lesson APIs
│   └── upload-lesson.js   # GitHub upload API
├── js/                    # Frontend JavaScript
│   ├── auth.js           # Authentication utilities
│   ├── admin_upload.js   # Admin upload logic
│   └── reading_question_list.js  # Lesson display
├── css/                   # Stylesheets
├── admin_upload.html      # Admin page
├── login.html            # Login page
└── reading_question-2.html  # Lesson selection page
```

## 🔑 Features

- ✅ User Authentication (Supabase)
- ✅ Admin Lesson Upload (GitHub API)
- ✅ Lesson Display on Frontend
- ✅ User Management (Admin only)
- ✅ Device quota enforcement (2 devices/account)
- ✅ Practice score tracking & reporting
- ✅ Auto-deploy on Vercel

## 📚 Documentation

- [`SETUP_CHECKLIST.md`](minihippofuill/aptiskey.com/SETUP_CHECKLIST.md) - Step-by-step setup guide
- [`README_SETUP.md`](minihippofuill/aptiskey.com/README_SETUP.md) - Detailed setup instructions
- [`supabase_setup.sql`](minihippofuill/aptiskey.com/supabase_setup.sql) - Database setup script
- [`account_management_setup.md`](minihippofuill/aptiskey.com/docs/account_management_setup.md) - Extra tables for devices & scores

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: GitHub (for lesson files)
- **Deployment**: Vercel

## 📝 License

All rights reserved - Mini Hippo

