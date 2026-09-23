// ===================================================================
// CHẾ ĐỘ DEMO (bài học thử nhúng iframe trên web bán khoá học)
//
// Bật bằng query string:  ?demo=1&set=<id>&key=<DEMO_API_KEY>
// hoặc bằng window.MH_DEMO_CONFIG = { force: true, base, key, homeUrl }
// (bộ giao diện xuất demo_export/ nạp sẵn file cấu hình này).
//
// Khi bật:
//   - KHÔNG yêu cầu đăng nhập (thay các hàm của auth.js bằng bản giả)
//   - Mọi lời gọi API nội bộ của trang thi được chuyển sang API học thử
//     (/api/practice_sets/demo-set, /api/lessons/demo-lesson, /api/vstep/demo/...)
//   - Chấm tại chỗ trên trình duyệt; nộp bài / upload ghi âm trả "thành công"
//     nhưng KHÔNG gửi/ghi gì về hệ thống
//   - Ẩn header/sidebar/footer để nhúng iframe cho gọn
//   - Link/nút rời bài (quay lại danh sách, về trang chủ) gọi MiniHippoDemo.exit()
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
    // Trang mở khi học viên bấm rời bài. Trống = ở lại trang, chỉ báo cho trang cha.
    var homeUrl = params.get('home') || preset.homeUrl || '';

    function withKey(url) {
        return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'key=' + encodeURIComponent(key);
    }

    // Đường dẫn tương đối (vd "audio/q1/a.mp3") -> URL đầy đủ trên Mini Hippo.
    function absoluteMediaUrl(url) {
        var value = String(url == null ? '' : url).trim();
        if (!value) return '';
        if (/^(https?:|data:|blob:|\/\/|about:|javascript:|#)/i.test(value)) return value;
        return base + '/' + value.replace(/^\.?\/+/, '');
    }

    var api = {
        active: active,
        key: key,
        base: base,
        // Ghép domain cho ảnh/audio có đường dẫn tương đối trong dữ liệu đề.
        mediaUrl: absoluteMediaUrl,
        // URL lấy nội dung đề cho chế độ demo.
        setUrl: function (setId) {
            return withKey(base + '/api/practice_sets/demo-set?id=' + encodeURIComponent(setId));
        },
        // Link đăng ký hiển thị ở màn hình kết quả (web bán khoá truyền vào).
        ctaUrl: params.get('cta') || '',
        ctaLabel: params.get('ctaLabel') || 'Đăng ký học thật',
        // Rời bài học thử: báo cho trang cha (khi nhúng iframe) rồi mới chuyển
        // sang homeUrl nếu có cấu hình. Không ở chế độ demo thì đi tới trang gốc.
        exit: function (target) {
            if (!active) {
                if (target) window.location.href = target;
                return;
            }
            try {
                if (window.parent && window.parent !== window) {
                    window.parent.postMessage({
                        source: 'minihippo-demo',
                        type: 'exit',
                        target: String(target || '')
                    }, '*');
                }
            } catch (error) { /* trang cha khác domain: bỏ qua */ }
            if (homeUrl) window.location.href = homeUrl;
        }
    };

    window.MiniHippoDemo = api;

    if (!active) return;

    // Ẩn khung trang để iframe chỉ còn phần làm bài.
    function markBody() {
        if (document.body) document.body.classList.add('mh-demo-embed');
    }
    if (document.body) markBody();
    else document.addEventListener('DOMContentLoaded', markBody);

    // ── Đăng nhập: người vào web bán khoá chưa có tài khoản ──
    // Bản xuất không nạp auth.js; trên site gốc thì ghi đè auth.js (nạp trước).
    var noop = function () {};
    var authStubs = {
        requireAuth: function () { return Promise.resolve(true); },
        requireAdmin: function () { return Promise.resolve(false); },
        checkAuth: function () { return Promise.resolve(true); },
        ensureAuthToken: function () { return Promise.resolve(''); },
        ensureAuthTokenInteractive: function () { return Promise.resolve(''); },
        refreshAuthToken: function () { return Promise.resolve(null); },
        getAuthToken: function () { return ''; },
        getCurrentUser: function () { return null; },
        isAdmin: function () { return false; },
        getDeviceId: function () { return 'demo-device'; },
        getDeviceName: function () { return 'Demo'; },
        buildDeviceHeaders: function () { return {}; },
        startTokenRefreshTimer: noop,
        stopTokenRefreshTimer: noop,
        showReLoginModal: noop,
        logout: noop,
        clearAuth: noop,
        // Bài học thử không lưu kết quả, nhưng báo "thành công" để trang hiện
        // màn hoàn thành như thật (trả false thì Speaking/Writing báo lỗi nộp bài).
        submitPracticeResult: function () { return Promise.resolve(true); }
    };
    Object.keys(authStubs).forEach(function (name) { window[name] = authStubs[name]; });

    // ── Chuyển API nội bộ sang API học thử ──
    var nativeFetch = window.fetch ? window.fetch.bind(window) : null;
    // file_path -> { source, scriptUrl } của bài "học theo câu hỏi" đã tải.
    var lessonSources = {};

    function jsonResponse(body, status) {
        return new Response(JSON.stringify(body), {
            status: status || 200,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    function readJson(response) {
        return response.json().catch(function () { return {}; });
    }

    var NOT_SAVED = { success: true, demo: true, message: 'Bài học thử: không lưu dữ liệu.' };

    var routes = {
        // /api/ask chưa có auth/rate limit: để lộ trên web công khai sẽ tốn tiền AI
        // và dễ bị lạm dụng -> trả thông điệp mời đăng ký.
        '/api/ask': function () {
            return jsonResponse({
                demoBlocked: true,
                reply: 'Đây là bài học thử. Đăng ký khoá học để nhận nhận xét chi tiết từ AI và giáo viên.'
            });
        },
        '/api/practice_results/submit': function () {
            return jsonResponse(Object.assign({ result: { id: 'demo' } }, NOT_SAVED));
        },
        '/api/vstep/results/submit': function () {
            return jsonResponse(Object.assign({ result: { id: 'demo' } }, NOT_SAVED));
        },
        '/api/upload-speaking-recording': function () {
            return jsonResponse(Object.assign({ rawUrl: '', url: '', filePath: '' }, NOT_SAVED));
        },
        '/api/upload-audio': function () {
            return jsonResponse(Object.assign({ rawUrl: '', url: '', filePath: '' }, NOT_SAVED));
        },
        '/api/visitor-count': function () {
            return jsonResponse({ success: true, demo: true });
        },
        // Danh sách lớp / nội dung buổi học chỉ dùng cho Lớp Học -> bài học thử không có.
        '/api/practice_sets/list': function () {
            return jsonResponse({ sets: [] });
        },
        '/api/practice_sets/get': function (u) {
            return nativeFetch(api.setUrl(u.searchParams.get('id') || ''));
        },
        '/api/vstep/contents/get': function (u) {
            return nativeFetch(withKey(base + '/api/vstep/demo/content?id='
                + encodeURIComponent(u.searchParams.get('id') || '')));
        },
        // Trang câu hỏi: get (lấy file_path) -> get-script-url / get-script (mã bài).
        // Lấy 1 lần cả mã nguồn ở bước get, 2 bước sau trả từ bộ nhớ.
        '/api/lessons/get': function (u) {
            var url = withKey(base + '/api/lessons/demo-lesson?format=source&id='
                + encodeURIComponent(u.searchParams.get('id') || ''));
            return nativeFetch(url).then(function (response) {
                return readJson(response).then(function (data) {
                    if (!response.ok || !data.lesson) {
                        return jsonResponse({ error: data.error || 'Không tải được bài học.' }, response.status || 502);
                    }
                    lessonSources[data.lesson.file_path] = {
                        source: data.source || '',
                        scriptUrl: data.scriptUrl || ''
                    };
                    return jsonResponse({ lesson: data.lesson });
                });
            });
        },
        '/api/lessons/get-script': function (u) {
            var entry = lessonSources[u.searchParams.get('filePath') || ''];
            if (!entry) return jsonResponse({ error: 'Chưa tải thông tin bài học.' }, 404);
            return new Response(entry.source, {
                status: 200,
                headers: { 'Content-Type': 'application/javascript; charset=utf-8' }
            });
        },
        '/api/lessons/get-script-url': function (u) {
            var entry = lessonSources[u.searchParams.get('filePath') || ''];
            if (!entry) return jsonResponse({ error: 'Chưa tải thông tin bài học.' }, 404);
            return jsonResponse({ scriptUrl: entry.scriptUrl });
        },
        // Trang câu hỏi mở không kèm ?lesson= thì tự chuyển tới bài mới nhất.
        '/api/lessons/list': function (u) {
            var url = withKey(base + '/api/lessons/demo-lessons?part='
                + encodeURIComponent(u.searchParams.get('part') || ''));
            return nativeFetch(url).then(function (response) {
                return readJson(response).then(function (data) {
                    var lessons = (Array.isArray(data.lessons) ? data.lessons : []).map(function (lesson) {
                        return {
                            id: lesson.id,
                            part: lesson.part,
                            title: lesson.title,
                            topic: lesson.topic,
                            num_sets: lesson.numSets
                        };
                    });
                    return jsonResponse({ success: response.ok, lessons: lessons }, response.status);
                });
            });
        }
    };

    if (nativeFetch) {
        window.fetch = function (input, init) {
            var raw = typeof input === 'string' ? input : (input && input.url) || String(input || '');
            var u = null;
            try { u = new URL(raw, window.location.href); } catch (error) { u = null; }
            // Chỉ xử lý API nội bộ (đường dẫn tương đối / cùng domain). URL tuyệt
            // đối tới Mini Hippo (API học thử, audio...) đi thẳng như bình thường.
            if (!u || u.origin !== window.location.origin || u.pathname.indexOf('/api/') !== 0) {
                return nativeFetch(input, init);
            }
            var route = routes[u.pathname.replace(/\/+$/, '')];
            if (route) return Promise.resolve(route(u, init));
            // API khác: gọi sang Mini Hippo (bản xuất chạy trên domain khác).
            return base ? nativeFetch(base + u.pathname + u.search, init) : nativeFetch(input, init);
        };
    }

    // ── Rời bài: link sang trang khác của Mini Hippo (danh sách, lịch sử...) ──
    // Trên web bán khoá các trang đó không tồn tại -> gọi exit() thay vì chuyển trang.
    document.addEventListener('click', function (event) {
        var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
        if (!link || event.defaultPrevented) return;
        var href = link.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#' || /^(javascript:|mailto:|tel:)/i.test(href)) return;
        var u = null;
        try { u = new URL(href, window.location.href); } catch (error) { return; }
        // Link ra ngoài (vd nút đăng ký của web bán khoá) và link trong cùng trang: giữ nguyên.
        if (u.origin !== window.location.origin || u.pathname === window.location.pathname) return;
        event.preventDefault();
        api.exit(href);
    }, true);

    // ── Audio/ảnh: bản xuất chạy trên DOMAIN KHÁC ──
    // Dữ liệu đề có đường dẫn tương đối (vd "audio/question1_13/a.mp3") nên sẽ 404.
    // Ghép domain Mini Hippo vào mọi src tương đối: cả khi gán qua thuộc tính
    // (el.src = ..., new Audio(...)) lẫn khi chèn HTML (innerHTML, setAttribute).
    if (base) {
        var patchSrc = function (Ctor) {
            if (!Ctor || !Ctor.prototype) return;
            var desc = Object.getOwnPropertyDescriptor(Ctor.prototype, 'src');
            if (!desc || !desc.set || !desc.configurable) return;
            Object.defineProperty(Ctor.prototype, 'src', {
                configurable: true,
                enumerable: desc.enumerable,
                get: desc.get,
                set: function (value) { desc.set.call(this, absoluteMediaUrl(value)); }
            });
        };
        patchSrc(window.HTMLMediaElement);
        patchSrc(window.HTMLImageElement);
        patchSrc(window.HTMLSourceElement);

        var NativeAudio = window.Audio;
        if (NativeAudio) {
            var DemoAudio = function (src) {
                return arguments.length ? new NativeAudio(absoluteMediaUrl(src)) : new NativeAudio();
            };
            DemoAudio.prototype = NativeAudio.prototype;
            window.Audio = DemoAudio;
        }

        var fixMedia = function (root) {
            if (!root || !root.querySelectorAll) return;
            var nodes = root.querySelectorAll('audio[src], img[src], source[src], video[src]');
            for (var i = 0; i < nodes.length; i++) {
                var el = nodes[i];
                var current = el.getAttribute('src') || '';
                var fixed = absoluteMediaUrl(current);
                if (current && fixed !== current) el.setAttribute('src', fixed);
            }
        };
        var startMediaFix = function () {
            fixMedia(document);
            if (window.MutationObserver) {
                new MutationObserver(function () { fixMedia(document); })
                    .observe(document.documentElement, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['src']
                    });
            }
        };
        if (document.documentElement) startMediaFix();
        else document.addEventListener('DOMContentLoaded', startMediaFix);
    }
})();
