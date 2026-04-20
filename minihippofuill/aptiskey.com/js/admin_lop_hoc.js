/* ═══════════════════════════════════════════════════════
   Admin Lớp Học Module
   - Quản lý học viên (Lớp học / Lớp ôn thi)
   - Quản lý lớp & lịch BTVN
   - Theo dõi nộp bài & export CSV
   ═══════════════════════════════════════════════════════ */

// ── State ──
let lopHocState = {
    students: [],
    filteredStudents: [],
    selectedStudent: null,
    editingStudentId: null,    // null = create mode, string = edit mode
    classes: [],
    selectedClass: null,
    homeworkSessions: [],
    submissions: [],
    activeTab: 'tab-students',
    sessionContentRecords: [],
    selectedSessionContentRecord: null,
    sessionDraft: null,
    selectedDraftPageIndex: -1
};

// ── Tab metadata for hero header ──
const TAB_META = {
    'tab-students': {
        title: 'Danh sách học viên',
        description: 'Quản lý học viên theo lớp, khóa học và band điểm.',
        breadcrumb: 'Lớp Học / Học viên / Danh sách'
    },
    'tab-import': {
        title: 'Import học viên từ CSV',
        description: 'Import hàng loạt học viên từ file CSV.',
        breadcrumb: 'Lớp Học / Học viên / Import CSV'
    },
    'tab-classes': {
        title: 'Quản lý lớp',
        description: 'Tạo và quản lý lớp học, lịch học 246/357.',
        breadcrumb: 'Lớp Học / BTVN / Quản lý lớp'
    },
    'tab-homework': {
        title: 'DS buổi & Deadline',
        description: 'Xem và chỉnh sửa deadline BTVN theo từng buổi.',
        breadcrumb: 'Lớp Học / BTVN / Buổi & Deadline'
    },
    'tab-submissions': {
        title: 'DS Trả BTVN',
        description: 'Xem và export danh sách học viên đã nộp BTVN.',
        breadcrumb: 'Lớp Học / BTVN / DS Trả BTVN'
    },
    'tab-session-content': {
        title: 'Nội dung buổi học',
        description: 'Quản lý câu hỏi và cấu trúc từng buổi học B1/B2.',
        breadcrumb: 'Lớp Học / BTVN / Nội dung buổi học'
    }
};

// ── Vietnamese day names ──
const DAY_NAMES = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

// ── Schedule day-of-week mapping (0=Sun, 1=Mon, ... 6=Sat) ──
const SCHEDULE_DAYS = {
    '246': [1, 3, 5],  // Thứ 2, 4, 6
    '357': [2, 4, 6]   // Thứ 3, 5, 7
};

const SESSION_LIMITS = {
    B1: 12,
    B2: 19
};
const USER_GROUP_CLASSROOM = 'classroom';

const SESSION_STRUCTURE_GUIDE = {
    'B1-1': 'Grammar + Vocabulary',
    'B1-2': 'Listening Part 1 + Part 2',
    'B1-3': 'Reading Part 1 + Part 2 + Part 3',
    'B1-4': 'Writing Part 1 + Part 4',
    'B1-5': 'Writing Part 2 + Part 3 (nhiều trang)',
    'B1-6': 'Speaking Part 1',
    'B1-7': 'Speaking Part 2-3 + Writing',
    'B1-8': 'Writing mô tả ảnh + follow-up',
    'B1-9': 'Reading Part 1 + Part 2 + Part 3',
    'B1-10': 'Writing Part 1 + Part 2',
    'B1-11': 'Writing describe image (2 sets)',
    'B1-12': 'Reading Part 1 + Part 2 + Part 3',
    'B2-1': 'Clone B1-1',
    'B2-2': 'Reading Part 1 + Part 2',
    'B2-3': 'Listening Part 1 + Part 2',
    'B2-4': 'Writing mixed (short/email)',
    'B2-5': 'Speaking Part 1',
    'B2-6': 'Grammar trắc nghiệm',
    'B2-7': 'Reading Part 3 + Part 4',
    'B2-8': 'Listening Part 1 + Part 2',
    'B2-9': 'Writing Part 1 + Part 2',
    'B2-10': 'Speaking Part 1 + Writing full set',
    'B2-11': 'Clone B1-11',
    'B2-12': 'Clone B1-12',
    'B2-13': 'Writing full 4 part',
    'B2-14': 'Clone B1-11',
    'B2-15': 'Clone B1-12',
    'B2-16': 'Clone B2-13',
    'B2-17': 'Clone B1-11',
    'B2-18': 'Clone B1-12',
    'B2-19': 'Chưa có default (có thể upload custom)'
};

const SESSION_TEMPLATE = {
    timer: 35,
    hideGlobalTimer: false,
    pages: [
        {
            type: 'reading-gap',
            partTitle: 'Part 1',
            data: {
                instruction: 'Choose the word that fits in the gap.',
                rows: Array.from({ length: 5 }, (_, idx) => ({
                    before: `Sentence ${idx + 1}: I`,
                    after: 'to school every day.',
                    options: ['go', 'goes', 'went'],
                    answer: 'go'
                }))
            }
        }
    ]
};

function repeatSpecs(count, factory) {
    return Array.from({ length: count }, (_, index) => factory(index));
}

function repeatPageSpecs(type, count, extra = {}) {
    return repeatSpecs(count, () => ({ type, ...extra }));
}

function repeatPageGroups(count, groupFactory) {
    const output = [];
    for (let index = 0; index < count; index++) {
        const group = groupFactory(index);
        if (Array.isArray(group)) output.push(...group);
        else if (group) output.push(group);
    }
    return output;
}

const SESSION_STRUCTURE_BLUEPRINTS = {
    'B1-1': {
        timer: 25,
        pages: [
            ...repeatPageSpecs('grammar', 24),
            { type: 'vocab', partKey: 'part1', partNum: 1, partTitle: 'Part 2' },
            { type: 'vocab', partKey: 'part2', partNum: 2, partTitle: 'Part 2' },
            { type: 'vocab', partKey: 'part3', partNum: 3, partTitle: 'Part 2' },
            { type: 'vocab', partKey: 'part4', partNum: 4, partTitle: 'Part 2' }
        ]
    },
    'B1-2': {
        timer: 25,
        pages: [
            ...repeatPageSpecs('listening-q', 13, { partLabel: 'Part 1' }),
            { type: 'listening-topic', partLabel: 'Part 2' }
        ]
    },
    'B1-3': {
        timer: 30,
        pages: [
            ...repeatPageSpecs('reading-gap', 2, { partTitle: 'Part 1' }),
            ...repeatPageSpecs('reading-order', 2, { partTitle: 'Part 2' }),
            ...repeatPageSpecs('reading-match', 2, { partTitle: 'Part 3' })
        ]
    },
    'B1-4': {
        timer: 50,
        pages: [
            { type: 'writing-short', headerTitle: 'Part 1' },
            { type: 'writing-email', headerTitle: 'Part 4' }
        ]
    },
    'B1-5': {
        timer: 50,
        pages: [
            ...repeatPageSpecs('writing-sentences', 5, { headerTitle: 'Part 1' }),
            ...repeatPageSpecs('writing-chat', 5, { headerTitle: 'Part 2' })
        ]
    },
    'B1-6': {
        timer: 0,
        hideGlobalTimer: true,
        pages: repeatPageSpecs('speaking-q', 5, { partLabel: 'Part 1', responseSeconds: 30, waitSeconds: 0 })
    },
    'B1-7': {
        timer: 50,
        hideGlobalTimer: true,
        pages: [
            ...repeatPageGroups(2, () => ([
                { type: 'speaking-intro', partLabel: 'Part 1 - Speaking' },
                { type: 'speaking-audio-q', partLabel: 'Part 1 - Speaking' },
                { type: 'speaking-audio-q', partLabel: 'Part 1 - Speaking' }
            ])),
            { type: 'writing-sentences', headerTitle: 'Part 1' },
            { type: 'writing-chat', headerTitle: 'Part 2' }
        ]
    },
    'B1-8': {
        timer: 40,
        pages: [
            { type: 'writing-describe-image', headerTitle: 'Part 1' },
            { type: 'writing-followup', headerTitle: 'Part 2' }
        ]
    },
    'B1-9': {
        timer: 35,
        pages: [
            ...repeatPageSpecs('reading-gap', 2, { partTitle: 'Part 1' }),
            ...repeatPageSpecs('reading-order', 3, { partTitle: 'Part 2' }),
            ...repeatPageSpecs('reading-match', 2, { partTitle: 'Part 3' })
        ]
    },
    'B1-10': {
        timer: 40,
        pages: [
            { type: 'writing-short', headerTitle: 'Part 1' },
            { type: 'writing-email', headerTitle: 'Part 2' }
        ]
    },
    'B1-11': {
        timer: 45,
        pages: repeatPageGroups(2, () => ([
            { type: 'writing-describe-image', headerTitle: 'Part 1' },
            { type: 'writing-followup', headerTitle: 'Part 2' }
        ]))
    },
    'B1-12': { cloneOf: 'B1-9' },

    'B2-1': { cloneOf: 'B1-1' },
    'B2-2': {
        timer: 30,
        pages: [
            ...repeatPageSpecs('reading-gap', 3, { partTitle: 'Part 1' }),
            ...repeatPageSpecs('reading-order', 3, { partTitle: 'Part 2' })
        ]
    },
    'B2-3': {
        timer: 25,
        pages: [
            ...repeatPageSpecs('listening-q', 5, { partLabel: 'Part 1' }),
            ...repeatPageSpecs('listening-topic', 2, { partLabel: 'Part 2' })
        ]
    },
    'B2-4': {
        timer: 60,
        pages: [
            { type: 'writing-short', headerTitle: 'Part 1' },
            { type: 'writing-email', headerTitle: 'Part 2' },
            { type: 'writing-email', headerTitle: 'Part 3' },
            { type: 'writing-email', headerTitle: 'Part 3' }
        ]
    },
    'B2-5': {
        timer: 0,
        hideGlobalTimer: true,
        pages: repeatPageSpecs('speaking-q', 5, { partLabel: 'Part 1', responseSeconds: 30, waitSeconds: 0 })
    },
    'B2-6': {
        timer: 30,
        pages: repeatPageSpecs('grammar', 30)
    },
    'B2-7': {
        timer: 35,
        pages: [
            ...repeatPageSpecs('reading-match', 2, { partTitle: 'Part 1' }),
            ...repeatPageSpecs('reading-heading', 2, { partTitle: 'Part 2' })
        ]
    },
    'B2-8': {
        timer: 30,
        pages: [
            ...repeatPageSpecs('listening-opinion', 2, { partLabel: 'Part 1' }),
            { type: 'listening-mcq-batch', partLabel: 'Part 2' }
        ]
    },
    'B2-9': {
        timer: 45,
        pages: [
            { type: 'writing-sentences', headerTitle: 'Part 1' },
            { type: 'writing-chat', headerTitle: 'Part 2' }
        ]
    },
    'B2-10': {
        timer: 60,
        hideGlobalTimer: true,
        pages: [
            ...repeatPageGroups(2, () => ([
                { type: 'speaking-intro', partLabel: 'Part 1 - Speaking' },
                { type: 'speaking-audio-q', partLabel: 'Part 1 - Speaking' },
                { type: 'speaking-audio-q', partLabel: 'Part 1 - Speaking' }
            ])),
            { type: 'writing-short', headerTitle: 'Part 2' },
            { type: 'writing-sentences', headerTitle: 'Part 2' },
            { type: 'writing-chat', headerTitle: 'Part 2' },
            { type: 'writing-email', headerTitle: 'Part 2' }
        ]
    },
    'B2-11': { cloneOf: 'B1-11' },
    'B2-12': { cloneOf: 'B1-12' },
    'B2-13': {
        timer: 60,
        pages: [
            { type: 'writing-short', headerTitle: 'Part 1' },
            { type: 'writing-sentences', headerTitle: 'Part 2' },
            { type: 'writing-chat', headerTitle: 'Part 3' },
            { type: 'writing-email', headerTitle: 'Part 4' }
        ]
    },
    'B2-14': { cloneOf: 'B1-11' },
    'B2-15': { cloneOf: 'B1-12' },
    'B2-16': { cloneOf: 'B2-13' },
    'B2-17': { cloneOf: 'B1-11' },
    'B2-18': { cloneOf: 'B1-12' }
};

const PAGE_TYPE_OPTIONS = [
    'grammar',
    'vocab',
    'listening-q',
    'listening-topic',
    'listening-opinion',
    'listening-mcq-batch',
    'reading-gap',
    'reading-order',
    'reading-match',
    'reading-heading',
    'writing-short',
    'writing-email',
    'writing-sentences',
    'writing-chat',
    'writing-describe-image',
    'writing-followup',
    'speaking-q',
    'speaking-intro',
    'speaking-audio-q'
];

const PAGE_TYPE_LABELS = {
    'grammar': 'Grammar',
    'vocab': 'Vocabulary',
    'listening-q': 'Listening - 1 câu',
    'listening-topic': 'Listening - Topic matching',
    'listening-opinion': 'Listening - Opinion (Man/Woman/Both)',
    'listening-mcq-batch': 'Listening - MCQ batch',
    'reading-gap': 'Reading Part 1 - Gap fill',
    'reading-order': 'Reading Part 2 - Order',
    'reading-match': 'Reading Part 3 - Match paragraph',
    'reading-heading': 'Reading Part 4 - Heading',
    'writing-short': 'Writing Part 1 - Short answer',
    'writing-email': 'Writing Email',
    'writing-sentences': 'Writing Sentences',
    'writing-chat': 'Writing Chat',
    'writing-describe-image': 'Writing Describe Image',
    'writing-followup': 'Writing Follow-up',
    'speaking-q': 'Speaking Part 1',
    'speaking-intro': 'Speaking Intro',
    'speaking-audio-q': 'Speaking Audio Question'
};

const SESSION_PREVIEW_STORAGE_PREFIX = '__minihippo_session_preview__';

/* ═══════════════════════════════════════════════════════
   INITIALIZATION
   ═══════════════════════════════════════════════════════ */

function initLopHocModule() {
    loadStudents();
    loadClasses();
    initSessionContentAdmin();
}

/* ═══════════════════════════════════════════════════════
   TAB SWITCHING
   ═══════════════════════════════════════════════════════ */

function switchTab(tabId) {
    lopHocState.activeTab = tabId;

    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => {
        el.style.display = 'none';
    });

    // Show selected tab
    const tab = document.getElementById(tabId);
    if (tab) tab.style.display = 'block';

    // Update sidebar active state
    document.querySelectorAll('.menu-item[data-tab]').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.menu-item[data-tab="${tabId}"]`);
    if (activeItem) activeItem.classList.add('active');

    // Update hero header
    const meta = TAB_META[tabId];
    if (meta) {
        const title = document.getElementById('workspace-title');
        const desc = document.getElementById('workspace-description');
        const breadcrumb = document.getElementById('workspace-breadcrumb');
        if (title) title.textContent = meta.title;
        if (desc) desc.textContent = meta.description;
        if (breadcrumb) breadcrumb.innerHTML = `<i class="bi bi-dot"></i><span>${meta.breadcrumb}</span>`;
    }

    // Tab-specific initialization
    if (tabId === 'tab-homework' || tabId === 'tab-submissions') {
        populateClassDropdowns();
    } else if (tabId === 'tab-session-content') {
        refreshSessionContentList();
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('show');
    }
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('show');
}

// Close sidebar on outside click (mobile)
document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebarToggle');
    if (window.innerWidth <= 768 && sidebar && toggle) {
        if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    }
});

/* ═══════════════════════════════════════════════════════
   API HELPERS
   ═══════════════════════════════════════════════════════ */

function getAuthHeaders() {
    const token =
        (typeof getAuthToken === 'function' ? getAuthToken() : null) ||
        localStorage.getItem('auth_token') ||
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token');

    const baseHeaders = {
        'Content-Type': 'application/json'
    };

    if (token) {
        baseHeaders['Authorization'] = `Bearer ${token}`;
    }

    if (typeof buildDeviceHeaders === 'function') {
        return buildDeviceHeaders(baseHeaders);
    }

    const deviceId = localStorage.getItem('mh_device_id') || localStorage.getItem('device_id') || 'admin-browser';
    const deviceName = localStorage.getItem('mh_device_header_name') || navigator.userAgent.substring(0, 50);

    return {
        ...baseHeaders,
        'X-Device-Id': encodeURIComponent(deviceId),
        'X-Device-Name': encodeURIComponent(deviceName)
    };
}

async function apiCall(url, options = {}, allowAuthRetry = true) {
    try {
        const res = await fetch(url, {
            ...options,
            headers: { ...getAuthHeaders(), ...(options.headers || {}) }
        });

        const raw = await res.text();
        let data = {};
        if (raw) {
            try {
                data = JSON.parse(raw);
            } catch {
                data = { raw };
            }
        }

        if (res.ok) {
            return data;
        }

        const errorMessage = data?.error || data?.message || `HTTP ${res.status}`;
        const isAuthError = res.status === 401;
        const shouldRetryWithRefresh =
            allowAuthRetry &&
            isAuthError &&
            typeof refreshAuthToken === 'function' &&
            /token|authorization|unauthorized|phiên|expired|invalid/i.test(String(errorMessage || ''));

        if (shouldRetryWithRefresh) {
            const refreshedToken = await refreshAuthToken();
            if (refreshedToken) {
                return apiCall(url, options, false);
            }
        }

        if (isAuthError && /token|authorization|unauthorized|phiên|expired|invalid/i.test(String(errorMessage || ''))) {
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi thử lưu custom.');
        }

        throw new Error(errorMessage);
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

/* ═══════════════════════════════════════════════════════
   STUDENTS - LOAD & FILTER
   ═══════════════════════════════════════════════════════ */

async function loadStudents() {
    try {
        const data = await apiCall(`/api/users/list?group=${USER_GROUP_CLASSROOM}`);
        lopHocState.students = data.users || data || [];
        filterStudents();
        updateStudentStats();
    } catch (err) {
        showAlert('student-table-body', 'Lỗi tải danh sách: ' + err.message, 'danger');
    }
}

function filterStudents() {
    const search = (document.getElementById('filter-search')?.value || '').toLowerCase().trim();
    const courseFilter = document.getElementById('filter-course')?.value || '';
    const bandFilter = document.getElementById('filter-band')?.value || '';

    lopHocState.filteredStudents = lopHocState.students.filter(u => {
        if (courseFilter && (u.course || '') !== courseFilter) return false;
        if (bandFilter && (u.band || '') !== bandFilter) return false;
        if (search) {
            const hay = [u.account_code, u.full_name, u.email, u.phone_number].join(' ').toLowerCase();
            if (!hay.includes(search)) return false;
        }
        return true;
    });

    renderStudentTable();
    updateStudentStats();
}

function updateStudentStats() {
    const all = lopHocState.students;
    document.getElementById('stat-total').textContent = all.length;
    document.getElementById('stat-lop-hoc').textContent = all.filter(u => u.course === 'Lớp học').length;
    document.getElementById('stat-b1').textContent = all.filter(u => u.band === 'B1').length;
    document.getElementById('stat-b2').textContent = all.filter(u => u.band === 'B2').length;
}

function renderStudentTable() {
    const tbody = document.getElementById('student-table-body');
    const empty = document.getElementById('student-empty');
    const table = document.getElementById('student-table');
    const list = lopHocState.filteredStudents;

    if (!list.length) {
        if (tbody) tbody.innerHTML = '';
        if (table) table.style.display = 'none';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (table) table.style.display = 'table';
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = list.map((u, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><strong>${esc(u.account_code || '')}</strong></td>
            <td>${esc(u.full_name || '')}</td>
            <td>${esc(u.email || '')}</td>
            <td>${esc(u.phone_number || '')}</td>
            <td>${courseBadge(u.course)}</td>
            <td>${bandBadge(u.band)}</td>
            <td>${formatDate(u.started_on)}</td>
            <td>${formatDate(u.expires_at)}</td>
            <td><span class="text-muted" style="font-size:0.78rem;">${esc(u.notes || '')}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="showStudentDetail('${u.id}')" title="Chi tiết">
                    <i class="bi bi-pencil-square"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/* ═══════════════════════════════════════════════════════
   STUDENTS - CREATE / EDIT
   ═══════════════════════════════════════════════════════ */

function showCreateStudentForm() {
    lopHocState.editingStudentId = null;
    document.getElementById('student-form-title').innerHTML = '<i class="bi bi-person-plus"></i> Thêm học viên mới';
    document.getElementById('sf-submit-btn').innerHTML = '<i class="bi bi-check-lg me-1"></i>Tạo học viên';
    document.getElementById('sf-submit-btn').onclick = submitStudentForm;

    // Clear form
    ['sf-account-code', 'sf-email', 'sf-password', 'sf-fullname', 'sf-phone', 'sf-notes',
     'sf-started-on', 'sf-expires-at'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('sf-device-limit').value = '2';
    document.getElementById('sf-course').value = 'Lớp học';
    document.getElementById('sf-band').value = '';
    document.getElementById('sf-account-code').readOnly = false;
    onCourseChange();

    document.getElementById('student-form-panel').style.display = 'block';
    document.getElementById('sf-result').style.display = 'none';
    document.getElementById('student-form-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideStudentForm() {
    document.getElementById('student-form-panel').style.display = 'none';
}

function onCourseChange() {
    const course = document.getElementById('sf-course').value;
    const bandGroup = document.getElementById('sf-band-group');
    if (course === 'Lớp ôn thi') {
        bandGroup.style.display = 'none';
        document.getElementById('sf-band').value = '';
    } else {
        bandGroup.style.display = 'block';
    }
}

async function submitStudentForm() {
    const btn = document.getElementById('sf-submit-btn');
    const resultEl = document.getElementById('sf-result');
    const accountCode = document.getElementById('sf-account-code').value.trim();
    const course = document.getElementById('sf-course').value;
    const email = document.getElementById('sf-email').value.trim();
    const band = document.getElementById('sf-band').value;

    if (!accountCode) {
        showResult(resultEl, 'Vui lòng nhập mã học viên.', 'warning');
        return;
    }
    if (!course) {
        showResult(resultEl, 'Vui lòng chọn khóa học.', 'warning');
        return;
    }
    if (course === 'Lớp học' && !band) {
        showResult(resultEl, 'Lớp học yêu cầu chọn band (B1 hoặc B2).', 'warning');
        return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showResult(resultEl, 'Email không hợp lệ.', 'warning');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang tạo...';

    try {
        const payload = {
            accountCode,
            email: email || undefined,
            password: document.getElementById('sf-password').value.trim() || undefined,
            fullName: document.getElementById('sf-fullname').value.trim() || undefined,
            phone: document.getElementById('sf-phone').value.trim() || undefined,
            deviceLimit: parseInt(document.getElementById('sf-device-limit').value) || 2,
            course,
            band: course === 'Lớp học' ? (band || undefined) : undefined,
            startedOn: document.getElementById('sf-started-on').value || undefined,
            expiresAt: document.getElementById('sf-expires-at').value || undefined,
            notes: document.getElementById('sf-notes').value.trim() || undefined,
            learningProgram: USER_GROUP_CLASSROOM
        };

        const data = await apiCall('/api/users/create', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        let msg = `Tạo thành công: <strong>${esc(accountCode)}</strong>`;
        if (data.temporaryPassword) {
            msg += ` | Mật khẩu: <code>${esc(data.temporaryPassword)}</code>`;
        }
        showResult(resultEl, msg, 'success');
        loadStudents();
    } catch (err) {
        showResult(resultEl, 'Lỗi: ' + err.message, 'danger');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-check-lg me-1"></i>Tạo học viên';
    }
}

/* ═══════════════════════════════════════════════════════
   STUDENTS - DETAIL / UPDATE / DELETE
   ═══════════════════════════════════════════════════════ */

function showStudentDetail(userId) {
    const user = lopHocState.students.find(u => u.id === userId);
    if (!user) return;

    lopHocState.selectedStudent = user;

    document.getElementById('sd-name').textContent = user.full_name || user.account_code || '';
    document.getElementById('sd-account-code').value = user.account_code || '';
    document.getElementById('sd-email').value = user.email || '';
    document.getElementById('sd-fullname').value = user.full_name || '';
    document.getElementById('sd-phone').value = user.phone_number || '';
    document.getElementById('sd-course').value = user.course || 'Lớp học';
    document.getElementById('sd-band').value = user.band || '';
    document.getElementById('sd-device-limit').value = user.device_limit || 2;
    document.getElementById('sd-started-on').value = user.started_on || '';
    document.getElementById('sd-expires-at').value = user.expires_at || '';
    document.getElementById('sd-status').value = user.status || 'active';
    document.getElementById('sd-notes').value = user.notes || '';

    onDetailCourseChange();

    document.getElementById('student-detail-panel').style.display = 'block';
    document.getElementById('sd-result').style.display = 'none';
    document.getElementById('student-detail-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideStudentDetail() {
    document.getElementById('student-detail-panel').style.display = 'none';
    lopHocState.selectedStudent = null;
}

function onDetailCourseChange() {
    const course = document.getElementById('sd-course').value;
    const bandGroup = document.getElementById('sd-band-group');
    if (course === 'Lớp ôn thi') {
        bandGroup.style.display = 'none';
        document.getElementById('sd-band').value = '';
    } else {
        bandGroup.style.display = 'block';
    }
}

async function saveStudentDetail() {
    const user = lopHocState.selectedStudent;
    if (!user) return;

    const resultEl = document.getElementById('sd-result');
    const course = document.getElementById('sd-course').value;

    try {
        const payload = {
            id: user.id,
            fullName: document.getElementById('sd-fullname').value.trim(),
            phone: document.getElementById('sd-phone').value.trim(),
            course,
            band: course === 'Lớp học' ? (document.getElementById('sd-band').value || '') : '',
            deviceLimit: parseInt(document.getElementById('sd-device-limit').value) || 2,
            startedOn: document.getElementById('sd-started-on').value || null,
            expiresAt: document.getElementById('sd-expires-at').value || null,
            status: document.getElementById('sd-status').value,
            notes: document.getElementById('sd-notes').value.trim(),
            learningProgram: USER_GROUP_CLASSROOM
        };

        await apiCall('/api/users/update', {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });

        showResult(resultEl, 'Cập nhật thành công!', 'success');
        loadStudents();
    } catch (err) {
        showResult(resultEl, 'Lỗi: ' + err.message, 'danger');
    }
}

async function deleteStudent() {
    const user = lopHocState.selectedStudent;
    if (!user) return;
    if (!confirm(`Xóa tài khoản "${user.account_code || user.email}"? Hành động này không thể hoàn tác.`)) return;

    try {
        const userId = String(user.id || '').trim();
        if (!userId) {
            throw new Error('Không tìm thấy id học viên để xóa.');
        }

        await apiCall(`/api/users/delete?id=${encodeURIComponent(userId)}`, {
            method: 'DELETE'
        });
        hideStudentDetail();
        loadStudents();
    } catch (err) {
        showResult(document.getElementById('sd-result'), 'Lỗi xóa: ' + err.message, 'danger');
    }
}

/* ═══════════════════════════════════════════════════════
   CSV IMPORT
   ═══════════════════════════════════════════════════════ */

function downloadCSVTemplate() {
    const header = 'account_code,email,full_name,phone,device_limit,started_on,expires_at,notes,course,band,password';
    const sample1 = 'HV001,,Nguyễn Văn A,0901234567,2,2025-04-01,2025-12-31,Lớp 18h 246,Lớp học,B1,';
    const sample2 = 'HV002,,Trần Thị B,0912345678,2,2025-04-01,2025-12-31,Lớp 18h 246,Lớp học,B2,';
    const csv = [header, sample1, sample2].join('\n');
    downloadFile('template_hoc_vien.csv', csv, 'text/csv');
}

function loadCSVFile() {
    document.getElementById('csv-file-input').click();
}

function handleCSVFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('csv-content').value = e.target.result;
    };
    reader.readAsText(file);
}

function normalizeCourseLabel(value) {
    const text = typeof value === 'string' ? value.trim() : '';
    const normalized = text.toLowerCase();
    if (!normalized) return 'Lớp học';
    if (normalized === 'lớp học' || normalized === 'lop hoc') return 'Lớp học';
    if (normalized === 'lớp ôn thi' || normalized === 'lop on thi') return 'Lớp ôn thi';
    if (normalized === 'aptis') return 'Aptis';
    return text;
}

function normalizeBandLabel(value) {
    const text = typeof value === 'string' ? value.trim().toUpperCase() : '';
    if (!text) return '';
    if (text === 'B1' || text === 'B2') return text;
    return null;
}

async function importCSV() {
    const csvText = document.getElementById('csv-content').value.trim();
    const resultEl = document.getElementById('csv-result');
    const statusEl = document.getElementById('csv-status');
    const btn = document.getElementById('csv-import-btn');

    if (!csvText) {
        showResult(resultEl, 'Vui lòng dán nội dung CSV.', 'warning');
        return;
    }

    const lines = csvText.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) {
        showResult(resultEl, 'CSV cần ít nhất header + 1 dòng dữ liệu.', 'warning');
        return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredCols = ['account_code'];
    for (const col of requiredCols) {
        if (!headers.includes(col)) {
            showResult(resultEl, `Thiếu cột bắt buộc: ${col}`, 'danger');
            return;
        }
    }

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        headers.forEach((h, idx) => { row[h] = (values[idx] || '').trim(); });
        if (row.account_code) rows.push(row);
    }

    if (!rows.length) {
        showResult(resultEl, 'Không tìm thấy dòng dữ liệu hợp lệ.', 'warning');
        return;
    }

    const validationErrors = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const lineNo = i + 2;
        const accountCode = row.account_code || `Dòng ${lineNo}`;
        const course = normalizeCourseLabel(row.course);
        const band = normalizeBandLabel(row.band);

        if (band === null) {
            validationErrors.push(`${accountCode}: band không hợp lệ, chỉ nhận B1 hoặc B2.`);
            continue;
        }
        if (course === 'Lớp học' && !band) {
            validationErrors.push(`${accountCode}: course "Lớp học" bắt buộc có band (B1/B2).`);
            continue;
        }

        row.course = course;
        row.band = band;
    }

    if (validationErrors.length) {
        showResult(
            resultEl,
            `CSV chưa hợp lệ:<br><small class="text-danger">${validationErrors.slice(0, 10).join('<br>')}</small>`,
            'danger'
        );
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang import...';

    let success = 0, fail = 0;
    const errors = [];
    const concurrency = 5;

    for (let i = 0; i < rows.length; i += concurrency) {
        const batch = rows.slice(i, i + concurrency);
        const results = await Promise.allSettled(batch.map(row => {
            const payload = {
                accountCode: row.account_code,
                email: row.email || undefined,
                fullName: row.full_name || undefined,
                phone: row.phone || undefined,
                course: row.course || 'Lớp học',
                band: row.band || undefined,
                startedOn: row.started_on || undefined,
                deviceLimit: parseInt(row.device_limit) || 2,
                expiresAt: row.expires_at || undefined,
                notes: row.notes || undefined,
                password: row.password || undefined,
                learningProgram: USER_GROUP_CLASSROOM
            };
            return apiCall('/api/users/create', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }));

        results.forEach((r, idx) => {
            if (r.status === 'fulfilled') {
                success++;
            } else {
                fail++;
                errors.push(`${batch[idx].account_code}: ${r.reason?.message || 'Unknown error'}`);
            }
        });

        statusEl.textContent = `${success + fail} / ${rows.length} ...`;
    }

    let msg = `Import xong: <strong>${success}</strong> thành công, <strong>${fail}</strong> thất bại.`;
    if (errors.length) {
        msg += `<br><small class="text-danger">${errors.slice(0, 10).join('<br>')}</small>`;
    }
    showResult(resultEl, msg, fail === 0 ? 'success' : 'warning');
    statusEl.textContent = '';

    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-cloud-upload me-1"></i>Import';
    loadStudents();
}

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"' && line[i + 1] === '"') {
                current += '"';
                i++;
            } else if (ch === '"') {
                inQuotes = false;
            } else {
                current += ch;
            }
        } else {
            if (ch === '"') {
                inQuotes = true;
            } else if (ch === ',') {
                result.push(current);
                current = '';
            } else {
                current += ch;
            }
        }
    }
    result.push(current);
    return result;
}

/* ═══════════════════════════════════════════════════════
   CLASSES MANAGEMENT
   ═══════════════════════════════════════════════════════ */

async function loadClasses() {
    try {
        const data = await apiCall('/api/practice_sets/list?type=homework_class');
        lopHocState.classes = data.sets || data || [];
    } catch {
        // Table may not exist yet - use empty array
        lopHocState.classes = [];
    }
    renderClassList();
}

function renderClassList() {
    const container = document.getElementById('class-list');
    const empty = document.getElementById('class-empty');
    const list = lopHocState.classes;

    if (!list.length) {
        if (container) container.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';

    container.innerHTML = list.map(cls => {
        const d = cls.data || {};
        return `
            <div class="class-card ${lopHocState.selectedClass?.id === cls.id ? 'selected' : ''}"
                 onclick="selectClass('${cls.id}')">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="fw-bold mb-1" style="font-size: 0.95rem;">${esc(cls.title || d.name || 'Lớp')}</h5>
                        <div class="text-muted" style="font-size: 0.78rem;">
                            <i class="bi bi-calendar3 me-1"></i>Lịch: <strong>${d.schedule || '246'}</strong>
                            &nbsp;|&nbsp;
                            <i class="bi bi-clock me-1"></i>${d.start_time || '18:00'}
                            &nbsp;|&nbsp;
                            ${bandBadge(d.band)}
                            &nbsp;|&nbsp;
                            ${d.num_sessions || 0} buổi
                        </div>
                        <div class="text-muted mt-1" style="font-size: 0.75rem;">
                            Ngày bắt đầu: ${formatDate(d.first_date)}
                        </div>
                    </div>
                    <div class="d-flex gap-1">
                        <button class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation(); editClass('${cls.id}')" title="Sửa">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="event.stopPropagation(); deleteClass('${cls.id}')" title="Xóa">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function selectClass(classId) {
    lopHocState.selectedClass = lopHocState.classes.find(c => c.id === classId) || null;
    renderClassList();
}

function showCreateClassForm() {
    document.getElementById('class-form-title').innerHTML = '<i class="bi bi-plus-circle"></i> Tạo lớp mới';
    ['cf-name', 'cf-notes', 'cf-first-date'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    document.getElementById('cf-schedule').value = '246';
    document.getElementById('cf-band').value = '';
    document.getElementById('cf-start-time').value = '18:00';
    document.getElementById('cf-num-sessions').value = '24';
    document.getElementById('cf-preview-section').style.display = 'none';
    document.getElementById('class-form-panel').style.display = 'block';
    document.getElementById('cf-result').style.display = 'none';
    document.getElementById('class-form-panel').scrollIntoView({ behavior: 'smooth' });
}

function hideClassForm() {
    document.getElementById('class-form-panel').style.display = 'none';
}

function editClass(classId) {
    const cls = lopHocState.classes.find(c => c.id === classId);
    if (!cls) return;
    const d = cls.data || {};

    document.getElementById('class-form-title').innerHTML = '<i class="bi bi-pencil"></i> Chỉnh sửa lớp';
    document.getElementById('cf-name').value = cls.title || d.name || '';
    document.getElementById('cf-schedule').value = d.schedule || '246';
    document.getElementById('cf-band').value = d.band || '';
    document.getElementById('cf-start-time').value = d.start_time || '18:00';
    document.getElementById('cf-first-date').value = d.first_date || '';
    document.getElementById('cf-num-sessions').value = d.num_sessions || 24;
    document.getElementById('cf-notes').value = d.notes || '';
    document.getElementById('cf-preview-section').style.display = 'none';
    document.getElementById('class-form-panel').style.display = 'block';
    document.getElementById('class-form-panel').scrollIntoView({ behavior: 'smooth' });

    // Store editing id
    document.getElementById('class-form-panel').dataset.editId = classId;
}

async function deleteClass(classId) {
    if (!confirm('Xóa lớp này? Dữ liệu buổi học liên quan cũng sẽ bị xóa.')) return;
    try {
        await apiCall(`/api/practice_sets/delete?id=${classId}`, { method: 'DELETE' });
        loadClasses();
    } catch (err) {
        alert('Lỗi xóa: ' + err.message);
    }
}

/* ═══════════════════════════════════════════════════════
   DEADLINE CALCULATION ENGINE
   ═══════════════════════════════════════════════════════ */

function calculateSessionDates(scheduleType, firstDateStr, numSessions) {
    const days = SCHEDULE_DAYS[scheduleType] || SCHEDULE_DAYS['246'];
    const sessions = [];

    const firstDate = new Date(firstDateStr + 'T00:00:00');
    if (isNaN(firstDate)) return sessions;

    let currentDate = new Date(firstDate);

    // Generate session dates
    let count = 0;
    const maxIterations = numSessions * 7; // safety limit
    let iterations = 0;

    while (count < numSessions && iterations < maxIterations) {
        const dow = currentDate.getDay();
        if (days.includes(dow)) {
            sessions.push(new Date(currentDate));
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
        iterations++;
    }

    return sessions;
}

function calculateDeadline(sessionDate, scheduleType, startTime) {
    // Deadline = start of NEXT session in the schedule
    const days = SCHEDULE_DAYS[scheduleType] || SCHEDULE_DAYS['246'];
    const deadline = new Date(sessionDate);

    // Find next scheduled day
    let found = false;
    for (let i = 0; i < 7; i++) {
        deadline.setDate(deadline.getDate() + 1);
        if (days.includes(deadline.getDay())) {
            found = true;
            break;
        }
    }

    // Set time
    if (startTime) {
        const [h, m] = startTime.split(':').map(Number);
        deadline.setHours(h || 18, m || 0, 0, 0);
    }

    return deadline;
}

function generateSessionsPreview(scheduleType, firstDate, startTime, numSessions) {
    const sessionDates = calculateSessionDates(scheduleType, firstDate, numSessions);
    return sessionDates.map((date, i) => {
        const deadline = calculateDeadline(date, scheduleType, startTime);
        return {
            number: i + 1,
            date: date,
            dayName: DAY_NAMES[date.getDay()],
            deadline: deadline,
            deadlineDayName: DAY_NAMES[deadline.getDay()]
        };
    });
}

function previewClassSessions() {
    const schedule = document.getElementById('cf-schedule').value;
    const firstDate = document.getElementById('cf-first-date').value;
    const startTime = document.getElementById('cf-start-time').value;
    const numSessions = parseInt(document.getElementById('cf-num-sessions').value) || 24;

    if (!firstDate) {
        alert('Vui lòng chọn ngày buổi đầu tiên.');
        return;
    }

    const sessions = generateSessionsPreview(schedule, firstDate, startTime, numSessions);

    const tbody = document.getElementById('cf-preview-body');
    tbody.innerHTML = sessions.map(s => `
        <tr>
            <td><strong>Buổi ${s.number}</strong></td>
            <td>${formatDateObj(s.date)}</td>
            <td>${s.dayName}</td>
            <td><span class="text-danger fw-bold">${formatDateObj(s.deadline)} ${startTime}</span></td>
            <td>${s.deadlineDayName}</td>
        </tr>
    `).join('');

    document.getElementById('cf-preview-section').style.display = 'block';
}

async function submitClassForm() {
    const name = document.getElementById('cf-name').value.trim();
    const schedule = document.getElementById('cf-schedule').value;
    const firstDate = document.getElementById('cf-first-date').value;
    const startTime = document.getElementById('cf-start-time').value;
    const numSessions = parseInt(document.getElementById('cf-num-sessions').value) || 24;
    const band = document.getElementById('cf-band').value;
    const notes = document.getElementById('cf-notes').value.trim();
    const resultEl = document.getElementById('cf-result');

    if (!name || !firstDate) {
        showResult(resultEl, 'Vui lòng nhập tên lớp và ngày buổi đầu tiên.', 'warning');
        return;
    }

    // Generate sessions data
    const sessions = generateSessionsPreview(schedule, firstDate, startTime, numSessions);
    const sessionsData = sessions.map(s => ({
        number: s.number,
        date: s.date.toISOString().split('T')[0],
        deadline: s.deadline.toISOString(),
        day_name: s.dayName
    }));

    const payload = {
        title: name,
        type: 'homework_class',
        description: `Lớp ${name} - Lịch ${schedule} - ${band || 'Không band'}`,
        data: {
            name,
            schedule,
            start_time: startTime,
            first_date: firstDate,
            num_sessions: numSessions,
            band,
            notes,
            sessions: sessionsData
        }
    };

    const editId = document.getElementById('class-form-panel').dataset.editId;

    try {
        if (editId) {
            payload.id = editId;
            await apiCall(`/api/practice_sets/update?id=${editId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showResult(resultEl, 'Cập nhật lớp thành công!', 'success');
            document.getElementById('class-form-panel').dataset.editId = '';
        } else {
            await apiCall('/api/practice_sets/create', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showResult(resultEl, 'Tạo lớp thành công!', 'success');
        }
        loadClasses();
    } catch (err) {
        showResult(resultEl, 'Lỗi: ' + err.message, 'danger');
    }
}

/* ═══════════════════════════════════════════════════════
   HOMEWORK SESSIONS & DEADLINES
   ═══════════════════════════════════════════════════════ */

function populateClassDropdowns() {
    const selects = ['hw-class-select', 'sub-class-select'];
    selects.forEach(selectId => {
        const sel = document.getElementById(selectId);
        if (!sel) return;
        const currentVal = sel.value;
        sel.innerHTML = '<option value="">-- Chọn lớp --</option>';
        lopHocState.classes.forEach(cls => {
            const d = cls.data || {};
            sel.innerHTML += `<option value="${cls.id}">${esc(cls.title)} (${d.schedule || ''})</option>`;
        });
        sel.value = currentVal;
    });
}

function loadHomeworkSessions() {
    const classId = document.getElementById('hw-class-select').value;
    const container = document.getElementById('hw-session-list');
    const empty = document.getElementById('hw-empty');

    if (!classId) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    const cls = lopHocState.classes.find(c => c.id === classId);
    if (!cls || !cls.data?.sessions) {
        container.innerHTML = '';
        empty.style.display = 'block';
        return;
    }

    empty.style.display = 'none';
    const sessions = cls.data.sessions;
    const now = new Date();

    container.innerHTML = sessions.map(s => {
        const deadline = new Date(s.deadline);
        const isExpired = deadline < now;
        const isToday = deadline.toDateString() === now.toDateString();
        let statusBadge = '';
        if (isExpired) {
            statusBadge = '<span class="badge-status badge-expired">Hết hạn</span>';
        } else if (isToday) {
            statusBadge = '<span class="badge-status badge-active">Hôm nay</span>';
        } else {
            statusBadge = '<span class="badge-status badge-upcoming">Sắp tới</span>';
        }

        return `
            <div class="session-card">
                <div class="session-number">${s.number}</div>
                <div class="session-info">
                    <div class="session-title">Buổi ${s.number} - ${s.day_name || ''}</div>
                    <div class="session-meta">
                        <i class="bi bi-calendar3 me-1"></i>${formatDate(s.date)}
                    </div>
                </div>
                <div class="session-deadline">
                    <div class="deadline-label">Deadline BTVN</div>
                    <div class="fw-bold ${isExpired ? 'text-danger' : 'text-success'}">
                        ${formatDateObj(deadline)} ${deadline.toTimeString().substring(0, 5)}
                    </div>
                    ${statusBadge}
                </div>
                <button class="btn btn-sm btn-outline-secondary ms-2" title="Chỉnh deadline"
                    onclick="openEditDeadline('${classId}', ${s.number}, '${s.deadline}')">
                    <i class="bi bi-pencil"></i>
                </button>
            </div>
        `;
    }).join('');
}

function openEditDeadline(classId, sessionNumber, currentDeadline) {
    document.getElementById('edit-session-id').value = `${classId}|${sessionNumber}`;
    document.getElementById('edit-session-label').textContent = `Buổi ${sessionNumber}`;

    const d = new Date(currentDeadline);
    document.getElementById('edit-deadline-date').value = d.toISOString().split('T')[0];
    document.getElementById('edit-deadline-time').value = d.toTimeString().substring(0, 5);

    const modal = new bootstrap.Modal(document.getElementById('editDeadlineModal'));
    modal.show();
}

async function saveDeadline() {
    const [classId, sessionNum] = document.getElementById('edit-session-id').value.split('|');
    const date = document.getElementById('edit-deadline-date').value;
    const time = document.getElementById('edit-deadline-time').value;

    if (!date || !time) {
        alert('Vui lòng chọn ngày và giờ.');
        return;
    }

    const cls = lopHocState.classes.find(c => c.id === classId);
    if (!cls) return;

    // Update session deadline in data
    const session = cls.data.sessions.find(s => s.number === parseInt(sessionNum));
    if (!session) return;

    session.deadline = new Date(`${date}T${time}:00`).toISOString();

    try {
        await apiCall(`/api/practice_sets/update?id=${classId}`, {
            method: 'PUT',
            body: JSON.stringify({
                data: cls.data
            })
        });

        bootstrap.Modal.getInstance(document.getElementById('editDeadlineModal')).hide();
        loadHomeworkSessions();
        loadClasses();
    } catch (err) {
        alert('Lỗi cập nhật: ' + err.message);
    }
}

/* ═══════════════════════════════════════════════════════
   SUBMISSIONS TRACKING
   ═══════════════════════════════════════════════════════ */

function loadSessionsForSubmission() {
    const classId = document.getElementById('sub-class-select').value;
    const sessionSelect = document.getElementById('sub-session-select');

    sessionSelect.innerHTML = '<option value="">-- Chọn buổi --</option>';
    document.getElementById('export-btn').disabled = true;

    if (!classId) return;

    const cls = lopHocState.classes.find(c => c.id === classId);
    if (!cls?.data?.sessions) return;

    cls.data.sessions.forEach(s => {
        sessionSelect.innerHTML += `<option value="${s.number}">Buổi ${s.number} - ${formatDate(s.date)}</option>`;
    });
}

function getSubmissionSortTime(submission) {
    return new Date(submission?.submitted_at || 0).getTime();
}

function isWritingSubmissionRecord(submission) {
    const md = submission?.metadata || {};
    if (md?.user_answers && typeof md.user_answers === 'object') return true;
    if (md?.auto_writing_feedback && typeof md.auto_writing_feedback === 'object') return true;
    const sessionType = normalizeStr(md?.session_type);
    const practiceType = normalizeStr(submission?.practice_type);
    return sessionType === 'writing' || practiceType === 'writing';
}

function isSpeakingSubmissionRecord(submission) {
    const md = submission?.metadata || {};
    if (Array.isArray(md?.speaking_answers) && md.speaking_answers.length) return true;
    const sessionType = normalizeStr(md?.session_type);
    const practiceType = normalizeStr(submission?.practice_type);
    return sessionType === 'speaking' || practiceType === 'speaking';
}

function hasSubmissionDetailRecord(submission) {
    return isWritingSubmissionRecord(submission) || isSpeakingSubmissionRecord(submission);
}

function renderSubmissionTypeBadges(submission) {
    const detailRows = submission?._detailRows || {};
    const hasWriting = !!detailRows.writing || isWritingSubmissionRecord(submission);
    const hasSpeaking = !!detailRows.speaking || isSpeakingSubmissionRecord(submission);
    const tags = [];

    if (hasWriting) tags.push('<span class="badge bg-light text-dark border me-1">Writing</span>');
    if (hasSpeaking) tags.push('<span class="badge bg-light text-dark border">Speaking</span>');
    if (!tags.length) return '<span class="text-muted">--</span>';
    return tags.join('');
}

async function loadSubmissions() {
    const classId = document.getElementById('sub-class-select').value;
    const sessionNum = document.getElementById('sub-session-select').value;
    const tbody = document.getElementById('submission-table-body');
    const empty = document.getElementById('sub-empty');
    const table = document.getElementById('submission-table');
    const summary = document.getElementById('sub-summary');
    const exportBtn = document.getElementById('export-btn');

    if (!classId || !sessionNum) {
        tbody.innerHTML = '';
        if (table) table.style.display = 'none';
        if (empty) empty.style.display = 'block';
        if (summary) summary.style.display = 'none';
        exportBtn.disabled = true;
        return;
    }

    // Load submissions from practice_results filtered by this class+session
    try {
        const data = await apiCall('/api/practice_results/list?limit=200');
        const results = data.results || data || [];

        // Filter results for this class and session
        const cls = lopHocState.classes.find(c => c.id === classId);
        const classTitle = cls?.title || '';

        // Accept both legacy homework rows (practice_type === 'homework') and
        // new-style rows (submission_kind marker in metadata) so we don't miss
        // writing/speaking homework submissions stored as writing/reading/etc.
        const sessionNumInt = parseInt(sessionNum);
        const classIdText = String(classId);
        const rawSubmissions = results.filter(r => {
            const md = r.metadata || {};
            const mdSession = parseInt(md.session_number);
            const matchesSession = mdSession === sessionNumInt;
            const resultClassId = String(r.set_id || md.class_id || '');
            const matchesClass = resultClassId === classIdText;
            const isHomework =
                r.practice_type === 'homework' ||
                md.submission_kind === 'homework';
            const hasDetail = hasSubmissionDetailRecord(r);
            return matchesClass && matchesSession && (isHomework || hasDetail);
        });

        // Keep a single row per user, but prefer rows containing writing/speaking payload
        // so admin can open details directly in this module.
        const byUser = new Map();
        rawSubmissions
            .sort((a, b) => new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime())
            .forEach((item) => {
                if (!item?.user_id) return;
                if (!byUser.has(item.user_id)) byUser.set(item.user_id, []);
                byUser.get(item.user_id).push(item);
            });

        const merged = [];
        byUser.forEach((rows, userId) => {
            const latestRow = rows[0] || null;
            const writingRow = rows.find(isWritingSubmissionRecord) || null;
            const speakingRow = rows.find(isSpeakingSubmissionRecord) || null;
            const primary = writingRow || speakingRow || latestRow;
            if (!primary) return;

            merged.push({
                ...primary,
                _detailRows: {
                    writing: writingRow,
                    speaking: speakingRow
                },
                _latestRow: latestRow
            });
        });

        merged.sort((a, b) => getSubmissionSortTime(b?._latestRow || b) - getSubmissionSortTime(a?._latestRow || a));
        lopHocState.submissions = merged;
        renderSubmissions(classId, classTitle, sessionNum);
    } catch (err) {
        console.error('Load submissions error:', err);
        lopHocState.submissions = [];
        renderSubmissions(classId, '', sessionNum);
    }
}

function normalizeStr(value) {
    return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getExpectedStudentsForClass(classId) {
    const cls = lopHocState.classes.find(c => c.id === classId);
    const d = cls?.data || {};
    const classBand = normalizeStr(d.band).toUpperCase();
    const classTitle = normalizeStr(cls?.title || d.name);

    const lopHocStudents = lopHocState.students.filter(u => normalizeStr(u.course) === 'lớp học');
    const bandMatched = classBand
        ? lopHocStudents.filter(u => normalizeStr(u.band).toUpperCase() === classBand)
        : lopHocStudents;

    if (!classTitle) return bandMatched;
    const titleMatched = bandMatched.filter(u => normalizeStr(u.notes).includes(classTitle));
    return titleMatched.length ? titleMatched : bandMatched;
}

function renderSubmissions(classId, classTitle, sessionNum) {
    const submissions = lopHocState.submissions;
    const tbody = document.getElementById('submission-table-body');
    const table = document.getElementById('submission-table');
    const empty = document.getElementById('sub-empty');
    const summary = document.getElementById('sub-summary');
    const exportBtn = document.getElementById('export-btn');

    exportBtn.disabled = false;

    if (!submissions.length) {
        tbody.innerHTML = '';
        if (table) table.style.display = 'none';
        if (empty) {
            empty.style.display = 'block';
            empty.innerHTML = `<i class="bi bi-clipboard-data d-block"></i><p class="mb-0">Chưa có học viên nào nộp bài cho buổi ${sessionNum}.</p>`;
        }
        if (summary) summary.style.display = 'none';
        return;
    }

    if (table) table.style.display = 'table';
    if (empty) empty.style.display = 'none';
    if (summary) summary.style.display = 'block';

    // Match submissions with student data
    tbody.innerHTML = submissions.map((sub, i) => {
        const user = lopHocState.students.find(u => u.id === sub.user_id) || {};
        const canViewDetail = hasSubmissionDetailRecord(sub) || !!(sub?._detailRows?.writing || sub?._detailRows?.speaking);
        return `
            <tr>
                <td>${i + 1}</td>
                <td>${formatDatetime(sub.submitted_at)}</td>
                <td>${esc(user.account_code || '')}</td>
                <td>${esc(user.email || '')}</td>
                <td>${esc(user.full_name || '')}</td>
                <td>${esc(user.phone_number || '')}</td>
                <td>${formatDate(user.started_on)}</td>
                <td>${formatDate(user.expires_at)}</td>
                <td>${bandBadge(user.band)}</td>
                <td>${renderSubmissionTypeBadges(sub)}</td>
                <td>Buổi ${sub.metadata?.session_number || sessionNum}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" ${canViewDetail ? '' : 'disabled'}
                        onclick="openSubmissionDetailByUser('${esc(String(sub.user_id || ''))}')">
                        <i class="bi bi-eye me-1"></i>Xem bài
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Update summary
    const expectedStudents = getExpectedStudentsForClass(classId);
    document.getElementById('sub-total').textContent = expectedStudents.length;
    document.getElementById('sub-submitted').textContent = submissions.length;
    document.getElementById('sub-missing').textContent =
        Math.max(0, expectedStudents.length - submissions.length);
}

function flattenWritingAnswersFromMetadata(metadata) {
    const output = [];
    const userAnswers = metadata?.user_answers;
    if (!userAnswers || typeof userAnswers !== 'object') return output;

    Object.keys(userAnswers).forEach((partKey) => {
        const items = userAnswers[partKey];
        if (!Array.isArray(items)) return;

        items.forEach((item, index) => {
            const key = String(item?.key || `${partKey}_${index + 1}`);
            const prompt = String(item?.prompt || '');
            const answer = String(item?.answer || '');
            const words = answer.trim() ? answer.trim().split(/\s+/).filter(Boolean).length : 0;
            const wordCount = Number.isFinite(Number(item?.word_count)) ? Number(item.word_count) : words;
            output.push({
                part: String(partKey),
                key,
                prompt,
                answer,
                wordCount
            });
        });
    });

    return output;
}

function buildSubmissionMetaChips(submission, user) {
    const md = submission?.metadata || {};
    const latest = submission?._latestRow || submission || {};
    const chips = [
        { label: 'Học viên', value: user?.full_name || user?.account_code || '--' },
        { label: 'Mã HV', value: user?.account_code || '--' },
        { label: 'Nộp lúc', value: formatDatetime(latest?.submitted_at || submission?.submitted_at) },
        { label: 'Buổi', value: `Buổi ${md?.session_number || '--'}` },
        { label: 'Band', value: md?.band || user?.band || '--' },
        { label: 'Lớp', value: md?.class_title || '--' }
    ];

    return chips.map((chip) => `
        <div class="submission-detail-chip">
            <span class="label">${esc(chip.label)}</span>
            <span>${esc(chip.value || '--')}</span>
        </div>
    `).join('');
}

function buildWritingDetailHtml(writingRow) {
    if (!writingRow) return '';
    const md = writingRow.metadata || {};
    const answers = flattenWritingAnswersFromMetadata(md);
    const autoFeedback = md?.auto_writing_feedback && typeof md.auto_writing_feedback === 'object'
        ? md.auto_writing_feedback
        : null;

    const feedbackByKey = new Map();
    if (Array.isArray(autoFeedback?.items)) {
        autoFeedback.items.forEach((item) => {
            const part = normalizeStr(item?.part || '');
            const key = String(item?.key || '');
            feedbackByKey.set(`${part}|${key}`, item);
            feedbackByKey.set(`|${key}`, item);
        });
    }

    const overallHtml = autoFeedback
        ? `
            <div class="submission-detail-card">
                <div class="prompt">AI feedback tổng quan</div>
                <div class="answer">${esc(autoFeedback.overall_feedback || 'Chưa có nhận xét tổng quan.')}</div>
                ${(Array.isArray(autoFeedback.common_errors) && autoFeedback.common_errors.length)
                    ? `<div class="corrected"><strong>Lỗi thường gặp:</strong><ul class="mb-0 mt-2">${autoFeedback.common_errors.map((err) => `<li>${esc(err)}</li>`).join('')}</ul></div>`
                    : ''}
            </div>
          `
        : '';

    if (!answers.length) {
        return `
            <div class="submission-detail-section-title"><i class="bi bi-pencil-square"></i>Writing</div>
            ${overallHtml}
            <div class="text-muted">Không có dữ liệu câu trả lời Writing trong bài nộp này.</div>
        `;
    }

    const answerHtml = answers.map((item, index) => {
        const key = `${normalizeStr(item.part)}|${item.key}`;
        const feedbackItem = feedbackByKey.get(key) || feedbackByKey.get(`|${item.key}`);
        const correctedText = String(feedbackItem?.corrected_answer || '').trim();
        const feedbackText = String(feedbackItem?.feedback || '').trim();

        return `
            <div class="submission-detail-card">
                <div class="prompt">[${esc(String(item.part || '').toUpperCase())}] Câu ${index + 1} ${item.key ? `- ${esc(item.key)}` : ''}</div>
                ${item.prompt ? `<div class="text-muted mb-2" style="font-size:0.82rem;">${esc(item.prompt)}</div>` : ''}
                <div class="answer">${esc(item.answer || '(Không có câu trả lời)')}</div>
                <div class="text-muted mt-2" style="font-size:0.78rem;">Số từ: ${Number(item.wordCount) || 0}</div>
                ${correctedText ? `<div class="corrected"><strong>AI sửa:</strong><br>${esc(correctedText)}</div>` : ''}
                ${feedbackText ? `<div class="corrected"><strong>Gợi ý:</strong><br>${esc(feedbackText)}</div>` : ''}
            </div>
        `;
    }).join('');

    return `
        <div class="submission-detail-section-title"><i class="bi bi-pencil-square"></i>Writing</div>
        ${overallHtml}
        ${answerHtml}
    `;
}

function normalizeMediaUrl(url) {
    const value = String(url || '').trim();
    if (!value) return '';
    if (value.toLowerCase().startsWith('javascript:')) return '';
    return value;
}

function escAttr(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function buildSpeakingDetailHtml(speakingRow) {
    if (!speakingRow) return '';
    const md = speakingRow.metadata || {};
    const answers = Array.isArray(md?.speaking_answers) ? md.speaking_answers : [];

    if (!answers.length) {
        return `
            <div class="submission-detail-section-title"><i class="bi bi-mic"></i>Speaking</div>
            <div class="text-muted">Không có dữ liệu câu trả lời Speaking trong bài nộp này.</div>
        `;
    }

    const answerHtml = answers.map((item, index) => {
        const recordingUrl = normalizeMediaUrl(item?.recording_url || item?.recordingUrl || item?.audio_url || item?.audioUrl);
        const answerText = String(item?.answer || '').trim();
        const prompt = String(item?.prompt || '').trim();
        const durationSeconds = Number(item?.recording_duration_seconds || item?.recordingDurationSeconds || item?.duration_seconds || 0);

        return `
            <div class="submission-detail-card">
                <div class="prompt">Câu ${index + 1}${item?.key ? ` - ${esc(item.key)}` : ''}</div>
                ${prompt ? `<div class="text-muted mb-2" style="font-size:0.82rem;">${esc(prompt)}</div>` : ''}
                <div class="answer">${esc(answerText || '(Không có ghi chú văn bản)')}</div>
                ${recordingUrl ? `
                    <div class="mt-2">
                        <audio controls preload="none" style="width:100%;">
                            <source src="${escAttr(recordingUrl)}">
                        </audio>
                    </div>
                ` : '<div class="text-muted mt-2" style="font-size:0.78rem;">Không có file ghi âm.</div>'}
                ${durationSeconds > 0 ? `<div class="text-muted mt-2" style="font-size:0.78rem;">Thời lượng: ${durationSeconds}s</div>` : ''}
            </div>
        `;
    }).join('');

    return `
        <div class="submission-detail-section-title"><i class="bi bi-mic"></i>Speaking</div>
        ${answerHtml}
    `;
}

function openSubmissionDetailByUser(userId) {
    const target = lopHocState.submissions.find((sub) => String(sub?.user_id || '') === String(userId || ''));
    if (!target) return;

    const user = lopHocState.students.find((u) => String(u?.id || '') === String(target.user_id || '')) || {};
    const titleEl = document.getElementById('submission-detail-title');
    const metaEl = document.getElementById('submission-detail-meta');
    const contentEl = document.getElementById('submission-detail-content');
    const modalEl = document.getElementById('submissionDetailModal');
    if (!titleEl || !metaEl || !contentEl || !modalEl) return;

    const writingRow = target?._detailRows?.writing || (isWritingSubmissionRecord(target) ? target : null);
    const speakingRow = target?._detailRows?.speaking || (isSpeakingSubmissionRecord(target) ? target : null);

    titleEl.textContent = `Chi tiết bài nộp - ${user?.full_name || user?.account_code || target.user_id || ''}`;
    metaEl.innerHTML = buildSubmissionMetaChips(target, user);

    const sections = [];
    if (writingRow) sections.push(buildWritingDetailHtml(writingRow));
    if (speakingRow) sections.push(buildSpeakingDetailHtml(speakingRow));
    if (!sections.length) {
        sections.push('<div class="text-muted">Bài nộp này chưa có dữ liệu chi tiết Writing/Speaking.</div>');
    }
    contentEl.innerHTML = sections.join('<hr class="my-3">');

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
}

function exportSubmissionsCSV() {
    const classId = document.getElementById('sub-class-select').value;
    const sessionNum = document.getElementById('sub-session-select').value;
    const cls = lopHocState.classes.find(c => c.id === classId);

    const header = 'Ngày nộp,Mã HV,Email,Họ tên,SĐT,Ngày khai giảng,Ngày kết thúc,Band,BTVN theo buổi nào';
    const rows = lopHocState.submissions.map(sub => {
        const user = lopHocState.students.find(u => u.id === sub.user_id) || {};
        return [
            formatDatetime(sub.submitted_at),
            user.account_code || '',
            user.email || '',
            user.full_name || '',
            user.phone_number || '',
            user.started_on || '',
            user.expires_at || '',
            user.band || '',
            `Buổi ${sub.metadata?.session_number || sessionNum}`
        ].map(v => `"${v}"`).join(',');
    });

    const csv = [header, ...rows].join('\n');
    const filename = `BTVN_${cls?.title || 'export'}_Buoi${sessionNum}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(filename, '\uFEFF' + csv, 'text/csv;charset=utf-8');
}

/* ═══════════════════════════════════════════════════════
   SESSION CONTENT ADMIN (BAND/SESSION JSON UPLOAD)
   ═══════════════════════════════════════════════════════ */

function initSessionContentAdmin() {
    populateSessionDropdown();
    populatePageTypeOptions();
    bindDraftPageListEvents();
    renderSessionGuide();
    loadSessionTemplate();
    refreshSessionContentList()
        .then(() => loadSessionContentEditor({ quiet: true }))
        .catch(() => {});
}

function bindDraftPageListEvents() {
    const listEl = document.getElementById('sc-page-list');
    if (!listEl || listEl.dataset.bound === '1') return;

    listEl.dataset.bound = '1';
    listEl.addEventListener('click', (event) => {
        const actionBtn = event.target.closest('button[data-action]');
        if (actionBtn && listEl.contains(actionBtn)) {
            const index = Number(actionBtn.dataset.pageIndex);
            if (!Number.isFinite(index)) return;

            const action = actionBtn.dataset.action;
            if (action === 'move-up') moveDraftPage(index, -1);
            if (action === 'move-down') moveDraftPage(index, 1);
            if (action === 'duplicate') duplicateDraftPage(index);
            if (action === 'delete') deleteDraftPage(index);
            return;
        }

        const row = event.target.closest('.builder-page-item[data-page-index]');
        if (!row || !listEl.contains(row)) return;
        const index = Number(row.dataset.pageIndex);
        if (!Number.isFinite(index)) return;
        selectDraftPage(index);
    });
}

function onSessionBandChange() {
    populateSessionDropdown();
    loadSessionContentEditor({ quiet: true });
}

function populateSessionDropdown() {
    const band = document.getElementById('sc-band')?.value || 'B1';
    const max = SESSION_LIMITS[band] || 12;
    const select = document.getElementById('sc-session');
    if (!select) return;

    const current = parseInt(select.value, 10);
    select.innerHTML = '';
    for (let i = 1; i <= max; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = `Buổi ${i}`;
        select.appendChild(opt);
    }

    if (current >= 1 && current <= max) {
        select.value = String(current);
    } else {
        select.value = '1';
    }
}

function renderSessionGuide() {
    const tbody = document.getElementById('sc-guide-body');
    if (!tbody) return;

    const keys = Object.keys(SESSION_STRUCTURE_GUIDE).sort((a, b) => {
        const [bandA, numA] = a.split('-');
        const [bandB, numB] = b.split('-');
        if (bandA !== bandB) return bandA.localeCompare(bandB);
        return parseInt(numA, 10) - parseInt(numB, 10);
    });

    tbody.innerHTML = keys.map(key => `
        <tr>
            <td><strong>${esc(key)}</strong></td>
            <td>${esc(SESSION_STRUCTURE_GUIDE[key])}</td>
        </tr>
    `).join('');
}

function getSelectedSessionKey() {
    const band = document.getElementById('sc-band')?.value || 'B1';
    const session = document.getElementById('sc-session')?.value || '1';
    return `${band}-${session}`;
}

function getSelectedBandSession() {
    const key = getSelectedSessionKey();
    const [band, session] = key.split('-');
    return {
        sessionKey: key,
        band: band || 'B1',
        session: parseInt(session, 10) || 1
    };
}

function deepClone(value) {
    return JSON.parse(JSON.stringify(value || {}));
}

function buildDefaultReadingGapRow(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        before: `Sentence ${safeIndex}: I`,
        after: 'to school.',
        options: ['go', 'goes', 'went'],
        answer: 'go'
    };
}

function buildDefaultReadingGapRows(count = 5) {
    const total = Number.isFinite(Number(count)) && Number(count) > 0 ? Number(count) : 5;
    return Array.from({ length: total }, (_, idx) => buildDefaultReadingGapRow(idx + 1));
}

function normalizeReadingGapRows(rows, minCount = 5) {
    const safeRows = Array.isArray(rows)
        ? rows
            .map((row) => (row && typeof row === 'object' && !Array.isArray(row) ? { ...row } : null))
            .filter(Boolean)
        : [];

    while (safeRows.length < minCount) {
        safeRows.push(buildDefaultReadingGapRow(safeRows.length + 1));
    }

    return safeRows;
}

function parseReadingGapOptionValues(text) {
    const raw = String(text || '');
    return raw
        .split(/\r?\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function renderReadingGapRowCard(row = {}, index = 1) {
    const safeRow = row && typeof row === 'object' && !Array.isArray(row) ? row : {};
    const before = typeof safeRow.before === 'string' ? safeRow.before : '';
    const after = typeof safeRow.after === 'string' ? safeRow.after : '';
    const answer = typeof safeRow.answer === 'string' ? safeRow.answer : '';
    const options = Array.isArray(safeRow.options)
        ? safeRow.options.map((item) => String(item || '').trim()).filter(Boolean)
        : parseReadingGapOptionValues(safeRow.options);

    if (answer && !options.includes(answer)) {
        options.push(answer);
    }

    return `
        <div class="tf-reading-gap-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Câu <span class="tf-reading-gap-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-gap-row" title="Xóa câu">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-6">
                    <label class="builder-form-label">Phần đầu câu</label>
                    <input type="text" class="form-control tf-gap-before" value="${esc(before)}" placeholder="Ví dụ: Where is the train">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Phần cuối câu</label>
                    <input type="text" class="form-control tf-gap-after" value="${esc(after)}" placeholder="Ví dụ: in this town?">
                </div>
                <div class="col-md-8">
                    <label class="builder-form-label">Lựa chọn (mỗi dòng 1 đáp án)</label>
                    <textarea class="form-control tf-gap-options" rows="2" placeholder="station&#10;school&#10;market">${esc(options.join('\n'))}</textarea>
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Đáp án đúng</label>
                    <input type="text" class="form-control tf-gap-answer" value="${esc(answer)}" placeholder="station">
                </div>
            </div>
        </div>
    `;
}

function refreshReadingGapEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-reading-gap-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-reading-gap-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindReadingGapEditorInteractions() {
    const listEl = document.getElementById('tf-reading-gap-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-reading-gap-add-btn');
    const add5Btn = document.getElementById('tf-reading-gap-add5-btn');

    const addRows = (count) => {
        const safeCount = Number.isFinite(Number(count)) ? Number(count) : 1;
        for (let i = 0; i < safeCount; i++) {
            const nextIndex = listEl.querySelectorAll('.tf-reading-gap-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderReadingGapRowCard(buildDefaultReadingGapRow(nextIndex), nextIndex));
        }
        refreshReadingGapEditorIndexes(listEl);
    };

    if (addBtn) {
        addBtn.addEventListener('click', () => addRows(1));
    }

    if (add5Btn) {
        add5Btn.addEventListener('click', () => addRows(5));
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-gap-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-reading-gap-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-reading-gap-row')?.remove();
        refreshReadingGapEditorIndexes(listEl);
    });

    refreshReadingGapEditorIndexes(listEl);
}

function buildDefaultReadingOrderSentence(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return `Sentence ${safeIndex}`;
}

function normalizeReadingOrderSentences(sentences, minCount = 3) {
    const safe = Array.isArray(sentences)
        ? sentences.map((s) => String(s || '').trim()).filter(Boolean)
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultReadingOrderSentence(safe.length + 1));
    }
    return safe;
}

function renderReadingOrderSentenceCard(sentence = '', index = 1) {
    return `
        <div class="tf-reading-order-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Câu <span class="tf-reading-order-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-reading-order-row" title="Xóa câu">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <label class="builder-form-label">Nội dung câu</label>
            <textarea class="form-control tf-reading-order-sentence" rows="2" placeholder="Nhập câu">${esc(sentence)}</textarea>
        </div>
    `;
}

function refreshReadingOrderEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-reading-order-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-reading-order-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindReadingOrderEditorInteractions() {
    const listEl = document.getElementById('tf-reading-order-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-reading-order-add-btn');
    const add5Btn = document.getElementById('tf-reading-order-add5-btn');

    const addRows = (count) => {
        const safeCount = Number.isFinite(Number(count)) ? Number(count) : 1;
        for (let i = 0; i < safeCount; i++) {
            const nextIndex = listEl.querySelectorAll('.tf-reading-order-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderReadingOrderSentenceCard(buildDefaultReadingOrderSentence(nextIndex), nextIndex));
        }
        refreshReadingOrderEditorIndexes(listEl);
    };

    if (addBtn) addBtn.addEventListener('click', () => addRows(1));
    if (add5Btn) add5Btn.addEventListener('click', () => addRows(5));

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-reading-order-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-reading-order-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-reading-order-row')?.remove();
        refreshReadingOrderEditorIndexes(listEl);
    });

    refreshReadingOrderEditorIndexes(listEl);
}

function normalizeReadingMatchAnswerLetter(value) {
    const answer = String(value || '').trim().toUpperCase();
    return ['A', 'B', 'C', 'D'].includes(answer) ? answer : '';
}

function buildDefaultReadingMatchQuestion(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        prompt: `Question ${safeIndex}`,
        answer: 'A'
    };
}

function normalizeReadingMatchQuestions(questions, minCount = 1) {
    const safe = Array.isArray(questions)
        ? questions
            .map((q) => (q && typeof q === 'object' && !Array.isArray(q) ? q : null))
            .filter(Boolean)
            .map((q) => ({
                prompt: String(q.prompt || '').trim(),
                answer: normalizeReadingMatchAnswerLetter(q.answer) || 'A'
            }))
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultReadingMatchQuestion(safe.length + 1));
    }
    return safe;
}

function renderReadingMatchQuestionCard(question = {}, index = 1) {
    const safe = question && typeof question === 'object' && !Array.isArray(question)
        ? question
        : {};
    const answer = normalizeReadingMatchAnswerLetter(safe.answer) || 'A';
    return `
        <div class="tf-reading-match-question-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Câu hỏi <span class="tf-reading-match-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-reading-match-question" title="Xóa câu hỏi">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-9">
                    <label class="builder-form-label">Nội dung câu hỏi</label>
                    <input type="text" class="form-control tf-reading-match-prompt" value="${esc(safe.prompt || '')}" placeholder="Ví dụ: Who finds flying tiring?">
                </div>
                <div class="col-md-3">
                    <label class="builder-form-label">Đáp án đúng</label>
                    <select class="form-select tf-reading-match-answer">
                        ${['A', 'B', 'C', 'D'].map((letter) => `<option value="${letter}" ${answer === letter ? 'selected' : ''}>${letter}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
}

function refreshReadingMatchEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-reading-match-question-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-reading-match-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindReadingMatchEditorInteractions() {
    const listEl = document.getElementById('tf-reading-match-question-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-reading-match-add-question-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-reading-match-question-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderReadingMatchQuestionCard(buildDefaultReadingMatchQuestion(nextIndex), nextIndex));
            refreshReadingMatchEditorIndexes(listEl);
        });
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-reading-match-question"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-reading-match-question-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-reading-match-question-row')?.remove();
        refreshReadingMatchEditorIndexes(listEl);
    });

    refreshReadingMatchEditorIndexes(listEl);
}

function buildDefaultReadingHeadingOption(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return `Heading ${safeIndex}`;
}

function normalizeReadingHeadingOptions(headings, minCount = 2) {
    const safe = Array.isArray(headings)
        ? headings.map((h) => String(h || '').trim()).filter(Boolean)
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultReadingHeadingOption(safe.length + 1));
    }
    return safe;
}

function buildDefaultReadingHeadingParagraph(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        text: `Paragraph ${safeIndex}`,
        answerIndex: 0
    };
}

function normalizeReadingHeadingParagraphRows(paragraphs, answers, headings, minCount = 2) {
    const paragraphArr = Array.isArray(paragraphs)
        ? paragraphs.map((p) => String(p || '').trim())
        : [];
    const answerArr = Array.isArray(answers) ? answers : [];
    const headingCount = Array.isArray(headings) ? headings.length : 0;
    const count = Math.max(minCount, paragraphArr.length, answerArr.length);
    const rows = [];
    for (let i = 0; i < count; i++) {
        const parsed = parseInt(answerArr[i], 10);
        const answerIndex = Number.isFinite(parsed) && parsed >= 0 && parsed < headingCount ? parsed : 0;
        rows.push({
            text: paragraphArr[i] || buildDefaultReadingHeadingParagraph(i + 1).text,
            answerIndex
        });
    }
    return rows;
}

function renderReadingHeadingOptionCard(text = '', index = 1) {
    return `
        <div class="tf-reading-heading-option-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Heading <span class="tf-reading-heading-option-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-reading-heading-option" title="Xóa heading">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <input type="text" class="form-control tf-reading-heading-option-text" value="${esc(text || '')}" placeholder="Nhập heading">
        </div>
    `;
}

function renderReadingHeadingParagraphCard(row = {}, index = 1, headings = []) {
    const safe = row && typeof row === 'object' && !Array.isArray(row)
        ? row
        : buildDefaultReadingHeadingParagraph(index);
    const headingList = Array.isArray(headings) ? headings : [];
    const selected = Number.isFinite(Number(safe.answerIndex)) ? Number(safe.answerIndex) : 0;
    return `
        <div class="tf-reading-heading-paragraph-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Paragraph <span class="tf-reading-heading-paragraph-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-reading-heading-paragraph" title="Xóa đoạn">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-8">
                    <label class="builder-form-label">Nội dung paragraph</label>
                    <textarea class="form-control tf-reading-heading-paragraph-text" rows="3" placeholder="Nhập đoạn văn">${esc(safe.text || '')}</textarea>
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Heading đúng</label>
                    <select class="form-select tf-reading-heading-answer" data-answer-index="${selected}">
                        ${headingList.map((heading, idx) => `<option value="${idx}" ${selected === idx ? 'selected' : ''}>${idx + 1}. ${esc(heading)}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
}

function refreshReadingHeadingOptionIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-reading-heading-option-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-reading-heading-option-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function refreshReadingHeadingParagraphIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-reading-heading-paragraph-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-reading-heading-paragraph-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function refreshReadingHeadingAnswerSelects() {
    const headingRows = Array.from(document.querySelectorAll('#tf-reading-heading-option-list .tf-reading-heading-option-row'));
    const headings = headingRows
        .map((row) => row.querySelector('.tf-reading-heading-option-text')?.value.trim() || '')
        .filter(Boolean);

    const paragraphRows = Array.from(document.querySelectorAll('#tf-reading-heading-paragraph-list .tf-reading-heading-paragraph-row'));
    paragraphRows.forEach((row) => {
        const select = row.querySelector('.tf-reading-heading-answer');
        if (!select) return;
        const rawSelected = select.value || select.dataset.answerIndex || '0';
        const parsed = parseInt(rawSelected, 10);
        const safeIndex = Number.isFinite(parsed) && parsed >= 0 && parsed < headings.length ? parsed : 0;
        select.innerHTML = headings.length
            ? headings.map((heading, idx) => `<option value="${idx}" ${safeIndex === idx ? 'selected' : ''}>${idx + 1}. ${esc(heading)}</option>`).join('')
            : '<option value="0">-- chưa có heading --</option>';
        select.dataset.answerIndex = String(headings.length ? safeIndex : 0);
        select.value = String(headings.length ? safeIndex : 0);
    });
}

function bindReadingHeadingEditorInteractions() {
    const optionList = document.getElementById('tf-reading-heading-option-list');
    const paragraphList = document.getElementById('tf-reading-heading-paragraph-list');
    if (!optionList || !paragraphList) return;

    const addOptionBtn = document.getElementById('tf-reading-heading-add-option-btn');
    const addParagraphBtn = document.getElementById('tf-reading-heading-add-paragraph-btn');

    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', () => {
            const nextIndex = optionList.querySelectorAll('.tf-reading-heading-option-row').length + 1;
            optionList.insertAdjacentHTML('beforeend', renderReadingHeadingOptionCard(buildDefaultReadingHeadingOption(nextIndex), nextIndex));
            refreshReadingHeadingOptionIndexes(optionList);
            refreshReadingHeadingAnswerSelects();
        });
    }

    if (addParagraphBtn) {
        addParagraphBtn.addEventListener('click', () => {
            const headings = Array.from(optionList.querySelectorAll('.tf-reading-heading-option-text'))
                .map((input) => input.value.trim())
                .filter(Boolean);
            const nextIndex = paragraphList.querySelectorAll('.tf-reading-heading-paragraph-row').length + 1;
            paragraphList.insertAdjacentHTML(
                'beforeend',
                renderReadingHeadingParagraphCard(buildDefaultReadingHeadingParagraph(nextIndex), nextIndex, headings)
            );
            refreshReadingHeadingParagraphIndexes(paragraphList);
            refreshReadingHeadingAnswerSelects();
        });
    }

    optionList.addEventListener('input', (event) => {
        if (!event.target.closest('.tf-reading-heading-option-text')) return;
        refreshReadingHeadingAnswerSelects();
    });

    optionList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-reading-heading-option"]');
        if (!removeBtn) return;
        const rows = optionList.querySelectorAll('.tf-reading-heading-option-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-reading-heading-option-row')?.remove();
        refreshReadingHeadingOptionIndexes(optionList);
        refreshReadingHeadingAnswerSelects();
    });

    paragraphList.addEventListener('change', (event) => {
        const select = event.target.closest('.tf-reading-heading-answer');
        if (!select) return;
        select.dataset.answerIndex = String(select.value || '0');
    });

    paragraphList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-reading-heading-paragraph"]');
        if (!removeBtn) return;
        const rows = paragraphList.querySelectorAll('.tf-reading-heading-paragraph-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-reading-heading-paragraph-row')?.remove();
        refreshReadingHeadingParagraphIndexes(paragraphList);
        refreshReadingHeadingAnswerSelects();
    });

    refreshReadingHeadingOptionIndexes(optionList);
    refreshReadingHeadingParagraphIndexes(paragraphList);
    refreshReadingHeadingAnswerSelects();
}

function normalizeListeningOpinionAnswer(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'man') return 'Man';
    if (normalized === 'woman') return 'Woman';
    if (normalized === 'both') return 'Both';
    return 'Man';
}

function buildDefaultListeningOpinionRow(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        statement: `Statement ${safeIndex}`,
        answer: 'Man'
    };
}

function normalizeListeningOpinionRows(statements, answers, minCount = 2) {
    const statementArr = Array.isArray(statements)
        ? statements.map((s) => String(s || '').trim())
        : [];
    const answerArr = Array.isArray(answers)
        ? answers.map((s) => normalizeListeningOpinionAnswer(s))
        : [];
    const count = Math.max(minCount, statementArr.length, answerArr.length);
    const rows = [];
    for (let i = 0; i < count; i++) {
        rows.push({
            statement: statementArr[i] || buildDefaultListeningOpinionRow(i + 1).statement,
            answer: normalizeListeningOpinionAnswer(answerArr[i])
        });
    }
    return rows;
}

function renderListeningOpinionRowCard(row = {}, index = 1) {
    const safe = row && typeof row === 'object' && !Array.isArray(row) ? row : {};
    const answer = normalizeListeningOpinionAnswer(safe.answer);
    return `
        <div class="tf-listening-opinion-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Statement <span class="tf-listening-opinion-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-listening-opinion-row" title="Xóa statement">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-9">
                    <label class="builder-form-label">Nội dung statement</label>
                    <input type="text" class="form-control tf-listening-opinion-statement" value="${esc(safe.statement || '')}" placeholder="Ví dụ: likes quiet places">
                </div>
                <div class="col-md-3">
                    <label class="builder-form-label">Đáp án</label>
                    <select class="form-select tf-listening-opinion-answer">
                        <option value="Man" ${answer === 'Man' ? 'selected' : ''}>Man</option>
                        <option value="Woman" ${answer === 'Woman' ? 'selected' : ''}>Woman</option>
                        <option value="Both" ${answer === 'Both' ? 'selected' : ''}>Both</option>
                    </select>
                </div>
            </div>
        </div>
    `;
}

function refreshListeningOpinionEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-listening-opinion-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-listening-opinion-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindListeningOpinionEditorInteractions() {
    const listEl = document.getElementById('tf-listening-opinion-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-listening-opinion-add-btn');
    const add5Btn = document.getElementById('tf-listening-opinion-add5-btn');

    const addRows = (count) => {
        const safeCount = Number.isFinite(Number(count)) ? Number(count) : 1;
        for (let i = 0; i < safeCount; i++) {
            const nextIndex = listEl.querySelectorAll('.tf-listening-opinion-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderListeningOpinionRowCard(buildDefaultListeningOpinionRow(nextIndex), nextIndex));
        }
        refreshListeningOpinionEditorIndexes(listEl);
    };

    if (addBtn) addBtn.addEventListener('click', () => addRows(1));
    if (add5Btn) add5Btn.addEventListener('click', () => addRows(5));

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-listening-opinion-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-listening-opinion-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-listening-opinion-row')?.remove();
        refreshListeningOpinionEditorIndexes(listEl);
    });

    refreshListeningOpinionEditorIndexes(listEl);
}

function buildDefaultGrammarOption(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    const letter = String.fromCharCode(64 + ((safeIndex - 1) % 26) + 1);
    return `Option ${letter}`;
}

function normalizeGrammarOptions(options, minCount = 3) {
    const safe = Array.isArray(options)
        ? options.map((opt) => String(opt || '').trim()).filter(Boolean)
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultGrammarOption(safe.length + 1));
    }
    return safe;
}

function renderGrammarOptionRowCard(option = '', index = 1) {
    return `
        <div class="tf-grammar-option-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Option <span class="tf-grammar-option-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-grammar-option" title="Xóa option">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <input type="text" class="form-control tf-grammar-option-text" value="${esc(option || '')}" placeholder="Nhập option">
        </div>
    `;
}

function refreshGrammarOptionIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-grammar-option-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-grammar-option-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function refreshGrammarAnswerSelectOptions() {
    const optionList = document.getElementById('tf-grammar-option-list');
    const answerSelect = document.getElementById('tf-answer');
    if (!optionList || !answerSelect) return;

    const options = Array.from(optionList.querySelectorAll('.tf-grammar-option-text'))
        .map((input) => input.value.trim())
        .filter(Boolean);

    const previousValue = String(answerSelect.value || '').trim();
    if (!options.length) {
        answerSelect.innerHTML = '<option value="">-- chưa có option --</option>';
        answerSelect.value = '';
        return;
    }

    answerSelect.innerHTML = options
        .map((option) => `<option value="${esc(option)}">${esc(option)}</option>`)
        .join('');

    answerSelect.value = options.includes(previousValue) ? previousValue : options[0];
}

function bindGrammarEditorInteractions() {
    const listEl = document.getElementById('tf-grammar-option-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-grammar-add-option-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-grammar-option-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderGrammarOptionRowCard(buildDefaultGrammarOption(nextIndex), nextIndex));
            refreshGrammarOptionIndexes(listEl);
            refreshGrammarAnswerSelectOptions();
        });
    }

    listEl.addEventListener('input', (event) => {
        if (!event.target.closest('.tf-grammar-option-text')) return;
        refreshGrammarAnswerSelectOptions();
    });

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-grammar-option"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-grammar-option-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-grammar-option-row')?.remove();
        refreshGrammarOptionIndexes(listEl);
        refreshGrammarAnswerSelectOptions();
    });

    refreshGrammarOptionIndexes(listEl);
    refreshGrammarAnswerSelectOptions();
}

const VOCAB_LETTER_SEQUENCE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N'];

function buildDefaultVocabOptionRow(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    const letter = VOCAB_LETTER_SEQUENCE[(safeIndex - 1) % VOCAB_LETTER_SEQUENCE.length];
    return {
        letter,
        word: `Word ${safeIndex}`
    };
}

function normalizeVocabOptionRows(options, minCount = 3) {
    const safe = Array.isArray(options)
        ? options
            .map((item) => (item && typeof item === 'object' && !Array.isArray(item) ? item : null))
            .filter(Boolean)
            .map((item) => ({
                letter: String(item.letter || '').trim().toUpperCase(),
                word: String(item.word || '').trim()
            }))
            .filter((item) => item.letter || item.word)
        : [];

    while (safe.length < minCount) {
        safe.push(buildDefaultVocabOptionRow(safe.length + 1));
    }
    return safe;
}

function getVocabOptionLetters(options = []) {
    const fromOptions = (Array.isArray(options) ? options : [])
        .map((item) => String(item?.letter || '').trim().toUpperCase())
        .filter(Boolean);
    if (fromOptions.length) return fromOptions;
    return ['A', 'B', 'C'];
}

function buildDefaultVocabItemRow(partKey = 'part1', index = 1) {
    const safePart = normalizeVocabPartKey(partKey);
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    if (safePart === 'part2') {
        return { num: safeIndex, text: `Sentence ${safeIndex}`, answer: 'A' };
    }
    if (safePart === 'part3') {
        return { num: safeIndex, before: `Before ${safeIndex}`, after: `After ${safeIndex}`, answer: 'A' };
    }
    return { num: safeIndex, word: `Word ${safeIndex}`, answer: 'A' };
}

function normalizeVocabItemRows(partKey = 'part1', data = {}, minCount = 1) {
    const safePart = normalizeVocabPartKey(partKey);
    let rows = [];

    if (safePart === 'part2') {
        rows = Array.isArray(data.sentences)
            ? data.sentences
                .map((item, idx) => ({
                    num: Number.isFinite(parseInt(item?.num, 10)) ? parseInt(item.num, 10) : idx + 1,
                    text: String(item?.text || '').trim(),
                    answer: String(item?.answer || '').trim().toUpperCase()
                }))
                .filter((item) => item.text || item.answer)
            : [];
    } else if (safePart === 'part3') {
        rows = Array.isArray(data.sentences)
            ? data.sentences
                .map((item, idx) => ({
                    num: Number.isFinite(parseInt(item?.num, 10)) ? parseInt(item.num, 10) : idx + 1,
                    before: String(item?.before || '').trim(),
                    after: String(item?.after || '').trim(),
                    answer: String(item?.answer || '').trim().toUpperCase()
                }))
                .filter((item) => item.before || item.after || item.answer)
            : [];
    } else {
        rows = Array.isArray(data.words)
            ? data.words
                .map((item, idx) => ({
                    num: Number.isFinite(parseInt(item?.num, 10)) ? parseInt(item.num, 10) : idx + 1,
                    word: String(item?.word || '').trim(),
                    answer: String(item?.answer || '').trim().toUpperCase()
                }))
                .filter((item) => item.word || item.answer)
            : [];
    }

    while (rows.length < minCount) {
        rows.push(buildDefaultVocabItemRow(safePart, rows.length + 1));
    }
    return rows;
}

function renderVocabAnswerLetterSelect(letters = [], selected = '', className = '') {
    const optionLetters = Array.isArray(letters) && letters.length ? letters : ['A', 'B', 'C'];
    const normalizedSelected = String(selected || '').trim().toUpperCase();
    const selectedValue = optionLetters.includes(normalizedSelected) ? normalizedSelected : optionLetters[0];
    return `
        <select class="form-select ${className}" data-answer="${esc(selectedValue)}">
            ${optionLetters.map((letter) => `<option value="${esc(letter)}" ${selectedValue === letter ? 'selected' : ''}>${esc(letter)}</option>`).join('')}
        </select>
    `;
}

function renderVocabOptionRowCard(option = {}, index = 1) {
    const safe = option && typeof option === 'object' && !Array.isArray(option)
        ? option
        : buildDefaultVocabOptionRow(index);
    return `
        <div class="tf-vocab-option-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Option <span class="tf-vocab-option-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-vocab-option" title="Xóa option">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-3">
                    <label class="builder-form-label">Letter</label>
                    <input type="text" class="form-control tf-vocab-option-letter" value="${esc(String(safe.letter || '').toUpperCase())}" maxlength="2" placeholder="A">
                </div>
                <div class="col-md-9">
                    <label class="builder-form-label">Word</label>
                    <input type="text" class="form-control tf-vocab-option-word" value="${esc(safe.word || '')}" placeholder="Nhập từ">
                </div>
            </div>
        </div>
    `;
}

function renderVocabItemRowCard(partKey = 'part1', row = {}, index = 1, letters = []) {
    const safePart = normalizeVocabPartKey(partKey);
    const safe = row && typeof row === 'object' && !Array.isArray(row)
        ? row
        : buildDefaultVocabItemRow(safePart, index);
    const answerSelect = renderVocabAnswerLetterSelect(letters, safe.answer, 'tf-vocab-item-answer-select');

    if (safePart === 'part2') {
        return `
            <div class="tf-vocab-item-row border rounded p-3 mb-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0" style="font-size:0.84rem;">Sentence <span class="tf-vocab-item-index">${index}</span></h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-vocab-item" title="Xóa dòng">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-2">
                        <label class="builder-form-label">Num</label>
                        <input type="number" class="form-control tf-vocab-item-num" value="${esc(String(safe.num || index))}">
                    </div>
                    <div class="col-md-7">
                        <label class="builder-form-label">Sentence</label>
                        <input type="text" class="form-control tf-vocab-item-text" value="${esc(safe.text || '')}" placeholder="Nhập câu">
                    </div>
                    <div class="col-md-3">
                        <label class="builder-form-label">Answer</label>
                        ${answerSelect}
                    </div>
                </div>
            </div>
        `;
    }

    if (safePart === 'part3') {
        return `
            <div class="tf-vocab-item-row border rounded p-3 mb-2">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0" style="font-size:0.84rem;">Sentence <span class="tf-vocab-item-index">${index}</span></h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-vocab-item" title="Xóa dòng">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-2">
                        <label class="builder-form-label">Num</label>
                        <input type="number" class="form-control tf-vocab-item-num" value="${esc(String(safe.num || index))}">
                    </div>
                    <div class="col-md-4">
                        <label class="builder-form-label">Before</label>
                        <input type="text" class="form-control tf-vocab-item-before" value="${esc(safe.before || '')}" placeholder="Nhập vế trước">
                    </div>
                    <div class="col-md-4">
                        <label class="builder-form-label">After</label>
                        <input type="text" class="form-control tf-vocab-item-after" value="${esc(safe.after || '')}" placeholder="Nhập vế sau">
                    </div>
                    <div class="col-md-2">
                        <label class="builder-form-label">Answer</label>
                        ${answerSelect}
                    </div>
                </div>
            </div>
        `;
    }

    return `
        <div class="tf-vocab-item-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Word <span class="tf-vocab-item-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-vocab-item" title="Xóa dòng">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-2">
                    <label class="builder-form-label">Num</label>
                    <input type="number" class="form-control tf-vocab-item-num" value="${esc(String(safe.num || index))}">
                </div>
                <div class="col-md-7">
                    <label class="builder-form-label">Word</label>
                    <input type="text" class="form-control tf-vocab-item-word" value="${esc(safe.word || '')}" placeholder="Nhập từ">
                </div>
                <div class="col-md-3">
                    <label class="builder-form-label">Answer</label>
                    ${answerSelect}
                </div>
            </div>
        </div>
    `;
}

function refreshVocabOptionIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-vocab-option-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-vocab-option-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function refreshVocabItemIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-vocab-item-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-vocab-item-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function refreshVocabAnswerSelectOptions() {
    const optionList = document.getElementById('tf-vocab-option-list');
    if (!optionList) return;

    const letters = getVocabOptionLetters(
        Array.from(optionList.querySelectorAll('.tf-vocab-option-row')).map((row) => ({
            letter: row.querySelector('.tf-vocab-option-letter')?.value.trim().toUpperCase() || ''
        }))
    );

    const syncSelect = (selectEl) => {
        if (!selectEl) return;
        const previousValue = String(selectEl.value || selectEl.dataset.answer || '').trim().toUpperCase();
        selectEl.innerHTML = letters
            .map((letter) => `<option value="${esc(letter)}">${esc(letter)}</option>`)
            .join('');
        const selected = letters.includes(previousValue) ? previousValue : letters[0];
        selectEl.value = selected;
        selectEl.dataset.answer = selected;
    };

    document.querySelectorAll('.tf-vocab-item-answer-select').forEach(syncSelect);
    syncSelect(document.getElementById('tf-vocab-example-answer'));
}

function bindVocabEditorInteractions() {
    const optionList = document.getElementById('tf-vocab-option-list');
    const itemList = document.getElementById('tf-vocab-item-list');
    if (!optionList || !itemList) return;

    const addOptionBtn = document.getElementById('tf-vocab-add-option-btn');
    const addItemBtn = document.getElementById('tf-vocab-add-item-btn');

    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', () => {
            const nextIndex = optionList.querySelectorAll('.tf-vocab-option-row').length + 1;
            optionList.insertAdjacentHTML('beforeend', renderVocabOptionRowCard(buildDefaultVocabOptionRow(nextIndex), nextIndex));
            refreshVocabOptionIndexes(optionList);
            refreshVocabAnswerSelectOptions();
        });
    }

    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            const partKey = normalizeVocabPartKey(document.getElementById('tf-vocab-part-key')?.value);
            const letters = getVocabOptionLetters(
                Array.from(optionList.querySelectorAll('.tf-vocab-option-row')).map((row) => ({
                    letter: row.querySelector('.tf-vocab-option-letter')?.value.trim().toUpperCase() || ''
                }))
            );
            const nextIndex = itemList.querySelectorAll('.tf-vocab-item-row').length + 1;
            itemList.insertAdjacentHTML(
                'beforeend',
                renderVocabItemRowCard(partKey, buildDefaultVocabItemRow(partKey, nextIndex), nextIndex, letters)
            );
            refreshVocabItemIndexes(itemList);
            refreshVocabAnswerSelectOptions();
        });
    }

    optionList.addEventListener('input', (event) => {
        const letterInput = event.target.closest('.tf-vocab-option-letter');
        if (letterInput) {
            letterInput.value = letterInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 2);
            refreshVocabAnswerSelectOptions();
            return;
        }
        if (event.target.closest('.tf-vocab-option-word')) {
            refreshVocabAnswerSelectOptions();
        }
    });

    optionList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-vocab-option"]');
        if (!removeBtn) return;
        const rows = optionList.querySelectorAll('.tf-vocab-option-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-vocab-option-row')?.remove();
        refreshVocabOptionIndexes(optionList);
        refreshVocabAnswerSelectOptions();
    });

    itemList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-vocab-item"]');
        if (!removeBtn) return;
        const rows = itemList.querySelectorAll('.tf-vocab-item-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-vocab-item-row')?.remove();
        refreshVocabItemIndexes(itemList);
    });

    itemList.addEventListener('change', (event) => {
        const select = event.target.closest('.tf-vocab-item-answer-select');
        if (!select) return;
        select.dataset.answer = String(select.value || '').trim().toUpperCase();
    });

    const exampleAnswerSelect = document.getElementById('tf-vocab-example-answer');
    if (exampleAnswerSelect) {
        exampleAnswerSelect.addEventListener('change', () => {
            exampleAnswerSelect.dataset.answer = String(exampleAnswerSelect.value || '').trim().toUpperCase();
        });
    }

    refreshVocabOptionIndexes(optionList);
    refreshVocabItemIndexes(itemList);
    refreshVocabAnswerSelectOptions();
}

function buildDefaultListeningMcqQuestion(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    const optionA = `Option A${safeIndex}`;
    const optionB = `Option B${safeIndex}`;
    const optionC = `Option C${safeIndex}`;
    return {
        id: String(safeIndex),
        question: `Question ${safeIndex}?`,
        options: [optionA, optionB, optionC],
        answer: optionA
    };
}

function normalizeListeningMcqQuestions(questions, minCount = 1) {
    const safe = Array.isArray(questions)
        ? questions
            .map((q) => (q && typeof q === 'object' && !Array.isArray(q) ? q : null))
            .filter(Boolean)
            .map((q, idx) => {
                const options = Array.isArray(q.options)
                    ? q.options.map((opt) => String(opt || '').trim()).filter(Boolean)
                    : parseReadingGapOptionValues(q.options);
                while (options.length < 3) {
                    options.push(`Option ${String.fromCharCode(65 + options.length)}${idx + 1}`);
                }
                const answer = String(q.answer || '').trim() || options[0] || '';
                return {
                    id: String(q.id || idx + 1).trim(),
                    question: String(q.question || '').trim(),
                    options: options.slice(0, 3),
                    answer
                };
            })
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultListeningMcqQuestion(safe.length + 1));
    }
    return safe;
}

function renderListeningMcqRowCard(question = {}, index = 1) {
    const safe = question && typeof question === 'object' && !Array.isArray(question)
        ? question
        : {};
    const options = Array.isArray(safe.options) ? safe.options : [];
    return `
        <div class="tf-listening-mcq-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Câu <span class="tf-listening-mcq-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-listening-mcq-row" title="Xóa câu hỏi">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-2">
                    <label class="builder-form-label">ID</label>
                    <input type="text" class="form-control tf-listening-mcq-id" value="${esc(safe.id || String(index))}">
                </div>
                <div class="col-md-10">
                    <label class="builder-form-label">Câu hỏi</label>
                    <input type="text" class="form-control tf-listening-mcq-question" value="${esc(safe.question || '')}" placeholder="Nhập câu hỏi">
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Option 1</label>
                    <input type="text" class="form-control tf-listening-mcq-opt1" value="${esc(options[0] || '')}">
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Option 2</label>
                    <input type="text" class="form-control tf-listening-mcq-opt2" value="${esc(options[1] || '')}">
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Option 3</label>
                    <input type="text" class="form-control tf-listening-mcq-opt3" value="${esc(options[2] || '')}">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Đáp án đúng</label>
                    <input type="text" class="form-control tf-listening-mcq-answer" value="${esc(safe.answer || '')}" placeholder="Nhập đúng theo option">
                </div>
            </div>
        </div>
    `;
}

function refreshListeningMcqEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-listening-mcq-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-listening-mcq-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindListeningMcqEditorInteractions() {
    const listEl = document.getElementById('tf-listening-mcq-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-listening-mcq-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-listening-mcq-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderListeningMcqRowCard(buildDefaultListeningMcqQuestion(nextIndex), nextIndex));
            refreshListeningMcqEditorIndexes(listEl);
        });
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-listening-mcq-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-listening-mcq-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-listening-mcq-row')?.remove();
        refreshListeningMcqEditorIndexes(listEl);
    });

    refreshListeningMcqEditorIndexes(listEl);
}

function buildDefaultListeningTopicOption(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return `Option ${safeIndex}`;
}

function normalizeListeningTopicOptions(options, minCount = 4) {
    const safe = Array.isArray(options)
        ? options.map((o) => String(o || '').trim()).filter(Boolean)
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultListeningTopicOption(safe.length + 1));
    }
    return safe;
}

function buildDefaultListeningTopicPerson(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        person: `Person ${safeIndex}`,
        answerIndex: 0
    };
}

function normalizeListeningTopicPersonRows(persons, answers, options, minCount = 4) {
    const personArr = Array.isArray(persons)
        ? persons.map((p) => String(p || '').trim())
        : [];
    const answerArr = Array.isArray(answers) ? answers : [];
    const optionCount = Array.isArray(options) ? options.length : 0;
    const count = Math.max(minCount, personArr.length, answerArr.length);
    const rows = [];
    for (let i = 0; i < count; i++) {
        const fallback = buildDefaultListeningTopicPerson(i + 1);
        const parsed = parseInt(answerArr[i], 10);
        const answerIndex = Number.isFinite(parsed) && parsed >= 0 && parsed < optionCount ? parsed : 0;
        rows.push({
            person: personArr[i] || fallback.person,
            answerIndex
        });
    }
    return rows;
}

function renderListeningTopicOptionRowCard(text = '', index = 1) {
    return `
        <div class="tf-listening-topic-option-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Option <span class="tf-listening-topic-option-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-listening-topic-option" title="Xóa option">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <input type="text" class="form-control tf-listening-topic-option-text" value="${esc(text || '')}" placeholder="Nhập nội dung option">
        </div>
    `;
}

function renderListeningTopicPersonRowCard(row = {}, index = 1, options = []) {
    const safe = row && typeof row === 'object' && !Array.isArray(row)
        ? row
        : buildDefaultListeningTopicPerson(index);
    const optionItems = Array.isArray(options) ? options : [];
    const selectedIndex = Number.isFinite(Number(safe.answerIndex)) ? Number(safe.answerIndex) : 0;
    return `
        <div class="tf-listening-topic-person-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Người <span class="tf-listening-topic-person-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-listening-topic-person" title="Xóa người">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-7">
                    <label class="builder-form-label">Tên người</label>
                    <input type="text" class="form-control tf-listening-topic-person-text" value="${esc(safe.person || '')}" placeholder="Person 1">
                </div>
                <div class="col-md-5">
                    <label class="builder-form-label">Đáp án (option)</label>
                    <select class="form-select tf-listening-topic-person-answer" data-answer-index="${selectedIndex}">
                        ${optionItems.map((opt, idx) => `<option value="${idx}" ${selectedIndex === idx ? 'selected' : ''}>${idx + 1}. ${esc(opt)}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `;
}

function refreshListeningTopicOptionIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-listening-topic-option-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-listening-topic-option-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function refreshListeningTopicPersonIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-listening-topic-person-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-listening-topic-person-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function refreshListeningTopicAnswerSelects() {
    const optionRows = Array.from(document.querySelectorAll('#tf-listening-topic-option-list .tf-listening-topic-option-row'));
    const options = optionRows
        .map((row) => row.querySelector('.tf-listening-topic-option-text')?.value.trim() || '')
        .filter(Boolean);

    const personRows = Array.from(document.querySelectorAll('#tf-listening-topic-person-list .tf-listening-topic-person-row'));
    personRows.forEach((row, rowIdx) => {
        const select = row.querySelector('.tf-listening-topic-person-answer');
        if (!select) return;
        const rawSelected = select.value || select.dataset.answerIndex || '0';
        const parsed = parseInt(rawSelected, 10);
        const safeIndex = Number.isFinite(parsed) && parsed >= 0 && parsed < options.length ? parsed : 0;
        select.innerHTML = options.length
            ? options.map((opt, idx) => `<option value="${idx}" ${safeIndex === idx ? 'selected' : ''}>${idx + 1}. ${esc(opt)}</option>`).join('')
            : '<option value="0">-- chưa có option --</option>';
        select.dataset.answerIndex = String(options.length ? safeIndex : 0);
        if (options.length) {
            select.value = String(safeIndex);
        } else {
            select.value = '0';
        }

        const personInput = row.querySelector('.tf-listening-topic-person-text');
        if (personInput && !personInput.value.trim()) {
            personInput.value = `Person ${rowIdx + 1}`;
        }
    });
}

function bindListeningTopicEditorInteractions() {
    const optionList = document.getElementById('tf-listening-topic-option-list');
    const personList = document.getElementById('tf-listening-topic-person-list');
    if (!optionList || !personList) return;

    const addOptionBtn = document.getElementById('tf-listening-topic-add-option-btn');
    const addPersonBtn = document.getElementById('tf-listening-topic-add-person-btn');

    if (addOptionBtn) {
        addOptionBtn.addEventListener('click', () => {
            const nextIndex = optionList.querySelectorAll('.tf-listening-topic-option-row').length + 1;
            optionList.insertAdjacentHTML('beforeend', renderListeningTopicOptionRowCard(buildDefaultListeningTopicOption(nextIndex), nextIndex));
            refreshListeningTopicOptionIndexes(optionList);
            refreshListeningTopicAnswerSelects();
        });
    }

    if (addPersonBtn) {
        addPersonBtn.addEventListener('click', () => {
            const options = Array.from(optionList.querySelectorAll('.tf-listening-topic-option-text'))
                .map((input) => input.value.trim())
                .filter(Boolean);
            const nextIndex = personList.querySelectorAll('.tf-listening-topic-person-row').length + 1;
            personList.insertAdjacentHTML(
                'beforeend',
                renderListeningTopicPersonRowCard(buildDefaultListeningTopicPerson(nextIndex), nextIndex, options)
            );
            refreshListeningTopicPersonIndexes(personList);
            refreshListeningTopicAnswerSelects();
        });
    }

    optionList.addEventListener('input', (event) => {
        if (!event.target.closest('.tf-listening-topic-option-text')) return;
        refreshListeningTopicAnswerSelects();
    });

    optionList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-listening-topic-option"]');
        if (!removeBtn) return;
        const rows = optionList.querySelectorAll('.tf-listening-topic-option-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-listening-topic-option-row')?.remove();
        refreshListeningTopicOptionIndexes(optionList);
        refreshListeningTopicAnswerSelects();
    });

    personList.addEventListener('change', (event) => {
        const select = event.target.closest('.tf-listening-topic-person-answer');
        if (!select) return;
        select.dataset.answerIndex = String(select.value || '0');
    });

    personList.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-listening-topic-person"]');
        if (!removeBtn) return;
        const rows = personList.querySelectorAll('.tf-listening-topic-person-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-listening-topic-person-row')?.remove();
        refreshListeningTopicPersonIndexes(personList);
        refreshListeningTopicAnswerSelects();
    });

    refreshListeningTopicOptionIndexes(optionList);
    refreshListeningTopicPersonIndexes(personList);
    refreshListeningTopicAnswerSelects();
}

function buildDefaultWritingShortQuestion(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        key: `q${safeIndex}`,
        prompt: `${safeIndex}. Your question?`,
        minWords: 1,
        maxWords: 10
    };
}

function normalizeWritingShortQuestions(questions, minCount = 1) {
    const safe = Array.isArray(questions)
        ? questions
            .map((q) => (q && typeof q === 'object' && !Array.isArray(q) ? q : null))
            .filter(Boolean)
            .map((q, idx) => {
                const minWordsRaw = parseInt(q.minWords, 10);
                const maxWordsRaw = parseInt(q.maxWords, 10);
                const minWords = Number.isFinite(minWordsRaw) ? Math.max(0, minWordsRaw) : 1;
                let maxWords = Number.isFinite(maxWordsRaw) ? Math.max(0, maxWordsRaw) : 10;
                if (maxWords < minWords) maxWords = minWords;
                return {
                    key: String(q.key || `q${idx + 1}`).trim(),
                    prompt: String(q.prompt || '').trim(),
                    minWords,
                    maxWords
                };
            })
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultWritingShortQuestion(safe.length + 1));
    }
    return safe;
}

function renderWritingShortQuestionCard(question = {}, index = 1) {
    const safe = question && typeof question === 'object' && !Array.isArray(question)
        ? question
        : buildDefaultWritingShortQuestion(index);
    return `
        <div class="tf-writing-short-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Câu <span class="tf-writing-short-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-writing-short-row" title="Xóa câu">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-3">
                    <label class="builder-form-label">Key</label>
                    <input type="text" class="form-control tf-writing-short-key" value="${esc(safe.key || '')}">
                </div>
                <div class="col-md-9">
                    <label class="builder-form-label">Prompt</label>
                    <input type="text" class="form-control tf-writing-short-prompt" value="${esc(safe.prompt || '')}" placeholder="Nhập câu hỏi">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Min words</label>
                    <input type="number" class="form-control tf-writing-short-min" value="${esc(String(safe.minWords ?? 1))}">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Max words</label>
                    <input type="number" class="form-control tf-writing-short-max" value="${esc(String(safe.maxWords ?? 10))}">
                </div>
            </div>
        </div>
    `;
}

function refreshWritingShortEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-writing-short-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-writing-short-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindWritingShortEditorInteractions() {
    const listEl = document.getElementById('tf-writing-short-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-writing-short-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-writing-short-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderWritingShortQuestionCard(buildDefaultWritingShortQuestion(nextIndex), nextIndex));
            refreshWritingShortEditorIndexes(listEl);
        });
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-writing-short-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-writing-short-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-writing-short-row')?.remove();
        refreshWritingShortEditorIndexes(listEl);
    });

    refreshWritingShortEditorIndexes(listEl);
}

function buildDefaultWritingSentencesQuestion(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        key: `q2_${safeIndex}`,
        prompt: `${safeIndex}. Your question?`,
        minWords: 20,
        maxWords: 30
    };
}

function normalizeWritingSentencesQuestions(questions, minCount = 1) {
    const safe = Array.isArray(questions)
        ? questions
            .map((q) => (q && typeof q === 'object' && !Array.isArray(q) ? q : null))
            .filter(Boolean)
            .map((q, idx) => ({
                key: String(q.key || `q2_${idx + 1}`).trim(),
                prompt: String(q.prompt || '').trim(),
                minWords: Number.isFinite(parseInt(q.minWords, 10)) ? parseInt(q.minWords, 10) : 20,
                maxWords: Number.isFinite(parseInt(q.maxWords, 10)) ? parseInt(q.maxWords, 10) : 30
            }))
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultWritingSentencesQuestion(safe.length + 1));
    }
    return safe;
}

function renderWritingSentencesQuestionCard(question = {}, index = 1) {
    const safe = question && typeof question === 'object' && !Array.isArray(question)
        ? question
        : buildDefaultWritingSentencesQuestion(index);
    return `
        <div class="tf-writing-sentences-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Câu <span class="tf-writing-sentences-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-writing-sentences-row" title="Xóa câu">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-3">
                    <label class="builder-form-label">Key</label>
                    <input type="text" class="form-control tf-writing-sentences-key" value="${esc(safe.key || '')}">
                </div>
                <div class="col-md-9">
                    <label class="builder-form-label">Prompt</label>
                    <input type="text" class="form-control tf-writing-sentences-prompt" value="${esc(safe.prompt || '')}" placeholder="Nhập câu hỏi">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Min words</label>
                    <input type="number" class="form-control tf-writing-sentences-min" value="${esc(String(safe.minWords || 20))}">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Max words</label>
                    <input type="number" class="form-control tf-writing-sentences-max" value="${esc(String(safe.maxWords || 30))}">
                </div>
            </div>
        </div>
    `;
}

function refreshWritingSentencesEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-writing-sentences-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-writing-sentences-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindWritingSentencesEditorInteractions() {
    const listEl = document.getElementById('tf-writing-sentences-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-writing-sentences-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-writing-sentences-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderWritingSentencesQuestionCard(buildDefaultWritingSentencesQuestion(nextIndex), nextIndex));
            refreshWritingSentencesEditorIndexes(listEl);
        });
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-writing-sentences-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-writing-sentences-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-writing-sentences-row')?.remove();
        refreshWritingSentencesEditorIndexes(listEl);
    });

    refreshWritingSentencesEditorIndexes(listEl);
}

function buildDefaultWritingChatQuestion(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        key: `q3_${safeIndex}`,
        prompt: `${safeIndex}. Your question?`,
        minWords: 30,
        maxWords: 40
    };
}

function normalizeWritingChatQuestions(questions, minCount = 1) {
    const safe = Array.isArray(questions)
        ? questions
            .map((q) => (q && typeof q === 'object' && !Array.isArray(q) ? q : null))
            .filter(Boolean)
            .map((q, idx) => ({
                key: String(q.key || `q3_${idx + 1}`).trim(),
                prompt: String(q.prompt || '').trim(),
                minWords: Number.isFinite(parseInt(q.minWords, 10)) ? parseInt(q.minWords, 10) : 30,
                maxWords: Number.isFinite(parseInt(q.maxWords, 10)) ? parseInt(q.maxWords, 10) : 40
            }))
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultWritingChatQuestion(safe.length + 1));
    }
    return safe;
}

function renderWritingChatQuestionCard(question = {}, index = 1) {
    const safe = question && typeof question === 'object' && !Array.isArray(question)
        ? question
        : buildDefaultWritingChatQuestion(index);
    return `
        <div class="tf-writing-chat-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Câu <span class="tf-writing-chat-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-writing-chat-row" title="Xóa câu">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-3">
                    <label class="builder-form-label">Key</label>
                    <input type="text" class="form-control tf-writing-chat-key" value="${esc(safe.key || '')}">
                </div>
                <div class="col-md-9">
                    <label class="builder-form-label">Prompt</label>
                    <input type="text" class="form-control tf-writing-chat-prompt" value="${esc(safe.prompt || '')}" placeholder="Nhập câu hỏi">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Min words</label>
                    <input type="number" class="form-control tf-writing-chat-min" value="${esc(String(safe.minWords || 30))}">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Max words</label>
                    <input type="number" class="form-control tf-writing-chat-max" value="${esc(String(safe.maxWords || 40))}">
                </div>
            </div>
        </div>
    `;
}

function refreshWritingChatEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-writing-chat-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-writing-chat-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindWritingChatEditorInteractions() {
    const listEl = document.getElementById('tf-writing-chat-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-writing-chat-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-writing-chat-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderWritingChatQuestionCard(buildDefaultWritingChatQuestion(nextIndex), nextIndex));
            refreshWritingChatEditorIndexes(listEl);
        });
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-writing-chat-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-writing-chat-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-writing-chat-row')?.remove();
        refreshWritingChatEditorIndexes(listEl);
    });

    refreshWritingChatEditorIndexes(listEl);
}

function buildDefaultWritingEmailItem(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        key: `q4_${safeIndex}`,
        label: `Write email ${safeIndex}`,
        minWords: 120,
        maxWords: 225,
        rows: 8
    };
}

function normalizeWritingEmailItems(items, minCount = 1) {
    const safe = Array.isArray(items)
        ? items
            .map((item) => (item && typeof item === 'object' && !Array.isArray(item) ? item : null))
            .filter(Boolean)
            .map((item, idx) => ({
                key: String(item.key || `q4_${idx + 1}`).trim(),
                label: String(item.label || '').trim(),
                minWords: Number.isFinite(parseInt(item.minWords, 10)) ? parseInt(item.minWords, 10) : 120,
                maxWords: Number.isFinite(parseInt(item.maxWords, 10)) ? parseInt(item.maxWords, 10) : 225,
                rows: Number.isFinite(parseInt(item.rows, 10)) ? parseInt(item.rows, 10) : 8
            }))
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultWritingEmailItem(safe.length + 1));
    }
    return safe;
}

function renderWritingEmailItemCard(item = {}, index = 1) {
    const safe = item && typeof item === 'object' && !Array.isArray(item)
        ? item
        : buildDefaultWritingEmailItem(index);
    return `
        <div class="tf-writing-email-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Email <span class="tf-writing-email-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-writing-email-row" title="Xóa email">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-3">
                    <label class="builder-form-label">Key</label>
                    <input type="text" class="form-control tf-writing-email-key" value="${esc(safe.key || '')}">
                </div>
                <div class="col-md-9">
                    <label class="builder-form-label">Label / prompt</label>
                    <input type="text" class="form-control tf-writing-email-label" value="${esc(safe.label || '')}" placeholder="Write an email...">
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Min words</label>
                    <input type="number" class="form-control tf-writing-email-min" value="${esc(String(safe.minWords || 120))}">
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Max words</label>
                    <input type="number" class="form-control tf-writing-email-max" value="${esc(String(safe.maxWords || 225))}">
                </div>
                <div class="col-md-4">
                    <label class="builder-form-label">Rows</label>
                    <input type="number" class="form-control tf-writing-email-rows" value="${esc(String(safe.rows || 8))}">
                </div>
            </div>
        </div>
    `;
}

function refreshWritingEmailEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-writing-email-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-writing-email-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindWritingEmailEditorInteractions() {
    const listEl = document.getElementById('tf-writing-email-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-writing-email-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-writing-email-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderWritingEmailItemCard(buildDefaultWritingEmailItem(nextIndex), nextIndex));
            refreshWritingEmailEditorIndexes(listEl);
        });
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-writing-email-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-writing-email-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-writing-email-row')?.remove();
        refreshWritingEmailEditorIndexes(listEl);
    });

    refreshWritingEmailEditorIndexes(listEl);
}

function buildDefaultWritingFollowupQuestion(index = 1) {
    const safeIndex = Number.isFinite(Number(index)) && Number(index) > 0 ? Number(index) : 1;
    return {
        key: `q_fu_${safeIndex}`,
        prompt: `${safeIndex}. Follow-up question?`,
        minWords: 20,
        maxWords: 60
    };
}

function normalizeWritingFollowupQuestions(questions, minCount = 1) {
    const safe = Array.isArray(questions)
        ? questions
            .map((q) => (q && typeof q === 'object' && !Array.isArray(q) ? q : null))
            .filter(Boolean)
            .map((q, idx) => ({
                key: String(q.key || `q_fu_${idx + 1}`).trim(),
                prompt: String(q.prompt || '').trim(),
                minWords: Number.isFinite(parseInt(q.minWords, 10)) ? parseInt(q.minWords, 10) : 20,
                maxWords: Number.isFinite(parseInt(q.maxWords, 10)) ? parseInt(q.maxWords, 10) : 60
            }))
        : [];
    while (safe.length < minCount) {
        safe.push(buildDefaultWritingFollowupQuestion(safe.length + 1));
    }
    return safe;
}

function renderWritingFollowupQuestionCard(question = {}, index = 1) {
    const safe = question && typeof question === 'object' && !Array.isArray(question)
        ? question
        : buildDefaultWritingFollowupQuestion(index);
    return `
        <div class="tf-writing-followup-row border rounded p-3 mb-2">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0" style="font-size:0.84rem;">Follow-up <span class="tf-writing-followup-index">${index}</span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove-writing-followup-row" title="Xóa câu">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-3">
                    <label class="builder-form-label">Key</label>
                    <input type="text" class="form-control tf-writing-followup-key" value="${esc(safe.key || '')}">
                </div>
                <div class="col-md-9">
                    <label class="builder-form-label">Prompt</label>
                    <input type="text" class="form-control tf-writing-followup-prompt" value="${esc(safe.prompt || '')}" placeholder="Nhập câu hỏi">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Min words</label>
                    <input type="number" class="form-control tf-writing-followup-min" value="${esc(String(safe.minWords || 20))}">
                </div>
                <div class="col-md-6">
                    <label class="builder-form-label">Max words</label>
                    <input type="number" class="form-control tf-writing-followup-max" value="${esc(String(safe.maxWords || 60))}">
                </div>
            </div>
        </div>
    `;
}

function refreshWritingFollowupEditorIndexes(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll('.tf-writing-followup-row').forEach((rowEl, idx) => {
        const badge = rowEl.querySelector('.tf-writing-followup-index');
        if (badge) badge.textContent = String(idx + 1);
    });
}

function bindWritingFollowupEditorInteractions() {
    const listEl = document.getElementById('tf-writing-followup-list');
    if (!listEl) return;

    const addBtn = document.getElementById('tf-writing-followup-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nextIndex = listEl.querySelectorAll('.tf-writing-followup-row').length + 1;
            listEl.insertAdjacentHTML('beforeend', renderWritingFollowupQuestionCard(buildDefaultWritingFollowupQuestion(nextIndex), nextIndex));
            refreshWritingFollowupEditorIndexes(listEl);
        });
    }

    listEl.addEventListener('click', (event) => {
        const removeBtn = event.target.closest('[data-action="remove-writing-followup-row"]');
        if (!removeBtn) return;
        const rows = listEl.querySelectorAll('.tf-writing-followup-row');
        if (rows.length <= 1) return;
        removeBtn.closest('.tf-writing-followup-row')?.remove();
        refreshWritingFollowupEditorIndexes(listEl);
    });

    refreshWritingFollowupEditorIndexes(listEl);
}

function bindTypeSpecificEditorInteractions() {
    bindGrammarEditorInteractions();
    bindVocabEditorInteractions();
    bindReadingGapEditorInteractions();
    bindReadingOrderEditorInteractions();
    bindReadingMatchEditorInteractions();
    bindReadingHeadingEditorInteractions();
    bindListeningOpinionEditorInteractions();
    bindListeningMcqEditorInteractions();
    bindListeningTopicEditorInteractions();
    bindWritingShortEditorInteractions();
    bindWritingSentencesEditorInteractions();
    bindWritingChatEditorInteractions();
    bindWritingEmailEditorInteractions();
    bindWritingFollowupEditorInteractions();
}

function extractDraftPartNumberFromLabel(value) {
    const match = String(value || '').match(/\bpart\s*(\d+)\b/i);
    if (!match) return null;
    const num = parseInt(match[1], 10);
    return Number.isFinite(num) ? num : null;
}

function replaceDraftPartNumberInLabel(value, nextPartNumber) {
    if (typeof value !== 'string' || !value.trim()) return value;
    if (!Number.isFinite(Number(nextPartNumber))) return value;
    const normalizedNum = parseInt(nextPartNumber, 10);
    return value.replace(/\bpart\s*\d+\b/i, `Part ${normalizedNum}`);
}

function normalizeDraftPartLabelsForDisplay(rawPages) {
    const pages = Array.isArray(rawPages) ? rawPages : [];
    if (!pages.length) return pages;

    const partNumberMap = new Map();
    let nextPartNumber = 1;
    const fields = ['partTitle', 'partLabel', 'headerTitle', 'stepLabel'];

    const registerPartFromObject = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        fields.forEach((field) => {
            const num = extractDraftPartNumberFromLabel(obj[field]);
            if (!num) return;
            if (!partNumberMap.has(num)) {
                partNumberMap.set(num, nextPartNumber);
                nextPartNumber += 1;
            }
        });
    };

    pages.forEach((page) => {
        registerPartFromObject(page);
        registerPartFromObject(page?.data);
    });

    if (!partNumberMap.size) return pages;

    const relabelObject = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        fields.forEach((field) => {
            const oldNum = extractDraftPartNumberFromLabel(obj[field]);
            if (!oldNum) return;
            const mapped = partNumberMap.get(oldNum) || oldNum;
            obj[field] = replaceDraftPartNumberInLabel(obj[field], mapped);
        });
    };

    pages.forEach((page) => {
        relabelObject(page);
        relabelObject(page?.data);
    });

    return pages;
}

function normalizeDraftPage(page) {
    const normalized = (page && typeof page === 'object' && !Array.isArray(page)) ? deepClone(page) : {};
    normalized.type = typeof normalized.type === 'string' && normalized.type
        ? normalized.type
        : 'reading-gap';
    normalized.data = (normalized.data && typeof normalized.data === 'object' && !Array.isArray(normalized.data))
        ? normalized.data
        : {};
    if (normalized.type === 'grammar') {
        normalized.data.q = String(normalized.data.q || '').trim();
        normalized.data.options = normalizeGrammarOptions(normalized.data.options, 1);
        normalized.data.answer = String(normalized.data.answer || '').trim() || normalized.data.options[0] || '';
        if (normalized.data.answer && !normalized.data.options.includes(normalized.data.answer)) {
            normalized.data.options.push(normalized.data.answer);
        }
    }
    if (normalized.type === 'vocab') {
        const partKey = normalizeVocabPartKey(normalized.partKey || normalized.data.partKey || `part${normalized.partNum || 1}`);
        normalized.partKey = partKey;
        normalized.partNum = VOCAB_PART_NUM_BY_KEY[partKey];

        const defaultData = buildDefaultVocabData(partKey);
        normalized.data.title = String(normalized.data.title || defaultData.title || '').trim();
        normalized.data.instruction = String(normalized.data.instruction || defaultData.instruction || '').trim();
        normalized.data.instructionVi = String(normalized.data.instructionVi || defaultData.instructionVi || '').trim();
        normalized.data.options = normalizeVocabOptionRows(
            normalized.data.options,
            Math.max(1, Array.isArray(normalized.data.options) ? normalized.data.options.length : (defaultData.options || []).length || 1)
        );

        if (partKey === 'part2' || partKey === 'part3') {
            normalized.data.sentences = normalizeVocabItemRows(
                partKey,
                normalized.data,
                Math.max(1, Array.isArray(normalized.data.sentences) ? normalized.data.sentences.length : 1)
            );
            delete normalized.data.words;
            delete normalized.data.example;
        } else {
            normalized.data.words = normalizeVocabItemRows(
                partKey,
                normalized.data,
                Math.max(1, Array.isArray(normalized.data.words) ? normalized.data.words.length : 1)
            );
            const example = normalized.data.example && typeof normalized.data.example === 'object' && !Array.isArray(normalized.data.example)
                ? normalized.data.example
                : {};
            normalized.data.example = {
                word: String(example.word || '').trim(),
                answer: String(example.answer || '').trim().toUpperCase(),
                answerWord: String(example.answerWord || '').trim()
            };
            delete normalized.data.sentences;
        }
    }
    if (normalized.type === 'reading-gap') {
        normalized.data.instruction = normalized.data.instruction || 'Choose the word that fits in the gap.';
        normalized.data.rows = normalizeReadingGapRows(normalized.data.rows, 5);
    }
    if (normalized.type === 'writing-short') {
        normalized.data.topic = String(normalized.data.topic || '').trim();
        normalized.data.topicInstruction = String(normalized.data.topicInstruction || '').trim();
        normalized.data.questions = normalizeWritingShortQuestions(normalized.data.questions, 1);
    }
    return normalized;
}

function normalizeSessionDraft(config) {
    const draft = (config && typeof config === 'object' && !Array.isArray(config))
        ? deepClone(config)
        : {};

    draft.timer = Number.isFinite(Number(draft.timer)) ? Number(draft.timer) : 35;
    draft.hideGlobalTimer = !!draft.hideGlobalTimer;
    if (!Array.isArray(draft.pages)) draft.pages = [];
    draft.pages = draft.pages.map(normalizeDraftPage);
    normalizeDraftPartLabelsForDisplay(draft.pages);
    return draft;
}

function applyDraftConfig(config) {
    lopHocState.sessionDraft = normalizeSessionDraft(config);
    if (!lopHocState.sessionDraft.pages.length) {
        lopHocState.selectedDraftPageIndex = -1;
    } else if (
        lopHocState.selectedDraftPageIndex < 0 ||
        lopHocState.selectedDraftPageIndex >= lopHocState.sessionDraft.pages.length
    ) {
        lopHocState.selectedDraftPageIndex = 0;
    }
    renderDraftBuilder();
    syncJsonFromDraft(false);
}

function populatePageTypeOptions() {
    const select = document.getElementById('sc-new-page-type');
    if (!select) return;
    select.innerHTML = PAGE_TYPE_OPTIONS.map((type) =>
        `<option value="${type}">${esc(PAGE_TYPE_LABELS[type] || type)}</option>`
    ).join('');
}

function resolveSessionBlueprint(sessionKey, visited = new Set()) {
    const key = String(sessionKey || '').toUpperCase();
    const current = SESSION_STRUCTURE_BLUEPRINTS[key];
    if (!current) return null;
    if (!current.cloneOf) return current;
    if (visited.has(key)) return null;
    visited.add(key);
    const cloned = resolveSessionBlueprint(current.cloneOf, visited);
    if (!cloned) return null;
    return {
        timer: Number.isFinite(Number(current.timer)) ? Number(current.timer) : cloned.timer,
        hideGlobalTimer: Object.prototype.hasOwnProperty.call(current, 'hideGlobalTimer')
            ? !!current.hideGlobalTimer
            : !!cloned.hideGlobalTimer,
        pages: Array.isArray(current.pages) && current.pages.length
            ? current.pages
            : (Array.isArray(cloned.pages) ? cloned.pages : [])
    };
}

function countTemplatePages(sessionKey) {
    const blueprint = resolveSessionBlueprint(sessionKey);
    if (!blueprint || !Array.isArray(blueprint.pages)) return null;
    return blueprint.pages.length;
}

function getTemplateForSession(sessionKey) {
    const base = deepClone(SESSION_TEMPLATE);
    const blueprint = resolveSessionBlueprint(sessionKey);
    if (!blueprint) return base;

    const pages = (blueprint.pages || [])
        .map((spec) => {
            const normalizedSpec = (spec && typeof spec === 'object' && !Array.isArray(spec))
                ? spec
                : { type: String(spec || '') };
            const pageType = normalizedSpec.type || 'reading-gap';
            const page = createDefaultPageByType(pageType, normalizedSpec);

            ['partTitle', 'partLabel', 'headerTitle', 'stepLabel', 'idx', 'totalInPart', 'pageIdx', 'totalPages', 'responseSeconds', 'waitSeconds', 'partKey', 'partNum'].forEach((field) => {
                if (Object.prototype.hasOwnProperty.call(normalizedSpec, field)) {
                    page[field] = normalizedSpec[field];
                }
            });

            return normalizeDraftPage(page);
        });

    return normalizeSessionDraft({
        timer: Number.isFinite(Number(blueprint.timer)) ? Number(blueprint.timer) : base.timer,
        hideGlobalTimer: !!blueprint.hideGlobalTimer,
        pages
    });
}

function findSessionContentRecord(sessionKey) {
    return lopHocState.sessionContentRecords.find((set) => {
        const marker = String(set?.data?.__practice_type || '').toLowerCase();
        const key = String(set?.data?.session_key || '').toUpperCase();
        return marker === 'session_content' && key === String(sessionKey).toUpperCase();
    }) || null;
}

function updateSessionStatus(record) {
    const key = getSelectedSessionKey();
    const statusEl = document.getElementById('sc-status');
    if (!statusEl) return;

    const hint = SESSION_STRUCTURE_GUIDE[key] || 'Chưa có mô tả mặc định.';
    const defaultPageCount = countTemplatePages(key);
    const defaultCountText = Number.isFinite(defaultPageCount)
        ? ` | Mẫu chuẩn: ${defaultPageCount} page`
        : '';
    if (!record) {
        statusEl.className = 'mt-3 alert alert-warning border';
        statusEl.innerHTML = `
            <strong>${esc(key)}</strong>: chưa có custom.<br>
            <small>Fallback đang dùng hard-code mặc định. Cấu trúc: ${esc(hint)}${esc(defaultCountText)}</small>
        `;
        return;
    }

    const updatedAt = record.updated_at || record.created_at;
    const updatedText = updatedAt ? formatDatetime(updatedAt) : '--';
    statusEl.className = 'mt-3 alert alert-success border';
    statusEl.innerHTML = `
        <strong>${esc(key)}</strong>: đang dùng custom content.<br>
        <small>Cập nhật: ${esc(updatedText)} | Cấu trúc mặc định: ${esc(hint)}${esc(defaultCountText)}</small>
    `;
}

function loadSessionTemplate() {
    const key = getSelectedSessionKey();
    const template = getTemplateForSession(key);
    const editor = document.getElementById('sc-json');
    const notes = document.getElementById('sc-notes');
    if (editor) editor.value = JSON.stringify(template, null, 2);
    if (notes) notes.value = '';
    lopHocState.selectedSessionContentRecord = null;
    applyDraftConfig(template);
    updateSessionStatus(null);
    const frame = document.getElementById('sc-preview-frame');
    if (frame) frame.src = 'about:blank';
}

async function loadSessionContentEditor(options = {}) {
    const quiet = !!options?.quiet;
    const forceRefresh = !!options?.forceRefresh;

    if (forceRefresh || !lopHocState.sessionContentRecords.length) {
        await refreshSessionContentList();
    }

    const key = getSelectedSessionKey();
    const record = findSessionContentRecord(key);
    const editor = document.getElementById('sc-json');
    const notes = document.getElementById('sc-notes');
    const resultEl = document.getElementById('sc-result');

    if (!record) {
        loadSessionTemplate();
        if (!quiet) {
            showResult(resultEl, `Không tìm thấy custom cho <strong>${esc(key)}</strong>. Đã nạp template theo cấu trúc buổi.`, 'warning');
        }
        return;
    }

    const config = record?.data?.session_config || {};
    if (editor) editor.value = JSON.stringify(config, null, 2);
    if (notes) notes.value = record?.data?.notes || '';
    lopHocState.selectedSessionContentRecord = record;
    applyDraftConfig(config);
    updateSessionStatus(record);
    if (!quiet) {
        showResult(resultEl, `Đã nạp custom cho <strong>${esc(key)}</strong>.`, 'success');
    }
}

function syncJsonFromDraft(showMessage = true) {
    const editor = document.getElementById('sc-json');
    const resultEl = document.getElementById('sc-result');
    const draft = lopHocState.sessionDraft;
    if (!editor || !draft) return;
    editor.value = JSON.stringify(draft, null, 2);
    if (showMessage && resultEl) {
        showResult(resultEl, 'Đã đồng bộ Form Builder sang JSON.', 'success');
    }
}

function syncDraftFromJson(showMessage = true) {
    const editor = document.getElementById('sc-json');
    const resultEl = document.getElementById('sc-result');
    if (!editor) return;
    try {
        const parsed = JSON.parse(editor.value || '{}');
        applyDraftConfig(parsed);
        if (showMessage && resultEl) {
            showResult(resultEl, 'Đã nạp JSON vào Form Builder.', 'success');
        }
    } catch (err) {
        if (resultEl) showResult(resultEl, 'JSON lỗi: ' + err.message, 'danger');
    }
}

function updateDraftGlobalSettings() {
    if (!lopHocState.sessionDraft) return;
    const timerVal = Number(document.getElementById('sc-timer-input')?.value);
    const hideGlobal = !!document.getElementById('sc-hide-global-timer')?.checked;
    lopHocState.sessionDraft.timer = Number.isFinite(timerVal) ? timerVal : 35;
    lopHocState.sessionDraft.hideGlobalTimer = hideGlobal;
    syncJsonFromDraft(false);
}

function pageSummaryText(page) {
    if (!page || typeof page !== 'object') return '';
    const title =
        page.partTitle ||
        page.partLabel ||
        page.headerTitle ||
        page.stepLabel ||
        page?.data?.title ||
        page?.data?.topic ||
        page?.data?.instruction ||
        page?.data?.q ||
        page?.data?.prompt ||
        '';
    return String(title || '').trim();
}

const VOCAB_PART_NUM_BY_KEY = {
    part1: 1,
    part2: 2,
    part3: 3,
    part4: 4
};

function normalizeVocabPartKey(value) {
    const key = String(value || '').toLowerCase();
    if (VOCAB_PART_NUM_BY_KEY[key]) return key;
    return 'part1';
}

function buildDefaultVocabData(partKey) {
    const key = normalizeVocabPartKey(partKey);
    if (key === 'part2') {
        return {
            title: 'Vocabulary - Part 2',
            instruction: 'Finish each sentence (6-10) using a word from the list (A-K).',
            instructionVi: 'Hoàn thành mỗi câu bằng từ phù hợp trong danh sách (A-K).',
            sentences: [
                { num: 6, text: 'To oppose someone is to...', answer: 'B' },
                { num: 7, text: 'To teach someone is to...', answer: 'C' }
            ],
            options: [
                { letter: 'A', word: 'concern' },
                { letter: 'B', word: 'challenge' },
                { letter: 'C', word: 'instruct' }
            ]
        };
    }

    if (key === 'part3') {
        return {
            title: 'Vocabulary - Part 3',
            instruction: 'Finish each sentence using a word from the list (A-K).',
            instructionVi: 'Hoàn thành mỗi câu bằng từ phù hợp trong danh sách (A-K).',
            sentences: [
                { num: 11, before: 'He had to walk down a long dark', after: 'to get to his room.', answer: 'D' },
                { num: 12, before: 'The teacher should maintain', after: 'in the classroom.', answer: 'E' }
            ],
            options: [
                { letter: 'D', word: 'corridor' },
                { letter: 'E', word: 'discipline' },
                { letter: 'J', word: 'museum' }
            ]
        };
    }

    const isPart4 = key === 'part4';
    return {
        title: `Vocabulary - ${isPart4 ? 'Part 4' : 'Part 1'}`,
        instruction: isPart4
            ? 'Write the letter of the word on the right (A-K) that is most often used with a word on the left.'
            : 'Write the letter (A-K) of the word that is most similar in meaning to a word on the left.',
        instructionVi: isPart4
            ? 'Viết chữ cái của từ ở bên phải (A-K) thường đi với từ bên trái.'
            : 'Viết chữ cái (A-K) của từ có nghĩa tương tự nhất với từ bên trái.',
        example: { word: 'Create', answer: 'C', answerWord: 'make' },
        words: [
            { num: 1, word: 'choose', answer: 'D' },
            { num: 2, word: 'close', answer: 'F' }
        ],
        options: [
            { letter: 'C', word: 'make' },
            { letter: 'D', word: 'decide' },
            { letter: 'F', word: 'shut' }
        ]
    };
}

function applyPageSpecOverrides(page, spec = {}) {
    const output = normalizeDraftPage(page);
    ['partTitle', 'partLabel', 'headerTitle', 'stepLabel', 'idx', 'totalInPart', 'pageIdx', 'totalPages', 'responseSeconds', 'waitSeconds'].forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(spec, field)) {
            output[field] = spec[field];
        }
    });
    return output;
}

function createDefaultPageByType(type, spec = {}) {
    const base = { type, data: {} };
    switch (type) {
        case 'grammar':
            return applyPageSpecOverrides(
                { ...base, data: { q: 'Look! It _____ outside.', options: ['rain', 'is raining', 'rains'], answer: 'is raining' } },
                spec
            );
        case 'vocab': {
            const partKey = normalizeVocabPartKey(spec.partKey || 'part1');
            const partNum = VOCAB_PART_NUM_BY_KEY[partKey];
            return applyPageSpecOverrides(
                {
                    ...base,
                    partKey,
                    partNum,
                    partTitle: spec.partTitle || 'Part 2',
                    data: buildDefaultVocabData(partKey)
                },
                spec
            );
        }
        case 'listening-q':
            return applyPageSpecOverrides(
                { ...base, partLabel: 'Part 1', data: { q: 'What does she buy?', options: ['A book', 'A pen', 'A bag'], answer: 'A bag', audio: 'audio/listening/example.mp3' } },
                spec
            );
        case 'listening-topic':
            return applyPageSpecOverrides({
                ...base,
                partLabel: 'Part 2',
                data: {
                    topic: 'TOPIC',
                    instruction: 'Complete the sentences.',
                    audio: 'audio/listening/example.mp3',
                    persons: ['Person 1', 'Person 2', 'Person 3', 'Person 4'],
                    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
                    answers: [0, 1, 2, 3]
                }
            }, spec);
        case 'listening-opinion':
            return applyPageSpecOverrides({
                ...base,
                partLabel: 'Part 1',
                data: {
                    topic: 'Topic',
                    instruction: 'Listen and choose who says each statement.',
                    audio: 'audio/listening/example.mp3',
                    transcript: '',
                    statements: ['Statement 1', 'Statement 2'],
                    answers: ['Man', 'Woman']
                }
            }, spec);
        case 'listening-mcq-batch':
            return applyPageSpecOverrides({
                ...base,
                partLabel: 'Part 2',
                data: {
                    topic: 'Topic',
                    instruction: 'Choose the correct answer.',
                    audio: 'audio/listening/example.mp3',
                    transcript: '',
                    questions: [
                        { id: '1', question: 'Question?', options: ['A', 'B', 'C'], answer: 'A' }
                    ]
                }
            }, spec);
        case 'reading-gap':
            return applyPageSpecOverrides({
                ...base,
                partTitle: 'Part 1',
                data: {
                    instruction: 'Choose the word that fits in the gap.',
                    rows: normalizeReadingGapRows([], Number(spec.rowCount) || 5)
                }
            }, spec);
        case 'reading-order':
            return applyPageSpecOverrides({
                ...base,
                partTitle: 'Part 2',
                data: { topic: 'Topic', sentences: ['Sentence 1', 'Sentence 2', 'Sentence 3'] }
            }, spec);
        case 'reading-match':
            return applyPageSpecOverrides({
                ...base,
                partTitle: 'Part 3',
                data: {
                    topic: 'Topic',
                    paragraphs: { A: 'Paragraph A', B: 'Paragraph B', C: 'Paragraph C', D: 'Paragraph D' },
                    questions: [{ prompt: 'Question prompt', answer: 'A' }]
                }
            }, spec);
        case 'reading-heading':
            return applyPageSpecOverrides({
                ...base,
                data: {
                    topic: 'Topic',
                    headings: ['Heading 1', 'Heading 2'],
                    paragraphs: ['Paragraph 1', 'Paragraph 2'],
                    answers: [0, 1]
                }
            }, spec);
        case 'writing-short':
            return applyPageSpecOverrides({
                ...base,
                headerTitle: 'Part 1',
                data: {
                    topic: 'TOPIC',
                    topicInstruction: 'Write short answers.',
                    questions: [{ key: 'q1', prompt: '1. Your question?', minWords: 1, maxWords: 10 }]
                }
            }, spec);
        case 'writing-email':
            return applyPageSpecOverrides({
                ...base,
                headerTitle: 'Part 4',
                data: {
                    topic: 'TOPIC',
                    topicInstruction: 'Write emails.',
                    contextText: '',
                    emails: [{ key: 'q4_1', label: 'Write an email...', minWords: 120, maxWords: 225, rows: 8 }]
                }
            }, spec);
        case 'writing-sentences':
            return applyPageSpecOverrides({
                ...base,
                headerTitle: 'Part 2',
                data: {
                    instruction: 'Write in sentences.',
                    questions: [{ key: 'q2_1', prompt: '1. Your question?', minWords: 20, maxWords: 30 }]
                }
            }, spec);
        case 'writing-chat':
            return applyPageSpecOverrides({
                ...base,
                headerTitle: 'Part 3',
                data: {
                    topic: 'TOPIC',
                    topicInstruction: 'Answer in full sentences.',
                    questions: [{ key: 'q3_1', prompt: '1. Your question?', minWords: 30, maxWords: 40 }]
                }
            }, spec);
        case 'writing-describe-image':
            return applyPageSpecOverrides({
                ...base,
                data: {
                    image: 'images/placeholder.jpg',
                    mainQuestion: { key: 'q_img_1', prompt: '1. Describe this picture:', minWords: 30, maxWords: 80 }
                }
            }, spec);
        case 'writing-followup':
            return applyPageSpecOverrides({
                ...base,
                data: {
                    followUps: [{ key: 'q_fu_1', prompt: '1. Follow-up question?', minWords: 20, maxWords: 60 }]
                }
            }, spec);
        case 'speaking-q':
            return applyPageSpecOverrides({
                ...base,
                partLabel: 'Part 1',
                responseSeconds: 30,
                waitSeconds: 0,
                data: {
                    prompt: 'What do you enjoy doing in your free time?',
                    audio: ''
                }
            }, spec);
        case 'speaking-intro':
            return applyPageSpecOverrides({
                ...base,
                partLabel: 'Part 1 - Speaking',
                data: {
                    partLabel: 'Part 1 - Speaking',
                    introText: 'Listen to the introduction.',
                    introAudio: 'audio/speaking/intro.mp3',
                    images: ['images/speaking/placeholder.jpg']
                }
            }, spec);
        case 'speaking-audio-q':
            return applyPageSpecOverrides({
                ...base,
                partLabel: 'Part 1 - Speaking',
                responseSeconds: 45,
                waitSeconds: 5,
                data: {
                    key: 'sp_1',
                    prompt: 'Describe what you see.',
                    audio: 'audio/speaking/question.mp3',
                    images: ['images/speaking/placeholder.jpg']
                }
            }, spec);
        default:
            return applyPageSpecOverrides(base, spec);
    }
}

function addDraftPage() {
    if (!lopHocState.sessionDraft) {
        lopHocState.sessionDraft = normalizeSessionDraft(getTemplateForSession(getSelectedSessionKey()));
    }
    const type = document.getElementById('sc-new-page-type')?.value || 'reading-gap';
    const page = createDefaultPageByType(type);
    lopHocState.sessionDraft.pages.push(page);
    lopHocState.selectedDraftPageIndex = lopHocState.sessionDraft.pages.length - 1;
    renderDraftBuilder();
    syncJsonFromDraft(false);
}

function selectDraftPage(index) {
    lopHocState.selectedDraftPageIndex = index;
    renderDraftPageList();
    renderDraftPageEditor();
}

function moveDraftPage(index, direction) {
    const draft = lopHocState.sessionDraft;
    if (!draft || !Array.isArray(draft.pages)) return;
    const target = index + direction;
    if (target < 0 || target >= draft.pages.length) return;
    const tmp = draft.pages[index];
    draft.pages[index] = draft.pages[target];
    draft.pages[target] = tmp;
    lopHocState.selectedDraftPageIndex = target;
    renderDraftBuilder();
    syncJsonFromDraft(false);
}

function duplicateDraftPage(index) {
    const draft = lopHocState.sessionDraft;
    if (!draft || !draft.pages[index]) return;
    const cloned = deepClone(draft.pages[index]);
    draft.pages.splice(index + 1, 0, cloned);
    lopHocState.selectedDraftPageIndex = index + 1;
    renderDraftBuilder();
    syncJsonFromDraft(false);
}

function deleteDraftPage(index) {
    const draft = lopHocState.sessionDraft;
    if (!draft || !Array.isArray(draft.pages) || !draft.pages[index]) return;
    draft.pages.splice(index, 1);
    if (!draft.pages.length) {
        lopHocState.selectedDraftPageIndex = -1;
    } else if (lopHocState.selectedDraftPageIndex >= draft.pages.length) {
        lopHocState.selectedDraftPageIndex = draft.pages.length - 1;
    }
    renderDraftBuilder();
    syncJsonFromDraft(false);
}

function renderDraftBuilder() {
    const draft = lopHocState.sessionDraft || normalizeSessionDraft(getTemplateForSession(getSelectedSessionKey()));
    lopHocState.sessionDraft = draft;
    normalizeDraftPartLabelsForDisplay(draft.pages);

    const timerInput = document.getElementById('sc-timer-input');
    const hideTimerInput = document.getElementById('sc-hide-global-timer');
    if (timerInput) timerInput.value = Number.isFinite(Number(draft.timer)) ? Number(draft.timer) : 35;
    if (hideTimerInput) hideTimerInput.checked = !!draft.hideGlobalTimer;

    renderDraftPageList();
    renderDraftPageEditor();
}

function renderDraftPageList() {
    const listEl = document.getElementById('sc-page-list');
    const draft = lopHocState.sessionDraft;
    if (!listEl || !draft) return;

    if (!draft.pages.length) {
        listEl.innerHTML = `<div class="text-muted small">Chưa có page nào. Hãy thêm page mới.</div>`;
        return;
    }

    listEl.innerHTML = draft.pages.map((page, idx) => {
        const active = idx === lopHocState.selectedDraftPageIndex ? 'active' : '';
        const typeLabel = PAGE_TYPE_LABELS[page?.type] || page?.type || 'Page';
        const subtitle = pageSummaryText(page) || 'Chưa có mô tả';
        return `
            <div class="builder-page-item ${active}" data-page-index="${idx}">
                <div class="builder-page-meta">
                    <div class="builder-page-title">#${idx + 1} • ${esc(typeLabel)}</div>
                    <div class="builder-page-subtitle">${esc(subtitle)}</div>
                </div>
                <div class="builder-page-actions">
                    <button class="btn btn-sm btn-outline-secondary" data-action="move-up" data-page-index="${idx}" title="Lên"><i class="bi bi-arrow-up"></i></button>
                    <button class="btn btn-sm btn-outline-secondary" data-action="move-down" data-page-index="${idx}" title="Xuống"><i class="bi bi-arrow-down"></i></button>
                    <button class="btn btn-sm btn-outline-secondary" data-action="duplicate" data-page-index="${idx}" title="Nhân bản"><i class="bi bi-files"></i></button>
                    <button class="btn btn-sm btn-outline-danger" data-action="delete" data-page-index="${idx}" title="Xóa"><i class="bi bi-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function renderDraftPageEditor() {
    const editorEl = document.getElementById('sc-page-editor');
    const draft = lopHocState.sessionDraft;
    if (!editorEl || !draft) return;

    const idx = lopHocState.selectedDraftPageIndex;
    const page = draft.pages[idx];
    if (!page) {
        editorEl.innerHTML = `<div class="text-muted" style="font-size:0.82rem;">Chọn một page ở cột trái để chỉnh nội dung.</div>`;
        return;
    }

    const typeOptions = PAGE_TYPE_OPTIONS.map((type) =>
        `<option value="${type}" ${page.type === type ? 'selected' : ''}>${esc(PAGE_TYPE_LABELS[type] || type)}</option>`
    ).join('');

    editorEl.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0 fw-bold">Chỉnh page #${idx + 1}</h6>
            <span class="badge bg-light text-dark">${esc(PAGE_TYPE_LABELS[page.type] || page.type)}</span>
        </div>

        <div class="row g-2 mb-2">
            <div class="col-md-6">
                <label class="builder-form-label">Page type</label>
                <select class="form-select" id="sc-edit-page-type" onchange="changeDraftPageType(this.value)">
                    ${typeOptions}
                </select>
            </div>
            <div class="col-md-6">
                <label class="builder-form-label">Part label / title nhanh</label>
                <input type="text" class="form-control" id="sc-edit-page-part-title"
                    value="${esc(page.partTitle || page.partLabel || page.headerTitle || '')}"
                    placeholder="VD: Part 1">
            </div>
        </div>

        <div id="sc-type-form-area">${renderTypeSpecificForm(page)}</div>

        <div class="d-flex gap-2 mt-2 mb-2">
            <button class="btn btn-sm btn-outline-primary" onclick="applyTypeFormToPage()">
                <i class="bi bi-check2-circle me-1"></i>Áp dụng form vào page
            </button>
        </div>
    `;

    bindTypeSpecificEditorInteractions();
    enhanceSessionBuilderMediaUploads(page);
}

function sanitizeSessionUploadFileName(name) {
    const base = String(name || 'file')
        .toLowerCase()
        .replace(/[^\w.\-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
    return base || 'file';
}

function getSessionUploadFileExtension(name) {
    const match = String(name || '').toLowerCase().match(/(\.[a-z0-9]+)$/);
    return match ? match[1] : '';
}

function isAcceptedSessionMediaFile(file, kind) {
    if (!file) return false;
    const ext = getSessionUploadFileExtension(file.name);
    if (kind === 'audio') {
        return file.type.includes('audio/mpeg') || ext === '.mp3';
    }
    if (kind === 'video') {
        return ['.mp4', '.webm', '.mov', '.m4v', '.avi'].includes(ext) || file.type.startsWith('video/');
    }
    return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext) || file.type.startsWith('image/');
}

function getSessionMediaAccept(kind) {
    if (kind === 'audio') return 'audio/mp3,audio/mpeg,.mp3';
    if (kind === 'video') return 'video/mp4,video/webm,video/quicktime,video/x-msvideo,.mp4,.webm,.mov,.m4v,.avi';
    return 'image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif';
}

function getSessionMediaInvalidFileMessage(kind) {
    if (kind === 'audio') return 'Vui lòng chọn file MP3.';
    if (kind === 'video') return 'Vui lòng chọn file video hợp lệ (mp4/webm/mov/m4v/avi).';
    return 'Vui lòng chọn file ảnh hợp lệ (png/jpg/jpeg/webp/gif).';
}

function getSessionMediaLabel(kind, mode) {
    if (mode === 'csv') {
        if (kind === 'image') return 'Upload ảnh từ máy (tự thêm vào danh sách):';
        if (kind === 'video') return 'Upload video từ máy (tự thêm vào danh sách):';
        return 'Upload audio từ máy (tự thêm vào danh sách):';
    }
    if (kind === 'image') return 'Hoặc upload ảnh từ máy:';
    if (kind === 'video') return 'Hoặc upload video từ máy:';
    return 'Hoặc upload audio từ máy:';
}

function sessionMediaStatusClass(type) {
    if (type === 'loading') return 'text-info';
    if (type === 'success') return 'text-success';
    if (type === 'error') return 'text-danger';
    return 'text-muted';
}

function setSessionMediaStatus(statusEl, type, message) {
    if (!statusEl) return;
    statusEl.className = `small mt-1 ${sessionMediaStatusClass(type)}`;
    statusEl.innerHTML = type === 'loading'
        ? `<i class="spinner-border spinner-border-sm me-1"></i>${message}`
        : (message || '');
}

function createSessionMediaPreviewNode(url, kind) {
    const value = String(url || '').trim();
    if (!value) return null;

    if (kind === 'audio') {
        const audio = document.createElement('audio');
        audio.controls = true;
        audio.src = value;
        audio.style.width = '100%';
        audio.style.maxWidth = '420px';
        return audio;
    }

    if (kind === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.src = value;
        video.style.maxWidth = '320px';
        video.style.maxHeight = '190px';
        video.style.border = '1px solid #cbd5e1';
        video.style.borderRadius = '8px';
        video.style.background = '#f8fafc';
        return video;
    }

    const img = document.createElement('img');
    img.src = value;
    img.alt = 'preview';
    img.style.maxWidth = '220px';
    img.style.maxHeight = '150px';
    img.style.border = '1px solid #cbd5e1';
    img.style.borderRadius = '8px';
    img.style.objectFit = 'contain';
    img.style.background = '#f8fafc';
    return img;
}

function renderSessionMediaPreview(previewEl, value, kind, mode = 'single') {
    if (!previewEl) return;
    previewEl.innerHTML = '';

    if (mode === 'csv') {
        const list = parseCsvValues(value);
        if (!list.length) return;
        const grid = document.createElement('div');
        grid.className = 'd-flex flex-wrap gap-2';
        list.forEach((url) => {
            const node = createSessionMediaPreviewNode(url, kind);
            if (node) grid.appendChild(node);
        });
        previewEl.appendChild(grid);
        return;
    }

    const node = createSessionMediaPreviewNode(value, kind);
    if (node) previewEl.appendChild(node);
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = String(reader.result || '').split(',')[1];
            if (!base64) {
                reject(new Error('Không thể đọc nội dung file.'));
                return;
            }
            resolve(base64);
        };
        reader.onerror = () => reject(new Error('Không thể đọc file từ máy.'));
        reader.readAsDataURL(file);
    });
}

async function uploadSessionMediaFile(file, filePath, kind) {
    const base64 = await readFileAsBase64(file);
    const response = await fetch('/api/upload-audio', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
            filePath,
            content: base64,
            message: `Upload ${kind} session_content: ${filePath}`
        })
    });

    const text = await response.text();
    if (!response.ok) {
        let errorMessage = `Upload thất bại (${response.status})`;
        try {
            const errorJson = JSON.parse(text);
            errorMessage = errorJson.error || errorJson.details || errorMessage;
        } catch (_) {
            errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
    }

    let result;
    try {
        result = JSON.parse(text);
    } catch (_) {
        throw new Error('Phản hồi upload không hợp lệ.');
    }

    if (!result.rawUrl) {
        throw new Error('Server không trả về URL file.');
    }

    return result.rawUrl;
}

function sanitizeSessionSegment(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || 'default';
}

function getSessionMediaUploadDir(kind, pageType) {
    const sessionKey = sanitizeSessionSegment(getSelectedSessionKey());
    const pageSegment = sanitizeSessionSegment(pageType || 'page');

    if (kind === 'audio') {
        if (String(pageType || '').startsWith('listening-')) return `audio/listening/${sessionKey}/${pageSegment}`;
        if (String(pageType || '').startsWith('speaking-')) return `audio/speaking/${sessionKey}/${pageSegment}`;
        return `audio/session/${sessionKey}/${pageSegment}`;
    }

    if (kind === 'video') {
        return `video/session/${sessionKey}/${pageSegment}`;
    }

    if (String(pageType || '').startsWith('speaking-')) return `images/speaking/${sessionKey}/${pageSegment}`;
    if (String(pageType || '').startsWith('writing-')) return `images/writing/${sessionKey}/${pageSegment}`;
    return `images/session/${sessionKey}/${pageSegment}`;
}

function appendCsvSessionValue(rawValue, newItem) {
    const arr = parseCsvValues(rawValue);
    if (!arr.includes(newItem)) arr.push(newItem);
    return arr.join(', ');
}

function attachSessionMediaUpload(inputEl, config) {
    if (!inputEl || inputEl.dataset.mediaUploadBound === '1') return;
    const kind = config?.kind || 'image';
    const mode = config?.mode || 'single';
    const dir = config?.dir || getSessionMediaUploadDir(kind, 'page');

    inputEl.dataset.mediaUploadBound = '1';

    const wrapper = document.createElement('div');
    wrapper.className = 'session-media-upload mt-2';

    const helper = document.createElement('div');
    helper.className = 'form-text';
    helper.textContent = getSessionMediaLabel(kind, mode);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.className = 'form-control form-control-sm mt-1';
    fileInput.accept = getSessionMediaAccept(kind);

    const statusEl = document.createElement('div');
    statusEl.className = 'small mt-1 text-muted';

    const previewEl = document.createElement('div');
    previewEl.className = 'mt-2';

    wrapper.appendChild(helper);
    wrapper.appendChild(fileInput);
    wrapper.appendChild(statusEl);
    wrapper.appendChild(previewEl);
    inputEl.parentElement?.appendChild(wrapper);

    const refreshPreview = () => {
        renderSessionMediaPreview(previewEl, inputEl.value, kind, mode);
        if ((inputEl.value || '').trim()) {
            setSessionMediaStatus(statusEl, 'info', mode === 'csv' ? 'Đang dùng danh sách URL đã nhập.' : 'Đang dùng URL đã nhập.');
        } else {
            setSessionMediaStatus(statusEl, 'info', '');
        }
    };

    inputEl.addEventListener('input', refreshPreview);

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!isAcceptedSessionMediaFile(file, kind)) {
            setSessionMediaStatus(statusEl, 'error', getSessionMediaInvalidFileMessage(kind));
            fileInput.value = '';
            return;
        }

        const ext = getSessionUploadFileExtension(file.name);
        const baseName = `${Date.now()}_${sanitizeSessionUploadFileName(file.name)}`;
        const fileName = ext && !baseName.endsWith(ext) ? `${baseName}${ext}` : baseName;
        const filePath = `${dir}/${fileName}`;

        setSessionMediaStatus(statusEl, 'loading', 'Đang upload...');
        try {
            const rawUrl = await uploadSessionMediaFile(file, filePath, kind);
            if (mode === 'csv') {
                inputEl.value = appendCsvSessionValue(inputEl.value, rawUrl);
            } else {
                inputEl.value = rawUrl;
            }
            refreshPreview();
            setSessionMediaStatus(statusEl, 'success', 'Upload thành công.');
        } catch (error) {
            setSessionMediaStatus(statusEl, 'error', error.message || 'Upload thất bại.');
        } finally {
            fileInput.value = '';
        }
    });

    refreshPreview();
}

function enhanceSessionBuilderMediaUploads(page) {
    if (!page) return;
    const pageType = page.type || 'page';

    attachSessionMediaUpload(document.getElementById('tf-audio'), {
        kind: 'audio',
        mode: 'single',
        dir: getSessionMediaUploadDir('audio', pageType)
    });

    attachSessionMediaUpload(document.getElementById('tf-intro-audio'), {
        kind: 'audio',
        mode: 'single',
        dir: getSessionMediaUploadDir('audio', pageType)
    });

    attachSessionMediaUpload(document.getElementById('tf-image'), {
        kind: 'image',
        mode: 'single',
        dir: getSessionMediaUploadDir('image', pageType)
    });

    attachSessionMediaUpload(document.getElementById('tf-images-csv'), {
        kind: 'image',
        mode: 'csv',
        dir: getSessionMediaUploadDir('image', pageType)
    });

    // Support future fields if page type có video.
    attachSessionMediaUpload(document.getElementById('tf-video'), {
        kind: 'video',
        mode: 'single',
        dir: getSessionMediaUploadDir('video', pageType)
    });

    attachSessionMediaUpload(document.getElementById('tf-videos-csv'), {
        kind: 'video',
        mode: 'csv',
        dir: getSessionMediaUploadDir('video', pageType)
    });
}

function renderTypeSpecificForm(page) {
    const d = page.data || {};
    const matchParas = d.paragraphs || {};
    const vocabPart = normalizeVocabPartKey(page.partKey || 'part1');

    switch (page.type) {
        case 'grammar':
            const grammarOptions = normalizeGrammarOptions(
                d.options,
                Math.max(1, Array.isArray(d.options) ? d.options.length : 3)
            );
            const grammarAnswer = String(d.answer || '').trim();
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Question</label><input id="tf-q" class="form-control" value="${esc(d.q || '')}"></div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Options</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-grammar-add-option-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm option
                            </button>
                        </div>
                        <div id="tf-grammar-option-list">
                            ${grammarOptions.map((option, idx) => renderGrammarOptionRowCard(option, idx + 1)).join('')}
                        </div>
                    </div>
                    <div class="col-md-5">
                        <label class="builder-form-label">Đáp án đúng</label>
                        <select id="tf-answer" class="form-select">
                            ${grammarOptions.map((option) => `<option value="${esc(option)}" ${option === grammarAnswer ? 'selected' : ''}>${esc(option)}</option>`).join('')}
                        </select>
                    </div>
                </div>`;
        case 'vocab':
            const vocabOptions = normalizeVocabOptionRows(
                d.options,
                Math.max(1, Array.isArray(d.options) ? d.options.length : 3)
            );
            const vocabLetters = getVocabOptionLetters(vocabOptions);
            const vocabRowCount = (() => {
                if (vocabPart === 'part2' || vocabPart === 'part3') {
                    return Math.max(1, Array.isArray(d.sentences) ? d.sentences.length : 1);
                }
                return Math.max(1, Array.isArray(d.words) ? d.words.length : 1);
            })();
            const vocabItems = normalizeVocabItemRows(vocabPart, d, vocabRowCount);
            const shouldShowExample = vocabPart === 'part1' || vocabPart === 'part4';
            const example = d.example && typeof d.example === 'object' && !Array.isArray(d.example) ? d.example : {};
            return `
                <div class="row g-2">
                    <div class="col-md-4">
                        <label class="builder-form-label">Vocab part</label>
                        <select id="tf-vocab-part-key" class="form-select">
                            <option value="part1" ${vocabPart === 'part1' ? 'selected' : ''}>Part 1</option>
                            <option value="part2" ${vocabPart === 'part2' ? 'selected' : ''}>Part 2</option>
                            <option value="part3" ${vocabPart === 'part3' ? 'selected' : ''}>Part 3</option>
                            <option value="part4" ${vocabPart === 'part4' ? 'selected' : ''}>Part 4</option>
                        </select>
                    </div>
                    <div class="col-md-8"><label class="builder-form-label">Title</label><input id="tf-vocab-title" class="form-control" value="${esc(d.title || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Instruction (EN)</label><textarea id="tf-vocab-instruction" class="form-control" rows="2">${esc(d.instruction || '')}</textarea></div>
                    <div class="col-12"><label class="builder-form-label">Instruction (VI)</label><textarea id="tf-vocab-instruction-vi" class="form-control" rows="2">${esc(d.instructionVi || '')}</textarea></div>
                    ${shouldShowExample ? `
                    <div class="col-12">
                        <label class="builder-form-label">Example (dùng cho Part 1/4)</label>
                        <div class="row g-2">
                            <div class="col-md-5">
                                <label class="builder-form-label">Word</label>
                                <input id="tf-vocab-example-word" class="form-control" value="${esc(example.word || '')}">
                            </div>
                            <div class="col-md-3">
                                <label class="builder-form-label">Answer letter</label>
                                ${renderVocabAnswerLetterSelect(vocabLetters, example.answer, 'tf-vocab-example-answer-select').replace('data-answer=', 'id="tf-vocab-example-answer" data-answer=')}
                            </div>
                            <div class="col-md-4">
                                <label class="builder-form-label">Answer word</label>
                                <input id="tf-vocab-example-answer-word" class="form-control" value="${esc(example.answerWord || '')}">
                            </div>
                        </div>
                    </div>
                    ` : ''}
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Options (A-K)</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-vocab-add-option-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm option
                            </button>
                        </div>
                        <div id="tf-vocab-option-list">
                            ${vocabOptions.map((option, idx) => renderVocabOptionRowCard(option, idx + 1)).join('')}
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Items</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-vocab-add-item-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm dòng
                            </button>
                        </div>
                        <div id="tf-vocab-item-list">
                            ${vocabItems.map((item, idx) => renderVocabItemRowCard(vocabPart, item, idx + 1, vocabLetters)).join('')}
                        </div>
                        <div class="form-text">Cấu trúc nhập liệu theo card giống admin Aptis cũ để hạn chế sai định dạng.</div>
                    </div>
                </div>`;
        case 'listening-q':
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Question</label><input id="tf-q" class="form-control" value="${esc(d.q || '')}"></div>
                    <div class="col-8"><label class="builder-form-label">Options (comma)</label><input id="tf-options" class="form-control" value="${esc((d.options || []).join(', '))}"></div>
                    <div class="col-4"><label class="builder-form-label">Answer</label><input id="tf-answer" class="form-control" value="${esc(d.answer || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Audio path</label><input id="tf-audio" class="form-control" value="${esc(d.audio || '')}"></div>
                </div>`;
        case 'reading-gap':
            const gapRows = normalizeReadingGapRows(d.rows, 5);
            return `
                <label class="builder-form-label">Instruction</label>
                <input id="tf-instruction" class="form-control mb-2" value="${esc(d.instruction || '')}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="builder-form-label mb-0">Danh sách câu gap-fill</label>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-reading-gap-add-btn">
                            <i class="bi bi-plus-lg me-1"></i>+1 câu
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-reading-gap-add5-btn">
                            <i class="bi bi-plus-square me-1"></i>+5 câu
                        </button>
                    </div>
                </div>
                <div id="tf-reading-gap-list">
                    ${gapRows.map((row, idx) => renderReadingGapRowCard(row, idx + 1)).join('')}
                </div>
                <div class="form-text">
                    Cách nhập giống Aptis: mỗi câu có ô riêng cho đầu câu, cuối câu, lựa chọn và đáp án.
                </div>`;
        case 'reading-order':
            const orderSentences = normalizeReadingOrderSentences(
                d.sentences,
                Math.max(1, Array.isArray(d.sentences) ? d.sentences.length : 0)
            );
            return `
                <label class="builder-form-label">Topic</label>
                <input id="tf-topic" class="form-control mb-2" value="${esc(d.topic || '')}">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="builder-form-label mb-0">Danh sách câu (Part 2 - Order)</label>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-reading-order-add-btn">
                            <i class="bi bi-plus-lg me-1"></i>+1 câu
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-reading-order-add5-btn">
                            <i class="bi bi-plus-square me-1"></i>+5 câu
                        </button>
                    </div>
                </div>
                <div id="tf-reading-order-list">
                    ${orderSentences.map((sentence, idx) => renderReadingOrderSentenceCard(sentence, idx + 1)).join('')}
                </div>
                <div class="form-text">Nhập theo thẻ từng câu để dễ sắp xếp và chỉnh sửa.</div>`;
        case 'reading-match':
            const matchQuestions = normalizeReadingMatchQuestions(d.questions, 1);
            return `
                <label class="builder-form-label">Topic</label>
                <input id="tf-topic" class="form-control mb-2" value="${esc(d.topic || '')}">
                <div class="row g-2">
                    <div class="col-md-6"><label class="builder-form-label">Paragraph A</label><textarea id="tf-pa" class="form-control" rows="3">${esc(matchParas.A || '')}</textarea></div>
                    <div class="col-md-6"><label class="builder-form-label">Paragraph B</label><textarea id="tf-pb" class="form-control" rows="3">${esc(matchParas.B || '')}</textarea></div>
                    <div class="col-md-6"><label class="builder-form-label">Paragraph C</label><textarea id="tf-pc" class="form-control" rows="3">${esc(matchParas.C || '')}</textarea></div>
                    <div class="col-md-6"><label class="builder-form-label">Paragraph D</label><textarea id="tf-pd" class="form-control" rows="3">${esc(matchParas.D || '')}</textarea></div>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2 mb-2">
                    <label class="builder-form-label mb-0">Danh sách câu hỏi</label>
                    <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-reading-match-add-question-btn">
                        <i class="bi bi-plus-lg me-1"></i>Thêm câu hỏi
                    </button>
                </div>
                <div id="tf-reading-match-question-list">
                    ${matchQuestions.map((question, idx) => renderReadingMatchQuestionCard(question, idx + 1)).join('')}
                </div>`;
        case 'reading-heading':
            const headingOptions = normalizeReadingHeadingOptions(
                d.headings,
                Math.max(1, Array.isArray(d.headings) ? d.headings.length : 0)
            );
            const headingParagraphRows = normalizeReadingHeadingParagraphRows(
                d.paragraphs,
                d.answers,
                headingOptions,
                Math.max(
                    1,
                    Array.isArray(d.paragraphs) ? d.paragraphs.length : 0,
                    Array.isArray(d.answers) ? d.answers.length : 0
                )
            );
            return `
                <label class="builder-form-label">Topic</label>
                <input id="tf-topic" class="form-control mb-2" value="${esc(d.topic || '')}">
                <div class="row g-2">
                    <div class="col-md-5">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Headings</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-reading-heading-add-option-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm heading
                            </button>
                        </div>
                        <div id="tf-reading-heading-option-list">
                            ${headingOptions.map((heading, idx) => renderReadingHeadingOptionCard(heading, idx + 1)).join('')}
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Paragraphs</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-reading-heading-add-paragraph-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm paragraph
                            </button>
                        </div>
                        <div id="tf-reading-heading-paragraph-list">
                            ${headingParagraphRows.map((row, idx) => renderReadingHeadingParagraphCard(row, idx + 1, headingOptions)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'listening-opinion':
            const opinionRows = normalizeListeningOpinionRows(
                d.statements,
                d.answers,
                Math.max(
                    1,
                    Array.isArray(d.statements) ? d.statements.length : 0,
                    Array.isArray(d.answers) ? d.answers.length : 0
                )
            );
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Topic</label><input id="tf-topic" class="form-control" value="${esc(d.topic || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Instruction</label><input id="tf-instruction" class="form-control" value="${esc(d.instruction || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Audio path</label><input id="tf-audio" class="form-control" value="${esc(d.audio || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Transcript</label><textarea id="tf-transcript" class="form-control" rows="3">${esc(d.transcript || '')}</textarea></div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Statements</label>
                            <div class="d-flex gap-2">
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-listening-opinion-add-btn">
                                    <i class="bi bi-plus-lg me-1"></i>+1
                                </button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-listening-opinion-add5-btn">
                                    <i class="bi bi-plus-square me-1"></i>+5
                                </button>
                            </div>
                        </div>
                        <div id="tf-listening-opinion-list">
                            ${opinionRows.map((row, idx) => renderListeningOpinionRowCard(row, idx + 1)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'listening-mcq-batch':
            const listeningMcqRows = normalizeListeningMcqQuestions(d.questions, 1);
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Topic</label><input id="tf-topic" class="form-control" value="${esc(d.topic || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Instruction</label><input id="tf-instruction" class="form-control" value="${esc(d.instruction || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Audio path</label><input id="tf-audio" class="form-control" value="${esc(d.audio || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Transcript</label><textarea id="tf-transcript" class="form-control" rows="3">${esc(d.transcript || '')}</textarea></div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Danh sách câu hỏi MCQ</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-listening-mcq-add-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm câu
                            </button>
                        </div>
                        <div id="tf-listening-mcq-list">
                            ${listeningMcqRows.map((question, idx) => renderListeningMcqRowCard(question, idx + 1)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'listening-topic':
            const topicOptions = normalizeListeningTopicOptions(
                d.options,
                Math.max(1, Array.isArray(d.options) ? d.options.length : 0)
            );
            const topicPersons = normalizeListeningTopicPersonRows(
                d.persons,
                d.answers,
                topicOptions,
                Math.max(
                    1,
                    Array.isArray(d.persons) ? d.persons.length : 0,
                    Array.isArray(d.answers) ? d.answers.length : 0
                )
            );
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Topic</label><input id="tf-topic" class="form-control" value="${esc(d.topic || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Instruction</label><input id="tf-instruction" class="form-control" value="${esc(d.instruction || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Audio path</label><input id="tf-audio" class="form-control" value="${esc(d.audio || '')}"></div>
                    <div class="col-md-6">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Options</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-listening-topic-add-option-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm option
                            </button>
                        </div>
                        <div id="tf-listening-topic-option-list">
                            ${topicOptions.map((option, idx) => renderListeningTopicOptionRowCard(option, idx + 1)).join('')}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Persons & answer</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-listening-topic-add-person-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm person
                            </button>
                        </div>
                        <div id="tf-listening-topic-person-list">
                            ${topicPersons.map((row, idx) => renderListeningTopicPersonRowCard(row, idx + 1, topicOptions)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'writing-short':
            const writingShortQuestions = normalizeWritingShortQuestions(d.questions, 1);
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Topic</label><input id="tf-topic" class="form-control" value="${esc(d.topic || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Topic instruction</label><textarea id="tf-topic-instruction" class="form-control" rows="3">${esc(d.topicInstruction || '')}</textarea></div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Danh sách câu hỏi</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-writing-short-add-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm câu
                            </button>
                        </div>
                        <div id="tf-writing-short-list">
                            ${writingShortQuestions.map((question, idx) => renderWritingShortQuestionCard(question, idx + 1)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'writing-sentences':
            const writingSentencesQuestions = normalizeWritingSentencesQuestions(d.questions, 1);
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Instruction</label><textarea id="tf-instruction" class="form-control" rows="3">${esc(d.instruction || '')}</textarea></div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Danh sách câu hỏi</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-writing-sentences-add-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm câu
                            </button>
                        </div>
                        <div id="tf-writing-sentences-list">
                            ${writingSentencesQuestions.map((question, idx) => renderWritingSentencesQuestionCard(question, idx + 1)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'writing-chat':
            const writingChatQuestions = normalizeWritingChatQuestions(d.questions, 1);
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Topic</label><input id="tf-topic" class="form-control" value="${esc(d.topic || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Topic instruction</label><textarea id="tf-topic-instruction" class="form-control" rows="3">${esc(d.topicInstruction || '')}</textarea></div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Danh sách câu hỏi</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-writing-chat-add-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm câu
                            </button>
                        </div>
                        <div id="tf-writing-chat-list">
                            ${writingChatQuestions.map((question, idx) => renderWritingChatQuestionCard(question, idx + 1)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'writing-email':
            const writingEmailItems = normalizeWritingEmailItems(d.emails, 1);
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Topic</label><input id="tf-topic" class="form-control" value="${esc(d.topic || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Topic instruction</label><textarea id="tf-topic-instruction" class="form-control" rows="3">${esc(d.topicInstruction || '')}</textarea></div>
                    <div class="col-12"><label class="builder-form-label">Context text</label><textarea id="tf-context" class="form-control" rows="3">${esc(d.contextText || '')}</textarea></div>
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="builder-form-label mb-0">Danh sách email</label>
                            <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-writing-email-add-btn">
                                <i class="bi bi-plus-lg me-1"></i>Thêm email
                            </button>
                        </div>
                        <div id="tf-writing-email-list">
                            ${writingEmailItems.map((item, idx) => renderWritingEmailItemCard(item, idx + 1)).join('')}
                        </div>
                    </div>
                </div>`;
        case 'writing-describe-image':
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Image path (single)</label><input id="tf-image" class="form-control" value="${esc(d.image || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Images path (comma, nếu 2 ảnh)</label><input id="tf-images-csv" class="form-control" value="${esc((d.images || []).join(', '))}"></div>
                    <div class="col-12"><label class="builder-form-label">Video path (optional)</label><input id="tf-video" class="form-control" value="${esc(d.video || '')}" placeholder="video/.../clip.mp4"></div>
                    <div class="col-md-3"><label class="builder-form-label">Main key</label><input id="tf-main-key" class="form-control" value="${esc(d.mainQuestion?.key || '')}"></div>
                    <div class="col-md-5"><label class="builder-form-label">Main prompt</label><input id="tf-main-prompt" class="form-control" value="${esc(d.mainQuestion?.prompt || '')}"></div>
                    <div class="col-md-2"><label class="builder-form-label">Min</label><input id="tf-main-min" type="number" class="form-control" value="${esc(String(d.mainQuestion?.minWords || 30))}"></div>
                    <div class="col-md-2"><label class="builder-form-label">Max</label><input id="tf-main-max" type="number" class="form-control" value="${esc(String(d.mainQuestion?.maxWords || 80))}"></div>
                </div>`;
        case 'writing-followup':
            const writingFollowupQuestions = normalizeWritingFollowupQuestions(d.followUps, 1);
            return `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label class="builder-form-label mb-0">Follow-up questions</label>
                    <button type="button" class="btn btn-sm btn-outline-secondary" id="tf-writing-followup-add-btn">
                        <i class="bi bi-plus-lg me-1"></i>Thêm câu
                    </button>
                </div>
                <div id="tf-writing-followup-list">
                    ${writingFollowupQuestions.map((question, idx) => renderWritingFollowupQuestionCard(question, idx + 1)).join('')}
                </div>`;
        case 'speaking-q':
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Prompt</label><input id="tf-prompt" class="form-control" value="${esc(d.prompt || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Audio path (optional)</label><input id="tf-audio" class="form-control" value="${esc(d.audio || '')}" placeholder="audio/speaking/.../question.mp3"></div>
                    <div class="col-6"><label class="builder-form-label">Response seconds</label><input id="tf-response-seconds" type="number" class="form-control" value="${esc(String(page.responseSeconds || 30))}"></div>
                    <div class="col-6"><label class="builder-form-label">Wait seconds</label><input id="tf-wait-seconds" type="number" class="form-control" value="${esc(String(page.waitSeconds || 5))}"></div>
                </div>`;
        case 'speaking-intro':
            return `
                <div class="row g-2">
                    <div class="col-12"><label class="builder-form-label">Part label</label><input id="tf-part-label" class="form-control" value="${esc(d.partLabel || page.partLabel || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Intro text</label><textarea id="tf-intro-text" class="form-control" rows="3">${esc(d.introText || '')}</textarea></div>
                    <div class="col-12"><label class="builder-form-label">Intro audio</label><input id="tf-intro-audio" class="form-control" value="${esc(d.introAudio || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Images (comma)</label><input id="tf-images-csv" class="form-control" value="${esc((d.images || []).join(', '))}"></div>
                    <div class="col-12"><label class="builder-form-label">Videos (comma, optional)</label><input id="tf-videos-csv" class="form-control" value="${esc((d.videos || []).join(', '))}" placeholder="video/.../clip1.mp4, video/.../clip2.mp4"></div>
                </div>`;
        case 'speaking-audio-q':
            return `
                <div class="row g-2">
                    <div class="col-md-3"><label class="builder-form-label">Key</label><input id="tf-key" class="form-control" value="${esc(d.key || '')}"></div>
                    <div class="col-md-9"><label class="builder-form-label">Prompt</label><input id="tf-prompt" class="form-control" value="${esc(d.prompt || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Audio</label><input id="tf-audio" class="form-control" value="${esc(d.audio || '')}"></div>
                    <div class="col-12"><label class="builder-form-label">Images (comma)</label><input id="tf-images-csv" class="form-control" value="${esc((d.images || []).join(', '))}"></div>
                    <div class="col-12"><label class="builder-form-label">Video (optional)</label><input id="tf-video" class="form-control" value="${esc(d.video || '')}" placeholder="video/.../clip.mp4"></div>
                    <div class="col-6"><label class="builder-form-label">Response seconds</label><input id="tf-response-seconds" type="number" class="form-control" value="${esc(String(page.responseSeconds || 45))}"></div>
                    <div class="col-6"><label class="builder-form-label">Wait seconds</label><input id="tf-wait-seconds" type="number" class="form-control" value="${esc(String(page.waitSeconds || 5))}"></div>
                </div>`;
        default:
            return `<div class="builder-help">Type này chưa có form chi tiết. Hãy chọn type khác hoặc bổ sung form type trong code admin.</div>`;
    }
}

function getCurrentDraftPage() {
    const draft = lopHocState.sessionDraft;
    if (!draft) return null;
    return draft.pages[lopHocState.selectedDraftPageIndex] || null;
}

function parseCsvValues(text) {
    return String(text || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
}

function parseMultiline(text) {
    return String(text || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
}

function parsePipeLine(line, expected = 0) {
    const arr = String(line || '').split('|').map((s) => s.trim());
    while (arr.length < expected) arr.push('');
    return arr;
}

function changeDraftPageType(type) {
    const page = getCurrentDraftPage();
    if (!page) return;
    if (!PAGE_TYPE_OPTIONS.includes(type)) return;
    if (page.type === type) return;

    if (!confirm('Đổi page type sẽ nạp data mẫu cho type mới. Tiếp tục?')) {
        renderDraftPageEditor();
        return;
    }

    const next = createDefaultPageByType(type);
    Object.keys(page).forEach((k) => delete page[k]);
    Object.assign(page, next);
    renderDraftBuilder();
    syncJsonFromDraft(false);
}

function applyTypeFormToPage(options = {}) {
    const silent = !!options.silent;
    const page = getCurrentDraftPage();
    const resultEl = document.getElementById('sc-result');
    if (!page) return;

    const quickPart = document.getElementById('sc-edit-page-part-title')?.value.trim() || '';
    if (quickPart) {
        if (page.type.startsWith('writing-')) page.headerTitle = quickPart;
        else if (page.type.startsWith('listening-') || page.type.startsWith('speaking-')) page.partLabel = quickPart;
        else page.partTitle = quickPart;
    } else {
        delete page.partTitle;
        delete page.partLabel;
        delete page.headerTitle;
    }

    const d = {};
    const byId = (id) => document.getElementById(id)?.value || '';
    const toInt = (v, fallback) => {
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : fallback;
    };

    switch (page.type) {
        case 'grammar':
            d.q = byId('tf-q').trim();
            {
                const optionNodes = Array.from(document.querySelectorAll('#tf-grammar-option-list .tf-grammar-option-row'));
                if (optionNodes.length) {
                    d.options = optionNodes
                        .map((rowNode) => rowNode.querySelector('.tf-grammar-option-text')?.value.trim() || '')
                        .filter(Boolean);
                } else {
                    d.options = parseCsvValues(byId('tf-options'));
                }
                d.options = normalizeGrammarOptions(d.options, 1);
                d.answer = byId('tf-answer').trim() || d.options[0] || '';
                if (d.answer && !d.options.includes(d.answer)) {
                    d.options.push(d.answer);
                }
            }
            break;
        case 'vocab': {
            const partKey = normalizeVocabPartKey(byId('tf-vocab-part-key'));
            const partNum = VOCAB_PART_NUM_BY_KEY[partKey];
            page.partKey = partKey;
            page.partNum = partNum;

            d.title = byId('tf-vocab-title').trim();
            d.instruction = byId('tf-vocab-instruction').trim();
            d.instructionVi = byId('tf-vocab-instruction-vi').trim();

            const optionNodes = Array.from(document.querySelectorAll('#tf-vocab-option-list .tf-vocab-option-row'));
            if (optionNodes.length) {
                d.options = optionNodes
                    .map((rowNode) => ({
                        letter: rowNode.querySelector('.tf-vocab-option-letter')?.value.trim().toUpperCase() || '',
                        word: rowNode.querySelector('.tf-vocab-option-word')?.value.trim() || ''
                    }))
                    .filter((item) => item.letter || item.word);
            } else {
                d.options = parseMultiline(byId('tf-vocab-options')).map((line) => {
                    const [letter, word] = parsePipeLine(line, 2);
                    return { letter, word };
                }).filter((o) => o.letter || o.word);
            }
            d.options = normalizeVocabOptionRows(d.options, 1);

            if (partKey === 'part2') {
                const itemNodes = Array.from(document.querySelectorAll('#tf-vocab-item-list .tf-vocab-item-row'));
                if (itemNodes.length) {
                    d.sentences = itemNodes
                        .map((rowNode, idx) => ({
                            num: toInt(rowNode.querySelector('.tf-vocab-item-num')?.value, idx + 1),
                            text: rowNode.querySelector('.tf-vocab-item-text')?.value.trim() || '',
                            answer: (rowNode.querySelector('.tf-vocab-item-answer-select')?.value || '').trim().toUpperCase()
                        }))
                        .filter((item) => item.text || item.answer);
                } else {
                    d.sentences = parseMultiline(byId('tf-vocab-items')).map((line, idx) => {
                        const [num, text, answer] = parsePipeLine(line, 3);
                        return {
                            num: toInt(num, idx + 1),
                            text,
                            answer
                        };
                    });
                }
                d.sentences = normalizeVocabItemRows('part2', d, 1);
            } else if (partKey === 'part3') {
                const itemNodes = Array.from(document.querySelectorAll('#tf-vocab-item-list .tf-vocab-item-row'));
                if (itemNodes.length) {
                    d.sentences = itemNodes
                        .map((rowNode, idx) => ({
                            num: toInt(rowNode.querySelector('.tf-vocab-item-num')?.value, idx + 1),
                            before: rowNode.querySelector('.tf-vocab-item-before')?.value.trim() || '',
                            after: rowNode.querySelector('.tf-vocab-item-after')?.value.trim() || '',
                            answer: (rowNode.querySelector('.tf-vocab-item-answer-select')?.value || '').trim().toUpperCase()
                        }))
                        .filter((item) => item.before || item.after || item.answer);
                } else {
                    d.sentences = parseMultiline(byId('tf-vocab-items')).map((line, idx) => {
                        const [num, before, after, answer] = parsePipeLine(line, 4);
                        return {
                            num: toInt(num, idx + 1),
                            before,
                            after,
                            answer
                        };
                    });
                }
                d.sentences = normalizeVocabItemRows('part3', d, 1);
            } else {
                const hasNewExampleInputs = !!document.getElementById('tf-vocab-example-word');
                if (hasNewExampleInputs) {
                    d.example = {
                        word: byId('tf-vocab-example-word').trim(),
                        answer: byId('tf-vocab-example-answer').trim().toUpperCase(),
                        answerWord: byId('tf-vocab-example-answer-word').trim()
                    };
                } else {
                    const [word, answer, answerWord] = parsePipeLine(byId('tf-vocab-example'), 3);
                    d.example = { word, answer, answerWord };
                }

                const itemNodes = Array.from(document.querySelectorAll('#tf-vocab-item-list .tf-vocab-item-row'));
                if (itemNodes.length) {
                    d.words = itemNodes
                        .map((rowNode, idx) => ({
                            num: toInt(rowNode.querySelector('.tf-vocab-item-num')?.value, idx + 1),
                            word: rowNode.querySelector('.tf-vocab-item-word')?.value.trim() || '',
                            answer: (rowNode.querySelector('.tf-vocab-item-answer-select')?.value || '').trim().toUpperCase()
                        }))
                        .filter((item) => item.word || item.answer);
                } else {
                    d.words = parseMultiline(byId('tf-vocab-items')).map((line, idx) => {
                        const [num, itemWord, itemAnswer] = parsePipeLine(line, 3);
                        return {
                            num: toInt(num, idx + 1),
                            word: itemWord,
                            answer: itemAnswer
                        };
                    });
                }
                d.words = normalizeVocabItemRows(partKey, d, 1);
            }
            break;
        }
        case 'listening-q':
            d.q = byId('tf-q').trim();
            d.options = parseCsvValues(byId('tf-options'));
            d.answer = byId('tf-answer').trim();
            d.audio = byId('tf-audio').trim();
            break;
        case 'reading-gap':
            d.instruction = byId('tf-instruction').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-reading-gap-list .tf-reading-gap-row'));
                if (rowNodes.length) {
                    d.rows = rowNodes
                        .map((rowNode) => {
                            const before = rowNode.querySelector('.tf-gap-before')?.value.trim() || '';
                            const after = rowNode.querySelector('.tf-gap-after')?.value.trim() || '';
                            const answer = rowNode.querySelector('.tf-gap-answer')?.value.trim() || '';
                            const optionsRaw = rowNode.querySelector('.tf-gap-options')?.value || '';
                            const options = parseReadingGapOptionValues(optionsRaw);
                            if (answer && !options.includes(answer)) {
                                options.push(answer);
                            }
                            return { before, after, options, answer };
                        })
                        .filter((row) => row.before || row.after || row.answer || (row.options || []).length);
                } else {
                    // Backward-compatible fallback nếu DOM cũ còn tf-rows.
                    d.rows = parseMultiline(byId('tf-rows')).map((line) => {
                        const [before, after, options, answer] = parsePipeLine(line, 4);
                        return { before, after, options: parseCsvValues(options), answer };
                    });
                }
                d.rows = normalizeReadingGapRows(d.rows, 5);
            }
            break;
        case 'reading-order':
            d.topic = byId('tf-topic').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-reading-order-list .tf-reading-order-row'));
                if (rowNodes.length) {
                    d.sentences = rowNodes
                        .map((rowNode) => rowNode.querySelector('.tf-reading-order-sentence')?.value.trim() || '')
                        .filter(Boolean);
                } else {
                    d.sentences = parseMultiline(byId('tf-sentences'));
                }
                d.sentences = normalizeReadingOrderSentences(d.sentences, 1);
            }
            break;
        case 'reading-match':
            d.topic = byId('tf-topic').trim();
            d.paragraphs = {
                A: byId('tf-pa').trim(),
                B: byId('tf-pb').trim(),
                C: byId('tf-pc').trim(),
                D: byId('tf-pd').trim()
            };
            {
                const questionNodes = Array.from(document.querySelectorAll('#tf-reading-match-question-list .tf-reading-match-question-row'));
                if (questionNodes.length) {
                    d.questions = questionNodes
                        .map((rowNode) => {
                            const prompt = rowNode.querySelector('.tf-reading-match-prompt')?.value.trim() || '';
                            const answer = normalizeReadingMatchAnswerLetter(rowNode.querySelector('.tf-reading-match-answer')?.value) || 'A';
                            return { prompt, answer };
                        })
                        .filter((q) => q.prompt || q.answer);
                } else {
                    d.questions = parseMultiline(byId('tf-questions')).map((line) => {
                        const [prompt, answer] = parsePipeLine(line, 2);
                        return { prompt, answer };
                    });
                }
                d.questions = normalizeReadingMatchQuestions(d.questions, 1);
            }
            break;
        case 'reading-heading':
            d.topic = byId('tf-topic').trim();
            {
                const optionNodes = Array.from(document.querySelectorAll('#tf-reading-heading-option-list .tf-reading-heading-option-row'));
                const paragraphNodes = Array.from(document.querySelectorAll('#tf-reading-heading-paragraph-list .tf-reading-heading-paragraph-row'));

                if (optionNodes.length || paragraphNodes.length) {
                    const headings = normalizeReadingHeadingOptions(
                        optionNodes
                            .map((rowNode) => rowNode.querySelector('.tf-reading-heading-option-text')?.value.trim() || '')
                            .filter(Boolean),
                        1
                    );
                    const paragraphRows = paragraphNodes
                        .map((rowNode) => {
                            const text = rowNode.querySelector('.tf-reading-heading-paragraph-text')?.value.trim() || '';
                            const rawAnswerIndex =
                                rowNode.querySelector('.tf-reading-heading-answer')?.value ||
                                rowNode.querySelector('.tf-reading-heading-answer')?.dataset.answerIndex ||
                                '0';
                            const answerIndex = toInt(rawAnswerIndex, 0);
                            return { text, answerIndex };
                        })
                        .filter((row) => row.text);
                    const normalizedRows = normalizeReadingHeadingParagraphRows(
                        paragraphRows.map((row) => row.text),
                        paragraphRows.map((row) => row.answerIndex),
                        headings,
                        1
                    );
                    d.headings = headings;
                    d.paragraphs = normalizedRows.map((row) => row.text);
                    d.answers = normalizedRows.map((row) => row.answerIndex);
                } else {
                    const headings = normalizeReadingHeadingOptions(parseMultiline(byId('tf-headings')), 1);
                    const normalizedRows = normalizeReadingHeadingParagraphRows(
                        parseMultiline(byId('tf-paragraphs')),
                        parseCsvValues(byId('tf-answers-csv')).map((v) => toInt(v, 0)),
                        headings,
                        1
                    );
                    d.headings = headings;
                    d.paragraphs = normalizedRows.map((row) => row.text);
                    d.answers = normalizedRows.map((row) => row.answerIndex);
                }
            }
            break;
        case 'listening-opinion':
            d.topic = byId('tf-topic').trim();
            d.instruction = byId('tf-instruction').trim();
            d.audio = byId('tf-audio').trim();
            d.transcript = byId('tf-transcript').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-listening-opinion-list .tf-listening-opinion-row'));
                if (rowNodes.length) {
                    const rows = rowNodes
                        .map((rowNode) => ({
                            statement: rowNode.querySelector('.tf-listening-opinion-statement')?.value.trim() || '',
                            answer: normalizeListeningOpinionAnswer(rowNode.querySelector('.tf-listening-opinion-answer')?.value)
                        }))
                        .filter((row) => row.statement || row.answer);
                    const normalizedRows = normalizeListeningOpinionRows(
                        rows.map((row) => row.statement),
                        rows.map((row) => row.answer),
                        1
                    );
                    d.statements = normalizedRows.map((row) => row.statement);
                    d.answers = normalizedRows.map((row) => row.answer);
                } else {
                    const normalizedRows = normalizeListeningOpinionRows(
                        parseMultiline(byId('tf-statements')),
                        parseMultiline(byId('tf-answers')),
                        1
                    );
                    d.statements = normalizedRows.map((row) => row.statement);
                    d.answers = normalizedRows.map((row) => row.answer);
                }
            }
            break;
        case 'listening-mcq-batch':
            d.topic = byId('tf-topic').trim();
            d.instruction = byId('tf-instruction').trim();
            d.audio = byId('tf-audio').trim();
            d.transcript = byId('tf-transcript').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-listening-mcq-list .tf-listening-mcq-row'));
                if (rowNodes.length) {
                    d.questions = rowNodes
                        .map((rowNode, idx) => {
                            const id = rowNode.querySelector('.tf-listening-mcq-id')?.value.trim() || String(idx + 1);
                            const question = rowNode.querySelector('.tf-listening-mcq-question')?.value.trim() || '';
                            const opt1 = rowNode.querySelector('.tf-listening-mcq-opt1')?.value.trim() || '';
                            const opt2 = rowNode.querySelector('.tf-listening-mcq-opt2')?.value.trim() || '';
                            const opt3 = rowNode.querySelector('.tf-listening-mcq-opt3')?.value.trim() || '';
                            const options = [opt1, opt2, opt3].filter(Boolean);
                            const answer = rowNode.querySelector('.tf-listening-mcq-answer')?.value.trim() || options[0] || '';
                            return { id, question, options, answer };
                        })
                        .filter((q) => q.id || q.question || q.answer || (q.options || []).length);
                } else {
                    d.questions = parseMultiline(byId('tf-questions')).map((line, idx) => {
                        const [id, question, options, answer] = parsePipeLine(line, 4);
                        return { id: id || String(idx + 1), question, options: parseCsvValues(options), answer };
                    });
                }
                d.questions = normalizeListeningMcqQuestions(d.questions, 1);
            }
            break;
        case 'listening-topic':
            d.topic = byId('tf-topic').trim();
            d.instruction = byId('tf-instruction').trim();
            d.audio = byId('tf-audio').trim();
            {
                const optionNodes = Array.from(document.querySelectorAll('#tf-listening-topic-option-list .tf-listening-topic-option-row'));
                const personNodes = Array.from(document.querySelectorAll('#tf-listening-topic-person-list .tf-listening-topic-person-row'));

                if (optionNodes.length || personNodes.length) {
                    const options = normalizeListeningTopicOptions(
                        optionNodes
                            .map((rowNode) => rowNode.querySelector('.tf-listening-topic-option-text')?.value.trim() || '')
                            .filter(Boolean),
                        1
                    );
                    const personRows = personNodes
                        .map((rowNode) => {
                            const person = rowNode.querySelector('.tf-listening-topic-person-text')?.value.trim() || '';
                            const rawAnswerIndex =
                                rowNode.querySelector('.tf-listening-topic-person-answer')?.value ||
                                rowNode.querySelector('.tf-listening-topic-person-answer')?.dataset.answerIndex ||
                                '0';
                            const answerIndex = toInt(rawAnswerIndex, 0);
                            return { person, answerIndex };
                        })
                        .filter((row) => row.person);
                    const normalizedRows = normalizeListeningTopicPersonRows(
                        personRows.map((row) => row.person),
                        personRows.map((row) => row.answerIndex),
                        options,
                        1
                    );
                    d.options = options;
                    d.persons = normalizedRows.map((row) => row.person);
                    d.answers = normalizedRows.map((row) => row.answerIndex);
                } else {
                    const options = normalizeListeningTopicOptions(parseMultiline(byId('tf-options-lines')), 1);
                    const normalizedRows = normalizeListeningTopicPersonRows(
                        parseMultiline(byId('tf-persons')),
                        parseCsvValues(byId('tf-answers-csv')).map((v) => toInt(v, 0)),
                        options,
                        1
                    );
                    d.options = options;
                    d.persons = normalizedRows.map((row) => row.person);
                    d.answers = normalizedRows.map((row) => row.answerIndex);
                }
            }
            break;
        case 'writing-short':
            d.topic = byId('tf-topic').trim();
            d.topicInstruction = byId('tf-topic-instruction').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-writing-short-list .tf-writing-short-row'));
                if (rowNodes.length) {
                    d.questions = rowNodes
                        .map((rowNode, idx) => {
                            const key = rowNode.querySelector('.tf-writing-short-key')?.value.trim() || `q${idx + 1}`;
                            const prompt = rowNode.querySelector('.tf-writing-short-prompt')?.value.trim() || '';
                            const minWords = toInt(rowNode.querySelector('.tf-writing-short-min')?.value, 1);
                            const maxWords = toInt(rowNode.querySelector('.tf-writing-short-max')?.value, 10);
                            return { key, prompt, minWords, maxWords };
                        })
                        .filter((q) => q.key || q.prompt);
                } else {
                    d.questions = parseMultiline(byId('tf-questions')).map((line, idx) => {
                        const [key, prompt, min, max] = parsePipeLine(line, 4);
                        return {
                            key: key || `q${idx + 1}`,
                            prompt,
                            minWords: toInt(min, 1),
                            maxWords: toInt(max, 10)
                        };
                    });
                }
                d.questions = normalizeWritingShortQuestions(d.questions, 1);
            }
            break;
        case 'writing-sentences':
            d.instruction = byId('tf-instruction').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-writing-sentences-list .tf-writing-sentences-row'));
                if (rowNodes.length) {
                    d.questions = rowNodes
                        .map((rowNode, idx) => ({
                            key: rowNode.querySelector('.tf-writing-sentences-key')?.value.trim() || `q${idx + 1}`,
                            prompt: rowNode.querySelector('.tf-writing-sentences-prompt')?.value.trim() || '',
                            minWords: toInt(rowNode.querySelector('.tf-writing-sentences-min')?.value, 20),
                            maxWords: toInt(rowNode.querySelector('.tf-writing-sentences-max')?.value, 30)
                        }))
                        .filter((q) => q.key || q.prompt);
                } else {
                    d.questions = parseMultiline(byId('tf-questions')).map((line, idx) => {
                        const [key, prompt, min, max] = parsePipeLine(line, 4);
                        return {
                            key: key || `q${idx + 1}`,
                            prompt,
                            minWords: toInt(min, 20),
                            maxWords: toInt(max, 30)
                        };
                    });
                }
                d.questions = normalizeWritingSentencesQuestions(d.questions, 1);
            }
            break;
        case 'writing-chat':
            d.topic = byId('tf-topic').trim();
            d.topicInstruction = byId('tf-topic-instruction').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-writing-chat-list .tf-writing-chat-row'));
                if (rowNodes.length) {
                    d.questions = rowNodes
                        .map((rowNode, idx) => ({
                            key: rowNode.querySelector('.tf-writing-chat-key')?.value.trim() || `q${idx + 1}`,
                            prompt: rowNode.querySelector('.tf-writing-chat-prompt')?.value.trim() || '',
                            minWords: toInt(rowNode.querySelector('.tf-writing-chat-min')?.value, 30),
                            maxWords: toInt(rowNode.querySelector('.tf-writing-chat-max')?.value, 40)
                        }))
                        .filter((q) => q.key || q.prompt);
                } else {
                    d.questions = parseMultiline(byId('tf-questions')).map((line, idx) => {
                        const [key, prompt, min, max] = parsePipeLine(line, 4);
                        return {
                            key: key || `q${idx + 1}`,
                            prompt,
                            minWords: toInt(min, 30),
                            maxWords: toInt(max, 40)
                        };
                    });
                }
                d.questions = normalizeWritingChatQuestions(d.questions, 1);
            }
            break;
        case 'writing-email':
            d.topic = byId('tf-topic').trim();
            d.topicInstruction = byId('tf-topic-instruction').trim();
            d.contextText = byId('tf-context').trim();
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-writing-email-list .tf-writing-email-row'));
                if (rowNodes.length) {
                    d.emails = rowNodes
                        .map((rowNode, idx) => ({
                            key: rowNode.querySelector('.tf-writing-email-key')?.value.trim() || `q4_${idx + 1}`,
                            label: rowNode.querySelector('.tf-writing-email-label')?.value.trim() || '',
                            minWords: toInt(rowNode.querySelector('.tf-writing-email-min')?.value, 120),
                            maxWords: toInt(rowNode.querySelector('.tf-writing-email-max')?.value, 225),
                            rows: toInt(rowNode.querySelector('.tf-writing-email-rows')?.value, 8)
                        }))
                        .filter((item) => item.key || item.label);
                } else {
                    d.emails = parseMultiline(byId('tf-emails')).map((line, idx) => {
                        const [key, label, min, max, rows] = parsePipeLine(line, 5);
                        return {
                            key: key || `q4_${idx + 1}`,
                            label,
                            minWords: toInt(min, 120),
                            maxWords: toInt(max, 225),
                            rows: toInt(rows, 8)
                        };
                    });
                }
                d.emails = normalizeWritingEmailItems(d.emails, 1);
            }
            break;
        case 'writing-describe-image':
            d.image = byId('tf-image').trim();
            d.images = parseCsvValues(byId('tf-images-csv'));
            if (byId('tf-video').trim()) d.video = byId('tf-video').trim();
            d.mainQuestion = {
                key: byId('tf-main-key').trim(),
                prompt: byId('tf-main-prompt').trim(),
                minWords: toInt(byId('tf-main-min'), 30),
                maxWords: toInt(byId('tf-main-max'), 80)
            };
            break;
        case 'writing-followup':
            {
                const rowNodes = Array.from(document.querySelectorAll('#tf-writing-followup-list .tf-writing-followup-row'));
                if (rowNodes.length) {
                    d.followUps = rowNodes
                        .map((rowNode, idx) => ({
                            key: rowNode.querySelector('.tf-writing-followup-key')?.value.trim() || `q_fu_${idx + 1}`,
                            prompt: rowNode.querySelector('.tf-writing-followup-prompt')?.value.trim() || '',
                            minWords: toInt(rowNode.querySelector('.tf-writing-followup-min')?.value, 20),
                            maxWords: toInt(rowNode.querySelector('.tf-writing-followup-max')?.value, 60)
                        }))
                        .filter((q) => q.key || q.prompt);
                } else {
                    d.followUps = parseMultiline(byId('tf-followups')).map((line, idx) => {
                        const [key, prompt, min, max] = parsePipeLine(line, 4);
                        return {
                            key: key || `q_fu_${idx + 1}`,
                            prompt,
                            minWords: toInt(min, 20),
                            maxWords: toInt(max, 60)
                        };
                    });
                }
                d.followUps = normalizeWritingFollowupQuestions(d.followUps, 1);
            }
            break;
        case 'speaking-q':
            d.prompt = byId('tf-prompt').trim();
            d.audio = byId('tf-audio').trim();
            page.responseSeconds = toInt(byId('tf-response-seconds'), 30);
            page.waitSeconds = toInt(byId('tf-wait-seconds'), 5);
            break;
        case 'speaking-intro':
            d.partLabel = byId('tf-part-label').trim();
            d.introText = byId('tf-intro-text').trim();
            d.introAudio = byId('tf-intro-audio').trim();
            d.images = parseCsvValues(byId('tf-images-csv'));
            d.videos = parseCsvValues(byId('tf-videos-csv'));
            page.partLabel = d.partLabel || page.partLabel || '';
            break;
        case 'speaking-audio-q':
            d.key = byId('tf-key').trim();
            d.prompt = byId('tf-prompt').trim();
            d.audio = byId('tf-audio').trim();
            d.images = parseCsvValues(byId('tf-images-csv'));
            if (byId('tf-video').trim()) d.video = byId('tf-video').trim();
            page.responseSeconds = toInt(byId('tf-response-seconds'), 45);
            page.waitSeconds = toInt(byId('tf-wait-seconds'), 5);
            break;
        default:
            break;
    }

    if (Object.keys(d).length) {
        page.data = d;
    }

    renderDraftBuilder();
    syncJsonFromDraft(false);
    if (!silent && resultEl) showResult(resultEl, 'Đã áp dụng form vào page hiện tại.', 'success');
}

function applyRawPageDataJson() {
    const page = getCurrentDraftPage();
    const resultEl = document.getElementById('sc-result');
    const txt = document.getElementById('sc-page-data-json')?.value || '{}';
    if (!page) return;
    try {
        const parsed = JSON.parse(txt);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('Data JSON phải là object');
        }
        page.data = parsed;
        renderDraftBuilder();
        syncJsonFromDraft(false);
        if (resultEl) showResult(resultEl, 'Đã áp dụng Data JSON cho page hiện tại.', 'success');
    } catch (err) {
        if (resultEl) showResult(resultEl, 'Data JSON lỗi: ' + err.message, 'danger');
    }
}

function formatCurrentPageDataJson() {
    const page = getCurrentDraftPage();
    const textarea = document.getElementById('sc-page-data-json');
    if (!page || !textarea) return;
    textarea.value = JSON.stringify(page.data || {}, null, 2);
}

function getPreviewStorageKey(sessionKey) {
    return `${SESSION_PREVIEW_STORAGE_PREFIX}:${sessionKey}`;
}

function commitCurrentSessionBuilderPage() {
    const page = getCurrentDraftPage();
    if (!page) return;
    applyTypeFormToPage({ silent: true });
}

function prepareSessionPreviewPayload() {
    commitCurrentSessionBuilderPage();
    const draft = normalizeSessionDraft(lopHocState.sessionDraft || getTemplateForSession(getSelectedSessionKey()));
    const errors = validateSessionConfig(draft);
    if (errors.length) {
        throw new Error(errors.join(' | '));
    }
    return draft;
}

function writePreviewToStorage(sessionKey, config) {
    const key = getPreviewStorageKey(sessionKey);
    const payload = {
        sessionKey,
        config,
        updatedAt: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
}

function buildSessionPreviewUrl(band, session) {
    const q = new URLSearchParams({
        band,
        session: String(session),
        preview: '1',
        t: String(Date.now())
    });
    return `buoi_hoc.html?${q.toString()}`;
}

function previewSessionInAdmin() {
    const resultEl = document.getElementById('sc-result');
    const frame = document.getElementById('sc-preview-frame');
    const { sessionKey, band, session } = getSelectedBandSession();

    try {
        const config = prepareSessionPreviewPayload();
        writePreviewToStorage(sessionKey, config);
        const url = buildSessionPreviewUrl(band, session);
        if (frame) frame.src = url;
        showResult(resultEl, `Đã mở preview trong admin cho <strong>${esc(sessionKey)}</strong>.`, 'success');
    } catch (err) {
        showResult(resultEl, 'Không thể preview: ' + err.message, 'danger');
    }
}

function openSessionPreviewNewTab() {
    const resultEl = document.getElementById('sc-result');
    const { sessionKey, band, session } = getSelectedBandSession();

    try {
        const config = prepareSessionPreviewPayload();
        writePreviewToStorage(sessionKey, config);
        const url = buildSessionPreviewUrl(band, session);
        window.open(url, '_blank', 'noopener');
        showResult(resultEl, `Đã mở preview tab mới cho <strong>${esc(sessionKey)}</strong>.`, 'success');
    } catch (err) {
        showResult(resultEl, 'Không thể mở preview tab mới: ' + err.message, 'danger');
    }
}

function formatSessionJson() {
    const editor = document.getElementById('sc-json');
    const resultEl = document.getElementById('sc-result');
    if (!editor) return;
    try {
        const parsed = JSON.parse(editor.value || '{}');
        editor.value = JSON.stringify(parsed, null, 2);
        applyDraftConfig(parsed);
        showResult(resultEl, 'JSON hợp lệ và đã được format.', 'success');
    } catch (err) {
        showResult(resultEl, 'JSON lỗi: ' + err.message, 'danger');
    }
}

/* ── Per-page-type validation rules ──
   Return array of warning strings. Empty data is OK for page types with
   defaults (so admin can save a skeleton). We only flag DEFINITE errors. */
const PAGE_TYPE_VALIDATORS = {
    'grammar': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.q !== undefined && typeof d.q !== 'string') errs.push(`${label}: "q" phải là string`);
        if (d.options !== undefined && !Array.isArray(d.options)) errs.push(`${label}: "options" phải là mảng`);
        if (Array.isArray(d.options) && d.options.length > 0 && d.options.length < 2) {
            errs.push(`${label}: cần ít nhất 2 đáp án`);
        }
        if (d.answer !== undefined && typeof d.answer !== 'string') errs.push(`${label}: "answer" phải là string`);
        if (Array.isArray(d.options) && d.answer && !d.options.includes(d.answer)) {
            errs.push(`${label}: "answer" không có trong "options"`);
        }
        return errs;
    },
    'vocab': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.options !== undefined && !Array.isArray(d.options)) errs.push(`${label}: "options" phải là mảng`);
        if (d.words !== undefined && !Array.isArray(d.words)) errs.push(`${label}: "words" phải là mảng`);
        if (d.sentences !== undefined && !Array.isArray(d.sentences)) errs.push(`${label}: "sentences" phải là mảng`);
        return errs;
    },
    'listening-q': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.options !== undefined && !Array.isArray(d.options)) errs.push(`${label}: "options" phải là mảng`);
        return errs;
    },
    'listening-topic': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.persons !== undefined && !Array.isArray(d.persons)) errs.push(`${label}: "persons" phải là mảng`);
        if (d.options !== undefined && !Array.isArray(d.options)) errs.push(`${label}: "options" phải là mảng`);
        return errs;
    },
    'listening-opinion': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.questions !== undefined && !Array.isArray(d.questions)) errs.push(`${label}: "questions" phải là mảng`);
        return errs;
    },
    'listening-mcq-batch': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.items !== undefined && !Array.isArray(d.items)) errs.push(`${label}: "items" phải là mảng`);
        return errs;
    },
    'reading-gap': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.rows !== undefined && !Array.isArray(d.rows)) errs.push(`${label}: "rows" phải là mảng`);
        if (Array.isArray(d.rows)) {
            d.rows.forEach((r, i) => {
                if (r && Array.isArray(r.options) && r.answer && !r.options.includes(r.answer)) {
                    errs.push(`${label}: rows[${i}] "answer" không khớp "options"`);
                }
            });
        }
        return errs;
    },
    'reading-order': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.sentences !== undefined && !Array.isArray(d.sentences)) errs.push(`${label}: "sentences" phải là mảng`);
        if (Array.isArray(d.sentences) && d.sentences.length > 0 && d.sentences.length < 2) {
            errs.push(`${label}: cần ít nhất 2 câu để sắp xếp`);
        }
        return errs;
    },
    'reading-match': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.paragraphs !== undefined && (typeof d.paragraphs !== 'object' || Array.isArray(d.paragraphs))) {
            errs.push(`${label}: "paragraphs" phải là object { A: "...", B: "..." }`);
        }
        if (d.questions !== undefined && !Array.isArray(d.questions)) errs.push(`${label}: "questions" phải là mảng`);
        return errs;
    },
    'reading-heading': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.paragraphs !== undefined && !Array.isArray(d.paragraphs)) errs.push(`${label}: "paragraphs" phải là mảng`);
        if (d.headings !== undefined && !Array.isArray(d.headings)) errs.push(`${label}: "headings" phải là mảng`);
        return errs;
    },
    'writing-short': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.questions !== undefined && !Array.isArray(d.questions)) errs.push(`${label}: "questions" phải là mảng`);
        return errs;
    },
    'writing-email': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.emails !== undefined && !Array.isArray(d.emails)) errs.push(`${label}: "emails" phải là mảng`);
        return errs;
    },
    'writing-sentences': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.questions !== undefined && !Array.isArray(d.questions)) errs.push(`${label}: "questions" phải là mảng`);
        return errs;
    },
    'writing-chat': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.questions !== undefined && !Array.isArray(d.questions)) errs.push(`${label}: "questions" phải là mảng`);
        return errs;
    },
    'writing-describe-image': (d, label) => {
        const errs = [];
        if (!d) return errs;
        return errs;
    },
    'writing-followup': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.questions !== undefined && !Array.isArray(d.questions)) errs.push(`${label}: "questions" phải là mảng`);
        return errs;
    },
    'speaking-q': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.responseSeconds !== undefined && (typeof d.responseSeconds !== 'number' || d.responseSeconds < 0)) {
            errs.push(`${label}: "responseSeconds" phải là số >= 0`);
        }
        return errs;
    },
    'speaking-intro': (d, label) => [],
    'speaking-audio-q': (d, label) => {
        const errs = [];
        if (!d) return errs;
        if (d.responseSeconds !== undefined && (typeof d.responseSeconds !== 'number' || d.responseSeconds < 0)) {
            errs.push(`${label}: "responseSeconds" phải là số >= 0`);
        }
        return errs;
    }
};

/* ── Known page types (keep in sync with buoi_hoc.js dispatcher) ── */
const KNOWN_PAGE_TYPES = new Set(Object.keys(PAGE_TYPE_VALIDATORS));

/* ── Size limits to keep JSONB sane ── */
const MAX_PAGES_PER_SESSION = 200;
const MAX_CONFIG_BYTES = 500000; // ~500KB

function validateSessionConfig(config) {
    const errors = [];
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
        errors.push('Config phải là object JSON.');
        return errors;
    }
    if (!Array.isArray(config.pages)) {
        errors.push('Thiếu mảng "pages".');
        return errors;
    }
    if (!config.pages.length) {
        errors.push('"pages" đang rỗng — thêm ít nhất 1 trang trước khi lưu.');
    }
    if (config.pages.length > MAX_PAGES_PER_SESSION) {
        errors.push(`Quá ${MAX_PAGES_PER_SESSION} trang (hiện ${config.pages.length}).`);
    }
    if (config.timer !== undefined && config.timer !== null && config.timer !== '') {
        const t = Number(config.timer);
        if (!Number.isFinite(t) || t < 0) {
            errors.push('"timer" phải là số >= 0 (phút).');
        }
    }

    config.pages.forEach((page, idx) => {
        const label = `pages[${idx}]`;
        if (!page || typeof page !== 'object' || Array.isArray(page)) {
            errors.push(`${label} phải là object.`);
            return;
        }
        if (!page.type || typeof page.type !== 'string') {
            errors.push(`${label} thiếu "type".`);
            return;
        }
        if (!KNOWN_PAGE_TYPES.has(page.type)) {
            errors.push(`${label} type "${page.type}" không hợp lệ. Hợp lệ: ${[...KNOWN_PAGE_TYPES].join(', ')}`);
            return;
        }
        if (!('data' in page)) {
            errors.push(`${label} thiếu "data".`);
            return;
        }
        if (page.data !== null && page.data !== undefined) {
            if (typeof page.data !== 'object' || Array.isArray(page.data)) {
                errors.push(`${label} "data" phải là object.`);
                return;
            }
            const validator = PAGE_TYPE_VALIDATORS[page.type];
            if (validator) {
                const pageErrs = validator(page.data, label) || [];
                pageErrs.forEach((e) => errors.push(e));
            }
        }
    });

    // Size sanity check (JSONB payload limit)
    try {
        const jsonStr = JSON.stringify(config);
        if (jsonStr.length > MAX_CONFIG_BYTES) {
            errors.push(`Config quá lớn: ${(jsonStr.length / 1024).toFixed(1)}KB (giới hạn ${(MAX_CONFIG_BYTES / 1024).toFixed(0)}KB).`);
        }
    } catch (err) {
        errors.push('Config không serialize được JSON: ' + err.message);
    }

    return errors;
}

async function refreshSessionContentList() {
    const resultEl = document.getElementById('sc-result');
    try {
        const data = await apiCall('/api/practice_sets/list?type=session_content');
        lopHocState.sessionContentRecords = data.sets || data || [];
        renderSessionContentList();
        updateSessionStatus(findSessionContentRecord(getSelectedSessionKey()));
    } catch (err) {
        lopHocState.sessionContentRecords = [];
        renderSessionContentList();
        showResult(resultEl, 'Không tải được danh sách custom: ' + err.message, 'danger');
    }
}

function renderSessionContentList() {
    const tbody = document.getElementById('sc-custom-list-body');
    const empty = document.getElementById('sc-custom-empty');
    if (!tbody) return;

    const records = (lopHocState.sessionContentRecords || [])
        .filter((set) => String(set?.data?.__practice_type || '').toLowerCase() === 'session_content')
        .sort((a, b) => {
            const ta = new Date(a?.updated_at || a?.created_at || 0).getTime();
            const tb = new Date(b?.updated_at || b?.created_at || 0).getTime();
            return tb - ta;
        });

    if (!records.length) {
        tbody.innerHTML = '';
        if (empty) empty.style.display = 'block';
        return;
    }

    if (empty) empty.style.display = 'none';
    tbody.innerHTML = records.map((r) => {
        const key = r?.data?.session_key || '--';
        return `
            <tr>
                <td><strong>${esc(key)}</strong></td>
                <td>${esc(r.title || '--')}</td>
                <td>${esc(formatDatetime(r.updated_at || r.created_at))}</td>
                <td>${esc(r?.data?.notes || '--')}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="openSessionContentFromList('${esc(key)}')">
                        <i class="bi bi-pencil-square me-1"></i>Sửa
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

function openSessionContentFromList(sessionKey) {
    const [band, session] = String(sessionKey || '').split('-');
    if (!band || !session) return;
    const bandEl = document.getElementById('sc-band');
    const sessionEl = document.getElementById('sc-session');
    if (!bandEl || !sessionEl) return;
    bandEl.value = band.toUpperCase();
    populateSessionDropdown();
    sessionEl.value = String(parseInt(session, 10) || 1);
    loadSessionContentEditor();
    switchTab('tab-session-content');
}

async function saveSessionContent() {
    const key = getSelectedSessionKey();
    const notes = document.getElementById('sc-notes')?.value.trim() || '';
    const resultEl = document.getElementById('sc-result');
    commitCurrentSessionBuilderPage();
    const config = normalizeSessionDraft(lopHocState.sessionDraft || getTemplateForSession(key));

    const errors = validateSessionConfig(config);
    if (errors.length) {
        showResult(resultEl, errors.join('<br>'), 'danger');
        return;
    }

    const payload = {
        title: `Session Content ${key}`,
        type: 'writing',
        description: `Custom content for ${key}`,
        duration_minutes: Number(config.timer) > 0 ? Number(config.timer) : 35,
        data: {
            __practice_type: 'session_content',
            session_key: key,
            session_config: config,
            notes
        }
    };

    const existing = findSessionContentRecord(key);
    try {
        if (existing?.id) {
            await apiCall(`/api/practice_sets/update?id=${existing.id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showResult(resultEl, `Đã cập nhật custom cho <strong>${esc(key)}</strong>.`, 'success');
        } else {
            await apiCall('/api/practice_sets/create', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showResult(resultEl, `Đã tạo custom cho <strong>${esc(key)}</strong>.`, 'success');
        }
        await refreshSessionContentList();
        lopHocState.selectedSessionContentRecord = findSessionContentRecord(key);
        updateSessionStatus(lopHocState.selectedSessionContentRecord);
    } catch (err) {
        showResult(resultEl, 'Lỗi lưu custom: ' + err.message, 'danger');
    }
}

async function deleteSessionContent() {
    const key = getSelectedSessionKey();
    const resultEl = document.getElementById('sc-result');
    const existing = findSessionContentRecord(key);

    if (!existing?.id) {
        showResult(resultEl, `Buổi <strong>${esc(key)}</strong> chưa có custom để xóa.`, 'warning');
        return;
    }

    if (!confirm(`Xóa custom content của ${key}? Sau khi xóa sẽ fallback về hard-code mặc định.`)) {
        return;
    }

    try {
        await apiCall(`/api/practice_sets/delete?id=${existing.id}`, { method: 'DELETE' });
        showResult(resultEl, `Đã xóa custom của <strong>${esc(key)}</strong>.`, 'success');
        loadSessionTemplate();
        await refreshSessionContentList();
    } catch (err) {
        showResult(resultEl, 'Lỗi xóa custom: ' + err.message, 'danger');
    }
}

/* ═══════════════════════════════════════════════════════
   UTILITY FUNCTIONS
   ═══════════════════════════════════════════════════════ */

function esc(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(dateStr) {
    if (!dateStr) return '<span class="text-muted">--</span>';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateObj(date) {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDatetime(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' + d.toTimeString().substring(0, 5);
}

function courseBadge(course) {
    if (!course) return '<span class="text-muted">--</span>';
    if (course === 'Lớp học') return '<span class="badge-course badge-lop-hoc">Lớp học</span>';
    if (course === 'Lớp ôn thi') return '<span class="badge-course badge-on-thi">Ôn thi</span>';
    return `<span class="badge-course">${esc(course)}</span>`;
}

function bandBadge(band) {
    if (!band) return '<span class="text-muted">--</span>';
    if (band === 'B1') return '<span class="badge-band badge-b1">B1</span>';
    if (band === 'B2') return '<span class="badge-band badge-b2">B2</span>';
    return `<span class="badge-band">${esc(band)}</span>`;
}

function showResult(el, html, type) {
    if (!el) return;
    el.style.display = 'block';
    el.className = `mt-3 alert alert-${type}`;
    el.innerHTML = html;
}

function showAlert(containerId, msg, type) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<tr><td colspan="11"><div class="alert alert-${type} mb-0">${msg}</div></td></tr>`;
    }
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
