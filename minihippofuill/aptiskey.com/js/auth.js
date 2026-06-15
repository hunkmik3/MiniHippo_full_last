// Authentication utility functions

const DEVICE_ID_KEY = 'mh_device_id';
const DEVICE_NAME_KEY = 'mh_device_name';
const DEVICE_HEADER_SAFE_NAME_KEY = 'mh_device_header_name';
const AUTH_SELECTED_MODULE_STORAGE_KEY = 'mh_selected_module';
const AUTH_MODULE_LANDINGS = {
    aptis: '/home.html',
    // VSTEP cũ — fallback chung; thực tế dùng vstep_onthi / vstep_lophoc landings.
    vstep: '/vstep_home.html',
    vstep_onthi: '/vstep_bode.html',
    vstep_lophoc: '/vstep_lessons.html',
    lop_hoc: '/lop_hoc.html'
};
const AUTH_VALID_MODULES = new Set(Object.keys(AUTH_MODULE_LANDINGS));
// Path constants được lưu KHÔNG kèm .html — normalizePathname() sẽ strip .html
// để khớp với cả URL có .html lẫn URL clean (Vercel cleanUrls bật trên domain
// production). Trước đây giữ .html gây redirect loop khi production rewrite
// /lop_hoc.html → /lop_hoc.
const CLASSROOM_ONLY_PATHS = new Set([
    '/lop_hoc',
    '/lop-hoc',
    '/buoi_hoc'
]);
const CLASSROOM_ALLOWED_EXTRA_PATHS = new Set([
    '/lesson_history'
]);
// VSTEP routes là module riêng; admin bypass, học viên cần course VSTEP.
const VSTEP_ONLY_PATHS = new Set([
    '/vstep',
    '/vstep_home',
    '/vstep_bode',
    '/vstep_full_test',
    '/vstep_skill',
    '/vstep_lessons',
    '/vstep_exam',
    '/vstep_history'
]);
// Sub-module VSTEP: từ 2026-06, HV được chia 2 nhóm (vstep_onthi / vstep_lophoc)
// theo users.learning_program. Mỗi nhóm chỉ vào route của mình + route chung.
const VSTEP_LOPHOC_ONLY_PATHS = new Set([
    '/vstep_lessons'
]);
const VSTEP_ONTHI_ONLY_PATHS = new Set([
    '/vstep_bode',
    '/vstep_full_test',
    '/vstep_skill'
]);
// Path chung cả 2 sub-module (entry hub + exam page + history).
const VSTEP_SHARED_PATHS = new Set([
    '/vstep',
    '/vstep_home',
    '/vstep_exam',
    '/vstep_history'
]);

function generateDeviceId() {
    if (window.crypto?.randomUUID) {
        return window.crypto.randomUUID();
    }
    return `mh-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getDeviceId() {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
        deviceId = generateDeviceId();
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
}

function buildDeviceName() {
    const parts = [
        navigator.userAgentData?.platform || navigator.platform || 'Thiết bị',
        navigator.language || null,
        `${window.screen?.width || ''}x${window.screen?.height || ''}`
    ].filter(Boolean);
    const label = parts.join(' • ') || 'Thiết bị chưa đặt tên';
    return label.length > 120 ? `${label.slice(0, 117)}...` : label;
}

function getDeviceName() {
    let name = localStorage.getItem(DEVICE_NAME_KEY);
    if (!name) {
        name = buildDeviceName();
        localStorage.setItem(DEVICE_NAME_KEY, name);
    }
    return name;
}

function getDeviceHeaderSafeName() {
    let safeName = localStorage.getItem(DEVICE_HEADER_SAFE_NAME_KEY);
    if (!safeName) {
        safeName =
            (navigator.userAgentData?.platform || navigator.platform || 'MiniHippoDevice')
                .replace(/[^\x20-\x7E]/g, '')
                .slice(0, 64) || 'MiniHippoDevice';
        localStorage.setItem(DEVICE_HEADER_SAFE_NAME_KEY, safeName);
    }
    return safeName;
}

function buildDeviceHeaders(additionalHeaders = {}) {
    const headers = { ...additionalHeaders };
    const deviceId = getDeviceId();
    if (deviceId) {
        headers['X-Device-Id'] = encodeURIComponent(deviceId);
    }
    const headerName = getDeviceHeaderSafeName();
    headers['X-Device-Name'] = encodeURIComponent(headerName);
    return headers;
}

function normalizeCourse(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeLearningProgram(value) {
    const normalized = typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (normalized === 'class' || normalized === 'classroom') return 'classroom';
    if (normalized === 'aptis') return 'aptis';
    if (normalized === 'vstep') return 'vstep';
    return '';
}

function normalizeRole(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isAdminUser(user) {
    return normalizeRole(user && user.role) === 'admin';
}

function getStoredSelectedModule() {
    try {
        const stored = localStorage.getItem(AUTH_SELECTED_MODULE_STORAGE_KEY);
        return AUTH_VALID_MODULES.has(stored) ? stored : '';
    } catch (_) {
        return '';
    }
}

function moduleForUser(user) {
    const stored = getStoredSelectedModule();
    if (isAdminUser(user) && stored) return stored;

    const course = resolveUserCourse(user);
    if (course === 'vstep') {
        // VSTEP có 2 sub-module → trả về landing tương ứng.
        return resolveVstepSubProgram(user) === 'vstep_onthi' ? 'vstep_onthi' : 'vstep_lophoc';
    }
    if (course === 'lớp học') return 'lop_hoc';
    return 'aptis';
}

// Phân biệt HV VSTEP thuộc sub-module nào dựa vào users.learning_program.
// 'vstep_onthi' → chỉ truy cập Ôn thi bộ đề (vstep_bode/vstep_skill/...)
// 'vstep_lophoc' (mặc định) → chỉ truy cập Học tập VSTEP (vstep_lessons)
// HV cũ có learning_program='vstep'/null → mặc định 'vstep_lophoc' để
// không cắt quyền đột ngột; admin có thể đổi qua bulk-import.
function resolveVstepSubProgram(user) {
    const raw = String(
        (user && (user.learningProgram || user.learning_program)) || ''
    ).trim().toLowerCase();
    if (raw === 'vstep_onthi') return 'vstep_onthi';
    return 'vstep_lophoc';
}

function resolveUserCourse(user) {
    const course = normalizeCourse(user && user.course);
    if (course) return course;

    const program = normalizeLearningProgram(
        user && (user.learningProgram || user.learning_program)
    );
    if (program === 'vstep') return 'vstep';
    if (program === 'classroom') return 'lớp học';
    if (program === 'aptis') return 'aptis';
    return '';
}

function landingForModule(mod) {
    return AUTH_MODULE_LANDINGS[mod] || AUTH_MODULE_LANDINGS.aptis;
}

function normalizePathname(pathname) {
    let raw = typeof pathname === 'string' ? pathname.trim().toLowerCase() : '';
    if (!raw || raw === '/') return '/';
    if (raw.endsWith('/')) raw = raw.slice(0, -1);
    // Strip .html nếu có — production (Vercel cleanUrls) trả về URL không có
    // .html, local server có. Chuẩn hoá về 1 dạng để so sánh path khỏi loop.
    if (raw.endsWith('.html')) raw = raw.slice(0, -5);
    return raw || '/';
}

function enforceCourseRoute(user) {
    if (!user) return true;

    const course = resolveUserCourse(user);
    const path = normalizePathname(window.location.pathname);
    const searchParams = new URLSearchParams(window.location.search);
    const isClassroomOnlyPath = CLASSROOM_ONLY_PATHS.has(path);
    const isSpeakingQuestionPartPath = path === '/speaking_cauhoi_part';
    const isClassroomSpeakingSession = isSpeakingQuestionPartPath && searchParams.has('buoi');
    const isClassroomPracticeSet =
        (path === '/reading_bode_set' || path === '/listening_bode_set') &&
        normalizeCourse(searchParams.get('from')) === 'lop_hoc';
    const isClassroomRoute = isClassroomOnlyPath || isClassroomSpeakingSession || isClassroomPracticeSet;
    const isVstepOnlyPath = VSTEP_ONLY_PATHS.has(path);

    if (path === '/' || path === '/index') {
        window.location.replace(landingForModule(moduleForUser(user)));
        return false;
    }

    if (isAdminUser(user)) return true;

    // VSTEP là module riêng. Admin được bypass ở trên, học viên cần course VSTEP.
    if (isVstepOnlyPath) {
        if (course !== 'vstep') {
            if (course === 'lớp học') window.location.replace('/lop_hoc.html');
            else window.location.replace('/home.html');
            return false;
        }
        // HV VSTEP: phân biệt sub-module để không cho cross-access.
        //   vstep_onthi  KHÔNG vào được /vstep_lessons (lớp học)
        //   vstep_lophoc KHÔNG vào được /vstep_bode, /vstep_skill, /vstep_full_test (ôn thi)
        //   Route chung (VSTEP_SHARED_PATHS) — cả 2 đều vào được.
        const subProgram = resolveVstepSubProgram(user);
        if (VSTEP_SHARED_PATHS.has(path)) return true;
        if (subProgram === 'vstep_onthi' && VSTEP_LOPHOC_ONLY_PATHS.has(path)) {
            window.location.replace('/vstep_bode.html');
            return false;
        }
        if (subProgram === 'vstep_lophoc' && VSTEP_ONTHI_ONLY_PATHS.has(path)) {
            window.location.replace('/vstep_lessons.html');
            return false;
        }
        return true;
    }

    if (course === 'lớp học') {
        if (
            isClassroomRoute ||
            CLASSROOM_ALLOWED_EXTRA_PATHS.has(path) ||
            path === '/login' ||
            path === '/'
        ) {
            return true;
        }
        // Production Vercel chưa match được aliases — dùng .html trực tiếp
        // qua catch-all rewrite cho ổn định trên cả prod + local dev.
        window.location.replace('/lop_hoc.html');
        return false;
    }

    if (isClassroomRoute) {
        window.location.replace(course === 'vstep' ? '/vstep_bode.html' : '/home.html');
        return false;
    }

    return true;
}

// Check if user is authenticated. Tự refresh access token khi gặp 401
// (Supabase access_token hết hạn sau ~1 giờ) — tránh F5 bị đá ra login.
async function checkAuth({ allowRefresh = true } = {}) {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        return false;
    }

    try {
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: buildDeviceHeaders({
                'Authorization': `Bearer ${token}`
            })
        });

        if (response.status === 401 && allowRefresh) {
            // Access token hết hạn — thử refresh rồi verify lại 1 lần.
            const newToken = await refreshAuthToken();
            if (newToken) {
                return checkAuth({ allowRefresh: false });
            }
            return false;
        }

        if (!response.ok) {
            clearAuth();
            return false;
        }

        const result = await response.json();

        if (result.success && result.user) {
            localStorage.setItem('auth_user', JSON.stringify(result.user));
            // Route guard should not be treated as auth failure.
            enforceCourseRoute(result.user);
            return true;
        }

        return false;
    } catch (error) {
        // Lỗi mạng tạm thời — KHÔNG nên xóa session ngay (sẽ làm user bị
        // logout khi mất mạng vài giây / tab background sleep). Trả về true
        // nếu localStorage vẫn còn user; phía route guard sẽ retry sau.
        console.error('Auth check error:', error);
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
            try { enforceCourseRoute(JSON.parse(storedUser)); } catch (_) {}
            return true;
        }
        return false;
    }
}

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('auth_user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Get auth token
function getAuthToken() {
    return localStorage.getItem('auth_token');
}

async function refreshAuthToken() {
    const refreshToken = localStorage.getItem('auth_refresh_token');
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: buildDeviceHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({ refreshToken })
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result?.token) {
            clearAuth();
            return null;
        }

        localStorage.setItem('auth_token', result.token);
        if (result.refreshToken) {
            localStorage.setItem('auth_refresh_token', result.refreshToken);
        }
        if (result.user) {
            localStorage.setItem('auth_user', JSON.stringify(result.user));
        }

        return result.token;
    } catch (error) {
        console.error('Refresh token error:', error);
        clearAuth();
        return null;
    }
}

// Logout
async function logout() {
    const token = getAuthToken();
    const refreshToken = localStorage.getItem('auth_refresh_token');
    
    // Call logout API
    if (token) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: buildDeviceHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }),
                body: JSON.stringify({
                    token: token,
                    refreshToken: refreshToken
                })
            });
        } catch (error) {
            console.error('Logout API error:', error);
        }
    }
    
    // Clear local storage
    clearAuth();
    
    // Redirect to login
    window.location.href = '/login.html';
}

// Clear authentication data
function clearAuth() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    localStorage.removeItem('auth_user');
    // Dừng timer auto-refresh nếu đang chạy.
    if (typeof stopTokenRefreshTimer === 'function') {
        try { stopTokenRefreshTimer(); } catch (_) {}
    }
}

// Check authentication on page load and redirect if not authenticated
async function requireAuth() {
    const isAuthenticated = await checkAuth();
    
    if (!isAuthenticated) {
        // Don't redirect if already on login page
        if (!window.location.pathname.includes('login')) {
            try {
                const isHttpOrigin = window.location.origin && window.location.origin.startsWith('http');
                if (isHttpOrigin) {
                    const redirectPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
                    localStorage.setItem('post_login_redirect', redirectPath);
                } else {
                    localStorage.removeItem('post_login_redirect');
                }
            } catch (err) {
                console.warn('Unable to store redirect url:', err);
            }
            window.location.href = '/login.html';
        }
        return false;
    }
    
    return true;
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return isAdminUser(user);
}

// Require admin role
async function requireAdmin() {
    const isAuthenticated = await requireAuth();
    
    if (!isAuthenticated) {
        return false;
    }
    
    if (!isAdmin()) {
        alert('Bạn không có quyền truy cập trang này.');
        window.location.href = '/home.html';
        return false;
    }
    
    return true;
}

async function submitPracticeResult(payload = {}) {
    const token = getAuthToken();
    if (!token) {
        return false;
    }
    try {
        const response = await fetch('/api/practice_results/submit', {
            method: 'POST',
            headers: buildDeviceHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }),
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Không thể lưu kết quả luyện tập');
        }
        const data = await response.json().catch(() => ({}));
        return data?.result || true;
    } catch (error) {
        console.error('submitPracticeResult error:', error);
        return false;
    }
}

// ===== Proactive token refresh =====
// Supabase JWT default sống 60 phút. Nếu HV làm bài exam mà không gọi API nào
// trong 60 phút → token âm thầm hết hạn → đến lúc nộp bài/upload audio mới fail.
// Timer này tự gọi /api/auth/refresh mỗi 50 phút để token luôn fresh.
// Refresh token Supabase mặc định sống ~30 ngày nên không có vấn đề gì.
let TOKEN_REFRESH_TIMER_ID = null;
const TOKEN_REFRESH_INTERVAL_MS = 50 * 60 * 1000; // 50 phút

function startTokenRefreshTimer() {
    if (TOKEN_REFRESH_TIMER_ID) return; // Đã chạy rồi.
    TOKEN_REFRESH_TIMER_ID = setInterval(async () => {
        if (!getAuthToken() || !localStorage.getItem('auth_refresh_token')) {
            stopTokenRefreshTimer();
            return;
        }
        try {
            const newToken = await refreshAuthToken();
            if (!newToken) {
                // Refresh fail (refresh token cũng hết hạn) → dừng timer.
                // Route guard / 401 retry sẽ redirect login khi cần.
                stopTokenRefreshTimer();
            }
        } catch (err) {
            console.warn('Proactive token refresh failed:', err);
        }
    }, TOKEN_REFRESH_INTERVAL_MS);
}

function stopTokenRefreshTimer() {
    if (TOKEN_REFRESH_TIMER_ID) {
        clearInterval(TOKEN_REFRESH_TIMER_ID);
        TOKEN_REFRESH_TIMER_ID = null;
    }
}

// Khi tab quay lại foreground sau khi sleep lâu (browser có thể tạm dừng
// setInterval khi tab background) → refresh ngay để chắc token còn fresh
// trước khi HV thao tác tiếp.
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', async () => {
        if (document.visibilityState === 'visible'
            && getAuthToken()
            && localStorage.getItem('auth_refresh_token')) {
            try { await refreshAuthToken(); } catch (_) {}
        }
    });
    // Tab khác đăng xuất → dừng timer ở tab này luôn.
    window.addEventListener('storage', (e) => {
        if (e.key === 'auth_token' && !e.newValue) {
            stopTokenRefreshTimer();
        } else if (e.key === 'auth_token' && e.newValue && !TOKEN_REFRESH_TIMER_ID) {
            startTokenRefreshTimer();
        }
    });
    // Tự khởi động timer nếu page load thấy đã có token (HV reload trang).
    document.addEventListener('DOMContentLoaded', () => {
        if (getAuthToken() && localStorage.getItem('auth_refresh_token')) {
            startTokenRefreshTimer();
        }
    });
}

// Make functions globally accessible
window.checkAuth = checkAuth;
window.startTokenRefreshTimer = startTokenRefreshTimer;
window.stopTokenRefreshTimer = stopTokenRefreshTimer;
window.getCurrentUser = getCurrentUser;
window.getAuthToken = getAuthToken;
window.refreshAuthToken = refreshAuthToken;
window.logout = logout;
window.clearAuth = clearAuth;
window.requireAuth = requireAuth;
window.isAdmin = isAdmin;
window.requireAdmin = requireAdmin;
window.getDeviceId = getDeviceId;
window.getDeviceName = getDeviceName;
window.buildDeviceHeaders = buildDeviceHeaders;
window.submitPracticeResult = submitPracticeResult;
window.resolveMiniHippoCourse = resolveUserCourse;
window.moduleForMiniHippoUser = moduleForUser;
window.consumePostLoginRedirect = function consumePostLoginRedirect() {
    try {
        const url = localStorage.getItem('post_login_redirect');
        if (url) {
            localStorage.removeItem('post_login_redirect');
            return url;
        }
    } catch (error) {
        console.warn('Failed to read redirect url:', error);
    }
    return null;
};

// Auto-check auth on page load (if not on login page)
const isLoginPage = window.location.pathname.includes('login');

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!isLoginPage) {
            requireAuth();
        }
    });
} else {
    if (!isLoginPage) {
        requireAuth();
    }
}
