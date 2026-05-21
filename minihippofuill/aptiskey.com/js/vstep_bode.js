(function () {
    const flow = document.body?.dataset?.vstepFlow || 'practice';
    const flowLabels = {
        practice: {
            noun: 'đề VSTEP',
            empty: 'Chưa có đề ôn thi VSTEP published nào.',
            loading: 'Đang tải danh sách đề ôn thi VSTEP...',
            badge: 'VSTEP ôn thi',
            fallback: 'VSTEP Mock Test'
        },
        lesson_exam: {
            noun: 'nội dung học tập VSTEP',
            empty: 'Chưa có nội dung học tập VSTEP được giao.',
            loading: 'Đang tải phân khu học tập VSTEP...',
            badge: 'VSTEP học tập',
            fallback: 'VSTEP Learning Task'
        }
    };
    const copy = flowLabels[flow] || flowLabels.practice;
    const refs = {
        state: document.getElementById('vstepListState'),
        grid: document.getElementById('vstepListGrid'),
        reload: document.getElementById('reloadVstepListBtn'),
        classInfo: document.getElementById('vstepClassInfo')
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
            console.warn('Không thể cache đề VSTEP:', error);
        }
    }

    function assignmentInfo(set) {
        const assignment = set.assignment || {};
        if (!assignment.id) return '';
        const dueAt = assignment.due_at ? new Date(assignment.due_at) : null;
        const now = Date.now();
        const dueMs = dueAt && Number.isFinite(dueAt.getTime()) ? dueAt.getTime() : null;
        const isOverdue = dueMs ? dueMs < now : false;
        const dueText = dueMs ? dueAt.toLocaleString('vi-VN') : 'Không giới hạn';
        const remainingText = dueMs
            ? Math.max(0, Math.ceil((dueMs - now) / 86400000))
            : null;
        return `
            <div class="vstep-assignment-meta mt-2">
                <span><i class="bi bi-calendar2-check me-1"></i>Hạn: ${escapeHtml(dueText)}</span>
                <span class="${isOverdue ? 'text-warning' : ''}">
                    <i class="bi bi-hourglass-split me-1"></i>${isOverdue ? 'Đã quá hạn' : remainingText === null ? 'Đang mở' : `Còn ${remainingText} ngày`}
                </span>
            </div>
        `;
    }

    function formatJsonSummary(value) {
        if (!value) return '-';
        if (Array.isArray(value) && !value.length) return '-';
        if (typeof value === 'string') return value || '-';
        return JSON.stringify(value);
    }

    async function loadClassInfo() {
        if (flow !== 'lesson_exam' || !refs.classInfo) return;
        try {
            const response = await fetch('/api/vstep/classes/my', {
                headers: authorizedHeaders()
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Không thể tải thông tin lớp VSTEP.');
            if (result.adminView) {
                const classes = result.classes || [];
                const classmates = result.classmates || [];
                refs.classInfo.innerHTML = `
                    <article class="vstep-class-summary-card">
                        <div>
                            <div class="small text-primary text-uppercase fw-bold">Chế độ admin</div>
                            <h2 class="h5 mb-1">Admin đang xem toàn bộ Học tập VSTEP</h2>
                            <div class="text-secondary small">Tài khoản admin không cần gán lớp hoặc cấp quyền VSTEP riêng.</div>
                        </div>
                        <div class="vstep-class-summary-grid">
                            <div><strong>Lớp VSTEP</strong><span>${escapeHtml(String(classes.length))}</span></div>
                            <div><strong>Học viên VSTEP</strong><span>${escapeHtml(String(classmates.length))}</span></div>
                            <div><strong>Quyền xem</strong><span>Toàn bộ nội dung published</span></div>
                            <div><strong>Phạm vi</strong><span>Ôn thi + học tập</span></div>
                        </div>
                    </article>
                `;
                return;
            }
            const classInfo = result.class;
            if (!classInfo) {
                refs.classInfo.innerHTML = '<div class="alert alert-warning mb-0">Tài khoản chưa được gán lớp VSTEP.</div>';
                return;
            }
            const classmates = result.classmates || [];
            refs.classInfo.innerHTML = `
                <article class="vstep-class-summary-card">
                    <div>
                        <div class="small text-primary text-uppercase fw-bold">Thông tin lớp học</div>
                        <h2 class="h5 mb-1">${escapeHtml(classInfo.title || 'Lớp VSTEP')}</h2>
                        <div class="text-secondary small">${escapeHtml(classInfo.teacher_name || 'Chưa gán giáo viên')} · ${escapeHtml(classInfo.band || 'B1')}</div>
                    </div>
                    <div class="vstep-class-summary-grid">
                        <div><strong>Bắt đầu</strong><span>${escapeHtml(classInfo.starts_at ? new Date(classInfo.starts_at).toLocaleString('vi-VN') : '-')}</span></div>
                        <div><strong>Kết thúc</strong><span>${escapeHtml(classInfo.ends_at ? new Date(classInfo.ends_at).toLocaleString('vi-VN') : '-')}</span></div>
                        <div><strong>Thời khóa biểu</strong><span>${escapeHtml(formatJsonSummary(classInfo.schedule))}</span></div>
                        <div><strong>Ngày nghỉ</strong><span>${escapeHtml(formatJsonSummary(classInfo.holidays))}</span></div>
                    </div>
                    <div class="vstep-classmate-row">
                        <strong>Học viên:</strong>
                        <span>${escapeHtml(classmates.map(item => item.full_name || item.account_code).filter(Boolean).slice(0, 12).join(', ') || '-')}</span>
                    </div>
                </article>
            `;
        } catch (error) {
            refs.classInfo.innerHTML = `<div class="alert alert-danger mb-0">${escapeHtml(error.message)}</div>`;
        }
    }

    function renderSets(sets) {
        if (!sets.length) {
            refs.grid.innerHTML = '';
            setState(copy.empty, 'warning');
            return;
        }

        setState('', 'info');
        refs.grid.innerHTML = sets.map(set => {
            const data = set.data || {};
            const durations = data.durations || {};
            const total = Number(durations.listening || 0) + Number(durations.reading || 0) + Number(durations.writing || 0) + Number(durations.speaking || 0);
            const dateText = set.created_at ? new Date(set.created_at).toLocaleDateString('vi-VN') : '';
            const assignmentQuery = set.assignment?.id ? `&assignment=${encodeURIComponent(set.assignment.id)}` : '';
            return `
                <div class="col-sm-6 col-lg-4 col-xl-3">
                    <article class="vstep-list-card h-100">
                        <div>
                            <div class="small text-white-50 text-uppercase fw-bold">${escapeHtml(copy.badge)}</div>
                            <h2 class="h5 mt-2 mb-2">${escapeHtml(set.title || copy.fallback)}</h2>
                            <p class="small text-white-50 mb-0">${escapeHtml(set.description || 'Listening, Reading, Writing, Speaking')}</p>
                            ${assignmentInfo(set)}
                        </div>
                        <div>
                            <div class="small mb-3">
                                <i class="bi bi-clock me-1"></i>${total || set.duration_minutes || 177} phút
                                <span class="ms-2"><i class="bi bi-grid-3x3-gap me-1"></i>4 kỹ năng</span>
                                ${dateText ? `<span class="d-block text-white-50 mt-1"><i class="bi bi-calendar3 me-1"></i>${escapeHtml(dateText)}</span>` : ''}
                            </div>
                            <a class="btn btn-light text-primary fw-bold w-100 vstep-start-link" href="/vstep_exam?set=${encodeURIComponent(set.id)}${assignmentQuery}" data-id="${escapeHtml(set.id)}">
                                Vào thi
                            </a>
                        </div>
                    </article>
                </div>
            `;
        }).join('');

        refs.grid.querySelectorAll('.vstep-start-link').forEach(link => {
            link.addEventListener('click', event => {
                const set = sets.find(item => item.id === link.dataset.id);
                if (!set?.id) return;
                event.preventDefault();
                cacheSet(set);
                const assignmentQuery = set.assignment?.id ? `&assignment=${encodeURIComponent(set.assignment.id)}` : '';
                window.location.href = `/vstep_exam?set=${encodeURIComponent(set.id)}${assignmentQuery}`;
            });
        });
    }

    async function loadSets() {
        setState(copy.loading, 'info');
        refs.grid.innerHTML = '';
        try {
            const response = await fetch(`/api/vstep/contents/list?flow=${encodeURIComponent(flow)}&status=published`, {
                headers: authorizedHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || `Không thể tải danh sách ${copy.noun}.`);
            const sets = (result.sets || [])
                .filter(set => !set.data?.vstep_practice_skill || set.data.vstep_practice_skill === 'full_test')
                .sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true }));
            renderSets(sets);
        } catch (error) {
            setState(error.message, 'danger');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        refs.reload?.addEventListener('click', loadSets);
        loadClassInfo();
        loadSets();
    });
})();
