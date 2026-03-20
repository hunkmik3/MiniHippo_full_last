(function () {
    const query = new URLSearchParams(window.location.search);
    const setId = query.get('set');
    const CACHE_PREFIX = 'practice_set_cache_speaking_';
    const cacheKey = setId ? `${CACHE_PREFIX}${setId}` : null;

    const refs = {
        loading: document.getElementById('loadingState'),
        error: document.getElementById('errorState'),
        content: document.getElementById('practiceContent'),
        navigator: document.getElementById('navigator'),
        questionContainer: document.getElementById('question1'),
        countdown: document.getElementById('countdownTimer'),
        step: document.getElementById('question_step'),
        badge: document.getElementById('pageBadge'),
        title: document.getElementById('pageTitle'),
        instruction: document.getElementById('pageInstruction'),
        standardLayout: document.getElementById('standardLayout'),
        coverLayout: document.getElementById('coverLayout'),
        coverTitle: document.getElementById('coverTitle'),
        coverBody: document.getElementById('coverBody'),
        images: document.getElementById('pageImages'),
        audioCard: document.getElementById('audioCard'),
        audio: document.getElementById('pageAudio'),
        audioProgress: document.getElementById('audioProgressLabel'),
        audioStatus: document.getElementById('audioStatusLabel'),
        autoHint: document.getElementById('autoAdvanceHint'),
        answerBlock: document.getElementById('answerBlock'),
        answerInput: document.getElementById('answerInput'),
        wordCount: document.getElementById('wordCountLabel'),
        backBtn: document.getElementById('backButton'),
        nextBtn: document.getElementById('nextButton'),
        submitModal: document.getElementById('submitModal'),
        submitConfirmBtn: document.getElementById('confirmSubmitBtn'),
        doneModal: document.getElementById('doneModal')
    };

    const state = {
        set: null,
        normalizedData: null,
        pages: [],
        currentPage: 1,
        totalPages: 0,
        startAt: Date.now(),
        timeLeft: 15 * 60,
        timerInterval: null,
        autoAdvanceInterval: null,
        audioList: [],
        audioIndex: 0,
        answers: {},
        isSubmitting: false,
        completed: false
    };

    const DEFAULT_COVER_TITLE = 'Welcome to the Aptis Speaking Test.';
    const DEFAULT_COVER_LINES = [
        'You will answer some questions about yourself and then do three short speaking tasks.',
        'Listen to the instructions and speak clearly into your microphone when you hear the signal.',
        'Each part of the test will appear automatically.',
        'The test will take about 12 minutes.'
    ];
    const COMPLETE_PAGE_TITLE = 'Bạn đã hoàn thành bài Speaking.';
    const COMPLETE_PAGE_MESSAGE = 'Tất cả câu hỏi đã hoàn tất. Vui lòng nhấn "Nộp bài" để gửi kết quả.';
    function safeText(value) {
        return typeof value === 'string' ? value.trim() : '';
    }

    function getWordCount(value) {
        return safeText(value).split(/\s+/).filter(Boolean).length;
    }

    function setWordCount(value) {
        if (!refs.wordCount) return;
        refs.wordCount.textContent = `${getWordCount(value)} từ`;
    }

    function normalizeUrl(url) {
        const value = safeText(url);
        if (!value) return '';
        if (/^https?:\/\//i.test(value)) return value;
        return value.startsWith('/') ? value : `/${value}`;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function startCountdown(minutes) {
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }
        state.timeLeft = Math.max(1, Number(minutes) || 15) * 60;
        if (refs.countdown) refs.countdown.textContent = formatTime(state.timeLeft);

        state.timerInterval = setInterval(() => {
            if (state.timeLeft <= 0) {
                clearInterval(state.timerInterval);
                if (refs.countdown) refs.countdown.textContent = '00:00';
                return;
            }
            state.timeLeft -= 1;
            if (refs.countdown) refs.countdown.textContent = formatTime(state.timeLeft);
        }, 1000);
    }

    function getAuthorizedHeaders(extra = {}) {
        const headers = { ...(extra || {}) };
        const token = typeof getAuthToken === 'function' ? getAuthToken() : null;
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        if (typeof buildDeviceHeaders === 'function') {
            return buildDeviceHeaders(headers);
        }
        if (typeof getDeviceId === 'function') {
            headers['X-Device-Id'] = getDeviceId();
        }
        if (typeof getDeviceName === 'function') {
            headers['X-Device-Name'] = getDeviceName();
        }
        return headers;
    }

    function showError(message) {
        if (refs.loading) refs.loading.style.display = 'none';
        if (refs.content) refs.content.style.display = 'none';
        if (refs.navigator) {
            refs.navigator.style.setProperty('display', 'none', 'important');
        }
        if (refs.error) {
            refs.error.style.display = 'block';
            refs.error.textContent = message;
        }
    }

    function firstValue(obj, keys, fallback = '') {
        if (!obj || typeof obj !== 'object') return fallback;
        for (const key of keys) {
            if (obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== '') {
                return obj[key];
            }
        }
        return fallback;
    }

    function normalizeQuestions(rawQuestions, expectedCount, prefix) {
        const source = Array.isArray(rawQuestions) ? rawQuestions : [];
        const normalized = [];

        for (let i = 0; i < expectedCount; i += 1) {
            const raw = source[i] || {};
            normalized.push({
                prompt: safeText(firstValue(raw, ['prompt', 'question', 'text'], `${prefix} ${i + 1}`)),
                audioUrl: normalizeUrl(firstValue(raw, ['audioUrl', 'audio', 'audio_url'], ''))
            });
        }

        return normalized;
    }

    function normalizeSetData(raw) {
        const data = raw && typeof raw === 'object' ? raw : {};
        const introPage = data.introPage && typeof data.introPage === 'object' ? data.introPage : {};
        const part1 = data.part1 && typeof data.part1 === 'object' ? data.part1 : {};
        const part2 = data.part2 && typeof data.part2 === 'object' ? data.part2 : {};
        const part3 = data.part3 && typeof data.part3 === 'object' ? data.part3 : {};
        const part4 = data.part4 && typeof data.part4 === 'object' ? data.part4 : {};
        const prepPage = part4.prepPage && typeof part4.prepPage === 'object' ? part4.prepPage : {};
        const finalPage = part4.finalPage && typeof part4.finalPage === 'object' ? part4.finalPage : {};

        return {
            introPage: {
                title: safeText(firstValue(introPage, ['title'], DEFAULT_COVER_TITLE)),
                description: safeText(firstValue(
                    introPage,
                    ['description', 'instruction'],
                    DEFAULT_COVER_LINES.join('\n')
                )),
                imageUrl: normalizeUrl(firstValue(introPage, ['imageUrl', 'image', 'coverImageUrl'], ''))
            },
            part1: {
                introText: safeText(firstValue(part1, ['introText', 'instruction'], 'Part 1: Trả lời 3 câu hỏi ngắn về thông tin cá nhân.')),
                introAudioUrl: normalizeUrl(firstValue(part1, ['introAudioUrl', 'audioUrl', 'introAudio'], '')),
                questions: normalizeQuestions(part1.questions, 3, 'Câu hỏi Part 1')
            },
            part2: {
                introText: safeText(firstValue(part2, ['introText', 'instruction'], 'Part 2: Mô tả ảnh và trả lời 2 câu hỏi.')),
                introAudioUrl: normalizeUrl(firstValue(part2, ['introAudioUrl', 'audioUrl', 'introAudio'], '')),
                imageUrl: normalizeUrl(firstValue(part2, ['imageUrl', 'image'], '')),
                questions: normalizeQuestions(part2.questions, 2, 'Câu hỏi Part 2')
            },
            part3: {
                introText: safeText(firstValue(part3, ['introText', 'instruction'], 'Part 3: So sánh 2 bức ảnh và trả lời 2 câu hỏi.')),
                introAudioUrl: normalizeUrl(firstValue(part3, ['introAudioUrl', 'audioUrl', 'introAudio'], '')),
                imageUrl: normalizeUrl(firstValue(
                    part3,
                    ['imageUrl', 'image', 'mergedImageUrl', 'leftImageUrl', 'imageLeft', 'image1'],
                    ''
                )),
                questions: normalizeQuestions(part3.questions, 2, 'Câu hỏi Part 3')
            },
            part4: {
                introText: safeText(firstValue(part4, ['introText', 'instruction'], 'Part 4: Trình bày quan điểm và trả lời câu hỏi mở rộng.')),
                introAudioUrl: normalizeUrl(firstValue(part4, ['introAudioUrl', 'audioUrl', 'introAudio'], '')),
                prepPage: {
                    imageUrl: normalizeUrl(firstValue(prepPage, ['imageUrl', 'image'], '')),
                    questionAudioUrl: normalizeUrl(firstValue(prepPage, ['questionAudioUrl', 'audioQuestion'], '')),
                    prepAudioUrl: normalizeUrl(firstValue(prepPage, ['prepAudioUrl', 'audioPrep'], '')),
                    instruction: safeText(firstValue(prepPage, ['instruction', 'prompt'], 'Nghe câu hỏi và phần chuẩn bị 1 phút.'))
                },
                finalPage: {
                    imageUrl: normalizeUrl(firstValue(finalPage, ['imageUrl', 'image'], '')),
                    prompt: safeText(firstValue(finalPage, ['prompt', 'question', 'instruction'], 'Hãy trình bày câu trả lời của bạn cho câu hỏi cuối cùng.')),
                    audioUrl: normalizeUrl(firstValue(finalPage, ['audioUrl', 'audio'], ''))
                }
            }
        };
    }

    function buildPages(data) {
        const pages = [];

        pages.push({
            id: 'pg1',
            kind: 'cover',
            part: 0,
            title: data.introPage.title,
            instruction: data.introPage.description,
            images: data.introPage.imageUrl ? [data.introPage.imageUrl] : [],
            audioUrls: [],
            audioWaitSeconds: [],
            answerKey: null,
            prompt: '',
            autoAdvance: false
        });

        pages.push({
            id: 'pg2',
            kind: 'intro',
            part: 1,
            title: 'Part 1 - Bắt đầu',
            instruction: data.part1.introText,
            images: [],
            audioUrls: data.part1.introAudioUrl ? [data.part1.introAudioUrl] : [],
            audioWaitSeconds: data.part1.introAudioUrl ? [5] : [],
            answerKey: null,
            prompt: '',
            autoAdvance: true
        });

        data.part1.questions.forEach((item, index) => {
            pages.push({
                id: `pg${index + 3}`,
                kind: 'question',
                part: 1,
                title: `Part 1 - Câu hỏi ${index + 1}`,
                instruction: item.prompt,
                images: [],
                audioUrls: item.audioUrl ? [item.audioUrl] : [],
                audioWaitSeconds: item.audioUrl ? [30] : [],
                answerKey: `part1_q${index + 1}`,
                prompt: item.prompt,
                autoAdvance: true
            });
        });

        pages.push({
            id: 'pg6',
            kind: 'intro',
            part: 2,
            title: 'Part 2 - Bắt đầu',
            instruction: data.part2.introText,
            images: data.part2.imageUrl ? [data.part2.imageUrl] : [],
            audioUrls: data.part2.introAudioUrl ? [data.part2.introAudioUrl] : [],
            audioWaitSeconds: data.part2.introAudioUrl ? [45] : [],
            answerKey: null,
            prompt: '',
            autoAdvance: true
        });

        data.part2.questions.forEach((item, index) => {
            pages.push({
                id: `pg${index + 7}`,
                kind: 'question',
                part: 2,
                title: `Part 2 - Câu hỏi ${index + 1}`,
                instruction: item.prompt,
                images: [],
                audioUrls: item.audioUrl ? [item.audioUrl] : [],
                audioWaitSeconds: item.audioUrl ? [45] : [],
                answerKey: `part2_q${index + 1}`,
                prompt: item.prompt,
                autoAdvance: true
            });
        });

        pages.push({
            id: 'pg9',
            kind: 'intro',
            part: 3,
            title: 'Part 3 - Bắt đầu',
            instruction: data.part3.introText,
            images: data.part3.imageUrl ? [data.part3.imageUrl] : [],
            audioUrls: data.part3.introAudioUrl ? [data.part3.introAudioUrl] : [],
            audioWaitSeconds: data.part3.introAudioUrl ? [45] : [],
            answerKey: null,
            prompt: '',
            autoAdvance: true
        });

        data.part3.questions.forEach((item, index) => {
            pages.push({
                id: `pg${index + 10}`,
                kind: 'question',
                part: 3,
                title: `Part 3 - Câu hỏi ${index + 1}`,
                instruction: item.prompt,
                images: [],
                audioUrls: item.audioUrl ? [item.audioUrl] : [],
                audioWaitSeconds: item.audioUrl ? [45] : [],
                answerKey: `part3_q${index + 1}`,
                prompt: item.prompt,
                autoAdvance: true
            });
        });

        pages.push({
            id: 'pg12',
            kind: 'intro',
            part: 4,
            title: 'Part 4 - Bắt đầu',
            instruction: data.part4.introText,
            images: [],
            audioUrls: data.part4.introAudioUrl ? [data.part4.introAudioUrl] : [],
            audioWaitSeconds: data.part4.introAudioUrl ? [5] : [],
            answerKey: null,
            prompt: '',
            autoAdvance: true
        });

        pages.push({
            id: 'pg13',
            kind: 'prep',
            part: 4,
            title: 'Part 4 - Chuẩn bị',
            instruction: data.part4.prepPage.instruction,
            images: data.part4.prepPage.imageUrl ? [data.part4.prepPage.imageUrl] : [],
            audioUrls: [data.part4.prepPage.questionAudioUrl, data.part4.prepPage.prepAudioUrl].filter(Boolean),
            audioWaitSeconds: [data.part4.prepPage.questionAudioUrl ? 5 : null, data.part4.prepPage.prepAudioUrl ? 60 : null].filter(value => value !== null),
            answerKey: `part4_q1`,
            prompt: data.part4.prepPage.instruction,
            autoAdvance: true
        });

        pages.push({
            id: 'pg14',
            kind: 'final',
            part: 4,
            title: 'Part 4 - Câu hỏi cuối',
            instruction: data.part4.finalPage.prompt,
            images: data.part4.finalPage.imageUrl ? [data.part4.finalPage.imageUrl] : [],
            audioUrls: data.part4.finalPage.audioUrl ? [data.part4.finalPage.audioUrl] : [],
            audioWaitSeconds: data.part4.finalPage.audioUrl ? [120] : [],
            answerKey: `part4_q2`,
            prompt: data.part4.finalPage.prompt,
            autoAdvance: false
        });

        pages.push({
            id: 'pg15',
            kind: 'completion',
            part: 4,
            title: COMPLETE_PAGE_TITLE,
            instruction: COMPLETE_PAGE_MESSAGE,
            images: [],
            audioUrls: [],
            audioWaitSeconds: [],
            answerKey: null,
            prompt: '',
            autoAdvance: false
        });

        return pages;
    }

    function stopAudioAndTimers() {
        if (refs.audio) {
            refs.audio.pause();
            refs.audio.removeAttribute('src');
            refs.audio.load();
            refs.audio.onended = null;
        }
        if (state.autoAdvanceInterval) {
            clearInterval(state.autoAdvanceInterval);
            state.autoAdvanceInterval = null;
        }
    }

    function persistCurrentAnswer() {
        const page = state.pages[state.currentPage - 1];
        if (!page || !page.answerKey || !refs.answerInput) {
            return;
        }
        state.answers[page.answerKey] = refs.answerInput.value || '';
    }

    function renderImages(images) {
        if (!refs.images) return;
        refs.images.innerHTML = '';
        if (!Array.isArray(images) || !images.length) return;

        const colClass = images.length === 1 ? 'col-12' : 'col-12 col-md-6';
        images.forEach((src) => {
            const col = document.createElement('div');
            col.className = colClass;
            const img = document.createElement('img');
            img.className = 'page-image';
            img.src = src;
            img.alt = 'Speaking visual';
            col.appendChild(img);
            refs.images.appendChild(col);
        });
    }

    function isCoverPage(page) {
        return page?.kind === 'cover' || page?.id === 'pg1';
    }

    function getCoverLines(rawInstruction) {
        const raw = safeText(rawInstruction);
        if (!raw || /^Trang giới thiệu bộ đề Speaking\.?$/i.test(raw)) {
            return DEFAULT_COVER_LINES;
        }
        const lines = raw
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);
        return lines.length ? lines : DEFAULT_COVER_LINES;
    }

    function renderCoverContent(page) {
        if (refs.coverLayout) refs.coverLayout.style.display = 'block';
        if (refs.standardLayout) refs.standardLayout.style.display = 'none';

        if (refs.coverTitle) {
            refs.coverTitle.textContent = safeText(page?.title) || DEFAULT_COVER_TITLE;
        }
        if (refs.coverBody) {
            refs.coverBody.innerHTML = '';
            getCoverLines(page?.instruction).forEach((line) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = line;
                refs.coverBody.appendChild(paragraph);
            });
        }
    }

    function updateHeader() {
        if (!refs.step) return;
        const page = state.pages[state.currentPage - 1];
        const setTitle = state.set?.title ? ` · ${state.set.title}` : '';
        refs.step.textContent = `${page?.id?.toUpperCase() || 'PG'} (${state.currentPage}/${state.totalPages})${setTitle}`;
    }

    function startAutoAdvanceCountdown(page, seconds, options = {}) {
        if (!page || !seconds || seconds <= 0) {
            return;
        }

        const onComplete = typeof options.onComplete === 'function' ? options.onComplete : null;
        const completionLabel = safeText(options.completionLabel);
        const defaultLabel = state.currentPage >= state.totalPages ? 'Tự nộp bài' : 'Tự chuyển trang';
        const actionLabel = completionLabel || defaultLabel;
        let remain = seconds;
        const updateCountdownText = () => {
            if (refs.autoHint) {
                refs.autoHint.textContent = `${actionLabel} sau ${remain}s.`;
            }
            if (refs.audioStatus && Array.isArray(page.audioUrls) && page.audioUrls.length) {
                refs.audioStatus.textContent = `${actionLabel} sau ${remain} giây...`;
            }
        };
        updateCountdownText();

        state.autoAdvanceInterval = setInterval(() => {
            remain -= 1;
            if (remain <= 0) {
                clearInterval(state.autoAdvanceInterval);
                state.autoAdvanceInterval = null;
                if (onComplete) {
                    onComplete();
                } else if (state.currentPage >= state.totalPages) {
                    submitResult();
                } else {
                    showPage(state.currentPage + 1);
                }
                return;
            }
            updateCountdownText();
        }, 1000);
    }

    function playAudioSequence(page) {
        if (!refs.audio || !refs.audioCard) {
            return false;
        }

        const validAudio = (page.audioUrls || []).map(normalizeUrl).filter(Boolean);
        const waitPlan = Array.isArray(page.audioWaitSeconds) ? page.audioWaitSeconds : [];
        state.audioList = validAudio;
        state.audioIndex = 0;

        if (!validAudio.length) {
            refs.audioCard.style.display = 'none';
            return false;
        }

        refs.audioCard.style.display = 'block';

        const runAudioAt = async (index) => {
            if (!refs.audio) return;

            state.audioIndex = index;
            refs.audio.src = validAudio[index];
            refs.audio.load();

            if (refs.audioProgress) {
                refs.audioProgress.textContent = `Audio ${index + 1}/${validAudio.length}`;
            }
            if (refs.audioStatus) {
                refs.audioStatus.textContent = 'Đang phát audio tự động...';
            }

            refs.audio.onended = async () => {
                if (state.currentPage < 1 || state.currentPage > state.totalPages) {
                    return;
                }
                const currentPage = state.pages[state.currentPage - 1];
                if (!currentPage || currentPage.id !== page.id) return;

                const hasNextAudio = index + 1 < validAudio.length;
                const waitSeconds = Number(waitPlan[index]) || 0;
                const nextActionLabel = hasNextAudio
                    ? 'Phát audio tiếp theo'
                    : (state.currentPage >= state.totalPages ? 'Tự nộp bài' : 'Tự chuyển trang');
                const finishSequence = async () => {
                    const latestPage = state.pages[state.currentPage - 1];
                    if (!latestPage || latestPage.id !== page.id) return;
                    if (hasNextAudio) {
                        await runAudioAt(index + 1);
                    } else if (state.currentPage >= state.totalPages) {
                        submitResult();
                    } else {
                        showPage(state.currentPage + 1);
                    }
                };

                if (waitSeconds > 0) {
                    startAutoAdvanceCountdown(page, waitSeconds, {
                        completionLabel: nextActionLabel,
                        onComplete: finishSequence
                    });
                    return;
                }

                if (refs.audioStatus) refs.audioStatus.textContent = 'Audio đã phát xong.';
                await finishSequence();
            };

            try {
                await refs.audio.play();
            } catch (error) {
                if (refs.audioStatus) {
                    refs.audioStatus.textContent = 'Trình duyệt đang chặn autoplay. Vui lòng bấm Play để tiếp tục.';
                }
                if (refs.autoHint) {
                    refs.autoHint.textContent = 'Thời gian sẽ bắt đầu đếm sau khi audio phát xong.';
                }
            }
        };

        runAudioAt(0);
        return true;
    }

    function renderPage(page) {
        if (!page) return;

        stopAudioAndTimers();
        const coverPage = isCoverPage(page);
        if (refs.questionContainer) {
            refs.questionContainer.classList.toggle('cover-wide', coverPage);
        }

        if (coverPage) {
            renderCoverContent(page);
            if (refs.audioCard) refs.audioCard.style.display = 'none';
            if (refs.answerBlock) refs.answerBlock.style.display = 'none';
            if (refs.answerInput) refs.answerInput.value = '';
            setWordCount('');
        } else {
            if (refs.coverLayout) refs.coverLayout.style.display = 'none';
            if (refs.standardLayout) refs.standardLayout.style.display = 'block';

            if (refs.badge) refs.badge.textContent = page.id.toUpperCase();
            if (refs.title) refs.title.textContent = page.title;
            if (refs.instruction) refs.instruction.textContent = page.instruction;

            renderImages(page.images || []);

            if (refs.answerBlock) {
                if (page.answerKey) {
                    refs.answerBlock.style.display = 'block';
                    const value = state.answers[page.answerKey] || '';
                    if (refs.answerInput) refs.answerInput.value = value;
                    setWordCount(value);
                } else {
                    refs.answerBlock.style.display = 'none';
                    if (refs.answerInput) refs.answerInput.value = '';
                    setWordCount('');
                }
            }

            const hasAudio = playAudioSequence(page);

            if (hasAudio && refs.autoHint) {
                refs.autoHint.textContent = 'Đang phát audio... hệ thống sẽ chờ đúng theo mốc thời gian của từng audio.';
            }
        }

        const hasAudio = Array.isArray(page.audioUrls) && page.audioUrls.length > 0;
        if (refs.autoHint && !hasAudio) {
            refs.autoHint.textContent = page.kind === 'completion'
                ? 'Nhấn "Nộp bài" để hoàn tất.'
                : 'Trang này chờ thao tác thủ công.';
        }

        if (refs.backBtn) refs.backBtn.disabled = state.currentPage === 1;
        if (refs.nextBtn) {
            if (state.currentPage === state.totalPages) {
                refs.nextBtn.textContent = 'Nộp bài';
            } else if (coverPage) {
                refs.nextBtn.textContent = 'Bắt đầu';
            } else {
                refs.nextBtn.textContent = 'Next';
            }
            refs.nextBtn.disabled = false;
        }

        updateHeader();
    }

    function showPage(pageNumber) {
        if (state.completed) return;

        persistCurrentAnswer();

        const clamped = Math.min(Math.max(pageNumber, 1), state.totalPages);
        state.currentPage = clamped;

        const page = state.pages[state.currentPage - 1];
        renderPage(page);
    }

    function collectAnswerPayload() {
        return state.pages
            .filter(page => page.answerKey)
            .map(page => {
                const answer = state.answers[page.answerKey] || '';
                return {
                    key: page.answerKey,
                    page: page.id,
                    part: page.part,
                    prompt: page.prompt || page.instruction || '',
                    answer,
                    word_count: getWordCount(answer)
                };
            });
    }

    async function submitResult() {
        if (state.isSubmitting || state.completed) {
            return;
        }

        persistCurrentAnswer();
        state.isSubmitting = true;
        if (refs.nextBtn) {
            refs.nextBtn.disabled = true;
            refs.nextBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang nộp...';
        }

        const answers = collectAnswerPayload();
        const durationSeconds = Math.max(1, Math.round((Date.now() - state.startAt) / 1000));
        const metadata = {
            band: 'Pending',
            admin_note: null,
            speaking_answers: answers,
            speaking_page_total: state.totalPages,
            speaking_submitted_at: new Date().toISOString()
        };

        const payload = {
            practiceType: 'speaking',
            mode: 'set',
            setId: state.set?.id || null,
            setTitle: state.set?.title || null,
            totalScore: 0,
            maxScore: Number(state.set?.data?.maxScore) || 50,
            durationSeconds,
            metadata
        };

        try {
            let ok = false;
            if (typeof submitPracticeResult === 'function') {
                ok = await submitPracticeResult(payload);
            } else {
                const response = await fetch('/api/practice_results/submit', {
                    method: 'POST',
                    headers: getAuthorizedHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(payload)
                });
                ok = response.ok;
            }

            if (!ok) {
                throw new Error('Không thể nộp bài Speaking.');
            }

            state.completed = true;
            stopAudioAndTimers();
            const modalEl = refs.doneModal;
            if (modalEl && window.bootstrap) {
                new bootstrap.Modal(modalEl).show();
            } else {
                alert('Nộp bài thành công.');
                window.location.href = 'lesson_history.html';
            }
        } catch (error) {
            alert(error.message || 'Không thể nộp bài. Vui lòng thử lại.');
            if (refs.nextBtn) {
                refs.nextBtn.disabled = false;
                refs.nextBtn.textContent = 'Nộp bài';
            }
        } finally {
            state.isSubmitting = false;
        }
    }

    function bindEvents() {
        refs.backBtn?.addEventListener('click', () => {
            showPage(state.currentPage - 1);
        });

        refs.nextBtn?.addEventListener('click', () => {
            if (state.currentPage >= state.totalPages) {
                if (window.bootstrap && refs.submitModal) {
                    new bootstrap.Modal(refs.submitModal).show();
                } else {
                    submitResult();
                }
                return;
            }
            showPage(state.currentPage + 1);
        });

        refs.submitConfirmBtn?.addEventListener('click', () => {
            const modalInstance = window.bootstrap && refs.submitModal
                ? bootstrap.Modal.getInstance(refs.submitModal)
                : null;
            if (modalInstance) {
                modalInstance.hide();
            }
            submitResult();
        });

        refs.answerInput?.addEventListener('input', (event) => {
            const value = event.target.value || '';
            setWordCount(value);
            const page = state.pages[state.currentPage - 1];
            if (page?.answerKey) {
                state.answers[page.answerKey] = value;
            }
        });
    }

    async function fetchSetData() {
        if (!setId) {
            throw new Error('Thiếu tham số bộ đề Speaking.');
        }

        if (cacheKey) {
            try {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    const parsed = JSON.parse(cached);
                    if (parsed && parsed.id === setId) {
                        return parsed;
                    }
                }
            } catch (error) {
                console.warn('Không thể đọc cache speaking set:', error);
            }
        }

        const response = await fetch(`/api/practice_sets/get?id=${encodeURIComponent(setId)}`, {
            headers: getAuthorizedHeaders()
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.error || 'Không thể tải bộ đề Speaking.');
        }

        const set = data.set;
        if (cacheKey && set) {
            try {
                sessionStorage.setItem(cacheKey, JSON.stringify(set));
            } catch (error) {
                console.warn('Không thể lưu cache speaking set:', error);
            }
        }
        return set;
    }

    async function init() {
        if (!setId) {
            showError('Thiếu tham số bộ đề. Vui lòng quay lại trang danh sách.');
            return;
        }

        bindEvents();

        try {
            const set = await fetchSetData();
            if (!set) {
                throw new Error('Không tìm thấy bộ đề Speaking.');
            }

            state.set = set;
            state.normalizedData = normalizeSetData(set.data);
            state.pages = buildPages(state.normalizedData);
            state.totalPages = state.pages.length;
            state.currentPage = 1;
            state.startAt = Date.now();

            if (refs.loading) refs.loading.style.display = 'none';
            if (refs.error) refs.error.style.display = 'none';
            if (refs.content) refs.content.style.display = 'block';
            if (refs.navigator) {
                refs.navigator.style.setProperty('display', 'flex', 'important');
            }

            startCountdown(set.duration_minutes || 15);
            renderPage(state.pages[0]);
        } catch (error) {
            showError(error.message || 'Không thể tải bài Speaking.');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
