(function () {
  if (window.__copyPasteGuardInstalled) return;

  function normalizePathname(pathname) {
    var raw = typeof pathname === 'string' ? pathname.trim().toLowerCase() : '';
    if (!raw || raw === '/') return '/';
    return raw.endsWith('/') ? raw.slice(0, -1) : raw;
  }

  function isAdminPath(pathname) {
    var path = normalizePathname(pathname);
    return (
      path === '/admin' ||
      path === '/admin.html' ||
      path.startsWith('/admin_') ||
      path.startsWith('/admin/')
    );
  }

  function isLoginPath(pathname) {
    var path = normalizePathname(pathname);
    return path === '/login' || path === '/login.html';
  }

  function isAdminUser() {
    try {
      var raw = localStorage.getItem('auth_user');
      if (!raw) return false;
      var user = JSON.parse(raw);
      return Boolean(user && String(user.role || '').toLowerCase() === 'admin');
    } catch (error) {
      return false;
    }
  }

  // Admin pages/users must keep normal copy-paste behavior.
  if (isLoginPath(window.location.pathname) || isAdminPath(window.location.pathname) || isAdminUser()) {
    return;
  }

  window.__copyPasteGuardInstalled = true;

  function isWhitelisted(target) {
    return Boolean(
      target &&
      typeof target.closest === 'function' &&
      target.closest('[data-allow-copy-paste="true"]')
    );
  }

  function blockEvent(event) {
    if (isWhitelisted(event.target)) return;
    event.preventDefault();
    event.stopPropagation();
  }

  ['copy', 'cut', 'paste'].forEach(type => {
    document.addEventListener(type, blockEvent, true);
  });

  document.addEventListener(
    'keydown',
    event => {
      if (isWhitelisted(event.target)) return;
      const key = String(event.key || '').toLowerCase();
      const hasModifier = event.ctrlKey || event.metaKey;

      if (hasModifier && (key === 'c' || key === 'x' || key === 'v')) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Shift + Insert is a common paste shortcut on Windows/Linux.
      if (event.shiftKey && key === 'insert') {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    true
  );

  // Optional hardening: block right-click menu copy entry points.
  document.addEventListener('contextmenu', blockEvent, true);
})();
