(function () {
    // ===========================================================
    // VSTEP – Học tập (lesson_exam flow)
    // Render grid 18/24 buổi theo giáo trình B1/B2.
    // ===========================================================

    const FLOW = 'lesson_exam';

    const refs = {
        state: document.getElementById('vstepListState'),
        grid: document.getElementById('vstepListGrid'),
        reload: document.getElementById('reloadVstepListBtn'),
        classInfo: document.getElementById('vstepClassInfo')
    };

    // Cache giữa loadClassInfo + loadSets để renderSessions có đủ context.
    const state = {
        classRecord: null,
        adminView: false,
        sets: [],
        myResults: []
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function setState(message, type = 'info') {
        if (!refs.state) return;
        refs.state.className = `alert alert-${type}`;
        refs.state.textContent = message;
        refs.state.style.display = message ? 'block' : 'none';
    }

    function authorizedHeaders(extra = {}) {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : '';
        const headers = { ...extra };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (typeof buildDeviceHeaders === 'function') {
            return buildDeviceHeaders(headers);
        }
        return headers;
    }

    function cacheSet(set) {
        if (!set || !set.id) return;
        try {
            sessionStorage.setItem('vstep_last_set_id', set.id);
            if (set.assignment?.id) {
                sessionStorage.setItem('vstep_last_assignment_id', set.assignment.id);
            }
            sessionStorage.setItem(`practice_set_cache_vstep_${set.id}`, JSON.stringify(set));
        } catch (error) {
            console.warn('Không thể cache buổi học VSTEP:', error);
        }
    }

    function formatDateShort(value) {
        if (!value) return '';
        const d = new Date(value);
        if (!Number.isFinite(d.getTime())) return '';
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    function formatDateTime(value) {
        if (!value) return '';
        const d = new Date(value);
        if (!Number.isFinite(d.getTime())) return '';
        return d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    function deadlineRemaining(dueAt) {
        if (!dueAt) return { isOverdue: false, label: 'Không giới hạn', tone: 'open' };
        const due = new Date(dueAt).getTime();
        if (!Number.isFinite(due)) return { isOverdue: false, label: 'Không giới hạn', tone: 'open' };
        const diff = due - Date.now();
        if (diff < 0) return { isOverdue: true, label: 'Đã quá deadline', tone: 'overdue' };
        const hours = Math.floor(diff / 3600000);
        if (hours < 24) return { isOverdue: false, label: `Còn ${hours} giờ`, tone: 'urgent' };
        const days = Math.floor(diff / 86400000);
        if (days < 3) return { isOverdue: false, label: `Còn ${days} ngày`, tone: 'urgent' };
        return { isOverdue: false, label: `Còn ${days} ngày`, tone: 'open' };
    }

    function sessionStatus(set, dueRemaining) {
        // Match result theo content_id hoặc session_number (theo class) hoặc assignment_id.
        // Shared blueprint: match result theo assignment_id (chính xác nhất),
        // content_id, hoặc band+session_number (HV nộp bài giống bài → đếm).
        const sessionNumber = set?.session_number || set?.data?.vstep_session_number;
        const setBand = set?.band || set?.data?.vstep_band;
        const submittedResult = state.myResults.find(r => {
            const md = r?.metadata || {};
            if (r.assignment_id && r.assignment_id === set?.assignment?.id) return true;
            if (r.content_id && r.content_id === set?.id) return true;
            const mdSession = Number(md.vstep_session_number);
            const mdBand = String(md.vstep_band || '').toUpperCase();
            if (Number.isFinite(mdSession) && sessionNumber && mdSession === Number(sessionNumber)
                && (!mdBand || !setBand || mdBand === String(setBand).toUpperCase())) return true;
            return false;
        });
        if (submittedResult) {
            return {
                key: 'done',
                label: submittedResult.metadata?.assignment_submitted_overdue ? 'Đã làm (trễ)' : 'Đã làm',
                tone: submittedResult.metadata?.assignment_submitted_overdue ? 'late-done' : 'done'
            };
        }
        if (dueRemaining.isOverdue) {
            return { key: 'overdue', label: 'Trễ deadline', tone: 'overdue' };
        }
        if (dueRemaining.tone === 'urgent') {
            return { key: 'urgent', label: 'Sắp tới hạn', tone: 'urgent' };
        }
        return { key: 'open', label: 'Đang mở', tone: 'open' };
    }

    function buildSessionCards() {
        const klass = state.classRecord;
        if (!klass) return [];
        const sessions = Array.isArray(klass.sessions) ? klass.sessions : [];
        // SHARED BLUEPRINT binding: content match theo band (lớp) + session_number.
        // Mọi lớp B1 dùng chung 18 content, mọi lớp B2 dùng chung 24 content.
        // Ưu tiên column DB (set.band/session_number), fallback data jsonb.
        const klassBand = String(klass.band || '').toUpperCase();
        const setsBySession = new Map();
        (state.sets || []).forEach(set => {
            const data = set.data || {};
            const setBand = String(set.band || data.vstep_band || '').toUpperCase();
            if (klassBand && setBand && setBand !== klassBand) return;
            const num = Number(set.session_number || data.vstep_session_number || set.assignment?.session_number);
            if (Number.isFinite(num) && num > 0) setsBySession.set(num, set);
        });

        return sessions.map((session) => {
            const num = Number(session.number);
            const set = setsBySession.get(num) || null;
            const due = set?.assignment?.due_at || session.deadline || null;
            const remaining = deadlineRemaining(due);
            const status = set ? sessionStatus(set, remaining) : { key: 'pending', label: 'Sắp mở', tone: 'pending' };
            return {
                number: num,
                dayName: session.day_name || '',
                date: session.date,
                deadline: due,
                remaining,
                status,
                set
            };
        });
    }

    function renderSessions() {
        if (!refs.grid) return;
        const cards = buildSessionCards();
        if (!cards.length) {
            refs.grid.innerHTML = '';
            setState(state.adminView
                ? 'Admin: chưa có lớp nào với 18/24 buổi. Tạo lớp B1/B2 ở admin để thấy grid buổi học.'
                : 'Lớp chưa có lịch học hoặc chưa tạo buổi nào.',
                'warning');
            return;
        }
        setState('', 'info');

        refs.grid.innerHTML = cards.map(card => {
            const set = card.set;
            const title = set?.title || 'Buổi học đang được chuẩn bị';
            const description = set?.description || (set ? '' : 'Admin sẽ gắn bài học cho buổi này.');
            const toneClass = `vstep-session-card-${card.status.tone}`;
            const disabled = !set;
            const ctaHref = set
                ? `/vstep_exam?set=${encodeURIComponent(set.id)}${set.assignment?.id ? `&assignment=${encodeURIComponent(set.assignment.id)}` : ''}`
                : '#';
            const ctaLabel = card.status.key === 'done' ? 'Xem lại / Làm thêm' : 'Vào học';

            return `
                <div class="col-sm-6 col-lg-4 col-xl-3">
                    <article class="vstep-session-card ${toneClass} h-100" data-session="${card.number}">
                        <div class="vstep-session-head">
                            <div>
                                <div class="vstep-session-num">Buổi ${card.number}</div>
                                <div class="vstep-session-day text-secondary small">
                                    ${card.dayName ? `${escapeHtml(card.dayName)} · ` : ''}${escapeHtml(formatDateShort(card.date) || '')}
                                </div>
                            </div>
                            <span class="vstep-session-status vstep-session-status-${card.status.tone}">
                                ${escapeHtml(card.status.label)}
                            </span>
                        </div>
                        <div class="vstep-session-body">
                            <h3 class="h6 mb-1">${escapeHtml(title)}</h3>
                            ${description ? `<p class="text-secondary small mb-2">${escapeHtml(description)}</p>` : ''}
                            <div class="vstep-session-meta small text-secondary">
                                <i class="bi bi-hourglass-split me-1"></i>${escapeHtml(card.remaining.label)}
                                ${card.deadline ? `<span class="d-block mt-1"><i class="bi bi-calendar2-check me-1"></i>Hạn: ${escapeHtml(formatDateTime(card.deadline))}</span>` : ''}
                            </div>
                        </div>
                        <div class="vstep-session-foot">
                            ${disabled
                                ? '<button type="button" class="btn btn-outline-secondary w-100" disabled><i class="bi bi-lock me-1"></i>Chưa mở</button>'
                                : `<a class="btn btn-primary w-100 vstep-start-link" href="${ctaHref}" data-set-id="${escapeHtml(set.id)}">${escapeHtml(ctaLabel)}</a>`
                            }
                        </div>
                    </article>
                </div>
            `;
        }).join('');

        refs.grid.querySelectorAll('.vstep-start-link').forEach(link => {
            link.addEventListener('click', event => {
                const set = state.sets.find(item => item.id === link.dataset.setId);
                if (!set?.id) return;
                event.preventDefault();
                cacheSet(set);
                const assignmentQuery = set.assignment?.id ? `&assignment=${encodeURIComponent(set.assignment.id)}` : '';
                window.location.href = `/vstep_exam?set=${encodeURIComponent(set.id)}${assignmentQuery}`;
            });
        });
    }

    async function loadClassInfo() {
        if (!refs.classInfo) return;
        try {
            const response = await fetch('/api/vstep/classes/my', {
                headers: authorizedHeaders()
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Không thể tải thông tin lớp VSTEP.');

            if (result.adminView) {
                state.adminView = true;
                // Admin: nếu có ít nhất 1 lớp, render lớp đầu tiên làm preview
                const klass = (result.classes || [])[0] || null;
                state.classRecord = klass;
                const classes = result.classes || [];
                refs.classInfo.innerHTML = `
                    <article class="vstep-class-summary-card">
                        <div>
                            <div class="small text-primary text-uppercase fw-bold">Chế độ admin</div>
                            <h2 class="h5 mb-1">${klass ? `Đang xem: ${escapeHtml(klass.title || 'Lớp VSTEP')}` : 'Chưa có lớp nào'}</h2>
                            <div class="text-secondary small">Tổng ${classes.length} lớp trong hệ thống. Admin thấy tất cả grid buổi.</div>
                        </div>
                    </article>
                `;
                return;
            }
            const classInfo = result.class;
            state.classRecord = classInfo || null;
            if (!classInfo) {
                refs.classInfo.innerHTML = '<div class="alert alert-warning mb-0">Tài khoản chưa được gán lớp VSTEP. Liên hệ admin.</div>';
                return;
            }
            refs.classInfo.innerHTML = `
                <article class="vstep-class-summary-card">
                    <div>
                        <div class="small text-primary text-uppercase fw-bold">Lớp của bạn</div>
                        <h2 class="h5 mb-1">${escapeHtml(classInfo.title || 'Lớp VSTEP')}</h2>
                        <div class="text-secondary small">${escapeHtml(classInfo.teacher_name || 'Chưa gán giáo viên')} · ${escapeHtml(classInfo.band || 'B1')} · Lịch ${escapeHtml(classInfo.schedule_type || '246')}</div>
                    </div>
                    <div class="vstep-class-summary-grid">
                        <div><strong>Khai giảng</strong><span>${escapeHtml(formatDateShort(classInfo.starts_at) || '-')}</span></div>
                        <div><strong>Kết thúc</strong><span>${escapeHtml(formatDateShort(classInfo.ends_at) || '-')}</span></div>
                        <div><strong>Tổng số buổi</strong><span>${escapeHtml(String(classInfo.num_sessions || (Array.isArray(classInfo.sessions) ? classInfo.sessions.length : 0)))}</span></div>
                        <div><strong>Giờ học</strong><span>${escapeHtml(classInfo.start_time || '-')}</span></div>
                    </div>
                </article>
            `;
        } catch (error) {
            refs.classInfo.innerHTML = `<div class="alert alert-danger mb-0">${escapeHtml(error.message)}</div>`;
        }
    }

    async function loadSets() {
        setState('Đang tải buổi học VSTEP...', 'info');
        refs.grid.innerHTML = '';
        try {
            const response = await fetch(`/api/vstep/contents/list?flow=${encodeURIComponent(FLOW)}&status=published`, {
                headers: authorizedHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Không thể tải danh sách buổi học VSTEP.');
            state.sets = (result.sets || []);
            renderSessions();
        } catch (error) {
            setState(error.message, 'danger');
        }
    }

    async function loadMyResults() {
        // Học viên: xem kết quả mình đã nộp để mark buổi "Đã làm".
        // Admin: skip (sẽ hiện grid trống state cho mọi card).
        try {
            const response = await fetch('/api/vstep/results/my-list', {
                headers: authorizedHeaders()
            });
            if (!response.ok) return; // không fatal, chỉ là không có badge "Đã làm"
            const result = await response.json().catch(() => ({}));
            state.myResults = Array.isArray(result.results) ? result.results : [];
        } catch {
            // ignore
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        refs.reload?.addEventListener('click', async () => {
            await loadClassInfo();
            await loadMyResults();
            await loadSets();
        });
        await loadClassInfo();
        await loadMyResults();
        await loadSets();
    });
})();
