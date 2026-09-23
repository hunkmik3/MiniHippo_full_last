/**
 * Dựng bản XUẤT giao diện THẬT của Aptis + VSTEP để bàn giao cho dev web bán khoá.
 *
 * Khác với demo_templates/ (giao diện tự thiết kế lại), bản này COPY NGUYÊN
 * trang học/thi đang chạy + đúng CSS/JS của nó, chỉ gỡ phần đăng nhập và nạp
 * js/demo_embed.js (chuyển API nội bộ sang API học thử). Nhờ vậy giao diện
 * giống hệt sản phẩm thật.
 *
 * Chạy lại mỗi khi trang gốc thay đổi:
 *   node tools/build_demo_export.mjs
 *
 * Mọi chỗ sửa trên bản sao đều kiểm tra số lần khớp: trang gốc đổi mà không
 * khớp nữa thì script DỪNG với lỗi rõ ràng, không lặng lẽ xuất bản hỏng.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'demo_export');

// section/group chỉ để dựng README + trang index.
const PAGES = [
  // ── Aptis · Học theo câu hỏi ──
  { src: 'reading_question1.html', out: 'reading_part1.html', label: 'Reading · Part 1', param: 'lesson' },
  { src: 'reading_question2.html', out: 'reading_part2.html', label: 'Reading · Part 2 & 3', param: 'lesson' },
  { src: 'reading_question4.html', out: 'reading_part4.html', label: 'Reading · Part 4', param: 'lesson' },
  { src: 'reading_question5.html', out: 'reading_part5.html', label: 'Reading · Part 5', param: 'lesson' },
  { src: 'listening_question1_13.html', out: 'listening_q1_13.html', label: 'Listening · Question 1-13', param: 'lesson' },
  { src: 'listening_question14.html', out: 'listening_q14.html', label: 'Listening · Question 14', param: 'lesson' },
  { src: 'listening_question15.html', out: 'listening_q15.html', label: 'Listening · Question 15', param: 'lesson' },
  { src: 'listening_question16_17.html', out: 'listening_q16_17.html', label: 'Listening · Question 16 & 17', param: 'lesson' },
  { src: 'speaking_cauhoi_part.html', out: 'speaking_part.html', label: 'Speaking · Học theo câu hỏi', param: 'set' },
  // ── Aptis · Học theo bộ đề ──
  { src: 'reading_bode_set.html', out: 'reading.html', label: 'Reading · Bộ đề', param: 'set' },
  { src: 'listening_bode_set.html', out: 'listening.html', label: 'Listening · Bộ đề', param: 'set' },
  { src: 'speaking_question.html', out: 'speaking.html', label: 'Speaking · Bộ đề', param: 'set' },
  { src: 'writing_question.html', out: 'writing.html', label: 'Writing · Bộ đề', param: 'lesson' },
  // ── VSTEP ──
  { src: 'vstep_exam.html', out: 'vstep.html', label: 'VSTEP · Phòng thi', param: 'set' }
];

// Script KHÔNG mang sang bản xuất: đăng nhập + chặn copy (bài học thử không cần).
// demo_embed.js tự thay các hàm của auth.js bằng bản giả.
const DROP_SCRIPTS = ['js/auth.js', 'js/copy_paste_guard.js'];

// Chỗ chuyển trang bằng JS sang trang không có trong bản xuất (danh sách, lịch
// sử, trang chủ...) -> MiniHippoDemo.exit(): báo cho trang cha + về homeUrl.
// Link <a> thì demo_embed.js tự chặn lúc chạy, không cần sửa ở đây.
const JS_PATCHES = {
  'js/vstep_exam.js': [
    { find: "window.location.href = '/vstep_bode.html';", replace: "window.MiniHippoDemo.exit('/vstep_bode.html');", count: 2 }
  ],
  'js/speaking_cauhoi_part.js': [
    { find: "window.location.href = 'speaking_cauhoi.html';", replace: "window.MiniHippoDemo.exit('speaking_cauhoi.html');", count: 1 },
    {
      find: "window.location.href = buoiId ? 'lop_hoc.html' : 'speaking_cauhoi.html';",
      replace: "window.MiniHippoDemo.exit(buoiId ? 'lop_hoc.html' : 'speaking_cauhoi.html');",
      count: 1
    }
  ],
  'js/speaking_bode_set.js': [
    { find: "window.location.href = 'lesson_history.html';", replace: "window.MiniHippoDemo.exit('lesson_history.html');", count: 1 }
  ],
  'js/reading_bode_set.js': [
    { find: 'window.location.href = returnPage;', replace: 'window.MiniHippoDemo.exit(returnPage);', count: 1 }
  ],
  'js/listening_bode_set.js': [
    { find: 'window.location.href = returnPage;', replace: 'window.MiniHippoDemo.exit(returnPage);', count: 1 }
  ]
};

const PAGE_PATCHES = {
  'writing.html': [
    // Writing nạp bài bằng đường dẫn tương đối -> ghép domain Mini Hippo.
    {
      find: 'const scriptUrl = `js/writing/${encodeURIComponent(lessonId)}.js?v=${encodeURIComponent(lessonId)}`;',
      replace: 'const mhBase = (window.MiniHippoDemo && window.MiniHippoDemo.base) || "";\n'
        + '                    const scriptUrl = `${mhBase}/js/writing/${encodeURIComponent(lessonId)}.js?v=${encodeURIComponent(lessonId)}`;',
      count: 1
    },
    // Nộp xong tự về trang chủ sau vài giây.
    { find: "window.location.href = 'home.html';", replace: "window.MiniHippoDemo.exit('home.html');", count: 1 }
  ]
};

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function escapeRegExp(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function applyPatches(text, patches, fileLabel) {
  let out = text;
  for (const patch of patches || []) {
    const found = out.split(patch.find).length - 1;
    if (found !== patch.count) {
      throw new Error(`${fileLabel}: cần khớp ${patch.count} lần nhưng thấy ${found} lần:\n  ${patch.find}\n`
        + '→ Trang gốc đã đổi, cập nhật lại PATCH trong tools/build_demo_export.mjs.');
    }
    out = out.split(patch.find).join(patch.replace);
  }
  return out;
}

const TEXT_ASSET = /\.(css|js)$/i;
const IMAGE_ASSET = /\.(png|jpe?g|gif|svg|webp|ico)$/i;

// File CSS/JS/ảnh cục bộ mà trang tham chiếu (bỏ CDN, bỏ script đăng nhập).
function localAssets(html) {
  const assets = new Set();
  const re = /<(?:link[^>]+href|script[^>]+src|img[^>]+src)="([^"]+)"/g;
  let match;
  while ((match = re.exec(html))) {
    const ref = match[1].split('?')[0].replace(/^\.?\//, '');
    if (/^(https?:|data:)?\/\//i.test(match[1]) || /^data:/i.test(match[1])) continue;
    if (!TEXT_ASSET.test(ref) && !IMAGE_ASSET.test(ref)) continue;
    if (DROP_SCRIPTS.includes(ref)) continue;
    assets.add(ref);
  }
  return [...assets];
}

function transformPage(html, page) {
  let out = html;

  // 1. Gỡ script đăng nhập / chặn copy và thẻ demo_embed.js cũ (nạp lại ở đầu <head>).
  for (const drop of [...DROP_SCRIPTS, 'js/demo_embed.js']) {
    out = out.replace(new RegExp(`[ \\t]*<script[^>]+src="${escapeRegExp(drop)}[^"]*"[^>]*>\\s*</script>[ \\t]*\\n?`, 'g'), '');
  }

  // 2. Cấu hình + demo_embed.js phải chạy TRƯỚC mọi script khác của trang (trang
  //    câu hỏi gọi API ngay trong <head>) -> chèn ngay sau <meta charset>.
  const boot = '\n    <!-- BẢN XUẤT giao diện thật Mini Hippo (' + page.label + ').\n'
    + '         Sinh tự động bằng tools/build_demo_export.mjs, ĐỪNG sửa tay.\n'
    + '         Cấu hình domain + API key trong js/mh-demo-config.js -->\n'
    + '    <script src="js/mh-demo-config.js"></script>\n'
    + '    <script src="js/demo_embed.js"></script>';
  const charset = out.match(/<meta[^>]+charset[^>]*>/i);
  if (charset) out = out.replace(charset[0], charset[0] + boot);
  else out = out.replace(/<head[^>]*>/i, (tag) => tag + boot);

  // 3. CSS ẩn khung Mini Hippo khi nhúng.
  if (!out.includes('css/demo_embed.css')) {
    out = out.replace('</head>', '  <link rel="stylesheet" href="css/demo_embed.css">\n</head>');
  }

  return applyPatches(out, PAGE_PATCHES[page.out], page.out);
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  ensureDir(OUT);

  const assets = new Set(['js/demo_embed.js', 'css/demo_embed.css']);
  const pages = [];
  for (const page of PAGES) {
    const from = path.join(ROOT, page.src);
    if (!fs.existsSync(from)) throw new Error(`Thiếu trang gốc ${page.src}`);
    const html = fs.readFileSync(from, 'utf8');
    localAssets(html).forEach((asset) => assets.add(asset));
    pages.push({ page, html: transformPage(html, page) });
  }

  console.log('Tài nguyên:');
  for (const rel of [...assets].sort()) {
    const from = path.join(ROOT, rel);
    if (!fs.existsSync(from)) {
      // Ảnh thiếu ngay trên site gốc: bỏ qua (demo_embed.js vẫn trỏ về Mini Hippo).
      if (IMAGE_ASSET.test(rel)) { console.log(`  · bỏ qua ảnh không có trên site gốc: ${rel}`); continue; }
      throw new Error(`Thiếu file ${rel}`);
    }
    const to = path.join(OUT, rel);
    ensureDir(path.dirname(to));
    if (IMAGE_ASSET.test(rel)) {
      fs.copyFileSync(from, to);
    } else {
      const content = fs.readFileSync(from, 'utf8');
      fs.writeFileSync(to, applyPatches(content, JS_PATCHES[rel], rel), 'utf8');
    }
    console.log(`  ✓ ${rel}${JS_PATCHES[rel] ? ' (đã nối nút rời bài)' : ''}`);
  }
  for (const rel of Object.keys(JS_PATCHES)) {
    if (!assets.has(rel)) throw new Error(`${rel} có PATCH nhưng không trang nào dùng`);
  }

  console.log('Trang:');
  for (const { page, html } of pages) {
    fs.writeFileSync(path.join(OUT, page.out), html, 'utf8');
    console.log(`  ✓ ${page.src} -> ${page.out}`);
  }

  // File cấu hình cho dev.
  fs.writeFileSync(path.join(OUT, 'js', 'mh-demo-config.js'), `/**
 * CẤU HÌNH BẢN XUẤT — sửa đúng file này là đủ.
 * Mọi trang đã nạp file này TRƯỚC js/demo_embed.js.
 */
window.MH_DEMO_CONFIG = {
  // Bật sẵn chế độ học thử (không cần thêm ?demo=1 vào URL)
  force: true,
  // Domain Mini Hippo — nơi lấy đề, audio, ảnh
  base: 'https://www.minihippo.edu.vn',
  // API key do Mini Hippo cấp
  key: 'DAN_API_KEY_VAO_DAY',
  // Trang mở khi học viên bấm "quay lại danh sách" / "về trang chủ" trong bài.
  // Để '' nếu muốn ở lại trang (trang cha vẫn nhận được postMessage, xem README).
  homeUrl: 'index.html'
};
`, 'utf8');
  console.log('  ✓ js/mh-demo-config.js');

  fs.writeFileSync(path.join(OUT, 'index.html'), buildIndexHtml(), 'utf8');
  console.log('  ✓ index.html');
  fs.writeFileSync(path.join(OUT, 'README.md'), buildReadme(), 'utf8');
  console.log('  ✓ README.md');

  console.log('\nXong. Thư mục: demo_export/');
}

function buildIndexHtml() {
  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>Mini Hippo — Giao diện thật (bản xuất)</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body { background: #f5f7fb; }
    .group-title { font-size: .8rem; letter-spacing: .04em; text-transform: uppercase; color: #64748b; }
    .item-link { display: flex; justify-content: space-between; gap: 1rem; }
    .item-link code { font-size: .75rem; color: #64748b; }
  </style>
</head>
<body>
  <div class="container py-4" style="max-width: 980px">
    <h1 class="h4 fw-bold mb-1">Giao diện THẬT Mini Hippo — bản xuất</h1>
    <p class="text-secondary">
      Bản sao nguyên các trang học/thi đang chạy (cùng HTML/CSS/JS), đã gỡ đăng nhập và lấy dữ liệu
      qua API học thử. Danh sách dưới đây lấy trực tiếp từ API catalog — bấm để mở đúng bài.
      Mỗi bài có <code>embedUrl</code>: ghép sau đường dẫn thư mục này là ra link iframe.
    </p>
    <div id="status" class="alert alert-info">Đang tải danh mục…</div>
    <ul class="nav nav-tabs mb-3" id="tabs" role="tablist" style="display:none">
      <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#aptis" type="button">Aptis</button></li>
      <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#vstep" type="button">VSTEP</button></li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane fade show active" id="aptis"></div>
      <div class="tab-pane fade" id="vstep"></div>
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/mh-demo-config.js"></script>
  <script>
    (function () {
      var cfg = window.MH_DEMO_CONFIG || {};
      var base = String(cfg.base || '').replace(/\\/+$/, '');
      var statusEl = document.getElementById('status');

      function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
      }
      function getJson(path) {
        return fetch(base + path, { headers: { 'X-Demo-Key': cfg.key || '' } }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok) throw new Error((data && data.error) || ('HTTP ' + res.status));
            return data;
          });
        });
      }
      function renderItems(items) {
        if (!items.length) return '<div class="list-group-item text-secondary small">Chưa có bài.</div>';
        return items.map(function (item) {
          if (!item.embedUrl) {
            return '<div class="list-group-item text-secondary">' + esc(item.title) + ' <small>(không mở được)</small></div>';
          }
          return '<a class="list-group-item list-group-item-action item-link" href="' + esc(item.embedUrl) + '">'
            + '<span>' + esc(item.title) + '</span><code>' + esc(item.embedUrl.split('?')[0]) + '</code></a>';
        }).join('');
      }
      function renderGroup(title, items) {
        return '<div class="mb-3"><div class="group-title mb-1">' + esc(title) + ' · ' + items.length + '</div>'
          + '<div class="list-group">' + renderItems(items) + '</div></div>';
      }

      Promise.all([getJson('/api/lessons/demo-catalog'), getJson('/api/vstep/demo/catalog')])
        .then(function (results) {
          var aptis = results[0], vstep = results[1];
          document.getElementById('aptis').innerHTML = (aptis.skills || []).map(function (skill) {
            return '<h2 class="h5 mt-4">' + esc(skill.label) + '</h2>' + skill.modes.map(function (mode) {
              return mode.groups.map(function (group) {
                return renderGroup(mode.label + ' — ' + group.label, group.items || []);
              }).join('');
            }).join('');
          }).join('');
          document.getElementById('vstep').innerHTML = (vstep.groups || []).map(function (group) {
            return renderGroup(group.label, group.items || []);
          }).join('');
          statusEl.style.display = 'none';
          document.getElementById('tabs').style.display = '';
        })
        .catch(function (error) {
          statusEl.className = 'alert alert-danger';
          statusEl.innerHTML = 'Không tải được danh mục: <strong>' + esc(error.message) + '</strong><br>'
            + 'Kiểm tra <code>js/mh-demo-config.js</code> (base, key) và domain đã được Mini Hippo cho phép '
            + '(biến DEMO_ALLOWED_ORIGINS), xem README mục 5.';
        });
    })();
  </script>
</body>
</html>
`;
}

function buildReadme() {
  const rows = PAGES.map((p) => `| ${p.label} | \`${p.out}\` | \`?${p.param}=…\` |`).join('\n');
  return `# Giao diện THẬT Mini Hippo — bản xuất cho web bán khoá

Đây **không phải** giao diện thiết kế lại. Toàn bộ HTML/CSS/JS trong thư mục này
được **copy nguyên từ các trang học/thi đang chạy** trên Mini Hippo (Aptis cả
"học theo câu hỏi" lẫn "học theo bộ đề", và phòng thi VSTEP), nên hiển thị giống
hệt sản phẩm thật. Chỉ khác: **đã gỡ đăng nhập**, **dữ liệu lấy qua API học thử**,
**không lưu kết quả**.

## 1. Cấu hình (1 file duy nhất)

Sửa \`js/mh-demo-config.js\`:

\`\`\`js
window.MH_DEMO_CONFIG = {
  force: true,                            // bật sẵn chế độ học thử
  base:  'https://www.minihippo.edu.vn',  // domain Mini Hippo
  key:   'API_KEY_MINI_HIPPO_CAP',
  homeUrl: 'index.html'                   // nút "quay lại" trong bài mở trang này
};
\`\`\`

## 2. Các trang

| Phần | File | Tham số |
|---|---|---|
${rows}

**Không cần tự ghép tham số**: mỗi bài trong API catalog có sẵn trường
\`embedUrl\` (vd \`reading_part1.html?lesson=78935751-…\`), đường dẫn tương đối
so với thư mục này:

- Aptis: \`GET {base}/api/lessons/demo-catalog\` → \`skills[].modes[].groups[].items[].embedUrl\`
- VSTEP: \`GET {base}/api/vstep/demo/catalog\` → \`groups[].items[].embedUrl\`

Mở \`index.html\` để xem toàn bộ danh mục và bấm thử từng bài.

## 3. Nhúng vào web bán khoá

\`\`\`html
<iframe src="/demo_export/{embedUrl}"
        width="100%" height="900" style="border:0"
        allow="microphone; camera; fullscreen; autoplay" allowfullscreen></iframe>
\`\`\`

- \`microphone\`: Speaking (Aptis + VSTEP) ghi âm.
- \`camera\` + \`fullscreen\`: phòng thi VSTEP kiểm tra webcam và vào chế độ toàn màn hình như thi thật.
- Cần chạy trên **HTTPS** (hoặc localhost) thì trình duyệt mới cho dùng micro/webcam.

**Nút rời bài** (quay lại danh sách, về trang chủ, hết bài): trang gửi
\`postMessage\` lên trang cha rồi chuyển sang \`homeUrl\`:

\`\`\`js
window.addEventListener('message', (e) => {
  if (e.data && e.data.source === 'minihippo-demo' && e.data.type === 'exit') {
    // vd đóng popup chứa iframe, quay về danh sách khoá học...
  }
});
\`\`\`

Muốn tự xử lý hoàn toàn thì đặt \`homeUrl: ''\` (trang đứng yên, chỉ gửi message).

## 4. Cấu trúc

\`\`\`
demo_export/
├─ index.html          danh mục toàn bộ bài (lấy từ API catalog)
├─ reading_part*.html  listening_q*.html  speaking_part.html   ← học theo câu hỏi
├─ reading.html  listening.html  speaking.html  writing.html   ← học theo bộ đề
├─ vstep.html                                                  ← phòng thi VSTEP
├─ css/   CSS gốc của từng trang + demo_embed.css
└─ js/    mh-demo-config.js  demo_embed.js  <engine gốc từng trang>
\`\`\`

## 5. Lưu ý

- **Domain của web bán khoá phải được Mini Hippo cho phép** (biến
  \`DEMO_ALLOWED_ORIGINS\` phía Mini Hippo). Chưa cho phép thì trình duyệt chặn
  (lỗi CORS) → trang báo không tải được bài. Gửi Mini Hippo domain chính xác,
  vd \`https://nightowl.edu.vn\`.
- **Không sửa tay các file .html/.js** — chúng được sinh tự động bằng
  \`tools/build_demo_export.mjs\` bên phía Mini Hippo. Trang gốc đổi thì Mini Hippo
  chạy lại script và gửi bản mới.
- Audio/ảnh có đường dẫn tương đối được \`demo_embed.js\` tự ghép \`base\` → phải
  khai báo \`base\` đúng.
- Bài học thử **không lưu kết quả**, **không gọi AI chấm bài**: Reading/Listening
  chấm tại chỗ trên trình duyệt; Writing/Speaking nộp xong chỉ hiện thông báo hoàn
  thành (ghi âm không được tải lên máy chủ).
- API key nằm trong \`js/mh-demo-config.js\` nên ai mở trang cũng xem được — đây là
  key chỉ đọc nội dung bài học thử, không truy cập được dữ liệu học viên.
- Bootstrap nạp từ CDN; nếu web bán khoá đã có Bootstrap thì bỏ dòng CDN trong
  từng file để tránh nạp 2 lần.
`;
}

build();
