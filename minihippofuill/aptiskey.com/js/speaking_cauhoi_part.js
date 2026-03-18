(function () {
    var query = new URLSearchParams(window.location.search);
    var setId = query.get('set');
    var CACHE_PREFIX = 'speaking_cauhoi_cache_';
    var cacheKey = setId ? CACHE_PREFIX + setId : null;

    var PART_LABELS = { 1: 'Part 1 - Câu hỏi cá nhân', 2: 'Part 2 - Mô tả ảnh', 3: 'Part 3 - So sánh ảnh', 4: 'Part 4 - Trình bày quan điểm' };
    var PART_TIMERS = { 1: 30, 2: 45, 3: 60, 4: 120 };

    var practiceState = {
        pages: [],
        partNum: 0,
        currentPage: 0,
        totalPages: 0,
        timerInterval: null,
        timerRemaining: 0,
        answers: {}
    };

    // ─── Utilities ──────────────────────────────────────────────────
    function safeText(v) { return typeof v === 'string' ? v.trim() : ''; }
    function normalizeUrl(url) {
        var v = safeText(url); if (!v) return '';
        if (/^https?:\/\//i.test(v)) return v;
        return v.startsWith('/') ? v : '/' + v;
    }
    function firstVal(obj, keys, fb) {
        if (!obj || typeof obj !== 'object') return fb || '';
        for (var i = 0; i < keys.length; i++) { var v = obj[keys[i]]; if (v !== undefined && v !== null && String(v).trim() !== '') return v; }
        return fb || '';
    }

    function getAuthorizedHeaders(extra) {
        var h = Object.assign({}, extra || {});
        var t = typeof getAuthToken === 'function' ? getAuthToken() : null;
        if (t) h.Authorization = 'Bearer ' + t;
        if (typeof buildDeviceHeaders === 'function') return buildDeviceHeaders(h);
        if (typeof getDeviceId === 'function') h['X-Device-Id'] = getDeviceId();
        if (typeof getDeviceName === 'function') h['X-Device-Name'] = getDeviceName();
        return h;
    }

    function showError(msg) {
        var el = document.getElementById('loadingState'); if (el) el.style.display = 'none';
        var c = document.getElementById('practiceContent'); if (c) c.style.display = 'none';
        var e = document.getElementById('errorState'); if (e) { e.style.display = 'block'; e.textContent = msg; }
    }

    // ─── Countdown timer (header) ───────────────────────────────────
    function formatTime(s) {
        var m = Math.floor(s / 60);
        var sec = s % 60;
        return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function clearTimer() {
        if (practiceState.timerInterval) {
            clearInterval(practiceState.timerInterval);
            practiceState.timerInterval = null;
        }
    }

    function updateCountdownDisplay(seconds) {
        var el = document.getElementById('countdownTimer');
        if (el) el.textContent = formatTime(seconds);
    }

    function startTimer(seconds, onComplete) {
        clearTimer();
        practiceState.timerRemaining = seconds;
        updateCountdownDisplay(seconds);

        var hint = document.getElementById('autoAdvanceHint');
        if (hint) hint.textContent = 'Thời gian trả lời: ' + seconds + 's';

        var statusLabel = document.getElementById('audioStatusLabel');
        if (statusLabel) statusLabel.textContent = 'Đang chờ trả lời... ' + seconds + 's';

        practiceState.timerInterval = setInterval(function () {
            practiceState.timerRemaining--;
            updateCountdownDisplay(practiceState.timerRemaining);

            if (statusLabel) statusLabel.textContent = 'Đang chờ trả lời... ' + practiceState.timerRemaining + 's';

            if (practiceState.timerRemaining <= 0) {
                clearTimer();
                if (statusLabel) statusLabel.textContent = '';
                if (typeof onComplete === 'function') onComplete();
            }
        }, 1000);
    }

    // ─── Audio tracking with timer between each ─────────────────────
    function setupAudioTracking(audioElements, partNum, onAllDone) {
        var timerDuration = PART_TIMERS[partNum] || 30;

        if (!audioElements.length) {
            startTimer(timerDuration, onAllDone);
            return;
        }

        var progressLabel = document.getElementById('audioProgressLabel');

        function updateProgressLabel(idx) {
            if (progressLabel) {
                progressLabel.textContent = 'Audio ' + (idx + 1) + ' / ' + audioElements.length;
            }
        }

        function playAudioAtIndex(idx) {
            if (idx >= audioElements.length) {
                startTimer(timerDuration, onAllDone);
                return;
            }

            updateProgressLabel(idx);
            var audio = audioElements[idx];

            var statusLabel = document.getElementById('audioStatusLabel');
            if (statusLabel) statusLabel.textContent = 'Đang phát audio ' + (idx + 1) + '...';

            try { audio.play().catch(function () { }); } catch (e) { }

            audio.addEventListener('ended', function onEnded() {
                audio.removeEventListener('ended', onEnded);

                if (idx < audioElements.length - 1) {
                    startTimer(timerDuration, function () {
                        playAudioAtIndex(idx + 1);
                    });
                } else {
                    startTimer(timerDuration, onAllDone);
                }
            });
        }

        playAudioAtIndex(0);
    }

    // ─── Page dots (header) ─────────────────────────────────────────
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

    // ─── Navigation ─────────────────────────────────────────────────
    function updateNav() {
        var backBtn = document.getElementById('backButton');
        var nextBtn = document.getElementById('nextButton');
        var isFirst = practiceState.currentPage === 0;
        var isLast = practiceState.currentPage >= practiceState.totalPages - 1;

        if (backBtn) backBtn.style.display = isFirst ? 'none' : '';
        if (nextBtn) {
            if (isLast) {
                nextBtn.textContent = 'Nộp bài';
                nextBtn.className = 'btn btn-next';
            } else {
                nextBtn.innerHTML = 'Next<i class="bi bi-arrow-right ms-1"></i>';
                nextBtn.className = 'btn btn-next';
            }
        }
    }

    function saveCurrentAnswers() {
        var textareas = document.querySelectorAll('#answerBlock textarea[data-key]');
        textareas.forEach(function (ta) {
            practiceState.answers[ta.dataset.key] = ta.value;
        });
    }

    function goToPage(index) {
        if (index < 0 || index >= practiceState.totalPages) return;
        saveCurrentAnswers();
        clearTimer();
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

    // ─── Create answer block ────────────────────────────────────────
    function createAnswerBlock(key) {
        var wrap = document.createElement('div');
        wrap.className = 'mt-3';

        var label = document.createElement('label');
        label.className = 'form-label fw-semibold';
        label.textContent = 'Câu trả lời của bạn';
        label.setAttribute('for', 'answer-' + key);

        var ta = document.createElement('textarea');
        ta.className = 'form-control answer-box';
        ta.id = 'answer-' + key;
        ta.dataset.key = key;
        ta.placeholder = 'Nhập câu trả lời / transcript bạn nói...';
        if (practiceState.answers[key]) ta.value = practiceState.answers[key];

        var footer = document.createElement('div');
        footer.className = 'd-flex justify-content-between align-items-center mt-2';

        var hint = document.createElement('span');
        hint.className = 'small text-muted';
        hint.textContent = 'Bạn có thể quay lại trang trước để chỉnh sửa câu trả lời.';

        var badge = document.createElement('span');
        badge.className = 'badge bg-light text-dark';
        badge.textContent = '0 từ';

        var updateWc = function () {
            var wc = ta.value.trim().split(/\s+/).filter(Boolean).length;
            badge.textContent = wc + ' từ';
        };
        ta.addEventListener('input', function () {
            practiceState.answers[key] = ta.value;
            updateWc();
        });
        updateWc();

        footer.appendChild(hint);
        footer.appendChild(badge);
        wrap.appendChild(label);
        wrap.appendChild(ta);
        wrap.appendChild(footer);
        return wrap;
    }

    // ─── Render current page ────────────────────────────────────────
    function renderCurrentPage() {
        var pageIndex = practiceState.currentPage;
        var data = practiceState.pages[pageIndex] || {};
        var partNum = practiceState.partNum;

        // Update header
        var stepLabel = document.getElementById('question_step');
        if (stepLabel) stepLabel.textContent = PART_LABELS[partNum] || 'Speaking Practice';

        var pageBadge = document.getElementById('pageBadge');
        if (pageBadge) pageBadge.textContent = 'Trang ' + (pageIndex + 1) + ' / ' + practiceState.totalPages;

        var hintEl = document.getElementById('autoAdvanceHint');
        if (hintEl) hintEl.textContent = 'Audio sẽ tự phát, vui lòng lắng nghe.';

        // Title & instruction
        var pageTitle = document.getElementById('pageTitle');
        var pageInstruction = document.getElementById('pageInstruction');

        if (pageTitle) pageTitle.textContent = PART_LABELS[partNum] || '';

        var introText = safeText(firstVal(data, ['introText', 'instruction'], ''));
        if (pageInstruction) {
            pageInstruction.textContent = introText;
            pageInstruction.style.display = introText ? '' : 'none';
        }

        // ── Images ──
        var imagesEl = document.getElementById('pageImages');
        if (imagesEl) {
            imagesEl.innerHTML = '';
            var imageUrls = [];

            if (partNum === 2) {
                var imgUrl = normalizeUrl(firstVal(data, ['imageUrl', 'image'], ''));
                if (imgUrl) imageUrls.push(imgUrl);
            }
            if (partNum === 3) {
                var merged = normalizeUrl(firstVal(data, ['imageUrl', 'image', 'mergedImageUrl'], ''));
                if (merged) {
                    imageUrls.push(merged);
                } else {
                    var left = normalizeUrl(firstVal(data, ['leftImageUrl', 'imageLeft', 'image1'], ''));
                    var right = normalizeUrl(firstVal(data, ['rightImageUrl', 'imageRight', 'image2'], ''));
                    if (left) imageUrls.push(left);
                    if (right) imageUrls.push(right);
                }
            }
            if (partNum === 4) {
                var prep = data.prepPage && typeof data.prepPage === 'object' ? data.prepPage : {};
                var prepImg = normalizeUrl(firstVal(prep, ['imageUrl', 'image'], ''));
                if (prepImg) imageUrls.push(prepImg);
                var fin = data.finalPage && typeof data.finalPage === 'object' ? data.finalPage : {};
                var finImg = normalizeUrl(firstVal(fin, ['imageUrl', 'image'], ''));
                if (finImg) imageUrls.push(finImg);
            }

            var colClass = imageUrls.length === 1 ? 'col-12' : 'col-12 col-md-6';
            imageUrls.forEach(function (src) {
                var col = document.createElement('div'); col.className = colClass;
                var img = document.createElement('img');
                img.className = 'page-image'; img.src = src; img.alt = 'Speaking visual';
                col.appendChild(img); imagesEl.appendChild(col);
            });
        }

        // ── Audio ──
        var audioCard = document.getElementById('audioCard');
        var audioContainer = document.getElementById('audioContainer');
        var audioProgressLabel = document.getElementById('audioProgressLabel');
        var audioStatusLabel = document.getElementById('audioStatusLabel');

        if (audioContainer) audioContainer.innerHTML = '';
        if (audioProgressLabel) audioProgressLabel.textContent = '';
        if (audioStatusLabel) audioStatusLabel.textContent = '';

        var audioUrls = [];

        // Intro audio
        var introAudio = normalizeUrl(firstVal(data, ['introAudioUrl', 'audioUrl', 'introAudio'], ''));
        if (introAudio) audioUrls.push(introAudio);

        // Question audios (Part 1, 2, 3)
        if (partNum >= 1 && partNum <= 3) {
            var questions = Array.isArray(data.questions) ? data.questions : [];
            questions.forEach(function (q) {
                var au = normalizeUrl(firstVal(q, ['audioUrl', 'audio', 'audio_url'], ''));
                if (au) audioUrls.push(au);
            });
        }

        // Part 4 audios
        if (partNum === 4) {
            var prep4 = data.prepPage && typeof data.prepPage === 'object' ? data.prepPage : {};
            var qAu = normalizeUrl(firstVal(prep4, ['questionAudioUrl', 'audioQuestion'], ''));
            var pAu = normalizeUrl(firstVal(prep4, ['prepAudioUrl', 'audioPrep'], ''));
            if (qAu) audioUrls.push(qAu);
            if (pAu) audioUrls.push(pAu);
            var fin4 = data.finalPage && typeof data.finalPage === 'object' ? data.finalPage : {};
            var fAu = normalizeUrl(firstVal(fin4, ['audioUrl', 'audio'], ''));
            if (fAu) audioUrls.push(fAu);
        }

        var audioElements = [];
        if (audioUrls.length && audioContainer) {
            audioCard.style.display = '';
            audioUrls.forEach(function (url, i) {
                var audio = document.createElement('audio');
                audio.controls = true; audio.preload = 'none'; audio.className = 'w-100 mb-2'; audio.src = url;
                audioContainer.appendChild(audio);
                audioElements.push(audio);
            });
        } else if (audioCard) {
            audioCard.style.display = 'none';
        }

        // ── Answer blocks ──
        var answerBlock = document.getElementById('answerBlock');
        if (answerBlock) {
            answerBlock.innerHTML = '';

            if (partNum >= 1 && partNum <= 3) {
                var questions2 = Array.isArray(data.questions) ? data.questions : [];
                questions2.forEach(function (q, idx) {
                    var qWrap = document.createElement('div');
                    qWrap.className = 'mb-3';

                    var prompt = safeText(firstVal(q, ['prompt', 'question', 'text'], ''));
                    if (prompt) {
                        var pEl = document.createElement('p');
                        pEl.className = 'fw-semibold mb-1';
                        pEl.textContent = 'Câu hỏi ' + (idx + 1) + ': ' + prompt;
                        qWrap.appendChild(pEl);
                    }

                    var key = 'page' + (pageIndex + 1) + '_q' + (idx + 1);
                    qWrap.appendChild(createAnswerBlock(key));
                    answerBlock.appendChild(qWrap);
                });
            }

            if (partNum === 4) {
                var prep4b = data.prepPage && typeof data.prepPage === 'object' ? data.prepPage : {};
                var fin4b = data.finalPage && typeof data.finalPage === 'object' ? data.finalPage : {};

                var prepInstr = safeText(firstVal(prep4b, ['instruction', 'prompt'], ''));
                if (prepInstr) {
                    var pEl2 = document.createElement('p');
                    pEl2.className = 'fw-semibold mb-1';
                    pEl2.textContent = 'Phần chuẩn bị: ' + prepInstr;
                    answerBlock.appendChild(pEl2);
                }
                answerBlock.appendChild(createAnswerBlock('page' + (pageIndex + 1) + '_q1'));

                var finalPrompt = safeText(firstVal(fin4b, ['prompt', 'question', 'instruction'], ''));
                if (finalPrompt) {
                    var pEl3 = document.createElement('p');
                    pEl3.className = 'fw-semibold mb-1 mt-4';
                    pEl3.textContent = 'Câu hỏi cuối: ' + finalPrompt;
                    answerBlock.appendChild(pEl3);
                }
                answerBlock.appendChild(createAnswerBlock('page' + (pageIndex + 1) + '_q2'));
            }
        }

        // Add fade animation to card
        var card = document.querySelector('.speaking-card');
        if (card) {
            card.classList.remove('page-fade');
            void card.offsetWidth; // force reflow
            card.classList.add('page-fade');
        }

        // ── Setup audio chain with timer ──
        var isLast = pageIndex >= practiceState.totalPages - 1;
        setupAudioTracking(audioElements, partNum, function () {
            if (!isLast) {
                goNext();
            }
        });
    }

    // ─── Collect all answers ────────────────────────────────────────
    function collectAllAnswers() {
        saveCurrentAnswers();
        var answers = [];
        Object.keys(practiceState.answers).forEach(function (key) {
            var val = practiceState.answers[key] || '';
            answers.push({
                key: key,
                answer: val,
                word_count: val.trim().split(/\s+/).filter(Boolean).length
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
            durationSeconds: Math.max(1, Math.round((Date.now() - window._startAt) / 1000)),
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
                var resp = await fetch('/api/practice_results/submit', {
                    method: 'POST',
                    headers: getAuthorizedHeaders({ 'Content-Type': 'application/json' }),
                    body: JSON.stringify(payload)
                });
                ok = resp.ok;
            }
            if (!ok) throw new Error('Không thể nộp bài.');

            var doneModal = document.getElementById('doneModal');
            if (doneModal && window.bootstrap) { new bootstrap.Modal(doneModal).show(); }
            else { alert('Nộp bài thành công.'); window.location.href = 'speaking_cauhoi.html'; }
        } catch (e) {
            alert(e.message || 'Không thể nộp bài.');
        }
    }

    // ─── Fetch data ─────────────────────────────────────────────────
    async function fetchSetData() {
        if (!setId) throw new Error('Thiếu tham số.');
        if (cacheKey) {
            try { var c = sessionStorage.getItem(cacheKey); if (c) { var p = JSON.parse(c); if (p && p.id === setId) return p; } } catch (e) { }
        }
        var resp = await fetch('/api/practice_sets/get?id=' + encodeURIComponent(setId), { headers: getAuthorizedHeaders() });
        var d = await resp.json().catch(function () { return {}; });
        if (!resp.ok) throw new Error(d.error || 'Không thể tải dữ liệu.');
        var s = d.set;
        if (cacheKey && s) { try { sessionStorage.setItem(cacheKey, JSON.stringify(s)); } catch (e) { } }
        return s;
    }

    // ─── Init ───────────────────────────────────────────────────────
    async function init() {
        if (!setId) { showError('Thiếu tham số. Vui lòng quay lại danh sách.'); return; }

        try {
            var set = await fetchSetData();
            if (!set) throw new Error('Không tìm thấy dữ liệu.');

            var partNum = Number(set.data && set.data.part) || 0;
            if (partNum < 1 || partNum > 4) throw new Error('Part không hợp lệ.');

            window._startAt = Date.now();

            var headerTitle = document.getElementById('question_step');
            if (headerTitle) headerTitle.textContent = (set.title || '') + ' - ' + (PART_LABELS[partNum] || '');

            var partData = set.data || {};
            var pages = Array.isArray(partData.pages) ? partData.pages : [];
            if (!pages.length) pages = [partData];

            practiceState.pages = pages;
            practiceState.partNum = partNum;
            practiceState.totalPages = pages.length;
            practiceState.currentPage = 0;

            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('practiceContent').style.display = '';
            document.getElementById('navigator').style.display = '';

            updatePageDots();
            updateNav();
            renderCurrentPage();

            // Navigation events
            document.getElementById('backButton').addEventListener('click', function () {
                goToPage(practiceState.currentPage - 1);
            });

            document.getElementById('nextButton').addEventListener('click', function () {
                var isLast = practiceState.currentPage >= practiceState.totalPages - 1;
                if (isLast) {
                    // Show submit modal
                    var modal = document.getElementById('submitModal');
                    if (modal && window.bootstrap) {
                        new bootstrap.Modal(modal).show();
                    } else {
                        submitResult(set, partNum);
                    }
                } else {
                    goToPage(practiceState.currentPage + 1);
                }
            });

            // Confirm submit button in modal
            var confirmBtn = document.getElementById('confirmSubmitBtn');
            if (confirmBtn) {
                confirmBtn.addEventListener('click', function () {
                    var modal = bootstrap.Modal.getInstance(document.getElementById('submitModal'));
                    if (modal) modal.hide();
                    submitResult(set, partNum);
                });
            }

        } catch (e) {
            showError(e.message || 'Không thể tải bài Speaking.');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
