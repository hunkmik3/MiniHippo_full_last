(() => {
    const moduleRoot = document.getElementById('student-lessons-module');
    if (!moduleRoot) {
        return;
    }

    const DISPLAY_STYLE_ID = 'student-result-display-style';

    const refs = {
        searchInput: document.getElementById('student-lessons-search-input'),
        clearSearchBtn: document.getElementById('clear-student-lessons-search-btn'),
        refreshUsersBtn: document.getElementById('refresh-student-lessons-btn'),
        userTableBody: document.getElementById('student-lessons-user-table-body'),
        selectedUserLabel: document.getElementById('student-lessons-selected-user-label'),
        resultsBody: document.getElementById('student-lessons-results-body'),
        refreshResultsBtn: document.getElementById('refresh-student-lessons-results-btn'),
        // Tab "Tổng hợp theo bộ đề"
        setsTab: document.getElementById('student-results-tab-sets'),
        srDateFrom: document.getElementById('sr-date-from'),
        srDateTo: document.getElementById('sr-date-to'),
        srSetSelect: document.getElementById('sr-set-select'),
        srSearch: document.getElementById('sr-search'),
        srReloadBtn: document.getElementById('sr-reload-btn'),
        srExportBtn: document.getElementById('sr-export-btn'),
        srSummary: document.getElementById('sr-summary'),
        srTableBody: document.getElementById('sr-table-body')
    };

    const state = {
        users: [],          // chỉ học viên Aptis ôn thi
        usersById: new Map(),
        usersPromise: null,
        usersInFlight: null,
        filteredUsers: [],
        selectedUser: null,
        results: [],
        loadingUsers: false,
        selectedResultIds: new Set(),
        selectedResult: null,
        resultsLoadSeq: 0,
        // Tab tổng hợp
        sets: [],           // bộ đề Reading/Listening (Reading sets, Listening sets)
        setsById: new Map(),
        aggRows: [],
        aggVisibleRows: [],
        aggLoadSeq: 0,
        aggInitialized: false
    };

    // Trang này chỉ dành cho Aptis ôn thi: Lớp học và VSTEP có trang kết quả riêng.
    const APTIS_ONTHI_COURSES = new Set(['aptis', 'lớp ôn thi', 'lop on thi']);
    function isAptisOnThiStudent(user) {
        if (!user || String(user.role || '').toLowerCase() === 'admin') return false;
        return APTIS_ONTHI_COURSES.has(String(user.course || '').trim().toLowerCase());
    }

    // Supabase trả tối đa 1000 dòng/lần → tải lần lượt từng trang, chỉ bản rút gọn
    // (fields=summary). Mở chi tiết thì lấy bản đầy đủ bằng fetchFullResult.
    const RESULTS_PAGE_SIZE = 1000;
    // isCurrent(): trả false khi đã có lần tải mới hơn → dừng, không tải tiếp các trang thừa.
    async function fetchAllResults(params, onProgress, isCurrent = () => true) {
        const byId = new Map();
        for (let page = 0; page < 60; page += 1) {
            if (!isCurrent()) break;
            const qs = new URLSearchParams({
                ...params,
                fields: 'summary',
                limit: String(RESULTS_PAGE_SIZE),
                offset: String(page * RESULTS_PAGE_SIZE)
            });
            const data = await fetchJson(`/api/practice_results/list?${qs.toString()}`);
            const rows = Array.isArray(data?.results) ? data.results : [];
            // Có bài mới nộp giữa 2 trang thì dòng cuối trang trước bị đẩy sang trang sau → bỏ trùng.
            rows.forEach((row) => { if (row?.id && !byId.has(row.id)) byId.set(row.id, row); });
            if (onProgress) onProgress(byId.size);
            if (rows.length < RESULTS_PAGE_SIZE) break;
        }
        return Array.from(byId.values());
    }

    async function fetchFullResult(resultId) {
        const data = await fetchJson(`/api/practice_results/list?ids=${encodeURIComponent(resultId)}`);
        return (Array.isArray(data?.results) ? data.results : [])[0] || null;
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
            const err = new Error(message);
            err.status = response.status;
            throw err;
        }
        return response.json();
    }

    function escapeHtml(value) {
        if (value === undefined || value === null) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function ensureDisplayStyles() {
        if (document.getElementById(DISPLAY_STYLE_ID)) return;
        const styleEl = document.createElement('style');
        styleEl.id = DISPLAY_STYLE_ID;
        styleEl.textContent = `
            .student-result-answer-card {
                border: 1px solid #dbe3f0;
                border-radius: 1rem;
                padding: 1rem;
                background: #fff;
                margin-bottom: 0.9rem;
                box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
            }
            .student-result-answer-prompt {
                color: #5f6b7a;
                font-size: 0.98rem;
                line-height: 1.6;
                margin-bottom: 0.9rem;
            }
            .student-result-answer-display {
                white-space: pre-wrap;
                overflow-wrap: break-word;
                border: 1px solid #dbe3f0;
                border-radius: 1rem;
                padding: 1rem 1.1rem;
                background: #fff;
                color: #334155;
                line-height: 1.8;
                font-size: 1rem;
                min-height: 7.5rem;
            }
        `;
        document.head.appendChild(styleEl);
    }

    function normalizeDisplayText(value) {
        return String(value || '')
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n[ \t]+/g, '\n')
            .trim();
    }

    function formatDisplayText(value) {
        const normalized = normalizeDisplayText(value);
        return normalized ? escapeHtml(normalized) : '—';
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

    function renderUsers(users) {
        if (!refs.userTableBody) return;
        if (!users.length) {
            refs.userTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-4">
                        <i class="bi bi-inboxes me-2"></i>Chưa có học viên nào.
                    </td>
                </tr>
            `;
            return;
        }
        refs.userTableBody.innerHTML = users
            .map(user => {
                const accountCode = user.username || user.account_code || '—';
                const fullName = user.full_name || '—';
                const email = user.email || '—';
                const isActive = user.status === 'active';
                const rowClass = state.selectedUser?.id === user.id ? 'table-active' : '';
                return `
                    <tr class="${rowClass}" style="cursor: pointer;" onclick="window.selectStudentLessonUser('${user.id}')">
                        <td><code style="white-space: nowrap;">${accountCode}</code></td>
                        <td style="white-space: nowrap;">${fullName}</td>
                        <td class="text-muted" style="word-break: break-word; max-width: 250px;">${email}</td>
                    </tr>
                `;
            })
            .join('');
    }

    // Đang tải dở thì trả lại đúng lần tải đó (tab tổng hợp chờ được danh sách thật).
    function loadUsers() {
        if (!state.usersInFlight) {
            state.usersInFlight = fetchUsers().finally(() => { state.usersInFlight = null; });
        }
        return state.usersInFlight;
    }

    async function fetchUsers() {
        state.loadingUsers = true;
        if (refs.userTableBody) {
            refs.userTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-3">
                        <i class="spinner-border spinner-border-sm me-2"></i>Đang tải danh sách học viên...
                    </td>
                </tr>
            `;
        }
        try {
            const data = await fetchJson('/api/users/list');
            state.users = (data.users || []).filter(isAptisOnThiStudent);
            state.usersById = new Map(state.users.map((user) => [user.id, user]));
            applySearchFilter();
        } catch (error) {
            if (refs.userTableBody) {
                refs.userTableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-center text-danger py-3">${error.message}</td>
                    </tr>
                `;
            }
        } finally {
            state.loadingUsers = false;
        }
    }

    // Tab tổng hợp cần danh sách học viên để ghép tên → dùng chung 1 lần tải.
    function ensureUsersLoaded() {
        if (!state.usersPromise) state.usersPromise = loadUsers();
        return state.usersPromise;
    }

    function applySearchFilter() {
        const query = (refs.searchInput?.value || '').toLowerCase().trim();
        if (!query) {
            state.filteredUsers = state.users;
        } else {
            state.filteredUsers = state.users.filter(user => {
                const accountCode = (user.username || user.account_code || '').toLowerCase();
                const fullName = (user.full_name || '').toLowerCase();
                const email = (user.email || '').toLowerCase();
                return accountCode.includes(query) || fullName.includes(query) || email.includes(query);
            });
        }
        renderUsers(state.filteredUsers);
    }

    function calculateBand(practiceType, totalScore) {
        if (!practiceType || totalScore === undefined || totalScore === null) {
            return '—';
        }

        const type = practiceType.toLowerCase();
        let band = '';

        if (type === 'listening') {
            if (totalScore >= 42) {
                band = 'C';
            } else if (totalScore >= 34) {
                band = 'B2';
            } else if (totalScore >= 24) {
                band = 'B1';
            } else if (totalScore >= 16) {
                band = 'A2';
            } else {
                band = 'Chưa đạt A2';
            }
        } else if (type === 'reading') {
            if (totalScore >= 46) {
                band = 'C';
            } else if (totalScore >= 38) {
                band = 'B2';
            } else if (totalScore >= 26) {
                band = 'B1';
            } else if (totalScore >= 16) {
                band = 'A2';
            } else {
                band = 'Chưa đạt A2';
            }
        } else {
            return '—';
        }

        return band;
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

    function ensureResultDetailModal() {
        let modalEl = document.getElementById('student-result-detail-modal');
        if (modalEl) return modalEl;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="modal fade" id="student-result-detail-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="student-result-detail-title">Chi tiết kết quả</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-12 col-lg-7">
                                    <div class="border rounded p-3 h-100">
                                        <h6 class="mb-3">Thông tin bài làm</h6>
                                        <div id="student-result-detail-summary" class="small text-muted"></div>
                                        <hr>
                                        <h6 class="mb-2">Nội dung Writing</h6>
                                        <div id="student-result-writing-answers"></div>
                                        <hr>
                                        <h6 class="mb-2">Sửa lỗi tự động</h6>
                                        <div id="student-result-auto-writing-summary"></div>
                                        <div id="student-result-auto-writing"></div>
                                        <hr>
                                        <h6 class="mb-2">Nhận xét AI</h6>
                                        <div id="student-result-ai-feedback" class="small" style="white-space: pre-wrap; max-height: 280px; overflow-y: auto;"></div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-5">
                                    <div class="border rounded p-3 h-100">
                                        <h6 class="mb-3">Chấm điểm admin</h6>
                                        <div class="mb-2">
                                            <label class="form-label small">Band</label>
                                            <input class="form-control form-control-sm" id="student-result-admin-band" placeholder="A2, B1, B2, C...">
                                        </div>
                                        <div class="row g-2">
                                            <div class="col-6">
                                                <label class="form-label small">Điểm</label>
                                                <input type="number" class="form-control form-control-sm" id="student-result-admin-score" step="0.1" min="0">
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label small">Tổng điểm</label>
                                                <input type="number" class="form-control form-control-sm" id="student-result-admin-max-score" step="0.1" min="0">
                                            </div>
                                        </div>
                                        <div class="mt-2">
                                            <label class="form-label small">Ghi chú</label>
                                            <textarea class="form-control form-control-sm" id="student-result-admin-note" rows="4" placeholder="Nhận xét/chấm tay của admin"></textarea>
                                        </div>
                                        <div class="alert alert-light border small mt-3 mb-0">
                                            Dữ liệu lưu vào metadata: band, admin_note, admin_question_feedback, admin_graded_at.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                            <button type="button" class="btn btn-primary" id="save-student-result-grade-btn">
                                <i class="bi bi-save me-1"></i>Lưu chấm điểm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(wrapper.firstElementChild);
        modalEl = document.getElementById('student-result-detail-modal');
        const saveBtn = document.getElementById('save-student-result-grade-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveResultDetailGrading);
        }
        return modalEl;
    }

    function getPartLabel(partKey) {
        if (!partKey) return '';
        const normalized = String(partKey).replace(/^part/i, '');
        return `Part ${normalized}`;
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

    function renderAnswerItems(items = [], partKey = '', questionFeedbackMap = {}) {
        ensureDisplayStyles();
        if (!Array.isArray(items) || !items.length) {
            return '<div class="text-muted small">Không có dữ liệu câu trả lời.</div>';
        }
        return items.map((item, idx) => {
            const key = item.key || `item_${idx + 1}`;
            const questionId = buildQuestionFeedbackId(partKey, key, idx);
            const savedFeedback = questionFeedbackMap[questionId] || questionFeedbackMap[key] || '';
            const prompt = item.prompt ? `<div class="student-result-answer-prompt"><em>${escapeHtml(item.prompt)}</em></div>` : '';
            const answerText = formatDisplayText(item.answer);
            const words = Number(item.word_count || 0);
            return `
                <div class="student-result-answer-card">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong class="small">${escapeHtml(key)}</strong>
                        <span class="badge bg-light text-dark">${words} từ</span>
                    </div>
                    ${prompt}
                    <div class="student-result-answer-display">${answerText}</div>
                    <div class="mt-2">
                        <label class="form-label small mb-1">Nhận xét câu này</label>
                        <textarea
                            class="form-control form-control-sm student-question-feedback-input"
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
                <h6 class="small text-primary mb-2">${escapeHtml(getPartLabel(partKey))}</h6>
                ${renderAnswerItems(userAnswers[partKey], partKey, questionFeedbackMap)}
            </div>
        `).join('');
    }

    function collectQuestionFeedbackFromDetailModal() {
        const feedbackMap = {};
        document.querySelectorAll('#student-result-writing-answers .student-question-feedback-input').forEach((inputEl) => {
            const questionId = (inputEl?.dataset?.questionId || '').trim();
            if (!questionId) return;
            const value = String(inputEl.value || '').trim();
            if (value) {
                feedbackMap[questionId] = value;
            }
        });
        return feedbackMap;
    }

    function renderResultDetail(result) {
        ensureResultDetailModal();
        const metadata = result?.metadata && typeof result.metadata === 'object'
            ? result.metadata
            : {};
        const aiFeedback = metadata.ai_feedback || metadata.ai_feedback_preview || '';
        const type = result.practice_type
            ? result.practice_type.charAt(0).toUpperCase() + result.practice_type.slice(1)
            : '—';
        const band = resolveDisplayBand(result, metadata);
        const score = resolveDisplayScore(result, metadata);

        const titleEl = document.getElementById('student-result-detail-title');
        if (titleEl) {
            titleEl.textContent = `Chi tiết kết quả · ${type}`;
        }

        const summaryEl = document.getElementById('student-result-detail-summary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div><strong>Ngày nộp:</strong> ${escapeHtml(formatDateTime(result.submitted_at))}</div>
                <div><strong>Bài:</strong> ${escapeHtml(result.set_title || result.set_id || '—')}</div>
                <div><strong>Điểm:</strong> ${escapeHtml(score)}</div>
                <div><strong>Band:</strong> ${escapeHtml(band || '—')}</div>
                <div><strong>Thời gian làm:</strong> ${escapeHtml(formatDurationSeconds(result.duration_seconds))}</div>
            `;
        }

        const answersEl = document.getElementById('student-result-writing-answers');
        if (answersEl) {
            if (result.practice_type === 'writing') {
                answersEl.innerHTML = renderWritingAnswers(metadata);
            } else {
                answersEl.innerHTML = '<div class="text-muted small">Chi tiết bài làm hiện hỗ trợ tốt nhất cho Writing.</div>';
            }
        }
        const autoSummaryEl = document.getElementById('student-result-auto-writing-summary');
        const autoWritingEl = document.getElementById('student-result-auto-writing');
        if (result.practice_type === 'writing') {
            if (autoSummaryEl) {
                autoSummaryEl.innerHTML = window.WritingAutoFeedback
                    ? window.WritingAutoFeedback.renderOverallSummary(metadata)
                    : '';
            }
            if (autoWritingEl) {
                autoWritingEl.innerHTML = window.WritingAutoFeedback
                    ? window.WritingAutoFeedback.renderSections(metadata)
                    : '<div class="text-muted small">Chưa có dữ liệu sửa lỗi tự động.</div>';
            }
        } else {
            if (autoSummaryEl) autoSummaryEl.innerHTML = '';
            if (autoWritingEl) autoWritingEl.innerHTML = '';
        }

        const feedbackEl = document.getElementById('student-result-ai-feedback');
        if (feedbackEl) {
            feedbackEl.textContent = aiFeedback || 'Không có phản hồi AI được lưu.';
        }

        const bandInput = document.getElementById('student-result-admin-band');
        if (bandInput) {
            bandInput.value = metadata.admin_graded_at ? (band || '') : '';
        }
        const scoreInput = document.getElementById('student-result-admin-score');
        if (scoreInput) {
            scoreInput.value = metadata.admin_graded_at ? (result.total_score ?? 0) : 0;
        }
        const maxScoreInput = document.getElementById('student-result-admin-max-score');
        if (maxScoreInput) {
            maxScoreInput.value = metadata.admin_graded_at ? (result.max_score ?? 0) : 0;
        }
        const noteInput = document.getElementById('student-result-admin-note');
        if (noteInput) {
            noteInput.value = metadata.admin_note || '';
        }
    }

    async function saveResultDetailGrading() {
        if (!state.selectedResult || !state.selectedResult.id) {
            alert('Không tìm thấy kết quả để cập nhật.');
            return;
        }

        const saveBtn = document.getElementById('save-student-result-grade-btn');
        const bandInput = document.getElementById('student-result-admin-band');
        const scoreInput = document.getElementById('student-result-admin-score');
        const maxScoreInput = document.getElementById('student-result-admin-max-score');
        const noteInput = document.getElementById('student-result-admin-note');

        const band = (bandInput?.value || '').trim();
        const note = (noteInput?.value || '').trim();
        const scoreValue = scoreInput?.value;
        const maxScoreValue = maxScoreInput?.value;
        const questionFeedbackMap = collectQuestionFeedbackFromDetailModal();
        const hasQuestionFeedback = Object.keys(questionFeedbackMap).length > 0;

        const payload = {
            id: state.selectedResult.id,
            metadataPatch: {
                band: band || null,
                admin_note: note || null,
                admin_question_feedback: hasQuestionFeedback ? questionFeedbackMap : null
            }
        };

        if (scoreValue !== '' && scoreValue !== undefined) {
            payload.totalScore = Number(scoreValue);
        }
        if (maxScoreValue !== '' && maxScoreValue !== undefined) {
            payload.maxScore = Number(maxScoreValue);
        }

        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang lưu...';
        }

        try {
            const response = await fetchJson('/api/practice_results/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const updated = response?.result;
            if (updated?.id) {
                state.selectedResult = updated;
                state.results = state.results.map(item => item.id === updated.id ? updated : item);
                renderResults(state.results);
                if (state.aggRows.some(item => item.id === updated.id)) {
                    state.aggRows = state.aggRows.map(item => item.id === updated.id ? updated : item);
                    renderAggregate();
                }
                renderResultDetail(updated);
            }
            alert('Đã lưu chấm điểm thành công.');
        } catch (error) {
            alert(error.message || 'Không thể lưu chấm điểm.');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="bi bi-save me-1"></i>Lưu chấm điểm';
            }
        }
    }

    function renderResults(results) {
        if (!refs.resultsBody) return;
        state.results = Array.isArray(results) ? results : [];
        if (!results.length) {
            refs.resultsBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-3">Chưa có kết quả nào.</td>
                </tr>
            `;
            state.selectedResultIds.clear();
            updateSelectAllCheckbox();
            updateBulkDeleteButton();
            return;
        }

        refs.resultsBody.innerHTML = results
            .map(item => {
                const submittedAt = formatDateTime(item.submitted_at);
                const practiceType = item.practice_type
                    ? item.practice_type.charAt(0).toUpperCase() + item.practice_type.slice(1)
                    : '—';
                const duration = formatDurationSeconds(item.duration_seconds);
                const metadata = item.metadata && typeof item.metadata === 'object' ? item.metadata : {};
                const band = resolveDisplayBand(item, metadata);
                const score = resolveDisplayScore(item, metadata);

                const isChecked = state.selectedResultIds.has(item.id);
                const detailBtn = item.id
                    ? `<button class="btn btn-sm btn-outline-primary" onclick="window.viewResultDetail('${item.id}')">
                        <i class="bi bi-eye"></i>
                    </button>`
                    : '—';
                return `
                    <tr>
                        <td>
                            <input type="checkbox" class="form-check-input result-checkbox" 
                                   data-result-id="${item.id}" 
                                   ${isChecked ? 'checked' : ''}>
                        </td>
                        <td>${submittedAt}</td>
                        <td>${practiceType}</td>
                        <td><strong>${score}</strong></td>
                        <td><span class="badge bg-info">${band}</span></td>
                        <td>${duration}</td>
                        <td>${detailBtn}</td>
                    </tr>
                `;
            })
            .join('');

        // Attach checkbox event listeners
        refs.resultsBody.querySelectorAll('.result-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const resultId = e.target.dataset.resultId;
                if (e.target.checked) {
                    state.selectedResultIds.add(resultId);
                } else {
                    state.selectedResultIds.delete(resultId);
                }
                updateSelectAllCheckbox();
                updateBulkDeleteButton();
            });
        });

        updateSelectAllCheckbox();
        updateBulkDeleteButton();
    }

    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('select-all-results');
        if (!selectAllCheckbox) return;

        const checkboxes = refs.resultsBody?.querySelectorAll('.result-checkbox') || [];
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;

        if (checkedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === checkboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    function updateBulkDeleteButton() {
        const bulkDeleteBtn = document.getElementById('bulk-delete-results-btn');
        if (!bulkDeleteBtn) return;

        const selectedCount = state.selectedResultIds.size;
        if (selectedCount > 0) {
            bulkDeleteBtn.style.display = 'block';
            bulkDeleteBtn.innerHTML = `<i class="bi bi-trash me-1"></i>Xóa đã chọn (${selectedCount})`;
        } else {
            bulkDeleteBtn.style.display = 'none';
        }
    }

    async function bulkDeleteResults() {
        const selectedIds = Array.from(state.selectedResultIds);
        if (!selectedIds.length) {
            alert('Vui lòng chọn ít nhất một kết quả để xóa.');
            return;
        }

        const confirmed = confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} kết quả đã chọn?`);
        if (!confirmed) return;

        try {
            const response = await fetchJson('/api/practice_results/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });

            alert(`Đã xóa thành công ${selectedIds.length} kết quả.`);
            state.selectedResultIds.clear();

            // Reload results
            if (state.selectedUser) {
                loadResults(state.selectedUser.id);
            }
        } catch (error) {
            alert(error.message || 'Không thể xóa kết quả');
        }
    }

    async function loadResults(userId) {
        if (!userId) return;
        const loadSeq = ++state.resultsLoadSeq;
        state.selectedResult = null;
        state.selectedResultIds.clear();
        if (refs.resultsBody) {
            refs.resultsBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-3">
                        <i class="spinner-border spinner-border-sm me-2"></i>Đang tải kết quả...
                    </td>
                </tr>
            `;
        }
        try {
            // Tải HẾT bài của học viên (trước đây chỉ 100 bài mới nhất).
            const results = await fetchAllResults({ userId }, null, () => loadSeq === state.resultsLoadSeq);
            if (loadSeq !== state.resultsLoadSeq) return; // đã chọn học viên khác
            const nonWritingResults = results.filter(item => item.practice_type !== 'writing');
            renderResults(nonWritingResults);
        } catch (error) {
            if (loadSeq !== state.resultsLoadSeq) return;
            if (refs.resultsBody) {
                refs.resultsBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center text-danger py-3">${error.message}</td>
                    </tr>
                `;
            }
        }
    }

    window.selectStudentLessonUser = function (userId) {
        const user = state.users.find(item => item.id === userId);
        if (!user) return;
        state.selectedUser = user;

        // Update label
        if (refs.selectedUserLabel) {
            const accountCode = user.username || user.account_code || '—';
            const fullName = user.full_name || '—';
            refs.selectedUserLabel.textContent = `${accountCode} - ${fullName}`;
        }

        // Show refresh button
        if (refs.refreshResultsBtn) {
            refs.refreshResultsBtn.style.display = 'block';
        }

        // Load results
        loadResults(user.id);

        // Re-render users to highlight selected
        renderUsers(state.filteredUsers);
    };

    // Bảng chỉ giữ bản rút gọn → lấy bản đầy đủ (ghi chú, câu trả lời...) rồi mới mở.
    async function openResultDetail(result) {
        if (!result) {
            alert('Không tìm thấy dữ liệu kết quả.');
            return;
        }
        let full = result;
        if (result._summary) {
            try {
                full = await fetchFullResult(result.id);
            } catch (error) {
                alert(error.message || 'Không tải được chi tiết kết quả.');
                return;
            }
            if (!full) {
                alert('Kết quả này không còn tồn tại.');
                return;
            }
        }
        state.selectedResult = full;
        renderResultDetail(full);
        const modalEl = ensureResultDetailModal();
        if (window.bootstrap && modalEl) {
            bootstrap.Modal.getOrCreateInstance(modalEl).show();
        }
    }

    window.viewResultDetail = function (resultId) {
        return openResultDetail(state.results.find(item => item.id === resultId));
    };

    window.viewAggregateResultDetail = function (resultId) {
        return openResultDetail(state.aggRows.find(item => item.id === resultId));
    };

    /* ═══════════════════════════════════════════════════════
       TỔNG HỢP THEO BỘ ĐỀ — giống "DS Trả BTVN" bên Lớp Học:
       lọc ngày nộp + bộ đề ở server, tìm học viên ở client, xuất CSV.
       ═══════════════════════════════════════════════════════ */

    function toDateInputValue(date) {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    // "2026-09-27" → mốc 00:00 giờ máy (giờ Việt Nam). addDays để lấy mốc cuối ngày.
    function localDayStart(value, addDays = 0) {
        const [y, m, d] = String(value || '').split('-').map(Number);
        if (!y || !m || !d) return null;
        return new Date(y, m - 1, d + addDays);
    }

    function byTitleNumeric(a, b) {
        return String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true, sensitivity: 'base' });
    }

    async function loadSetOptions() {
        const data = await fetchJson('/api/practice_sets/list?fields=summary');
        const sets = (Array.isArray(data?.sets) ? data.sets : [])
            .filter((set) => ['reading', 'listening'].includes(String(set.logical_type || '').toLowerCase()));
        state.sets = sets;
        state.setsById = new Map(sets.map((set) => [set.id, set]));
        if (!refs.srSetSelect) return;
        const current = refs.srSetSelect.value;
        const group = (type, label) => {
            const items = sets.filter((set) => set.logical_type === type).sort(byTitleNumeric);
            if (!items.length) return '';
            return `<optgroup label="${label}">${items.map((set) =>
                `<option value="${escapeHtml(set.id)}">${escapeHtml(set.title || set.id)}</option>`).join('')}</optgroup>`;
        };
        refs.srSetSelect.innerHTML = '<option value="">Tất cả bộ đề Reading + Listening</option>'
            + group('reading', 'Reading sets') + group('listening', 'Listening sets');
        if (current && state.setsById.has(current)) refs.srSetSelect.value = current;
    }

    function setAggregateMessage(html, className = 'text-muted') {
        if (refs.srTableBody) {
            refs.srTableBody.innerHTML = `<tr><td colspan="10" class="text-center ${className} py-3">${html}</td></tr>`;
        }
    }

    async function loadAggregate() {
        const loadSeq = ++state.aggLoadSeq;
        const fromValue = refs.srDateFrom?.value || '';
        const toValue = refs.srDateTo?.value || '';
        const from = localDayStart(fromValue);
        const toExclusive = localDayStart(toValue, 1);
        if (refs.srExportBtn) refs.srExportBtn.disabled = true;
        if (refs.srSummary) refs.srSummary.innerHTML = '';
        if (!from || !toExclusive) {
            state.aggRows = [];
            setAggregateMessage('Chọn đủ "Từ ngày" và "Đến ngày".');
            return;
        }
        if (from >= toExclusive) {
            state.aggRows = [];
            setAggregateMessage('"Từ ngày" phải trước hoặc bằng "Đến ngày".', 'text-danger');
            return;
        }
        setAggregateMessage('<i class="spinner-border spinner-border-sm me-2"></i>Đang tải kết quả...');

        try {
            if (!state.sets.length) await loadSetOptions();
            await ensureUsersLoaded();
            if (!state.usersById.size) {
                // Không có danh sách học viên thì mọi dòng bị lọc mất → báo rõ thay vì "không có bài".
                state.aggRows = [];
                setAggregateMessage('Không tải được danh sách học viên Aptis ôn thi — bấm "Tải lại".', 'text-danger');
                return;
            }
            const selectedSetId = refs.srSetSelect?.value || '';
            const setIds = selectedSetId ? [selectedSetId] : state.sets.map((set) => set.id);
            if (!setIds.length) {
                state.aggRows = [];
                setAggregateMessage('Chưa có bộ đề Reading/Listening nào.');
                return;
            }
            const rows = await fetchAllResults({
                setIds: setIds.join(','),
                dateFrom: from.toISOString(),
                dateTo: toExclusive.toISOString()
            }, (count) => {
                if (loadSeq === state.aggLoadSeq && count >= RESULTS_PAGE_SIZE) {
                    setAggregateMessage(`<i class="spinner-border spinner-border-sm me-2"></i>Đang tải kết quả... (${count} bài)`);
                }
            }, () => loadSeq === state.aggLoadSeq);
            if (loadSeq !== state.aggLoadSeq) return; // đã đổi bộ lọc, có lần tải mới hơn
            // Chỉ học viên Aptis ôn thi (bỏ bài của admin, học viên Lớp học/VSTEP).
            state.aggRows = rows
                .filter((row) => state.usersById.has(row.user_id))
                .sort((a, b) => new Date(b.submitted_at || 0) - new Date(a.submitted_at || 0));
            renderAggregate();
        } catch (error) {
            if (loadSeq !== state.aggLoadSeq) return;
            state.aggRows = [];
            setAggregateMessage(`Không tải được kết quả: ${escapeHtml(error.message || 'Lỗi không xác định')}`, 'text-danger');
        }
    }

    function aggregateRowInfo(row) {
        const user = state.usersById.get(row.user_id) || {};
        const set = state.setsById.get(row.set_id);
        const type = String(row.practice_type || '').toLowerCase();
        return {
            submittedAt: formatDateTime(row.submitted_at),
            accountCode: user.account_code || user.username || '',
            fullName: user.full_name || '',
            email: user.email || '',
            setTitle: (set && set.title) || row.set_title || row.set_id || '',
            typeLabel: type ? type.charAt(0).toUpperCase() + type.slice(1) : '',
            score: resolveDisplayScore(row, row.metadata || {}),
            band: resolveDisplayBand(row, row.metadata || {}),
            duration: formatDurationSeconds(row.duration_seconds)
        };
    }

    const AGG_RENDER_LIMIT = 2000;

    function renderAggregate() {
        const query = String(refs.srSearch?.value || '').trim().toLowerCase();
        const visible = query
            ? state.aggRows.filter((row) => {
                const user = state.usersById.get(row.user_id) || {};
                return [user.account_code, user.username, user.full_name, user.email]
                    .some((value) => String(value || '').toLowerCase().includes(query));
            })
            : state.aggRows;
        state.aggVisibleRows = visible;
        if (refs.srExportBtn) refs.srExportBtn.disabled = !visible.length;

        if (refs.srSummary) {
            const readingCount = visible.filter((row) => row.practice_type === 'reading').length;
            const studentCount = new Set(visible.map((row) => row.user_id)).size;
            refs.srSummary.innerHTML = `
                <span class="sr-summary-chip"><i class="bi bi-journal-check"></i>${visible.length} bài</span>
                <span class="sr-summary-chip"><i class="bi bi-people"></i>${studentCount} học viên</span>
                <span class="sr-summary-chip">Reading ${readingCount}</span>
                <span class="sr-summary-chip">Listening ${visible.length - readingCount}</span>
            `;
        }

        if (!visible.length) {
            setAggregateMessage('Không có bài làm nào khớp bộ lọc.');
            return;
        }
        const shown = visible.slice(0, AGG_RENDER_LIMIT);
        const rowsHtml = shown.map((row, index) => {
            const info = aggregateRowInfo(row);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td style="white-space: nowrap;">${escapeHtml(info.submittedAt)}</td>
                    <td><code style="white-space: nowrap;">${escapeHtml(info.accountCode || '—')}</code></td>
                    <td style="white-space: nowrap;">${escapeHtml(info.fullName || '—')}</td>
                    <td style="white-space: nowrap;">${escapeHtml(info.setTitle || '—')}</td>
                    <td>${escapeHtml(info.typeLabel || '—')}</td>
                    <td><strong>${escapeHtml(info.score)}</strong></td>
                    <td><span class="badge bg-info">${escapeHtml(info.band)}</span></td>
                    <td style="white-space: nowrap;">${escapeHtml(info.duration)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.viewAggregateResultDetail('${escapeHtml(row.id)}')">
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        const more = visible.length > shown.length
            ? `<tr><td colspan="10" class="text-center text-muted small py-2">Đang hiện ${shown.length}/${visible.length} bài đầu tiên — bấm "Xuất file CSV" để lấy đủ, hoặc thu hẹp bộ lọc.</td></tr>`
            : '';
        refs.srTableBody.innerHTML = rowsHtml + more;
    }

    function csvCell(value) {
        return `"${String(value ?? '').replace(/"/g, '""')}"`;
    }

    function exportAggregateCsv() {
        const rows = state.aggVisibleRows || [];
        if (!rows.length) {
            alert('Chưa có kết quả nào để xuất (kiểm tra bộ lọc).');
            return;
        }
        const header = ['STT', 'Mã HV', 'Họ tên', 'Email', 'Bộ đề', 'Ngày', 'Loại', 'Điểm', 'Band', 'Thời gian'];
        const lines = rows.map((row, index) => {
            const info = aggregateRowInfo(row);
            return [index + 1, info.accountCode, info.fullName, info.email, info.setTitle,
                info.submittedAt, info.typeLabel, info.score, info.band, info.duration].map(csvCell).join(',');
        });
        const setPart = refs.srSetSelect?.value
            ? `_${(state.setsById.get(refs.srSetSelect.value)?.title || 'bo-de').replace(/[^\p{L}\p{N}]+/gu, '-')}`
            : '';
        const fileName = `KetQua_OnThi_${refs.srDateFrom?.value || ''}_${refs.srDateTo?.value || ''}${setPart}.csv`;
        // BOM để Excel đọc đúng tiếng Việt.
        const blob = new Blob(['\uFEFF' + [header.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function initAggregateTab() {
        if (state.aggInitialized) return;
        state.aggInitialized = true;
        // Mặc định 7 ngày gần nhất: đủ để xem nhanh, không tải cả chục nghìn bài.
        const today = new Date();
        const weekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
        if (refs.srDateFrom && !refs.srDateFrom.value) refs.srDateFrom.value = toDateInputValue(weekAgo);
        if (refs.srDateTo && !refs.srDateTo.value) refs.srDateTo.value = toDateInputValue(today);
        loadAggregate();
    }

    [refs.srDateFrom, refs.srDateTo, refs.srSetSelect].forEach((el) => {
        if (el) el.addEventListener('change', loadAggregate);
    });
    if (refs.srSearch) refs.srSearch.addEventListener('input', renderAggregate);
    if (refs.srReloadBtn) refs.srReloadBtn.addEventListener('click', async () => {
        // Tải lại cả danh sách bộ đề (có thể vừa tạo bộ mới) + học viên.
        state.usersPromise = loadUsers();
        try { await loadSetOptions(); } catch (error) { /* loadAggregate sẽ báo lỗi */ }
        loadAggregate();
    });
    if (refs.srExportBtn) refs.srExportBtn.addEventListener('click', exportAggregateCsv);
    if (refs.setsTab) refs.setsTab.addEventListener('shown.bs.tab', initAggregateTab);

    // Event listeners
    if (refs.searchInput) {
        refs.searchInput.addEventListener('input', applySearchFilter);
    }

    if (refs.clearSearchBtn) {
        refs.clearSearchBtn.addEventListener('click', () => {
            if (refs.searchInput) {
                refs.searchInput.value = '';
                applySearchFilter();
            }
        });
    }

    if (refs.refreshUsersBtn) {
        refs.refreshUsersBtn.addEventListener('click', loadUsers);
    }

    if (refs.refreshResultsBtn) {
        refs.refreshResultsBtn.addEventListener('click', () => {
            if (state.selectedUser) {
                loadResults(state.selectedUser.id);
            }
        });
    }

    // Select all checkbox handler
    const selectAllCheckbox = document.getElementById('select-all-results');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = refs.resultsBody?.querySelectorAll('.result-checkbox') || [];
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
                const resultId = checkbox.dataset.resultId;
                if (e.target.checked) {
                    state.selectedResultIds.add(resultId);
                } else {
                    state.selectedResultIds.delete(resultId);
                }
            });
            updateBulkDeleteButton();
        });
    }

    // Bulk delete button handler
    const bulkDeleteBtn = document.getElementById('bulk-delete-results-btn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', bulkDeleteResults);
    }

    // Initialize module
    window.initStudentLessonsModule = function () {
        state.usersPromise = loadUsers();
        state.selectedUser = null;
        state.selectedResult = null;
        state.results = [];
        if (refs.selectedUserLabel) {
            refs.selectedUserLabel.textContent = 'Chọn học viên để xem kết quả';
        }
        if (refs.refreshResultsBtn) {
            refs.refreshResultsBtn.style.display = 'none';
        }
        if (refs.resultsBody) {
            refs.resultsBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted">Chọn học viên để xem kết quả bài học.</td>
                </tr>
            `;
        }
        state.selectedResultIds.clear();
        updateBulkDeleteButton();
    };
})();
