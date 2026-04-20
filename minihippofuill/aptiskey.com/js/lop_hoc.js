/* ═══════════════════════════════════════════════════════
   Lớp Học - Student-facing page
   - Tách luồng theo course
   - Chỉ hiển thị đúng band học viên
   - Khóa buổi sau deadline BTVN
   ═══════════════════════════════════════════════════════ */

const LOP_HOC_CONFIG = {
  B1: { sessions: 12, label: 'Band B1', color: 'b1' },
  B2: { sessions: 19, label: 'Band B2', color: 'b2' }
};

const SPEAKING_SESSIONS = {
  'B1-6': true,
  'B2-5': true
};
const KEY_LISTENING_SET_TYPE = 'key_listening';
const KEY_READING_SET_TYPE = 'key_reading';

const HOMEWORK_CLASS_TYPE = 'homework_class';
let currentView = 'b1';

const lopHocRuntime = {
  user: null,
  classes: [],
  activeClassByBand: { B1: null, B2: null },
  activeBand: null
};

function normalizeText(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function normalizeRole(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isAdminUser(user) {
  return normalizeRole(user?.role) === 'admin';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function resolveToken() {
  if (typeof getAuthToken === 'function') {
    const token = getAuthToken();
    if (token) return token;
  }
  return (
    localStorage.getItem('auth_token') ||
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    ''
  );
}

function buildAuthHeaders(extra = {}) {
  const headers = { ...extra };
  const token = resolveToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (typeof buildDeviceHeaders === 'function') {
    return buildDeviceHeaders(headers);
  }
  return headers;
}

async function apiGet(url, retryWithRefresh = true) {
  const response = await fetch(url, {
    method: 'GET',
    headers: buildAuthHeaders()
  });

  if (response.status === 401 && retryWithRefresh && typeof refreshAuthToken === 'function') {
    const refreshed = await refreshAuthToken();
    if (refreshed) return apiGet(url, false);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error || payload?.message || `HTTP ${response.status}`);
  }
  return payload;
}

function normalizeBand(band) {
  const value = normalizeText(band).toUpperCase();
  if (value === 'B1' || value === 'B2') return value;
  return '';
}

function isClassroomCourse(course) {
  return normalizeText(course) === 'lớp học';
}

function isExamPrepCourse(course) {
  return normalizeText(course) === 'lớp ôn thi';
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function dateDistanceDays(a, b) {
  if (!a || !b) return 9999;
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function classBand(data = {}) {
  return normalizeBand(data.band || data.band_code || '');
}

function scoreClassForUser(cls, band, user) {
  const data = cls?.data || {};
  const now = new Date();
  const note = normalizeText(user?.notes);
  const classTitle = normalizeText(cls?.title || data?.name || '');
  const firstDate = toDate(data.first_date);
  const startedOn = toDate(user?.startedOn || user?.started_on);

  let score = 0;
  const configuredBand = classBand(data);

  if (configuredBand && configuredBand !== band) return -9999;
  if (configuredBand === band) score += 90;
  if (!configuredBand) score += 20;

  if (note && classTitle && note.includes(classTitle)) score += 35;
  if (startedOn && firstDate && startedOn.toDateString() === firstDate.toDateString()) score += 40;
  if (startedOn && firstDate) score += Math.max(0, 20 - dateDistanceDays(startedOn, firstDate));
  if (!startedOn && firstDate && firstDate <= now) score += 8;

  const sessions = Array.isArray(data.sessions) ? data.sessions : [];
  if (sessions.length) score += 4;

  return score;
}

function pickActiveClassForBand(classes, band, user) {
  const scored = (classes || [])
    .map((cls) => ({ cls, score: scoreClassForUser(cls, band, user) }))
    .filter((entry) => entry.score > -9999)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const ta = new Date(a.cls?.updated_at || a.cls?.created_at || 0).getTime();
      const tb = new Date(b.cls?.updated_at || b.cls?.created_at || 0).getTime();
      return tb - ta;
    });

  return scored[0]?.cls || null;
}

function getSessionMeta(band, number) {
  const cls = lopHocRuntime.activeClassByBand[band] || null;
  const sessions = Array.isArray(cls?.data?.sessions) ? cls.data.sessions : [];
  const session = sessions.find((item) => Number(item?.number) === Number(number)) || null;
  const deadline = toDate(session?.deadline);
  const isLocked = !!deadline && Date.now() > deadline.getTime();

  return {
    classId: cls?.id || '',
    classTitle: cls?.title || cls?.data?.name || '',
    deadline,
    deadlineIso: deadline ? deadline.toISOString() : '',
    isLocked
  };
}

function formatDeadline(deadline) {
  if (!deadline) return '';
  return deadline.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function applyBandVisibility() {
  const activeBand = normalizeBand(lopHocRuntime.activeBand);
  const navB1 = document.getElementById('nav-b1')?.closest('.nav-item');
  const navB2 = document.getElementById('nav-b2')?.closest('.nav-item');
  const contentB1 = document.getElementById('content-b1');
  const contentB2 = document.getElementById('content-b2');

  if (!activeBand) {
    if (navB1) navB1.style.display = '';
    if (navB2) navB2.style.display = '';
    if (contentB1) contentB1.style.display = '';
    if (contentB2) contentB2.style.display = '';
    return;
  }

  if (navB1) navB1.style.display = activeBand === 'B1' ? '' : 'none';
  if (navB2) navB2.style.display = activeBand === 'B2' ? '' : 'none';
  if (contentB1) contentB1.style.display = activeBand === 'B1' ? '' : 'none';
  if (contentB2) contentB2.style.display = activeBand === 'B2' ? '' : 'none';
}

function showView(viewId) {
  currentView = viewId;
  document.querySelectorAll('.band-content').forEach((el) => el.classList.remove('active'));

  const content = document.getElementById(`content-${viewId}`);
  if (content) content.classList.add('active');

  ['nav-b1', 'nav-b2', 'nav-listening', 'nav-reading'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active-band', 'active-key');
  });

  const activeClass = viewId.startsWith('key-') ? 'active-key' : 'active-band';
  const navMap = {
    b1: 'nav-b1',
    b2: 'nav-b2',
    'key-listening': 'nav-listening',
    'key-reading': 'nav-reading'
  };
  const activeNav = document.getElementById(navMap[viewId]);
  if (activeNav) activeNav.classList.add(activeClass);
}

function selectBand(band) {
  const normalized = normalizeBand(band);
  if (lopHocRuntime.activeBand && normalized !== lopHocRuntime.activeBand) return;
  showView(normalized.toLowerCase());
}

function selectKeyFromSidebar(key) {
  showView(`key-${key}`);
}

async function renderKeyListeningModule() {
  const container = document.getElementById('key-listening-content');
  if (!container) return;

  container.innerHTML = `
    <div class="text-center py-4 text-muted">
      <span class="spinner-border spinner-border-sm me-2"></span>Đang tải Key Listening...
    </div>
  `;

  try {
    const payload = await apiGet(`/api/practice_sets/list?type=${encodeURIComponent(KEY_LISTENING_SET_TYPE)}`);
    const sets = Array.isArray(payload?.sets) ? payload.sets.slice() : [];
    sets.sort((a, b) =>
      String(a?.title || '').localeCompare(String(b?.title || ''), 'vi', {
        sensitivity: 'base',
        numeric: true
      })
    );

    if (!sets.length) {
      container.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-headphones d-block" style="font-size: 2.5rem; opacity: 0.25;"></i>
          <p class="mt-2 mb-0">Chưa có bộ Key Listening nào.</p>
        </div>
      `;
      return;
    }

    const cards = sets.map((set, index) => {
      const createdAt = set?.created_at ? new Date(set.created_at) : null;
      const createdLabel = createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.toLocaleDateString('vi-VN')
        : '--/--/----';
      const setId = encodeURIComponent(String(set?.id || ''));
      const description = String(set?.description || '').trim();

      return `
        <a class="session-card text-decoration-none key-card-listening" href="listening_bode_set.html?set=${setId}&from=lop_hoc">
          <div class="session-number" style="background:linear-gradient(135deg,#dbeafe,#93c5fd);color:#1e3a8a;">
            ${index + 1}
          </div>
          <div class="session-title">${escapeHtml(set?.title || `Key Listening #${index + 1}`)}</div>
          <div class="session-desc">
            <i class="bi bi-clock-history" style="font-size:0.72rem;"></i>
            ${createdLabel}
          </div>
          ${description ? `<div class="session-desc mt-1">${escapeHtml(description)}</div>` : ''}
        </a>
      `;
    }).join('');

    container.innerHTML = `
      <div class="mb-3 text-muted" style="font-size:0.82rem;">
        Tổng cộng <strong>${sets.length}</strong> bộ Key Listening.
      </div>
      <div class="session-grid">
        ${cards}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-danger mb-0">
        Không thể tải Key Listening: ${escapeHtml(error?.message || 'Unknown error')}
      </div>
    `;
  }
}

async function renderKeyReadingModule() {
  const container = document.getElementById('key-reading-content');
  if (!container) return;

  container.innerHTML = `
    <div class="text-center py-4 text-muted">
      <span class="spinner-border spinner-border-sm me-2"></span>Đang tải Key Reading...
    </div>
  `;

  try {
    const payload = await apiGet(`/api/practice_sets/list?type=${encodeURIComponent(KEY_READING_SET_TYPE)}`);
    const sets = Array.isArray(payload?.sets) ? payload.sets.slice() : [];
    sets.sort((a, b) =>
      String(a?.title || '').localeCompare(String(b?.title || ''), 'vi', {
        sensitivity: 'base',
        numeric: true
      })
    );

    if (!sets.length) {
      container.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-book d-block" style="font-size: 2.5rem; opacity: 0.25;"></i>
          <p class="mt-2 mb-0">Chưa có bộ Key Reading nào.</p>
        </div>
      `;
      return;
    }

    const cards = sets.map((set, index) => {
      const createdAt = set?.created_at ? new Date(set.created_at) : null;
      const createdLabel = createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.toLocaleDateString('vi-VN')
        : '--/--/----';
      const setId = encodeURIComponent(String(set?.id || ''));
      const description = String(set?.description || '').trim();

      return `
        <a class="session-card text-decoration-none key-card-reading" href="reading_bode_set.html?set=${setId}&from=lop_hoc">
          <div class="session-number" style="background:linear-gradient(135deg,#dcfce7,#86efac);color:#14532d;">
            ${index + 1}
          </div>
          <div class="session-title">${escapeHtml(set?.title || `Key Reading #${index + 1}`)}</div>
          <div class="session-desc">
            <i class="bi bi-clock-history" style="font-size:0.72rem;"></i>
            ${createdLabel}
          </div>
          ${description ? `<div class="session-desc mt-1">${escapeHtml(description)}</div>` : ''}
        </a>
      `;
    }).join('');

    container.innerHTML = `
      <div class="mb-3 text-muted" style="font-size:0.82rem;">
        Tổng cộng <strong>${sets.length}</strong> bộ Key Reading.
      </div>
      <div class="session-grid">
        ${cards}
      </div>
    `;
  } catch (error) {
    container.innerHTML = `
      <div class="alert alert-danger mb-0">
        Không thể tải Key Reading: ${escapeHtml(error?.message || 'Unknown error')}
      </div>
    `;
  }
}

function renderSessionCard(band, number) {
  const bandClass = band === 'B1' ? 'band-b1-card' : 'band-b2-card';
  const meta = getSessionMeta(band, number);
  const lockedClass = meta.isLocked ? 'locked' : '';
  const lockIcon = meta.isLocked ? '<div class="session-lock"><i class="bi bi-lock-fill"></i></div>' : '';
  const deadlineNote = meta.deadline
    ? `<div class="session-desc" style="font-size:0.72rem;color:${meta.isLocked ? '#dc2626' : '#64748b'};">Deadline: ${formatDeadline(meta.deadline)}</div>`
    : '';
  const onclick = meta.isLocked
    ? `onclick="showLockedMessage(${number}, '${band}')"`
    : `onclick="openSession('${band}', ${number})"`;

  return `
    <div class="session-card ${bandClass} ${lockedClass}" ${onclick}>
      ${lockIcon}
      <div class="session-number">${number}</div>
      <div class="session-title">Buổi ${number}</div>
      <div class="session-desc">
        <i class="bi bi-mortarboard" style="font-size: 0.7rem;"></i>
        ${band}
      </div>
      ${deadlineNote}
    </div>
  `;
}

function renderBandSessions(band) {
  const grid = document.getElementById(`${band.toLowerCase()}-session-grid`);
  if (!grid) return;

  const config = LOP_HOC_CONFIG[band];
  const cards = [];
  for (let i = 1; i <= config.sessions; i += 1) {
    cards.push(renderSessionCard(band, i));
  }
  grid.innerHTML = cards.join('');
}

function showLockedMessage(number, band) {
  const meta = getSessionMeta(band, number);
  if (meta.deadline) {
    alert(`Buổi ${number} đã quá deadline (${formatDeadline(meta.deadline)}).`);
    return;
  }
  alert(`Buổi ${number} hiện đang bị khóa.`);
}

function openSession(band, number) {
  const key = `${band}-${number}`;
  const meta = getSessionMeta(band, number);
  if (meta.isLocked) {
    showLockedMessage(number, band);
    return;
  }

  if (SPEAKING_SESSIONS[key]) {
    const query = new URLSearchParams({
      buoi: key,
      band,
      session: String(number)
    });
    if (meta.classId) query.set('classId', meta.classId);
    window.location.href = `speaking_cauhoi_part.html?${query.toString()}`;
    return;
  }

  const query = new URLSearchParams({
    band,
    session: String(number)
  });
  if (meta.classId) query.set('classId', meta.classId);
  window.location.href = `buoi_hoc.html?${query.toString()}`;
}

function pickInitialView() {
  if (lopHocRuntime.activeBand) return lopHocRuntime.activeBand.toLowerCase();
  return 'b1';
}

async function loadHomeworkClasses() {
  try {
    const data = await apiGet(`/api/practice_sets/list?type=${HOMEWORK_CLASS_TYPE}`);
    lopHocRuntime.classes = data?.sets || [];
  } catch (error) {
    console.warn('Load homework classes failed:', error);
    lopHocRuntime.classes = [];
  }

  lopHocRuntime.activeClassByBand.B1 = pickActiveClassForBand(lopHocRuntime.classes, 'B1', lopHocRuntime.user);
  lopHocRuntime.activeClassByBand.B2 = pickActiveClassForBand(lopHocRuntime.classes, 'B2', lopHocRuntime.user);
}

async function initStudentView() {
  const authOk = typeof checkAuth === 'function' ? await checkAuth() : true;
  if (!authOk) return;

  lopHocRuntime.user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  const isAdmin = isAdminUser(lopHocRuntime.user);
  const userCourse = lopHocRuntime.user?.course || '';
  const userBand = normalizeBand(lopHocRuntime.user?.band);
  lopHocRuntime.activeBand = isAdmin ? null : (userBand || null);

  if (!isAdmin && isExamPrepCourse(userCourse)) {
    window.location.replace('home.html');
    return;
  }

  if (!isAdmin && !isClassroomCourse(userCourse)) {
    window.location.replace('home.html');
    return;
  }

  await loadHomeworkClasses();
  applyBandVisibility();

  renderBandSessions('B1');
  renderBandSessions('B2');
  await renderKeyListeningModule();
  await renderKeyReadingModule();
  showView(pickInitialView());
}

document.addEventListener('DOMContentLoaded', () => {
  initStudentView().catch((error) => {
    console.error('Init lop_hoc failed:', error);
    alert(`Không thể tải dữ liệu lớp học: ${error.message}`);
  });
});

window.selectBand = selectBand;
window.selectKeyFromSidebar = selectKeyFromSidebar;
window.openSession = openSession;
window.showLockedMessage = showLockedMessage;
