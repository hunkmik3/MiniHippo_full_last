(() => {
    const refs = {
        typeFilter: document.getElementById('history-type-filter'),
        refreshBtn: document.getElementById('history-refresh-btn'),
        tableBody: document.getElementById('history-results-body'),
        emptyState: document.getElementById('history-empty-state'),
        totalLabel: document.getElementById('history-total-label')
    };

    if (!refs.tableBody) return;

    const state = {
        results: [],
        selectedResult: null
    };

    function escapeHtml(value) {
        if (value === undefined || value === null) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatDateTime(value) {
        if (!value) return '—';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleString('vi-VN');
    }

    function formatDurationSeconds(seconds) {
        if (seconds === undefined || seconds === null || Number.isNaN(Number(seconds))) return '—';
        const total = Math.max(0, Number(seconds));
        const mins = Math.floor(total / 60);
        const secs = Math.round(total % 60);
        return `${mins}p ${secs.toString().padStart(2, '0')}s`;
    }

    function calculateBand(practiceType, totalScore) {
        if (!practiceType || totalScore === undefined || totalScore === null) {
            return '—';
        }
        const type = practiceType.toLowerCase();
        if (type === 'listening') {
            if (totalScore >= 42) return 'C';
            if (totalScore >= 34) return 'B2';
            if (totalScore >= 24) return 'B1';
            if (totalScore >= 16) return 'A2';
            return 'Chưa đạt A2';
        }
        if (type === 'reading') {
            if (totalScore >= 46) return 'C';
            if (totalScore >= 38) return 'B2';
            if (totalScore >= 26) return 'B1';
            if (totalScore >= 16) return 'A2';
            return 'Chưa đạt A2';
        }
        return '—';
    }

    function resolveDisplayBand(result, metadata = {}) {
        // Bài Key Listening/Reading không hiển thị band điểm (CEFR).
        const kind = String(metadata?.submission_kind || '').toLowerCase();
        if (kind === 'key_listening' || kind === 'key_reading') {
            return '—';
        }
        const practiceType = String(result?.practice_type || '').toLowerCase();
        if (practiceType === 'writing') {
            if (!metadata.admin_graded_at) return 'Pending';
            const rawBand = typeof metadata.band === 'string' ? metadata.band.trim() : '';
            return rawBand || 'Pending';
        }
        if (practiceType === 'speaking') {
            const rawBand = typeof metadata.band === 'string' ? metadata.band.trim() : '';
            if (!rawBand) return 'Pending';

            const isLegacyDefaultC = rawBand.toUpperCase() === 'C'
                && Number(result?.total_score || 0) === 0
                && Number(result?.max_score || 0) === 0;

            return isLegacyDefaultC ? 'Pending' : rawBand;
        }
        return calculateBand(result?.practice_type, result?.total_score);
    }

    function resolveDisplayScore(result, metadata = {}) {
        const practiceType = String(result?.practice_type || '').toLowerCase();
        if (practiceType === 'writing' && !metadata.admin_graded_at) {
            return 'Pending';
        }
        return `${result?.total_score || 0}/${result?.max_score || 0}`;
    }

    // Nhãn loại bài: ưu tiên submission_kind (Key Listening/Reading từ Lớp học),
    // nếu không thì viết hoa practice_type như cũ.
    function resolveDisplayType(result) {
        const kind = String(result?.metadata?.submission_kind || '').toLowerCase();
        if (kind === 'key_listening') return 'Key Listening';
        if (kind === 'key_reading') return 'Key Reading';
        const practiceType = result?.practice_type;
        return practiceType
            ? practiceType.charAt(0).toUpperCase() + practiceType.slice(1)
            : '—';
    }

    // Chi tiết bài làm Key (đáp án từng câu, theo từng part) — đọc metadata.key_review.
    function renderKeyReviewDetail(review = []) {
        if (!Array.isArray(review) || !review.length) {
            return '<div class="text-muted small">Không có dữ liệu chi tiết.</div>';
        }
        return review.map((part) => {
            const rows = (part.rows || []).map((row, i) => `
                <tr>
                    <td>${escapeHtml(row.q || `Câu ${i + 1}`)}</td>
                    <td class="${row.ok ? 'text-success' : 'text-danger'} fw-semibold">${escapeHtml(row.user || '(không trả lời)')}</td>
                    <td class="text-success">${escapeHtml(row.correct || '')}</td>
                </tr>
            `).join('');
            return `
                <div class="border rounded p-2 mb-2">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <strong class="small">${escapeHtml(part.label || '')}</strong>
                        <span class="badge bg-light text-dark border">${escapeHtml(String(part.score ?? 0))}/${escapeHtml(String(part.total ?? 0))}</span>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-bordered mb-0" style="font-size:0.82rem;">
                            <thead><tr><th>Câu</th><th>Đáp án của bạn</th><th>Đáp án đúng</th></tr></thead>
                            <tbody>${rows || '<tr><td colspan="3" class="text-muted">Không có dữ liệu.</td></tr>'}</tbody>
                        </table>
                    </div>
                </div>
            `;
        }).join('');
    }

    function getAiUsageInfo(metadata = {}) {
        const rawProbability = Number(metadata.ai_usage_probability);
        const probability = Number.isFinite(rawProbability)
            ? Math.max(0, Math.min(100, Math.round(rawProbability)))
            : null;
        const rawThreshold = Number(metadata.ai_usage_threshold);
        const threshold = Number.isFinite(rawThreshold) ? rawThreshold : 50;
        const label = metadata.ai_usage_label
            || (probability !== null
                ? (probability > threshold ? 'Có thể dùng AI' : 'Không sử dụng AI')
                : 'Chưa phân tích');
        const warning = probability !== null ? probability > threshold : false;
        return {
            probability,
            threshold,
            label,
            warning,
            badgeClass: warning ? 'bg-danger' : 'bg-success',
            reasons: Array.isArray(metadata.ai_usage_reasons) ? metadata.ai_usage_reasons : []
        };
    }

    function getQuestionFeedbackMap(metadata = {}) {
        const raw = metadata.admin_question_feedback || metadata.question_feedback;
        if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
            return raw;
        }
        return {};
    }

    function getPartLabel(partKey) {
        if (!partKey) return '';
        const normalized = String(partKey).replace(/^part/i, '').trim();
        return normalized ? `Part ${normalized}` : String(partKey);
    }

    function buildQuestionFeedbackId(partKey, itemKey, idx) {
        const safePart = String(partKey || 'part').trim() || 'part';
        const safeKey = String(itemKey || `item_${idx + 1}`).trim() || `item_${idx + 1}`;
        return `${safePart}:${safeKey}`;
    }

    function renderWritingAnswerItemsWithFeedback(items = [], partKey = '', questionFeedbackMap = {}, metadata = {}) {
        if (!Array.isArray(items) || !items.length) {
            return '<div class="text-muted small">Không có dữ liệu câu trả lời.</div>';
        }

        return items.map((item, idx) => {
            const key = item.key || `item_${idx + 1}`;
            const questionId = buildQuestionFeedbackId(partKey, key, idx);
            const prompt = item.prompt ? `<div class="small text-muted mb-1">${escapeHtml(item.prompt)}</div>` : '';
            const answerText = escapeHtml(item.answer || '—').replace(/\n/g, '<br>');
            const words = Number(item.word_count || 0);
            const feedbackText = (questionFeedbackMap[questionId] || questionFeedbackMap[key] || '').trim();
            const feedbackHtml = feedbackText
                ? escapeHtml(feedbackText).replace(/\n/g, '<br>')
                : '<span class="text-muted">Chưa có nhận xét cho câu này.</span>';
            const autoCorrectionHtml = window.WritingAutoFeedback
                ? window.WritingAutoFeedback.renderInlineQuestionCorrection({
                    metadata,
                    part: partKey,
                    key,
                    idx,
                    answer: item.answer || ''
                })
                : '';

            return `
                <div class="border rounded p-2 mb-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong class="small">${escapeHtml(key)}</strong>
                        <span class="badge bg-light text-dark">${words} từ</span>
                    </div>
                    ${prompt}
                    <div class="mb-2">${answerText}</div>
                    ${autoCorrectionHtml}
                    <div class="small">
                        <strong>Nhận xét admin:</strong>
                        <div>${feedbackHtml}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderWritingFeedbackDetail(metadata = {}) {
        const userAnswers = metadata.user_answers;
        if (!userAnswers || typeof userAnswers !== 'object') {
            return '<div class="text-muted small">Không có dữ liệu bài làm Writing chi tiết.</div>';
        }

        const sections = Object.keys(userAnswers);
        if (!sections.length) {
            return '<div class="text-muted small">Không có dữ liệu bài làm Writing chi tiết.</div>';
        }

        const questionFeedbackMap = getQuestionFeedbackMap(metadata);

        return sections.map((partKey) => `
            <div class="mb-3">
                <h6 class="small text-primary mb-2">${escapeHtml(getPartLabel(partKey))}</h6>
                ${renderWritingAnswerItemsWithFeedback(userAnswers[partKey], partKey, questionFeedbackMap, metadata)}
            </div>
        `).join('');
    }

    function getAuthHeaders(extra = {}) {
        const token = typeof getAuthToken === 'function'
            ? getAuthToken()
            : localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('Chưa đăng nhập');
        }
        const headers = {
            Authorization: `Bearer ${token}`,
            ...extra
        };
        if (typeof buildDeviceHeaders === 'function') {
            return buildDeviceHeaders(headers);
        }
        return headers;
    }

    async function fetchJson(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: getAuthHeaders(options.headers || {})
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error || 'Không thể tải dữ liệu');
        }
        return response.json();
    }

    function ensureDetailModal() {
        let modalEl = document.getElementById('history-detail-modal');
        if (modalEl) return modalEl;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="modal fade" id="history-detail-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="history-detail-title">Chi tiết kết quả</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="history-detail-summary" class="small text-muted mb-3"></div>
                            <div>
                                <h6 class="mb-2">Nhận xét admin</h6>
                                <div id="history-detail-admin-note" class="border rounded p-2 small"></div>
                            </div>
                            <div class="mt-3" id="history-detail-key-review-wrap" style="display: none;">
                                <h6 class="mb-2">Chi tiết bài làm</h6>
                                <div id="history-detail-key-review"></div>
                            </div>
                            <div class="mt-3" id="history-detail-writing-auto-wrap" style="display: none;">
                                <h6 class="mb-2">Sửa lỗi tự động</h6>
                                <div id="history-detail-writing-auto-summary"></div>
                                <div id="history-detail-writing-auto"></div>
                            </div>
                            <div class="mt-3" id="history-detail-writing-feedback-wrap" style="display: none;">
                                <h6 class="mb-2">Nhận xét theo từng câu</h6>
                                <div id="history-detail-writing-feedback"></div>
                            </div>
                            <div class="mt-3" id="history-detail-ai-wrap" style="display: none;">
                                <h6 class="mb-2"><i class="bi bi-robot me-1"></i>AI sửa lỗi chi tiết (giải thích từng lỗi)</h6>
                                <div id="history-detail-ai"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper.firstElementChild);
        return document.getElementById('history-detail-modal');
    }

    function renderResults(results) {
        if (!Array.isArray(results) || !results.length) {
            refs.tableBody.innerHTML = '';
            if (refs.emptyState) refs.emptyState.style.display = 'block';
            if (refs.totalLabel) refs.totalLabel.textContent = '0 bài';
            return;
        }

        if (refs.emptyState) refs.emptyState.style.display = 'none';
        if (refs.totalLabel) refs.totalLabel.textContent = `${results.length} bài`;

        refs.tableBody.innerHTML = results.map((item) => {
            const practiceType = resolveDisplayType(item);
            const submittedAt = formatDateTime(item.submitted_at);
            const duration = formatDurationSeconds(item.duration_seconds);
            const metadata = item.metadata && typeof item.metadata === 'object' ? item.metadata : {};
            const score = resolveDisplayScore(item, metadata);
            const band = resolveDisplayBand(item, metadata);
            const aiUsage = item.practice_type === 'writing' ? getAiUsageInfo(metadata) : null;
            const aiUsageText = aiUsage
                ? (aiUsage.probability !== null ? `${aiUsage.label} (${aiUsage.probability}%)` : aiUsage.label)
                : '—';

            return `
                <tr>
                    <td>${submittedAt}</td>
                    <td>${escapeHtml(practiceType)}</td>
                    <td>${escapeHtml(item.set_title || item.set_id || '—')}</td>
                    <td><strong>${escapeHtml(score)}</strong></td>
                    <td>${band && band !== '—' ? `<span class="badge bg-info">${escapeHtml(band)}</span>` : '—'}</td>
                    <td>${escapeHtml(duration)}</td>
                    <td>${aiUsage ? `<span class="badge ${aiUsage.badgeClass}">${escapeHtml(aiUsageText)}</span>` : '—'}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.openHistoryResultDetail('${item.id}')">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async function loadResults() {
        refs.tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-3">
                    <i class="spinner-border spinner-border-sm me-2"></i>Đang tải lịch sử...
                </td>
            </tr>
        `;
        const selectedType = refs.typeFilter?.value || '';
        const query = new URLSearchParams({ limit: '150' });
        // Key Listening/Reading lưu practice_type là listening/reading nhưng có
        // submission_kind riêng -> lọc qua submissionKind thay vì type.
        if (selectedType.startsWith('key_')) {
            query.set('submissionKind', selectedType);
        } else if (selectedType) {
            query.set('type', selectedType);
        }
        try {
            const data = await fetchJson(`/api/practice_results/my-list?${query.toString()}`);
            state.results = data.results || [];
            renderResults(state.results);
        } catch (error) {
            refs.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-danger py-3">${escapeHtml(error.message)}</td>
                </tr>
            `;
            if (refs.totalLabel) refs.totalLabel.textContent = '—';
        }
    }

    // ===== AI sửa lỗi chi tiết (clone LexiBot): diff {-sai-}{+đúng+} + giải thích =====
    function renderAiDiff(diffText) {
        return escapeHtml(diffText)
            .replace(/\{-([\s\S]*?)-\}/g, '<del style="background:#fde8e8;color:#c0392b;text-decoration:line-through;border-radius:2px;padding:0 2px;">$1</del>')
            .replace(/\{\+([\s\S]*?)\+\}/g, '<ins style="background:#e6f7ec;color:#1e7e34;text-decoration:underline;border-radius:2px;padding:0 2px;">$1</ins>')
            .replace(/\r?\n/g, '<br>');
    }

    function renderAiGradingBlock(grading, options = {}) {
        if (!grading) return '';
        const correctionsHtml = (grading.corrections || []).length
            ? `<details class="mt-2"><summary class="small fw-semibold">Danh sách lỗi & giải thích (${grading.corrections.length})</summary>
                ${grading.corrections.map(c => `
                    <div class="small py-1 border-bottom">
                        <del style="color:#c0392b;">${escapeHtml(c.original || '')}</del>
                        → <ins style="color:#1e7e34;text-decoration:underline;">${escapeHtml(c.corrected || '')}</ins>
                        ${c.explanation ? `<div class="text-muted">${escapeHtml(c.explanation)}</div>` : ''}
                    </div>
                `).join('')}</details>`
            : '';
        const sampleHtml = (grading.improvedVersion || grading.sampleAnswer)
            ? `<details class="mt-2"><summary class="small fw-semibold">Bài mẫu tham khảo</summary>
                <div class="p-2 bg-white border rounded small mt-1" style="white-space:pre-wrap;">${escapeHtml(grading.improvedVersion || grading.sampleAnswer)}</div></details>`
            : '';
        return `
            <div class="p-2 border rounded mt-2" style="background:#f6f9ff;">
                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <span class="badge bg-primary"><i class="bi bi-robot me-1"></i>AI sửa lỗi${(grading.corrections || []).length ? ` — ${grading.corrections.length} lỗi` : ''}</span>
                </div>
                ${grading.transcript && options.showTranscript ? `
                    <details class="mb-1"><summary class="small fw-semibold">Transcript (bản ghi lời nói)</summary>
                    <div class="p-2 bg-white border rounded small mt-1">${escapeHtml(grading.transcript)}</div></details>
                ` : ''}
                ${grading.diffText ? `
                    <div class="small fw-semibold mt-1">Bài sửa lỗi (đỏ = sai, xanh = sửa đúng):</div>
                    <div class="p-2 bg-white border rounded small" style="line-height:1.8;">${renderAiDiff(grading.diffText)}</div>
                ` : ''}
                ${grading.feedback ? `<div class="small mt-2"><strong>Nhận xét:</strong> ${escapeHtml(grading.feedback)}</div>` : ''}
                ${correctionsHtml}
                ${sampleHtml}
            </div>
        `;
    }

    function renderAiSection(result, metadata) {
        const aiWriting = metadata.ai_writing || {};
        const aiSpeaking = metadata.ai_speaking || {};
        const blocks = [];

        if (result.practice_type === 'writing' && metadata.user_answers && typeof metadata.user_answers === 'object') {
            Object.values(metadata.user_answers).forEach(items => {
                (Array.isArray(items) ? items : []).forEach(item => {
                    const key = String(item?.key || '');
                    if (!key || !String(item?.answer || '').trim()) return;
                    const grading = aiWriting[key];
                    blocks.push(`
                        <div class="border rounded p-2 mb-2">
                            <strong class="small">${escapeHtml(key)}</strong>
                            ${grading
                                ? renderAiGradingBlock(grading)
                                : `<div class="mt-1 history-ai-slot" data-kind="writing" data-key="${escapeHtml(key)}">
                                    <span class="small text-muted history-ai-status"><span class="spinner-border spinner-border-sm me-1"></span>AI đang chấm tự động...</span>
                                </div>`}
                        </div>
                    `);
                });
            });
        }

        if (result.practice_type === 'speaking' && Array.isArray(metadata.speaking_answers)) {
            metadata.speaking_answers.forEach(item => {
                const key = String(item?.key || '');
                const recordingUrl = item?.recording_url || item?.recordingUrl || '';
                if (!key || !recordingUrl) return;
                const grading = aiSpeaking[key];
                blocks.push(`
                    <div class="border rounded p-2 mb-2">
                        <strong class="small">${escapeHtml(key)}${item.part ? ` (Part ${escapeHtml(String(item.part))})` : ''}</strong>
                        <audio controls src="${escapeHtml(recordingUrl)}" class="d-block mt-1 w-100" style="max-width:360px;"></audio>
                        ${grading
                            ? renderAiGradingBlock(grading, { showTranscript: true })
                            : `<div class="mt-1 history-ai-slot" data-kind="speaking" data-key="${escapeHtml(key)}">
                                <span class="small text-muted history-ai-status"><span class="spinner-border spinner-border-sm me-1"></span>AI đang chấm tự động...</span>
                            </div>`}
                    </div>
                `);
            });
        }

        return blocks.join('');
    }

    // Chấm 1 câu, render kết quả THẲNG vào slot (không re-render cả modal → không
    // chấm lặp). statusEl nằm trong slot; thay slot bằng block kết quả khi xong.
    async function requestHistoryAiGrading(kind, resultId, answerKey, statusEl) {
        const slot = statusEl?.closest('.history-ai-slot');
        try {
            const endpoint = kind === 'speaking'
                ? '/api/practice_results/ai-grade-speaking'
                : '/api/practice_results/ai-grade-writing';
            const data = await fetchJson(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resultId, answerKey })
            });
            const result = state.results.find(item => item.id === resultId);
            if (result && data.grading) {
                result.metadata = result.metadata || {};
                const bucket = kind === 'speaking' ? 'ai_speaking' : 'ai_writing';
                result.metadata[bucket] = { ...(result.metadata[bucket] || {}), [answerKey]: data.grading };
            }
            if (slot && data.grading) {
                slot.innerHTML = renderAiGradingBlock(data.grading, { showTranscript: kind === 'speaking' });
            }
        } catch (error) {
            if (statusEl) statusEl.innerHTML = `<span class="text-muted">Chưa chấm được: ${escapeHtml(error.message)}</span>`;
        }
    }

    window.openHistoryResultDetail = function (resultId) {
        const result = state.results.find(item => item.id === resultId);
        if (!result) return;
        state.selectedResult = result;
        const modalEl = ensureDetailModal();
        const metadata = result.metadata && typeof result.metadata === 'object' ? result.metadata : {};
        const score = resolveDisplayScore(result, metadata);
        const type = resolveDisplayType(result);
        const band = resolveDisplayBand(result, metadata);
        const aiUsage = result.practice_type === 'writing' ? getAiUsageInfo(metadata) : null;
        const aiUsageText = aiUsage
            ? (aiUsage.probability !== null ? `${aiUsage.label} (${aiUsage.probability}%)` : aiUsage.label)
            : null;

        const titleEl = document.getElementById('history-detail-title');
        if (titleEl) {
            titleEl.textContent = `Chi tiết kết quả · ${type}`;
        }
        const summaryEl = document.getElementById('history-detail-summary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div><strong>Ngày nộp:</strong> ${escapeHtml(formatDateTime(result.submitted_at))}</div>
                <div><strong>Bài:</strong> ${escapeHtml(result.set_title || result.set_id || '—')}</div>
                <div><strong>Điểm:</strong> ${escapeHtml(score)}</div>
                ${band && band !== '—' ? `<div><strong>Band:</strong> ${escapeHtml(band)}</div>` : ''}
                <div><strong>Thời gian làm:</strong> ${escapeHtml(formatDurationSeconds(result.duration_seconds))}</div>
                ${aiUsageText ? `<div><strong>AI Usage:</strong> ${escapeHtml(aiUsageText)}</div>` : ''}
            `;
        }
        const adminNoteEl = document.getElementById('history-detail-admin-note');
        if (adminNoteEl) {
            const note = typeof metadata.admin_note === 'string' && metadata.admin_note.trim()
                ? metadata.admin_note.trim()
                : 'Chưa có ghi chú từ admin.';
            const gradedAt = metadata.admin_graded_at ? `\n\nCập nhật: ${formatDateTime(metadata.admin_graded_at)}` : '';
            adminNoteEl.textContent = `${note}${gradedAt}`;
        }
        // Chi tiết bài làm Key Listening/Reading (đáp án từng câu).
        const keyReviewWrapEl = document.getElementById('history-detail-key-review-wrap');
        const keyReviewEl = document.getElementById('history-detail-key-review');
        const keyReview = Array.isArray(metadata.key_review) ? metadata.key_review : null;
        if (keyReview && keyReview.length) {
            if (keyReviewWrapEl) keyReviewWrapEl.style.display = 'block';
            if (keyReviewEl) keyReviewEl.innerHTML = renderKeyReviewDetail(keyReview);
        } else {
            if (keyReviewWrapEl) keyReviewWrapEl.style.display = 'none';
            if (keyReviewEl) keyReviewEl.innerHTML = '';
        }
        const writingFeedbackWrapEl = document.getElementById('history-detail-writing-feedback-wrap');
        const writingFeedbackEl = document.getElementById('history-detail-writing-feedback');
        const writingAutoWrapEl = document.getElementById('history-detail-writing-auto-wrap');
        const writingAutoSummaryEl = document.getElementById('history-detail-writing-auto-summary');
        const writingAutoEl = document.getElementById('history-detail-writing-auto');
        if (result.practice_type === 'writing') {
            if (writingAutoWrapEl) writingAutoWrapEl.style.display = 'block';
            if (writingAutoSummaryEl) {
                writingAutoSummaryEl.innerHTML = window.WritingAutoFeedback
                    ? window.WritingAutoFeedback.renderOverallSummary(metadata)
                    : '';
            }
            if (writingAutoEl) {
                writingAutoEl.innerHTML = window.WritingAutoFeedback
                    ? window.WritingAutoFeedback.renderSections(metadata)
                    : '<div class="text-muted small">Chưa có dữ liệu sửa lỗi tự động.</div>';
            }
            if (writingFeedbackWrapEl) writingFeedbackWrapEl.style.display = 'block';
            if (writingFeedbackEl) {
                writingFeedbackEl.innerHTML = renderWritingFeedbackDetail(metadata);
            }
        } else {
            if (writingAutoWrapEl) writingAutoWrapEl.style.display = 'none';
            if (writingAutoSummaryEl) writingAutoSummaryEl.innerHTML = '';
            if (writingAutoEl) writingAutoEl.innerHTML = '';
            if (writingFeedbackWrapEl) writingFeedbackWrapEl.style.display = 'none';
            if (writingFeedbackEl) writingFeedbackEl.innerHTML = '';
        }

        // Chấm AI chi tiết (writing + speaking) — nút chấm on-demand + hiện grading đã lưu.
        const aiWrapEl = document.getElementById('history-detail-ai-wrap');
        const aiEl = document.getElementById('history-detail-ai');
        if (aiWrapEl && aiEl) {
            const aiHtml = renderAiSection(result, metadata);
            aiWrapEl.style.display = aiHtml ? 'block' : 'none';
            aiEl.innerHTML = aiHtml;
            // TỰ ĐỘNG chấm mọi câu chưa chấm khi mở chi tiết (không cần bấm nút).
            // Chạy tuần tự để tránh dồn nhiều request nặng cùng lúc.
            (async () => {
                const slots = Array.from(aiEl.querySelectorAll('.history-ai-slot'));
                for (const slot of slots) {
                    if (slot.dataset.done) continue;
                    slot.dataset.done = '1';
                    const statusEl = slot.querySelector('.history-ai-status');
                    await requestHistoryAiGrading(slot.dataset.kind, resultId, slot.dataset.key, statusEl);
                }
            })();
        }

        if (window.bootstrap && modalEl) {
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
    };

    if (refs.typeFilter) {
        refs.typeFilter.addEventListener('change', loadResults);
    }
    if (refs.refreshBtn) {
        refs.refreshBtn.addEventListener('click', loadResults);
    }

    document.addEventListener('DOMContentLoaded', loadResults);
})();
