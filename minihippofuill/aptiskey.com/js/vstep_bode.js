(function () {
    // ===========================================================
    // VSTEP – Ôn thi (practice flow) — trang vstep_bode.html
    // và vstep_full_test.html dùng chung file này. Sau khi tách:
    // KHÔNG còn xử lý flow=lesson_exam ở đây nữa; phần Học tập đã
    // chuyển sang js/vstep_lessons.js riêng biệt.
    // ===========================================================

    const FLOW = 'practice';
    const copy = {
        noun: 'đề VSTEP',
        empty: 'Chưa có đề ôn thi VSTEP published nào.',
        loading: 'Đang tải danh sách đề ôn thi VSTEP...',
        badge: 'VSTEP ôn thi',
        fallback: 'VSTEP Mock Test'
    };
	    const refs = {
	        state: document.getElementById('vstepListState'),
	        grid: document.getElementById('vstepListGrid'),
	        reload: document.getElementById('reloadVstepListBtn'),
	        dashboardState: document.getElementById('vstepPracticeAccessState'),
	        summaryGrid: document.getElementById('vstepPracticeSummaryGrid'),
	        resultBody: document.getElementById('vstepPracticeResultBody')
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

	    function setDashboardState(message) {
	        if (refs.dashboardState) refs.dashboardState.textContent = message || '';
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
	            sessionStorage.setItem(`practice_set_cache_vstep_${set.id}`, JSON.stringify(set));
        } catch (error) {
            console.warn('Không thể cache đề VSTEP:', error);
	        }
	    }

	    function onthiMeta(set) {
	        const data = set?.data || {};
	        return data.onthi && typeof data.onthi === 'object' ? data.onthi : {};
	    }

	    function parseTime(value) {
	        if (!value) return null;
	        const time = new Date(value).getTime();
	        return Number.isFinite(time) ? time : null;
	    }

	    function formatDateTime(value) {
	        const time = parseTime(value);
	        return time ? new Date(time).toLocaleString('vi-VN') : '-';
	    }

	    function contentSkill(set) {
	        return set?.data?.vstep_practice_skill || 'full_test';
	    }

	    function deriveTrack(set) {
	        const meta = onthiMeta(set);
	        if (meta.track) return String(meta.track).toLowerCase();
	        const skill = contentSkill(set);
	        if (skill === 'writing' || skill === 'speaking') return 'sw';
	        if (skill === 'full_test') return 'full';
	        return 'lr';
	    }

	    function trackLabel(track) {
	        if (track === 'sw') return 'S&W';
	        if (track === 'full') return 'Full';
	        return 'L&R';
	    }

	    function sortPracticeSets(sets) {
	        const trackRank = { lr: 1, sw: 2, full: 3 };
	        return sets.slice().sort((a, b) => {
	            const aMeta = onthiMeta(a);
	            const bMeta = onthiMeta(b);
	            const aTrack = deriveTrack(a);
	            const bTrack = deriveTrack(b);
	            const byTrack = (trackRank[aTrack] || 9) - (trackRank[bTrack] || 9);
	            if (byTrack) return byTrack;
	            const byOrder = (Number(aMeta.order) || 999) - (Number(bMeta.order) || 999);
	            if (byOrder) return byOrder;
	            return String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true });
	        });
	    }

	    function accessStatus(set) {
	        const meta = onthiMeta(set);
	        const now = Date.now();
	        const accessFrom = parseTime(meta.accessFrom);
	        const accessUntil = parseTime(meta.accessUntil || meta.deadlineAt);
	        if (accessFrom && now < accessFrom) return { open: false, label: 'Chưa mở', className: 'is-muted' };
	        if (accessUntil && now > accessUntil) return { open: false, label: 'Đã đóng', className: 'is-locked' };
	        return { open: true, label: 'Đang mở', className: 'is-open' };
	    }

	    function dueStatus(set, done) {
	        const meta = onthiMeta(set);
	        const deadline = parseTime(meta.deadlineAt || meta.accessUntil);
	        if (!deadline || done) return { dueSoon: false, overdue: false };
	        const remaining = deadline - Date.now();
	        return {
	            dueSoon: remaining > 0 && remaining <= (Number(meta.notifyBeforeHours || 24) * 60 * 60 * 1000),
	            overdue: remaining < 0
	        };
	    }

	    function latestResultMap(results) {
	        const map = new Map();
	        (results || []).forEach(result => {
	            const contentId = result.content_id || result.metadata?.vstep_content_id || result.metadata?.vstep_set_id;
	            if (!contentId || map.has(contentId)) return;
	            map.set(contentId, result);
	        });
	        return map;
	    }

	    function scoreText(result) {
	        if (!result) return '-';
	        if (result.manual_score !== null && result.manual_score !== undefined) {
	            return `${Number(result.manual_score || 0)} điểm`;
	        }
	        const total = Number(result.total_score || 0);
	        const max = Number(result.max_score || 0);
	        return max ? `${total}/${max}` : 'Đã nộp';
	    }

	    function examUrl(set) {
	        const skill = contentSkill(set);
	        if (skill && skill !== 'full_test') {
	            return `/vstep_exam?set=${encodeURIComponent(set.id)}&skill=${encodeURIComponent(skill)}&mode=set`;
	        }
	        return `/vstep_exam?set=${encodeURIComponent(set.id)}`;
	    }

	    function renderDashboard(sets, results) {
	        if (!refs.resultBody) return;
	        const ordered = sortPracticeSets(sets);
	        const resultMap = latestResultMap(results);
	        const openCount = ordered.filter(set => accessStatus(set).open).length;
	        const doneCount = ordered.filter(set => resultMap.has(set.id)).length;
	        const dueSoonCount = ordered.filter(set => dueStatus(set, resultMap.has(set.id)).dueSoon).length;

	        if (refs.summaryGrid) {
	            refs.summaryGrid.innerHTML = `
	                <div><strong>${openCount}</strong><span>Đề đang mở</span></div>
	                <div><strong>${doneCount}</strong><span>Đã hoàn thành</span></div>
	                <div><strong>${dueSoonCount}</strong><span>Gần deadline</span></div>
	            `;
	        }

	        if (!ordered.length) {
	            refs.resultBody.innerHTML = '<tr><td colspan="6" class="text-center text-secondary py-3">Chưa có đề ôn thi published.</td></tr>';
	            setDashboardState('Chưa có lịch ôn thi đang được cấu hình.');
	            return;
	        }

	        setDashboardState(dueSoonCount
	            ? `Có ${dueSoonCount} bài sắp hết deadline, bạn nên hoàn thành trong hôm nay.`
	            : 'Theo dõi điểm, deadline và trạng thái hoàn thành của từng bài ôn thi.');

	        refs.resultBody.innerHTML = ordered.map(set => {
	            const meta = onthiMeta(set);
	            const result = resultMap.get(set.id);
	            const done = Boolean(result);
	            const access = accessStatus(set);
	            const due = dueStatus(set, done);
	            const track = deriveTrack(set);
	            const label = `${trackLabel(track)}${meta.order ? ` ${meta.order}` : ''}`;
	            const statusClass = done ? 'success' : due.overdue ? 'danger' : due.dueSoon ? 'warning' : access.open ? 'primary' : 'secondary';
	            const statusText = done ? 'Đã làm' : due.overdue ? 'Quá hạn' : due.dueSoon ? 'Sắp hết hạn' : access.label;
	            const action = access.open
	                ? `<a class="btn btn-sm btn-primary vstep-dashboard-start" href="${escapeHtml(examUrl(set))}" data-id="${escapeHtml(set.id)}">${done ? 'Làm lại' : 'Làm bài'}</a>`
	                : `<span class="text-secondary small">${escapeHtml(access.label)}</span>`;
	            return `
	                <tr>
	                    <td>
	                        <div class="fw-bold">${escapeHtml(set.title || copy.fallback)}</div>
	                        <div class="small text-secondary">${escapeHtml(set.description || '')}</div>
	                    </td>
	                    <td><span class="vstep-dashboard-chip">${escapeHtml(label)}</span></td>
	                    <td>${escapeHtml(formatDateTime(meta.deadlineAt || meta.accessUntil))}</td>
	                    <td><span class="badge text-bg-${statusClass}">${escapeHtml(statusText)}</span></td>
	                    <td>${escapeHtml(scoreText(result))}</td>
	                    <td class="text-end">${action}</td>
	                </tr>
	            `;
	        }).join('');

	        refs.resultBody.querySelectorAll('.vstep-dashboard-start').forEach(link => {
	            link.addEventListener('click', event => {
	                const set = ordered.find(item => item.id === link.dataset.id);
	                if (!set?.id) return;
	                event.preventDefault();
	                cacheSet(set);
	                window.location.href = link.getAttribute('href');
	            });
	        });
	    }

	    function renderSets(sets) {
	        if (!refs.grid) return;
	        if (!sets.length) {
	            refs.grid.innerHTML = '';
	            setState(copy.empty, 'warning');
            return;
        }

        setState('', 'info');
        refs.grid.innerHTML = sets.map(set => {
            const data = set.data || {};
            const durations = data.durations || {};
	            const total = Number(durations.listening || 0)
	                + Number(durations.reading || 0)
	                + Number(durations.writing || 0)
	                + Number(durations.speaking || 0);
	            const dateText = set.created_at ? new Date(set.created_at).toLocaleDateString('vi-VN') : '';
	            const meta = onthiMeta(set);
	            const access = accessStatus(set);
	            const scheduleText = [
	                trackLabel(deriveTrack(set)),
	                meta.order ? `#${meta.order}` : '',
	                meta.deadlineAt ? `Deadline ${formatDateTime(meta.deadlineAt)}` : ''
	            ].filter(Boolean).join(' · ');
	            return `
	                <div class="col-sm-6 col-lg-4 col-xl-3">
	                    <article class="vstep-list-card h-100">
                        <div>
                            <div class="small text-white-50 text-uppercase fw-bold">${escapeHtml(copy.badge)}</div>
                            <h2 class="h5 mt-2 mb-2">${escapeHtml(set.title || copy.fallback)}</h2>
                            <p class="small text-white-50 mb-0">${escapeHtml(set.description || 'Listening, Reading, Writing, Speaking')}</p>
                        </div>
                        <div>
	                            <div class="small mb-3">
	                                <i class="bi bi-clock me-1"></i>${total || set.duration_minutes || 177} phút
	                                <span class="ms-2"><i class="bi bi-grid-3x3-gap me-1"></i>4 kỹ năng</span>
	                                ${dateText ? `<span class="d-block text-white-50 mt-1"><i class="bi bi-calendar3 me-1"></i>${escapeHtml(dateText)}</span>` : ''}
	                                ${scheduleText ? `<span class="d-block text-white-50 mt-1"><i class="bi bi-calendar2-check me-1"></i>${escapeHtml(scheduleText)}</span>` : ''}
	                            </div>
	                            ${access.open
	                                ? `<a class="btn btn-light text-primary fw-bold w-100 vstep-start-link" href="/vstep_exam?set=${encodeURIComponent(set.id)}" data-id="${escapeHtml(set.id)}">Vào thi</a>`
	                                : `<button type="button" class="btn btn-light text-secondary fw-bold w-100" disabled>${escapeHtml(access.label)}</button>`}
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
                window.location.href = `/vstep_exam?set=${encodeURIComponent(set.id)}`;
            });
        });
    }

	    async function loadSets() {
	        setState(copy.loading, 'info');
	        setDashboardState('Đang tải tiến độ, deadline và điểm đã nộp...');
	        if (refs.grid) refs.grid.innerHTML = '';
	        if (refs.resultBody) {
	            refs.resultBody.innerHTML = '<tr><td colspan="6" class="text-center text-secondary py-3">Đang tải dữ liệu ôn thi...</td></tr>';
	        }
	        try {
	            const response = await fetch(`/api/vstep/contents/list?flow=${encodeURIComponent(FLOW)}&status=published`, {
	                headers: authorizedHeaders()
	            });
	            const result = await response.json();
	            if (!response.ok) throw new Error(result.error || `Không thể tải danh sách ${copy.noun}.`);
	            const allSets = sortPracticeSets(result.sets || []);
	            let results = [];
	            if (refs.resultBody) {
	                const resultsResponse = await fetch('/api/vstep/results/my-list?flow=practice&limit=300', {
	                    headers: authorizedHeaders()
	                });
	                const resultsPayload = await resultsResponse.json().catch(() => ({}));
	                if (resultsResponse.ok) results = resultsPayload.results || [];
	            }
	            renderDashboard(allSets, results);
	            const sets = allSets
	                .filter(set => !set.data?.vstep_practice_skill || set.data.vstep_practice_skill === 'full_test')
	                .sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true }));
	            renderSets(sets);
	        } catch (error) {
	            setState(error.message, 'danger');
	            setDashboardState(error.message);
	            if (refs.resultBody) {
	                refs.resultBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-3">${escapeHtml(error.message)}</td></tr>`;
	            }
	        }
	    }

    document.addEventListener('DOMContentLoaded', () => {
        refs.reload?.addEventListener('click', loadSets);
        loadSets();
    });
})();
