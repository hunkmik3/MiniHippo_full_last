// Authentication utility functions

const DEVICE_ID_KEY = 'mh_device_id';
const DEVICE_NAME_KEY = 'mh_device_name';
const DEVICE_HEADER_SAFE_NAME_KEY = 'mh_device_header_name';
const CLASSROOM_ONLY_PATHS = new Set([
    '/lop_hoc.html',
    '/buoi_hoc.html',
    '/speaking_cauhoi_part.html'
]);
const CLASSROOM_ALLOWED_EXTRA_PATHS = new Set([
    '/lesson_history.html'
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

function normalizeRole(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isAdminUser(user) {
    return normalizeRole(user && user.role) === 'admin';
}

function normalizePathname(pathname) {
    const raw = typeof pathname === 'string' ? pathname.trim().toLowerCase() : '';
    if (!raw || raw === '/') return '/';
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
}

function enforceCourseRoute(user) {
    if (!user || isAdminUser(user)) return true;

    const course = normalizeCourse(user.course);
    const path = normalizePathname(window.location.pathname);
    const isClassroomOnlyPath = CLASSROOM_ONLY_PATHS.has(path);

    if (course === 'lớp học') {
        if (
            isClassroomOnlyPath ||
            CLASSROOM_ALLOWED_EXTRA_PATHS.has(path) ||
            path === '/login.html' ||
            path === '/lop_hoc.html' ||
            path === '/'
        ) {
            return true;
        }
        window.location.replace('/lop_hoc.html');
        return false;
    }

    if ((course === 'aptis' || course === 'lớp ôn thi' || !course) && isClassroomOnlyPath) {
        window.location.replace('/home.html');
        return false;
    }

    return true;
}

// Check if user is authenticated
async function checkAuth() {
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
        
        if (!response.ok) {
            // Token invalid, clear storage
            clearAuth();
            return false;
        }
        
        const result = await response.json();
        
        if (result.success && result.user) {
            // Update user info in localStorage
            localStorage.setItem('auth_user', JSON.stringify(result.user));
            // Route guard should not be treated as auth failure.
            // If redirect is needed, enforceCourseRoute will handle navigation.
            enforceCourseRoute(result.user);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Auth check error:', error);
        clearAuth();
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

// Make functions globally accessible
window.checkAuth = checkAuth;
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
