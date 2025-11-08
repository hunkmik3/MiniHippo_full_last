// Authentication utility functions

// Check if user is authenticated
async function checkAuth() {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch('/api/auth/verify', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
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

// Logout
async function logout() {
    const token = getAuthToken();
    const refreshToken = localStorage.getItem('auth_refresh_token');
    
    // Call logout API
    if (token) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
    window.location.href = 'login.html';
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
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
        return false;
    }
    
    return true;
}

// Check if user is admin
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// Require admin role
async function requireAdmin() {
    const isAuthenticated = await requireAuth();
    
    if (!isAuthenticated) {
        return false;
    }
    
    if (!isAdmin()) {
        alert('Bạn không có quyền truy cập trang này.');
        window.location.href = 'home.html';
        return false;
    }
    
    return true;
}

// Make functions globally accessible
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.getAuthToken = getAuthToken;
window.logout = logout;
window.clearAuth = clearAuth;
window.requireAuth = requireAuth;
window.isAdmin = isAdmin;
window.requireAdmin = requireAdmin;

// Auto-check auth on page load (if not on login page)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        if (!window.location.pathname.includes('login.html')) {
            requireAuth();
        }
    });
} else {
    if (!window.location.pathname.includes('login.html')) {
        requireAuth();
    }
}

