/**
 * VSTEP Lớp Học — module quản lý bài học theo từng buổi của 1 lớp.
 *
 * Flow:
 *   1. Admin tạo lớp ở form #vstepClassForm → admin_vstep.js dispatch
 *      window event 'vstep:class-created' với { class }.
 *   2. Module này nhận event → mở panel #vstep-class-sessions-panel với grid
 *      18 (B1) hoặc 24 (B2) ô buổi học (đọc từ class.sessions[]).
 *   3. Click 1 ô → set hidden inputs (vstep-content-class-id, session-number,
 *      due-at) + showContentFlow('lesson_exam'). admin_vstep.js đã có hook
 *      `window.__VSTEP_PAYLOAD_HOOK__` đọc 3 hidden input đó để gắn vào
 *      payload.data trước khi POST /api/vstep/contents/create.
 *   4. Sau khi save content (admin_vstep.js dispatch 'vstep:content-saved')
 *      → module quay lại grid + refresh trạng thái "đã có bài / chưa có".
 *
 * Không động state/refs nội bộ của admin_vstep.js — chỉ giao tiếp qua
 * window event + hidden input + payload hook.
 */
(function () {
    if (typeof window === 'undefined') return;
    if (window.__VSTEP_ADMIN_MODE__ !== 'lophoc') return;

    const state = {
        activeClass: null,        // class object hiện đang xem grid buổi
        activeSession: null,      // session_number đang edit (1..N)
        contentsByKey: new Map()  // 'classId|sessionNumber' -> content
    };

    const $ = (id) => document.getElementById(id);

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatLocalDateTime(value) {
        if (!value) return '';
        const d = new Date(value);
        if (!Number.isFinite(d.getTime())) return '';
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${dd}/${mm} ${hh}:${min}`;
    }

    function bandSessionCount(band) {
        return String(band || '').toUpperCase() === 'B2' ? 24 : 18;
    }

    // ===== Map content theo class + session =====
    function rebuildContentIndex() {
        state.contentsByKey.clear();
        const sets = window.__VSTEP_STATE__?.sets || [];
        sets.forEach(set => {
            const data = set?.data || {};
            const classId = data.vstep_class_id;
            const sessionNumber = Number(data.vstep_session_number);
            if (classId && sessionNumber > 0) {
                state.contentsByKey.set(`${classId}|${sessionNumber}`, set);
            }
        });
    }

    function findContent(classId, sessionNumber) {
        return state.contentsByKey.get(`${classId}|${sessionNumber}`) || null;
    }

    // ===== Render grid sessions =====
    function renderGrid() {
        const panel = $('vstep-class-sessions-panel');
        if (!panel || !state.activeClass) return;

        const cls = state.activeClass;
        const sessions = Array.isArray(cls.sessions) && cls.sessions.length
            ? cls.sessions
            : Array.from({ length: bandSessionCount(cls.band) }).map((_, i) => ({
                number: i + 1,
                date: null,
                deadline: null,
                day_name: ''
            }));

        const titleEl = $('vstep-class-sessions-title');
        if (titleEl) titleEl.textContent = `Bài học cho lớp: ${cls.title || cls.id}`;

        const subtitleEl = $('vstep-class-sessions-subtitle');
        if (subtitleEl) {
            subtitleEl.textContent = `${cls.band || '?'} · ${sessions.length} buổi · lịch ${cls.schedule_type || '—'} · giờ ${cls.start_time || '—'}`;
        }

        const gridEl = $('vstep-class-sessions-grid');
        if (!gridEl) return;
        gridEl.innerHTML = sessions.map(session => {
            const existing = findContent(cls.id, session.number);
            const status = existing ? 'Đã có bài' : 'Chưa có bài';
            const statusClass = existing ? 'vstep-status-published' : 'vstep-status-draft';
            const dateText = session.date ? formatLocalDateTime(session.date) : '—';
            const deadlineText = session.deadline ? formatLocalDateTime(session.deadline) : '—';
            const dayName = session.day_name || '';
            const action = existing
                ? '<i class="bi bi-pencil-square me-1"></i>Sửa bài'
                : '<i class="bi bi-plus-circle me-1"></i>Tạo bài học';
            return `
                <button type="button" class="vstep-session-card" data-session-number="${session.number}">
                    <div class="vstep-session-head">
                        <strong>Buổi ${session.number}</strong>
                        <span class="vstep-status-pill ${statusClass}">${status}</span>
                    </div>
                    <div class="vstep-session-meta">
                        <span><i class="bi bi-calendar-event"></i> ${escapeHtml(dayName)} ${escapeHtml(dateText)}</span>
                        <span><i class="bi bi-flag"></i> DL ${escapeHtml(deadlineText)}</span>
                        ${existing ? `<span class="text-secondary"><i class="bi bi-file-text"></i> ${escapeHtml(existing.title || '')}</span>` : ''}
                    </div>
                    <div class="vstep-session-action">${action}</div>
                </button>
            `;
        }).join('');

        gridEl.querySelectorAll('[data-session-number]').forEach(btn => {
            btn.addEventListener('click', () => openSessionEditor(Number(btn.dataset.sessionNumber)));
        });
    }

    // ===== Mở 1 panel (ẩn các panel khác) =====
    function showPanel(panelId) {
        document.querySelectorAll('.vstep-admin-section').forEach(section => {
            section.classList.toggle('active', section.id === panelId);
        });
        document.querySelectorAll('.vstep-admin-tab').forEach(btn => btn.classList.remove('active'));
    }

    function openClassLessons(cls) {
        if (!cls) return;
        state.activeClass = cls;
        rebuildContentIndex();
        renderGrid();
        showPanel('vstep-class-sessions-panel');
    }

    function backToClasses() {
        state.activeClass = null;
        state.activeSession = null;
        clearSessionHiddenInputs();
        const tab = document.querySelector('[data-vstep-panel="classes"]');
        if (tab) tab.click();
    }

    // ===== Mở content editor cho 1 buổi =====
    function setSessionHiddenInputs(classId, sessionNumber, dueAt) {
        const setIfExists = (id, value) => {
            const el = $(id);
            if (el) el.value = value == null ? '' : String(value);
        };
        setIfExists('vstep-content-class-id', classId || '');
        setIfExists('vstep-content-session-number', sessionNumber || '');
        setIfExists('vstep-content-due-at', dueAt || '');
    }

    function clearSessionHiddenInputs() {
        setSessionHiddenInputs('', '', '');
    }

    function openSessionEditor(sessionNumber) {
        const cls = state.activeClass;
        if (!cls) return;
        state.activeSession = sessionNumber;

        const session = (cls.sessions || []).find(s => Number(s.number) === Number(sessionNumber));
        const dueAt = session?.deadline || '';

        setSessionHiddenInputs(cls.id, sessionNumber, dueAt);

        // Trigger content panel: dùng nút data-vstep-flow=lesson_exam đã có sẵn
        // trong sidebar của admin_vstep_lop_hoc.html — admin_vstep.js sẽ
        // tự chuyển panel + reset editor về flow lesson_exam.
        const flowBtn = document.querySelector('[data-vstep-flow="lesson_exam"]');
        if (flowBtn) flowBtn.click();

        // Sau khi reset form, prefill title gợi ý + load bài cũ nếu có.
        setTimeout(() => {
            const existing = findContent(cls.id, sessionNumber);
            if (existing && window.__VSTEP_API__?.fillForm) {
                window.__VSTEP_API__.fillForm(existing);
            } else {
                const titleInput = $('vstep-title');
                if (titleInput && !titleInput.value) {
                    titleInput.value = `${cls.title || 'Lớp'} - Buổi ${sessionNumber}`;
                }
            }

            // Hiển thị banner ngữ cảnh trong panel content.
            updateContextBanner(cls, sessionNumber, dueAt);
        }, 50);
    }

    function updateContextBanner(cls, sessionNumber, dueAt) {
        const banner = $('vstep-content-context-banner');
        if (!banner) return;
        banner.classList.remove('d-none');
        banner.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Đang soạn buổi ${sessionNumber} của lớp ${escapeHtml(cls.title || '')}</strong>
                    <div class="small text-secondary">Deadline tự động: ${escapeHtml(formatLocalDateTime(dueAt) || '—')}</div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-secondary" id="vstep-content-back-to-grid">
                    <i class="bi bi-arrow-left me-1"></i> Về danh sách buổi
                </button>
            </div>
        `;
        $('vstep-content-back-to-grid')?.addEventListener('click', () => openClassLessons(cls));
    }

    function hideContextBanner() {
        const banner = $('vstep-content-context-banner');
        if (banner) {
            banner.classList.add('d-none');
            banner.innerHTML = '';
        }
    }

    // ===== Payload hook: gắn class_id + session_number vào data trước khi save =====
    window.__VSTEP_PAYLOAD_HOOK__ = function (payload) {
        const classId = $('vstep-content-class-id')?.value || '';
        const sessionNumber = Number($('vstep-content-session-number')?.value || 0);
        const dueAt = $('vstep-content-due-at')?.value || '';
        if (classId && sessionNumber > 0) {
            payload.data = payload.data || {};
            payload.data.vstep_class_id = classId;
            payload.data.vstep_session_number = sessionNumber;
            if (dueAt) payload.data.vstep_session_due_at = dueAt;
            // Title hint: nếu admin chưa nhập riêng, dùng "Buổi N - <lớp>"
            if (!payload.title || !payload.title.trim()) {
                payload.title = `${state.activeClass?.title || 'Lớp'} - Buổi ${sessionNumber}`;
            }
        }
    };

    // ===== Sau khi save: tự giao bài cho lớp + refresh grid =====
    async function autoAssignContent(content, dueAt) {
        try {
            await fetch('/api/vstep/assignments/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
                },
                body: JSON.stringify({
                    contentId: content.id,
                    classId: state.activeClass.id,
                    dueAt: dueAt || null,
                    notes: `Buổi ${$('vstep-content-session-number')?.value || ''}`
                })
            });
        } catch (e) {
            console.warn('Auto-assign failed:', e);
        }
    }

    window.addEventListener('vstep:class-created', (e) => {
        if (e.detail?.class) openClassLessons(e.detail.class);
    });

    window.addEventListener('vstep:content-saved', async (e) => {
        const content = e.detail?.content;
        const classId = e.detail?.payload?.data?.vstep_class_id;
        if (!classId || !content) return;
        // Lần đầu tạo (không phải update) → tạo assignment để lớp có bài.
        if (!e.detail.isUpdate) {
            const dueAt = e.detail?.payload?.data?.vstep_session_due_at || '';
            await autoAssignContent(content, dueAt);
        }
        // Quay lại grid để admin thấy trạng thái "Đã có bài".
        if (state.activeClass) {
            clearSessionHiddenInputs();
            hideContextBanner();
            // Đợi loadSets() trong admin_vstep.js refresh state.sets xong.
            setTimeout(() => openClassLessons(state.activeClass), 200);
        }
    });

    // Cho phép admin click vào card lớp ở danh sách lớp để mở grid buổi.
    document.addEventListener('click', (event) => {
        const card = event.target.closest('[data-vstep-class-id]');
        if (!card) return;
        const id = card.dataset.vstepClassId;
        const classes = window.__VSTEP_STATE__?.classes || [];
        const cls = classes.find(c => String(c.id) === String(id));
        if (cls) openClassLessons(cls);
    });

    // Expose API tối thiểu để debug.
    window.__VSTEP_LOP_HOC__ = { openClassLessons, backToClasses, state };

    // =====================================================================
    // Checkbox UI cho "Ngày nghỉ" và "Học viên trong lớp" trong form tạo lớp.
    // Giữ <textarea id="vstep-class-holidays"> và <select id="vstep-class-students">
    // ẩn (admin_vstep.js đọc 2 element này) — module sync giá trị từ checkbox.
    // =====================================================================

    function formatVnDate(value) {
        const d = new Date(`${value}T00:00:00`);
        if (!Number.isFinite(d.getTime())) return value;
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        return `${dayNames[d.getDay()]} ${dd}/${mm}/${d.getFullYear()}`;
    }

    function setupHolidayCheckboxes() {
        const textarea = $('vstep-class-holidays');
        const list = $('vstep-class-holidays-list');
        const addBtn = $('vstep-class-holiday-add-btn');
        const addInput = $('vstep-class-holiday-add-input');
        if (!textarea || !list || !addBtn || !addInput) return;

        function read() {
            try { return JSON.parse(textarea.value || '[]'); }
            catch { return []; }
        }

        function write(arr) {
            const cleaned = Array.from(new Set(arr.filter(Boolean))).sort();
            textarea.value = JSON.stringify(cleaned);
            render(cleaned);
        }

        function render(arr) {
            if (!arr.length) {
                list.innerHTML = '<div class="text-secondary small">Chưa có ngày nghỉ. Bỏ tick để xóa.</div>';
                return;
            }
            list.innerHTML = arr.map(date => `
                <div class="form-check form-check-inline me-3 mb-1">
                    <input class="form-check-input vstep-holiday-check" type="checkbox" checked data-date="${escapeHtml(date)}" id="vstep-holiday-${escapeHtml(date)}">
                    <label class="form-check-label small" for="vstep-holiday-${escapeHtml(date)}">${escapeHtml(formatVnDate(date))}</label>
                </div>
            `).join('');
            list.querySelectorAll('.vstep-holiday-check').forEach(cb => {
                cb.addEventListener('change', () => {
                    if (cb.checked) return;
                    write(read().filter(d => d !== cb.dataset.date));
                });
            });
        }

        addBtn.addEventListener('click', () => {
            const val = (addInput.value || '').trim();
            if (!val) return;
            const arr = read();
            if (!arr.includes(val)) arr.push(val);
            write(arr);
            addInput.value = '';
        });

        // Form reset (sau createClass) → clear list về rỗng.
        const form = $('vstepClassForm');
        if (form) {
            form.addEventListener('reset', () => {
                setTimeout(() => write([]), 0);
            });
        }

        render(read());
    }

    function setupStudentCheckboxes() {
        const select = $('vstep-class-students');
        const list = $('vstep-class-students-list');
        const search = $('vstep-class-students-search');
        if (!select || !list) return;

        function render() {
            const keyword = ((search?.value) || '').toLowerCase().trim();
            const opts = Array.from(select.options);
            if (!opts.length) {
                list.innerHTML = '<div class="text-secondary small">Chưa có học viên. Tạo học viên ở tab "Học viên" trước.</div>';
                return;
            }
            const filtered = keyword
                ? opts.filter(o => (o.textContent || '').toLowerCase().includes(keyword))
                : opts;
            if (!filtered.length) {
                list.innerHTML = '<div class="text-secondary small">Không có học viên nào khớp tìm kiếm.</div>';
                return;
            }
            list.innerHTML = filtered.map(o => {
                const checked = o.selected ? 'checked' : '';
                const cbId = `vstep-class-student-cb-${o.value}`;
                return `
                    <div class="form-check">
                        <input class="form-check-input vstep-class-student-check" type="checkbox" value="${escapeHtml(o.value)}" id="${escapeHtml(cbId)}" ${checked}>
                        <label class="form-check-label small" for="${escapeHtml(cbId)}">${escapeHtml(o.textContent || '')}</label>
                    </div>
                `;
            }).join('');
            list.querySelectorAll('.vstep-class-student-check').forEach(cb => {
                cb.addEventListener('change', () => {
                    const opt = Array.from(select.options).find(o => o.value === cb.value);
                    if (opt) opt.selected = cb.checked;
                });
            });
        }

        // admin_vstep.js gọi renderClassStudentOptions() set lại innerHTML
        // của <select> mỗi khi loadUsers xong → MutationObserver re-render.
        const obs = new MutationObserver(render);
        obs.observe(select, { childList: true });

        search?.addEventListener('input', render);

        // Form reset (sau createClass) → uncheck hết.
        const form = $('vstepClassForm');
        if (form) {
            form.addEventListener('reset', () => {
                setTimeout(() => {
                    Array.from(select.options).forEach(o => { o.selected = false; });
                    render();
                }, 0);
            });
        }

        render();
    }

    // updateOverview() trong admin_vstep.js ghi state.results.length (mọi flow)
    // vào card "Bài đã nộp". Trang Lớp Học chỉ nên hiện count lesson_exam.
    // Quan sát text card → overwrite với count đúng. Tương tự cho card "Học viên"
    // và "Bài học/buổi" để chắc ăn (lesson_exam tính cả 2 mode lesson/assigned_exam).
    function fixOverviewCounts() {
        const resultsEl = $('vstepOverviewResults');
        if (!resultsEl) return;

        let updating = false;
        function recompute() {
            if (updating) return;
            const results = window.__VSTEP_STATE__?.results || [];
            const lessonExamCount = results.filter(r => {
                const flow = r?.metadata?.vstep_flow;
                return flow === 'lesson_exam';
            }).length;
            const desired = String(lessonExamCount);
            if (resultsEl.textContent === desired) return;
            updating = true;
            resultsEl.textContent = desired;
            setTimeout(() => { updating = false; }, 0);
        }

        const obs = new MutationObserver(recompute);
        obs.observe(resultsEl, { childList: true, characterData: true, subtree: true });
        recompute();
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupHolidayCheckboxes();
        setupStudentCheckboxes();
        fixOverviewCounts();
    });
})();
