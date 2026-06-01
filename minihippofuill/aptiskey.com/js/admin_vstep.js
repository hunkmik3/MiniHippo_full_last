(function () {
    const VSTEP_TYPE = 'vstep';
    const FLOW_LABELS = {
        practice: 'Ôn thi VSTEP',
        lesson_exam: 'Học tập VSTEP'
    };
    const CONTENT_SKILL_LABELS = {
        full_test: 'Full 4 kỹ năng',
        listening: 'Listening',
        reading: 'Reading',
        writing: 'Writing',
        speaking: 'Speaking'
    };
    const SKILL_KEYS = ['listening', 'reading', 'writing', 'speaking'];
    const LISTENING_QUESTION_COUNTS = [8, 12, 15];
    const READING_QUESTION_COUNTS = [10, 10, 10, 10];
    const SPEAKING_TIMING_DEFAULTS = [
        { prep: 0, answer: 180 },
        { prep: 60, answer: 180 },
        { prep: 60, answer: 240 }
    ];
    const WRITING_DEFAULTS = [
        { min: 120, max: 220, instruction: 'You should spend about 20 minutes on this task.' },
        { min: 250, max: 350, instruction: 'You should spend about 40 minutes on this task.' }
    ];

    const refs = {};
    const state = {
        editingId: '',
        currentPanel: 'students',
        currentFlow: 'practice',
        sets: [],
        users: [],
        results: [],
        resources: [],
        classes: [],
        memberships: []
    };

    function $(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getValue(id) {
        return ($(id)?.value || '').trim();
    }

    function setValue(id, value) {
        const el = $(id);
        if (el) el.value = value == null ? '' : String(value);
    }

    function setChecked(id, value) {
        const el = $(id);
        if (el) el.checked = Boolean(value);
    }

    function isChecked(id) {
        return Boolean($(id)?.checked);
    }

    function selectedValues(id) {
        const el = $(id);
        if (!el) return [];
        return Array.from(el.selectedOptions || []).map(option => option.value).filter(Boolean);
    }

    function parseJsonField(id, fallback) {
        const value = getValue(id);
        if (!value) return fallback;
        try {
            return JSON.parse(value);
        } catch {
            throw new Error(`${id}: JSON không hợp lệ.`);
        }
    }

    function dateTimeValue(id) {
        const value = getValue(id);
        if (!value) return undefined;
        const date = new Date(value);
        return Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
    }

    function getNumber(id, fallback) {
        const value = Number(getValue(id));
        return Number.isFinite(value) && value >= 0 ? value : fallback;
    }

    function getContentSkill() {
        const value = getValue('vstep-practice-skill');
        return Object.prototype.hasOwnProperty.call(CONTENT_SKILL_LABELS, value) ? value : 'full_test';
    }

    function shouldIncludeSkill(skill, contentSkill = getContentSkill()) {
        return contentSkill === 'full_test' || contentSkill === skill;
    }

    function updateSkillEditorVisibility() {
        const contentSkill = getContentSkill();
        document.querySelectorAll('.vstep-skill-card[data-vstep-skill]').forEach(card => {
            const show = shouldIncludeSkill(card.dataset.vstepSkill, contentSkill);
            card.classList.toggle('is-hidden-by-skill', !show);
            if (show) card.setAttribute('open', 'open');
        });
    }

    function authHeaders(extra = {}) {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : '';
        const headers = { ...extra };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (typeof buildDeviceHeaders === 'function') {
            return buildDeviceHeaders(headers);
        }
        return headers;
    }

    async function fetchJson(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: authHeaders(options.headers || {})
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result.error || result.details || 'Không thể xử lý yêu cầu.');
        }
        return result;
    }

    function sanitizeFileName(value) {
        return String(value || 'audio')
            .trim()
            .replace(/[^\w.-]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toLowerCase() || 'audio';
    }

    function parseOption(raw, index) {
        const fallbackLabel = String.fromCharCode(65 + index);
        const text = String(raw || '').trim();
        if (!text) return null;
        const match = text.match(/^([A-H])[\).:\-\s]+(.+)$/i);
        if (match) {
            return {
                label: match[1].toUpperCase(),
                text: match[2].trim()
            };
        }
        return {
            label: fallbackLabel,
            text
        };
    }

    function parseQuestionLines(value, contextLabel) {
        const lines = String(value || '')
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);

        return lines.map((line, index) => {
            const parts = line.split('|').map(part => part.trim());
            if (parts.length < 3) {
                throw new Error(`${contextLabel}: dòng ${index + 1} cần đúng dạng "Câu hỏi | A. ...; B. ... | A".`);
            }

            const prompt = parts[0];
            const options = parts[1]
                .split(';')
                .map((option, optionIndex) => parseOption(option, optionIndex))
                .filter(Boolean);
            const answer = String(parts[2] || '').trim().replace(/[^A-H]/gi, '').slice(0, 1).toUpperCase();

            if (!prompt || options.length < 2 || !answer) {
                throw new Error(`${contextLabel}: dòng ${index + 1} thiếu câu hỏi, lựa chọn hoặc đáp án.`);
            }

            if (!options.some(option => option.label === answer)) {
                throw new Error(`${contextLabel}: dòng ${index + 1} có đáp án "${answer}" không nằm trong options.`);
            }

            return {
                id: `${contextLabel.toLowerCase().replace(/[^\w]+/g, '-')}-${index + 1}`,
                prompt,
                options,
                answer
            };
        });
    }

    function formatQuestionLines(questions = []) {
        return questions.map(question => {
            const options = (question.options || [])
                .map(option => `${option.label}. ${option.text}`)
                .join('; ');
            return `${question.prompt || ''} | ${options} | ${question.answer || ''}`;
        }).join('\n');
    }

    function buildQuestionHelp(skill) {
        const sample = skill === 'reading'
            ? 'The word "gloom-and-doom" is closest in meaning to? | A. hopeless; B. interesting; C. strange; D. cheerful | C'
            : 'When is the man’s appointment? | A. Friday; B. Wednesday; C. Thursday; D. Tuesday | A';
        return `Mỗi dòng: Câu hỏi | A. lựa chọn; B. lựa chọn; C. lựa chọn; D. lựa chọn | đáp án. Ví dụ: ${sample}`;
    }

    function questionOptionValue(question, label) {
        const option = (question.options || []).find(item => item.label === label);
        return option?.text || '';
    }

    function buildPlaceholderQuestions(skill, contextLabel, count) {
        const safeCount = Math.max(0, Math.min(80, Number(count) || 0));
        return Array.from({ length: safeCount }).map((_, index) => {
            const number = index + 1;
            const prompt = skill === 'reading'
                ? `${contextLabel} - Reading question ${number}?`
                : `${contextLabel} - Listening question ${number}?`;
            return {
                prompt,
                options: [
                    { label: 'A', text: 'Option A' },
                    { label: 'B', text: 'Option B' },
                    { label: 'C', text: 'Option C' },
                    { label: 'D', text: 'Option D' }
                ],
                answer: 'A'
            };
        });
    }

    function questionRowHtml(question = {}, index = 0) {
        const labels = ['A', 'B', 'C', 'D'];
        return `
            <div class="vstep-question-builder-row">
                <div class="vstep-question-builder-head">
                    <strong>Câu ${index + 1}</strong>
                    <button type="button" class="btn btn-sm btn-outline-danger vstep-remove-question-row" aria-label="Xóa câu hỏi">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="vstep-question-builder-grid">
                    <div class="vstep-question-builder-prompt">
                        <label class="form-label small fw-semibold">Câu hỏi</label>
                        <input type="text" class="form-control form-control-sm vstep-question-prompt" value="${escapeHtml(question.prompt || '')}" placeholder="Nhập câu hỏi">
                    </div>
                    ${labels.map(label => `
                        <div>
                            <label class="form-label small fw-semibold">Đáp án ${label}</label>
                            <input type="text" class="form-control form-control-sm vstep-question-option" data-label="${label}" value="${escapeHtml(questionOptionValue(question, label))}" placeholder="Option ${label}">
                        </div>
                    `).join('')}
                    <div>
                        <label class="form-label small fw-semibold">Đáp án đúng</label>
                        <input type="text" class="form-control form-control-sm text-uppercase vstep-question-answer" maxlength="1" value="${escapeHtml(question.answer || 'A')}" placeholder="A">
                    </div>
                </div>
            </div>
        `;
    }

    function refreshQuestionRowIndexes(container) {
        container.querySelectorAll('.vstep-question-builder-row').forEach((row, index) => {
            const title = row.querySelector('.vstep-question-builder-head strong');
            if (title) title.textContent = `Câu ${index + 1}`;
        });
    }

    function bindQuestionRows(container) {
        container.querySelectorAll('.vstep-remove-question-row').forEach(button => {
            button.addEventListener('click', () => {
                button.closest('.vstep-question-builder-row')?.remove();
                refreshQuestionRowIndexes(container);
            });
        });
    }

    function renderQuestionRows(targetId, questions = []) {
        const container = $(targetId);
        if (!container) return;
        container.innerHTML = questions.map((question, index) => questionRowHtml(question, index)).join('');
        bindQuestionRows(container);
    }

    function collectQuestionRows(targetId, contextLabel, options = {}) {
        const validate = options.validate !== false;
        const container = $(targetId);
        const rows = Array.from(container?.querySelectorAll('.vstep-question-builder-row') || []);
        return rows.map((row, index) => {
            const prompt = row.querySelector('.vstep-question-prompt')?.value.trim() || '';
            const options = Array.from(row.querySelectorAll('.vstep-question-option'))
                .map(input => ({
                    label: input.dataset.label,
                    text: input.value.trim()
                }))
                .filter(option => option.label && option.text);
            const answer = String(row.querySelector('.vstep-question-answer')?.value || '')
                .trim()
                .replace(/[^A-D]/gi, '')
                .slice(0, 1)
                .toUpperCase();

            if (validate && (!prompt || options.length < 2 || !answer)) {
                throw new Error(`${contextLabel}: câu ${index + 1} thiếu câu hỏi, tối thiểu 2 lựa chọn hoặc đáp án đúng.`);
            }
            if (validate && !options.some(option => option.label === answer)) {
                throw new Error(`${contextLabel}: câu ${index + 1} có đáp án "${answer}" nhưng ô đáp án ${answer} đang trống.`);
            }
            return {
                id: `${contextLabel.toLowerCase().replace(/[^\w]+/g, '-')}-${index + 1}`,
                prompt,
                options,
                answer
            };
        });
    }

    function listeningDefaultDirections(index) {
        const directions = [
            'Directions: In this part, you will hear eight short announcements or instructions. There is one question for each announcement or instruction. For each question, choose the right answer A, B, C or D.',
            'Directions: In this part, you will hear three conversations. There are twelve questions. For each question, choose the right answer A, B, C or D.',
            'Directions: In this part, you will hear three talks or lectures. There are fifteen questions. For each question, choose the right answer A, B, C or D.'
        ];
        return directions[index - 1] || directions[0];
    }

    function mediaFileInput({ id, target, dir, accept, label = 'Upload file' }) {
        return `
            <label class="form-label" for="${id}">${escapeHtml(label)}</label>
            <input type="file" class="form-control vstep-media-file" id="${id}" accept="${escapeHtml(accept)}" data-target="${escapeHtml(target)}" data-dir="${escapeHtml(dir)}">
            <div class="vstep-help mt-1" id="${id.replace(/-file$/, '')}-upload-status"></div>
        `;
    }

    function buildPlaceholderLines(skill, contextLabel, count) {
        const safeCount = Math.max(0, Math.min(80, Number(count) || 0));
        return Array.from({ length: safeCount }).map((_, index) => {
            const number = index + 1;
            const prompt = skill === 'reading'
                ? `${contextLabel} - Reading question ${number}?`
                : `${contextLabel} - Listening question ${number}?`;
            return `${prompt} | A. Option A; B. Option B; C. Option C; D. Option D | A`;
        }).join('\n');
    }

    function questionToolbar(skill, partIndex, targetId, defaultCount) {
        const countId = `${targetId}-count`;
        const contextLabel = `${skill === 'reading' ? 'Reading' : 'Listening'} Part ${partIndex}`;
        return `
            <div class="d-flex flex-wrap gap-2 align-items-end mb-2">
                <div style="width: 150px;">
                    <label class="form-label small mb-1" for="${countId}">Số câu hỏi</label>
                    <input type="number" min="0" max="80" class="form-control form-control-sm" id="${countId}" value="${defaultCount}">
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary vstep-generate-question-lines"
                    data-skill="${skill}" data-context="${escapeHtml(contextLabel)}" data-count="${countId}" data-target="${targetId}">
                    <i class="bi bi-magic me-1"></i>Tạo placeholder câu hỏi
                </button>
                <button type="button" class="btn btn-sm btn-outline-secondary vstep-add-question-row"
                    data-skill="${skill}" data-context="${escapeHtml(contextLabel)}" data-target="${targetId}">
                    <i class="bi bi-plus-circle me-1"></i>Thêm câu
                </button>
                <span class="vstep-help">Mỗi câu có ô riêng cho câu hỏi, lựa chọn A/B/C/D và đáp án đúng.</span>
            </div>
        `;
    }

    function initEditors() {
        refs.listeningEditors.innerHTML = [1, 2, 3].map(index => {
            const questionId = `vstep-listening-${index}-questions`;
            const expectedCount = LISTENING_QUESTION_COUNTS[index - 1] || 0;
            return `
                <div class="vstep-part-editor">
                    <div class="vstep-editor-heading">
                        <h3 class="h6 mb-0">Listening Part ${index}</h3>
                        <span>${expectedCount} câu, audio chỉ nghe 1 lần</span>
                    </div>
                    <div class="row g-3">
                        <div class="col-lg-5">
                            <label class="form-label" for="vstep-listening-${index}-title">Tiêu đề part</label>
                            <input class="form-control" id="vstep-listening-${index}-title" value="Part ${index}">
                        </div>
                        <div class="col-lg-7">
                            <label class="form-label" for="vstep-listening-${index}-audio">Audio URL dùng trong thanh nghe</label>
                            <input class="form-control" id="vstep-listening-${index}-audio" placeholder="audio/vstep/listening/part${index}.mp3">
                        </div>
                        <div class="col-lg-7">
                            ${mediaFileInput({
                                id: `vstep-listening-${index}-file`,
                                target: `vstep-listening-${index}-audio`,
                                dir: `audio/vstep/listening/part${index}`,
                                accept: 'audio/mp3,audio/mpeg,audio/webm,audio/ogg,audio/mp4,.mp3,.webm,.ogg,.m4a',
                                label: 'Upload audio'
                            })}
                        </div>
                        <div class="col-lg-5">
                            <label class="form-label" for="vstep-listening-${index}-directions">Directions hiển thị đầu part</label>
                            <textarea class="form-control" id="vstep-listening-${index}-directions" rows="4">${escapeHtml(listeningDefaultDirections(index))}</textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="${questionId}">Câu hỏi trắc nghiệm hiển thị dưới audio</label>
                            ${questionToolbar('listening', index, questionId, expectedCount)}
                            <div class="vstep-question-builder" id="${questionId}"></div>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="vstep-listening-${index}-transcript">Transcript nội bộ (tùy chọn)</label>
                            <textarea class="form-control" id="vstep-listening-${index}-transcript" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        refs.readingEditors.innerHTML = [1, 2, 3, 4].map(index => {
            const questionId = `vstep-reading-${index}-questions`;
            const expectedCount = READING_QUESTION_COUNTS[index - 1] || 10;
            return `
                <div class="vstep-part-editor">
                    <div class="vstep-editor-heading">
                        <h3 class="h6 mb-0">Reading Part ${index}</h3>
                        <span>Passage bên trái, ${expectedCount} câu bên phải</span>
                    </div>
                    <div class="row g-3">
                        <div class="col-lg-5">
                            <label class="form-label" for="vstep-reading-${index}-title">Tiêu đề part</label>
                            <input class="form-control" id="vstep-reading-${index}-title" value="Part ${index}">
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="vstep-reading-${index}-passage">Bài đọc</label>
                            <textarea class="form-control" id="vstep-reading-${index}-passage" rows="8" placeholder="Nhập passage hoặc để placeholder để dựng khung trước."></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="${questionId}">Câu hỏi trắc nghiệm trong pane bên phải</label>
                            ${questionToolbar('reading', index, questionId, expectedCount)}
                            <div class="vstep-question-builder" id="${questionId}"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        refs.writingEditors.innerHTML = [1, 2].map(index => {
            const defaults = WRITING_DEFAULTS[index - 1] || WRITING_DEFAULTS[0];
            return `
                <div class="vstep-part-editor">
                    <div class="vstep-editor-heading">
                        <h3 class="h6 mb-0">Writing Part ${index}</h3>
                        <span>${index === 1 ? '20 phút, thư/email' : '40 phút, essay'}; chặn copy/paste ở màn học viên</span>
                    </div>
                    <div class="row g-3">
                        <div class="col-lg-4">
                            <label class="form-label" for="vstep-writing-${index}-title">Tiêu đề</label>
                            <input class="form-control" id="vstep-writing-${index}-title" value="${index === 1 ? 'Part 1: Letter / Email' : 'Part 2: Essay'}">
                        </div>
                        <div class="col-lg-4">
                            <label class="form-label" for="vstep-writing-${index}-instructions">Dòng hướng dẫn thời gian</label>
                            <input class="form-control" id="vstep-writing-${index}-instructions" value="${escapeHtml(defaults.instruction)}">
                        </div>
                        <div class="col-6 col-lg-2">
                            <label class="form-label" for="vstep-writing-${index}-min">Tối thiểu từ</label>
                            <input type="number" min="0" class="form-control" id="vstep-writing-${index}-min" value="${defaults.min}">
                        </div>
                        <div class="col-6 col-lg-2">
                            <label class="form-label" for="vstep-writing-${index}-max">Tối đa từ</label>
                            <input type="number" min="0" class="form-control" id="vstep-writing-${index}-max" value="${defaults.max}">
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="vstep-writing-${index}-prompt">Đề bài chính</label>
                            <textarea class="form-control" id="vstep-writing-${index}-prompt" rows="6" placeholder="Nhập đề Writing hoặc để trống để lưu placeholder."></textarea>
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="vstep-writing-${index}-extract">Trích đoạn / quote / biểu đồ (tùy chọn)</label>
                            <textarea class="form-control" id="vstep-writing-${index}-extract" rows="4" placeholder="Nếu có quote/report extract, nội dung này sẽ hiện trong khung trích dẫn dưới đề bài."></textarea>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        refs.speakingEditors.innerHTML = [1, 2, 3].map(index => {
            const timing = SPEAKING_TIMING_DEFAULTS[index - 1] || SPEAKING_TIMING_DEFAULTS[0];
            return `
                <div class="vstep-part-editor">
                    <div class="vstep-editor-heading">
                        <h3 class="h6 mb-0">Speaking Part ${index}</h3>
                        <span>Audio giới thiệu, prompt, visualizer, lưu file ghi âm</span>
                    </div>
                    <div class="row g-3">
                        <div class="col-lg-4">
                            <label class="form-label" for="vstep-speaking-${index}-title">Tiêu đề</label>
                            <input class="form-control" id="vstep-speaking-${index}-title" value="${index === 1 ? 'Part 1: Social Interaction' : index === 2 ? 'Part 2: Solution Discussion' : 'Part 3: Topic Development'}">
                        </div>
                        <div class="col-lg-5">
                            <label class="form-label" for="vstep-speaking-${index}-audio">Audio giới thiệu câu hỏi</label>
                            <input class="form-control" id="vstep-speaking-${index}-audio" placeholder="audio/vstep/speaking/part${index}.mp3">
                        </div>
                        <div class="col-lg-3">
                            ${mediaFileInput({
                                id: `vstep-speaking-${index}-file`,
                                target: `vstep-speaking-${index}-audio`,
                                dir: `audio/vstep/speaking/part${index}`,
                                accept: 'audio/mp3,audio/mpeg,audio/webm,audio/ogg,audio/mp4,.mp3,.webm,.ogg,.m4a',
                                label: 'Upload audio'
                            })}
                        </div>
                        <div class="col-lg-7">
                            <label class="form-label" for="vstep-speaking-${index}-image">Ảnh minh họa trong prompt (tùy chọn)</label>
                            <input class="form-control" id="vstep-speaking-${index}-image" placeholder="images/vstep/speaking/part${index}.png">
                        </div>
                        <div class="col-lg-3">
                            ${mediaFileInput({
                                id: `vstep-speaking-${index}-image-file`,
                                target: `vstep-speaking-${index}-image`,
                                dir: `images/vstep/speaking/part${index}`,
                                accept: 'image/png,image/jpeg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif',
                                label: 'Upload ảnh'
                            })}
                        </div>
                        <div class="col-lg-2">
                            <label class="form-label d-block">Timing</label>
                            <div class="form-check vstep-check-row mt-2">
                                <input class="form-check-input" type="checkbox" id="vstep-speaking-${index}-custom-timing" checked>
                                <label class="form-check-label fw-semibold" for="vstep-speaking-${index}-custom-timing">Dùng timing này</label>
                            </div>
                        </div>
                        <div class="col-6 col-lg-2">
                            <label class="form-label" for="vstep-speaking-${index}-prep">Giây chuẩn bị</label>
                            <input type="number" min="0" class="form-control" id="vstep-speaking-${index}-prep" value="${timing.prep}">
                        </div>
                        <div class="col-6 col-lg-2">
                            <label class="form-label" for="vstep-speaking-${index}-answer">Giây trả lời</label>
                            <input type="number" min="1" class="form-control" id="vstep-speaking-${index}-answer" value="${timing.answer}">
                        </div>
                        <div class="col-12">
                            <label class="form-label" for="vstep-speaking-${index}-prompt">Câu hỏi / nội dung hiển thị</label>
                            <textarea class="form-control" id="vstep-speaking-${index}-prompt" rows="7" placeholder="Nhập prompt Speaking hoặc để trống để lưu placeholder."></textarea>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('.vstep-media-file').forEach(input => {
            input.addEventListener('change', () => uploadMediaFromInput(input));
        });
        document.querySelectorAll('.vstep-generate-question-lines').forEach(button => {
            button.addEventListener('click', () => {
                const target = $(button.dataset.target);
                const count = getNumber(button.dataset.count, 0);
                if (!target) return;
                if (target.querySelector('.vstep-question-builder-row') && !confirm('Ghi đè danh sách câu hỏi hiện tại bằng placeholder mới?')) {
                    return;
                }
                renderQuestionRows(
                    button.dataset.target,
                    buildPlaceholderQuestions(button.dataset.skill, button.dataset.context, count)
                );
            });
        });
        document.querySelectorAll('.vstep-add-question-row').forEach(button => {
            button.addEventListener('click', () => {
                const target = $(button.dataset.target);
                if (!target) return;
                const current = collectQuestionRows(button.dataset.target, button.dataset.context, { validate: false });
                const nextIndex = current.length + 1;
                const nextQuestion = buildPlaceholderQuestions(button.dataset.skill, button.dataset.context, nextIndex).at(-1);
                renderQuestionRows(button.dataset.target, [...current, nextQuestion]);
            });
        });
    }

    function collectPayload() {
        const title = getValue('vstep-title');
        if (!title) throw new Error('Vui lòng nhập tên nội dung VSTEP.');

        const flow = getValue('vstep-flow') || state.currentFlow || 'practice';
        const contentSkill = getContentSkill();
        const durations = {
            listening: getNumber('vstep-duration-listening', 45),
            reading: getNumber('vstep-duration-reading', 60),
            writing: getNumber('vstep-duration-writing', 60),
            speaking: getNumber('vstep-duration-speaking', 12)
        };

        const listeningParts = shouldIncludeSkill('listening', contentSkill)
            ? [1, 2, 3].map(index => {
                const questions = collectQuestionRows(`vstep-listening-${index}-questions`, `Listening Part ${index}`);
                return {
                    title: getValue(`vstep-listening-${index}-title`) || `Part ${index}`,
                    directions: getValue(`vstep-listening-${index}-directions`) || 'Listen and choose the correct answer.',
                    audioUrl: getValue(`vstep-listening-${index}-audio`),
                    transcript: getValue(`vstep-listening-${index}-transcript`),
                    questions
                };
            })
            : [];

        const readingParts = shouldIncludeSkill('reading', contentSkill)
            ? [1, 2, 3, 4].map(index => {
                const questions = collectQuestionRows(`vstep-reading-${index}-questions`, `Reading Part ${index}`);
                return {
                    title: getValue(`vstep-reading-${index}-title`) || `Part ${index}`,
                    passage: getValue(`vstep-reading-${index}-passage`) || `Reading Part ${index} passage placeholder.`,
                    questions
                };
            })
            : [];

        const writingParts = shouldIncludeSkill('writing', contentSkill)
            ? [1, 2].map(index => {
                const defaults = WRITING_DEFAULTS[index - 1] || WRITING_DEFAULTS[0];
                return {
                    title: getValue(`vstep-writing-${index}-title`) || `Part ${index}`,
                    instructions: getValue(`vstep-writing-${index}-instructions`) || defaults.instruction,
                    prompt: getValue(`vstep-writing-${index}-prompt`) || `Writing Part ${index} prompt placeholder.`,
                    extract: getValue(`vstep-writing-${index}-extract`),
                    minWords: getNumber(`vstep-writing-${index}-min`, defaults.min),
                    maxWords: getNumber(`vstep-writing-${index}-max`, defaults.max)
                };
            })
            : [];

        const speakingParts = shouldIncludeSkill('speaking', contentSkill)
            ? [1, 2, 3].map(index => {
                const timing = SPEAKING_TIMING_DEFAULTS[index - 1] || SPEAKING_TIMING_DEFAULTS[0];
                return {
                    title: getValue(`vstep-speaking-${index}-title`) || `Part ${index}`,
                    introAudioUrl: getValue(`vstep-speaking-${index}-audio`),
                    imageUrl: getValue(`vstep-speaking-${index}-image`),
                    prompt: getValue(`vstep-speaking-${index}-prompt`) || `Speaking Part ${index} prompt placeholder.`,
                    useCustomTiming: isChecked(`vstep-speaking-${index}-custom-timing`),
                    prepSeconds: getNumber(`vstep-speaking-${index}-prep`, timing.prep),
                    answerSeconds: getNumber(`vstep-speaking-${index}-answer`, timing.answer)
                };
            })
            : [];

        const data = {
            __practice_type: VSTEP_TYPE,
            __storage_type: 'reading',
            schemaVersion: 1,
            vstep_module: true,
            vstep_flow: flow,
            vstep_practice_skill: contentSkill,
            vstep_content_kind: getValue('vstep-content-kind') || 'mock_test',
            status: getValue('vstep-status') || 'draft',
            durations,
            listening: { parts: listeningParts },
            reading: { parts: readingParts },
            writing: { parts: writingParts },
            speaking: {
                readySeconds: getNumber('vstep-speaking-ready-seconds', 60),
                readyMessage: getValue('vstep-speaking-ready-message'),
                parts: speakingParts
            }
        };

        return {
            title,
            type: VSTEP_TYPE,
            description: getValue('vstep-description'),
            duration_minutes: contentSkill === 'full_test'
                ? Object.values(durations).reduce((sum, value) => sum + value, 0)
                : durations[contentSkill],
            data
        };
    }

    function previewJson() {
        try {
            const payload = collectPayload();
            refs.preview.textContent = JSON.stringify(payload, null, 2);
            refs.preview.closest('details')?.setAttribute('open', 'open');
            return payload;
        } catch (error) {
            refs.preview.textContent = error.message;
            refs.preview.closest('details')?.setAttribute('open', 'open');
            throw error;
        }
    }

    async function uploadMediaFromInput(input) {
        const file = input.files && input.files[0];
        if (!file) return;

        const targetId = input.dataset.target;
        const dir = input.dataset.dir || 'audio/vstep';
        const status = $(`${input.id.replace(/-file$/, '')}-upload-status`);
        if (status) status.textContent = 'Đang upload file...';

        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = String(reader.result || '');
                    resolve(result.includes(',') ? result.split(',')[1] : result);
                };
                reader.onerror = () => reject(new Error('Không thể đọc file.'));
                reader.readAsDataURL(file);
            });

            const filePath = `${dir}/${Date.now()}_${sanitizeFileName(file.name)}`;
            const result = await fetchJson('/api/upload-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePath,
                    content: base64,
                    message: `Upload VSTEP media ${filePath}`
                })
            });

            setValue(targetId, result.rawUrl || filePath);
            if (status) status.textContent = 'Đã upload file.';
        } catch (error) {
            if (status) status.textContent = error.message;
            alert(error.message);
        } finally {
            input.value = '';
        }
    }

    function flowOfSet(set) {
        return set?.data?.vstep_flow || 'practice';
    }

    function inferContentSkillFromData(data = {}) {
        const explicit = data.vstep_practice_skill;
        if (Object.prototype.hasOwnProperty.call(CONTENT_SKILL_LABELS, explicit)) return explicit;
        const filledSkills = SKILL_KEYS.filter(skill => Array.isArray(data[skill]?.parts) && data[skill].parts.length);
        return filledSkills.length === 1 ? filledSkills[0] : 'full_test';
    }

    function contentSkillOfSet(set) {
        return inferContentSkillFromData(set?.data || {});
    }

    function filteredSets() {
        const keyword = getValue('vstepSetSearch').toLowerCase();
        const contentSkill = getContentSkill();
        return state.sets.filter(set => {
            if (flowOfSet(set) !== state.currentFlow) return false;
            if (state.currentFlow === 'practice' && contentSkillOfSet(set) !== contentSkill) return false;
            if (!keyword) return true;
            const haystack = [
                set.title,
                set.description,
                set.data?.status,
                set.data?.vstep_content_kind,
                CONTENT_SKILL_LABELS[contentSkillOfSet(set)]
            ].join(' ').toLowerCase();
            return haystack.includes(keyword);
        });
    }

    function summarizeSet(set) {
        const data = set?.data || {};
        const sum = parts => (parts || []).reduce((total, part) => total + (part.questions || []).length, 0);
        return {
            listening: sum(data.listening?.parts),
            reading: sum(data.reading?.parts),
            writing: data.writing?.parts?.length || 0,
            speaking: data.speaking?.parts?.length || 0
        };
    }

    function updateSetStats(sets) {
        const published = sets.filter(set => (set.data?.status || 'draft') === 'published').length;
        if (refs.statTotal) refs.statTotal.textContent = String(sets.length);
        if (refs.statPublished) refs.statPublished.textContent = String(published);
        if (refs.statDraft) refs.statDraft.textContent = String(Math.max(0, sets.length - published));
    }

    function updateOverview() {
        const practiceCount = state.sets.filter(set => flowOfSet(set) === 'practice').length;
        const lessonCount = state.sets.filter(set => flowOfSet(set) === 'lesson_exam').length;
        if (refs.overviewStudents) refs.overviewStudents.textContent = String(state.users.length);
        if (refs.overviewPractice) refs.overviewPractice.textContent = String(practiceCount);
        if (refs.overviewLessons) refs.overviewLessons.textContent = String(lessonCount);
        if (refs.overviewResults) refs.overviewResults.textContent = String(state.results.length);
    }

    function renderSetList() {
        const sets = filteredSets();
        updateSetStats(sets);
        if (!sets.length) {
            refs.setList.innerHTML = `<div class="text-secondary small">Chưa có nội dung VSTEP cho nhóm ${escapeHtml(FLOW_LABELS[state.currentFlow])}.</div>`;
            return;
        }

        refs.setList.innerHTML = sets.map(set => {
            const status = set?.data?.status || 'draft';
            const active = set.id === state.editingId ? ' active' : '';
            const date = set.created_at ? new Date(set.created_at).toLocaleDateString('vi-VN') : '';
            const summary = summarizeSet(set);
            const statusClass = status === 'published' ? 'vstep-status-published' : 'vstep-status-draft';
            return `
                <button type="button" class="vstep-set-item${active}" data-id="${escapeHtml(set.id)}">
                    <div class="vstep-set-item-top">
                        <div class="fw-bold">${escapeHtml(set.title || 'VSTEP content')}</div>
                        <span class="vstep-status-pill ${statusClass}">${escapeHtml(status)}</span>
                    </div>
                    <div class="vstep-set-meta">
                        <span><i class="bi bi-bullseye"></i> ${escapeHtml(CONTENT_SKILL_LABELS[contentSkillOfSet(set)] || 'VSTEP')}</span>
                        <span><i class="bi bi-clock"></i> ${escapeHtml(String(set.duration_minutes || 177))} phút</span>
                        <span><i class="bi bi-calendar3"></i> ${escapeHtml(date || '-')}</span>
                    </div>
                    <div class="vstep-set-counts">
                        <span>Listening ${summary.listening}</span>
                        <span>Reading ${summary.reading}</span>
                        <span>Writing ${summary.writing}</span>
                        <span>Speaking ${summary.speaking}</span>
                    </div>
                </button>
            `;
        }).join('');

        refs.setList.querySelectorAll('[data-id]').forEach(button => {
            button.addEventListener('click', () => {
                const set = state.sets.find(item => item.id === button.dataset.id);
                if (set) fillForm(set);
            });
        });
    }

    async function loadSets() {
        refs.setList.innerHTML = '<div class="text-secondary small">Đang tải dữ liệu...</div>';
        try {
            const result = await fetchJson('/api/vstep/contents/list');
            state.sets = (result.sets || []).sort((a, b) =>
                String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true })
            );
            updateOverview();
            renderSetList();
            renderAssignmentOptions();
        } catch (error) {
            refs.setList.innerHTML = `<div class="text-danger small">${escapeHtml(error.message)}</div>`;
        }
    }

    async function saveSet() {
        let payload;
        try {
            payload = previewJson();
        } catch (error) {
            alert(error.message);
            return;
        }

        refs.saveBtn.disabled = true;
        refs.saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang lưu...';

        try {
            const isUpdate = Boolean(state.editingId);
            const result = await fetchJson(isUpdate ? `/api/vstep/contents/update?id=${encodeURIComponent(state.editingId)}` : '/api/vstep/contents/create', {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            state.editingId = result.set?.id || result.content?.id || state.editingId;
            state.currentFlow = payload.data.vstep_flow || state.currentFlow;
            setValue('vstep-flow', state.currentFlow);
            await loadSets();
            alert('Đã lưu nội dung VSTEP.');
        } catch (error) {
            alert(error.message);
        } finally {
            refs.saveBtn.disabled = false;
            refs.saveBtn.innerHTML = '<i class="bi bi-cloud-upload me-1"></i> Lưu nội dung';
        }
    }

    function resetForm() {
        state.editingId = '';
        refs.form.reset();
        initEditors();
        setValue('vstep-flow', state.currentFlow);
        setValue('vstep-practice-skill', state.currentFlow === 'practice' ? 'listening' : 'full_test');
        setValue('vstep-content-kind', state.currentFlow === 'lesson_exam' ? 'assigned_exam' : 'mock_test');
        setValue('vstep-duration-listening', 45);
        setValue('vstep-duration-reading', 60);
        setValue('vstep-duration-writing', 60);
        setValue('vstep-duration-speaking', 12);
        setValue('vstep-speaking-ready-seconds', 60);
        setValue('vstep-speaking-ready-message', 'Bạn đeo tai nghe để làm bài thi nói. Bài làm sẽ được thu âm trực tiếp.');
        updateSkillEditorVisibility();
        refs.formTitle.textContent = `Tạo ${FLOW_LABELS[state.currentFlow]} VSTEP mới`;
        refs.preview.textContent = '{}';
        renderSetList();
    }

    function fillForm(set) {
        const data = set.data || {};
        state.editingId = set.id;
        state.currentFlow = flowOfSet(set);
        showContentFlow(state.currentFlow, { reset: false });
        refs.form.reset();
        initEditors();
        refs.formTitle.textContent = `Đang sửa: ${set.title || 'VSTEP content'}`;
        setValue('vstep-title', set.title || '');
        setValue('vstep-description', set.description || '');
        setValue('vstep-flow', data.vstep_flow || state.currentFlow);
        setValue('vstep-practice-skill', inferContentSkillFromData(data));
        setValue('vstep-content-kind', data.vstep_content_kind || 'mock_test');
        setValue('vstep-status', data.status || 'draft');
        setValue('vstep-duration-listening', data.durations?.listening || 45);
        setValue('vstep-duration-reading', data.durations?.reading || 60);
        setValue('vstep-duration-writing', data.durations?.writing || 60);
        setValue('vstep-duration-speaking', data.durations?.speaking || 12);

        (data.listening?.parts || []).slice(0, 3).forEach((part, idx) => {
            const index = idx + 1;
            setValue(`vstep-listening-${index}-title`, part.title || `Part ${index}`);
            setValue(`vstep-listening-${index}-audio`, part.audioUrl || '');
            setValue(`vstep-listening-${index}-directions`, part.directions || '');
            renderQuestionRows(`vstep-listening-${index}-questions`, part.questions || []);
            setValue(`vstep-listening-${index}-questions-count`, (part.questions || []).length);
            setValue(`vstep-listening-${index}-transcript`, part.transcript || '');
        });

        (data.reading?.parts || []).slice(0, 4).forEach((part, idx) => {
            const index = idx + 1;
            setValue(`vstep-reading-${index}-title`, part.title || `Part ${index}`);
            setValue(`vstep-reading-${index}-passage`, part.passage || '');
            renderQuestionRows(`vstep-reading-${index}-questions`, part.questions || []);
            setValue(`vstep-reading-${index}-questions-count`, (part.questions || []).length);
        });

        (data.writing?.parts || []).slice(0, 2).forEach((part, idx) => {
            const index = idx + 1;
            const defaults = WRITING_DEFAULTS[index - 1] || WRITING_DEFAULTS[0];
            setValue(`vstep-writing-${index}-title`, part.title || `Part ${index}`);
            setValue(`vstep-writing-${index}-instructions`, part.instructions || part.directions || defaults.instruction);
            setValue(`vstep-writing-${index}-prompt`, part.prompt || '');
            setValue(`vstep-writing-${index}-extract`, part.extract || part.quote || part.reportExtract || '');
            setValue(`vstep-writing-${index}-min`, part.minWords || defaults.min);
            setValue(`vstep-writing-${index}-max`, part.maxWords || defaults.max);
        });

        setValue('vstep-speaking-ready-seconds', data.speaking?.readySeconds || 60);
        setValue('vstep-speaking-ready-message', data.speaking?.readyMessage || '');
        (data.speaking?.parts || []).slice(0, 3).forEach((part, idx) => {
            const index = idx + 1;
            const timing = SPEAKING_TIMING_DEFAULTS[index - 1] || SPEAKING_TIMING_DEFAULTS[0];
            setValue(`vstep-speaking-${index}-title`, part.title || `Part ${index}`);
            setValue(`vstep-speaking-${index}-audio`, part.introAudioUrl || '');
            setValue(`vstep-speaking-${index}-image`, part.imageUrl || part.image || '');
            setValue(`vstep-speaking-${index}-prompt`, part.prompt || '');
            setChecked(`vstep-speaking-${index}-custom-timing`, part.useCustomTiming === true);
            setValue(`vstep-speaking-${index}-prep`, Number.isFinite(Number(part.prepSeconds)) ? part.prepSeconds : timing.prep);
            setValue(`vstep-speaking-${index}-answer`, Number.isFinite(Number(part.answerSeconds)) ? part.answerSeconds : timing.answer);
        });

        refs.preview.textContent = JSON.stringify({
            title: set.title,
            type: VSTEP_TYPE,
            description: set.description || '',
            duration_minutes: set.duration_minutes,
            data
        }, null, 2);
        updateSkillEditorVisibility();
        renderSetList();
    }

    function setStudentAlert(message, type = 'info') {
        if (!refs.studentAlert) return;
        refs.studentAlert.className = `alert alert-${type} small mb-0`;
        refs.studentAlert.textContent = message;
    }

    async function loadUsers() {
        try {
            const result = await fetchJson('/api/vstep/students/list');
            state.users = result.students || [];
            updateOverview();
            renderUsers();
        } catch (error) {
            refs.usersBody.innerHTML = `<tr><td colspan="7" class="text-danger text-center py-3">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    function renderUsers() {
        const keyword = getValue('vstepStudentSearch').toLowerCase();
        const users = state.users.filter(user => {
            if (!keyword) return true;
            return [
                user.account_code,
                user.username,
                user.full_name,
                user.email,
                user.phone_number
            ].join(' ').toLowerCase().includes(keyword);
        });
        if (!users.length) {
            refs.usersBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">Chưa có học viên VSTEP.</td></tr>';
            return;
        }
        refs.usersBody.innerHTML = users.map(user => `
            <tr>
                <td><span class="vstep-code-pill">${escapeHtml(user.account_code || user.username || '-')}</span></td>
                <td class="fw-semibold">${escapeHtml(user.full_name || '-')}</td>
                <td>${escapeHtml(user.band || '-')}</td>
                <td><span class="vstep-status-pill ${user.practice_access === false ? 'vstep-status-draft' : 'vstep-status-published'}">${user.practice_access === false ? 'Tắt' : 'Bật'}</span></td>
                <td>${escapeHtml(user.email || '-')}</td>
                <td><span class="vstep-device-pill">${escapeHtml(String(user.device_count || 0))}/${escapeHtml(String(user.device_limit || 2))}</span></td>
                <td>${escapeHtml(user.expires_at ? new Date(user.expires_at).toLocaleDateString('vi-VN') : '-')}</td>
            </tr>
        `).join('');
        renderClassStudentOptions();
        renderAssignmentOptions();
    }

    async function createStudent(event) {
        event.preventDefault();
        const accountCode = getValue('vstep-student-account');
        if (!accountCode) {
            setStudentAlert('Vui lòng nhập mã học viên.', 'warning');
            return;
        }
        refs.createStudentBtn.disabled = true;
        try {
            const notes = ['[VSTEP]', getValue('vstep-student-notes')].filter(Boolean).join(' ');
            const result = await fetchJson('/api/vstep/students/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountCode,
                    email: getValue('vstep-student-email') || undefined,
                    fullName: getValue('vstep-student-name') || undefined,
                    phone: getValue('vstep-student-phone') || undefined,
                    band: getValue('vstep-student-band') || 'B1',
                    practiceAccess: isChecked('vstep-student-practice-access'),
                    password: getValue('vstep-student-password') || undefined,
                    deviceLimit: getNumber('vstep-student-device-limit', 2),
                    expiresAt: getValue('vstep-student-expires') || undefined,
                    notes,
                    course: 'VSTEP',
                    learningProgram: 'vstep'
                })
            });
            refs.studentForm.reset();
            setValue('vstep-student-device-limit', 2);
            setValue('vstep-student-band', 'B1');
            const practiceAccess = $('vstep-student-practice-access');
            if (practiceAccess) practiceAccess.checked = true;
            const temp = result.temporaryPassword ? ` Mật khẩu tạm: ${result.temporaryPassword}` : '';
            setStudentAlert(`Đã tạo học viên VSTEP.${temp}`, 'success');
            await loadUsers();
        } catch (error) {
            setStudentAlert(error.message, 'danger');
        } finally {
            refs.createStudentBtn.disabled = false;
        }
    }

    function setImportAlert(message, type = 'info') {
        if (!refs.importAlert) return;
        refs.importAlert.className = `alert alert-${type} small mt-3 mb-0`;
        refs.importAlert.textContent = message;
    }

    function splitImportLine(line) {
        const delimiter = line.includes('\t') ? '\t' : ',';
        return line.split(delimiter).map(value => value.trim());
    }

    function parseBooleanCell(value, fallback = true) {
        const normalized = String(value || '').trim().toLowerCase();
        if (!normalized) return fallback;
        return ['1', 'true', 'yes', 'y', 'co', 'có', 'bat', 'bật'].includes(normalized);
    }

    function parseStudentImportRows(text) {
        const rows = String(text || '')
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean)
            .map(splitImportLine);
        if (!rows.length) return [];

        const headerAliases = {
            accountcode: 'accountCode',
            account_code: 'accountCode',
            ma: 'accountCode',
            code: 'accountCode',
            full_name: 'fullName',
            fullname: 'fullName',
            name: 'fullName',
            ho_ten: 'fullName',
            phone_number: 'phone',
            phone: 'phone',
            sdt: 'phone',
            email: 'email',
            band: 'band',
            level: 'band',
            expiresat: 'expiresAt',
            expires_at: 'expiresAt',
            expire_date: 'expiresAt',
            practiceaccess: 'practiceAccess',
            practice_access: 'practiceAccess',
            password: 'password',
            notes: 'notes'
        };
        const first = rows[0].map(cell => cell.toLowerCase().replace(/\s+/g, '_'));
        const hasHeader = first.some(cell => headerAliases[cell]);
        const headers = hasHeader
            ? first.map(cell => headerAliases[cell] || cell)
            : ['accountCode', 'fullName', 'email', 'phone', 'band', 'expiresAt', 'practiceAccess', 'password', 'notes'];
        const dataRows = hasHeader ? rows.slice(1) : rows;

        return dataRows.map(row => headers.reduce((acc, key, index) => {
            if (!key) return acc;
            const value = row[index] || '';
            if (key === 'practiceAccess') acc.practiceAccess = parseBooleanCell(value, true);
            else if (key) acc[key] = value;
            return acc;
        }, {})).filter(item => item.accountCode || item.email);
    }

    async function importStudents() {
        const students = parseStudentImportRows(getValue('vstepImportText'));
        if (!students.length) {
            setImportAlert('Chưa có dòng học viên hợp lệ để import.', 'warning');
            return;
        }
        refs.importBtn.disabled = true;
        setImportAlert(`Đang import ${students.length} học viên...`, 'info');
        try {
            const result = await fetchJson('/api/vstep/students/bulk-import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ students })
            });
            const failed = Number(result.failed || 0);
            setImportAlert(`Import xong: tạo mới ${result.created || 0}, cập nhật ${result.updated || 0}, lỗi ${failed}.`, failed ? 'warning' : 'success');
            await loadUsers();
        } catch (error) {
            setImportAlert(error.message, 'danger');
        } finally {
            refs.importBtn.disabled = false;
        }
    }

    function setResourceAlert(message, type = 'info') {
        if (!refs.resourceAlert) return;
        refs.resourceAlert.className = `alert alert-${type} small mb-0`;
        refs.resourceAlert.textContent = message;
    }

    function resourceDir(type) {
        if (type === 'image') return 'images/vstep/resources';
        if (type === 'text' || type === 'document') return 'documents/vstep/resources';
        return 'audio/vstep/resources';
    }

    async function uploadResourceFile(file, type) {
        const base64 = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const result = String(reader.result || '');
                resolve(result.includes(',') ? result.split(',')[1] : result);
            };
            reader.onerror = () => reject(new Error('Không thể đọc file tài nguyên.'));
            reader.readAsDataURL(file);
        });
        const filePath = `${resourceDir(type)}/${Date.now()}_${sanitizeFileName(file.name)}`;
        const result = await fetchJson('/api/upload-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filePath,
                content: base64,
                message: `Upload VSTEP resource ${filePath}`
            })
        });
        return {
            filePath,
            rawUrl: result.rawUrl || filePath,
            mimeType: file.type || null
        };
    }

    async function createResource(event) {
        event.preventDefault();
        const title = getValue('vstep-resource-title');
        const type = getValue('vstep-resource-type') || 'file';
        const file = refs.resourceFile?.files?.[0] || null;
        if (!title) {
            setResourceAlert('Vui lòng nhập tên tài nguyên.', 'warning');
            return;
        }

        refs.saveResourceBtn.disabled = true;
        setResourceAlert(file ? 'Đang upload tài nguyên...' : 'Đang lưu tài nguyên...', 'info');
        try {
            let uploaded = null;
            if (file) {
                uploaded = await uploadResourceFile(file, type);
                setValue('vstep-resource-url', uploaded.rawUrl);
            }
            const result = await fetchJson('/api/vstep/resources/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resourceType: type,
                    title,
                    description: getValue('vstep-resource-description'),
                    fileUrl: uploaded?.rawUrl || getValue('vstep-resource-url'),
                    filePath: uploaded?.filePath || '',
                    mimeType: uploaded?.mimeType || null
                })
            });
            if (!result.success) throw new Error('Không thể lưu tài nguyên VSTEP.');
            refs.resourceForm.reset();
            setResourceAlert('Đã lưu tài nguyên VSTEP.', 'success');
            await loadResources();
        } catch (error) {
            setResourceAlert(error.message, 'danger');
        } finally {
            refs.saveResourceBtn.disabled = false;
        }
    }

    async function loadResources() {
        if (!refs.resourcesBody) return;
        refs.resourcesBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Đang tải tài nguyên...</td></tr>';
        try {
            const result = await fetchJson('/api/vstep/resources/list');
            state.resources = result.resources || [];
            renderResources();
        } catch (error) {
            refs.resourcesBody.innerHTML = `<tr><td colspan="4" class="text-danger text-center py-3">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    function renderResources() {
        if (!refs.resourcesBody) return;
        if (!state.resources.length) {
            refs.resourcesBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted py-3">Chưa có tài nguyên VSTEP.</td></tr>';
            return;
        }
        refs.resourcesBody.innerHTML = state.resources.map(resource => {
            const url = resource.file_url || resource.file_path || '';
            return `
                <tr>
                    <td><span class="vstep-status-pill vstep-status-draft">${escapeHtml(resource.resource_type || 'file')}</span></td>
                    <td class="fw-semibold">${escapeHtml(resource.title || '-')}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-secondary vstep-copy-resource" data-url="${escapeHtml(url)}">
                            <i class="bi bi-copy me-1"></i>Copy URL
                        </button>
                        <span class="small text-muted ms-2">${escapeHtml(url.slice(0, 46))}${url.length > 46 ? '...' : ''}</span>
                    </td>
                    <td>${escapeHtml(resource.created_at ? new Date(resource.created_at).toLocaleDateString('vi-VN') : '-')}</td>
                </tr>
            `;
        }).join('');
        refs.resourcesBody.querySelectorAll('.vstep-copy-resource').forEach(button => {
            button.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(button.dataset.url || '');
                    button.textContent = 'Đã copy';
                } catch {
                    prompt('Copy URL tài nguyên:', button.dataset.url || '');
                }
            });
        });
    }

    function setClassAlert(message, type = 'info') {
        if (!refs.classAlert) return;
        refs.classAlert.className = `alert alert-${type} small mb-0`;
        refs.classAlert.textContent = message;
    }

    function setAssignmentAlert(message, type = 'info') {
        if (!refs.assignmentAlert) return;
        refs.assignmentAlert.className = `alert alert-${type} small mb-0`;
        refs.assignmentAlert.textContent = message;
    }

    function renderClassStudentOptions() {
        if (!refs.classStudents) return;
        refs.classStudents.innerHTML = state.users.map(user => `
            <option value="${escapeHtml(user.id)}">${escapeHtml(user.account_code || user.username || user.email || user.id)} - ${escapeHtml(user.full_name || user.email || '')}</option>
        `).join('');
    }

    function renderAssignmentOptions() {
        if (refs.assignmentContent) {
            const eligibleSets = state.sets.filter(set => flowOfSet(set) === 'lesson_exam');
            refs.assignmentContent.innerHTML = eligibleSets.length
                ? eligibleSets.map(set => `<option value="${escapeHtml(set.id)}">${escapeHtml(set.title || set.id)}</option>`).join('')
                : '<option value="">Chưa có nội dung học tập</option>';
        }
        if (refs.assignmentClass) {
            refs.assignmentClass.innerHTML = [
                '<option value="">Không chọn lớp</option>',
                ...state.classes.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.title || item.id)}</option>`)
            ].join('');
        }
        if (refs.assignmentStudent) {
            refs.assignmentStudent.innerHTML = [
                '<option value="">Theo lớp</option>',
                ...state.users.map(user => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.account_code || user.email || user.id)} - ${escapeHtml(user.full_name || '')}</option>`)
            ].join('');
        }
    }

    async function loadClasses() {
        if (!refs.classesList) return;
        refs.classesList.innerHTML = '<div class="text-secondary small">Đang tải lớp...</div>';
        try {
            const result = await fetchJson('/api/vstep/classes/list');
            state.classes = result.classes || [];
            state.memberships = result.memberships || [];
            renderClasses();
            renderAssignmentOptions();
        } catch (error) {
            refs.classesList.innerHTML = `<div class="text-danger small">${escapeHtml(error.message)}</div>`;
        }
    }

    function renderClasses() {
        if (!refs.classesList) return;
        if (!state.classes.length) {
            refs.classesList.innerHTML = '<div class="text-secondary small">Chưa có lớp VSTEP.</div>';
            return;
        }
        refs.classesList.innerHTML = state.classes.map(item => {
            const count = state.memberships.filter(member => member.class_id === item.id && member.status !== 'archived').length;
            const start = item.starts_at ? new Date(item.starts_at).toLocaleString('vi-VN') : '-';
            const end = item.ends_at ? new Date(item.ends_at).toLocaleString('vi-VN') : '-';
            return `
                <article class="vstep-class-card">
                    <div class="d-flex justify-content-between gap-2">
                        <div>
                            <div class="fw-bold">${escapeHtml(item.title || 'VSTEP class')}</div>
                            <div class="vstep-help">${escapeHtml(item.teacher_name || 'Chưa gán giáo viên')} · ${escapeHtml(item.band || 'B1')}</div>
                        </div>
                        <span class="vstep-status-pill vstep-status-published">${count} HV</span>
                    </div>
                    <div class="vstep-class-meta">
                        <span><i class="bi bi-play-circle"></i> ${escapeHtml(start)}</span>
                        <span><i class="bi bi-flag"></i> ${escapeHtml(end)}</span>
                    </div>
                </article>
            `;
        }).join('');
    }

    async function createClass(event) {
        event.preventDefault();
        const title = getValue('vstep-class-title');
        if (!title) {
            setClassAlert('Vui lòng nhập tên lớp.', 'warning');
            return;
        }
        refs.saveClassBtn.disabled = true;
        try {
            const body = {
                title,
                band: getValue('vstep-class-band') || 'B1',
                teacherName: getValue('vstep-class-teacher'),
                startsAt: dateTimeValue('vstep-class-starts'),
                endsAt: dateTimeValue('vstep-class-ends'),
                schedule: parseJsonField('vstep-class-schedule', []),
                holidays: parseJsonField('vstep-class-holidays', []),
                studentIds: selectedValues('vstep-class-students')
            };
            const result = await fetchJson('/api/vstep/classes/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!result.success) throw new Error('Không thể tạo lớp VSTEP.');
            refs.classForm.reset();
            setClassAlert('Đã tạo lớp VSTEP.', 'success');
            await loadClasses();
            await loadUsers();
        } catch (error) {
            setClassAlert(error.message, 'danger');
        } finally {
            refs.saveClassBtn.disabled = false;
        }
    }

    async function createAssignment(event) {
        event.preventDefault();
        const contentId = getValue('vstep-assignment-content');
        const classId = getValue('vstep-assignment-class');
        const studentId = getValue('vstep-assignment-student');
        if (!contentId) {
            setAssignmentAlert('Vui lòng chọn nội dung cần giao.', 'warning');
            return;
        }
        if (!classId && !studentId) {
            setAssignmentAlert('Chọn lớp hoặc học viên để giao bài.', 'warning');
            return;
        }
        refs.createAssignmentBtn.disabled = true;
        try {
            const result = await fetchJson('/api/vstep/assignments/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentId,
                    classId: classId || undefined,
                    studentIds: studentId ? [studentId] : undefined,
                    availableFrom: dateTimeValue('vstep-assignment-available'),
                    dueAt: dateTimeValue('vstep-assignment-due'),
                    notes: getValue('vstep-assignment-notes')
                })
            });
            setAssignmentAlert(`Đã giao ${result.assignments?.length || 0} bài VSTEP.`, 'success');
            refs.assignmentForm.reset();
            renderAssignmentOptions();
        } catch (error) {
            setAssignmentAlert(error.message, 'danger');
        } finally {
            refs.createAssignmentBtn.disabled = false;
        }
    }

    function userMap() {
        return state.users.reduce((acc, user) => {
            acc[user.id] = user;
            acc[user.user_id] = user;
            return acc;
        }, {});
    }

    function isVstepResult(result) {
        return true;
    }

    async function loadResults() {
        refs.resultsBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">Đang tải kết quả...</td></tr>';
        try {
            if (!state.users.length) await loadUsers();
            const result = await fetchJson('/api/vstep/results/list?limit=200');
            state.results = (result.results || []).filter(isVstepResult);
            updateOverview();
            renderResults();
        } catch (error) {
            refs.resultsBody.innerHTML = `<tr><td colspan="7" class="text-danger text-center py-3">${escapeHtml(error.message)}</td></tr>`;
        }
    }

    function resultFlow(result) {
        return result.metadata?.vstep_flow || 'practice';
    }

    function renderResults() {
        const flowFilter = getValue('vstepResultFlowFilter');
        const users = userMap();
        const keyword = getValue('vstepResultSearch').toLowerCase();
        const results = state.results.filter(result => {
            if (flowFilter && resultFlow(result) !== flowFilter) return false;
            if (!keyword) return true;
            const user = users[result.user_id] || {};
            const md = result.metadata || {};
            return [
                user.full_name,
                user.account_code,
                user.email,
                result.content_title,
                md.vstep_set_title,
                result.user_id
            ].join(' ').toLowerCase().includes(keyword);
        });
        if (!results.length) {
            refs.resultsBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-3">Chưa có kết quả VSTEP phù hợp.</td></tr>';
            return;
        }

        refs.resultsBody.innerHTML = results.map(result => {
            const user = users[result.user_id] || {};
            const md = result.metadata || {};
            const manual = [
                md.writing_answers?.length ? 'Writing' : '',
                md.speaking_answers && Object.keys(md.speaking_answers).length ? 'Speaking' : ''
            ].filter(Boolean).join(', ') || 'Không có';
            const manualScore = result.manual_score == null
                ? manual
                : `${Number(result.manual_score || 0)} điểm`;
            const score = `${Number(result.total_score || 0)}/${Number(result.max_score || 0)}`;
            return `
                <tr>
                    <td>${escapeHtml(result.submitted_at ? new Date(result.submitted_at).toLocaleString('vi-VN') : '-')}</td>
                    <td>${escapeHtml(user.full_name || user.account_code || result.user_id || '-')}</td>
                    <td>${escapeHtml(result.content_title || md.vstep_set_title || '-')}</td>
                    <td><span class="vstep-status-pill vstep-status-published">${escapeHtml(FLOW_LABELS[resultFlow(result)] || resultFlow(result))}</span></td>
                    <td class="fw-semibold">${escapeHtml(score)}</td>
                    <td>${escapeHtml(manualScore)}</td>
                    <td><button type="button" class="btn btn-sm btn-outline-secondary" data-result-id="${escapeHtml(result.id)}"><i class="bi bi-search me-1"></i>Chi tiết</button></td>
                </tr>
            `;
        }).join('');

        refs.resultsBody.querySelectorAll('[data-result-id]').forEach(button => {
            button.addEventListener('click', () => showResultDetail(button.dataset.resultId));
        });
    }

    function showResultDetail(id) {
        const result = state.results.find(item => String(item.id) === String(id));
        if (!result) return;

        // Ảnh giám thị (chụp lúc nhận đề) lưu trong metadata.proctor_photo (data URL).
        const proctorPhoto = result.metadata?.proctor_photo || '';
        const photoHtml = proctorPhoto
            ? `
            <div class="vstep-grade-box mb-3">
                <label class="form-label text-white">Ảnh giám thị (lúc nhận đề)</label>
                <div><img src="${escapeHtml(proctorPhoto)}" alt="Ảnh giám thị" style="max-width:320px;width:100%;border-radius:8px;border:1px solid #94c7f0;display:block;"></div>
            </div>`
            : '';

        // Bỏ chuỗi base64 ảnh khỏi JSON dump cho gọn (đã hiển thị ảnh ở trên).
        const resultForDump = { ...result };
        if (resultForDump.metadata?.proctor_photo) {
            resultForDump.metadata = { ...resultForDump.metadata, proctor_photo: '[ảnh giám thị - xem ở trên]' };
        }

        refs.resultDetail.innerHTML = `
            <div class="vstep-grade-box mb-3">
                <label class="form-label text-white" for="vstep-manual-score">Điểm chấm tay</label>
                <input type="number" step="0.1" min="0" class="form-control form-control-sm mb-2" id="vstep-manual-score" value="${escapeHtml(result.manual_score ?? '')}">
                <label class="form-label text-white" for="vstep-manual-feedback">Nhận xét giáo viên</label>
                <textarea class="form-control form-control-sm mb-2" id="vstep-manual-feedback" rows="3">${escapeHtml(result.manual_feedback || '')}</textarea>
                <button type="button" class="btn btn-sm btn-success" id="saveVstepGradeBtn" data-result-id="${escapeHtml(result.id)}">
                    <i class="bi bi-check2-circle me-1"></i>Lưu chấm tay
                </button>
                <div class="small mt-2" id="vstepGradeStatus"></div>
            </div>
            ${photoHtml}
            <pre class="mb-0">${escapeHtml(JSON.stringify(resultForDump, null, 2))}</pre>
        `;
        $('saveVstepGradeBtn')?.addEventListener('click', () => saveManualGrade(result.id));
    }

    async function saveManualGrade(id) {
        const status = $('vstepGradeStatus');
        if (status) status.textContent = 'Đang lưu chấm tay...';
        try {
            await fetchJson(`/api/vstep/results/update?id=${encodeURIComponent(id)}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    manualScore: getValue('vstep-manual-score'),
                    manualFeedback: getValue('vstep-manual-feedback')
                })
            });
            if (status) status.textContent = 'Đã lưu điểm và nhận xét.';
            await loadResults();
        } catch (error) {
            if (status) status.textContent = error.message;
        }
    }

    function showPanel(panel) {
        state.currentPanel = panel;
        document.querySelectorAll('.vstep-admin-section').forEach(section => section.classList.remove('active'));
        $(`vstep-${panel}-panel`)?.classList.add('active');
        document.querySelectorAll('.vstep-admin-tab').forEach(button => button.classList.remove('active'));
        document.querySelectorAll(`[data-vstep-panel="${panel}"]`).forEach(button => button.classList.add('active'));
    }

    function showContentFlow(flow, options = {}) {
        state.currentFlow = flow || 'practice';
        showPanel('content');
        document.querySelectorAll('.vstep-admin-tab').forEach(button => button.classList.remove('active'));
        document.querySelector(`[data-vstep-flow="${state.currentFlow}"]`)?.classList.add('active');
        setValue('vstep-flow', state.currentFlow);
        if (refs.setListTitle) refs.setListTitle.textContent = `${FLOW_LABELS[state.currentFlow]} VSTEP`;
        if (refs.formSubtitle) {
            refs.formSubtitle.textContent = state.currentFlow === 'practice'
                ? 'Tạo bộ đề ôn thi VSTEP để học viên tự luyện theo mẫu phân khu Aptis.'
                : 'Tạo nội dung học tập VSTEP để giao cho lớp/học viên theo mẫu module lớp học.';
        }
        if (options.reset !== false) resetForm();
        renderSetList();
    }

    function bindRefs() {
        refs.form = $('vstepSetForm');
        refs.formTitle = $('vstepFormTitle');
        refs.formSubtitle = $('vstepFormSubtitle');
        refs.practiceSkill = $('vstep-practice-skill');
        refs.setList = $('vstepSetList');
        refs.setListTitle = $('vstepSetListTitle');
        refs.preview = $('vstepJsonPreview');
        refs.saveBtn = $('saveVstepSetBtn');
        refs.listeningEditors = $('vstep-listening-editors');
        refs.readingEditors = $('vstep-reading-editors');
        refs.writingEditors = $('vstep-writing-editors');
        refs.speakingEditors = $('vstep-speaking-editors');
        refs.statTotal = $('vstepStatTotal');
        refs.statPublished = $('vstepStatPublished');
        refs.statDraft = $('vstepStatDraft');
        refs.studentForm = $('vstepStudentForm');
        refs.studentAlert = $('vstepStudentAlert');
        refs.usersBody = $('vstepUsersTableBody');
        refs.createStudentBtn = $('createVstepStudentBtn');
        refs.importAlert = $('vstepImportAlert');
        refs.importBtn = $('importVstepStudentsBtn');
        refs.resourceForm = $('vstepResourceForm');
        refs.resourceAlert = $('vstepResourceAlert');
        refs.resourceFile = $('vstep-resource-file');
        refs.resourcesBody = $('vstepResourcesTableBody');
        refs.saveResourceBtn = $('saveVstepResourceBtn');
        refs.classForm = $('vstepClassForm');
        refs.classAlert = $('vstepClassAlert');
        refs.classStudents = $('vstep-class-students');
        refs.classesList = $('vstepClassesList');
        refs.saveClassBtn = $('saveVstepClassBtn');
        refs.assignmentForm = $('vstepAssignmentForm');
        refs.assignmentAlert = $('vstepAssignmentAlert');
        refs.assignmentContent = $('vstep-assignment-content');
        refs.assignmentClass = $('vstep-assignment-class');
        refs.assignmentStudent = $('vstep-assignment-student');
        refs.createAssignmentBtn = $('createVstepAssignmentBtn');
        refs.resultsBody = $('vstepResultsTableBody');
        refs.resultDetail = $('vstepResultDetail');
        refs.overviewStudents = $('vstepOverviewStudents');
        refs.overviewPractice = $('vstepOverviewPractice');
        refs.overviewLessons = $('vstepOverviewLessons');
        refs.overviewResults = $('vstepOverviewResults');
    }

    async function init() {
        bindRefs();
        if (typeof requireAdmin === 'function') {
            const ok = await requireAdmin();
            if (!ok) return;
        }
        initEditors();
        resetForm();

        document.querySelectorAll('[data-vstep-panel]').forEach(button => {
            button.addEventListener('click', () => {
                showPanel(button.dataset.vstepPanel);
                if (button.dataset.vstepPanel === 'students') loadUsers();
                if (button.dataset.vstepPanel === 'resources') loadResources();
                if (button.dataset.vstepPanel === 'classes') {
                    loadClasses();
                    renderClassStudentOptions();
                    renderAssignmentOptions();
                }
                if (button.dataset.vstepPanel === 'results') loadResults();
            });
        });
        document.querySelectorAll('[data-vstep-flow]').forEach(button => {
            button.addEventListener('click', () => showContentFlow(button.dataset.vstepFlow));
        });

        $('newVstepSetBtn')?.addEventListener('click', () => showContentFlow(state.currentFlow || 'practice'));
        $('resetVstepFormBtn')?.addEventListener('click', resetForm);
        $('refreshVstepSetsBtn')?.addEventListener('click', loadSets);
        $('refreshVstepUsersBtn')?.addEventListener('click', loadUsers);
        $('refreshVstepResourcesBtn')?.addEventListener('click', loadResources);
        $('refreshVstepClassesBtn')?.addEventListener('click', loadClasses);
        $('refreshVstepResultsBtn')?.addEventListener('click', loadResults);
        $('vstepResultFlowFilter')?.addEventListener('change', renderResults);
        $('vstepSetSearch')?.addEventListener('input', renderSetList);
        $('vstepStudentSearch')?.addEventListener('input', renderUsers);
        $('vstepResultSearch')?.addEventListener('input', renderResults);
        $('previewVstepJsonBtn')?.addEventListener('click', () => {
            try {
                previewJson();
            } catch (error) {
                alert(error.message);
            }
        });
        refs.saveBtn?.addEventListener('click', saveSet);
        refs.studentForm?.addEventListener('submit', createStudent);
        refs.importBtn?.addEventListener('click', importStudents);
        refs.resourceForm?.addEventListener('submit', createResource);
        refs.classForm?.addEventListener('submit', createClass);
        refs.assignmentForm?.addEventListener('submit', createAssignment);
        $('vstep-flow')?.addEventListener('change', () => {
            state.currentFlow = getValue('vstep-flow') || 'practice';
            if (state.currentFlow === 'practice' && getContentSkill() === 'full_test') {
                setValue('vstep-practice-skill', 'listening');
            }
            updateSkillEditorVisibility();
            renderSetList();
        });
        refs.practiceSkill?.addEventListener('change', () => {
            updateSkillEditorVisibility();
            renderSetList();
        });

        await loadUsers();
        await Promise.all([loadSets(), loadResources(), loadClasses()]);
        await loadResults();
        showPanel('students');
    }

    document.addEventListener('DOMContentLoaded', init);
})();
