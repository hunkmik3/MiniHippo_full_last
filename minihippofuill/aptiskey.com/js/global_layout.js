// Global layout helpers: hiển thị nút đăng xuất + đảm bảo học viên đã đăng nhập

(function () {
  function createLogoutButton() {
    if (document.getElementById('mh-global-logout')) return;

    const container = document.createElement('div');
    container.id = 'mh-global-logout';
    container.style.position = 'fixed';
    container.style.right = '16px';
    container.style.bottom = '16px';
    container.style.zIndex = '2000';
    container.style.display = 'none';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.style.borderRadius = '999px';
    btn.style.border = '1px solid #e5e7eb';
    btn.style.background = 'white';
    btn.style.padding = '6px 14px';
    btn.style.boxShadow = '0 4px 10px rgba(15,23,42,0.18)';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '8px';
    btn.style.fontSize = '12px';
    btn.style.fontWeight = '600';
    btn.style.color = '#111827';
    btn.style.cursor = 'pointer';

    btn.innerHTML =
      '<span style="display:inline-flex;align-items:center;gap:6px;">' +
      '<i class="bi bi-person-circle"></i>' +
      '<span id="mh-global-logout-user" style="max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></span>' +
      '</span>' +
      '<span style="height:16px;width:1px;background:#e5e7eb;"></span>' +
      '<span style="display:inline-flex;align-items:center;gap:4px;color:#b91c1c;"><i class="bi bi-box-arrow-right"></i><span>Đăng xuất</span></span>';

    btn.addEventListener('click', function () {
      if (typeof window.logout === 'function') {
        window.logout();
      } else {
        // fallback: clear token và về login
        try {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_refresh_token');
          localStorage.removeItem('auth_user');
        } catch (e) {}
        window.location.href = '/login.html';
      }
    });

    container.appendChild(btn);
    document.body.appendChild(container);
  }

  async function initAuthAndLogoutButton() {
    // Bỏ qua trang login
    if (window.location.pathname.includes('login')) return;

    // Đảm bảo đã include auth.js
    if (typeof window.requireAuth === 'function') {
      const ok = await window.requireAuth();
      if (!ok) return;
    }

    createLogoutButton();

    if (typeof window.getCurrentUser === 'function') {
      const user = window.getCurrentUser();
      const hasToken =
        typeof window.getAuthToken === 'function' && !!window.getAuthToken();

      const container = document.getElementById('mh-global-logout');
      const label = document.getElementById('mh-global-logout-user');

      if (container) {
        if (user && hasToken) {
          if (label) {
            label.textContent =
              user.fullName ||
              user.username ||
              user.accountCode ||
              user.email ||
              'Tài khoản';
          }
          container.style.display = 'block';
        } else {
          container.style.display = 'none';
        }
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthAndLogoutButton);
  } else {
    initAuthAndLogoutButton();
  }
})();




