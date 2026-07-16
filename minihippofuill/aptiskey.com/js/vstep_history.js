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

    // ===== AI grading (clone LexiBot): diff sửa lỗi inline + band + nhận xét =====
    // diffText dùng marker {-sai-}{+đúng+} từ AI → render <del> đỏ gạch / <ins> xanh.
    function renderDiffText(diffText) {
        const escaped = escapeHtml(diffText);
        return escaped
            .replace(/\{-([\s\S]*?)-\}/g, '<del class="vstep-ai-del">$1</del>')
            .replace(/\{\+([\s\S]*?)\+\}/g, '<ins class="vstep-ai-ins">$1</ins>')
            .replace(/\r?\n/g, '<br>');
    }


    function renderAiGradingBlock(grading, options = {}) {
        if (!grading) return '';
        const correctionsHtml = (grading.corrections || []).length
            ? `<details class="mt-2">
                <summary class="small fw-semibold">Danh sách lỗi & giải thích (${grading.corrections.length})</summary>
                ${grading.corrections.map(c => `
                    <div class="small py-1 border-bottom">
                        <del class="vstep-ai-del">${escapeHtml(c.original || '')}</del>
                        → <ins class="vstep-ai-ins">${escapeHtml(c.corrected || '')}</ins>
                        ${c.explanation ? `<div class="text-muted">${escapeHtml(c.explanation)}</div>` : ''}
                    </div>
                `).join('')}
            </details>`
            : '';
        const sampleHtml = (grading.improvedVersion || grading.sampleAnswer)
            ? `<details class="mt-2">
                <summary class="small fw-semibold">Bài mẫu tham khảo</summary>
                <div class="p-2 bg-white border rounded small mt-1" style="white-space:pre-wrap;">${escapeHtml(grading.improvedVersion || grading.sampleAnswer)}</div>
            </details>`
            : '';
        return `
            <div class="vstep-ai-grading p-2 border rounded mt-2" style="background:#f6f9ff;">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <span class="badge bg-primary"><i class="bi bi-robot me-1"></i>AI sửa lỗi${(grading.corrections || []).length ? ` — ${grading.corrections.length} lỗi` : ''}</span>
                </div>
                ${grading.transcript && options.showTranscript ? `
                    <details class="mb-1">
                        <summary class="small fw-semibold">Transcript (bản ghi lời nói)</summary>
                        <div class="p-2 bg-white border rounded small mt-1">${escapeHtml(grading.transcript)}</div>
                    </details>
                ` : ''}
                ${grading.diffText ? `
                    <div class="small fw-semibold mt-1">Bài sửa lỗi (đỏ = sai, xanh = sửa đúng):</div>
                    <div class="p-2 bg-white border rounded small vstep-ai-diff">${renderDiffText(grading.diffText)}</div>
                ` : ''}
                ${grading.feedback ? `<div class="small mt-2"><strong>Nhận xét:</strong> ${escapeHtml(grading.feedback)}</div>` : ''}
                ${correctionsHtml}
                ${sampleHtml}
            </div>
        `;
    }

    async function requestAiGrading(kind, resultId, partRef, statusEl) {
        if (statusEl) statusEl.textContent = 'AI đang chấm bài... (10-30 giây)';
        try {
            const endpoint = kind === 'speaking' ? '/api/vstep/ai/grade-speaking' : '/api/vstep/ai/grade-writing';
            const body = kind === 'speaking'
                ? { resultId, partKey: partRef }
                : { resultId, partIndex: partRef };
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(body)
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'Không thể chấm AI.');
            // Cập nhật result trong state để render lại có data mới.
            const result = state.results.find(r => String(r.id) === String(resultId));
            if (result) {
                result.metadata = result.metadata || {};
                if (kind === 'speaking') {
                    result.metadata.ai_speaking = { ...(result.metadata.ai_speaking || {}), [partRef]: data.grading };
                } else {
                    result.metadata.ai_writing = { ...(result.metadata.ai_writing || {}), [String(partRef)]: data.grading };
                }
            }
            showDetail(resultId);
        } catch (error) {
            if (statusEl) statusEl.textContent = 'Lỗi: ' + error.message;
        }
    }

    // Bảng đối chiếu đáp án Listening/Reading từ metadata details (feedback KH:
    // "chỗ đáp án và lời giải sau khi nộp bài xong xem ở đâu").
    function buildMcqReviewHtml(md) {
        const sections = [
            { label: 'Listening', details: md.listening_details },
            { label: 'Reading', details: md.reading_details }
        ].filter(s => Array.isArray(s.details) && s.details.length);
        if (!sections.length) return '';
        return sections.map(section => {
            const correctCount = section.details.filter(d => d.isCorrect).length;
            return `
            <div class="mb-3">
                <h6>${escapeHtml(section.label)} — ${correctCount}/${section.details.length} câu đúng</h6>
                ${section.details.map((d, i) => `
                    <div class="p-2 mb-1 border rounded small" style="border-left:4px solid ${d.isCorrect ? '#198754' : '#dc3545'} !important; background:${d.isCorrect ? '#f2fbf6' : '#fdf3f4'};">
                        <div><strong>Câu ${escapeHtml(String(d.number || i + 1))}.</strong> ${escapeHtml(d.prompt || '')}</div>
                        <div class="d-flex flex-wrap gap-3 mt-1">
                            <span>Bạn chọn: <strong>${escapeHtml(d.userAnswer || '—')}</strong></span>
                            <span>Đáp án đúng: <strong>${escapeHtml(d.correct || '')}</strong></span>
                            <span>${d.isCorrect ? '<i class="bi bi-check-circle-fill text-success"></i> Đúng' : '<i class="bi bi-x-circle-fill text-danger"></i> Sai'}</span>
                        </div>
                        ${d.explanation ? `<div class="mt-1 p-2 rounded" style="background:#fff8e6;color:#664d03;"><i class="bi bi-lightbulb me-1"></i>${escapeHtml(d.explanation)}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
        }).join('');
    }

    function showDetail(id) {
        const result = state.results.find(r => String(r.id) === String(id));
        if (!result || !refs.detail) return;
        const md = result.metadata || {};
        // Bỏ ảnh giám thị base64 + speaking recording urls nặng khỏi dump JSON.
        const dump = JSON.parse(JSON.stringify(result));
        if (dump.metadata?.proctor_photo) dump.metadata.proctor_photo = '[đã ẩn]';
        if (dump.metadata?.answers) dump.metadata.answers = '[xem chi tiết phía dưới]';
        const mcqReviewHtml = buildMcqReviewHtml(md);
        const aiWriting = md.ai_writing || {};
        const writingHtml = (md.writing_answers || []).map((w, i) => {
            const grading = aiWriting[String(i)];
            const hasAnswer = String(w.answer || '').trim();
            return `
            <div class="mb-3">
                <strong>Writing Part ${i + 1}</strong>
                <div class="small text-muted mb-1">${escapeHtml(w.title || '')}</div>
                <div class="p-2 bg-white border rounded small" style="white-space:pre-wrap;">${escapeHtml(w.answer || '(trống)')}</div>
                ${grading
                    ? renderAiGradingBlock(grading)
                    : hasAnswer ? `
                        <button type="button" class="btn btn-sm btn-outline-primary mt-2 vstep-ai-grade-btn"
                            data-kind="writing" data-result-id="${escapeHtml(String(result.id))}" data-part="${i}">
                            <i class="bi bi-robot me-1"></i>Chấm AI + sửa lỗi
                        </button>
                        <span class="small text-muted ms-2 vstep-ai-grade-status"></span>
                    ` : ''}
            </div>
        `;
        }).join('');
        const aiSpeaking = md.ai_speaking || {};
        const speakingHtml = Object.entries(md.speaking_answers || {}).map(([key, val]) => {
            const grading = aiSpeaking[key];
            return `
            <div class="mb-2">
                <strong>Speaking ${escapeHtml(key)}</strong>
                ${val?.recordingUrl ? `<audio controls src="${escapeHtml(val.recordingUrl)}" class="d-block mt-1" style="max-width:320px;"></audio>` : '<div class="small text-muted">Không có file ghi âm</div>'}
                ${grading
                    ? renderAiGradingBlock(grading, { showTranscript: true })
                    : val?.recordingUrl ? `
                        <button type="button" class="btn btn-sm btn-outline-primary mt-1 vstep-ai-grade-btn"
                            data-kind="speaking" data-result-id="${escapeHtml(String(result.id))}" data-part="${escapeHtml(key)}">
                            <i class="bi bi-robot me-1"></i>Chấm AI + sửa lỗi
                        </button>
                        <span class="small text-muted ms-2 vstep-ai-grade-status"></span>
                    ` : ''}
            </div>
        `;
        }).join('');

        // Điểm thành phần theo kỹ năng (GV chấm qua part_scores.manualScore).
        const partScores = result.part_scores && typeof result.part_scores === 'object' ? result.part_scores : {};
        const skillLabels = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' };
        const skillScoreRows = Object.keys(skillLabels).map(key => {
            const item = partScores[key] || {};
            const hasManual = Number.isFinite(Number(item.manualScore));
            const hasAuto = Number(item.total || 0) > 0;
            if (!hasManual && !hasAuto) return '';
            const text = hasManual
                ? `${Number(item.manualScore)} điểm (GV chấm)`
                : `${Number(item.score || 0)}/${Number(item.total || 0)}`;
            return `<span class="badge bg-light text-dark border me-2 mb-1">${skillLabels[key]}: <strong>${escapeHtml(text)}</strong></span>`;
        }).filter(Boolean).join('');

        refs.detail.style.display = 'block';
        refs.detail.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong><i class="bi bi-file-text me-1"></i>Chi tiết bài nộp #${escapeHtml(String(result.id).slice(0, 8))}</strong>
                <button type="button" class="btn btn-sm btn-outline-secondary" id="vstep-history-close-detail">Đóng</button>
            </div>
            ${skillScoreRows ? `<div class="mb-2">${skillScoreRows}</div>` : ''}
            ${result.manual_feedback ? `<div class="alert alert-info py-2 small mb-3"><strong>Giáo viên:</strong> ${escapeHtml(result.manual_feedback)}</div>` : ''}
            ${mcqReviewHtml ? `<div class="mb-3"><h6><i class="bi bi-journal-check me-1"></i>Đáp án & giải thích</h6>${mcqReviewHtml}</div>` : ''}
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
        // Nút "Chấm AI + sửa lỗi" cho writing/speaking chưa chấm.
        refs.detail.querySelectorAll('.vstep-ai-grade-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.disabled = true;
                const statusEl = btn.parentElement?.querySelector('.vstep-ai-grade-status');
                const kind = btn.dataset.kind;
                const partRef = kind === 'speaking' ? btn.dataset.part : Number(btn.dataset.part);
                requestAiGrading(kind, btn.dataset.resultId, partRef, statusEl);
            });
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
