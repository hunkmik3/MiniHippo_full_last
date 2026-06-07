(function () {
    'use strict';

    const refs = {
        flowFilter: document.getElementById('vstep-history-flow-filter'),
        statusFilter: document.getElementById('vstep-history-status-filter'),
        refreshBtn: document.getElementById('vstep-history-refresh-btn'),
        body: document.getElementById('vstep-history-body'),
        empty: document.getElementById('vstep-history-empty'),
        total: document.getElementById('vstep-history-total'),
        loading: document.getElementById('vstep-history-loading'),
        detail: document.getElementById('vstep-history-detail')
    };
    if (!refs.body) return;

    const state = { results: [] };

    function escapeHtml(value) {
        return String(value == null ? '' : value)
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

    function formatDateTime(value) {
        if (!value) return '—';
        const d = new Date(value);
        if (!Number.isFinite(d.getTime())) return '—';
        return d.toLocaleString('vi-VN');
    }

    function formatDuration(seconds) {
        if (seconds == null) return '—';
        const total = Math.max(0, Math.round(Number(seconds) || 0));
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}p ${String(s).padStart(2, '0')}s`;
    }

    function flowOf(result) {
        return result?.metadata?.vstep_flow || result?.flow || 'practice';
    }

    function sessionOf(result) {
        return result?.metadata?.vstep_session_number || '';
    }

    function isOverdueSubmission(result) {
        return Boolean(result?.metadata?.assignment_submitted_overdue);
    }

    function autoScoreText(result) {
        // Listening + Reading auto = total_score / max_score.
        const total = Number(result?.total_score || 0);
        const max = Number(result?.max_score || 0);
        if (!max) return '—';
        return `${total}/${max}`;
    }

    function manualScoreText(result) {
        // Writing + Speaking: manual_score = giáo viên chấm, có thể null.
        if (result?.manual_score == null || result.manual_score === '') {
            const md = result?.metadata || {};
            const hasWriting = Array.isArray(md.writing_answers) && md.writing_answers.length;
            const hasSpeaking = md.speaking_answers && Object.keys(md.speaking_answers).length;
            if (hasWriting || hasSpeaking) return '<span class="text-warning">Chờ chấm</span>';
            return '—';
        }
        return `${Number(result.manual_score)} điểm`;
    }

    function statusBadge(result) {
        if (isOverdueSubmission(result)) {
            return '<span class="vstep-history-flow vstep-history-status-late">Trễ deadline</span>';
        }
        return '<span class="vstep-history-flow vstep-history-status-on">Đúng hạn</span>';
    }

    function flowBadge(result) {
        const f = flowOf(result);
        if (f === 'lesson_exam') {
            return '<span class="vstep-history-flow vstep-history-flow-lesson">Học tập</span>';
        }
        return '<span class="vstep-history-flow vstep-history-flow-practice">Ôn thi</span>';
    }

    function applyFilters() {
        const flow = refs.flowFilter?.value || '';
        const status = refs.statusFilter?.value || '';
        return state.results.filter(r => {
            if (flow && flowOf(r) !== flow) return false;
            if (status === 'on-time' && isOverdueSubmission(r)) return false;
            if (status === 'late' && !isOverdueSubmission(r)) return false;
            return true;
        });
    }

    function render() {
        const rows = applyFilters();
        refs.total.textContent = String(rows.length);
        if (!rows.length) {
            refs.body.innerHTML = '';
            refs.empty.style.display = 'block';
            return;
        }
        refs.empty.style.display = 'none';

        refs.body.innerHTML = rows.map(result => {
            const md = result.metadata || {};
            const session = sessionOf(result);
            const title = result.content_title
                || md.vstep_set_title
                || md.assignment_title
                || 'VSTEP submission';
            return `
                <tr>
                    <td>${escapeHtml(formatDateTime(result.submitted_at))}</td>
                    <td>${flowBadge(result)}</td>
                    <td>${session ? `<strong>Buổi ${escapeHtml(session)}</strong>` : '—'}</td>
                    <td>${escapeHtml(title)}</td>
                    <td class="fw-semibold">${autoScoreText(result)}</td>
                    <td>${manualScoreText(result)}</td>
                    <td>${statusBadge(result)}</td>
                    <td>${escapeHtml(formatDuration(result.duration_seconds))}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-primary vstep-history-view-btn" data-result-id="${escapeHtml(result.id)}">
                            <i class="bi bi-eye me-1"></i>Xem
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        refs.body.querySelectorAll('.vstep-history-view-btn').forEach(btn => {
            btn.addEventListener('click', () => showDetail(btn.dataset.resultId));
        });
    }

    function showDetail(id) {
        const result = state.results.find(r => String(r.id) === String(id));
        if (!result || !refs.detail) return;
        const md = result.metadata || {};
        // Bỏ ảnh giám thị base64 + speaking recording urls nặng khỏi dump JSON.
        const dump = JSON.parse(JSON.stringify(result));
        if (dump.metadata?.proctor_photo) dump.metadata.proctor_photo = '[đã ẩn]';
        if (dump.metadata?.answers) dump.metadata.answers = '[xem chi tiết phía dưới]';
        const writingHtml = (md.writing_answers || []).map((w, i) => `
            <div class="mb-3">
                <strong>Writing Part ${i + 1}</strong>
                <div class="small text-muted mb-1">${escapeHtml(w.title || '')}</div>
                <div class="p-2 bg-white border rounded small" style="white-space:pre-wrap;">${escapeHtml(w.answer || '(trống)')}</div>
            </div>
        `).join('');
        const speakingHtml = Object.entries(md.speaking_answers || {}).map(([key, val]) => `
            <div class="mb-2">
                <strong>Speaking ${escapeHtml(key)}</strong>
                ${val?.recordingUrl ? `<audio controls src="${escapeHtml(val.recordingUrl)}" class="d-block mt-1" style="max-width:320px;"></audio>` : '<div class="small text-muted">Không có file ghi âm</div>'}
            </div>
        `).join('');

        refs.detail.style.display = 'block';
        refs.detail.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong><i class="bi bi-file-text me-1"></i>Chi tiết bài nộp #${escapeHtml(String(result.id).slice(0, 8))}</strong>
                <button type="button" class="btn btn-sm btn-outline-secondary" id="vstep-history-close-detail">Đóng</button>
            </div>
            ${result.manual_feedback ? `<div class="alert alert-info py-2 small mb-3"><strong>Giáo viên:</strong> ${escapeHtml(result.manual_feedback)}</div>` : ''}
            ${writingHtml ? `<div class="mb-3"><h6>Writing answers</h6>${writingHtml}</div>` : ''}
            ${speakingHtml ? `<div class="mb-3"><h6>Speaking recordings</h6>${speakingHtml}</div>` : ''}
            <details>
                <summary class="small text-muted">Metadata thô (debug)</summary>
                <pre>${escapeHtml(JSON.stringify(dump, null, 2))}</pre>
            </details>
        `;
        refs.detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        document.getElementById('vstep-history-close-detail')?.addEventListener('click', () => {
            refs.detail.style.display = 'none';
            refs.detail.innerHTML = '';
        });
    }

    async function loadResults() {
        if (refs.loading) refs.loading.style.display = 'inline-block';
        try {
            const response = await fetch('/api/vstep/results/my-list?limit=300', {
                headers: authorizedHeaders()
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'Không thể tải lịch sử VSTEP.');
            state.results = Array.isArray(data.results) ? data.results : [];
            // Sort mới nhất trước.
            state.results.sort((a, b) =>
                new Date(b.submitted_at || 0).getTime() - new Date(a.submitted_at || 0).getTime()
            );
            render();
        } catch (error) {
            refs.body.innerHTML = `<tr><td colspan="9" class="text-danger text-center py-3">${escapeHtml(error.message)}</td></tr>`;
            refs.empty.style.display = 'none';
        } finally {
            if (refs.loading) refs.loading.style.display = 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (typeof requireAuth === 'function') {
            const ok = await requireAuth();
            if (!ok) return;
        }
        refs.flowFilter?.addEventListener('change', render);
        refs.statusFilter?.addEventListener('change', render);
        refs.refreshBtn?.addEventListener('click', loadResults);
        await loadResults();
    });
})();
