(function () {
    const query = new URLSearchParams(window.location.search);
    const skills = ['listening', 'reading', 'writing', 'speaking'];
    const skillLabels = {
        listening: 'Listening',
        reading: 'Reading',
        writing: 'Writing',
        speaking: 'Speaking'
    };
    const requestedSkill = skills.includes(String(query.get('skill') || '').toLowerCase())
        ? String(query.get('skill')).toLowerCase()
        : '';
    const requestedMode = String(query.get('mode') || '').toLowerCase() === 'set' ? 'set' : '';
    const requestedPartOneBased = Number(query.get('part') || '');
    const requestedPartZeroBased = Number(query.get('partIndex') || '');
    const requestedPartIndex = Number.isFinite(requestedPartOneBased) && requestedPartOneBased > 0
        ? requestedPartOneBased - 1
        : Number.isFinite(requestedPartZeroBased) && requestedPartZeroBased >= 0
            ? requestedPartZeroBased
            : 0;
    const focusedSkillPractice = Boolean(requestedSkill);
    const singlePartPractice = false;
    const speakingTestSkipEnabled = ['localhost', '127.0.0.1', '0.0.0.0'].includes(window.location.hostname)
        || query.get('test') === '1'
        || query.get('debug') === '1';
    let setId = query.get('set') || query.get('id') || '';
    let assignmentId = query.get('assignment') || query.get('assignmentId') || '';
    if (!assignmentId && !setId) {
        try {
            assignmentId = sessionStorage.getItem('vstep_last_assignment_id') || '';
        } catch {
            assignmentId = '';
        }
    }
    if (!setId) {
        try {
            setId = sessionStorage.getItem('vstep_last_set_id') || '';
            assignmentId = assignmentId || sessionStorage.getItem('vstep_last_assignment_id') || '';
            if (!setId) {
                for (let index = 0; index < sessionStorage.length; index += 1) {
                    const key = sessionStorage.key(index) || '';
                    if (key.startsWith('practice_set_cache_vstep_')) {
                        setId = key.replace('practice_set_cache_vstep_', '');
                        break;
                    }
                }
            }
            if (setId && window.history?.replaceState) {
                const assignmentQuery = assignmentId ? `&assignment=${encodeURIComponent(assignmentId)}` : '';
                const skillQuery = requestedSkill ? `&skill=${encodeURIComponent(requestedSkill)}` : '';
                const modeQuery = requestedMode ? `&mode=${encodeURIComponent(requestedMode)}` : '';
                const partQuery = requestedPartIndex ? `&part=${encodeURIComponent(String(requestedPartIndex + 1))}` : '';
                window.history.replaceState(null, '', `/vstep_exam?set=${encodeURIComponent(setId)}${assignmentQuery}${skillQuery}${modeQuery}${partQuery}`);
            }
        } catch (error) {
            console.warn('Không thể khôi phục đề VSTEP gần nhất:', error);
        }
    }
    const cacheKey = setId ? `practice_set_cache_vstep_${setId}` : '';
    const attemptKey = setId ? `vstep_attempt_${setId}${assignmentId ? `_${assignmentId}` : ''}` : '';

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
        currentSkillIndex: requestedSkill ? skills.indexOf(requestedSkill) : 0,
        currentPartIndex: requestedPartIndex,
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
        skillRemainingBySkill: {},
        speakingStarted: false,
        speakingFinished: false,
        speakingAbort: false,
        speakingSkipRequested: false,
        speakingSkipPartRequested: false,
        speakingSkipResolver: null,
        speakingCurrentAudio: null,
        mediaStream: null,
        recorder: null,
        analyser: null,
        visualizerInterval: null,
        currentChunks: [],
        micTestBlob: null,
        webcamStream: null,
        pendingSkillMove: null,
        submitting: false,
        autoSubmitting: false
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

    function clampCurrentPosition() {
        const skill = getCurrentSkill();
        const parts = getParts(skill);
        state.currentPartIndex = parts.length
            ? Math.min(Math.max(state.currentPartIndex, 0), parts.length - 1)
            : 0;
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
            vstep_flow: data.vstep_flow || 'practice',
            vstep_content_kind: data.vstep_content_kind || 'mock_test',
            vstep_practice_skill: data.vstep_practice_skill || 'full_test',
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
            const assignmentQuery = assignmentId ? `&assignment=${encodeURIComponent(assignmentId)}` : '';
            const response = await fetch(`/api/vstep/contents/get?id=${encodeURIComponent(setId)}${assignmentQuery}`, {
                headers: authorizedHeaders()
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(result.error || 'Không thể tải đề VSTEP.');
            state.set = result.set || result.content;
        }
        if (!assignmentId && state.set?.assignment?.id) {
            assignmentId = state.set.assignment.id;
        }

        state.data = normalizeData(state.set);
        const requiredSkills = focusedSkillPractice ? [getCurrentSkill()] : skills;
        const missingSkill = requiredSkills.find(skill => !getParts(skill).length);
        if (missingSkill) {
            throw new Error(`Đề VSTEP thiếu dữ liệu ${missingSkill}. Vui lòng báo admin kiểm tra.`);
        }
        clampCurrentPosition();
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

        if (focusedSkillPractice) {
            const skill = getCurrentSkill();
            const parts = getParts(skill).length;
            document.getElementById('examDurationSummary').innerHTML = `
                <div>${skillLabels[skill]}: ${parts} part - ${getDuration(skill)} phút</div>
                <div>Chế độ: luyện theo bộ đề</div>
            `;
        } else {
            document.getElementById('examDurationSummary').innerHTML = `
                <div>Listening: 3 parts - ${state.data.durations.listening} phút</div>
                <div>Reading: 4 parts - ${state.data.durations.reading} phút</div>
                <div>Writing: 2 parts - ${state.data.durations.writing} phút</div>
                <div>Speaking: 3 parts - ${state.data.durations.speaking} phút</div>
            `;
        }
    }

    function startSkillTimer() {
        clearInterval(state.timerInterval);
        const skill = getCurrentSkill();
        const savedRemaining = state.skillRemainingBySkill[skill];
        state.skillRemaining = Number.isFinite(savedRemaining) && savedRemaining > 0
            ? savedRemaining
            : getDuration() * 60;
        state.skillRemainingBySkill[skill] = state.skillRemaining;
        renderTimer(state.skillRemaining);
        state.timerInterval = setInterval(() => {
            state.skillRemaining -= 1;
            state.skillRemainingBySkill[getCurrentSkill()] = state.skillRemaining;
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
        if (focusedSkillPractice || singlePartPractice) {
            state.autoSubmitting = true;
            openSubmitModal();
            refs.submitStatus.textContent = 'Hết giờ làm bài. Hệ thống đang tự động nộp bài...';
            submitExam();
        } else if (state.currentSkillIndex < skills.length - 1) {
            moveToSkill(state.currentSkillIndex + 1);
        } else {
            state.autoSubmitting = true;
            openSubmitModal();
            refs.submitStatus.textContent = 'Hết giờ làm bài. Hệ thống đang tự động nộp bài...';
            submitExam();
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

    function countPartQuestions(skill = getCurrentSkill(), partIndex = state.currentPartIndex) {
        const part = getParts(skill)[partIndex];
        if (!part) return 0;
        if (skill === 'writing' || skill === 'speaking') return 1;
        return (part.questions || []).length;
    }

    function countAnsweredInPart(skill = getCurrentSkill(), partIndex = state.currentPartIndex) {
        const part = getParts(skill)[partIndex];
        if (!part) return 0;
        if (skill === 'writing') {
            return safeText(state.answers.writing[`part${partIndex + 1}`]) ? 1 : 0;
        }
        if (skill === 'speaking') {
            const answer = state.answers.speaking[`part${partIndex + 1}`];
            return answer?.recordingUrl || answer?.recorded ? 1 : 0;
        }
        return (part.questions || []).filter((question, questionIndex) => {
            const id = getQuestionId(skill, partIndex, question, questionIndex);
            return Boolean(state.answers[skill][id]);
        }).length;
    }

    function getQuestionNumber(skill, partIndex, questionIndex) {
        if (skill !== 'listening') return questionIndex + 1;
        const offset = getParts(skill).slice(0, partIndex).reduce((sum, part) => {
            return sum + (part.questions || []).length;
        }, 0);
        return offset + questionIndex + 1;
    }

    function getQuestionRange(skill, part, partIndex) {
        const count = (part.questions || []).length;
        if (!count) return '';
        const start = getQuestionNumber(skill, partIndex, 0);
        const end = getQuestionNumber(skill, partIndex, count - 1);
        return start === end ? `Question ${start}` : `Questions ${start}-${end}`;
    }

    function getListeningDirections(part, partIndex) {
        const fallback = [
            'Directions: In this part, you will hear eight short announcements or instructions. There is one question for each announcement or instruction. For each question, choose the right answer A, B, C or D.',
            'Directions: In this part, you will hear three conversations. There are twelve questions. For each question, choose the right answer A, B, C or D.',
            'Directions: In this part, you will hear three talks or lectures. There are fifteen questions. For each question, choose the right answer A, B, C or D.'
        ];
        return safeText(part.directions, fallback[partIndex] || 'Directions: Listen and choose the correct answer A, B, C or D.');
    }

    function updateAnsweredCounter() {
        const skill = getCurrentSkill();
        refs.answeredCount.textContent = countAnsweredInPart(skill, state.currentPartIndex);
        refs.questionCount.textContent = countPartQuestions(skill, state.currentPartIndex);
    }

    function renderTabs() {
        const visibleIndexes = focusedSkillPractice
            ? [state.currentSkillIndex]
            : skills.map((_, index) => index);
        refs.tabs.classList.toggle('vstep-tab-strip-single-skill', visibleIndexes.length === 1);
        refs.tabs.innerHTML = visibleIndexes.map(skillIndex => {
            const skill = skills[skillIndex];
            const parts = getParts(skill);
            const partButtons = parts.map((_, partIndex) => {
                const active = skillIndex === state.currentSkillIndex && partIndex === state.currentPartIndex ? ' active' : '';
                const isCurrentSkill = skillIndex === state.currentSkillIndex;
                const isDifferentSinglePart = singlePartPractice && (!isCurrentSkill || partIndex !== state.currentPartIndex);
                const isCurrentSpeaking = isCurrentSkill && skill === 'speaking';
                const disabled = !isCurrentSkill || isDifferentSinglePart || isCurrentSpeaking ? ' disabled' : '';
                const label = `${skillLabels[skill]} Part ${partIndex + 1}`;
                return `<button type="button" class="vstep-part-tab${active}" data-skill="${skillIndex}" data-part="${partIndex}"${disabled}>${escapeHtml(label)}</button>`;
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
                const targetSkillIndex = Number(button.dataset.skill) || 0;
                const targetPartIndex = Number(button.dataset.part) || 0;
                saveCurrentPart(false);
                if (targetSkillIndex !== state.currentSkillIndex) {
                    return;
                }
                if (targetPartIndex !== state.currentPartIndex && !isPartComplete()) {
                    openPartMoveAlert(targetPartIndex);
                    return;
                }
                state.currentPartIndex = targetPartIndex;
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
            <div class="vstep-exam-audio${played ? ' is-locked' : ''}" data-audio-key="${escapeHtml(audioKey)}" data-audio-url="${escapeHtml(normalizeUrl(audioUrl))}">
                <button type="button" class="vstep-audio-play" ${played ? 'disabled' : ''} aria-label="Play audio once" title="Play audio once">
                    <i class="bi ${played ? 'bi-lock-fill' : 'bi-play-fill'}"></i>
                </button>
                <span class="vstep-audio-current">00:00</span>
                <div class="vstep-progress-track"><div class="vstep-progress-fill"></div></div>
                <span class="vstep-audio-duration">00:00</span>
                <span class="vstep-audio-status">${played ? 'Đã nghe' : 'Chỉ nghe 1 lần'}</span>
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
            const status = bar.querySelector('.vstep-audio-status');
            const audio = new Audio(url);
            audio.preload = 'metadata';

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
                bar.classList.remove('is-playing');
                bar.classList.add('is-locked');
                currentEl.textContent = formatClock(audio.duration || audio.currentTime || 0);
                fill.style.width = '100%';
                status.textContent = 'Đã nghe';
                state.audioPlayed[key] = true;
                persistAttempt();
            });
            button?.addEventListener('click', async () => {
                if (state.audioPlayed[key]) return;
                state.audioPlayed[key] = true;
                button.disabled = true;
                icon.className = 'bi bi-volume-up-fill';
                bar.classList.add('is-playing');
                status.textContent = 'Đang phát';
                persistAttempt();
                try {
                    await audio.play();
                } catch (error) {
                    showWarning('Không thể phát audio. Vui lòng kiểm tra trình duyệt hoặc báo giám thị.');
                    button.disabled = false;
                    state.audioPlayed[key] = false;
                    bar.classList.remove('is-playing');
                    icon.className = 'bi bi-play-fill';
                    status.textContent = 'Chỉ nghe 1 lần';
                }
            });
        });
    }

    function renderMcqQuestions(skill, part, partIndex) {
        return (part.questions || []).map((question, questionIndex) => {
            const id = getQuestionId(skill, partIndex, question, questionIndex);
            const selected = state.answers[skill][id] || '';
            const questionNumber = getQuestionNumber(skill, partIndex, questionIndex);
            const titlePrefix = skill === 'listening' ? `Question ${questionNumber}:` : `${questionNumber}.`;
            const options = (question.options || []).map(option => `
                <label class="vstep-option">
                    <input type="radio" name="${escapeHtml(id)}" value="${escapeHtml(option.label)}" ${selected === option.label ? 'checked' : ''}>
                    <span class="vstep-option-copy"><strong>${escapeHtml(option.label)}.</strong> ${escapeHtml(option.text)}</span>
                </label>
            `).join('');
            return `
                <div class="vstep-question${skill === 'listening' ? ' vstep-listening-question' : ''}" data-question-id="${escapeHtml(id)}" data-question-number="${questionNumber}">
                    <div class="vstep-question-title">${escapeHtml(titlePrefix)} ${escapeHtml(question.prompt)}</div>
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
        const title = safeText(part.title, `Part ${partIndex + 1}`);
        const range = getQuestionRange('listening', part, partIndex);
        const directions = getListeningDirections(part, partIndex);
        refs.content.innerHTML = `
            <div class="vstep-listening-layout">
                <section class="vstep-listening-paper">
                    <div class="vstep-listening-head">
                        <h1>${escapeHtml(title)}</h1>
                        ${range ? `<span>${escapeHtml(range)}</span>` : ''}
                    </div>
                    <div class="vstep-listening-instructions">${nl2br(directions)}</div>
                    ${renderAudioBar(part.audioUrl, `listening-${partIndex}`)}
                    <p class="vstep-listening-audio-note">Nhấn Play một lần để nghe. Audio sẽ tự chạy đến hết; không thể tạm dừng, tua hoặc nghe lại.</p>
                    <div class="vstep-listening-questions">
                        ${renderMcqQuestions('listening', part, partIndex)}
                    </div>
                </section>
            </div>
        `;
        setupAudioBars();
        bindMcq('listening');
    }

    function renderReading(part, partIndex) {
        const title = safeText(part.title, `Reading Part ${partIndex + 1}`);
        const passage = part.passage || part.text || part.content || '';
        const questionCount = (part.questions || []).length;
        refs.content.innerHTML = `
            <div class="vstep-reading-layout">
                <article class="vstep-passage vstep-reading-pane">
                    <h1>${escapeHtml(title)}</h1>
                    <div class="vstep-reading-passage-copy">${nl2br(passage)}</div>
                </article>
                <section class="vstep-reading-questions vstep-reading-pane">
                    <div class="vstep-reading-question-head">Questions 1-${questionCount || 0}</div>
                    ${renderMcqQuestions('reading', part, partIndex)}
                </section>
            </div>
        `;
        bindMcq('reading');
    }

    function wordCount(value) {
        return safeText(value).split(/\s+/).filter(Boolean).length;
    }

    function getWritingDefaultInstruction(part, partIndex) {
        return part.instructions || part.directions || (partIndex === 0
            ? 'You should spend about 20 minutes on this task.'
            : 'You should spend about 40 minutes on this task.');
    }

    function getWritingEvaluationText(part, partIndex) {
        const minimum = part.minWords || (partIndex === 0 ? 120 : 250);
        const nameNote = partIndex === 0 ? ' Do not include your name.' : '';
        return `You should write at least ${minimum} words.${nameNote} Your response will be evaluated in terms of Task Fulfillment, Organization, Vocabulary and Grammar.`;
    }

    function formatWritingCounter(value, part) {
        const count = wordCount(value);
        const minimum = part.minWords ? ` / min ${part.minWords}` : '';
        const maximum = part.maxWords ? ` / max ${part.maxWords}` : '';
        return `Word count: ${count}${minimum}${maximum}`;
    }

    function renderWriting(part, partIndex) {
        const key = `part${partIndex + 1}`;
        const saved = state.answers.writing[key] || '';
        const title = safeText(part.title, `Writing Part ${partIndex + 1}`);
        const prompt = part.prompt || '';
        const quotedText = part.extract || part.quote || part.reportExtract || '';
        refs.content.innerHTML = `
            <div class="vstep-writing-area">
                <section class="vstep-writing-paper">
                    <h1>${escapeHtml(title)}</h1>
                    <p class="vstep-writing-time">${escapeHtml(getWritingDefaultInstruction(part, partIndex))}</p>
                    <div class="vstep-writing-prompt">${nl2br(prompt)}</div>
                    ${safeText(quotedText) ? `<blockquote class="vstep-writing-extract">${nl2br(quotedText)}</blockquote>` : ''}
                    <p class="vstep-writing-eval">${escapeHtml(getWritingEvaluationText(part, partIndex))}</p>
                    <div class="vstep-writing-answer-head">
                        <span>Your answer:</span>
                        <span id="writingWordCount">${escapeHtml(formatWritingCounter(saved, part))}</span>
                    </div>
                    <textarea class="vstep-writing-textarea" id="writingAnswer" data-key="${escapeHtml(key)}" spellcheck="false" autocomplete="off">${escapeHtml(saved)}</textarea>
                </section>
            </div>
        `;
        const textarea = document.getElementById('writingAnswer');
        const counter = document.getElementById('writingWordCount');
        const blockExternalInput = event => {
            event.preventDefault();
            showWarning('Phần Writing chỉ cho nhập trực tiếp bằng bàn phím.');
        };
        textarea.addEventListener('input', () => {
            state.answers.writing[key] = textarea.value;
            counter.textContent = formatWritingCounter(textarea.value, part);
            updateAnsweredCounter();
            persistAttempt();
        });
        textarea.addEventListener('paste', blockExternalInput);
        textarea.addEventListener('drop', blockExternalInput);
        textarea.addEventListener('beforeinput', event => {
            if (event.inputType === 'insertFromPaste' || event.inputType === 'insertFromDrop') {
                blockExternalInput(event);
            }
        });
    }

    const speakingTiming = [
        { prep: 0, answer: 180 },
        { prep: 60, answer: 180 },
        { prep: 60, answer: 240 }
    ];

    function getSpeakingPrepSeconds(part, partIndex) {
        if (part?.useCustomTiming && Number.isFinite(Number(part.prepSeconds))) {
            return Math.max(0, Number(part.prepSeconds));
        }
        return speakingTiming[partIndex]?.prep || 0;
    }

    function getSpeakingAnswerSeconds(part, partIndex) {
        if (part?.useCustomTiming && Number.isFinite(Number(part.answerSeconds))) {
            return Math.max(1, Number(part.answerSeconds));
        }
        return speakingTiming[partIndex]?.answer || 180;
    }

    function speakingVolumeBars(level = 0) {
        const bars = Array.from({ length: 18 }).map((_, index) => {
            const height = Math.max(2, Math.min(86, (level * 100) - index * 4));
            return `<span class="vstep-volume-bar" style="height:${height}px"></span>`;
        }).join('');
        return `<div class="vstep-volume-box"><div class="vstep-volume-bars">${bars}</div></div>`;
    }

    function renderSpeakingTestSkipButton(label = 'BỎ QUA CHỜ', scope = 'phase') {
        if (!speakingTestSkipEnabled) return '';
        return `
            <button type="button" class="vstep-speaking-test-skip" id="speakingTestSkipBtn" data-skip-scope="${escapeHtml(scope)}">
                <i class="bi bi-skip-forward-fill"></i>
                <span>${escapeHtml(label)}</span>
            </button>
        `;
    }

    function bindSpeakingTestSkipButton() {
        if (!speakingTestSkipEnabled) return;
        const button = document.getElementById('speakingTestSkipBtn');
        if (!button) return;
        button.addEventListener('click', () => {
            button.disabled = true;
            button.classList.add('is-used');
            requestSpeakingSkip(button.dataset.skipScope || 'phase');
        });
    }

    function requestSpeakingSkip(scope = 'phase') {
        state.speakingSkipRequested = true;
        if (scope === 'part') {
            state.speakingSkipPartRequested = true;
        }
        if (state.speakingCurrentAudio) {
            try {
                state.speakingCurrentAudio.pause();
                state.speakingCurrentAudio.currentTime = state.speakingCurrentAudio.duration || state.speakingCurrentAudio.currentTime || 0;
            } catch (error) {
                console.warn('Không thể bỏ qua audio Speaking:', error);
            }
        }
        if (state.recorder && state.recorder.state !== 'inactive') {
            try {
                state.recorder.stop();
            } catch (error) {
                console.warn('Không thể dừng ghi âm Speaking:', error);
            }
        }
        if (typeof state.speakingSkipResolver === 'function') {
            state.speakingSkipResolver();
        }
    }

    function clearSpeakingSkipPhase() {
        state.speakingSkipResolver = null;
        state.speakingSkipRequested = false;
    }

    function shouldSkipSpeakingPhase() {
        return speakingTestSkipEnabled && (state.speakingSkipRequested || state.speakingSkipPartRequested);
    }

    function waitForSpeakingPhase(ms) {
        return new Promise(resolve => {
            let timeout = null;
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                if (timeout) clearTimeout(timeout);
                clearSpeakingSkipPhase();
                resolve();
            };
            state.speakingSkipResolver = finish;
            if (shouldSkipSpeakingPhase()) {
                finish();
                return;
            }
            timeout = setTimeout(finish, ms);
        });
    }

    function createSilentWavBlob(durationSeconds = 0.25) {
        const sampleRate = 8000;
        const channels = 1;
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const sampleCount = Math.max(1, Math.round(sampleRate * durationSeconds));
        const dataSize = sampleCount * channels * bytesPerSample;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);
        const writeString = (offset, value) => {
            for (let index = 0; index < value.length; index += 1) {
                view.setUint8(offset + index, value.charCodeAt(index));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, channels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * channels * bytesPerSample, true);
        view.setUint16(32, channels * bytesPerSample, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);

        return new Blob([buffer], { type: 'audio/wav' });
    }

    function renderSpeakingPrepScreen(remaining = state.data.speaking.readySeconds) {
        refs.content.innerHTML = `
            <div class="vstep-speaking-ready-card">
                <div class="vstep-speaking-test-row">${renderSpeakingTestSkipButton('BỎ QUA CHỜ', 'phase')}</div>
                <i class="bi bi-person-workspace"></i>
                <h1>BẠN ĐEO TAI NGHE ĐỂ LÀM BÀI THI NÓI</h1>
                <h2>BẠN CÓ ${state.data.speaking.readySeconds}s ĐỂ CHUẨN BỊ.</h2>
                <div class="vstep-speaking-ready-count" id="speakingReadyCount">${remaining}s</div>
                <p>BÀI LÀM SẼ ĐƯỢC THU ÂM TRỰC TIẾP<br>TRONG LÚC THU ÂM KHÔNG TƯƠNG TÁC VỚI HỆ THỐNG</p>
            </div>
        `;
        bindSpeakingTestSkipButton();
    }

    function updateSpeakingReadyCount(remaining) {
        const el = document.getElementById('speakingReadyCount');
        if (el) el.textContent = `${remaining}s`;
    }

    function renderSpeakingShell(statusHtml = '', options = {}) {
        const parts = getParts('speaking');
        const part = parts[state.currentPartIndex] || parts[0] || {};
        const partTitle = part.title || `Part ${state.currentPartIndex + 1}`;
        const introLabel = options.introLabel || `QUESTION ${state.currentPartIndex + 1}`;
        const imageUrl = normalizeUrl(part.imageUrl || part.image || '');
        refs.content.innerHTML = `
            <div class="vstep-speaking-layout">
                <div class="vstep-speaking-grid">
                    <section class="vstep-speaking-main">
                        <div class="vstep-speaking-head">
                            <div class="vstep-speaking-question-label">${escapeHtml(introLabel)}</div>
                            ${renderSpeakingTestSkipButton('BỎ QUA ĐOẠN NÀY', 'part')}
                        </div>
                        <div class="vstep-speaking-intro-player" id="speakingIntroPlayer">
                            <i class="bi bi-volume-up-fill"></i>
                            <span id="speakingIntroCurrent">00:00</span>
                            <div class="vstep-speaking-intro-track"><div id="speakingIntroFill"></div></div>
                            <span id="speakingIntroDuration">00:00</span>
                        </div>
                        <div class="vstep-speaking-status" id="speakingStatus">${statusHtml || 'Đang chuẩn bị phần thi nói...'}</div>
                        <article class="vstep-speaking-prompt">
                            <h1>${escapeHtml(partTitle)}</h1>
                            ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="" class="vstep-speaking-prompt-image">` : ''}
                            <div>${nl2br(part.prompt || '')}</div>
                        </article>
                    </section>
                    <aside class="vstep-speaking-side">
                        <div id="speakingVolume">${speakingVolumeBars(0)}</div>
                        <div class="vstep-speaking-side-saved" id="speakingSavedSide">
                            <i class="bi bi-check-circle-fill"></i>
                            <strong>BÀI THI ĐÃ ĐƯỢC LƯU VÀO HỆ THỐNG.</strong>
                            <span>NHẤN NÚT "NỘP BÀI" TẠI GÓC TRÊN CÙNG BÊN PHẢI ĐỂ NỘP BÀI THI.</span>
                        </div>
                    </aside>
                </div>
                <div class="vstep-speaking-save-overlay" id="speakingSaveOverlay">
                    <div>
                        <h2 id="speakingSaveTitle">BÀI NÓI ĐÃ ĐƯỢC LƯU VÀO HỆ THỐNG</h2>
                        <p>Câu hỏi tiếp theo sẽ bắt đầu sau.</p>
                    </div>
                </div>
            </div>
        `;
        bindSpeakingTestSkipButton();
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
            let interval = null;
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                if (interval) clearInterval(interval);
                clearSpeakingSkipPhase();
                resolve();
            };
            state.speakingSkipResolver = finish;
            render(remaining);
            if (shouldSkipSpeakingPhase()) {
                render(0);
                finish();
                return;
            }
            if (remaining <= 0) {
                finish();
                return;
            }
            interval = setInterval(() => {
                remaining -= 1;
                render(remaining);
                if (remaining <= 0) {
                    finish();
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

    function setSpeakingIntroProgress(current, duration) {
        const currentEl = document.getElementById('speakingIntroCurrent');
        const durationEl = document.getElementById('speakingIntroDuration');
        const fill = document.getElementById('speakingIntroFill');
        if (currentEl) currentEl.textContent = formatClock(current || 0);
        if (durationEl) durationEl.textContent = formatClock(duration || 0);
        if (fill) fill.style.width = `${duration ? Math.min(100, (current / duration) * 100) : 0}%`;
    }

    function playSpeakingIntro(url) {
        const normalized = normalizeUrl(url);
        const player = document.getElementById('speakingIntroPlayer');
        if (!normalized) {
            if (player) player.classList.add('is-muted');
            setSpeakingIntroProgress(0, 0);
            return waitForSpeakingPhase(700);
        }
        if (shouldSkipSpeakingPhase()) {
            setSpeakingIntroProgress(0, 0);
            clearSpeakingSkipPhase();
            return Promise.resolve();
        }
        return new Promise(resolve => {
            const audio = new Audio(normalized);
            state.speakingCurrentAudio = audio;
            let done = false;
            const timeout = setTimeout(() => finish(), 90000);
            const finish = () => {
                if (done) return;
                done = true;
                clearTimeout(timeout);
                if (state.speakingCurrentAudio === audio) state.speakingCurrentAudio = null;
                clearSpeakingSkipPhase();
                player?.classList.remove('is-playing');
                setSpeakingIntroProgress(audio.duration || audio.currentTime || 0, audio.duration || audio.currentTime || 0);
                resolve();
            };
            state.speakingSkipResolver = finish;
            player?.classList.add('is-playing');
            audio.addEventListener('loadedmetadata', () => setSpeakingIntroProgress(0, audio.duration || 0));
            audio.addEventListener('timeupdate', () => setSpeakingIntroProgress(audio.currentTime || 0, audio.duration || 0));
            audio.addEventListener('ended', finish);
            audio.addEventListener('error', finish);
            audio.play().catch(finish);
        });
    }

    async function showSpeakingSaveNotice(partIndex, isFinal = false) {
        const side = document.getElementById('speakingSavedSide');
        const overlay = document.getElementById('speakingSaveOverlay');
        const title = document.getElementById('speakingSaveTitle');
        if (side) side.classList.add('show');
        if (isFinal) {
            if (overlay) overlay.classList.remove('show');
            updateSpeakingStatus('Bài thi nói đã được lưu vào hệ thống. Nhấn NỘP BÀI để kết thúc bài thi.');
            return;
        }
        if (title) title.textContent = `BÀI NÓI SỐ ${partIndex + 1} ĐÃ ĐƯỢC LƯU VÀO HỆ THỐNG`;
        if (overlay) overlay.classList.add('show');
        await wait(speakingTestSkipEnabled && state.speakingSkipPartRequested ? 250 : 2400);
        if (overlay) overlay.classList.remove('show');
    }

    async function recordSpeakingPart(part, partIndex) {
        const stream = await ensureMicStream();
        const mimeType = pickMimeType();
        const answerSeconds = getSpeakingAnswerSeconds(part, partIndex);
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
        await countdown(answerSeconds, remaining => {
            renderTimer(remaining);
            updateSpeakingStatus(`Hệ thống đang thu âm. Thời gian còn lại: <span class="text-danger">${remaining}s</span>`);
        });
        if (recorder.state !== 'inactive') recorder.stop();
        await stopped;
        stopVisualizer();

        let recordingMimeType = mimeType || 'audio/webm';
        let blob = new Blob(state.currentChunks, { type: recordingMimeType });
        if (!blob.size && speakingTestSkipEnabled) {
            blob = createSilentWavBlob();
            recordingMimeType = 'audio/wav';
        }
        const answerKey = `part${partIndex + 1}`;
        state.answers.speaking[answerKey] = {
            recorded: true,
            prompt: part.prompt || '',
            title: part.title || `Part ${partIndex + 1}`,
            durationSeconds: answerSeconds,
            recordedAt: new Date().toISOString()
        };
        persistAttempt();

        updateSpeakingStatus('Đang lưu file ghi âm vào hệ thống...');
        const uploaded = await uploadSpeakingBlob(blob, partIndex, recordingMimeType);
        state.answers.speaking[answerKey] = {
            ...state.answers.speaking[answerKey],
            recordingUrl: uploaded.rawUrl,
            filePath: uploaded.filePath,
            mimeType: uploaded.mimeType || recordingMimeType
        };
        persistAttempt();
    }

    async function runSpeakingFlow() {
        if (state.speakingStarted) return;
        state.speakingStarted = true;
        state.speakingFinished = false;
        clearInterval(state.timerInterval);
        refs.continueBtn.disabled = true;
        refs.savePartBtn.disabled = true;
        refs.savePartBtn.style.display = 'none';
        renderSpeakingPrepScreen(state.data.speaking.readySeconds);

        try {
            await ensureMicStream();
            await countdown(state.data.speaking.readySeconds, remaining => {
                renderTimer(remaining);
                updateSpeakingReadyCount(remaining);
            });

            const parts = getParts('speaking');
            const partIndexes = singlePartPractice
                ? [state.currentPartIndex]
                : parts.map((_, index) => index);
            for (let order = 0; order < partIndexes.length; order += 1) {
                const index = partIndexes[order];
                const part = parts[index];
                state.speakingSkipPartRequested = false;
                state.currentPartIndex = index;
                renderTabs();
                renderSpeakingShell('Hệ thống đang phát audio giới thiệu câu hỏi...', {
                    introLabel: `QUESTION ${index + 1}`
                });
                updateAnsweredCounter();
                await playSpeakingIntro(part.introAudioUrl);
                const prepSeconds = getSpeakingPrepSeconds(part, index);
                await countdown(prepSeconds, remaining => {
                    renderTimer(remaining);
                    updateSpeakingStatus(prepSeconds
                        ? `Thời gian chuẩn bị: <span class="text-danger">${remaining}s</span>. Hệ thống chưa thu âm.`
                        : 'Bắt đầu trả lời. Hệ thống đang chuẩn bị thu âm...');
                });
                await recordSpeakingPart(part, index);
                updateAnsweredCounter();
                await showSpeakingSaveNotice(index, order >= partIndexes.length - 1);
                state.speakingSkipPartRequested = false;
            }

            state.speakingFinished = true;
            refs.continueBtn.disabled = true;
            refs.savePartBtn.disabled = true;
            renderTimer(0);
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
        const isLastPart = state.currentPartIndex >= getParts(skill).length - 1;
        const shouldGoBack = focusedSkillPractice && isLastPart && state.currentPartIndex > 0;
        refs.content.classList.toggle('vstep-work-area-reading', skill === 'reading');
        refs.content.classList.toggle('vstep-work-area-writing', skill === 'writing');
        refs.content.classList.toggle('vstep-work-area-speaking', skill === 'speaking');
        refs.continueBtn.disabled = false;
        refs.savePartBtn.disabled = false;
        refs.continueBtn.style.display = skill === 'speaking' ? 'none' : '';
        refs.continueBtn.textContent = shouldGoBack ? 'QUAY LẠI' : 'TIẾP TỤC';
        refs.savePartBtn.style.display = skill === 'speaking' ? 'none' : '';

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

    function isPartComplete(skill = getCurrentSkill(), partIndex = state.currentPartIndex) {
        const total = countPartQuestions(skill, partIndex);
        return total <= 0 || countAnsweredInPart(skill, partIndex) >= total;
    }

    function openPartMoveAlert(targetPartIndex) {
        const skillIndex = state.currentSkillIndex;
        const skill = getCurrentSkill();
        const answered = countAnsweredInPart(skill, state.currentPartIndex);
        const total = countPartQuestions(skill, state.currentPartIndex);
        const countText = `${answered}/${total}`;
        state.pendingSkillMove = {
            skillIndex,
            partIndex: targetPartIndex
        };
        document.getElementById('skillConfirmTitle').innerHTML = `Bạn mới trả lời được <span class="vstep-confirm-count">${escapeHtml(countText)}</span> câu hỏi trong part này`;
        document.getElementById('skillConfirmText').textContent =
            `Bạn vẫn muốn chuyển sang ${skillLabels[skill]} Part ${targetPartIndex + 1}?`;
        document.getElementById('confirmNextSkillBtn').textContent = 'TIẾP TỤC';
        document.getElementById('cancelNextSkillBtn').textContent = 'Ở LẠI';
        showModal(refs.skillConfirmModal);
    }

    function requestNextSkill() {
        if (focusedSkillPractice) {
            openSubmitModal();
            return;
        }
        const nextSkillIndex = state.currentSkillIndex + 1;
        if (!skills[nextSkillIndex]) {
            openSubmitModal();
            return;
        }
        state.pendingSkillMove = {
            skillIndex: nextSkillIndex,
            partIndex: 0
        };
        document.getElementById('skillConfirmTitle').textContent = `Bạn muốn chuyển sang kỹ năng ${skillLabels[skills[nextSkillIndex]]}?`;
        document.getElementById('skillConfirmText').textContent = 'Sau khi chuyển kỹ năng, hệ thống sẽ bắt đầu thời gian của kỹ năng tiếp theo.';
        document.getElementById('confirmNextSkillBtn').textContent = 'ĐỒNG Ý';
        document.getElementById('cancelNextSkillBtn').textContent = 'HỦY BỎ';
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
        if (focusedSkillPractice && state.currentPartIndex >= parts.length - 1 && state.currentPartIndex > 0) {
            if (!isPartComplete()) {
                openPartMoveAlert(state.currentPartIndex - 1);
                return;
            }
            state.currentPartIndex -= 1;
            renderCurrentPart();
            return;
        }
        if (singlePartPractice) {
            openSubmitModal();
            return;
        }
        if (state.currentPartIndex < parts.length - 1) {
            if (!isPartComplete()) {
                openPartMoveAlert(state.currentPartIndex + 1);
                return;
            }
            state.currentPartIndex += 1;
            renderCurrentPart();
            return;
        }
        requestNextSkill();
    }

    function moveToSkill(skillIndex, partIndex = 0) {
        state.skillRemainingBySkill[getCurrentSkill()] = state.skillRemaining;
        saveCurrentPart(false);
        state.currentSkillIndex = skillIndex;
        state.currentPartIndex = Math.max(0, partIndex);
        clampCurrentPosition();
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

    function scoreSkill(skill, onlyPartIndex = null) {
        let score = 0;
        let max = 0;
        const details = [];
        getParts(skill).forEach((part, partIndex) => {
            if (Number.isInteger(onlyPartIndex) && partIndex !== onlyPartIndex) return;
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
            const focusedPartIndex = singlePartPractice ? state.currentPartIndex : null;
            const includeListening = !focusedSkillPractice || requestedSkill === 'listening';
            const includeReading = !focusedSkillPractice || requestedSkill === 'reading';
            const listening = includeListening
                ? scoreSkill('listening', requestedSkill === 'listening' ? focusedPartIndex : null)
                : { score: 0, max: 0, details: [] };
            const reading = includeReading
                ? scoreSkill('reading', requestedSkill === 'reading' ? focusedPartIndex : null)
                : { score: 0, max: 0, details: [] };
            const totalScore = listening.score + reading.score;
            const maxScore = listening.max + reading.max;
            const durationSeconds = Math.max(1, Math.round((Date.now() - state.startedAt) / 1000));
            const metadata = {
                module: 'vstep',
                source: 'vstep_exam',
                submission_kind: 'vstep_exam',
                session_type: getCurrentSkill(),
                vstep_flow: state.data.vstep_flow || 'practice',
                vstep_content_kind: state.data.vstep_content_kind || 'mock_test',
                vstep_set_id: setId,
                vstep_set_title: state.set?.title || '',
                vstep_practice_skill: requestedSkill || 'full_test',
                vstep_practice_mode: requestedMode || 'full_test',
                vstep_initial_part: singlePartPractice ? state.currentPartIndex + 1 : null,
                assignment_id: assignmentId || state.set?.assignment?.id || null,
                submitted_at: new Date().toISOString(),
                answers: state.answers,
                listening_details: listening.details,
                reading_details: reading.details,
                writing_answers: collectWritingMetadata(),
                speaking_answers: state.answers.speaking,
                durations: state.data.durations
            };

            const payload = {
                contentId: setId,
                setId,
                assignmentId: assignmentId || state.set?.assignment?.id || null,
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

            const response = await fetch('/api/vstep/results/submit', {
                method: 'POST',
                headers: authorizedHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
            const savedResult = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(savedResult.error || 'Không thể lưu kết quả VSTEP.');
            const saved = savedResult.result || true;
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
        document.getElementById('cancelNextSkillBtn').addEventListener('click', () => {
            state.pendingSkillMove = null;
            hideModal(refs.skillConfirmModal);
        });
        document.getElementById('confirmNextSkillBtn').addEventListener('click', () => {
            const target = state.pendingSkillMove || {
                skillIndex: state.currentSkillIndex + 1,
                partIndex: 0
            };
            state.pendingSkillMove = null;
            hideModal(refs.skillConfirmModal);
            if (target.skillIndex === state.currentSkillIndex) {
                state.currentPartIndex = Math.max(0, target.partIndex);
                clampCurrentPosition();
                renderCurrentPart();
                return;
            }
            moveToSkill(target.skillIndex, target.partIndex);
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
