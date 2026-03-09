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
            const score = `${item.total_score || 0}/${item.max_score || 0}`;
            const duration = formatDurationSeconds(item.duration_seconds);
            const metadata = item.metadata && typeof item.metadata === 'object' ? item.metadata : {};
            const band = ((item.practice_type === 'writing' || item.practice_type === 'speaking') && metadata.band)
                ? metadata.band
                : calculateBand(item.practice_type, item.total_score);
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
        const score = `${result.total_score || 0}/${result.max_score || 0}`;
        const type = result.practice_type
            ? result.practice_type.charAt(0).toUpperCase() + result.practice_type.slice(1)
            : '—';
        const band = ((result.practice_type === 'writing' || result.practice_type === 'speaking') && metadata.band)
            ? metadata.band
            : calculateBand(result.practice_type, result.total_score);
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
