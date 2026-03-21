(() => {
    const moduleRoot = document.getElementById('writing-results-module');
    if (!moduleRoot) {
        return;
    }

    const refs = {
        searchInput: document.getElementById('writing-results-search-input'),
        clearSearchBtn: document.getElementById('clear-writing-results-search-btn'),
        refreshBtn: document.getElementById('refresh-writing-results-btn'),
        tableBody: document.getElementById('writing-results-table-body'),
        selectedLabel: document.getElementById('writing-results-selected-label')
    };

    const state = {
        userMap: new Map(),
        results: [],
        filteredResults: [],
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

    function getAuthHeaders(extra = {}) {
        if (typeof window.buildAuthorizedHeaders === 'function') {
            return window.buildAuthorizedHeaders(extra);
        }
        return extra;
    }

    async function fetchJson(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: getAuthHeaders(options.headers || {})
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const message = error.error || error.message || 'Yêu cầu thất bại';
            throw new Error(message);
        }
        return response.json();
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

    function getUserLabel(userId) {
        const user = state.userMap.get(userId);
        if (!user) return userId || '—';
        const code = user.username || user.account_code || '';
        const name = user.full_name || user.email || '';
        if (code && name) return `${code} - ${name}`;
        return code || name || userId || '—';
    }

    function getUserSearchText(userId) {
        const user = state.userMap.get(userId);
        if (!user) return String(userId || '').toLowerCase();
        return [
            user.username,
            user.account_code,
            user.full_name,
            user.email
        ].filter(Boolean).join(' ').toLowerCase();
    }

    function getBand(result) {
        const metadata = result?.metadata && typeof result.metadata === 'object'
            ? result.metadata
            : {};
        const rawBand = typeof metadata.band === 'string' ? metadata.band.trim() : '';
        if (!rawBand) return 'Pending';

        const isLegacyDefaultC = rawBand.toUpperCase() === 'C'
            && !metadata.admin_graded_at
            && Number(result?.total_score || 0) === 0
            && Number(result?.max_score || 0) === 0;

        return isLegacyDefaultC ? 'Pending' : rawBand;
    }

    function getAiUsageInfo(result) {
        const metadata = result?.metadata && typeof result.metadata === 'object'
            ? result.metadata
            : {};
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

    function buildQuestionFeedbackId(partKey, itemKey, idx) {
        const safePart = String(partKey || 'part').trim() || 'part';
        const safeKey = String(itemKey || `item_${idx + 1}`).trim() || `item_${idx + 1}`;
        return `${safePart}:${safeKey}`;
    }

    function renderTable(results) {
        if (!refs.tableBody) return;
        if (!results.length) {
            refs.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        <i class="bi bi-inboxes me-2"></i>Chưa có kết quả Writing.
                    </td>
                </tr>
            `;
            return;
        }
        refs.tableBody.innerHTML = results.map((item) => {
            const score = `${item.total_score || 0}/${item.max_score || 0}`;
            const aiUsage = getAiUsageInfo(item);
            const aiText = aiUsage.probability !== null
                ? `${aiUsage.label} (${aiUsage.probability}%)`
                : aiUsage.label;
            const aiClass = aiUsage.warning ? 'bg-danger' : 'bg-success';
            return `
                <tr>
                    <td>${escapeHtml(formatDateTime(item.submitted_at))}</td>
                    <td>${escapeHtml(getUserLabel(item.user_id))}</td>
                    <td>${escapeHtml(item.set_title || item.set_id || '—')}</td>
                    <td><span class="badge bg-info">${escapeHtml(getBand(item))}</span></td>
                    <td><strong>${escapeHtml(score)}</strong></td>
                    <td>${escapeHtml(formatDurationSeconds(item.duration_seconds))}</td>
                    <td><span class="badge ${aiClass}">${escapeHtml(aiText)}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.viewWritingResultDetail('${item.id}')">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function applySearch() {
        const query = (refs.searchInput?.value || '').trim().toLowerCase();
        if (!query) {
            state.filteredResults = [...state.results];
        } else {
            state.filteredResults = state.results.filter((item) => {
                const searchText = [
                    item.set_title,
                    item.set_id,
                    getBand(item),
                    getUserSearchText(item.user_id)
                ].filter(Boolean).join(' ').toLowerCase();
                return searchText.includes(query);
            });
        }
        renderTable(state.filteredResults);
    }

    async function loadUserMap() {
        const data = await fetchJson('/api/users/list');
        const users = data.users || [];
        state.userMap = new Map(users.map((user) => [user.id, user]));
    }

    async function loadWritingResults() {
        if (refs.tableBody) {
            refs.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-3">
                        <i class="spinner-border spinner-border-sm me-2"></i>Đang tải kết quả Writing...
                    </td>
                </tr>
            `;
        }
        try {
            await loadUserMap();
            const data = await fetchJson('/api/practice_results/list?type=writing&limit=200');
            state.results = data.results || [];
            applySearch();
        } catch (error) {
            if (refs.tableBody) {
                refs.tableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center text-danger py-3">${escapeHtml(error.message)}</td>
                    </tr>
                `;
            }
        }
    }

    function renderAnswerItems(items = [], partKey = '', questionFeedbackMap = {}) {
        if (!Array.isArray(items) || !items.length) {
            return '<div class="text-muted small">Không có dữ liệu câu trả lời.</div>';
        }
        return items.map((item, idx) => {
            const key = item.key || `item_${idx + 1}`;
            const questionId = buildQuestionFeedbackId(partKey, key, idx);
            const savedFeedback = questionFeedbackMap[questionId] || questionFeedbackMap[key] || '';
            const prompt = item.prompt ? `<div class="small text-muted mb-1">${escapeHtml(item.prompt)}</div>` : '';
            const answerText = escapeHtml(item.answer || '—').replace(/\n/g, '<br>');
            const words = Number(item.word_count || 0);
            return `
                <div class="border rounded p-2 mb-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong class="small">${escapeHtml(key)}</strong>
                        <span class="badge bg-light text-dark">${words} từ</span>
                    </div>
                    ${prompt}
                    <div>${answerText}</div>
                    <div class="mt-2">
                        <label class="form-label small mb-1">Nhận xét câu này</label>
                        <textarea
                            class="form-control form-control-sm wr-question-feedback-input"
                            data-question-id="${escapeHtml(questionId)}"
                            rows="2"
                            placeholder="Nhập nhận xét cho câu này..."
                        >${escapeHtml(savedFeedback)}</textarea>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderWritingAnswers(metadata = {}) {
        const userAnswers = metadata.user_answers;
        const questionFeedbackMap = getQuestionFeedbackMap(metadata);
        if (!userAnswers || typeof userAnswers !== 'object') {
            return '<div class="text-muted small">Không có dữ liệu bài làm Writing chi tiết.</div>';
        }
        const sections = Object.keys(userAnswers);
        if (!sections.length) {
            return '<div class="text-muted small">Không có dữ liệu bài làm Writing chi tiết.</div>';
        }
        return sections.map((partKey) => `
            <div class="mb-3">
                <h6 class="small text-primary mb-2">${escapeHtml(partKey.toUpperCase())}</h6>
                ${renderAnswerItems(userAnswers[partKey], partKey, questionFeedbackMap)}
            </div>
        `).join('');
    }

    function collectQuestionFeedbackFromModal() {
        const feedbackMap = {};
        document.querySelectorAll('#writing-result-answers .wr-question-feedback-input').forEach((inputEl) => {
            const questionId = (inputEl?.dataset?.questionId || '').trim();
            if (!questionId) return;
            const value = String(inputEl.value || '').trim();
            if (value) {
                feedbackMap[questionId] = value;
            }
        });
        return feedbackMap;
    }

    function ensureDetailModal() {
        let modalEl = document.getElementById('writing-result-detail-modal');
        if (modalEl) return modalEl;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="modal fade" id="writing-result-detail-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="writing-result-detail-title">Chi tiết kết quả Writing</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-12 col-lg-7">
                                    <div class="border rounded p-3 h-100">
                                        <h6 class="mb-2">Thông tin bài làm</h6>
                                        <div id="writing-result-summary" class="small text-muted mb-3"></div>
                                        <h6 class="mb-2">Nội dung bài viết</h6>
                                        <div id="writing-result-answers"></div>
                                        <hr>
                                        <h6 class="mb-2">Sửa lỗi tự động</h6>
                                        <div id="writing-result-auto-feedback-summary"></div>
                                        <div id="writing-result-auto-feedback"></div>
                                        <hr>
                                        <h6 class="mb-2">Phản hồi AI</h6>
                                        <div id="writing-result-feedback" class="small" style="white-space: pre-wrap; max-height: 280px; overflow-y: auto;"></div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-5">
                                    <div class="border rounded p-3 h-100">
                                        <h6 class="mb-3">Chấm điểm admin</h6>
                                        <div class="mb-2">
                                            <label class="form-label small">Band</label>
                                            <input class="form-control form-control-sm" id="wr-admin-band" placeholder="A2, B1, B2, C...">
                                        </div>
                                        <div class="row g-2">
                                            <div class="col-6">
                                                <label class="form-label small">Điểm</label>
                                                <input type="number" class="form-control form-control-sm" id="wr-admin-score" step="0.1" min="0">
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label small">Tổng điểm</label>
                                                <input type="number" class="form-control form-control-sm" id="wr-admin-max-score" step="0.1" min="0">
                                            </div>
                                        </div>
                                        <div class="mt-2">
                                            <label class="form-label small">Ghi chú admin</label>
                                            <textarea class="form-control form-control-sm" id="wr-admin-note" rows="4"></textarea>
                                        </div>
                                        <button class="btn btn-primary w-100 mt-3" id="wr-save-grade-btn">
                                            <i class="bi bi-save me-1"></i>Lưu chấm điểm
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(wrapper.firstElementChild);
        modalEl = document.getElementById('writing-result-detail-modal');
        document.getElementById('wr-save-grade-btn')?.addEventListener('click', saveWritingGrade);
        return modalEl;
    }

    function renderDetail(result) {
        ensureDetailModal();
        const metadata = result?.metadata && typeof result.metadata === 'object' ? result.metadata : {};
        const aiUsage = getAiUsageInfo(result);
        const summaryEl = document.getElementById('writing-result-summary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div><strong>Học viên:</strong> ${escapeHtml(getUserLabel(result.user_id))}</div>
                <div><strong>Ngày nộp:</strong> ${escapeHtml(formatDateTime(result.submitted_at))}</div>
                <div><strong>Bài:</strong> ${escapeHtml(result.set_title || result.set_id || '—')}</div>
                <div><strong>Điểm:</strong> ${escapeHtml(`${result.total_score || 0}/${result.max_score || 0}`)}</div>
                <div><strong>Band:</strong> ${escapeHtml(getBand(result))}</div>
                <div><strong>Thời gian làm:</strong> ${escapeHtml(formatDurationSeconds(result.duration_seconds))}</div>
                <div><strong>AI Usage:</strong> ${escapeHtml(aiUsage.probability !== null ? `${aiUsage.label} (${aiUsage.probability}%)` : aiUsage.label)}</div>
            `;
        }
        const answersEl = document.getElementById('writing-result-answers');
        if (answersEl) {
            answersEl.innerHTML = renderWritingAnswers(metadata);
        }
        const autoSummaryEl = document.getElementById('writing-result-auto-feedback-summary');
        if (autoSummaryEl) {
            autoSummaryEl.innerHTML = window.WritingAutoFeedback
                ? window.WritingAutoFeedback.renderOverallSummary(metadata)
                : '';
        }
        const autoFeedbackEl = document.getElementById('writing-result-auto-feedback');
        if (autoFeedbackEl) {
            autoFeedbackEl.innerHTML = window.WritingAutoFeedback
                ? window.WritingAutoFeedback.renderSections(metadata)
                : '<div class="text-muted small">Chưa có dữ liệu sửa lỗi tự động.</div>';
        }
        const feedbackEl = document.getElementById('writing-result-feedback');
        if (feedbackEl) {
            const baseFeedback = metadata.ai_feedback || metadata.ai_feedback_preview || 'Không có phản hồi AI.';
            if (aiUsage.reasons.length) {
                const reasonsText = aiUsage.reasons.map((reason, idx) => `${idx + 1}. ${reason}`).join('\n');
                feedbackEl.textContent = `AI Usage: ${aiUsage.probability !== null ? `${aiUsage.label} (${aiUsage.probability}%)` : aiUsage.label}\nNgưỡng cảnh báo: >${aiUsage.threshold}%\n\nDấu hiệu:\n${reasonsText}\n\n--------------------\n${baseFeedback}`;
            } else {
                feedbackEl.textContent = baseFeedback;
            }
        }
        const bandInput = document.getElementById('wr-admin-band');
        if (bandInput) bandInput.value = getBand(result);
        const scoreInput = document.getElementById('wr-admin-score');
        if (scoreInput) scoreInput.value = result.total_score ?? 0;
        const maxInput = document.getElementById('wr-admin-max-score');
        if (maxInput) maxInput.value = result.max_score ?? 0;
        const noteInput = document.getElementById('wr-admin-note');
        if (noteInput) noteInput.value = metadata.admin_note || '';
        if (refs.selectedLabel) {
            refs.selectedLabel.textContent = getUserLabel(result.user_id);
        }
    }

    async function saveWritingGrade() {
        if (!state.selectedResult?.id) return;
        const saveBtn = document.getElementById('wr-save-grade-btn');
        const band = (document.getElementById('wr-admin-band')?.value || '').trim();
        const note = (document.getElementById('wr-admin-note')?.value || '').trim();
        const scoreValue = document.getElementById('wr-admin-score')?.value;
        const maxValue = document.getElementById('wr-admin-max-score')?.value;
        const questionFeedbackMap = collectQuestionFeedbackFromModal();
        const hasQuestionFeedback = Object.keys(questionFeedbackMap).length > 0;

        const payload = {
            id: state.selectedResult.id,
            metadataPatch: {
                band: band || null,
                admin_note: note || null,
                admin_question_feedback: hasQuestionFeedback ? questionFeedbackMap : null
            }
        };
        if (scoreValue !== '' && scoreValue !== undefined) payload.totalScore = Number(scoreValue);
        if (maxValue !== '' && maxValue !== undefined) payload.maxScore = Number(maxValue);

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang lưu...';
        }
        try {
            const data = await fetchJson('/api/practice_results/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const updated = data?.result;
            if (updated?.id) {
                state.selectedResult = updated;
                state.results = state.results.map(item => item.id === updated.id ? updated : item);
                applySearch();
                renderDetail(updated);
            }
            alert('Đã lưu chấm điểm Writing.');
        } catch (error) {
            alert(error.message || 'Không thể lưu chấm điểm Writing.');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="bi bi-save me-1"></i>Lưu chấm điểm';
            }
        }
    }

    window.viewWritingResultDetail = function (resultId) {
        const result = state.results.find(item => item.id === resultId);
        if (!result) {
            alert('Không tìm thấy kết quả Writing.');
            return;
        }
        state.selectedResult = result;
        renderDetail(result);
        const modalEl = ensureDetailModal();
        if (window.bootstrap && modalEl) {
            new bootstrap.Modal(modalEl).show();
        }
    };

    window.initWritingResultsModule = function () {
        state.selectedResult = null;
        if (refs.selectedLabel) refs.selectedLabel.textContent = 'Chưa chọn bài';
        loadWritingResults();
    };

    refs.searchInput?.addEventListener('input', applySearch);
    refs.clearSearchBtn?.addEventListener('click', () => {
        if (refs.searchInput) refs.searchInput.value = '';
        applySearch();
    });
    refs.refreshBtn?.addEventListener('click', loadWritingResults);
})();
