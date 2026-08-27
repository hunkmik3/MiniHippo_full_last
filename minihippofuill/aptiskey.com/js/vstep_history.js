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
                        <div class="d-flex flex-wrap gap-1">
                            <button type="button" class="btn btn-sm btn-outline-primary vstep-history-view-btn" data-result-id="${escapeHtml(result.id)}">
                                <i class="bi bi-eye me-1"></i>Xem
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-success vstep-history-review-btn" data-result-id="${escapeHtml(result.id)}">
                                <i class="bi bi-layout-text-window me-1"></i>Coi lại đề
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        refs.body.querySelectorAll('.vstep-history-view-btn').forEach(btn => {
            btn.addEventListener('click', () => showDetail(btn.dataset.resultId));
        });
        refs.body.querySelectorAll('.vstep-history-review-btn').forEach(btn => {
            btn.addEventListener('click', () => openFullReview(btn.dataset.resultId));
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

    // Chấm 1 câu, render kết quả THẲNG vào slot (không re-render cả detail → không
    // chấm lặp). statusEl nằm trong .vstep-ai-slot.
    async function requestAiGrading(kind, resultId, partRef, statusEl) {
        const slot = statusEl?.closest('.vstep-ai-slot');
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
            const result = state.results.find(r => String(r.id) === String(resultId));
            if (result) {
                result.metadata = result.metadata || {};
                if (kind === 'speaking') {
                    result.metadata.ai_speaking = { ...(result.metadata.ai_speaking || {}), [partRef]: data.grading };
                } else {
                    result.metadata.ai_writing = { ...(result.metadata.ai_writing || {}), [String(partRef)]: data.grading };
                }
            }
            if (slot && data.grading) {
                slot.innerHTML = renderAiGradingBlock(data.grading, { showTranscript: kind === 'speaking' });
            }
        } catch (error) {
            if (statusEl) statusEl.innerHTML = `<span class="text-muted">Chưa chấm được: ${escapeHtml(error.message)}</span>`;
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

    // ===================================================================
    // COI LẠI FULL GIAO DIỆN — render lại đề đúng bố cục bài thi (đoạn văn
    // Reading + đủ options A/B/C/D + audio Listening) và tô đáp án:
    //   xanh = đáp án đúng · đỏ = HV chọn sai · badge Đúng/Sai/Chưa trả lời.
    // Nguồn: SET gốc qua get.js (đã gộp bộ tổng hợp) + md.answers (nhãn HV chọn).
    // Tự chứa, KHÔNG đụng engine thi (vstep_exam.js) để tránh vỡ luồng thi thật.
    // ===================================================================
    function reviewRichText(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_]+)__/g, '<u>$1</u>')
            .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
            .replace(/\r?\n/g, '<br>');
    }

    // getQuestionId của vstep_exam: question.id || `${skill}-part${idx+1}-q${i+1}`.
    function reviewQid(skill, partIndex, question, index) {
        return question.id || `${skill}-part${partIndex + 1}-q${index + 1}`;
    }

    // PHẢI khớp filterMeaningfulParts của vstep_exam: khi nộp, partIndex (→ qid)
    // được tính TRÊN mảng parts đã lọc bỏ part trống + slice theo max. Không lọc
    // giống hệt → lệch index → không tra được đáp án HV đã chọn.
    function reviewFilterParts(parts, skill, maxSlice) {
        if (!Array.isArray(parts) || !parts.length) return [];
        return parts.slice(0, maxSlice).filter(part => {
            if (!part || typeof part !== 'object') return false;
            if (skill === 'listening') {
                return Boolean(part.audioUrl) || (Array.isArray(part.questions) && part.questions.length > 0);
            }
            if (skill === 'reading') {
                return Boolean(part.passage && String(part.passage).trim()
                    && !String(part.passage).startsWith('Reading Part'))
                    || (Array.isArray(part.questions) && part.questions.length > 0);
            }
            if (skill === 'writing') {
                const prompt = String(part.prompt || '').trim();
                return prompt.length > 0 && !prompt.startsWith('Writing Part');
            }
            if (skill === 'speaking') {
                const prompt = String(part.prompt || '').trim();
                return prompt.length > 0 && !prompt.startsWith('Speaking Part');
            }
            return true;
        });
    }

    function reviewNormalizeData(set) {
        const data = (set && set.data) || {};
        return {
            listening: { parts: reviewFilterParts(data.listening?.parts, 'listening', 3) },
            reading: { parts: reviewFilterParts(data.reading?.parts, 'reading', 4) },
            writing: { parts: reviewFilterParts(data.writing?.parts, 'writing', 2) },
            speaking: { parts: reviewFilterParts(data.speaking?.parts, 'speaking', 3) }
        };
    }

    function reviewAudioHtml(url) {
        const safe = String(url || '').trim();
        if (!safe) return '';
        return `<audio controls preload="none" src="${escapeHtml(safe)}" style="width:100%;max-width:420px;margin:.4rem 0;"></audio>`;
    }

    // Render câu hỏi trắc nghiệm (listening/reading) đã tô đáp án.
    function reviewMcqQuestions(skill, parts, answers) {
        let counter = 0;
        return (parts || []).map((part, partIndex) => {
            const questions = part.questions || [];
            const passage = skill === 'reading' ? (part.passage || part.text || part.content || '') : '';
            if (!questions.length && !passage) { return ''; }
            const startNo = counter + 1;
            const endNo = counter + questions.length;
            const rangeLabel = questions.length
                ? (startNo === endNo ? `Question ${startNo}` : `Questions ${startNo}-${endNo}`)
                : '';
            const hasPerQAudio = questions.some(q => q.audioUrl);
            const partAudio = skill === 'listening' && !hasPerQAudio ? reviewAudioHtml(part.audioUrl) : '';
            const qHtml = questions.map((question, qi) => {
                counter += 1;
                const number = counter;
                const id = reviewQid(skill, partIndex, question, qi);
                const correct = question.answer || '';
                const userAnswer = (answers && answers[skill] && answers[skill][id]) || '';
                const answered = Boolean(userAnswer);
                const isCorrect = answered && userAnswer === correct;
                const qAudio = (skill === 'listening' && question.audioUrl) ? reviewAudioHtml(question.audioUrl) : '';
                const options = (question.options || []).map(opt => {
                    const isCorrectOpt = opt.label === correct;
                    const isUserPick = opt.label === userAnswer;
                    let style = 'display:block;padding:.4rem .6rem;border:1px solid #dee2e6;border-radius:.4rem;margin:.25rem 0;';
                    let tag = '';
                    if (isCorrectOpt) { style += 'background:#e8f6ee;border-color:#198754;'; tag = ' <span class="badge bg-success ms-1">Đáp án đúng</span>'; }
                    if (isUserPick && !isCorrectOpt) { style += 'background:#fbeaec;border-color:#dc3545;'; tag = ' <span class="badge bg-danger ms-1">Bạn chọn</span>'; }
                    if (isUserPick && isCorrectOpt) { tag = ' <span class="badge bg-success ms-1"><i class="bi bi-check-lg"></i> Bạn chọn (đúng)</span>'; }
                    return `<span style="${style}"><strong>${escapeHtml(opt.label)}.</strong> ${escapeHtml(opt.text)}${tag}</span>`;
                }).join('');
                const statusBadge = !answered
                    ? '<span class="badge bg-secondary">Chưa trả lời</span>'
                    : isCorrect
                        ? '<span class="badge bg-success"><i class="bi bi-check-lg"></i> Đúng</span>'
                        : '<span class="badge bg-danger"><i class="bi bi-x-lg"></i> Sai</span>';
                const titlePrefix = skill === 'listening' ? `Question ${number}:` : `${number}.`;
                return `
                    <div style="margin-bottom:1rem;padding:.75rem;border:1px solid #eee;border-radius:.5rem;background:#fff;">
                        <div class="d-flex justify-content-between align-items-start gap-2 mb-1">
                            <div class="fw-semibold">${escapeHtml(titlePrefix)} ${reviewRichText(question.prompt)}</div>
                            <div class="flex-shrink-0">${statusBadge}</div>
                        </div>
                        ${qAudio}
                        ${options}
                        ${question.explanation ? `<div class="mt-2 p-2 rounded" style="background:#fff8e6;color:#664d03;font-size:.9rem;"><i class="bi bi-lightbulb me-1"></i>${reviewRichText(question.explanation)}</div>` : ''}
                    </div>
                `;
            }).join('');
            const partTitle = escapeHtml(part.title || `Part ${partIndex + 1}`);
            const head = `<div class="fw-bold fs-5 mb-2">${partTitle}${rangeLabel ? ` <span class="text-muted fs-6">(${escapeHtml(rangeLabel)})</span>` : ''}</div>`;
            if (skill === 'reading') {
                return `
                    <div style="margin-bottom:1.5rem;">
                        ${head}
                        <div class="row g-3">
                            <div class="col-lg-6"><div class="p-3 rounded" style="background:#fbfbfb;border:1px solid #eee;">${reviewRichText(passage)}</div></div>
                            <div class="col-lg-6">${qHtml}</div>
                        </div>
                    </div>
                `;
            }
            return `
                <div style="margin-bottom:1.5rem;">
                    ${head}
                    ${part.directions ? `<div class="text-muted small mb-2">${reviewRichText(part.directions)}</div>` : ''}
                    ${partAudio}
                    ${qHtml}
                </div>
            `;
        }).join('');
    }

    function reviewWritingHtml(parts, md) {
        const answersArr = Array.isArray(md.writing_answers) ? md.writing_answers : [];
        const fromAnswers = (md.answers && md.answers.writing) || {};
        return (parts || []).map((part, i) => {
            const key = `part${i + 1}`;
            const answer = (answersArr[i] && answersArr[i].answer) || fromAnswers[key] || '';
            return `
                <div style="margin-bottom:1.5rem;">
                    <div class="fw-bold fs-5 mb-2">${escapeHtml(part.title || `Writing Part ${i + 1}`)}</div>
                    <div class="p-3 rounded mb-2" style="background:#fbfbfb;border:1px solid #eee;">${reviewRichText(part.prompt || '')}</div>
                    <div class="fw-semibold small text-muted mb-1">Bài làm của bạn:</div>
                    <div class="p-3 rounded" style="background:#fff;border:1px solid #dee2e6;white-space:pre-wrap;">${escapeHtml(answer || '(trống)')}</div>
                </div>
            `;
        }).join('');
    }

    function reviewSpeakingHtml(parts, md) {
        const rec = md.speaking_answers || {};
        return (parts || []).map((part, i) => {
            const entry = rec[`part${i + 1}`] || rec[String(i + 1)] || null;
            const url = entry && entry.recordingUrl;
            return `
                <div style="margin-bottom:1.5rem;">
                    <div class="fw-bold fs-5 mb-2">${escapeHtml(part.title || `Speaking Part ${i + 1}`)}</div>
                    <div class="p-3 rounded mb-2" style="background:#fbfbfb;border:1px solid #eee;">${reviewRichText(part.prompt || '')}</div>
                    ${url ? reviewAudioHtml(url) : '<div class="small text-muted">Không có file ghi âm</div>'}
                </div>
            `;
        }).join('');
    }

    function buildFullReviewHtml(set, result) {
        const data = reviewNormalizeData(set);
        const md = result.metadata || {};
        const answers = md.answers && typeof md.answers === 'object' ? md.answers : {};
        const sections = [];
        if (data.listening.parts.some(p => (p.questions || []).length)) {
            sections.push('<h4 class="text-primary mb-3"><i class="bi bi-headphones me-2"></i>Listening</h4>' + reviewMcqQuestions('listening', data.listening.parts, answers));
        }
        if (data.reading.parts.some(p => (p.questions || []).length || (p.passage && String(p.passage).trim()))) {
            sections.push('<h4 class="text-primary mb-3"><i class="bi bi-book me-2"></i>Reading</h4>' + reviewMcqQuestions('reading', data.reading.parts, answers));
        }
        if (data.writing.parts.length) {
            sections.push('<h4 class="text-primary mb-3"><i class="bi bi-pencil-square me-2"></i>Writing</h4>' + reviewWritingHtml(data.writing.parts, md));
        }
        if (data.speaking.parts.length) {
            sections.push('<h4 class="text-primary mb-3"><i class="bi bi-mic me-2"></i>Speaking</h4>' + reviewSpeakingHtml(data.speaking.parts, md));
        }
        if (!sections.length) return '<div class="alert alert-warning">Không tải được nội dung đề để coi lại.</div>';
        return sections.join('<hr class="my-4">');
    }

    async function openFullReview(id) {
        const result = state.results.find(r => String(r.id) === String(id));
        if (!result) return;
        const md = result.metadata || {};
        const reviewSetId = md.vstep_set_id;
        const overlay = document.createElement('div');
        overlay.className = 'vstep-review-overlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:20000;background:rgba(0,0,0,.5);display:flex;justify-content:center;';
        overlay.innerHTML = `
            <div style="background:#f5f6f8;width:100%;max-width:1100px;height:100%;display:flex;flex-direction:column;box-shadow:0 0 40px rgba(0,0,0,.3);">
                <div style="flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:.75rem 1rem;background:#fff;border-bottom:1px solid #dee2e6;">
                    <div class="text-truncate">
                        <strong><i class="bi bi-eye me-1"></i>Coi lại bài làm</strong>
                        <span class="text-muted small ms-2">${escapeHtml(result.content_title || md.vstep_set_title || '')}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-shrink-0">
                        <span class="d-none d-md-inline small text-muted"><span class="badge bg-success">&nbsp;</span> đáp án đúng · <span class="badge bg-danger">&nbsp;</span> bạn chọn sai</span>
                        <button type="button" class="btn btn-sm btn-outline-secondary" data-review-close><i class="bi bi-x-lg me-1"></i>Đóng</button>
                    </div>
                </div>
                <div style="flex:1 1 auto;overflow:auto;padding:1.25rem;" data-review-body>
                    <div class="text-center py-5"><span class="spinner-border"></span><div class="mt-2 text-muted">Đang tải đề để coi lại...</div></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        const close = () => { overlay.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', onKey); };
        const onKey = (e) => { if (e.key === 'Escape') close(); };
        overlay.querySelector('[data-review-close]').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
        document.addEventListener('keydown', onKey);
        const body = overlay.querySelector('[data-review-body]');
        if (!reviewSetId) {
            body.innerHTML = '<div class="alert alert-warning">Bài nộp này không lưu mã đề nên không thể coi lại full giao diện. Bạn vẫn xem được bảng đối chiếu đáp án ở nút "Xem".</div>';
            return;
        }
        try {
            const resp = await fetch(`/api/vstep/contents/get?id=${encodeURIComponent(reviewSetId)}`, { headers: authorizedHeaders() });
            const dt = await resp.json().catch(() => ({}));
            if (!resp.ok) throw new Error(dt.error || 'Không tải được đề.');
            const set = dt.set || dt.content;
            body.innerHTML = buildFullReviewHtml(set, result);
        } catch (err) {
            body.innerHTML = `<div class="alert alert-danger">Không tải được đề để coi lại: ${escapeHtml(err.message)}</div>`;
        }
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
                        <div class="mt-2 vstep-ai-slot" data-kind="writing" data-result-id="${escapeHtml(String(result.id))}" data-part="${i}">
                            <span class="small text-muted vstep-ai-grade-status"><span class="spinner-border spinner-border-sm me-1"></span>AI đang chấm tự động...</span>
                        </div>
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
                        <div class="mt-1 vstep-ai-slot" data-kind="speaking" data-result-id="${escapeHtml(String(result.id))}" data-part="${escapeHtml(key)}">
                            <span class="small text-muted vstep-ai-grade-status"><span class="spinner-border spinner-border-sm me-1"></span>AI đang chấm tự động...</span>
                        </div>
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
        // TỰ ĐỘNG chấm mọi câu chưa chấm khi mở chi tiết (tuần tự, không cần bấm nút).
        (async () => {
            const slots = Array.from(refs.detail.querySelectorAll('.vstep-ai-slot'));
            for (const slot of slots) {
                if (slot.dataset.done) continue;
                slot.dataset.done = '1';
                const statusEl = slot.querySelector('.vstep-ai-grade-status');
                const kind = slot.dataset.kind;
                const partRef = kind === 'speaking' ? slot.dataset.part : Number(slot.dataset.part);
                await requestAiGrading(kind, slot.dataset.resultId, partRef, statusEl);
            }
        })();
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
