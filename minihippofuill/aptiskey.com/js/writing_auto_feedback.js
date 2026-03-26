(() => {
    const STYLE_ID = 'writing-auto-feedback-style';

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        styleEl.textContent = `
            .writing-auto-summary {
                border: 1px solid #dbeafe;
                background: linear-gradient(180deg, #f8fbff 0%, #eef6ff 100%);
                border-radius: 0.9rem;
                padding: 0.9rem 1rem;
                margin-bottom: 0.9rem;
            }
            .writing-auto-card {
                border: 1px solid #e2e8f0;
                border-radius: 0.9rem;
                padding: 0.9rem;
                background: #fff;
                box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
                margin-bottom: 0.85rem;
            }
            .writing-auto-block {
                border-radius: 0.75rem;
                padding: 0.75rem 0.85rem;
                white-space: pre-wrap;
                line-height: 1.7;
                font-size: 0.95rem;
            }
            .writing-auto-inline {
                background: #fff;
                border: 1px solid #e2e8f0;
                color: #0f172a;
                line-height: 1.85;
            }
            .writing-auto-del {
                color: #dc2626;
                text-decoration: line-through;
                background: rgba(254, 226, 226, 0.9);
                border-radius: 0.35rem;
                padding: 0.05rem 0.12rem;
            }
            .writing-auto-ins {
                color: #15803d;
                background: rgba(220, 252, 231, 0.95);
                text-decoration: underline;
                text-decoration-thickness: 2px;
                text-underline-offset: 2px;
                border-radius: 0.35rem;
                padding: 0.05rem 0.12rem;
            }
            .writing-auto-unchanged {
                color: #334155;
            }
            .writing-auto-list {
                margin: 0.35rem 0 0;
                padding-left: 1.1rem;
            }
            .writing-auto-list li {
                margin-bottom: 0.2rem;
            }
        `;
        document.head.appendChild(styleEl);
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

    function normalizeText(value) {
        return String(value || '').replace(/\r\n/g, '\n').trim();
    }

    function buildQuestionId(partKey, itemKey, idx) {
        const safePart = String(partKey || 'part').trim() || 'part';
        const safeKey = String(itemKey || `item_${idx + 1}`).trim() || `item_${idx + 1}`;
        return `${safePart}:${safeKey}`;
    }

    function getPartLabel(partKey) {
        if (!partKey) return '';
        const normalized = String(partKey).replace(/^part/i, '').trim();
        return normalized ? `Part ${normalized}` : String(partKey);
    }

    function getStatusInfo(metadata = {}) {
        const status = String(metadata.auto_grading_status || '').trim() || 'unknown';
        const map = {
            completed: {
                label: 'Đã sửa lỗi tự động',
                badgeClass: 'bg-success',
                message: ''
            },
            unavailable: {
                label: 'Chưa có AI key',
                badgeClass: 'bg-secondary',
                message: metadata.auto_grading_message || 'Chưa cấu hình AI nên chưa thể sửa lỗi tự động.'
            },
            failed: {
                label: 'Sửa lỗi tự động lỗi',
                badgeClass: 'bg-danger',
                message: metadata.auto_grading_message || 'Lần nộp này chưa sửa lỗi tự động thành công.'
            },
            skipped_empty: {
                label: 'Không có nội dung',
                badgeClass: 'bg-warning text-dark',
                message: metadata.auto_grading_message || 'Không có nội dung bài viết để sửa lỗi tự động.'
            },
            unknown: {
                label: 'Chưa có dữ liệu',
                badgeClass: 'bg-light text-dark',
                message: ''
            }
        };
        return map[status] || map.unknown;
    }

    function getUserAnswerEntries(metadata = {}) {
        const userAnswers = metadata.user_answers;
        if (!userAnswers || typeof userAnswers !== 'object') {
            return [];
        }

        const items = [];
        Object.keys(userAnswers).forEach((partKey) => {
            const partItems = userAnswers[partKey];
            if (!Array.isArray(partItems)) return;

            partItems.forEach((item, idx) => {
                const key = item?.key || `item_${idx + 1}`;
                items.push({
                    id: buildQuestionId(partKey, key, idx),
                    part: partKey,
                    key,
                    prompt: normalizeText(item?.prompt || ''),
                    answer: normalizeText(item?.answer || ''),
                    wordCount: Number(item?.word_count || 0)
                });
            });
        });
        return items;
    }

    function getAutoFeedbackMap(metadata = {}) {
        const items = metadata?.auto_writing_feedback?.items;
        if (!Array.isArray(items)) return new Map();

        return new Map(items.map((item, idx) => {
            const key = buildQuestionId(item?.part, item?.key, idx);
            return [key, {
                correctedAnswer: normalizeText(item?.corrected_answer || ''),
                feedback: normalizeText(item?.feedback || '')
            }];
        }));
    }

    function buildWordDiff(original, corrected) {
        const origNorm = normalizeText(original);
        const corrNorm = normalizeText(corrected);

        // Build source words and record line break positions from original
        const source = [];
        const breaksBeforeIdx = {};
        let wordIdx = 0;
        const origLines = origNorm.split('\n');
        for (let li = 0; li < origLines.length; li++) {
            const words = origLines[li].split(/\s+/).filter(Boolean);
            if (li > 0) {
                breaksBeforeIdx[wordIdx] = (breaksBeforeIdx[wordIdx] || 0) + 1;
            }
            source.push(...words);
            wordIdx += words.length;
        }

        const target = corrNorm.split(/\s+/).filter(Boolean);

        if (!source.length && !target.length) return '';

        // LCS table
        const rows = source.length;
        const cols = target.length;
        const dp = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));
        for (let i = rows - 1; i >= 0; i -= 1) {
            for (let j = cols - 1; j >= 0; j -= 1) {
                if (source[i] === target[j]) {
                    dp[i][j] = dp[i + 1][j + 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
                }
            }
        }

        // Build diff parts
        const parts = [];
        let i = 0, j = 0;
        while (i < rows && j < cols) {
            if (source[i] === target[j]) {
                parts.push({ type: 'same', value: source[i] });
                i += 1; j += 1;
            } else if (dp[i + 1][j] >= dp[i][j + 1]) {
                parts.push({ type: 'del', value: source[i] });
                i += 1;
            } else {
                parts.push({ type: 'ins', value: target[j] });
                j += 1;
            }
        }
        while (i < rows) { parts.push({ type: 'del', value: source[i] }); i += 1; }
        while (j < cols) { parts.push({ type: 'ins', value: target[j] }); j += 1; }

        // Render with line breaks from original
        const result = [];
        let srcPos = 0;
        for (const part of parts) {
            if (part.type !== 'ins' && breaksBeforeIdx[srcPos]) {
                for (let b = 0; b < breaksBeforeIdx[srcPos]; b++) result.push('<br>');
                delete breaksBeforeIdx[srcPos];
            }
            const safe = escapeHtml(part.value);
            if (part.type === 'del') {
                result.push(`<span class="writing-auto-del">${safe}</span>`);
                srcPos++;
            } else if (part.type === 'ins') {
                result.push(`<span class="writing-auto-ins">${safe}</span>`);
            } else {
                result.push(`<span class="writing-auto-unchanged">${safe}</span>`);
                srcPos++;
            }
        }
        return result.join(' ');
    }

    function renderList(title, items = []) {
        const filtered = Array.isArray(items) ? items.filter(Boolean) : [];
        if (!filtered.length) return '';
        return `
            <div class="small mt-2">
                <strong>${escapeHtml(title)}:</strong>
                <ul class="writing-auto-list">
                    ${filtered.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    function renderOverallSummary(metadata = {}) {
        ensureStyles();
        const statusInfo = getStatusInfo(metadata);
        const autoData = metadata?.auto_writing_feedback;
        const feedback = normalizeText(autoData?.overall_feedback || metadata.ai_feedback_preview || '');
        const provider = normalizeText(metadata.auto_grading_provider || '');
        const gradedAt = normalizeText(metadata.auto_graded_at || '');

        if (!autoData && !statusInfo.message && !feedback) {
            return '';
        }

        const metaBits = [];
        if (provider) metaBits.push(`AI: ${escapeHtml(provider)}`);
        if (gradedAt) {
            const date = new Date(gradedAt);
            if (!Number.isNaN(date.getTime())) {
                metaBits.push(`Lúc sửa: ${escapeHtml(date.toLocaleString('vi-VN'))}`);
            }
        }

        return `
            <div class="writing-auto-summary">
                <div class="d-flex flex-wrap gap-2 align-items-center mb-2">
                    <span class="badge ${statusInfo.badgeClass}">${escapeHtml(statusInfo.label)}</span>
                    ${metaBits.length ? `<span class="small text-muted">${metaBits.join(' · ')}</span>` : ''}
                </div>
                ${feedback ? `<div class="small">${escapeHtml(feedback)}</div>` : ''}
                ${statusInfo.message ? `<div class="small text-muted mt-2">${escapeHtml(statusInfo.message)}</div>` : ''}
                ${renderList('Lỗi thường gặp', autoData?.common_errors)}
            </div>
        `;
    }

    function renderSections(metadata = {}) {
        ensureStyles();
        const userEntries = getUserAnswerEntries(metadata);
        const feedbackMap = getAutoFeedbackMap(metadata);
        const statusInfo = getStatusInfo(metadata);

        if (!userEntries.length) {
            return '<div class="text-muted small">Không có dữ liệu bài viết để hiển thị.</div>';
        }
        if (!feedbackMap.size) {
            return `<div class="text-muted small">${escapeHtml(statusInfo.message || 'Chưa có dữ liệu sửa lỗi tự động.')}</div>`;
        }

        const sections = new Map();
        userEntries.forEach((entry, idx) => {
            const questionId = entry.id || buildQuestionId(entry.part, entry.key, idx);
            const feedback = feedbackMap.get(questionId) || {};
            const correctedAnswer = normalizeText(feedback.correctedAnswer || entry.answer);
            const diffHtml = buildWordDiff(entry.answer, correctedAnswer);
            const perItemHtml = `
                <div class="writing-auto-card">
                    ${entry.prompt ? `<div class="small text-muted mb-2"><em>${escapeHtml(entry.prompt)}</em></div>` : ''}
                    <div class="writing-auto-block writing-auto-inline">${diffHtml || '<span class="text-muted">Không có thay đổi.</span>'}</div>
                </div>
            `;

            const partKey = entry.part || 'part';
            if (!sections.has(partKey)) sections.set(partKey, []);
            sections.get(partKey).push(perItemHtml);
        });

        return Array.from(sections.entries()).map(([partKey, htmlItems]) => `
            <div class="mb-3">
                <h6 class="small text-primary mb-2">${escapeHtml(getPartLabel(partKey))}</h6>
                ${htmlItems.join('')}
            </div>
        `).join('');
    }

    window.WritingAutoFeedback = {
        ensureStyles,
        renderOverallSummary,
        renderSections
    };
})();
