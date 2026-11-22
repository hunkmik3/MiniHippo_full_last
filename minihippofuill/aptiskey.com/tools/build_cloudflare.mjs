#!/usr/bin/env node
// ===================================================================
// Dựng bản deploy MiniHippo cho Cloudflare Pages từ code ĐÃ COMMIT (git HEAD).
//   node minihippofuill/aptiskey.com/tools/build_cloudflare.mjs [thư_mục_ra]
// Mặc định ra ~/minihippo_cf/site:
//   dist/                 web tĩnh (html, js, css, images, audio, demo_*)
//   functions/api/[[path]].js + api/ + server/   API (Pages Function, wrangler đóng gói)
//   node_modules/aws4fetch                        thư viện duy nhất API cần
//   server/cloudflare/lesson_data.generated.json  dữ liệu bài học bóc sẵn (Node, node:vm)
//   wrangler.toml
// Không đưa .env, .sql, .md, script test, code server vào dist (web công khai).
// ===================================================================
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_DIR = path.resolve(APP_DIR, '..', '..');
const APP_PREFIX = 'minihippofuill/aptiskey.com';
const OUT = path.resolve(process.argv[2] || path.join(os.homedir(), 'minihippo_cf', 'site'));

// Mục cấp 1 KHÔNG được thành file tĩnh công khai.
const NOT_STATIC = new Set(['api', 'server', 'functions', 'tools', 'scripts', 'docs', 'node_modules',
  'package.json', 'package-lock.json', 'vercel.json', '.gitignore', '.vercelignore']);
const NOT_STATIC_EXT = /\.(md|sql|sh|ps1)$/i;

function log(msg) { console.log(msg); }

if (!OUT.startsWith(os.homedir()) || OUT === os.homedir()) {
  throw new Error(`Thư mục ra không an toàn: ${OUT}`);
}

// 0) Làm sạch thư mục ra (giữ node_modules của wrangler nếu có ở thư mục cha).
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 1) Xuất code đã commit.
const commit = execFileSync('git', ['-C', REPO_DIR, 'rev-parse', '--short', 'HEAD']).toString().trim();
const appTmp = path.join(OUT, '_app');
fs.mkdirSync(appTmp, { recursive: true });
const archive = execFileSync('git', ['-C', REPO_DIR, 'archive', `HEAD:${APP_PREFIX}`], { maxBuffer: 1024 * 1024 * 1024 });
execFileSync('tar', ['-x', '-C', appTmp], { input: archive, maxBuffer: 1024 * 1024 * 1024 });
log(`✓ xuất code commit ${commit}`);

// 2) Web tĩnh → dist/
const dist = path.join(OUT, 'dist');
fs.mkdirSync(dist, { recursive: true });
let staticCount = 0;
for (const entry of fs.readdirSync(appTmp)) {
  if (NOT_STATIC.has(entry) || entry.startsWith('.') || NOT_STATIC_EXT.test(entry) || /^test-.*\.js$/.test(entry)) continue;
  fs.cpSync(path.join(appTmp, entry), path.join(dist, entry), { recursive: true });
}
const countFiles = (dir) => fs.readdirSync(dir, { withFileTypes: true })
  .reduce((n, d) => n + (d.isDirectory() ? countFiles(path.join(dir, d.name)) : 1), 0);
// Không có 404.html thì Pages coi là web 1 trang (SPA) và trả index.html (200) cho mọi
// đường dẫn lạ — khác Vercel (404). Tạo trang 404 đơn giản nếu dự án chưa có.
if (!fs.existsSync(path.join(dist, '404.html'))) {
  fs.writeFileSync(path.join(dist, '404.html'), `<!doctype html><html lang="vi"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Không tìm thấy trang · Mini Hippo</title>
<style>body{font-family:system-ui,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f8fafc;color:#1e293b}
main{text-align:center;padding:24px}a{color:#2563eb}</style></head>
<body><main><h1>404</h1><p>Không tìm thấy trang này.</p><p><a href="/">Về trang chủ Mini Hippo</a></p></main></body></html>
`);
}
staticCount = countFiles(dist);
log(`✓ dist/: ${staticCount} file tĩnh`);

// 3) API: functions/ + api/ + server/ (wrangler đóng gói khi deploy).
for (const entry of ['functions', 'api', 'server']) {
  fs.cpSync(path.join(appTmp, entry), path.join(OUT, entry), { recursive: true });
}
fs.mkdirSync(path.join(OUT, 'node_modules'), { recursive: true });
fs.cpSync(path.join(APP_DIR, 'node_modules', 'aws4fetch'), path.join(OUT, 'node_modules', 'aws4fetch'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'package.json'), JSON.stringify({ name: 'minihippo-cf', private: true, type: 'module' }, null, 2));
fs.rmSync(appTmp, { recursive: true, force: true });
log('✓ functions/, api/, server/, aws4fetch');

// 4) Bóc sẵn dữ liệu bài học cho /api/lessons/demo-lesson (chạy bằng Node).
const envFile = path.join(REPO_DIR, '.env.local');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const { selectFrom } = await import(path.join(OUT, 'server/api/_utils/supabase.js'));
const { isAptisLessonPart } = await import(path.join(OUT, 'server/api/demo/_shared.js'));
const { buildLessonJson } = await import(path.join(OUT, 'server/api/demo/lesson.js'));
const lessons = (await selectFrom('lessons', { columns: 'id,part' })) || [];
const lessonData = {};
let okCount = 0;
for (const lesson of lessons.filter((l) => isAptisLessonPart(l.part))) {
  try {
    const result = await buildLessonJson(lesson.id);
    lessonData[lesson.id] = result;
    if (result.status === 200) okCount += 1;
  } catch (error) {
    log(`  ! bài ${lesson.id}: ${error.message}`);
  }
}
fs.writeFileSync(path.join(OUT, 'server/cloudflare/lesson_data.generated.json'), JSON.stringify(lessonData));
log(`✓ dữ liệu bài học bóc sẵn: ${okCount}/${Object.keys(lessonData).length} bài OK`);

// 5) Cấu hình Pages.
fs.writeFileSync(path.join(OUT, 'wrangler.toml'), [
  'name = "minihippo"',
  'pages_build_output_dir = "./dist"',
  'compatibility_date = "2026-11-01"',
  'compatibility_flags = ["nodejs_compat"]',
  ''
].join('\n'));
fs.writeFileSync(path.join(OUT, 'BUILD_COMMIT'), `${commit}\n`);
log(`✓ wrangler.toml — xong: ${OUT}`);
