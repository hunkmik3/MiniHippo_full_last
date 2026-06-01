# Mini Hippo Project Notes

## Mo ta tong quan

Mini Hippo la web app hoc tieng Anh gom ba module chinh:

- Aptis: Reading, Listening, Writing, Speaking theo cau hoi va theo bo de.
- Lop Hoc: hoc vien duoc gan vao lop, hoc/nop bai theo tung buoi va deadline.
- VSTEP: on thi, bai hoc/bai thi duoc giao, quan ly hoc vien/lop/tai nguyen/ket qua.

Ung dung chinh nam trong `minihippofuill/aptiskey.com`. Thu muc goc la ban mirror/bao dong goi, co `local_dev_server.mjs` de chay local server rieng cho app con.

## Tech Stack

- Frontend: static HTML/CSS/vanilla JavaScript, Bootstrap 5, Bootstrap Icons, AdminLTE, mot so CDN JS/CSS.
- Backend: Vercel Serverless Functions chay Node.js ES modules.
- Database/Auth: Supabase Auth va Supabase PostgreSQL qua REST API tu helper `server/api/_utils/supabase.js`, khong dung ORM.
- Storage:
  - Lesson JS va media fallback: GitHub Contents API.
  - Media optional: Cloudflare R2 qua `@aws-sdk/client-s3`.
- AI/Feedback: `server/api/_utils/ai.js` ho tro Anthropic/OpenAI/Gemini; LanguageTool ho tro sua loi writing.
- Package manager: npm. `package.json` chinh nam o `minihippofuill/aptiskey.com`.

## Cau truc thu muc quan trong

- `minihippofuill/aptiskey.com/*.html`: cac trang hoc vien va admin.
- `minihippofuill/aptiskey.com/js/`: frontend logic, lesson data sinh san, admin tools.
- `minihippofuill/aptiskey.com/api/`: Vercel route entrypoints va dispatcher.
- `minihippofuill/aptiskey.com/server/api/`: logic API that su duoc import boi dispatcher.
- `minihippofuill/aptiskey.com/server/api/_utils/`: auth, Supabase, device, R2, AI, writing auto grade.
- `minihippofuill/aptiskey.com/css/`: style chung va style module.
- `minihippofuill/aptiskey.com/audio/`: audio tinh va speaking submissions da duoc luu.
- `minihippofuill/aptiskey.com/SUPABASE_*.sql`: migration/schema cho practice va VSTEP.
- `local_dev_server.mjs`: local server tai goc repo, map `/api/*` va static files vao app con.

## Lenh thuong dung

Chay trong `minihippofuill/aptiskey.com`:

```bash
npm install
npm run dev:vstep
```

`dev:vstep` se load `.env.local` neu co va chay `vercel dev --listen ${PORT:-3005}`. Can cai Vercel CLI neu dung lenh nay.

Chay local server rieng tu goc repo:

```bash
node local_dev_server.mjs
```

Server nay doc `.env.local` o thu muc goc repo va mac dinh chay `http://localhost:3005`.

Test hien co:

```bash
node --test minihippofuill/aptiskey.com/server/api/_utils/writingAutoGrade.test.js
```

Khong thay script build/lint/test tong quat trong `package.json`.

## Bien moi truong

Bat buoc cho auth/database/upload lesson:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `GITHUB_BRANCH` optional, mac dinh `main`

Optional:

- `USER_DEVICE_LIMIT`, mac dinh `2`
- `R2_ENDPOINT` hoac `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`
- `AI_PROVIDER`
- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`
- `OPENAI_API_KEY`, `OPENAI_MODEL`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- `LANGUAGETOOL_API_URL`, `LANGUAGETOOL_API_KEY`
- `WRITING_ALLOW_LANGUAGETOOL_FALLBACK`

Luu y bao mat: mot so file tai lieu/test hien dang co hardcoded Supabase URL/key; can coi la thong tin nhay cam neu repo public.

## Kien truc va routing

- `vercel.json` o goc repo khai bao builds cho `minihippofuill/aptiskey.com/api/**` va static cho `minihippofuill/aptiskey.com/**/*`.
- Rewrites chinh:
  - `/api/auth/:action` -> `api/auth/[action].js`
  - `/api/users/:action` -> `api/users/[action].js`
  - `/api/lessons/:action` -> `api/lessons/[action].js`
  - `/api/practice_sets/:action` -> `api/practice_sets/[action].js`
  - `/api/practice_results/:action` -> `api/practice_results/[action].js`
  - `/api/vstep/:resource/:action` -> `api/vstep/[resource]/[action].js`
  - `/aptis` -> `home.html`, `/vstep` -> `vstep_bode.html`, `/lop-hoc` -> `lop_hoc.html`
- Cac dispatcher trong `api/**/[action].js` chi map action sang handler trong `server/api/**`.
- Frontend la multi-page static app; moi trang HTML load JS rieng, khong co SPA router.

## Auth va phan quyen

- Dang nhap qua `/api/auth/login`, backend goi Supabase Auth password grant.
- Token/refresh token/user luu trong `localStorage`: `auth_token`, `auth_refresh_token`, `auth_user`.
- `js/auth.js` cung cap `requireAuth`, `requireAdmin`, `checkAuth`, route guard theo course/module va device headers.
- Backend verify token qua Supabase `/auth/v1/user`, sau do doc `users` profile.
- Role:
  - `admin`: truy cap admin API.
  - `user`: hoc vien.
- Course/module:
  - `Aptis` hoac `Lop on thi`: module Aptis.
  - `Lop hoc`: module Lop Hoc.
  - `VSTEP`: module VSTEP.
- Device quota luu trong `user_devices`; device moi co the revoke device cu neu vuot gioi han.

## Data model chinh

Base/documented:

- `users`: profile mirror cua Supabase Auth, gom role/status/account_code/full_name/phone_number/device_limit/started_on/expires_at/course/band/learning_program/assigned_class_id.
- `user_devices`: device da dang nhap, status `active`/`revoked`.
- `lessons`: lesson JS duoc upload, gom `part`, `file_path`, `title`, `topic`, `num_sets`, timestamps.

Practice:

- `practice_sets`: bo de/lop/key set, gom `title`, `type`, `description`, `duration_minutes`, `data jsonb`.
- `practice_results`: ket qua hoc/nop bai, gom user, type, mode, set id/title, score, part_scores, duration, device, metadata.

VSTEP:

- `vstep_students`: hoc vien VSTEP map den `users.user_id`.
- `vstep_classes`: lop VSTEP.
- `vstep_class_students`: membership lop-hoc-vien.
- `vstep_resources`: tai nguyen audio/image/text/document.
- `vstep_contents`: noi dung VSTEP practice/lesson_exam.
- `vstep_assignments`: bai duoc giao cho class/student/user.
- `vstep_results`: ket qua VSTEP, co manual score/feedback.

Lop Hoc hien luu lop trong `practice_sets` voi logical type `homework_class` trong `data.__practice_type`, vi DB constraint cua `practice_sets.type` chi cho `reading/listening/writing/speaking`.

## Luong tinh nang chinh

- Lesson upload legacy:
  - Admin tao lesson trong `admin_upload.html`/JS.
  - POST `/api/upload-lesson` commit JS file vao GitHub va insert/update `lessons`.
  - Hoc vien xem list qua `/api/lessons/list?part=...`, mo trang `reading_question*.html`, `listening_question*.html`, `writing_question.html`.
- Practice sets:
  - Admin tao reading/listening/speaking/key/homework class qua `/api/practice_sets/create/update/delete`.
  - Hoc vien lay danh sach qua `/api/practice_sets/list?type=...`, lay chi tiet qua `/api/practice_sets/get?id=...`.
  - Ket qua nop qua `/api/practice_results/submit`; admin xem/cham qua list/update/delete.
- Lop Hoc:
  - Admin quan ly hoc vien/lop/buoi/deadline trong `admin_lop_hoc.js`.
  - Hoc vien vao `lop_hoc.html` va `buoi_hoc.html`; backend kiem tra assigned_class_id va deadline khi submit homework.
- VSTEP:
  - Admin quan ly hoc vien, lop, resources, contents, assignments, results trong `admin_vstep.js`.
  - Hoc vien xem `vstep_bode.html`, `vstep_skill.html`, lam bai trong `vstep_exam.html`.
  - Lesson_exam yeu cau assignment active; submit se dong assignment.
- Writing:
  - Legacy writing JS goi `/api/ask` de cham/sua bang AI.
  - Practice writing submit qua `practice_results/submit` co auto-grade server-side trong `writingAutoGrade.js`.
- Speaking:
  - Ghi am upload qua `/api/upload-speaking-recording` hoac `/api/upload-audio` speaking submissions path.

## Quy uoc code

- Vanilla JS global functions/objects tren `window`; it module bundling.
- Ten file theo snake_case cho HTML/JS page (`admin_lop_hoc.js`, `reading_bode_set.js`).
- API server code dung ES modules, default export `handler(req, res)`.
- Helper Supabase tu viet: `selectFrom`, `insertInto`, `updateTable`, `deleteFrom`.
- Frontend dung `fetch` truc tiep, nhieu DOM manipulation bang `innerHTML`.
- Style chu yeu la Bootstrap/AdminLTE cong CSS rieng.
- Formatting khong dong nhat: 2 spaces trong server, 4 spaces/inline/minified style trong nhieu frontend generated lesson files.

## Diem can luu y/rui ro

- `ADMIN_SETUP_GUIDE.md` va cac file test co hardcoded Supabase keys. Can rotate key neu da public.
- `/api/ask` khong yeu cau auth/rate limit trong code hien tai, co rui ro bi lam dung AI API.
- `practice_sets/list` va `lessons/list` public va doc toan bo danh sach truoc khi filter; can can nhac auth/pagination neu du lieu nhay cam hoac lon.
- Nhieu file frontend rat lon va nhieu trach nhiem: `admin_lop_hoc.js`, `buoi_hoc.js`, `admin_upload_v2.js`, `admin_upload_listening.js`, `writingAutoGrade.js`.
- Mot so admin page/tool khong load `auth.js`/`requireAdmin` truc tiep; API van chan admin, nhung UI guard khong dong nhat.
- Upload reading lesson tu `admin_upload_v2.js` khong gui `part`; backend suy ra reading part bang number trong khi migration yeu cau text. Can kiem tra khi sua luong upload.
- Device quota co thao tac select roi update/insert rieng le, co the race condition khi dang nhap dong thoi.
- Test coverage rat mong: chi thay `writingAutoGrade.test.js` va cac script test thu cong Supabase.
