(function () {
    const VSTEP_TYPE = 'vstep';
    const refs = {};
    const state = {
        editingId: '',
        sets: []
    };

    const skillLabels = {
        listening: 'Listening',
        reading: 'Reading',
        writing: 'Writing',
        speaking: 'Speaking'
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

    function getNumber(id, fallback) {
        const value = Number(getValue(id));
        return Number.isFinite(value) && value >= 0 ? value : fallback;
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

    function initEditors() {
        refs.listeningEditors.innerHTML = [1, 2, 3].map(index => `
            <div class="vstep-part-editor">
                <h3 class="h6 mb-3">Listening Part ${index}</h3>
                <div class="row g-3">
                    <div class="col-lg-5">
                        <label class="form-label" for="vstep-listening-${index}-title">Tiêu đề part</label>
                        <input class="form-control" id="vstep-listening-${index}-title" value="Part ${index}">
                    </div>
                    <div class="col-lg-7">
                        <label class="form-label" for="vstep-listening-${index}-audio">Audio URL</label>
                        <input class="form-control" id="vstep-listening-${index}-audio" placeholder="audio/vstep/listening/part${index}.mp3">
                    </div>
                    <div class="col-lg-7">
                        <label class="form-label" for="vstep-listening-${index}-file">Upload audio</label>
                        <input type="file" class="form-control vstep-audio-file" id="vstep-listening-${index}-file" accept="audio/mp3,audio/mpeg,audio/webm,audio/ogg,.mp3,.webm,.ogg" data-target="vstep-listening-${index}-audio" data-dir="audio/vstep/listening/part${index}">
                        <div class="vstep-help mt-1" id="vstep-listening-${index}-upload-status"></div>
                    </div>
                    <div class="col-lg-5">
                        <label class="form-label" for="vstep-listening-${index}-directions">Directions</label>
                        <textarea class="form-control" id="vstep-listening-${index}-directions" rows="3">Listen and choose the correct answer.</textarea>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="vstep-listening-${index}-questions">Câu hỏi trắc nghiệm</label>
                        <textarea class="form-control" id="vstep-listening-${index}-questions" rows="5" placeholder="${escapeHtml(buildQuestionHelp('listening'))}"></textarea>
                        <div class="vstep-help mt-1">${escapeHtml(buildQuestionHelp('listening'))}</div>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="vstep-listening-${index}-transcript">Transcript nội bộ (tùy chọn)</label>
                        <textarea class="form-control" id="vstep-listening-${index}-transcript" rows="3"></textarea>
                    </div>
                </div>
            </div>
        `).join('');

        refs.readingEditors.innerHTML = [1, 2, 3, 4].map(index => `
            <div class="vstep-part-editor">
                <h3 class="h6 mb-3">Reading Part ${index}</h3>
                <div class="row g-3">
                    <div class="col-lg-5">
                        <label class="form-label" for="vstep-reading-${index}-title">Tiêu đề part</label>
                        <input class="form-control" id="vstep-reading-${index}-title" value="Part ${index}">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="vstep-reading-${index}-passage">Bài đọc</label>
                        <textarea class="form-control" id="vstep-reading-${index}-passage" rows="8"></textarea>
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="vstep-reading-${index}-questions">Câu hỏi trắc nghiệm</label>
                        <textarea class="form-control" id="vstep-reading-${index}-questions" rows="5" placeholder="${escapeHtml(buildQuestionHelp('reading'))}"></textarea>
                        <div class="vstep-help mt-1">${escapeHtml(buildQuestionHelp('reading'))}</div>
                    </div>
                </div>
            </div>
        `).join('');

        refs.writingEditors.innerHTML = [1, 2].map(index => `
            <div class="vstep-part-editor">
                <h3 class="h6 mb-3">Writing Part ${index}</h3>
                <div class="row g-3">
                    <div class="col-lg-4">
                        <label class="form-label" for="vstep-writing-${index}-title">Tiêu đề</label>
                        <input class="form-control" id="vstep-writing-${index}-title" value="${index === 1 ? 'Part 1: Letter / Email' : 'Part 2: Essay'}">
                    </div>
                    <div class="col-6 col-lg-2">
                        <label class="form-label" for="vstep-writing-${index}-min">Tối thiểu từ</label>
                        <input type="number" min="0" class="form-control" id="vstep-writing-${index}-min" value="${index === 1 ? 120 : 250}">
                    </div>
                    <div class="col-6 col-lg-2">
                        <label class="form-label" for="vstep-writing-${index}-max">Tối đa từ</label>
                        <input type="number" min="0" class="form-control" id="vstep-writing-${index}-max" value="${index === 1 ? 220 : 350}">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="vstep-writing-${index}-prompt">Đề bài</label>
                        <textarea class="form-control" id="vstep-writing-${index}-prompt" rows="6"></textarea>
                    </div>
                </div>
            </div>
        `).join('');

        refs.speakingEditors.innerHTML = [1, 2, 3].map(index => `
            <div class="vstep-part-editor">
                <h3 class="h6 mb-3">Speaking Part ${index}</h3>
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
                        <label class="form-label" for="vstep-speaking-${index}-file">Upload audio</label>
                        <input type="file" class="form-control vstep-audio-file" id="vstep-speaking-${index}-file" accept="audio/mp3,audio/mpeg,audio/webm,audio/ogg,.mp3,.webm,.ogg" data-target="vstep-speaking-${index}-audio" data-dir="audio/vstep/speaking/part${index}">
                        <div class="vstep-help mt-1" id="vstep-speaking-${index}-upload-status"></div>
                    </div>
                    <div class="col-6 col-lg-2">
                        <label class="form-label" for="vstep-speaking-${index}-prep">Giây chuẩn bị</label>
                        <input type="number" min="0" class="form-control" id="vstep-speaking-${index}-prep" value="${index === 1 ? 20 : 60}">
                    </div>
                    <div class="col-6 col-lg-2">
                        <label class="form-label" for="vstep-speaking-${index}-answer">Giây trả lời</label>
                        <input type="number" min="1" class="form-control" id="vstep-speaking-${index}-answer" value="${index === 1 ? 180 : index === 2 ? 240 : 300}">
                    </div>
                    <div class="col-12">
                        <label class="form-label" for="vstep-speaking-${index}-prompt">Câu hỏi / nội dung hiển thị</label>
                        <textarea class="form-control" id="vstep-speaking-${index}-prompt" rows="7"></textarea>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.vstep-audio-file').forEach(input => {
            input.addEventListener('change', () => uploadAudioFromInput(input));
        });
    }

    function collectPayload() {
        const title = getValue('vstep-title');
        if (!title) throw new Error('Vui lòng nhập tên đề VSTEP.');

        const durations = {
            listening: getNumber('vstep-duration-listening', 45),
            reading: getNumber('vstep-duration-reading', 60),
            writing: getNumber('vstep-duration-writing', 60),
            speaking: getNumber('vstep-duration-speaking', 12)
        };

        const listeningParts = [1, 2, 3].map(index => {
            const questions = parseQuestionLines(getValue(`vstep-listening-${index}-questions`), `Listening Part ${index}`);
            return {
                title: getValue(`vstep-listening-${index}-title`) || `Part ${index}`,
                directions: getValue(`vstep-listening-${index}-directions`) || 'Listen and choose the correct answer.',
                audioUrl: getValue(`vstep-listening-${index}-audio`),
                transcript: getValue(`vstep-listening-${index}-transcript`),
                questions
            };
        });

        const readingParts = [1, 2, 3, 4].map(index => {
            const questions = parseQuestionLines(getValue(`vstep-reading-${index}-questions`), `Reading Part ${index}`);
            const passage = getValue(`vstep-reading-${index}-passage`);
            if (!passage) throw new Error(`Reading Part ${index}: vui lòng nhập bài đọc.`);
            return {
                title: getValue(`vstep-reading-${index}-title`) || `Part ${index}`,
                passage,
                questions
            };
        });

        const writingParts = [1, 2].map(index => {
            const prompt = getValue(`vstep-writing-${index}-prompt`);
            if (!prompt) throw new Error(`Writing Part ${index}: vui lòng nhập đề bài.`);
            return {
                title: getValue(`vstep-writing-${index}-title`) || `Part ${index}`,
                prompt,
                minWords: getNumber(`vstep-writing-${index}-min`, index === 1 ? 120 : 250),
                maxWords: getNumber(`vstep-writing-${index}-max`, index === 1 ? 220 : 350)
            };
        });

        const speakingParts = [1, 2, 3].map(index => {
            const prompt = getValue(`vstep-speaking-${index}-prompt`);
            if (!prompt) throw new Error(`Speaking Part ${index}: vui lòng nhập câu hỏi/nội dung hiển thị.`);
            return {
                title: getValue(`vstep-speaking-${index}-title`) || `Part ${index}`,
                introAudioUrl: getValue(`vstep-speaking-${index}-audio`),
                prompt,
                prepSeconds: getNumber(`vstep-speaking-${index}-prep`, index === 1 ? 20 : 60),
                answerSeconds: getNumber(`vstep-speaking-${index}-answer`, index === 1 ? 180 : 240)
            };
        });

        const data = {
            __practice_type: VSTEP_TYPE,
            schemaVersion: 1,
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
            duration_minutes: Object.values(durations).reduce((sum, value) => sum + value, 0),
            data
        };
    }

    function previewJson() {
        try {
            const payload = collectPayload();
            refs.preview.textContent = JSON.stringify(payload, null, 2);
            return payload;
        } catch (error) {
            refs.preview.textContent = error.message;
            throw error;
        }
    }

    async function uploadAudioFromInput(input) {
        const file = input.files && input.files[0];
        if (!file) return;

        const targetId = input.dataset.target;
        const dir = input.dataset.dir || 'audio/vstep';
        const status = $(`${input.id.replace(/-file$/, '')}-upload-status`);
        if (status) status.textContent = 'Đang upload audio...';

        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = String(reader.result || '');
                    resolve(result.includes(',') ? result.split(',')[1] : result);
                };
                reader.onerror = () => reject(new Error('Không thể đọc file audio.'));
                reader.readAsDataURL(file);
            });

            const filePath = `${dir}/${Date.now()}_${sanitizeFileName(file.name)}`;
            const response = await fetch('/api/upload-audio', {
                method: 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify({
                    filePath,
                    content: base64,
                    message: `Upload VSTEP audio ${filePath}`
                })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || result.details || 'Upload audio thất bại.');

            setValue(targetId, result.rawUrl || filePath);
            if (status) status.textContent = 'Đã upload audio.';
        } catch (error) {
            if (status) status.textContent = error.message;
            alert(error.message);
        } finally {
            input.value = '';
        }
    }

    function renderSetList() {
        if (!state.sets.length) {
            refs.setList.innerHTML = '<div class="text-secondary small">Chưa có đề VSTEP nào.</div>';
            return;
        }

        refs.setList.innerHTML = state.sets.map(set => {
            const status = set?.data?.status || 'draft';
            const active = set.id === state.editingId ? ' active' : '';
            const date = set.created_at ? new Date(set.created_at).toLocaleDateString('vi-VN') : '';
            return `
                <button type="button" class="vstep-set-item${active}" data-id="${escapeHtml(set.id)}">
                    <div class="fw-bold">${escapeHtml(set.title || 'VSTEP set')}</div>
                    <div class="small text-secondary">${escapeHtml(status)} · ${escapeHtml(String(set.duration_minutes || 177))} phút · ${escapeHtml(date)}</div>
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
            const response = await fetch('/api/practice_sets/list?type=vstep');
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Không thể tải đề VSTEP.');
            state.sets = (result.sets || []).sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true }));
            renderSetList();
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
            const response = await fetch(isUpdate ? `/api/practice_sets/update?id=${encodeURIComponent(state.editingId)}` : '/api/practice_sets/create', {
                method: isUpdate ? 'PUT' : 'POST',
                headers: authHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Không thể lưu đề VSTEP.');

            state.editingId = result.set?.id || state.editingId;
            await loadSets();
            alert('Đã lưu đề VSTEP.');
        } catch (error) {
            alert(error.message);
        } finally {
            refs.saveBtn.disabled = false;
            refs.saveBtn.innerHTML = '<i class="bi bi-cloud-upload me-1"></i> Lưu đề';
        }
    }

    function resetForm() {
        state.editingId = '';
        refs.form.reset();
        initEditors();
        setValue('vstep-duration-listening', 45);
        setValue('vstep-duration-reading', 60);
        setValue('vstep-duration-writing', 60);
        setValue('vstep-duration-speaking', 12);
        setValue('vstep-speaking-ready-seconds', 60);
        setValue('vstep-speaking-ready-message', 'Bạn đeo tai nghe để làm bài thi nói. Bài làm sẽ được thu âm trực tiếp.');
        refs.formTitle.textContent = 'Tạo đề VSTEP mới';
        refs.preview.textContent = '{}';
        renderSetList();
    }

    function fillForm(set) {
        const data = set.data || {};
        state.editingId = set.id;
        refs.form.reset();
        initEditors();
        refs.formTitle.textContent = `Đang sửa: ${set.title || 'VSTEP set'}`;
        setValue('vstep-title', set.title || '');
        setValue('vstep-description', set.description || '');
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
            setValue(`vstep-listening-${index}-questions`, formatQuestionLines(part.questions || []));
            setValue(`vstep-listening-${index}-transcript`, part.transcript || '');
        });

        (data.reading?.parts || []).slice(0, 4).forEach((part, idx) => {
            const index = idx + 1;
            setValue(`vstep-reading-${index}-title`, part.title || `Part ${index}`);
            setValue(`vstep-reading-${index}-passage`, part.passage || '');
            setValue(`vstep-reading-${index}-questions`, formatQuestionLines(part.questions || []));
        });

        (data.writing?.parts || []).slice(0, 2).forEach((part, idx) => {
            const index = idx + 1;
            setValue(`vstep-writing-${index}-title`, part.title || `Part ${index}`);
            setValue(`vstep-writing-${index}-prompt`, part.prompt || '');
            setValue(`vstep-writing-${index}-min`, part.minWords || 0);
            setValue(`vstep-writing-${index}-max`, part.maxWords || 0);
        });

        setValue('vstep-speaking-ready-seconds', data.speaking?.readySeconds || 60);
        setValue('vstep-speaking-ready-message', data.speaking?.readyMessage || '');
        (data.speaking?.parts || []).slice(0, 3).forEach((part, idx) => {
            const index = idx + 1;
            setValue(`vstep-speaking-${index}-title`, part.title || `Part ${index}`);
            setValue(`vstep-speaking-${index}-audio`, part.introAudioUrl || '');
            setValue(`vstep-speaking-${index}-prompt`, part.prompt || '');
            setValue(`vstep-speaking-${index}-prep`, part.prepSeconds || 0);
            setValue(`vstep-speaking-${index}-answer`, part.answerSeconds || 60);
        });

        refs.preview.textContent = JSON.stringify({
            title: set.title,
            type: VSTEP_TYPE,
            description: set.description || '',
            duration_minutes: set.duration_minutes,
            data
        }, null, 2);
        renderSetList();
    }

    function bindRefs() {
        refs.form = $('vstepSetForm');
        refs.formTitle = $('vstepFormTitle');
        refs.setList = $('vstepSetList');
        refs.preview = $('vstepJsonPreview');
        refs.saveBtn = $('saveVstepSetBtn');
        refs.listeningEditors = $('vstep-listening-editors');
        refs.readingEditors = $('vstep-reading-editors');
        refs.writingEditors = $('vstep-writing-editors');
        refs.speakingEditors = $('vstep-speaking-editors');
    }

    async function init() {
        bindRefs();
        if (typeof requireAdmin === 'function') {
            const ok = await requireAdmin();
            if (!ok) return;
        }
        initEditors();
        $('newVstepSetBtn')?.addEventListener('click', resetForm);
        $('resetVstepFormBtn')?.addEventListener('click', resetForm);
        $('refreshVstepSetsBtn')?.addEventListener('click', loadSets);
        $('previewVstepJsonBtn')?.addEventListener('click', () => {
            try {
                previewJson();
            } catch (error) {
                alert(error.message);
            }
        });
        refs.saveBtn?.addEventListener('click', saveSet);
        await loadSets();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
