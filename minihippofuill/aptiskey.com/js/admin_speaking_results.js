(() => {
    const moduleRoot = document.getElementById('speaking-results-module');
    if (!moduleRoot) {
        return;
    }

    const refs = {
        searchInput: document.getElementById('speaking-results-search-input'),
        clearSearchBtn: document.getElementById('clear-speaking-results-search-btn'),
        refreshBtn: document.getElementById('refresh-speaking-results-btn'),
        tableBody: document.getElementById('speaking-results-table-body'),
        selectedLabel: document.getElementById('speaking-results-selected-label')
    };

    const state = {
        userMap: new Map(),
        results: [],
        filtered: [],
        selected: null
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
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Yêu cầu thất bại');
        }
        return data;
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

    function getBand(result) {
        const metadata = result?.metadata && typeof result.metadata === 'object' ? result.metadata : {};
        return metadata.band || 'Pending';
    }

    function isGraded(result) {
        const metadata = result?.metadata && typeof result.metadata === 'object' ? result.metadata : {};
        return Boolean(metadata.admin_graded_at);
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
        return [user.username, user.account_code, user.full_name, user.email]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
    }

    function renderTable(results) {
        if (!refs.tableBody) return;

        if (!results.length) {
            refs.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-4">
                        <i class="bi bi-inboxes me-2"></i>Chưa có kết quả Speaking.
                    </td>
                </tr>
            `;
            return;
        }

        refs.tableBody.innerHTML = results.map((item) => {
            const graded = isGraded(item);
            const score = `${item.total_score || 0}/${item.max_score || 0}`;
            return `
                <tr>
                    <td>${escapeHtml(formatDateTime(item.submitted_at))}</td>
                    <td>${escapeHtml(getUserLabel(item.user_id))}</td>
                    <td>${escapeHtml(item.set_title || item.set_id || '—')}</td>
                    <td><span class="badge bg-info">${escapeHtml(getBand(item))}</span></td>
                    <td><strong>${escapeHtml(score)}</strong></td>
                    <td>${escapeHtml(formatDurationSeconds(item.duration_seconds))}</td>
                    <td><span class="badge ${graded ? 'bg-success' : 'bg-warning text-dark'}">${graded ? 'Đã chấm' : 'Chờ chấm'}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.viewSpeakingResultDetail('${item.id}')">
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
            state.filtered = [...state.results];
        } else {
            state.filtered = state.results.filter((item) => {
                const text = [
                    item.set_title,
                    item.set_id,
                    getBand(item),
                    getUserSearchText(item.user_id)
                ].filter(Boolean).join(' ').toLowerCase();
                return text.includes(query);
            });
        }
        renderTable(state.filtered);
    }

    async function loadUsers() {
        const data = await fetchJson('/api/users/list');
        const users = Array.isArray(data.users) ? data.users : [];
        state.userMap = new Map(users.map(user => [user.id, user]));
    }

    async function loadSpeakingResults() {
        if (refs.tableBody) {
            refs.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center text-muted py-3">
                        <i class="spinner-border spinner-border-sm me-2"></i>Đang tải kết quả Speaking...
                    </td>
                </tr>
            `;
        }

        try {
            await loadUsers();
            const data = await fetchJson('/api/practice_results/list?type=speaking&limit=200');
            state.results = Array.isArray(data.results) ? data.results : [];
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

    function renderAnswerBlocks(metadata = {}) {
        const answers = Array.isArray(metadata.speaking_answers) ? metadata.speaking_answers : [];
        if (!answers.length) {
            return '<div class="text-muted small">Không có dữ liệu câu trả lời Speaking.</div>';
        }

        return answers.map((item, index) => {
            const answerText = escapeHtml(item.answer || '—').replace(/\n/g, '<br>');
            const recordingUrl = typeof item.recording_url === 'string' ? item.recording_url.trim() : '';
            const recordingPlayer = recordingUrl
                ? `
                    <div class="mt-2">
                        <div class="small text-muted mb-1">File ghi âm</div>
                        <audio controls preload="none" style="width:100%;">
                            <source src="${escapeHtml(recordingUrl)}">
                        </audio>
                    </div>
                `
                : '<div class="small text-muted mt-2">Chưa có file ghi âm.</div>';
            return `
                <div class="border rounded p-2 mb-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <strong class="small">${escapeHtml(item.page || item.key || `Câu ${index + 1}`)}</strong>
                        <span class="badge bg-light text-dark">${escapeHtml(String(item.word_count || 0))} từ</span>
                    </div>
                    ${item.prompt ? `<div class="small text-muted mb-1">${escapeHtml(item.prompt)}</div>` : ''}
                    <div>${answerText}</div>
                    ${recordingPlayer}
                </div>
            `;
        }).join('');
    }

    function ensureModal() {
        let modalEl = document.getElementById('speaking-result-detail-modal');
        if (modalEl) return modalEl;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="modal fade" id="speaking-result-detail-modal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Chi tiết kết quả Speaking</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row g-3">
                                <div class="col-12 col-lg-7">
                                    <div class="border rounded p-3 h-100">
                                        <h6 class="mb-2">Thông tin bài làm</h6>
                                        <div id="sr-summary" class="small text-muted mb-3"></div>
                                        <h6 class="mb-2">Câu trả lời học viên</h6>
                                        <div id="sr-answers"></div>
                                    </div>
                                </div>
                                <div class="col-12 col-lg-5">
                                    <div class="border rounded p-3 h-100">
                                        <h6 class="mb-3">Chấm điểm admin</h6>
                                        <div class="mb-2">
                                            <label class="form-label small">Band</label>
                                            <input class="form-control form-control-sm" id="sr-admin-band" placeholder="A2, B1, B2, C...">
                                        </div>
                                        <div class="row g-2">
                                            <div class="col-6">
                                                <label class="form-label small">Điểm</label>
                                                <input type="number" class="form-control form-control-sm" id="sr-admin-score" step="0.1" min="0">
                                            </div>
                                            <div class="col-6">
                                                <label class="form-label small">Tổng điểm</label>
                                                <input type="number" class="form-control form-control-sm" id="sr-admin-max-score" step="0.1" min="0">
                                            </div>
                                        </div>
                                        <div class="mt-2">
                                            <label class="form-label small">Nhận xét admin</label>
                                            <textarea class="form-control form-control-sm" id="sr-admin-note" rows="4"></textarea>
                                        </div>
                                        <button class="btn btn-primary w-100 mt-3" id="sr-save-grade-btn">
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
        modalEl = document.getElementById('speaking-result-detail-modal');
        document.getElementById('sr-save-grade-btn')?.addEventListener('click', saveGrade);
        return modalEl;
    }

    function renderDetail(result) {
        ensureModal();
        const metadata = result?.metadata && typeof result.metadata === 'object' ? result.metadata : {};

        const summaryEl = document.getElementById('sr-summary');
        if (summaryEl) {
            summaryEl.innerHTML = `
                <div><strong>Học viên:</strong> ${escapeHtml(getUserLabel(result.user_id))}</div>
                <div><strong>Ngày nộp:</strong> ${escapeHtml(formatDateTime(result.submitted_at))}</div>
                <div><strong>Bài:</strong> ${escapeHtml(result.set_title || result.set_id || '—')}</div>
                <div><strong>Điểm:</strong> ${escapeHtml(`${result.total_score || 0}/${result.max_score || 0}`)}</div>
                <div><strong>Band:</strong> ${escapeHtml(getBand(result))}</div>
                <div><strong>Thời gian làm:</strong> ${escapeHtml(formatDurationSeconds(result.duration_seconds))}</div>
            `;
        }

        const answersEl = document.getElementById('sr-answers');
        if (answersEl) {
            answersEl.innerHTML = renderAnswerBlocks(metadata);
        }

        const bandInput = document.getElementById('sr-admin-band');
        if (bandInput) bandInput.value = metadata.band || '';
        const scoreInput = document.getElementById('sr-admin-score');
        if (scoreInput) scoreInput.value = result.total_score ?? 0;
        const maxInput = document.getElementById('sr-admin-max-score');
        if (maxInput) maxInput.value = result.max_score ?? 0;
        const noteInput = document.getElementById('sr-admin-note');
        if (noteInput) noteInput.value = metadata.admin_note || '';

        if (refs.selectedLabel) {
            refs.selectedLabel.textContent = getUserLabel(result.user_id);
        }
    }

    async function saveGrade() {
        if (!state.selected?.id) return;

        const saveBtn = document.getElementById('sr-save-grade-btn');
        const band = (document.getElementById('sr-admin-band')?.value || '').trim();
        const note = (document.getElementById('sr-admin-note')?.value || '').trim();
        const scoreValue = document.getElementById('sr-admin-score')?.value;
        const maxValue = document.getElementById('sr-admin-max-score')?.value;

        const payload = {
            id: state.selected.id,
            metadataPatch: {
                band: band || null,
                admin_note: note || null
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
                state.selected = updated;
                state.results = state.results.map(item => item.id === updated.id ? updated : item);
                applySearch();
                renderDetail(updated);
            }

            alert('Đã lưu chấm điểm Speaking.');
        } catch (error) {
            alert(error.message || 'Không thể lưu chấm điểm Speaking.');
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="bi bi-save me-1"></i>Lưu chấm điểm';
            }
        }
    }

    window.viewSpeakingResultDetail = function (resultId) {
        const result = state.results.find(item => item.id === resultId);
        if (!result) {
            alert('Không tìm thấy kết quả Speaking.');
            return;
        }
        state.selected = result;
        renderDetail(result);

        const modalEl = ensureModal();
        if (window.bootstrap && modalEl) {
            new bootstrap.Modal(modalEl).show();
        }
    };

    window.initSpeakingResultsModule = function () {
        state.selected = null;
        if (refs.selectedLabel) refs.selectedLabel.textContent = 'Chưa chọn bài';
        loadSpeakingResults();
    };

    refs.searchInput?.addEventListener('input', applySearch);
    refs.clearSearchBtn?.addEventListener('click', () => {
        if (refs.searchInput) refs.searchInput.value = '';
        applySearch();
    });
    refs.refreshBtn?.addEventListener('click', loadSpeakingResults);
})();
