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
	        resultBody: document.getElementById('vstepPracticeResultBody'),
	        progressBadge: document.getElementById('vstepProgressBadge'),
	        progressCount: document.getElementById('vstepProgressCount'),
	        progressTrack: document.getElementById('vstepProgressTrack'),
	        statsLR: document.getElementById('vstepStatsLR'),
	        statsSW: document.getElementById('vstepStatsSW'),
	        switchLessons: document.getElementById('vstepSwitchToLessons')
	    };

	    // Ngưỡng ĐẠT theo yêu cầu trung tâm: Listening đúng >= 14 câu, Reading >= 16 câu.
	    // Dưới ngưỡng => tính vào "CHƯA ĐẠT" và điểm hiển thị màu đỏ.
	    // LƯU Ý: thang điểm thực tế đang là Listening /35 và Reading /40.
	    // Muốn đổi sang quy đổi theo tỉ lệ thì chỉ cần sửa 2 số dưới đây.
	    const PASS_MIN_CORRECT = { listening: 14, reading: 16 };
	    const PROGRESS_SEGMENTS = 10;

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
	        // KHÔNG cache bộ đề tổng hợp: bản list chưa gộp 4 kỹ năng, cache lại sẽ
	        // khiến trang thi hiển thị rỗng. Trang thi sẽ gọi get.js để gộp.
	        if (set.data && set.data.combined_refs) {
	            try { sessionStorage.setItem('vstep_last_set_id', set.id); } catch (_) {}
	            return;
	        }
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

	    function skillOf(set) {
	        return String(contentSkill(set) || '').toLowerCase();
	    }

	    // S&W chấm tay (max_score = 0) → chỉ hiện "đã nộp", không có ngưỡng đạt.
	    function isManualScored(set, result) {
	        const skill = skillOf(set);
	        if (skill === 'writing' || skill === 'speaking') return true;
	        return Boolean(result) && !Number(result.max_score || 0);
	    }

	    // Chưa đạt: chỉ áp dụng cho Listening/Reading đã làm và đúng dưới ngưỡng.
	    function isBelowPass(set, result) {
	        if (!result || isManualScored(set, result)) return false;
	        const min = PASS_MIN_CORRECT[skillOf(set)];
	        if (!min) return false;
	        return Number(result.total_score || 0) < min;
	    }

	    function tabExitText(result) {
	        const count = Number(result?.metadata?.tab_exit_count);
	        if (!result || !Number.isFinite(count)) return '-';
	        return count > 0 ? `${count} lần` : '0 lần';
	    }

	    function renderProgress(doneCount, totalCount) {
	        const percent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
	        if (refs.progressBadge) refs.progressBadge.textContent = `${percent}%`;
	        if (refs.progressCount) refs.progressCount.textContent = `${doneCount}/${totalCount} bài`;
	        if (refs.progressTrack) {
	            const filled = Math.round((percent / 100) * PROGRESS_SEGMENTS);
	            refs.progressTrack.innerHTML = Array.from({ length: PROGRESS_SEGMENTS })
	                .map((_, i) => `<span class="vstep-progress-cell${i < filled ? ' is-filled' : ''}"></span>`)
	                .join('');
	        }
	    }

	    function statCard(label, value, danger) {
	        return `<div class="vstep-stat-card"><span class="vstep-stat-label">${escapeHtml(label)}</span>` +
	            `<strong class="vstep-stat-value${danger ? ' is-danger' : ''}">${escapeHtml(String(value))}</strong>` +
	            `<span class="vstep-stat-unit">đề</span></div>`;
	    }

	    function renderStats(rows) {
	        const pick = track => rows.filter(row => row.track === track);
	        const lr = pick('lr');
	        const sw = pick('sw');
	        if (refs.statsLR) {
	            refs.statsLR.innerHTML = [
	                statCard('TỔNG BÀI', lr.length, false),
	                statCard('CHƯA LÀM', lr.filter(r => !r.done).length, false),
	                statCard('CHƯA ĐẠT', lr.filter(r => r.belowPass).length, true),
	                statCard('TRỄ DEADLINE', lr.filter(r => r.overdue).length, true)
	            ].join('');
	        }
	        if (refs.statsSW) {
	            refs.statsSW.innerHTML = [
	                statCard('TỔNG BÀI', sw.length, false),
	                statCard('CHƯA LÀM', sw.filter(r => !r.done).length, false),
	                statCard('TRỄ DEADLINE', sw.filter(r => r.overdue).length, true)
	            ].join('');
	        }
	    }

	    // Sổ danh sách bộ đề theo từng kỹ năng ở sidebar (mũi tên bấm để sổ).
	    function renderSidebarSets(sets) {
	        ['listening', 'reading', 'writing', 'speaking'].forEach(skill => {
	            const holder = document.getElementById(`navSets${skill.charAt(0).toUpperCase()}${skill.slice(1)}`);
	            if (!holder) return;
	            const items = sortPracticeSets(sets.filter(set => skillOf(set) === skill));
	            const all = `<li class="nav-item"><a href="vstep_skill?skill=${skill}&mode=set" class="nav-link"><i class="nav-icon bi bi-stack"></i><p>Tất cả bộ đề</p></a></li>`;
	            holder.innerHTML = all + items.map(set => `
	                <li class="nav-item">
	                    <a href="${escapeHtml(examUrl(set))}" class="nav-link vstep-nav-set" data-id="${escapeHtml(set.id)}">
	                        <i class="nav-icon bi bi-dot"></i><p>${escapeHtml(set.title || copy.fallback)}</p>
	                    </a>
	                </li>
	            `).join('');
	            holder.querySelectorAll('.vstep-nav-set').forEach(link => {
	                link.addEventListener('click', event => {
	                    const set = sets.find(item => item.id === link.dataset.id);
	                    if (!set?.id) return;
	                    event.preventDefault();
	                    cacheSet(set);
	                    window.location.href = link.getAttribute('href');
	                });
	            });
	        });
	    }

	    function renderDashboard(sets, results) {
	        if (!refs.resultBody) return;
	        const ordered = sortPracticeSets(sets);
	        const resultMap = latestResultMap(results);

	        const rows = ordered.map(set => {
	            const meta = onthiMeta(set);
	            const result = resultMap.get(set.id) || null;
	            const done = Boolean(result);
	            return {
	                set,
	                meta,
	                result,
	                done,
	                track: deriveTrack(set),
	                access: accessStatus(set),
	                overdue: dueStatus(set, done).overdue,
	                dueSoon: dueStatus(set, done).dueSoon,
	                belowPass: isBelowPass(set, result)
	            };
	        });

	        const doneCount = rows.filter(row => row.done).length;
	        renderProgress(doneCount, rows.length);
	        renderStats(rows);
	        renderSidebarSets(sets);

	        if (!rows.length) {
	            refs.resultBody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-3">Chưa có đề ôn thi published.</td></tr>';
	            setDashboardState('Chưa có lịch ôn thi đang được cấu hình.');
	            return;
	        }

	        const overdueCount = rows.filter(row => row.overdue).length;
	        setDashboardState(overdueCount
	            ? `Bạn đang có ${overdueCount} bài trễ deadline.`
	            : 'Theo dõi tiến độ, deadline và điểm của từng bài ôn thi.');

	        refs.resultBody.innerHTML = rows.map((row, index) => {
	            const { set, meta, result, done, access, overdue } = row;
	            const statusHtml = overdue
	                ? '<span class="vstep-cell-danger">Trễ Deadline</span>'
	                : done ? 'Đã làm' : '<span class="text-secondary">Chưa làm</span>';

	            let scoreHtml = '<span class="text-secondary">-</span>';
	            if (done) {
	                if (isManualScored(set, result)) {
	                    scoreHtml = 'đã nộp';
	                } else {
	                    const text = `${Number(result.total_score || 0)}/${Number(result.max_score || 0)}`;
	                    scoreHtml = row.belowPass
	                        ? `<span class="vstep-cell-danger">${escapeHtml(text)}</span>`
	                        : escapeHtml(text);
	                }
	            }

	            const action = access.open
	                ? `<a class="vstep-start-link" href="${escapeHtml(examUrl(set))}" data-id="${escapeHtml(set.id)}">${done ? 'Làm lại' : 'Làm bài'}</a>`
	                : `<span class="text-secondary small">${escapeHtml(access.label)}</span>`;

	            return `
	                <tr>
	                    <td>${Number(meta.order) || index + 1}</td>
	                    <td class="vstep-cell-title">${escapeHtml(set.title || copy.fallback)}</td>
	                    <td>${escapeHtml(formatDateTime(meta.deadlineAt || meta.accessUntil))}</td>
	                    <td>${statusHtml}</td>
	                    <td>${scoreHtml}</td>
	                    <td>${escapeHtml(tabExitText(result))}</td>
	                    <td>${action}</td>
	                </tr>
	            `;
	        }).join('');

	        refs.resultBody.querySelectorAll('.vstep-start-link').forEach(link => {
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
	                .filter(set => {
                    // Trang Bộ đề tổng hợp (full_test) CHỈ hiện bộ admin ghép (combined_refs);
                    // ẩn các đề mock_test demo/seed cũ cho đỡ rối.
                    if (/full_test/i.test(window.location.pathname || '')) return Boolean(set.data && set.data.combined_refs);
                    return !set.data?.vstep_practice_skill || set.data.vstep_practice_skill === 'full_test';
                })
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

    // Nút chuyển sang khu Học tập VSTEP: CHỈ hiện với tài khoản được cấp cả hai
    // khu. HV chỉ có ôn thi vẫn không thấy (đúng phân quyền hiện tại, không nới
    // quyền cho ai).
    function setupSwitchLink() {
        if (!refs.switchLessons) return;
        const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        const canBoth = typeof window.vstepHasBothPrograms === 'function'
            && window.vstepHasBothPrograms(user);
        refs.switchLessons.style.display = canBoth ? '' : 'none';
    }

    document.addEventListener('DOMContentLoaded', () => {
        refs.reload?.addEventListener('click', loadSets);
        setupSwitchLink();
        loadSets();
    });
})();
