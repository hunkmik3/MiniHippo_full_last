(function () {
    const query = new URLSearchParams(window.location.search);
    const setId = query.get('set');
    const skills = ['listening', 'reading', 'writing', 'speaking'];
    const cacheKey = setId ? `practice_set_cache_vstep_${setId}` : '';
    const attemptKey = setId ? `vstep_attempt_${setId}` : '';

    const refs = {
        loading: document.getElementById('vstepLoading'),
        precheck: document.getElementById('vstepPrecheck'),
        exam: document.getElementById('vstepExam'),
        content: document.getElementById('examContent'),
        tabs: document.getElementById('vstepPartTabs'),
        timer: document.getElementById('examTimer'),
        answeredCount: document.getElementById('answeredCount'),
        questionCount: document.getElementById('questionCount'),
        continueBtn: document.getElementById('continueBtn'),
        savePartBtn: document.getElementById('savePartBtn'),
        submitTopBtn: document.getElementById('submitTopBtn'),
        warning: document.getElementById('vstepWarning'),
        savedModal: document.getElementById('savedModal'),
        skillConfirmModal: document.getElementById('skillConfirmModal'),
        submitModal: document.getElementById('submitModal'),
        submitStatus: document.getElementById('submitStatus')
    };

    const state = {
        set: null,
        data: null,
        user: null,
        currentSkillIndex: 0,
        currentPartIndex: 0,
        skillRemaining: 0,
        timerInterval: null,
        startedAt: Date.now(),
        answers: {
            listening: {},
            reading: {},
            writing: {},
            speaking: {}
        },
        savedParts: {},
        audioPlayed: {},
        speakingStarted: false,
        speakingFinished: false,
        speakingAbort: false,
        mediaStream: null,
        recorder: null,
        analyser: null,
        visualizerInterval: null,
        currentChunks: [],
        micTestBlob: null,
        webcamStream: null,
        submitting: false
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function nl2br(value) {
        return escapeHtml(value).replace(/\r?\n/g, '<br>');
    }

    function safeText(value, fallback = '') {
        const text = typeof value === 'string' ? value.trim() : '';
        return text || fallback;
    }

    function normalizeUrl(url) {
        const value = safeText(url);
        if (!value) return '';
        if (/^https?:\/\//i.test(value)) return value;
        return value.startsWith('/') ? value : `/${value}`;
    }

    function getCurrentSkill() {
        return skills[state.currentSkillIndex] || 'listening';
    }

    function getParts(skill = getCurrentSkill()) {
        return Array.isArray(state.data?.[skill]?.parts) ? state.data[skill].parts : [];
    }

    function getDuration(skill = getCurrentSkill()) {
        const fallback = { listening: 45, reading: 60, writing: 60, speaking: 12 };
        return Number(state.data?.durations?.[skill]) || fallback[skill] || 30;
    }

    function getQuestionId(skill, partIndex, question, index) {
        return question.id || `${skill}-part${partIndex + 1}-q${index + 1}`;
    }

    function formatClock(seconds) {
        const safe = Math.max(0, Math.round(seconds || 0));
        const mins = Math.floor(safe / 60);
        const secs = safe % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function renderTimer(seconds) {
        const [m1, m2, , s1, s2] = formatClock(seconds).padStart(5, '0');
        refs.timer.innerHTML = `
            <span class="vstep-time-block">${m1}</span>
            <span class="vstep-time-block">${m2}</span>
            <span>:</span>
            <span class="vstep-time-block">${s1}</span>
            <span class="vstep-time-block">${s2}</span>
        `;
    }

    function showOnly(section) {
        [refs.loading, refs.precheck, refs.exam].forEach(el => el?.classList.add('vstep-hidden'));
        section?.classList.remove('vstep-hidden');
    }

    function showWarning(message) {
        refs.warning.textContent = message;
        refs.warning.classList.add('show');
        clearTimeout(showWarning._timer);
        showWarning._timer = setTimeout(() => refs.warning.classList.remove('show'), 2200);
    }

    function showModal(modal) {
        modal?.classList.add('show');
    }

    function hideModal(modal) {
        modal?.classList.remove('show');
    }

    function authorizedHeaders(extra = {}) {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : '';
        const headers = { ...extra };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (typeof buildDeviceHeaders === 'function') {
            return buildDeviceHeaders(headers);
        }
        return headers;
    }

    function normalizeData(set) {
        const data = set?.data || {};
        return {
            __practice_type: 'vstep',
            schemaVersion: data.schemaVersion || 1,
            status: data.status || 'published',
            durations: {
                listening: Number(data.durations?.listening) || 45,
                reading: Number(data.durations?.reading) || 60,
                writing: Number(data.durations?.writing) || 60,
                speaking: Number(data.durations?.speaking) || 12
            },
            listening: { parts: Array.isArray(data.listening?.parts) ? data.listening.parts.slice(0, 3) : [] },
            reading: { parts: Array.isArray(data.reading?.parts) ? data.reading.parts.slice(0, 4) : [] },
            writing: { parts: Array.isArray(data.writing?.parts) ? data.writing.parts.slice(0, 2) : [] },
            speaking: {
                readySeconds: Number(data.speaking?.readySeconds) || 60,
                readyMessage: data.speaking?.readyMessage || 'Bạn đeo tai nghe để làm bài thi nói. Bài làm sẽ được thu âm trực tiếp.',
                parts: Array.isArray(data.speaking?.parts) ? data.speaking.parts.slice(0, 3) : []
            }
        };
    }

    function restoreAttempt() {
        if (!attemptKey) return;
        try {
            const raw = localStorage.getItem(attemptKey);
            if (!raw) return;
            const saved = JSON.parse(raw);
            if (saved && typeof saved === 'object') {
                state.answers = {
                    ...state.answers,
                    ...(saved.answers || {})
                };
                state.savedParts = saved.savedParts || {};
                state.audioPlayed = saved.audioPlayed || {};
                state.startedAt = saved.startedAt || Date.now();
            }
        } catch (error) {
            console.warn('Không thể khôi phục bài làm VSTEP:', error);
        }
    }

    function persistAttempt() {
        if (!attemptKey) return;
        try {
            localStorage.setItem(attemptKey, JSON.stringify({
                setId,
                startedAt: state.startedAt,
                answers: state.answers,
                savedParts: state.savedParts,
                audioPlayed: state.audioPlayed,
                updatedAt: new Date().toISOString()
            }));
        } catch (error) {
            console.warn('Không thể lưu tạm bài làm VSTEP:', error);
        }
    }

    async function loadSet() {
        if (!setId) {
            throw new Error('Thiếu tham số đề VSTEP.');
        }

        let cached = null;
        try {
            cached = cacheKey ? JSON.parse(sessionStorage.getItem(cacheKey) || 'null') : null;
        } catch {
            cached = null;
        }

        if (cached && cached.id === setId) {
            state.set = cached;
        } else {
            const response = await fetch(`/api/practice_sets/get?id=${encodeURIComponent(setId)}`, {
                headers: authorizedHeaders()
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Không thể tải đề VSTEP.');
            state.set = result.set;
        }

        state.data = normalizeData(state.set);
        const missingSkill = skills.find(skill => !getParts(skill).length);
        if (missingSkill) {
            throw new Error(`Đề VSTEP thiếu dữ liệu ${missingSkill}. Vui lòng báo admin kiểm tra.`);
        }
        restoreAttempt();
    }

    function populateCandidateInfo() {
        state.user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        const user = state.user || {};
        const name = user.fullName || user.username || user.email || 'Thí sinh';
        const account = user.accountCode || user.username || user.email || '-';
        const code = user.accountCode || user.id || '-';

        document.getElementById('candidateName').textContent = name;
        document.getElementById('candidateGender').textContent = user.gender || '-';
        document.getElementById('candidateAccount').textContent = account;
        document.getElementById('candidateCode').textContent = code;
        document.getElementById('examCandidateName').textContent = name;

        document.getElementById('examDurationSummary').innerHTML = `
            <div>Listening: 3 parts - ${state.data.durations.listening} phút</div>
            <div>Reading: 4 parts - ${state.data.durations.reading} phút</div>
            <div>Writing: 2 parts - ${state.data.durations.writing} phút</div>
            <div>Speaking: 3 parts - ${state.data.durations.speaking} phút</div>
        `;
    }

    function startSkillTimer() {
        clearInterval(state.timerInterval);
        state.skillRemaining = getDuration() * 60;
        renderTimer(state.skillRemaining);
        state.timerInterval = setInterval(() => {
            state.skillRemaining -= 1;
            renderTimer(state.skillRemaining);
            if (state.skillRemaining <= 60) {
                refs.timer.style.filter = 'brightness(1.16)';
            }
            if (state.skillRemaining <= 0) {
                clearInterval(state.timerInterval);
                handleSkillTimeout();
            }
        }, 1000);
    }

    function handleSkillTimeout() {
        saveCurrentPart(false);
        if (state.currentSkillIndex < skills.length - 1) {
            moveToSkill(state.currentSkillIndex + 1);
        } else {
            openSubmitModal();
        }
    }

    function countQuestions(skill) {
        if (skill === 'writing') return getParts(skill).length;
        if (skill === 'speaking') return getParts(skill).length;
        return getParts(skill).reduce((sum, part) => sum + (part.questions || []).length, 0);
    }

    function countAnswered(skill = getCurrentSkill()) {
        if (skill === 'writing') {
            return getParts(skill).filter((_, index) => safeText(state.answers.writing[`part${index + 1}`])).length;
        }
        if (skill === 'speaking') {
            return getParts(skill).filter((_, index) => state.answers.speaking[`part${index + 1}`]?.recordingUrl || state.answers.speaking[`part${index + 1}`]?.recorded).length;
        }
        return getParts(skill).reduce((sum, part, partIndex) => {
            return sum + (part.questions || []).filter((question, questionIndex) => {
                const id = getQuestionId(skill, partIndex, question, questionIndex);
                return Boolean(state.answers[skill][id]);
            }).length;
        }, 0);
    }

    function updateAnsweredCounter() {
        const skill = getCurrentSkill();
        refs.answeredCount.textContent = countAnswered(skill);
        refs.questionCount.textContent = countQuestions(skill);
    }

    function renderTabs() {
        refs.tabs.innerHTML = skills.map((skill, skillIndex) => {
            const parts = getParts(skill);
            const partButtons = parts.map((_, partIndex) => {
                const active = skillIndex === state.currentSkillIndex && partIndex === state.currentPartIndex ? ' active' : '';
                const disabled = skillIndex !== state.currentSkillIndex || skill === 'speaking' ? ' disabled' : '';
                return `<button type="button" class="vstep-part-tab${active}" data-skill="${skillIndex}" data-part="${partIndex}"${disabled}>PART ${partIndex + 1}</button>`;
            }).join('');
            return `
                <div>
                    <div class="vstep-skill-group">${partButtons}</div>
                    <div class="vstep-skill-label">${skillLabels[skill]} - ${getDuration(skill)}</div>
                </div>
            `;
        }).join('');

        refs.tabs.querySelectorAll('.vstep-part-tab:not([disabled])').forEach(button => {
            button.addEventListener('click', () => {
                saveCurrentPart(false);
                state.currentPartIndex = Number(button.dataset.part) || 0;
                renderCurrentPart();
            });
        });
    }

    function renderAudioBar(audioUrl, audioKey) {
        const played = Boolean(state.audioPlayed[audioKey]);
        if (!safeText(audioUrl)) {
            return '<div class="alert alert-warning">Part này chưa có audio. Vui lòng báo admin kiểm tra đề.</div>';
        }
        return `
            <div class="vstep-exam-audio" data-audio-key="${escapeHtml(audioKey)}" data-audio-url="${escapeHtml(normalizeUrl(audioUrl))}">
                <button type="button" class="vstep-audio-play" ${played ? 'disabled' : ''} aria-label="Play audio">
                    <i class="bi ${played ? 'bi-lock-fill' : 'bi-play-fill'}"></i>
                </button>
                <span class="vstep-audio-current">00:00</span>
                <div class="vstep-progress-track"><div class="vstep-progress-fill"></div></div>
                <span class="vstep-audio-duration">00:00</span>
                <span class="small">${played ? 'Đã nghe' : 'Chỉ nghe 1 lần'}</span>
            </div>
        `;
    }

    function setupAudioBars() {
        document.querySelectorAll('.vstep-exam-audio').forEach(bar => {
            const key = bar.dataset.audioKey;
            const url = bar.dataset.audioUrl;
            const button = bar.querySelector('.vstep-audio-play');
            const icon = button?.querySelector('i');
            const currentEl = bar.querySelector('.vstep-audio-current');
            const durationEl = bar.querySelector('.vstep-audio-duration');
            const fill = bar.querySelector('.vstep-progress-fill');
            const audio = new Audio(url);

            audio.addEventListener('loadedmetadata', () => {
                durationEl.textContent = formatClock(audio.duration || 0);
            });
            audio.addEventListener('timeupdate', () => {
                currentEl.textContent = formatClock(audio.currentTime || 0);
                const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
                fill.style.width = `${Math.min(100, percent)}%`;
            });
            audio.addEventListener('ended', () => {
                icon.className = 'bi bi-lock-fill';
                button.disabled = true;
                state.audioPlayed[key] = true;
                persistAttempt();
            });
            button?.addEventListener('click', async () => {
                if (state.audioPlayed[key]) return;
                state.audioPlayed[key] = true;
                button.disabled = true;
                icon.className = 'bi bi-pause-fill';
                persistAttempt();
                try {
                    await audio.play();
                } catch (error) {
                    showWarning('Không thể phát audio. Vui lòng kiểm tra trình duyệt hoặc báo giám thị.');
                    button.disabled = false;
                    state.audioPlayed[key] = false;
                    icon.className = 'bi bi-play-fill';
                }
            });
        });
    }

    function renderMcqQuestions(skill, part, partIndex) {
        return (part.questions || []).map((question, questionIndex) => {
            const id = getQuestionId(skill, partIndex, question, questionIndex);
            const selected = state.answers[skill][id] || '';
            const options = (question.options || []).map(option => `
                <label class="vstep-option">
                    <input type="radio" name="${escapeHtml(id)}" value="${escapeHtml(option.label)}" ${selected === option.label ? 'checked' : ''}>
                    <strong>${escapeHtml(option.label)}.</strong> ${escapeHtml(option.text)}
                </label>
            `).join('');
            return `
                <div class="vstep-question" data-question-id="${escapeHtml(id)}">
                    <div class="vstep-question-title">${questionIndex + 1}. ${escapeHtml(question.prompt)}</div>
                    ${options}
                </div>
            `;
        }).join('');
    }

    function bindMcq(skill) {
        refs.content.querySelectorAll('.vstep-question').forEach(questionEl => {
            const id = questionEl.dataset.questionId;
            questionEl.querySelectorAll('input[type="radio"]').forEach(input => {
                input.addEventListener('change', () => {
                    state.answers[skill][id] = input.value;
                    updateAnsweredCounter();
                    persistAttempt();
                });
            });
        });
    }

    function renderListening(part, partIndex) {
        refs.content.innerHTML = `
            <div class="vstep-listening-layout">
                <div class="text-center mb-3">
                    <h1 class="h5 mb-2">${escapeHtml(part.title || `Part ${partIndex + 1}`)}</h1>
                    <p class="mb-0">${escapeHtml(part.directions || 'Listen and choose the correct answer.')}</p>
                </div>
                ${renderAudioBar(part.audioUrl, `listening-${partIndex}`)}
                ${renderMcqQuestions('listening', part, partIndex)}
            </div>
        `;
        setupAudioBars();
        bindMcq('listening');
    }

    function renderReading(part, partIndex) {
        refs.content.innerHTML = `
            <div class="vstep-reading-layout">
                <article class="vstep-passage">
                    <h1 class="h5 text-center mb-3">${escapeHtml(part.title || `Part ${partIndex + 1}`)}</h1>
                    ${nl2br(part.passage || '')}
                </article>
                <section>
                    ${renderMcqQuestions('reading', part, partIndex)}
                </section>
            </div>
        `;
        bindMcq('reading');
    }

    function wordCount(value) {
        return safeText(value).split(/\s+/).filter(Boolean).length;
    }

    function renderWriting(part, partIndex) {
        const key = `part${partIndex + 1}`;
        const saved = state.answers.writing[key] || '';
        refs.content.innerHTML = `
            <div class="vstep-writing-area">
                <h1 class="h5 mb-3">${escapeHtml(part.title || `Part ${partIndex + 1}`)}</h1>
                <div class="border p-3 mb-3 bg-light">${nl2br(part.prompt || '')}</div>
                <textarea class="vstep-writing-textarea" id="writingAnswer" data-key="${escapeHtml(key)}">${escapeHtml(saved)}</textarea>
                <div class="mt-2 fw-bold" id="writingWordCount">Số từ: ${wordCount(saved)}${part.minWords ? ` / tối thiểu ${part.minWords}` : ''}${part.maxWords ? ` / tối đa ${part.maxWords}` : ''}</div>
            </div>
        `;
        const textarea = document.getElementById('writingAnswer');
        const counter = document.getElementById('writingWordCount');
        textarea.addEventListener('input', () => {
            state.answers.writing[key] = textarea.value;
            counter.textContent = `Số từ: ${wordCount(textarea.value)}${part.minWords ? ` / tối thiểu ${part.minWords}` : ''}${part.maxWords ? ` / tối đa ${part.maxWords}` : ''}`;
            updateAnsweredCounter();
            persistAttempt();
        });
    }

    function speakingVolumeBars(level = 0) {
        const bars = Array.from({ length: 18 }).map((_, index) => {
            const height = Math.max(2, Math.min(86, (level * 100) - index * 4));
            return `<span class="vstep-volume-bar" style="height:${height}px"></span>`;
        }).join('');
        return `<div class="vstep-volume-box"><div class="vstep-volume-bars">${bars}</div></div>`;
    }

    function renderSpeakingShell(statusHtml = '') {
        const parts = getParts('speaking');
        const part = parts[state.currentPartIndex] || parts[0] || {};
        refs.content.innerHTML = `
            <div class="vstep-speaking-layout">
                <div class="vstep-speaking-status" id="speakingStatus">${statusHtml || 'Đang chuẩn bị phần thi nói...'}</div>
                <div class="vstep-speaking-player">
                    <div>
                        <h1 class="h5 mb-3">${escapeHtml(part.title || `Part ${state.currentPartIndex + 1}`)}</h1>
                        <div class="fs-5 lh-lg">${nl2br(part.prompt || '')}</div>
                    </div>
                    <div id="speakingVolume">${speakingVolumeBars(0)}</div>
                </div>
                <div class="vstep-saved-panel mt-4" id="speakingSavedPanel" style="display:none;">
                    BÀI NÓI ĐÃ ĐƯỢC LƯU VÀO HỆ THỐNG.
                </div>
            </div>
        `;
    }

    function updateSpeakingStatus(message) {
        const el = document.getElementById('speakingStatus');
        if (el) el.innerHTML = message;
    }

    function updateVolume(level) {
        const el = document.getElementById('speakingVolume');
        if (el) el.innerHTML = speakingVolumeBars(level);
    }

    async function ensureMicStream() {
        if (state.mediaStream) return state.mediaStream;
        if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
            throw new Error('Trình duyệt không hỗ trợ ghi âm trực tiếp.');
        }
        state.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return state.mediaStream;
    }

    function pickMimeType() {
        if (!window.MediaRecorder?.isTypeSupported) return '';
        const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
        return types.find(type => MediaRecorder.isTypeSupported(type)) || '';
    }

    function extensionFromMime(mimeType) {
        const value = String(mimeType || '').toLowerCase();
        if (value.includes('ogg')) return 'ogg';
        if (value.includes('mp4')) return 'm4a';
        if (value.includes('mpeg')) return 'mp3';
        return 'webm';
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const value = String(reader.result || '');
                resolve(value.includes(',') ? value.split(',')[1] : value);
            };
            reader.onerror = () => reject(new Error('Không thể đọc file ghi âm.'));
            reader.readAsDataURL(blob);
        });
    }

    async function uploadSpeakingBlob(blob, partIndex, mimeType) {
        const base64 = await blobToBase64(blob);
        const extension = extensionFromMime(mimeType);
        const response = await fetch('/api/upload-speaking-recording', {
            method: 'POST',
            headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                contentBase64: base64,
                fileName: `vstep_part_${partIndex + 1}.${extension}`,
                mimeType,
                speakingSetId: setId,
                speakingPart: `vstep-part-${partIndex + 1}`,
                answerKey: `part-${partIndex + 1}`
            })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || result.details || 'Không thể upload file ghi âm.');
        return result;
    }

    function startVisualizer(stream) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            analyser.fftSize = 256;
            source.connect(analyser);
            state.analyser = analyser;
            const data = new Uint8Array(analyser.frequencyBinCount);
            clearInterval(state.visualizerInterval);
            state.visualizerInterval = setInterval(() => {
                analyser.getByteFrequencyData(data);
                const avg = data.reduce((sum, value) => sum + value, 0) / data.length;
                updateVolume(Math.min(1, avg / 110));
            }, 120);
        } catch (error) {
            console.warn('Visualizer unavailable:', error);
        }
    }

    function stopVisualizer() {
        clearInterval(state.visualizerInterval);
        state.visualizerInterval = null;
        updateVolume(0);
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function countdown(seconds, render) {
        return new Promise(resolve => {
            let remaining = Math.max(0, Math.round(seconds || 0));
            render(remaining);
            if (remaining <= 0) {
                resolve();
                return;
            }
            const interval = setInterval(() => {
                remaining -= 1;
                render(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }

    function playAudioAndWait(url) {
        const normalized = normalizeUrl(url);
        if (!normalized) return wait(700);
        return new Promise(resolve => {
            const audio = new Audio(normalized);
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve();
            };
            audio.addEventListener('ended', finish);
            audio.addEventListener('error', finish);
            audio.play().catch(finish);
            setTimeout(finish, 90000);
        });
    }

    async function recordSpeakingPart(part, partIndex) {
        const stream = await ensureMicStream();
        const mimeType = pickMimeType();
        state.currentChunks = [];
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        state.recorder = recorder;

        recorder.addEventListener('dataavailable', event => {
            if (event.data && event.data.size) state.currentChunks.push(event.data);
        });

        const stopped = new Promise(resolve => {
            recorder.addEventListener('stop', resolve, { once: true });
        });

        startVisualizer(stream);
        recorder.start();
        await countdown(part.answerSeconds || 120, remaining => {
            updateSpeakingStatus(`Hệ thống đang thu âm. Thời gian còn lại: <span class="text-danger">${remaining}s</span>`);
        });
        if (recorder.state !== 'inactive') recorder.stop();
        await stopped;
        stopVisualizer();

        const blob = new Blob(state.currentChunks, { type: mimeType || 'audio/webm' });
        const answerKey = `part${partIndex + 1}`;
        state.answers.speaking[answerKey] = {
            recorded: true,
            prompt: part.prompt || '',
            title: part.title || `Part ${partIndex + 1}`,
            durationSeconds: part.answerSeconds || 0,
            recordedAt: new Date().toISOString()
        };
        persistAttempt();

        updateSpeakingStatus('Đang lưu file ghi âm vào hệ thống...');
        const uploaded = await uploadSpeakingBlob(blob, partIndex, mimeType || 'audio/webm');
        state.answers.speaking[answerKey] = {
            ...state.answers.speaking[answerKey],
            recordingUrl: uploaded.rawUrl,
            filePath: uploaded.filePath,
            mimeType: uploaded.mimeType || mimeType || 'audio/webm'
        };
        persistAttempt();
    }

    async function runSpeakingFlow() {
        if (state.speakingStarted) return;
        state.speakingStarted = true;
        state.speakingFinished = false;
        refs.continueBtn.disabled = true;
        refs.savePartBtn.disabled = true;
        renderSpeakingShell(`Bạn có <span class="text-danger">${state.data.speaking.readySeconds}s</span> để chuẩn bị.`);

        try {
            await ensureMicStream();
            await countdown(state.data.speaking.readySeconds, remaining => {
                updateSpeakingStatus(`${escapeHtml(state.data.speaking.readyMessage)}<br><span class="text-danger fs-4">${remaining}s</span>`);
            });

            const parts = getParts('speaking');
            for (let index = 0; index < parts.length; index += 1) {
                state.currentPartIndex = index;
                renderTabs();
                renderSpeakingShell(`QUESTION ${index + 1}: Hệ thống đang phát audio giới thiệu câu hỏi...`);
                await playAudioAndWait(parts[index].introAudioUrl);
                await countdown(parts[index].prepSeconds || 0, remaining => {
                    updateSpeakingStatus(`Thời gian chuẩn bị: <span class="text-danger">${remaining}s</span>`);
                });
                await recordSpeakingPart(parts[index], index);
                document.getElementById('speakingSavedPanel').style.display = 'block';
                updateAnsweredCounter();
                if (index < parts.length - 1) {
                    updateSpeakingStatus(`Bài nói số ${index + 1} đã được lưu. Hệ thống sẽ chuyển sang phần tiếp theo.`);
                    await wait(2500);
                }
            }

            state.speakingFinished = true;
            refs.continueBtn.disabled = false;
            refs.continueBtn.textContent = 'TIẾP TỤC';
            refs.savePartBtn.disabled = true;
            renderSpeakingShell('Sau khi kết thúc phần 3, bài thi nói đã được lưu vào hệ thống.');
            refs.content.insertAdjacentHTML('beforeend', `
                <div class="vstep-speaking-layout mt-3">
                    <div class="vstep-saved-panel">BÀI THI ĐÃ ĐƯỢC LƯU VÀO HỆ THỐNG. NHẤN NÚT "NỘP BÀI" TẠI GÓC TRÊN CÙNG BÊN PHẢI ĐỂ NỘP BÀI THI.</div>
                    <p class="text-danger fw-bold mt-4">Lưu ý: Thí sinh không được dùng chuột hay bàn phím để thao tác vào hệ thống trong toàn bộ thời gian thi kỹ năng nói.</p>
                </div>
            `);
            persistAttempt();
        } catch (error) {
            updateSpeakingStatus(`<span class="text-danger">${escapeHtml(error.message)}</span>`);
            refs.continueBtn.disabled = false;
        }
    }

    function renderSpeaking() {
        renderSpeakingShell('Đang khởi động kỹ năng Speaking...');
        runSpeakingFlow();
    }

    function renderCurrentPart() {
        const skill = getCurrentSkill();
        const part = getParts(skill)[state.currentPartIndex] || {};
        refs.continueBtn.disabled = false;
        refs.savePartBtn.disabled = false;
        refs.continueBtn.textContent = 'TIẾP TỤC';
        refs.savePartBtn.style.display = '';

        if (skill === 'listening') renderListening(part, state.currentPartIndex);
        if (skill === 'reading') renderReading(part, state.currentPartIndex);
        if (skill === 'writing') renderWriting(part, state.currentPartIndex);
        if (skill === 'speaking') renderSpeaking();

        renderTabs();
        updateAnsweredCounter();
    }

    function saveCurrentPart(showSaved = true) {
        const skill = getCurrentSkill();
        const key = `${skill}-part${state.currentPartIndex + 1}`;
        state.savedParts[key] = new Date().toISOString();
        persistAttempt();
        if (showSaved) showModal(refs.savedModal);
    }

    function requestNextSkill() {
        const nextSkill = skills[state.currentSkillIndex + 1];
        if (!nextSkill) {
            openSubmitModal();
            return;
        }
        document.getElementById('skillConfirmTitle').textContent = `Bạn muốn chuyển sang kỹ năng ${skillLabels[nextSkill]}?`;
        document.getElementById('skillConfirmText').textContent = 'Sau khi chuyển kỹ năng, bạn không thể thao tác lại kỹ năng đã làm trước đó.';
        showModal(refs.skillConfirmModal);
    }

    function continueFlow() {
        const skill = getCurrentSkill();
        if (skill === 'speaking') {
            if (state.speakingFinished) openSubmitModal();
            return;
        }

        saveCurrentPart(false);
        const parts = getParts(skill);
        if (state.currentPartIndex < parts.length - 1) {
            state.currentPartIndex += 1;
            renderCurrentPart();
            return;
        }
        requestNextSkill();
    }

    function moveToSkill(skillIndex) {
        saveCurrentPart(false);
        state.currentSkillIndex = skillIndex;
        state.currentPartIndex = 0;
        refs.timer.style.filter = '';
        state.speakingStarted = false;
        state.speakingFinished = false;
        startSkillTimer();
        renderCurrentPart();
    }

    function setupPrecheckAudio() {
        const audio = document.getElementById('precheckAudio');
        const firstListeningAudio = state.data.listening.parts.find(part => safeText(part.audioUrl))?.audioUrl || '';
        audio.src = normalizeUrl(firstListeningAudio);
        const playBtn = document.getElementById('headphonePlayBtn');
        const timeEl = document.getElementById('headphoneTime');
        const volume = document.getElementById('headphoneVolume');
        volume.addEventListener('input', () => {
            audio.volume = Number(volume.value) || 1;
        });
        audio.addEventListener('timeupdate', () => {
            timeEl.textContent = `${formatClock(audio.currentTime)} / ${formatClock(audio.duration || 0)}`;
        });
        playBtn.addEventListener('click', async () => {
            if (audio.paused) {
                await audio.play().catch(() => showWarning('Không thể phát audio kiểm tra.'));
                playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            } else {
                audio.pause();
                playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
            }
        });
        audio.addEventListener('ended', () => {
            playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        });
    }

    async function startWebcam() {
        try {
            if (!navigator.mediaDevices?.getUserMedia) throw new Error('Trình duyệt không hỗ trợ webcam.');
            state.webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
            document.getElementById('webcamPreview').srcObject = state.webcamStream;
            document.getElementById('photoStatus').textContent = 'Webcam đã sẵn sàng.';
        } catch (error) {
            document.getElementById('photoStatus').textContent = error.message;
        }
    }

    function capturePhoto() {
        const video = document.getElementById('webcamPreview');
        const canvas = document.getElementById('webcamCanvas');
        const ctx = canvas.getContext('2d');
        if (!video.videoWidth) {
            document.getElementById('photoStatus').textContent = 'Chưa có tín hiệu webcam để chụp.';
            return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.classList.remove('vstep-hidden');
        document.getElementById('photoStatus').textContent = 'Đã chụp hình thí sinh.';
    }

    async function runMicTest() {
        const button = document.getElementById('micTestBtn');
        const replay = document.getElementById('micReplayBtn');
        const status = document.getElementById('micTestStatus');
        try {
            button.disabled = true;
            button.textContent = 'Đang thu...';
            const stream = await ensureMicStream();
            const mimeType = pickMimeType();
            const chunks = [];
            const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            recorder.addEventListener('dataavailable', event => {
                if (event.data && event.data.size) chunks.push(event.data);
            });
            const stopped = new Promise(resolve => recorder.addEventListener('stop', resolve, { once: true }));
            recorder.start();
            status.textContent = 'Đang thu âm mẫu trong 4 giây...';
            await wait(4000);
            recorder.stop();
            await stopped;
            state.micTestBlob = new Blob(chunks, { type: mimeType || 'audio/webm' });
            replay.disabled = false;
            status.textContent = 'Đã thu âm mẫu. Nhấn "Nghe lại" để kiểm tra mic.';
        } catch (error) {
            status.textContent = error.message;
        } finally {
            button.disabled = false;
            button.textContent = 'Thu âm';
        }
    }

    function replayMicTest() {
        if (!state.micTestBlob) return;
        const audio = new Audio(URL.createObjectURL(state.micTestBlob));
        audio.play().catch(() => showWarning('Không thể phát lại file thu âm.'));
    }

    function startExam() {
        state.startedAt = state.startedAt || Date.now();
        showOnly(refs.exam);
        startSkillTimer();
        renderCurrentPart();
    }

    function openSubmitModal() {
        refs.submitStatus.textContent = '';
        showModal(refs.submitModal);
    }

    function scoreSkill(skill) {
        let score = 0;
        let max = 0;
        const details = [];
        getParts(skill).forEach((part, partIndex) => {
            (part.questions || []).forEach((question, questionIndex) => {
                const id = getQuestionId(skill, partIndex, question, questionIndex);
                const userAnswer = state.answers[skill][id] || '';
                const correct = question.answer || '';
                const ok = userAnswer === correct;
                if (ok) score += 1;
                max += 1;
                details.push({
                    id,
                    part: partIndex + 1,
                    prompt: question.prompt || '',
                    userAnswer,
                    correct,
                    isCorrect: ok
                });
            });
        });
        return { score, max, details };
    }

    function collectWritingMetadata() {
        return getParts('writing').map((part, index) => {
            const key = `part${index + 1}`;
            const answer = state.answers.writing[key] || '';
            return {
                part: index + 1,
                title: part.title || `Part ${index + 1}`,
                prompt: part.prompt || '',
                answer,
                word_count: wordCount(answer),
                min_words: part.minWords || null,
                max_words: part.maxWords || null
            };
        });
    }

    async function submitExam() {
        if (state.submitting) return;
        state.submitting = true;
        const confirmBtn = document.getElementById('confirmSubmitBtn');
        confirmBtn.disabled = true;
        refs.submitStatus.textContent = 'Đang nộp bài...';

        try {
            saveCurrentPart(false);
            const listening = scoreSkill('listening');
            const reading = scoreSkill('reading');
            const totalScore = listening.score + reading.score;
            const maxScore = listening.max + reading.max;
            const durationSeconds = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
            const metadata = {
                source: 'vstep_exam',
                submission_kind: 'vstep_exam',
                session_type: 'reading',
                vstep_set_id: setId,
                vstep_set_title: state.set?.title || '',
                submitted_at: new Date().toISOString(),
                answers: state.answers,
                listening_details: listening.details,
                reading_details: reading.details,
                writing_answers: collectWritingMetadata(),
                speaking_answers: state.answers.speaking,
                durations: state.data.durations
            };

            const payload = {
                practiceType: 'vstep',
                mode: 'vstep_exam',
                setId,
                setTitle: state.set?.title || 'VSTEP exam',
                totalScore,
                maxScore,
                durationSeconds,
                partScores: {
                    listening: { score: listening.score, total: listening.max },
                    reading: { score: reading.score, total: reading.max },
                    writing: { score: 0, total: 0, pendingManualGrade: true },
                    speaking: { score: 0, total: 0, pendingManualGrade: true }
                },
                metadata
            };

            const saved = typeof submitPracticeResult === 'function'
                ? await submitPracticeResult(payload)
                : false;
            if (!saved) throw new Error('Không thể lưu kết quả. Vui lòng kiểm tra đăng nhập hoặc báo admin.');

            localStorage.removeItem(attemptKey);
            refs.submitStatus.textContent = `Đã nộp bài thành công. Điểm tự động Listening + Reading: ${totalScore}/${maxScore}.`;
            confirmBtn.style.display = 'none';
            document.getElementById('cancelSubmitBtn').textContent = 'ĐÓNG';
            clearInterval(state.timerInterval);
        } catch (error) {
            refs.submitStatus.textContent = error.message;
            confirmBtn.disabled = false;
        } finally {
            state.submitting = false;
        }
    }

    function bindEvents() {
        document.getElementById('findWebcamBtn').addEventListener('click', startWebcam);
        document.getElementById('capturePhotoBtn').addEventListener('click', capturePhoto);
        document.getElementById('micTestBtn').addEventListener('click', runMicTest);
        document.getElementById('micReplayBtn').addEventListener('click', replayMicTest);
        document.getElementById('startExamBtn').addEventListener('click', startExam);
        refs.continueBtn.addEventListener('click', continueFlow);
        refs.savePartBtn.addEventListener('click', () => saveCurrentPart(true));
        refs.submitTopBtn.addEventListener('click', openSubmitModal);
        document.getElementById('savedModalCloseBtn').addEventListener('click', () => hideModal(refs.savedModal));
        document.getElementById('cancelNextSkillBtn').addEventListener('click', () => hideModal(refs.skillConfirmModal));
        document.getElementById('confirmNextSkillBtn').addEventListener('click', () => {
            hideModal(refs.skillConfirmModal);
            moveToSkill(state.currentSkillIndex + 1);
        });
        document.getElementById('cancelSubmitBtn').addEventListener('click', () => hideModal(refs.submitModal));
        document.getElementById('confirmSubmitBtn').addEventListener('click', submitExam);

        document.addEventListener('keydown', event => {
            if (refs.exam.classList.contains('vstep-hidden')) return;
            const target = event.target;
            const isWritingInput = target && target.closest && target.closest('.vstep-writing-area');
            const skill = getCurrentSkill();
            if ((skill === 'listening' || skill === 'reading' || skill === 'speaking') && !isWritingInput) {
                const allowed = ['Tab', 'Shift', 'Escape'].includes(event.key);
                if (!allowed) {
                    event.preventDefault();
                    event.stopPropagation();
                    showWarning(skill === 'speaking'
                        ? 'Không dùng chuột/bàn phím trong thời gian thi Speaking.'
                        : 'Phần này chỉ thao tác chọn đáp án bằng chuột.');
                }
            }
        }, true);
    }

    async function init() {
        try {
            if (typeof requireAuth === 'function') {
                const ok = await requireAuth();
                if (!ok) return;
            }
            bindEvents();
            await loadSet();
            populateCandidateInfo();
            setupPrecheckAudio();
            showOnly(refs.precheck);
        } catch (error) {
            refs.loading.innerHTML = `<div class="alert alert-danger">${escapeHtml(error.message)}</div>`;
            showOnly(refs.loading);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
