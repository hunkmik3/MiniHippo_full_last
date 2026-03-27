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
                            <div class="mt-3" id="history-detail-writing-auto-wrap" style="display: none;">
                                <h6 class="mb-2">Sửa lỗi tự động</h6>
                                <div id="history-detail-writing-auto-summary"></div>
                                <div id="history-detail-writing-auto"></div>
                            </div>
                            <div class="mt-3" id="history-detail-writing-feedback-wrap" style="display: none;">
                                <h6 class="mb-2">Nhận xét theo từng câu</h6>
                                <div id="history-detail-writing-feedback"></div>
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
            const practiceType = item.practice_type
                ? item.practice_type.charAt(0).toUpperCase() + item.practice_type.slice(1)
                : '—';
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
                    <td><span class="badge bg-info">${escapeHtml(band || '—')}</span></td>
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
        if (selectedType) query.set('type', selectedType);
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

    window.openHistoryResultDetail = function (resultId) {
        const result = state.results.find(item => item.id === resultId);
        if (!result) return;
        state.selectedResult = result;
        const modalEl = ensureDetailModal();
        const metadata = result.metadata && typeof result.metadata === 'object' ? result.metadata : {};
        const score = resolveDisplayScore(result, metadata);
        const type = result.practice_type
            ? result.practice_type.charAt(0).toUpperCase() + result.practice_type.slice(1)
            : '—';
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
                <div><strong>Band:</strong> ${escapeHtml(band || '—')}</div>
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

        if (window.bootstrap && modalEl) {
            new bootstrap.Modal(modalEl).show();
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
