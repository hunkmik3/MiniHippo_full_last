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
                border: 1px solid #dbe3f0;
                border-radius: 1rem;
                padding: 1rem;
                background: #fff;
                box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
                margin-bottom: 1rem;
            }
            .writing-auto-block {
                border-radius: 1rem;
                padding: 1rem 1.1rem;
                white-space: pre-wrap;
                line-height: 1.85;
                font-size: 1rem;
                overflow-wrap: break-word;
            }
            .writing-auto-inline {
                background: #fff;
                border: 1px solid #dbe3f0;
                color: #0f172a;
                min-height: 7.5rem;
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
        return String(value || '')
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n[ \t]+/g, '\n')
            .trim();
    }

    function tokenizeDiffLine(value) {
        return String(value || '').match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*|[^\sA-Za-z0-9]+/g) || [];
    }

    function isPunctuationToken(value) {
        return !!value && !/[A-Za-z0-9]/.test(String(value));
    }

    function isClosingPunctuationToken(value) {
        return /^[,.;:!?%)\]}]+$/.test(String(value || ''));
    }

    function isOpeningPunctuationToken(value) {
        return /^[(\[{'"“‘]+$/.test(String(value || ''));
    }

    function shouldInsertGapBetweenSegments(previousRaw, nextRaw) {
        const prev = String(previousRaw || '');
        const next = String(nextRaw || '');

        if (!prev || !next || prev === '\n' || next === '\n') {
            return false;
        }

        if (isClosingPunctuationToken(next)) {
            return false;
        }

        if (isOpeningPunctuationToken(prev)) {
            return false;
        }

        return true;
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

    function getFailureOverride(metadata = {}) {
        const errorText = String(metadata.auto_grading_error || '').toLowerCase();
        if (
            errorText.includes('api error (429)')
            || errorText.includes('resource_exhausted')
            || errorText.includes('quota exceeded')
            || errorText.includes('generate_content_free_tier_requests')
        ) {
            return {
                label: 'Gemini hết quota',
                badgeClass: 'bg-warning text-dark',
                message: 'Gemini đang vượt quota nên lần nộp này chưa thể sửa lỗi tự động. Chờ quota hồi lại rồi nộp lại, hoặc đổi AI key/provider.',
                feedback: 'Lần nộp này Gemini đang vượt quota nên chưa thể sửa lỗi tự động.'
            };
        }
        return null;
    }

    function getStatusInfo(metadata = {}) {
        const status = String(metadata.auto_grading_status || '').trim() || 'unknown';
        const failureOverride = status === 'failed' ? getFailureOverride(metadata) : null;
        if (failureOverride) {
            return failureOverride;
        }
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
                feedback: normalizeText(item?.feedback || ''),
                semanticMismatch: !!item?.semantic_mismatch
            }];
        }));
    }

    function renderWholeAnswerDeleted(answer) {
        const normalized = normalizeText(answer);
        if (!normalized) {
            return '<span class="text-muted">Không có thay đổi.</span>';
        }

        return normalized
            .split('\n')
            .map((line) => `<span class="writing-auto-del">${escapeHtml(line)}</span>`)
            .join('<br>');
    }

    function buildWordDiff(original, corrected) {
        const origNorm = normalizeText(original);
        const corrNorm = normalizeText(corrected);

        // Build source tokens and record line break positions from original
        const source = [];
        const breaksBeforeIdx = {};
        let tokenIdx = 0;
        const origLines = origNorm.split('\n');
        for (let li = 0; li < origLines.length; li++) {
            const tokens = tokenizeDiffLine(origLines[li]);
            if (li > 0) {
                breaksBeforeIdx[tokenIdx] = (breaksBeforeIdx[tokenIdx] || 0) + 1;
            }
            source.push(...tokens);
            tokenIdx += tokens.length;
        }

        const target = [];
        const corrLines = corrNorm.split('\n');
        corrLines.forEach((line) => {
            target.push(...tokenizeDiffLine(line));
        });

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
                for (let b = 0; b < breaksBeforeIdx[srcPos]; b++) {
                    result.push({ html: '<br>', raw: '\n' });
                }
                delete breaksBeforeIdx[srcPos];
            }
            const safe = escapeHtml(part.value);
            const punctuationOnly = isPunctuationToken(part.value);
            if (part.type === 'del') {
                if (!punctuationOnly) {
                    result.push({ html: `<span class="writing-auto-del">${safe}</span>`, raw: part.value });
                }
                srcPos++;
            } else if (part.type === 'ins') {
                result.push({
                    html: punctuationOnly
                        ? `<span class="writing-auto-unchanged">${safe}</span>`
                        : `<span class="writing-auto-ins">${safe}</span>`,
                    raw: part.value
                });
            } else {
                result.push({ html: `<span class="writing-auto-unchanged">${safe}</span>`, raw: part.value });
                srcPos++;
            }
        }

        let html = '';
        let previousRaw = '';
        result.forEach((segment) => {
            if (segment.raw === '\n') {
                html += segment.html;
                previousRaw = '\n';
                return;
            }

            if (shouldInsertGapBetweenSegments(previousRaw, segment.raw)) {
                html += ' ';
            }

            html += segment.html;
            previousRaw = segment.raw;
        });

        return html;
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
        const feedback = normalizeText(statusInfo.feedback || autoData?.overall_feedback || metadata.ai_feedback_preview || '');
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
            const diffHtml = feedback.semanticMismatch
                ? renderWholeAnswerDeleted(entry.answer)
                : buildWordDiff(entry.answer, correctedAnswer);
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

    function renderInlineQuestionCorrection({
        metadata = {},
        part = '',
        key = '',
        idx = 0,
        answer = ''
    } = {}) {
        ensureStyles();
        const feedbackMap = getAutoFeedbackMap(metadata);
        const questionId = buildQuestionId(part, key, idx);
        const feedback = feedbackMap.get(questionId);
        if (!feedback) {
            return '';
        }

        const correctedAnswer = normalizeText(feedback.correctedAnswer || answer);
        const diffHtml = feedback.semanticMismatch
            ? renderWholeAnswerDeleted(answer)
            : buildWordDiff(answer, correctedAnswer);
        const itemFeedback = normalizeText(feedback.feedback || '');

        return `
            <div class="mt-3">
                <div class="small fw-semibold mb-1">AI sửa lỗi</div>
                <div class="writing-auto-block writing-auto-inline">${diffHtml || '<span class="text-muted">Không có thay đổi.</span>'}</div>
                ${itemFeedback ? `<div class="small text-muted mt-2">${escapeHtml(itemFeedback)}</div>` : ''}
            </div>
        `;
    }

    window.WritingAutoFeedback = {
        ensureStyles,
        renderOverallSummary,
        renderSections,
        renderInlineQuestionCorrection
    };
})();
