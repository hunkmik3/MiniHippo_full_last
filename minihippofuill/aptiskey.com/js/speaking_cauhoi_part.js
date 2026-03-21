(function () {
    var query = new URLSearchParams(window.location.search);
    var setId = query.get('set');
    var CACHE_PREFIX = 'speaking_cauhoi_cache_';
    var cacheKey = setId ? CACHE_PREFIX + setId : null;

    var PART_LABELS = {
        1: 'Part 1 - Câu hỏi cá nhân',
        2: 'Part 2 - Mô tả ảnh',
        3: 'Part 3 - So sánh ảnh',
        4: 'Part 4 - Trình bày quan điểm'
    };
    var RESPONSE_TIMERS = { 1: 30, 2: 45, 3: 45 };
    var INTRO_AUDIO_WAIT_SECONDS = { 1: 5, 2: 45, 3: 45, 4: 5 };
    var PART4_AUDIO_WAIT_SECONDS = { intro: 5, question: 5, prep: 60, final: 120 };
    var PART4_RESPONSE_TIMERS = { prep: 60, final: 120 };

    var practiceState = {
        pages: [],
        partNum: 0,
        currentPage: 0,
        totalPages: 0,
        timerInterval: null,
        timerRemaining: 0,
        answers: {},
        setTitle: '',
        headerTitle: '',
        startAt: Date.now(),
        currentAudioElements: []
    };

    function safeText(value) {
        return typeof value === 'string' ? value.trim() : '';
    }

    function normalizeUrl(url) {
        var value = safeText(url);
        if (!value) return '';
        if (/^https?:\/\//i.test(value)) return value;
        return value.startsWith('/') ? value : '/' + value;
    }

    function firstVal(obj, keys, fallback) {
        if (!obj || typeof obj !== 'object') return fallback || '';
        for (var i = 0; i < keys.length; i++) {
            var value = obj[keys[i]];
            if (value !== undefined && value !== null && String(value).trim() !== '') {
                return value;
            }
        }
        return fallback || '';
    }

    function getWordCount(value) {
        return safeText(value).split(/\s+/).filter(Boolean).length;
    }

    function getAuthorizedHeaders(extra) {
        var headers = Object.assign({}, extra || {});
        var token = typeof getAuthToken === 'function' ? getAuthToken() : null;
        if (token) headers.Authorization = 'Bearer ' + token;
        if (typeof buildDeviceHeaders === 'function') return buildDeviceHeaders(headers);
        if (typeof getDeviceId === 'function') headers['X-Device-Id'] = getDeviceId();
        if (typeof getDeviceName === 'function') headers['X-Device-Name'] = getDeviceName();
        return headers;
    }

    function showError(message) {
        var loading = document.getElementById('loadingState');
        var content = document.getElementById('practiceContent');
        var navigator = document.getElementById('navigator');
        var error = document.getElementById('errorState');

        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'none';
        if (navigator) navigator.style.display = 'none';
        if (error) {
            error.style.display = 'block';
            error.textContent = message;
        }
    }

    function formatTime(seconds) {
        var mins = Math.floor(seconds / 60);
        var secs = seconds % 60;
        return String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
    }

    function clearTimer() {
        if (practiceState.timerInterval) {
            clearInterval(practiceState.timerInterval);
            practiceState.timerInterval = null;
        }
    }

    function updateCountdownDisplay(seconds) {
        var countdown = document.getElementById('countdownTimer');
        if (!countdown) return;

        if (seconds === null || seconds === undefined || Number.isNaN(Number(seconds))) {
            countdown.textContent = '--:--';
            return;
        }

        countdown.textContent = formatTime(Math.max(0, Number(seconds) || 0));
    }

    function stopCurrentAudios() {
        practiceState.currentAudioElements.forEach(function (audio) {
            try {
                audio.pause();
                audio.currentTime = 0;
            } catch (e) { }
        });
        practiceState.currentAudioElements = [];
    }

    function startResponseTimer(seconds, onComplete, options) {
        clearTimer();
        practiceState.timerRemaining = Math.max(0, Number(seconds) || 0);
        var hintEl = document.getElementById('autoAdvanceHint');
        var statusLabel = document.getElementById('audioStatusLabel');
        var config = options && typeof options === 'object' ? options : {};
        var hintPrefix = safeText(config.hintPrefix) || 'Thời gian trả lời';
        var statusPrefix = safeText(config.statusPrefix) || 'Đang tính thời gian trả lời...';

        if (practiceState.timerRemaining <= 0) {
            updateCountdownDisplay(null);
            if (statusLabel) statusLabel.textContent = '';
            if (typeof onComplete === 'function') onComplete();
            return;
        }

        updateCountdownDisplay(practiceState.timerRemaining);

        if (hintEl) {
            hintEl.textContent = hintPrefix + ': ' + practiceState.timerRemaining + ' giây';
        }

        if (statusLabel) {
            statusLabel.textContent = statusPrefix + ' ' + practiceState.timerRemaining + 's';
        }

        practiceState.timerInterval = setInterval(function () {
            practiceState.timerRemaining -= 1;
            updateCountdownDisplay(practiceState.timerRemaining);

            if (hintEl) hintEl.textContent = hintPrefix + ': ' + practiceState.timerRemaining + ' giây';
            if (statusLabel) statusLabel.textContent = statusPrefix + ' ' + practiceState.timerRemaining + 's';

            if (practiceState.timerRemaining <= 0) {
                clearTimer();
                if (statusLabel) statusLabel.textContent = '';
                if (typeof onComplete === 'function') onComplete();
            }
        }, 1000);
    }

    function getTimerOptions(page, hasNextAudio) {
        if (hasNextAudio) {
            return {
                hintPrefix: 'Thời gian chờ',
                statusPrefix: 'Đang đếm thời gian chờ...'
            };
        }

        if (page && page.kind === 'intro') {
            return {
                hintPrefix: 'Thời gian chờ',
                statusPrefix: 'Đang đếm thời gian chờ...'
            };
        }

        if (page && page.kind === 'prep') {
            return {
                hintPrefix: 'Thời gian chuẩn bị',
                statusPrefix: 'Đang tính thời gian chuẩn bị...'
            };
        }

        return {
            hintPrefix: 'Thời gian trả lời',
            statusPrefix: 'Đang tính thời gian trả lời...'
        };
    }

    function playAudiosSequentially(page, audioElements, onComplete) {
        practiceState.currentAudioElements = audioElements.slice();
        var waitPlan = Array.isArray(page.audioWaitSeconds) ? page.audioWaitSeconds : [];
        var fallbackSeconds = Math.max(0, Number(page.responseSeconds) || 0);

        if (!audioElements.length) {
            startResponseTimer(fallbackSeconds, onComplete, getTimerOptions(page, false));
            return;
        }

        var progressLabel = document.getElementById('audioProgressLabel');
        var statusLabel = document.getElementById('audioStatusLabel');

        function updateProgress(index) {
            if (progressLabel) {
                progressLabel.textContent = 'Audio ' + (index + 1) + ' / ' + audioElements.length;
            }
        }

        function playAt(index) {
            if (index >= audioElements.length) {
                if (statusLabel) statusLabel.textContent = '';
                return;
            }

            var audio = audioElements[index];
            updateProgress(index);
            if (statusLabel) statusLabel.textContent = 'Đang phát audio ' + (index + 1) + '...';

            audio.addEventListener('ended', function handleEnded() {
                audio.removeEventListener('ended', handleEnded);
                var hasNextAudio = index + 1 < audioElements.length;
                var waitSeconds = Math.max(0, Number(waitPlan[index]) || 0);
                var timerOptions = getTimerOptions(page, hasNextAudio);
                var continueFlow = function () {
                    if (hasNextAudio) {
                        playAt(index + 1);
                    } else if (typeof onComplete === 'function') {
                        onComplete();
                    }
                };

                if (waitSeconds > 0) {
                    startResponseTimer(waitSeconds, continueFlow, timerOptions);
                    return;
                }

                if (!hasNextAudio && fallbackSeconds > 0) {
                    startResponseTimer(fallbackSeconds, continueFlow, timerOptions);
                    return;
                }

                continueFlow();
            });

            try {
                audio.play().catch(function () {
                    if (statusLabel) statusLabel.textContent = 'Nhấn Play để nghe audio rồi tiếp tục làm bài.';
                });
            } catch (e) {
                if (statusLabel) statusLabel.textContent = 'Không thể tự phát audio. Vui lòng nhấn Play.';
            }
        }

        playAt(0);
    }

    function updatePageDots() {
        var container = document.getElementById('pageDots');
        if (!container) return;

        container.innerHTML = '';
        for (var i = 0; i < practiceState.totalPages; i++) {
            var dot = document.createElement('div');
            dot.className = 'page-dot';
            if (i < practiceState.currentPage) dot.className += ' done';
            if (i === practiceState.currentPage) dot.className += ' active';
            container.appendChild(dot);
        }
    }

    function updateNav() {
        var backBtn = document.getElementById('backButton');
        var nextBtn = document.getElementById('nextButton');
        var isFirst = practiceState.currentPage === 0;
        var isLast = practiceState.currentPage >= practiceState.totalPages - 1;

        if (backBtn) {
            backBtn.style.display = '';
            backBtn.innerHTML = '<i class="bi bi-arrow-left me-1"></i>Quay lại';
            backBtn.dataset.firstPage = isFirst ? 'true' : 'false';
        }

        if (nextBtn) {
            if (isLast) {
                nextBtn.textContent = 'Nộp bài';
            } else {
                nextBtn.innerHTML = 'Tiếp theo<i class="bi bi-arrow-right ms-1"></i>';
            }
        }
    }

    function saveCurrentAnswers() {
        var inputs = document.querySelectorAll('#answerBlock textarea[data-key]');
        inputs.forEach(function (input) {
            practiceState.answers[input.dataset.key] = input.value;
        });
    }

    function goToPage(index) {
        if (index < 0 || index >= practiceState.totalPages) return;

        saveCurrentAnswers();
        clearTimer();
        stopCurrentAudios();
        practiceState.currentPage = index;

        renderCurrentPage();
        updatePageDots();
        updateNav();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goNext() {
        if (practiceState.currentPage < practiceState.totalPages - 1) {
            goToPage(practiceState.currentPage + 1);
        }
    }

    function createAnswerBlock(item, order) {
        var wrap = document.createElement('div');
        wrap.className = 'mt-3';

        var prompt = safeText(item.prompt);
        var displayOrder = safeText(item.displayOrder) || String(order);
        if (prompt) {
            var promptEl = document.createElement('p');
            promptEl.className = 'fw-semibold mb-2';
            promptEl.textContent = 'Câu hỏi ' + displayOrder + ': ' + prompt;
            wrap.appendChild(promptEl);
        }

        var label = document.createElement('label');
        label.className = 'form-label fw-semibold';
        label.textContent = 'Câu trả lời của bạn';
        label.setAttribute('for', 'answer-' + item.key);
        wrap.appendChild(label);

        var textarea = document.createElement('textarea');
        textarea.className = 'form-control answer-box';
        textarea.id = 'answer-' + item.key;
        textarea.dataset.key = item.key;
        textarea.placeholder = 'Nhập câu trả lời hoặc transcript bạn nói...';
        textarea.value = practiceState.answers[item.key] || '';
        wrap.appendChild(textarea);

        var footer = document.createElement('div');
        footer.className = 'd-flex justify-content-between align-items-center mt-2';

        var hint = document.createElement('span');
        hint.className = 'small text-muted';
        hint.textContent = 'Bạn có thể quay lại để chỉnh sửa trước khi nộp bài.';

        var badge = document.createElement('span');
        badge.className = 'badge bg-light text-dark';
        badge.textContent = getWordCount(textarea.value) + ' từ';

        textarea.addEventListener('input', function () {
            practiceState.answers[item.key] = textarea.value;
            badge.textContent = getWordCount(textarea.value) + ' từ';
        });

        footer.appendChild(hint);
        footer.appendChild(badge);
        wrap.appendChild(footer);

        return wrap;
    }

    function createInfoBlock(message) {
        var info = document.createElement('div');
        info.className = 'alert alert-info mb-0';
        info.textContent = message;
        return info;
    }

    function normalizeQuestion(rawQuestion, fallbackPrompt) {
        var question = rawQuestion && typeof rawQuestion === 'object' ? rawQuestion : {};
        return {
            sourceIndex: Number(firstVal(question, ['sourceIndex'], 0)) || 0,
            prompt: safeText(firstVal(question, ['prompt', 'question', 'text'], fallbackPrompt || '')),
            audioUrl: normalizeUrl(firstVal(question, ['audioUrl', 'audio', 'audio_url'], ''))
        };
    }

    function hasQuestionContent(question) {
        return Boolean(safeText(question.prompt) || safeText(question.audioUrl));
    }

    function getPartImages(partNum, pageData) {
        var images = [];
        if (partNum === 2) {
            var imageUrl = normalizeUrl(firstVal(pageData, ['imageUrl', 'image'], ''));
            if (imageUrl) images.push(imageUrl);
        }

        if (partNum === 3) {
            var merged = normalizeUrl(firstVal(pageData, ['imageUrl', 'image', 'mergedImageUrl'], ''));
            if (merged) {
                images.push(merged);
            } else {
                var left = normalizeUrl(firstVal(pageData, ['leftImageUrl', 'imageLeft', 'image1'], ''));
                var right = normalizeUrl(firstVal(pageData, ['rightImageUrl', 'imageRight', 'image2'], ''));
                if (left) images.push(left);
                if (right) images.push(right);
            }
        }

        return images;
    }

    function getIntroImages(partNum, pageData) {
        var images = [];
        var introImageUrl = normalizeUrl(firstVal(pageData, ['introImageUrl', 'introImage'], ''));
        if (introImageUrl) images.push(introImageUrl);

        var introLeftImageUrl = normalizeUrl(firstVal(pageData, ['introLeftImageUrl', 'introImageLeft'], ''));
        var introRightImageUrl = normalizeUrl(firstVal(pageData, ['introRightImageUrl', 'introImageRight'], ''));
        if (introLeftImageUrl) images.push(introLeftImageUrl);
        if (introRightImageUrl) images.push(introRightImageUrl);

        if (images.length) {
            return images;
        }

        if (partNum === 2 || partNum === 3) {
            return getPartImages(partNum, pageData);
        }

        return [];
    }

    function buildRuntimePages(partNum, rawData) {
        var pages = [];
        var data = rawData && typeof rawData === 'object' ? rawData : {};
        var rawPages = Array.isArray(data.pages) && data.pages.length ? data.pages : [data];
        var questionCounter = 0;

        rawPages.forEach(function (pageData, pageIndex) {
            var introText = safeText(firstVal(pageData, ['introText', 'instruction'], ''));
            var introAudioUrl = normalizeUrl(firstVal(pageData, ['introAudioUrl', 'audioUrl', 'introAudio'], ''));
            var introImages = getIntroImages(partNum, pageData);
            var introSuffix = rawPages.length > 1 ? ' ' + String(pageIndex + 1) : '';
            var hasIntroContent = Boolean(introText || introAudioUrl || introImages.length);

            if (hasIntroContent) {
                var introWaitSeconds = Number(INTRO_AUDIO_WAIT_SECONDS[partNum]) || 0;
                pages.push({
                    id: 'part' + partNum + '_page' + (pageIndex + 1) + '_intro',
                    kind: 'intro',
                    part: partNum,
                    title: 'Part ' + partNum + ' - Giới thiệu' + introSuffix,
                    instruction: introText || 'Lắng nghe hướng dẫn trước khi bắt đầu câu hỏi.',
                    images: introImages.slice(),
                    audioUrls: introAudioUrl ? [introAudioUrl] : [],
                    audioWaitSeconds: introAudioUrl ? [introWaitSeconds] : [],
                    responseSeconds: introAudioUrl ? introWaitSeconds : 0,
                    autoAdvance: Boolean(introAudioUrl),
                    answerItems: []
                });
            }

            if (partNum >= 1 && partNum <= 3) {
                var rawQuestions = Array.isArray(pageData.questions) ? pageData.questions : [];
                var normalizedQuestions = rawQuestions.map(function (question, index) {
                    var normalized = normalizeQuestion(question, 'Câu hỏi ' + (index + 1));
                    normalized.sourceIndex = index + 1;
                    return normalized;
                });
                var questionsWithContent = normalizedQuestions.filter(hasQuestionContent);
                var finalQuestions = questionsWithContent.length ? questionsWithContent : normalizedQuestions.slice(0, 1);

                finalQuestions.forEach(function (question, questionIndex) {
                    questionCounter += 1;
                    var displayOrder = String(pageIndex + 1) + '.' + String(question.sourceIndex);
                    var answerSeconds = Number(RESPONSE_TIMERS[partNum]) || 30;

                    var audioUrls = [];
                    if (question.audioUrl) audioUrls.push(question.audioUrl);

                    pages.push({
                        id: 'part' + partNum + '_page' + (pageIndex + 1) + '_q' + question.sourceIndex,
                        kind: 'question',
                        part: partNum,
                        title: 'Part ' + partNum + ' - Câu hỏi ' + displayOrder,
                        instruction: question.audioUrl
                            ? 'Lắng nghe audio câu hỏi và trả lời.'
                            : 'Đọc câu hỏi và nhập câu trả lời của bạn.',
                        images: [],
                        audioUrls: audioUrls,
                        audioWaitSeconds: question.audioUrl ? [answerSeconds] : [],
                        responseSeconds: answerSeconds,
                        autoAdvance: true,
                        answerItems: [{
                            key: 'part' + partNum + '_page' + (pageIndex + 1) + '_q' + question.sourceIndex,
                            displayOrder: displayOrder,
                            prompt: question.prompt || ('Câu hỏi ' + displayOrder)
                        }]
                    });
                });
            }

            if (partNum === 4) {
                var prep = pageData.prepPage && typeof pageData.prepPage === 'object' ? pageData.prepPage : {};
                var finalPage = pageData.finalPage && typeof pageData.finalPage === 'object' ? pageData.finalPage : {};

                var prepInstruction = safeText(firstVal(prep, ['instruction', 'prompt'], ''));
                var prepImage = normalizeUrl(firstVal(prep, ['imageUrl', 'image'], ''));
                var prepQuestionAudio = normalizeUrl(firstVal(prep, ['questionAudioUrl', 'audioQuestion'], ''));
                var prepAudio = normalizeUrl(firstVal(prep, ['prepAudioUrl', 'audioPrep'], ''));

                var finalPrompt = safeText(firstVal(finalPage, ['prompt', 'question', 'instruction'], ''));
                var finalImage = normalizeUrl(firstVal(finalPage, ['imageUrl', 'image'], ''));
                var finalAudio = normalizeUrl(firstVal(finalPage, ['audioUrl', 'audio'], ''));
                var prepAudioUrls = [];
                var prepAudioWaitSeconds = [];

                if (prepQuestionAudio) {
                    prepAudioUrls.push(prepQuestionAudio);
                    prepAudioWaitSeconds.push(PART4_AUDIO_WAIT_SECONDS.question);
                }

                if (prepAudio) {
                    prepAudioUrls.push(prepAudio);
                    prepAudioWaitSeconds.push(PART4_AUDIO_WAIT_SECONDS.prep);
                }

                var hasPrepContent = Boolean(prepInstruction || prepImage || prepQuestionAudio || prepAudio);
                var hasFinalContent = Boolean(finalPrompt || finalImage || finalAudio);

                if (hasPrepContent) {
                    pages.push({
                        id: 'part4_page' + (pageIndex + 1) + '_prep',
                        kind: 'prep',
                        part: 4,
                        title: 'Part 4 - Chuẩn bị',
                        instruction: prepInstruction || 'Nghe hướng dẫn và chuẩn bị câu trả lời.',
                        images: prepImage ? [prepImage] : [],
                        audioUrls: prepAudioUrls,
                        audioWaitSeconds: prepAudioWaitSeconds,
                        responseSeconds: prepAudio
                            ? PART4_AUDIO_WAIT_SECONDS.prep
                            : (prepQuestionAudio ? PART4_AUDIO_WAIT_SECONDS.question : PART4_RESPONSE_TIMERS.prep),
                        autoAdvance: hasFinalContent,
                        answerItems: []
                    });
                }

                if (hasFinalContent || !hasPrepContent) {
                    questionCounter += 1;
                    pages.push({
                        id: 'part4_page' + (pageIndex + 1) + '_final',
                        kind: 'final',
                        part: 4,
                        title: 'Part 4 - Câu hỏi ' + questionCounter,
                        instruction: 'Nghe câu hỏi và trình bày quan điểm của bạn.',
                        images: finalImage ? [finalImage] : [],
                        audioUrls: finalAudio ? [finalAudio] : [],
                        audioWaitSeconds: finalAudio ? [PART4_AUDIO_WAIT_SECONDS.final] : [],
                        responseSeconds: PART4_RESPONSE_TIMERS.final,
                        autoAdvance: false,
                        answerItems: [{
                            key: 'part4_page' + (pageIndex + 1) + '_final',
                            displayOrder: questionCounter,
                            prompt: finalPrompt || 'Hãy trình bày câu trả lời của bạn.'
                        }]
                    });
                }
            }
        });

        return pages;
    }

    function renderCurrentPage() {
        var page = practiceState.pages[practiceState.currentPage] || {};
        var pageTitle = document.getElementById('pageTitle');
        var pageInstruction = document.getElementById('pageInstruction');
        var pageBadge = document.getElementById('pageBadge');
        var stepLabel = document.getElementById('question_step');
        var imagesEl = document.getElementById('pageImages');
        var audioCard = document.getElementById('audioCard');
        var audioContainer = document.getElementById('audioContainer');
        var audioProgressLabel = document.getElementById('audioProgressLabel');
        var audioStatusLabel = document.getElementById('audioStatusLabel');
        var answerBlock = document.getElementById('answerBlock');
        var hintEl = document.getElementById('autoAdvanceHint');
        var hasPageAudio = Array.isArray(page.audioUrls) && page.audioUrls.filter(Boolean).length > 0;

        if (stepLabel) stepLabel.textContent = practiceState.headerTitle || PART_LABELS[practiceState.partNum] || 'Speaking Practice';
        if (pageBadge) pageBadge.textContent = 'Trang ' + (practiceState.currentPage + 1) + ' / ' + practiceState.totalPages;
        if (pageTitle) pageTitle.textContent = page.title || PART_LABELS[practiceState.partNum] || 'Speaking Practice';

        if (pageInstruction) {
            pageInstruction.textContent = page.instruction || '';
            pageInstruction.style.display = page.instruction ? '' : 'none';
        }

        if (hintEl) {
            if (page.kind === 'intro') {
                hintEl.textContent = hasPageAudio
                    ? 'Hệ thống sẽ tự chuyển sang trang câu hỏi sau khi audio giới thiệu phát xong.'
                    : 'Nhấn "Tiếp theo" để sang trang câu hỏi.';
            } else if (page.kind === 'prep') {
                hintEl.textContent = page.autoAdvance
                    ? 'Hệ thống sẽ tự chuyển sang câu tiếp theo sau khi hết thời gian chuẩn bị.'
                    : 'Nhấn "Tiếp theo" để sang câu hỏi cuối.';
            } else if (hasPageAudio) {
                hintEl.textContent = 'Đang phát audio... hệ thống sẽ chờ đúng theo mốc thời gian của từng audio.';
            } else if (page.autoAdvance) {
                hintEl.textContent = 'Hệ thống sẽ tự chuyển sang câu tiếp theo sau khi hết thời gian.';
            } else {
                hintEl.textContent = 'Hoàn thành xong bạn có thể bấm Nộp bài.';
            }
        }

        if (imagesEl) {
            imagesEl.innerHTML = '';
            var imageUrls = Array.isArray(page.images) ? page.images : [];
            var colClass = imageUrls.length === 1 ? 'col-12' : 'col-12 col-md-6';

            imageUrls.forEach(function (src) {
                var col = document.createElement('div');
                col.className = colClass;

                var image = document.createElement('img');
                image.className = 'page-image';
                image.src = src;
                image.alt = 'Speaking visual';

                col.appendChild(image);
                imagesEl.appendChild(col);
            });
        }

        if (audioContainer) audioContainer.innerHTML = '';
        if (audioProgressLabel) audioProgressLabel.textContent = '';
        if (audioStatusLabel) audioStatusLabel.textContent = '';
        updateCountdownDisplay(hasPageAudio ? null : (Number(page.responseSeconds) > 0 ? page.responseSeconds : null));

        var audioUrls = Array.isArray(page.audioUrls) ? page.audioUrls.filter(Boolean) : [];
        var audioElements = [];

        if (audioUrls.length && audioCard && audioContainer) {
            audioCard.style.display = '';
            audioUrls.forEach(function (url) {
                var audio = document.createElement('audio');
                audio.controls = true;
                audio.preload = 'none';
                audio.className = 'w-100 mb-2';
                audio.src = url;
                audioContainer.appendChild(audio);
                audioElements.push(audio);
            });
        } else if (audioCard) {
            audioCard.style.display = 'none';
        }

        if (answerBlock) {
            answerBlock.innerHTML = '';

            if (Array.isArray(page.answerItems) && page.answerItems.length) {
                page.answerItems.forEach(function (item, index) {
                    answerBlock.appendChild(createAnswerBlock(item, index + 1));
                });
            } else {
                answerBlock.appendChild(createInfoBlock(
                    page.kind === 'intro'
                        ? 'Trang này chỉ hiển thị phần giới thiệu. Sau đó bạn sẽ sang trang câu hỏi riêng.'
                        : 'Trang này dùng để nghe hướng dẫn và chuẩn bị. Hệ thống sẽ tự chuyển khi hết thời gian.'
                ));
            }
        }

        var card = document.querySelector('.speaking-card');
        if (card) {
            card.classList.remove('page-fade');
            void card.offsetWidth;
            card.classList.add('page-fade');
        }

        playAudiosSequentially(page, audioElements, function () {
            if (page.autoAdvance && practiceState.currentPage < practiceState.totalPages - 1) {
                goNext();
            }
        });
    }

    function collectAllAnswers() {
        var answers = [];
        saveCurrentAnswers();

        practiceState.pages.forEach(function (page) {
            var items = Array.isArray(page.answerItems) ? page.answerItems : [];
            items.forEach(function (item) {
                var answerText = practiceState.answers[item.key] || '';
                answers.push({
                    key: item.key,
                    page: page.title || item.key,
                    prompt: item.prompt || '',
                    answer: answerText,
                    word_count: getWordCount(answerText)
                });
            });
        });

        return answers;
    }

    async function submitResult(set, partNum) {
        var answers = collectAllAnswers();
        var payload = {
            practiceType: 'speaking',
            mode: 'part',
            setId: set.id || null,
            setTitle: (set.title || '') + ' - ' + (PART_LABELS[partNum] || 'Part ' + partNum),
            totalScore: 0,
            maxScore: 50,
            durationSeconds: Math.max(1, Math.round((Date.now() - practiceState.startAt) / 1000)),
            metadata: {
                band: 'Pending',
                admin_note: null,
                speaking_answers: answers,
                speaking_part: partNum,
                speaking_mode: 'part',
                speaking_page_count: practiceState.totalPages,
                speaking_submitted_at: new Date().toISOString()
            }
        };

        try {
            var ok = false;
            if (typeof submitPracticeResult === 'function') {
                ok = await submitPracticeResult(payload);
            } else {
                var response = await fetch('/api/practice_results/submit', {
                    method: 'POST',
                    headers: getAuthorizedHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(payload)
                });
                ok = response.ok;
            }

            if (!ok) throw new Error('Không thể nộp bài.');

            var doneModal = document.getElementById('doneModal');
            if (doneModal && window.bootstrap) {
                new bootstrap.Modal(doneModal).show();
            } else {
                alert('Nộp bài thành công.');
                window.location.href = 'speaking_cauhoi.html';
            }
        } catch (error) {
            alert(error.message || 'Không thể nộp bài.');
        }
    }

    async function fetchSetData() {
        if (!setId) throw new Error('Thiếu tham số.');

        if (cacheKey) {
            try {
                var cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    var parsed = JSON.parse(cached);
                    if (parsed && parsed.id === setId) return parsed;
                }
            } catch (e) { }
        }

        var response = await fetch('/api/practice_sets/get?id=' + encodeURIComponent(setId), {
            headers: getAuthorizedHeaders()
        });
        var data = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(data.error || 'Không thể tải dữ liệu.');

        var set = data.set;
        if (cacheKey && set) {
            try { sessionStorage.setItem(cacheKey, JSON.stringify(set)); } catch (e) { }
        }

        return set;
    }

    async function init() {
        if (!setId) {
            showError('Thiếu tham số. Vui lòng quay lại danh sách.');
            return;
        }

        try {
            var set = await fetchSetData();
            if (!set) throw new Error('Không tìm thấy dữ liệu.');

            var partNum = Number(set.data && set.data.part) || 0;
            if (partNum < 1 || partNum > 4) throw new Error('Part không hợp lệ.');

            var runtimePages = buildRuntimePages(partNum, set.data || {});
            if (!runtimePages.length) throw new Error('Bài Speaking này chưa có câu hỏi để hiển thị.');

            practiceState.pages = runtimePages;
            practiceState.partNum = partNum;
            practiceState.totalPages = runtimePages.length;
            practiceState.currentPage = 0;
            practiceState.setTitle = set.title || 'Speaking Practice';
            practiceState.headerTitle = PART_LABELS[partNum] || 'Speaking Practice';
            practiceState.startAt = Date.now();

            var loading = document.getElementById('loadingState');
            var content = document.getElementById('practiceContent');
            var navigator = document.getElementById('navigator');

            if (loading) loading.style.display = 'none';
            if (content) content.style.display = '';
            if (navigator) navigator.style.display = '';

            updatePageDots();
            updateNav();
            renderCurrentPage();

            var backButton = document.getElementById('backButton');
            if (backButton) {
                backButton.addEventListener('click', function () {
                    if (practiceState.currentPage === 0) {
                        saveCurrentAnswers();
                        window.location.href = 'speaking_cauhoi.html';
                        return;
                    }
                    goToPage(practiceState.currentPage - 1);
                });
            }

            var nextButton = document.getElementById('nextButton');
            if (nextButton) {
                nextButton.addEventListener('click', function () {
                    var isLast = practiceState.currentPage >= practiceState.totalPages - 1;
                    if (isLast) {
                        var submitModal = document.getElementById('submitModal');
                        if (submitModal && window.bootstrap) {
                            new bootstrap.Modal(submitModal).show();
                        } else {
                            submitResult(set, partNum);
                        }
                    } else {
                        goToPage(practiceState.currentPage + 1);
                    }
                });
            }

            var confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
            if (confirmSubmitBtn) {
                confirmSubmitBtn.addEventListener('click', function () {
                    var submitModal = document.getElementById('submitModal');
                    var modalInstance = submitModal && window.bootstrap
                        ? bootstrap.Modal.getInstance(submitModal)
                        : null;
                    if (modalInstance) modalInstance.hide();
                    submitResult(set, partNum);
                });
            }
        } catch (error) {
            showError(error.message || 'Không thể tải bài Speaking.');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
