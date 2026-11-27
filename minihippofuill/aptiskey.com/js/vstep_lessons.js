(function () {
    // ===========================================================
    // VSTEP – Lớp học (flow lesson_exam) — trang vstep_lessons.html
    // "Tiến độ học tập": giống trang chủ Ôn thi (vstep_bode) — thanh tiến độ,
    // thống kê Tổng bài / Chưa làm / Trễ deadline theo L&R và S&W, bảng bài học.
    // Bài học giao theo NHÓM HỌC (admin: Học viên → Nhóm học), mỗi bài 1 kỹ năng.
    // Lịch từng bài: Mở từ → Deadline → Mở đến (sau deadline vẫn làm được, hiện
    // "Trễ deadline"; để trống "Mở đến" = không đóng).
    // ===========================================================

    const FLOW = 'lesson_exam';
    const PROGRESS_SEGMENTS = 10;
    const SKILL_LABELS = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' };
    const SKILLS = Object.keys(SKILL_LABELS);

    const refs = {
        state: document.getElementById('vstepLessonState'),
        groupInfo: document.getElementById('vstepLessonGroupInfo'),
        reload: document.getElementById('reloadVstepListBtn'),
        progressBadge: document.getElementById('vstepProgressBadge'),
        progressCount: document.getElementById('vstepProgressCount'),
        progressTrack: document.getElementById('vstepProgressTrack'),
        statsLR: document.getElementById('vstepStatsLR'),
        statsSW: document.getElementById('vstepStatsSW'),
        body: document.getElementById('vstepLessonResultBody')
    };

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function authorizedHeaders(extra = {}) {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : '';
        const headers = { ...extra };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (typeof buildDeviceHeaders === 'function') return buildDeviceHeaders(headers);
        return headers;
    }

    async function getJson(url) {
        const response = await fetch(url, { headers: authorizedHeaders() });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Không thể tải dữ liệu Lớp học VSTEP.');
        return result;
    }

    function setState(message) {
        if (refs.state) refs.state.textContent = message || '';
    }

    function toTime(value) {
        const time = value ? Date.parse(value) : NaN;
        return Number.isFinite(time) ? time : null;
    }

    function formatDateTime(value) {
        const time = toTime(value);
        return time
            ? new Date(time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
            : '-';
    }

    function skillOf(set) {
        const explicit = String(set?.data?.vstep_practice_skill || '').toLowerCase();
        if (SKILLS.includes(explicit)) return explicit;
        const counts = set?.data?.__counts?.parts || {};
        const filled = SKILLS.filter(skill => Number(counts[skill]) > 0);
        return filled.length === 1 ? filled[0] : 'full_test';
    }

    function trackOf(skill) {
        if (skill === 'writing' || skill === 'speaking') return 'sw';
        if (skill === 'listening' || skill === 'reading') return 'lr';
        return 'full';
    }

    function orderOf(set) {
        const order = Number(set?.data?.onthi?.order);
        return Number.isFinite(order) && order > 0 ? order : null;
    }

    // Lịch của bài: nhóm học (group_assignment) hoặc bài giao riêng (assignment, luồng cũ).
    function scheduleOf(set) {
        const ga = set.group_assignment || null;
        if (ga) return { from: ga.available_from, due: ga.due_at, close: ga.close_at };
        const a = set.assignment || null;
        if (a) return { from: a.available_from, due: a.due_at, close: a.close_at || null };
        return { from: null, due: null, close: null };
    }

    function latestResultMap(results) {
        const map = new Map();
        (results || []).forEach(result => {
            const contentId = result.content_id || result.metadata?.vstep_content_id || result.metadata?.vstep_set_id;
            if (contentId && !map.has(contentId)) map.set(contentId, result);
        });
        return map;
    }

    function isManualSkill(skill, result) {
        if (skill === 'writing' || skill === 'speaking') return true;
        return Boolean(result) && !Number(result.max_score || 0);
    }

    function scoreHtml(row) {
        const { result, skill } = row;
        if (!result) return '<span class="text-secondary">-</span>';
        if (result.manual_score !== null && result.manual_score !== undefined) {
            return `${escapeHtml(String(Number(result.manual_score || 0)))} điểm`;
        }
        if (isManualSkill(skill, result)) return '<span class="text-secondary">Chờ chấm</span>';
        return escapeHtml(`${Number(result.total_score || 0)}/${Number(result.max_score || 0)}`);
    }

    function tabExitText(result) {
        const count = Number(result?.metadata?.tab_exit_count);
        if (!result || !Number.isFinite(count)) return '-';
        return `${count} lần`;
    }

    function examUrl(set, skill) {
        const params = new URLSearchParams({ set: set.id });
        if (SKILLS.includes(skill)) {
            params.set('skill', skill);
            params.set('mode', 'set');
        }
        if (set.assignment?.id) params.set('assignment', set.assignment.id);
        return `/vstep_exam?${params.toString()}`;
    }

    function buildRows(sets, results) {
        const now = Date.now();
        const resultMap = latestResultMap(results);
        return sets.map(set => {
            const skill = skillOf(set);
            const sched = scheduleOf(set);
            const opensAt = toTime(sched.from);
            const dueAt = toTime(sched.due);
            const closeAt = toTime(sched.close);
            const result = resultMap.get(set.id) || null;
            const done = Boolean(result);
            return {
                set,
                skill,
                track: trackOf(skill),
                order: orderOf(set),
                sched,
                result,
                done,
                notOpenYet: opensAt !== null && now < opensAt,
                closed: closeAt !== null && now > closeAt,
                overdue: !done && dueAt !== null && now > dueAt,
                lateDone: done && Boolean(result.metadata?.assignment_submitted_overdue)
            };
        }).sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)
            || (toTime(a.sched.due) ?? Infinity) - (toTime(b.sched.due) ?? Infinity)
            || String(a.set.title || '').localeCompare(String(b.set.title || ''), 'vi', { numeric: true }));
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
        return `<div class="vstep-stat-card"><span class="vstep-stat-label">${escapeHtml(label)}</span>`
            + `<strong class="vstep-stat-value${danger ? ' is-danger' : ''}">${escapeHtml(String(value))}</strong>`
            + '<span class="vstep-stat-unit">bài</span></div>';
    }

    // Chỉ Tổng bài / Chưa làm / Trễ deadline (không hiện "Chưa đạt" — feedback 13/11).
    function renderStats(rows) {
        const fill = (el, list) => {
            if (!el) return;
            el.innerHTML = [
                statCard('TỔNG BÀI', list.length, false),
                statCard('CHƯA LÀM', list.filter(r => !r.done).length, false),
                statCard('TRỄ DEADLINE', list.filter(r => r.overdue).length, true)
            ].join('');
        };
        // Bài cũ nhiều kỹ năng (full) tính vào L&R cho đủ tổng.
        fill(refs.statsLR, rows.filter(r => r.track !== 'sw'));
        fill(refs.statsSW, rows.filter(r => r.track === 'sw'));
    }

    function statusHtml(row) {
        if (row.notOpenYet) return '<span class="text-secondary">Chưa mở</span>';
        if (row.done) return row.lateDone ? 'Đã làm <span class="vstep-cell-danger small">(trễ)</span>' : 'Đã làm';
        if (row.overdue) return '<span class="vstep-cell-danger">Trễ deadline</span>';
        return '<span class="text-secondary">Chưa làm</span>';
    }

    function actionHtml(row) {
        if (row.notOpenYet) {
            return `<span class="text-secondary small">Mở lúc ${escapeHtml(formatDateTime(row.sched.from))}</span>`;
        }
        if (row.closed) return '<span class="text-secondary small">Đã đóng</span>';
        const label = row.done ? 'Làm lại' : 'Làm bài';
        const hint = row.sched.close && (row.overdue || row.done)
            ? `<div class="small text-secondary">Mở đến ${escapeHtml(formatDateTime(row.sched.close))}</div>`
            : '';
        return `<a class="vstep-start-link" href="${escapeHtml(examUrl(row.set, row.skill))}">${label}</a>${hint}`;
    }

    function renderTable(rows, emptyText) {
        if (!refs.body) return;
        if (!rows.length) {
            refs.body.innerHTML = `<tr><td colspan="8" class="text-center text-secondary py-3">${escapeHtml(emptyText)}</td></tr>`;
            return;
        }
        refs.body.innerHTML = rows.map((row, index) => `
            <tr>
                <td>${row.order || index + 1}</td>
                <td class="vstep-cell-title">${escapeHtml(row.set.title || 'Bài học VSTEP')}</td>
                <td>${escapeHtml(SKILL_LABELS[row.skill] || 'Nhiều kỹ năng')}</td>
                <td>${escapeHtml(formatDateTime(row.sched.due))}</td>
                <td>${statusHtml(row)}</td>
                <td>${scoreHtml(row)}</td>
                <td>${escapeHtml(tabExitText(row.result))}</td>
                <td>${actionHtml(row)}</td>
            </tr>
        `).join('');
    }

    function renderGroupInfo(group, adminView) {
        if (!refs.groupInfo) return;
        if (adminView) {
            refs.groupInfo.innerHTML = '<span class="badge text-bg-warning">Chế độ admin — xem trước các bài học published</span>';
            return;
        }
        refs.groupInfo.innerHTML = group
            ? `<span class="badge text-bg-light border">Nhóm học: ${escapeHtml(group.title || '')}${group.band ? ` · ${escapeHtml(group.band)}` : ''}</span>`
            : '';
    }

    async function load() {
        setState('Đang tải tiến độ, deadline và điểm đã nộp...');
        if (refs.body) {
            refs.body.innerHTML = '<tr><td colspan="8" class="text-center text-secondary py-3">Đang tải dữ liệu lớp học...</td></tr>';
        }
        try {
            const [list, mine] = await Promise.all([
                getJson(`/api/vstep/contents/list?flow=${FLOW}&status=published&view=summary`),
                getJson(`/api/vstep/results/my-list?flow=${FLOW}&limit=300&view=summary`).catch(() => ({ results: [] }))
            ]);
            const group = list.lophocGroup || null;
            const adminView = Boolean(list.adminView);
            renderGroupInfo(group, adminView);
            const rows = buildRows(list.sets || [], mine.results || []);
            renderProgress(rows.filter(r => r.done).length, rows.length);
            renderStats(rows);

            let emptyText = 'Chưa có bài học nào.';
            if (!adminView && !group) emptyText = 'Bạn chưa được thêm vào nhóm học. Vui lòng liên hệ giáo viên.';
            else if (group) emptyText = `Nhóm học "${group.title || ''}" chưa được giao bài nào. Vui lòng chờ giáo viên giao bài.`;
            renderTable(rows, emptyText);

            const overdue = rows.filter(r => r.overdue).length;
            if (!rows.length) setState(emptyText);
            else setState(overdue
                ? `Bạn đang có ${overdue} bài trễ deadline — vẫn làm được tới khi bài đóng.`
                : 'Theo dõi tiến độ, deadline và điểm của từng bài học.');
        } catch (error) {
            setState(error.message);
            if (refs.body) {
                refs.body.innerHTML = `<tr><td colspan="8" class="text-center text-danger py-3">${escapeHtml(error.message)}</td></tr>`;
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        refs.reload?.addEventListener('click', load);
        load();
    });
})();
