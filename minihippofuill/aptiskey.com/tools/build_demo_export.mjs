/**
 * Dựng bản XUẤT giao diện THẬT của Aptis để bàn giao cho dev web bán khoá.
 *
 * Khác với demo_templates/ (giao diện tự thiết kế lại), bản này COPY NGUYÊN
 * trang thi đang chạy + đúng CSS/JS của nó, chỉ gỡ phần đăng nhập và trỏ API
 * về domain Mini Hippo. Nhờ vậy giao diện giống hệt sản phẩm thật.
 *
 * Chạy lại mỗi khi trang gốc thay đổi:
 *   node tools/build_demo_export.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'demo_export');

const PAGES = [
  { src: 'reading_bode_set.html', out: 'reading.html', label: 'Reading' },
  { src: 'listening_bode_set.html', out: 'listening.html', label: 'Listening' },
  { src: 'speaking_question.html', out: 'speaking.html', label: 'Speaking' },
  { src: 'writing_question.html', out: 'writing.html', label: 'Writing' }
];

const CSS = [
  'css/lesson-ui.css', 'css/readingkey.css', 'css/listeningkey.css',
  'css/writingkey.css', 'css/demo_embed.css'
];

const JS = [
  'js/demo_embed.js', 'js/reading_bode_set.js', 'js/listening_bode_set.js',
  'js/speaking_bode_set.js', 'js/reading_order_arrows.js', 'js/home.js'
];

// Script KHÔNG mang sang bản xuất: đăng nhập + chặn copy (bài học thử không cần).
const DROP_SCRIPTS = ['js/auth.js', 'js/copy_paste_guard.js'];

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function copy(rel) {
  const from = path.join(ROOT, rel);
  if (!fs.existsSync(from)) { console.warn('  ! thiếu', rel); return false; }
  const to = path.join(OUT, rel);
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
  return true;
}

function transformPage(html, page) {
  let out = html;

  // 1. Gỡ script đăng nhập / chặn copy.
  for (const drop of DROP_SCRIPTS) {
    out = out.replace(new RegExp(`\\s*<script src="${drop.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}"[^>]*></script>`, 'g'), '');
  }

  // 2. Nạp file cấu hình TRƯỚC demo_embed.js (bật sẵn chế độ demo + domain + key).
  out = out.replace(
    /<script src="js\/demo_embed\.js"><\/script>/,
    '<script src="js/mh-demo-config.js"></script>\n    <script src="js/demo_embed.js"></script>'
  );

  // 3. Writing nạp bài bằng đường dẫn tương đối -> ghép domain Mini Hippo.
  if (page.out === 'writing.html') {
    out = out.replace(
      'const scriptUrl = `js/writing/${encodeURIComponent(lessonId)}.js?v=${encodeURIComponent(lessonId)}`;',
      'const mhBase = (window.MiniHippoDemo && window.MiniHippoDemo.base) || "";\n'
      + '                    const scriptUrl = `${mhBase}/js/writing/${encodeURIComponent(lessonId)}.js?v=${encodeURIComponent(lessonId)}`;'
    );
  }

  // 4. Ghi chú đầu file cho dev.
  out = out.replace('<head>',
    `<head>\n  <!-- BẢN XUẤT giao diện thật Aptis (${page.label}) — Mini Hippo.\n`
    + '       Sinh tự động bằng tools/build_demo_export.mjs, ĐỪNG sửa tay.\n'
    + '       Cấu hình domain + API key trong js/mh-demo-config.js -->');

  return out;
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  console.log('CSS:');
  CSS.forEach((f) => console.log('  ' + (copy(f) ? '✓' : '×') + ' ' + f));
  console.log('JS:');
  JS.forEach((f) => console.log('  ' + (copy(f) ? '✓' : '×') + ' ' + f));

  console.log('Trang:');
  for (const page of PAGES) {
    const from = path.join(ROOT, page.src);
    if (!fs.existsSync(from)) { console.warn('  × thiếu', page.src); continue; }
    const html = fs.readFileSync(from, 'utf8');
    fs.writeFileSync(path.join(OUT, page.out), transformPage(html, page), 'utf8');
    console.log(`  ✓ ${page.src} -> ${page.out}`);
  }

  // File cấu hình cho dev.
  fs.writeFileSync(path.join(OUT, 'js', 'mh-demo-config.js'), `/**
 * CẤU HÌNH BẢN XUẤT — sửa đúng file này là đủ.
 * Phải nạp TRƯỚC js/demo_embed.js (các trang đã làm sẵn).
 */
window.MH_DEMO_CONFIG = {
  // Bật sẵn chế độ học thử (không cần thêm ?demo=1 vào URL)
  force: true,
  // Domain Mini Hippo — nơi lấy đề, audio, ảnh
  base: 'https://minihippo.edu.vn',
  // API key do Mini Hippo cấp
  key: 'DAN_API_KEY_VAO_DAY'
};
`, 'utf8');
  console.log('  ✓ js/mh-demo-config.js');

  // Trang mở thử.
  fs.writeFileSync(path.join(OUT, 'index.html'), `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Mini Hippo — Giao diện thật Aptis (bản xuất)</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container py-4" style="max-width:860px">
    <h1 class="h4 fw-bold">Giao diện THẬT Aptis — bản xuất</h1>
    <p class="text-secondary">
      Đây là bản sao nguyên trang thi đang chạy (cùng HTML/CSS/JS), đã gỡ đăng nhập
      và trỏ dữ liệu về Mini Hippo. Sửa <code>js/mh-demo-config.js</code> rồi mở từng link.
    </p>
    <div class="alert alert-warning">
      Cần nhập <strong>id bài</strong> vào ô dưới (lấy từ <code>/api/demo/sets</code>
      hoặc <code>/api/demo/lessons</code>).
    </div>
    <div class="mb-3">
      <label class="form-label fw-semibold">Id bài (set / lesson)</label>
      <input class="form-control" id="sid" placeholder="vd a47ea4a8-d9db-4a60-9e13-5b66e624fe03">
    </div>
    <div class="list-group" id="links"></div>
  </div>
  <script src="js/mh-demo-config.js"></script>
  <script>
    var PAGES = [
      { f:'reading.html',   n:'Reading',   p:'set' },
      { f:'listening.html', n:'Listening', p:'set' },
      { f:'speaking.html',  n:'Speaking',  p:'set' },
      { f:'writing.html',   n:'Writing',   p:'lesson' }
    ];
    var box = document.getElementById('links'), sid = document.getElementById('sid');
    function render() {
      var id = sid.value.trim();
      box.innerHTML = PAGES.map(function (x) {
        var href = id ? x.f + '?' + x.p + '=' + encodeURIComponent(id) : x.f;
        return '<a class="list-group-item list-group-item-action d-flex justify-content-between" href="' + href + '">'
          + '<span><strong>' + x.n + '</strong> <small class="text-secondary">' + x.f + '</small></span>'
          + '<span class="text-primary">Mở &rarr;</span></a>';
      }).join('');
    }
    sid.addEventListener('input', render); render();
  </script>
</body>
</html>
`, 'utf8');
  console.log('  ✓ index.html');

  fs.writeFileSync(path.join(OUT, 'README.md'), `# Giao diện THẬT Aptis — bản xuất cho web bán khoá

Đây **không phải** giao diện thiết kế lại. Toàn bộ HTML/CSS/JS trong thư mục này
được **copy nguyên từ trang thi Aptis đang chạy**, nên hiển thị giống hệt sản phẩm thật.
Chỉ khác 2 điểm: **đã gỡ phần đăng nhập** và **dữ liệu lấy qua API học thử**.

## 1. Cấu hình (1 file duy nhất)

Sửa \`js/mh-demo-config.js\`:

\`\`\`js
window.MH_DEMO_CONFIG = {
  force: true,                        // bật sẵn chế độ học thử
  base:  'https://minihippo.edu.vn',  // domain Mini Hippo
  key:   'API_KEY_MINI_HIPPO_CAP'
};
\`\`\`

## 2. Mở bài

| Kỹ năng | File | Tham số |
|---|---|---|
| Reading | \`reading.html\` | \`?set=<SET_ID>\` |
| Listening | \`listening.html\` | \`?set=<SET_ID>\` |
| Speaking | \`speaking.html\` | \`?set=<SET_ID>\` |
| Writing | \`writing.html\` | \`?lesson=<LESSON_FILE>\` |

Lấy danh sách id: \`GET {base}/api/demo/sets?key=...\` và \`GET {base}/api/demo/lessons?key=...\`
(xem \`DEMO_API.md\`).

Mở \`index.html\` để bấm thử nhanh.

## 3. Nhúng vào web bán khoá

\`\`\`html
<iframe src="/demo_export/reading.html?set=<SET_ID>"
        width="100%" height="900" style="border:0" allow="microphone"></iframe>
\`\`\`

Hoặc copy thẳng markup trong các file \`.html\` vào template của web bán khoá —
nhớ mang theo \`css/\` và \`js/\` kèm theo.

## 4. Cấu trúc

\`\`\`
demo_export/
├─ index.html                 mở thử nhanh
├─ reading.html  listening.html  speaking.html  writing.html
├─ css/  lesson-ui.css + <kỹ năng>key.css + demo_embed.css
└─ js/   mh-demo-config.js  demo_embed.js  <engine từng kỹ năng>
\`\`\`

## 5. Lưu ý

- **Không sửa tay các file .html** — chúng được sinh tự động bằng
  \`tools/build_demo_export.mjs\` bên phía Mini Hippo. Trang gốc đổi thì chạy lại
  script để xuất bản mới.
- Audio/ảnh trong đề là **đường dẫn tương đối**; \`demo_embed.js\` tự ghép \`base\`
  vào nên phải khai báo \`base\` đúng.
- **Speaking cần HTTPS** (hoặc localhost) mới xin được quyền micro.
- Bài học thử **không lưu kết quả**, **không gọi AI chấm bài** — chấm tại chỗ trên
  trình duyệt. Writing/Speaking không có điểm tự động (chỗ mời đăng ký).
- Bootstrap nạp từ CDN; nếu web bán khoá đã có Bootstrap thì bỏ dòng CDN trong
  từng file để tránh nạp 2 lần.
`, 'utf8');
  console.log('  ✓ README.md');

  console.log('\\nXong. Thư mục: demo_export/');
}

build();
