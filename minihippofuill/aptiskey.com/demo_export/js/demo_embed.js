// ===================================================================
// CHẾ ĐỘ DEMO (bài học thử nhúng iframe trên web bán khoá học)
//
// Bật bằng query string:  ?demo=1&set=<id>&key=<DEMO_API_KEY>
//
// Khi bật:
//   - KHÔNG yêu cầu đăng nhập
//   - Lấy đề qua /api/demo/set (chỉ các bộ đề trong allowlist DEMO_SET_IDS)
//   - Chấm tại chỗ trên trình duyệt, KHÔNG gửi/ghi kết quả về hệ thống
//   - Ẩn header/sidebar/footer để nhúng iframe cho gọn
//
// File này phải được nạp TRƯỚC các file engine (reading_bode_set.js, ...).
// Mọi thứ đều nằm sau cờ MiniHippoDemo.active nên luồng học viên thật
// không bị ảnh hưởng.
// ===================================================================
(function () {
    var params = new URLSearchParams(window.location.search);
    // MH_DEMO_CONFIG cho phép bản XUẤT (chạy trên domain của web bán khoá) bật
    // sẵn chế độ demo và trỏ về domain Mini Hippo, không cần query string.
    var preset = window.MH_DEMO_CONFIG || {};
    var active = params.get('demo') === '1' || preset.force === true;
    var key = params.get('key') || preset.key || '';
    // Domain Mini Hippo. Để trống = cùng domain (khi chạy ngay trên site gốc).
    var base = (params.get('base') || preset.base || '').replace(/\/+$/, '');

    var api = {
        active: active,
        key: key,
        base: base,
        // Ghép domain cho ảnh/audio có đường dẫn tương đối trong dữ liệu đề.
        mediaUrl: function (url) {
            var value = String(url || '').trim();
            if (!value) return '';
            if (/^(https?:|data:|blob:)/i.test(value)) return value;
            return base + '/' + value.replace(/^\/+/, '');
        },
        // URL lấy nội dung đề cho chế độ demo.
        setUrl: function (setId) {
            return base + '/api/demo/set?id=' + encodeURIComponent(setId) +
                '&key=' + encodeURIComponent(key);
        },
        // Link đăng ký hiển thị ở màn hình kết quả (web bán khoá truyền vào).
        ctaUrl: params.get('cta') || '',
        ctaLabel: params.get('ctaLabel') || 'Đăng ký học thật'
    };

    window.MiniHippoDemo = api;

    if (!active) return;

    // Ẩn khung trang để iframe chỉ còn phần làm bài.
    function markBody() {
        if (document.body) document.body.classList.add('mh-demo-embed');
    }
    if (document.body) markBody();
    else document.addEventListener('DOMContentLoaded', markBody);

    // Chặn mọi lần gửi kết quả: bài học thử không lưu gì về hệ thống.
    window.submitPracticeResult = function () {
        return Promise.resolve(false);
    };

    // Chặn gọi AI chấm bài ở bản học thử. /api/ask hiện không có auth/rate limit,
    // để lộ trên web bán khoá công khai sẽ tốn tiền AI và dễ bị lạm dụng.
    // Trả về thông điệp mời đăng ký thay vì gọi thật.
    var nativeFetch = window.fetch ? window.fetch.bind(window) : null;
    if (nativeFetch) {
        window.fetch = function (input, init) {
            var url = typeof input === 'string' ? input : (input && input.url) || '';
            if (/\/api\/ask(\?|$|\/)/.test(url)) {
                var body = JSON.stringify({
                    demoBlocked: true,
                    reply: 'Đây là bài học thử. Đăng ký khoá học để nhận nhận xét chi tiết từ AI và giáo viên.'
                });
                return Promise.resolve(new Response(body, {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            return nativeFetch(input, init);
        };
    }

    // Khi bản xuất chạy trên DOMAIN KHÁC, audio/ảnh trong dữ liệu đề là đường
    // dẫn tương đối (vd "audio/question1_13/a.mp3") nên sẽ 404. Theo dõi DOM và
    // tự ghép domain Mini Hippo vào các src tương đối.
    if (base) {
        var fixMedia = function (root) {
            if (!root || !root.querySelectorAll) return;
            var nodes = root.querySelectorAll('audio[src], img[src], source[src], video[src]');
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                var raw = el.getAttribute('src') || '';
                if (!raw || /^(https?:|data:|blob:|\/\/)/i.test(raw)) continue;
                if (el.dataset && el.dataset.mhFixed) continue;
                el.setAttribute('src', api.mediaUrl(raw));
                if (el.dataset) el.dataset.mhFixed = '1';
            }
        };
        var startMediaFix = function () {
            fixMedia(document);
            if (window.MutationObserver) {
                new MutationObserver(function () { fixMedia(document); })
                    .observe(document.documentElement, { childList: true, subtree: true });
            }
        };
        if (document.documentElement) startMediaFix();
        else document.addEventListener('DOMContentLoaded', startMediaFix);
    }

    // Bỏ qua guard đăng nhập (người vào web bán khoá chưa có tài khoản).
    window.requireAuth = function () { return Promise.resolve(true); };
    window.requireAdmin = function () { return Promise.resolve(false); };
    window.getAuthToken = function () { return ''; };
    window.getCurrentUser = function () { return null; };
})();
