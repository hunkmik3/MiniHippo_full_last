(function () {
    const query = new URLSearchParams(window.location.search);
    const setId = query.get('set');

    const sections = [
        { id: 'part1-section', label: 'Question 1', key: 'part1' },
        { id: 'part2-section', label: 'Question 2', key: 'part2' },
        { id: 'part3-section', label: 'Question 3', key: 'part3' },
        { id: 'part4-section', label: 'Question 4', key: 'part4' }
    ];
    const CACHE_PREFIX = 'practice_set_cache_listening_';
    const cacheKey = setId ? `${CACHE_PREFIX}${setId}` : null;

    const refs = {
        loading: document.getElementById('loadingState'),
        content: document.getElementById('practiceContent'),
        countdown: document.getElementById('countdownTimer'),
        questionStep: document.getElementById('question_step'),
        backButton: document.getElementById('backButton'),
        nextButton: document.getElementById('nextButton'),
        checkButton: document.getElementById('checkResultButton'),
        submitModal: document.getElementById('submitModal'),
        resultContainer: document.getElementById('result_navigation'),
        comparisonSections: document.querySelectorAll('[id^="comparisonResult_question"]'),
        totalScore: document.getElementById('totalScore'),
        scoreClassification: document.getElementById('scoreClassification'),
        resultTitle: document.getElementById('resultTitle'),
        navButtons: document.querySelectorAll('[data-review-target]')
    };

    const checkHandlers = {};
    const audioPlayCounts = {}; // Track play counts for each audio

    const state = {
        data: null,
        currentStep: 1,
        totalSteps: 4,
        timeLeft: 35 * 60,
        timerInterval: null,
        setTitle: '',
        completed: false,
        isSubmitting: false,
        currentQuestionIndex: 0, // For Part 1 (questions 1-13)
        userAnswers: {
            part1: [], // Array of answers for questions 1-13
            part2: [], // Array of 4 answers for question 14
            part3: [], // Array of 4 answers for question 15
            part4: []  // Array of answers for questions 16-17
        }
    };
    let hasRendered = false;

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

    if (!setId) {
        if (refs.loading) {
            refs.loading.innerHTML = '<div class="alert alert-danger">Thiếu tham số bộ đề. Vui lòng quay lại trang trước.</div>';
        }
        return;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Stop all audio players
    function stopAllAudio() {
        // Stop all audio elements on the page
        document.querySelectorAll('audio').forEach(audio => {
            if (!audio.paused) {
                audio.pause();
            }
            audio.currentTime = 0; // Reset to beginning
        });

        // Reset all play icons to play state
        document.querySelectorAll('i[id*="playIcon"], i[id*="playIcon"]').forEach(playIcon => {
            playIcon.classList.remove('bi-pause-fill');
            playIcon.classList.add('bi-play-fill');
        });

        // Also reset play icons by class or parent structure
        document.querySelectorAll('.bi-pause-fill').forEach(icon => {
            if (icon.id && icon.id.includes('playIcon')) {
                icon.classList.remove('bi-pause-fill');
                icon.classList.add('bi-play-fill');
            }
        });
    }

    function startCountdown(durationMinutes) {
        state.timeLeft = (durationMinutes || 35) * 60;
        refs.countdown.textContent = formatTime(state.timeLeft);
        state.timerInterval = setInterval(() => {
            if (state.timeLeft <= 0) {
                clearInterval(state.timerInterval);
                refs.countdown.textContent = '00:00';
                return;
            }
            state.timeLeft -= 1;
            refs.countdown.textContent = formatTime(state.timeLeft);
            if (state.timeLeft <= 60) {
                refs.countdown.classList.add('text-warning');
            }
        }, 1000);
    }

    function updateQuestionStep() {
        if (!refs.questionStep) return;
        const suffix = state.setTitle ? ` · ${state.setTitle}` : '';
        refs.questionStep.textContent = `Question ${state.currentStep} of ${state.totalSteps}${suffix}`;
    }

    function showStep(step) {
        // Stop all audio when switching between parts
        stopAllAudio();
        
        state.currentStep = Math.min(Math.max(step, 1), state.totalSteps);
        sections.forEach((sectionConfig, index) => {
            const section = document.getElementById(sectionConfig.id);
            if (!section) {
                return;
            }
            section.classList.toggle('active', index + 1 === state.currentStep);
        });

        updateQuestionStep();
        if (refs.backButton) {
            refs.backButton.disabled = state.currentStep === 1;
        }
        if (refs.nextButton) {
            refs.nextButton.textContent = state.currentStep === state.totalSteps ? 'Nộp bài' : 'Next';
        }
    }

    function attachNavigation() {
        if (refs.backButton) {
            refs.backButton.addEventListener('click', () => {
                if (state.completed) {
                    return;
                }
                showStep(state.currentStep - 1);
            });
        }

        if (refs.nextButton) {
            refs.nextButton.addEventListener('click', () => {
                if (state.completed) {
                    return;
                }
                if (state.currentStep === state.totalSteps) {
                    if (!state.isSubmitting && !state.completed) {
                        const modal = new bootstrap.Modal(refs.submitModal);
                        modal.show();
                    }
                } else {
                    showStep(state.currentStep + 1);
                }
            });
        }

        if (refs.checkButton) {
            refs.checkButton.addEventListener('click', () => {
                if (state.completed) {
                    return;
                }
                if (checkHandlers[`part${state.currentStep}`]) {
                    checkHandlers[`part${state.currentStep}`]();
                }
            });
        }

        const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
        if (confirmSubmitBtn) {
            confirmSubmitBtn.addEventListener('click', () => {
                if (state.isSubmitting || state.completed) {
                    return;
                }
                state.isSubmitting = true;
                const instance = bootstrap.Modal.getInstance(refs.submitModal);
                if (instance) {
                    instance.hide();
                }
                completePractice();
            });
        }

        // Result navigation buttons
        if (refs.navButtons && refs.navButtons.length) {
            refs.navButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetId = btn.dataset.reviewTarget;
                    showComparisonSection(targetId);
                    refs.navButtons.forEach(b => b.classList.remove('btn-active'));
                    btn.classList.add('btn-active');
                });
            });
        }
    }

    function showComparisonSection(targetId) {
        if (!targetId || !refs.comparisonSections) return;
        refs.comparisonSections.forEach(section => {
            section.style.display = section.id === targetId ? 'block' : 'none';
        });
    }

    // Audio player setup with play count limit
    function setupAudioPlayer(audioId, playButtonId, playIconId, playCountLabelId, maxPlays = 2) {
        const audio = document.getElementById(audioId);
        const playBtn = document.getElementById(playButtonId);
        const playIcon = document.getElementById(playIconId);
        const playCountLabel = document.getElementById(playCountLabelId);
        
        if (!audio || !playBtn || !playIcon) return;

        // Stop audio first
        audio.pause();
        audio.currentTime = 0;
        playIcon.classList.remove('bi-pause-fill');
        playIcon.classList.add('bi-play-fill');

        if (!audioPlayCounts[audioId]) {
            audioPlayCounts[audioId] = { count: 0, maxPlays };
        }

        const updatePlayCount = () => {
            const remaining = audioPlayCounts[audioId].maxPlays - audioPlayCounts[audioId].count;
            if (playCountLabel) {
                playCountLabel.textContent = `${remaining} of ${audioPlayCounts[audioId].maxPlays} plays remaining`;
            }
            if (remaining <= 0) {
                playBtn.disabled = true;
                playBtn.style.opacity = '0.5';
            } else {
                playBtn.disabled = false;
                playBtn.style.opacity = '1';
            }
        };

        updatePlayCount();

        // Remove existing click listener if exists
        if (playBtn._clickHandler) {
            playBtn.removeEventListener('click', playBtn._clickHandler);
        }

        // Create new click handler
        playBtn._clickHandler = () => {
            if (audioPlayCounts[audioId].count >= audioPlayCounts[audioId].maxPlays) {
                return;
            }

            if (audio.paused) {
                audioPlayCounts[audioId].count += 1;
                updatePlayCount();
                audio.play().then(() => {
                    playIcon.classList.remove('bi-play-fill');
                    playIcon.classList.add('bi-pause-fill');
                }).catch(err => console.error('Audio play error:', err));
            } else {
                audio.pause();
                playIcon.classList.remove('bi-pause-fill');
                playIcon.classList.add('bi-play-fill');
            }
        };

        playBtn.addEventListener('click', playBtn._clickHandler);

        // Remove existing ended listener and add new one
        if (audio._endedHandler) {
            audio.removeEventListener('ended', audio._endedHandler);
        }
        audio._endedHandler = () => {
            playIcon.classList.remove('bi-pause-fill');
            playIcon.classList.add('bi-play-fill');
        };
        audio.addEventListener('ended', audio._endedHandler);

        // Audio range control
        const audioRange = document.getElementById(audioId.replace('Player', 'Range'));
        if (audioRange) {
            audioRange.addEventListener('input', (e) => {
                audio.volume = parseFloat(e.target.value);
            });
            audioRange.value = 1;
        }
    }

    // Part 1: Questions 1-13
    function renderPart1(part1 = {}) {
        const questions = part1.questions || [];
        if (questions.length === 0) return;

        const container = document.getElementById('part1-questions-container');
        const heading = document.getElementById('part1-heading');
        if (heading) {
            heading.textContent = `Question 1 of 4 (${questions.length} questions)`;
        }

        // Initialize user answers array
        state.userAnswers.part1 = new Array(questions.length).fill(null);
        state.currentQuestionIndex = 0;

        // Store navigation setup function
        if (questions.length > 1) {
            window.setupPart1Navigation = () => {
                const prevBtn = document.getElementById('part1-prevBtn');
                const nextBtn = document.getElementById('part1-nextBtn');
                
                if (prevBtn) {
                    prevBtn.onclick = () => {
                        if (state.currentQuestionIndex > 0) {
                            state.currentQuestionIndex--;
                            renderPart1Question(questions[state.currentQuestionIndex], state.currentQuestionIndex, questions.length);
                            updatePart1NavButtons();
                        }
                    };
                }
                
                if (nextBtn) {
                    nextBtn.onclick = () => {
                        if (state.currentQuestionIndex < questions.length - 1) {
                            state.currentQuestionIndex++;
                            renderPart1Question(questions[state.currentQuestionIndex], state.currentQuestionIndex, questions.length);
                            updatePart1NavButtons();
                        }
                    };
                }
                
                updatePart1NavButtons();
            };
        }

        // Render first question
        renderPart1Question(questions[state.currentQuestionIndex], state.currentQuestionIndex, questions.length);

        // Setup audio player
        setupAudioPlayer('part1-audioPlayer', 'part1-playButton', 'part1-playIcon', 'part1-playCountLabel');

        // Setup transcript toggle
        const showTranscriptBtn = document.getElementById('part1-showTranscriptButton');
        const transcriptBox = document.getElementById('part1-transcriptBox');
        if (showTranscriptBtn && transcriptBox) {
            showTranscriptBtn.addEventListener('click', () => {
                const isHidden = transcriptBox.style.display === 'none';
                transcriptBox.style.display = isHidden ? 'block' : 'none';
                showTranscriptBtn.textContent = isHidden ? 'Hide paragraph' : 'Show paragraph';
            });
        }

        const feedback = document.getElementById('part1-feedback');
        checkHandlers.part1 = () => {
            const correct = state.userAnswers.part1.filter((ans, idx) => 
                ans === questions[idx]?.correctAnswer
            ).length;
            feedback.textContent = `Bạn trả lời đúng ${correct}/${questions.length} câu.`;
            feedback.classList.remove('d-none');
        };
    }

    function renderPart1Question(question, index, total) {
        if (!question) return;

        // Stop audio from previous question
        const currentAudio = document.getElementById('part1-audioPlayer');
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            const playIcon = document.getElementById('part1-playIcon');
            if (playIcon) {
                playIcon.classList.remove('bi-pause-fill');
                playIcon.classList.add('bi-play-fill');
            }
        }

        const container = document.getElementById('part1-questions-container');
        const questionNum = index + 1;
        const questions = state.data?.data?.part1?.questions || [];
        
        // Create question HTML
        const questionHTML = `
            <h5 class="mb-3">Question ${questionNum} of ${total}</h5>
            <p class="mb-4"><strong id="part1-questionText">${(question.question || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong></p>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="part1-answer" id="part1-option0" value="${(question.options?.[0] || '').replace(/"/g, '&quot;')}">
                <label class="form-check-label" for="part1-option0">${(question.options?.[0] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="part1-answer" id="part1-option1" value="${(question.options?.[1] || '').replace(/"/g, '&quot;')}">
                <label class="form-check-label" for="part1-option1">${(question.options?.[1] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="part1-answer" id="part1-option2" value="${(question.options?.[2] || '').replace(/"/g, '&quot;')}">
                <label class="form-check-label" for="part1-option2">${(question.options?.[2] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</label>
            </div>
        `;
        
        // Add navigation if multiple questions
        let navHTML = '';
        if (questions.length > 1) {
            navHTML = `
                <div class="d-flex justify-content-between mt-3 part1-nav-buttons">
                    <button class="btn btn-outline-secondary" id="part1-prevBtn">
                        <i class="bi bi-chevron-left me-1"></i>Previous
                    </button>
                    <button class="btn btn-outline-primary" id="part1-nextBtn">
                        Next<i class="bi bi-chevron-right ms-1"></i>
                    </button>
                </div>
            `;
        }
        
        container.innerHTML = questionHTML + navHTML;
        
        // Setup navigation if exists
        if (questions.length > 1 && window.setupPart1Navigation) {
            window.setupPart1Navigation();
        }

        // Set audio source and setup player
        const audio = document.getElementById('part1-audioPlayer');
        if (audio) {
            // Stop and reset audio first
            audio.pause();
            audio.currentTime = 0;
            
            if (question.audioUrl) {
                // Use audioUrl as-is (should be GitHub raw URL from admin)
                audio.src = question.audioUrl;
            }
            
            // Setup audio player again for new question
            setupAudioPlayer('part1-audioPlayer', 'part1-playButton', 'part1-playIcon', 'part1-playCountLabel');
        }

        // Set transcript
        const transcriptContent = document.getElementById('part1-transcriptContent');
        if (transcriptContent) {
            transcriptContent.textContent = question.transcript || '';
        }

        // Restore saved answer
        const savedAnswer = state.userAnswers.part1[index];
        if (savedAnswer) {
            const radio = container.querySelector(`input[value="${savedAnswer}"]`);
            if (radio) radio.checked = true;
        }

        // Store answer on change
        container.querySelectorAll('input[name="part1-answer"]').forEach(radio => {
            radio.addEventListener('change', () => {
                state.userAnswers.part1[index] = radio.value;
            });
        });

        // Reset play count for new question
        if (audioPlayCounts['part1-audioPlayer']) {
            audioPlayCounts['part1-audioPlayer'].count = 0;
        }
        
        // Update play count label and button state
        const playCountLabel = document.getElementById('part1-playCountLabel');
        if (playCountLabel) {
            playCountLabel.textContent = `2 of 2 plays remaining`;
        }
        const playBtn = document.getElementById('part1-playButton');
        if (playBtn) {
            playBtn.disabled = false;
            playBtn.style.opacity = '1';
        }
    }

    function updatePart1NavButtons() {
        const questions = state.data?.data?.part1?.questions || [];
        const prevBtn = document.getElementById('part1-prevBtn');
        const nextBtn = document.getElementById('part1-nextBtn');
        if (prevBtn) prevBtn.disabled = state.currentQuestionIndex === 0;
        if (nextBtn) nextBtn.disabled = state.currentQuestionIndex === questions.length - 1;
    }

    // Part 2: Question 14
    function renderPart2(part2 = {}) {
        if (!part2.topic) return;

        const topicEl = document.getElementById('part2-topic');
        if (topicEl) {
            topicEl.textContent = part2.topic;
        }

        const container = document.getElementById('part2-matching-container');
        container.innerHTML = '';

        const options = part2.options || [];
        const correctAnswers = part2.correctAnswers || [];

        // Create 4 person selects
        for (let i = 0; i < 4; i++) {
            const row = document.createElement('div');
            row.className = 'd-flex align-items-center mb-3 gap-3';
            row.innerHTML = `
                <label for="part2-person${i + 1}" class="form-label mb-0" style="width: 80px;">Person ${i + 1}</label>
                <select id="part2-person${i + 1}" class="form-select part2-select" style="border: 1px solid #cccc99;">
                    <option value="">-- Select an answer --</option>
                    ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                </select>
            `;
            container.appendChild(row);

            // Restore saved answer
            const select = row.querySelector('select');
            if (state.userAnswers.part2[i]) {
                select.value = state.userAnswers.part2[i];
            }

            // Store answer on change
            select.addEventListener('change', () => {
                state.userAnswers.part2[i] = select.value;
            });
        }

        // Set audio
        const audio = document.getElementById('part2-audioPlayer');
        if (audio && part2.audioUrl) {
            audio.src = part2.audioUrl;
        }

        // Set transcript
        const transcriptContent = document.getElementById('part2-transcriptContent');
        if (transcriptContent) {
            transcriptContent.textContent = part2.transcript || '';
        }

        setupAudioPlayer('part2-audioPlayer', 'part2-playButton', 'part2-playIcon', 'part2-playCountLabel');

        const showTranscriptBtn = document.getElementById('part2-showTranscriptButton');
        const transcriptBox = document.getElementById('part2-transcriptBox');
        if (showTranscriptBtn && transcriptBox) {
            showTranscriptBtn.addEventListener('click', () => {
                const isHidden = transcriptBox.style.display === 'none';
                transcriptBox.style.display = isHidden ? 'block' : 'none';
                showTranscriptBtn.textContent = isHidden ? 'Hide Paragraph' : 'Show Paragraph';
            });
        }

        const feedback = document.getElementById('part2-feedback');
        checkHandlers.part2 = () => {
            const correct = state.userAnswers.part2.filter((ans, idx) => 
                ans === correctAnswers[idx]
            ).length;
            feedback.textContent = `Bạn trả lời đúng ${correct}/4 câu.`;
            feedback.classList.remove('d-none');
        };
    }

    // Part 3: Question 15
    function renderPart3(part3 = {}) {
        if (!part3.topic) return;

        const topicEl = document.getElementById('part3-topic');
        if (topicEl) {
            topicEl.textContent = part3.topic;
        }

        const container = document.getElementById('part3-opinions-container');
        container.innerHTML = '';

        const questions = part3.questions || [];
        const correctAnswers = part3.correctAnswers || [];

        questions.forEach((question, index) => {
            const row = document.createElement('div');
            row.className = 'd-flex align-items-center mb-3 gap-3';
            row.innerHTML = `
                <label for="part3-opinion${index + 1}" class="form-label mb-0" style="min-width: 200px;">${question}</label>
                <select id="part3-opinion${index + 1}" class="form-select part3-select" style="border: 1px solid #cccc99; max-width: 250px;">
                    <option value="">-- Select an answer --</option>
                    <option value="Man">Man</option>
                    <option value="Woman">Woman</option>
                    <option value="Both">Both</option>
                </select>
            `;
            container.appendChild(row);

            const select = row.querySelector('select');
            if (state.userAnswers.part3[index]) {
                select.value = state.userAnswers.part3[index];
            }

            select.addEventListener('change', () => {
                state.userAnswers.part3[index] = select.value;
            });
        });

        // Set audio
        const audio = document.getElementById('part3-audioPlayer');
        if (audio && part3.audioUrl) {
            audio.src = part3.audioUrl;
        }

        // Set transcript
        const transcriptContent = document.getElementById('part3-transcriptContent');
        if (transcriptContent) {
            transcriptContent.textContent = part3.transcript || '';
        }

        setupAudioPlayer('part3-audioPlayer', 'part3-playButton', 'part3-playIcon', 'part3-playCountLabel');

        const showTranscriptBtn = document.getElementById('part3-showTranscriptButton');
        const transcriptBox = document.getElementById('part3-transcriptBox');
        if (showTranscriptBtn && transcriptBox) {
            showTranscriptBtn.addEventListener('click', () => {
                const isHidden = transcriptBox.style.display === 'none';
                transcriptBox.style.display = isHidden ? 'block' : 'none';
                showTranscriptBtn.textContent = isHidden ? 'Hide Paragraph' : 'Show Paragraph';
            });
        }

        const feedback = document.getElementById('part3-feedback');
        checkHandlers.part3 = () => {
            const correct = state.userAnswers.part3.filter((ans, idx) => 
                ans === correctAnswers[idx]
            ).length;
            feedback.textContent = `Bạn trả lời đúng ${correct}/${questions.length} câu.`;
            feedback.classList.remove('d-none');
        };
    }

    // Part 4: Questions 16-17
    function renderPart4(part4 = {}) {
        const questions = part4.questions || [];
        if (questions.length === 0) return;

        const container = document.getElementById('part4-questions-container');
        container.innerHTML = '';

        questions.forEach((question, qIndex) => {
            const questionNum = 16 + qIndex;
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question-container mb-4';
            
            // Audio player bar
            const audioId = `part4-audio${questionNum}`;
            const playButtonId = `part4-playButton${questionNum}`;
            const playIconId = `part4-playIcon${questionNum}`;
            const playCountLabelId = `part4-playCountLabel${questionNum}`;
            
            questionDiv.innerHTML = `
                <h5 class="mb-3"><strong>Question ${questionNum}</strong></h5>
                <h6 class="mb-3"><strong id="part4-topic${questionNum}">${question.topic || ''}</strong></h6>
                
                <div class="top-bar d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center gap-3">
                        <button id="${playButtonId}" class="btn btn-link text-white p-0">
                            <i id="${playIconId}" class="bi bi-play-fill fs-4"></i>
                        </button>
                        <button class="btn btn-link text-white p-0">
                            <i class="bi bi-volume-up-fill fs-5"></i>
                        </button>
                        <input type="range" class="form-range" id="part4-audioRange${questionNum}" style="width: 200px;">
                    </div>
                    <div>
                        <small id="${playCountLabelId}">2 of 2 plays remaining</small>
                    </div>
                    <audio id="${audioId}" preload="none"></audio>
                </div>
                
                <div class="part4-subquestions${questionNum}"></div>
                
                <div class="mt-3">
                    <button id="part4-showTranscript${questionNum}" class="btn btn-primary">Show Paragraph</button>
                </div>
                
                <div id="part4-transcriptBox${questionNum}" class="card mt-3" style="display: none;">
                    <div class="card-body">
                        <p><strong>Paragraph:</strong></p>
                        <p id="part4-transcriptContent${questionNum}"></p>
                    </div>
                </div>
            `;
            
            container.appendChild(questionDiv);

            // Render sub-questions
            const subQuestionsContainer = questionDiv.querySelector(`.part4-subquestions${questionNum}`);
            question.questions?.forEach((subQ, subIndex) => {
                const subQDiv = document.createElement('div');
                subQDiv.className = 'mb-4';
                subQDiv.innerHTML = `
                    <label class="form-label mb-2 fw-bold">${subQ.id || `${questionNum}.${subIndex + 1}`} ${subQ.question || ''}</label>
                    <div class="form-check">
                        <input class="form-check-input part4-radio" type="radio" name="part4-q${questionNum}-sub${subIndex}" id="part4-q${questionNum}-sub${subIndex}-A" value="A">
                        <label class="form-check-label" for="part4-q${questionNum}-sub${subIndex}-A">${subQ.options?.[0] || ''}</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input part4-radio" type="radio" name="part4-q${questionNum}-sub${subIndex}" id="part4-q${questionNum}-sub${subIndex}-B" value="B">
                        <label class="form-check-label" for="part4-q${questionNum}-sub${subIndex}-B">${subQ.options?.[1] || ''}</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input part4-radio" type="radio" name="part4-q${questionNum}-sub${subIndex}" id="part4-q${questionNum}-sub${subIndex}-C" value="C">
                        <label class="form-check-label" for="part4-q${questionNum}-sub${subIndex}-C">${subQ.options?.[2] || ''}</label>
                    </div>
                `;
                subQuestionsContainer.appendChild(subQDiv);

                // Store answer
                const answerKey = `${questionNum}-${subIndex}`;
                subQDiv.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.addEventListener('change', () => {
                        if (!state.userAnswers.part4[qIndex]) {
                            state.userAnswers.part4[qIndex] = {};
                        }
                        state.userAnswers.part4[qIndex][subIndex] = radio.value;
                    });
                });

                // Restore saved answer
                if (state.userAnswers.part4[qIndex] && state.userAnswers.part4[qIndex][subIndex]) {
                    const savedValue = state.userAnswers.part4[qIndex][subIndex];
                    const radio = subQDiv.querySelector(`input[value="${savedValue}"]`);
                    if (radio) radio.checked = true;
                }
            });

            // Set audio
            const audio = document.getElementById(audioId);
            if (audio && question.audioUrl) {
                audio.src = question.audioUrl;
            }

            // Set transcript
            const transcriptContent = document.getElementById(`part4-transcriptContent${questionNum}`);
            if (transcriptContent) {
                transcriptContent.textContent = question.transcript || '';
            }

            // Setup audio player
            setupAudioPlayer(audioId, playButtonId, playIconId, playCountLabelId);

            // Setup transcript toggle
            const showTranscriptBtn = document.getElementById(`part4-showTranscript${questionNum}`);
            const transcriptBox = document.getElementById(`part4-transcriptBox${questionNum}`);
            if (showTranscriptBtn && transcriptBox) {
                showTranscriptBtn.addEventListener('click', () => {
                    const isHidden = transcriptBox.style.display === 'none';
                    transcriptBox.style.display = isHidden ? 'block' : 'none';
                    showTranscriptBtn.textContent = isHidden ? 'Hide Paragraph' : 'Show Paragraph';
                });
            }
        });

        const feedback = document.getElementById('part4-feedback');
        checkHandlers.part4 = () => {
            let totalCorrect = 0;
            let totalQuestions = 0;
            questions.forEach((q, qIndex) => {
                q.questions?.forEach((subQ, subIndex) => {
                    totalQuestions++;
                    const userAnswer = state.userAnswers.part4[qIndex]?.[subIndex];
                    if (userAnswer === subQ.correctAnswer) {
                        totalCorrect++;
                    }
                });
            });
            feedback.textContent = `Bạn trả lời đúng ${totalCorrect}/${totalQuestions} câu.`;
            feedback.classList.remove('d-none');
        };
    }

    // Evaluation functions
    function evaluatePart1(part1 = {}) {
        const questions = part1.questions || [];
        let score = 0;
        const rows = questions.map((question, index) => {
            const userAnswer = state.userAnswers.part1[index] || '(không chọn)';
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) {
                score += 2; // Each question worth 2 points
            }
            return {
                question: index + 1,
                user: userAnswer,
                correct: question.correctAnswer || '',
                isCorrect
            };
        });
        return { score, total: questions.length * 2, rows };
    }

    function evaluatePart2(part2 = {}) {
        const correctAnswers = part2.correctAnswers || [];
        let score = 0;
        const rows = correctAnswers.map((correct, index) => {
            const userAnswer = state.userAnswers.part2[index] || '(không chọn)';
            const isCorrect = userAnswer === correct;
            if (isCorrect) {
                score += 1;
            }
            return {
                person: `Person ${index + 1}`,
                user: userAnswer,
                correct: correct || '',
                isCorrect
            };
        });
        return { score, total: correctAnswers.length, rows };
    }

    function evaluatePart3(part3 = {}) {
        const questions = part3.questions || [];
        const correctAnswers = part3.correctAnswers || [];
        let score = 0;
        const rows = questions.map((question, index) => {
            const userAnswer = state.userAnswers.part3[index] || '(không chọn)';
            const isCorrect = userAnswer === correctAnswers[index];
            if (isCorrect) {
                score += 1;
            }
            return {
                question: question,
                user: userAnswer,
                correct: correctAnswers[index] || '',
                isCorrect
            };
        });
        return { score, total: questions.length, rows };
    }

    function evaluatePart4(part4 = {}) {
        const questions = part4.questions || [];
        let score = 0;
        const rows = [];
        questions.forEach((question, qIndex) => {
            question.questions?.forEach((subQ, subIndex) => {
                const userAnswer = state.userAnswers.part4[qIndex]?.[subIndex] || '(không chọn)';
                const isCorrect = userAnswer === subQ.correctAnswer;
                if (isCorrect) {
                    score += 1;
                }
                rows.push({
                    question: subQ.id || `${16 + qIndex}.${subIndex + 1}`,
                    user: userAnswer,
                    correct: subQ.correctAnswer || '',
                    isCorrect
                });
            });
        });
        return { score, total: rows.length, rows };
    }

    // Render comparison results
    function renderPart1Comparison(result) {
        const body = document.getElementById('comparisonBody_question1');
        const totalEl = document.getElementById('totalScore_question1');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach(row => {
            const tr = document.createElement('tr');
            const qTd = document.createElement('td');
            qTd.textContent = row.question;
            const userTd = document.createElement('td');
            userTd.innerHTML = `<span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span>`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `<span class="correct">${row.correct}</span>`;
            tr.appendChild(qTd);
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total}</strong>`;
    }

    function renderPart2Comparison(result) {
        const body = document.getElementById('comparisonBody_question14');
        const totalEl = document.getElementById('totalScore_question14');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach(row => {
            const tr = document.createElement('tr');
            const personTd = document.createElement('td');
            personTd.textContent = row.person;
            const userTd = document.createElement('td');
            userTd.innerHTML = `<span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span>`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `<span class="correct">${row.correct}</span>`;
            tr.appendChild(personTd);
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total}</strong>`;
    }

    function renderPart3Comparison(result) {
        const body = document.getElementById('comparisonBody_question15');
        const totalEl = document.getElementById('totalScore_question15');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach(row => {
            const tr = document.createElement('tr');
            const qTd = document.createElement('td');
            qTd.textContent = row.question;
            const userTd = document.createElement('td');
            userTd.innerHTML = `<span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span>`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `<span class="correct">${row.correct}</span>`;
            tr.appendChild(qTd);
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total}</strong>`;
    }

    function renderPart4Comparison(result) {
        const body = document.getElementById('comparisonBody_question16');
        const totalEl = document.getElementById('totalScore_question16');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach(row => {
            const tr = document.createElement('tr');
            const qTd = document.createElement('td');
            qTd.textContent = row.question;
            const userTd = document.createElement('td');
            userTd.innerHTML = `<span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span>`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `<span class="correct">${row.correct}</span>`;
            tr.appendChild(qTd);
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total}</strong>`;
    }

    function completePractice() {
        const data = state.data?.data || {};
        const part1Result = evaluatePart1(data.part1);
        const part2Result = evaluatePart2(data.part2);
        const part3Result = evaluatePart3(data.part3);
        const part4Result = evaluatePart4(data.part4);

        renderPart1Comparison(part1Result);
        renderPart2Comparison(part2Result);
        renderPart3Comparison(part3Result);
        renderPart4Comparison(part4Result);

        const totalScore = part1Result.score + part2Result.score + part3Result.score + part4Result.score;
        const totalPossible = part1Result.total + part2Result.total + part3Result.total + part4Result.total;
        const durationSeconds = Math.max(
            0,
            (state.data?.duration_minutes || 35) * 60 - (state.timeLeft || 0)
        );

        if (refs.totalScore) {
            refs.totalScore.textContent = `Total Score: ${totalScore} / ${totalPossible}`;
        }
        if (refs.scoreClassification) {
            const percentage = (totalScore / totalPossible) * 100;
            let grade = 'F';
            if (percentage >= 90) grade = 'A';
            else if (percentage >= 80) grade = 'B';
            else if (percentage >= 70) grade = 'C';
            else if (percentage >= 60) grade = 'D';
            refs.scoreClassification.textContent = `Your grade: ${grade}`;
        }

        refs.content.style.display = 'none';
        refs.resultContainer.style.display = 'block';
        if (refs.backButton) {
            refs.backButton.style.display = 'none';
        }
        if (refs.checkButton) {
            refs.checkButton.style.display = 'none';
        }
        if (refs.nextButton) {
            refs.nextButton.textContent = 'The end';
            refs.nextButton.onclick = () => {
                // Khi đã hoàn thành bài và bấm "The end" -> quay về trang chọn bộ đề Listening
                window.location.href = 'listening_bode.html';
            };
        }
        state.completed = true;

        if (typeof submitPracticeResult === 'function') {
            submitPracticeResult({
                practiceType: 'listening',
                mode: 'set',
                setId: state.data?.id || setId,
                setTitle: state.setTitle,
                totalScore,
                maxScore: totalPossible,
                durationSeconds,
                partScores: {
                    part1: { score: part1Result.score, total: part1Result.total },
                    part2: { score: part2Result.score, total: part2Result.total },
                    part3: { score: part3Result.score, total: part3Result.total },
                    part4: { score: part4Result.score, total: part4Result.total }
                },
                metadata: {
                    source: 'listening_bode_set'
                }
            });
        }

        showComparisonSection('comparisonResult_question1');
        if (refs.navButtons && refs.navButtons.length) {
            refs.navButtons.forEach((btn, index) => {
                btn.classList.toggle('btn-active', index === 0);
            });
        }
    }

    function cachePracticeSet(set) {
        if (!cacheKey || !set) {
            return;
        }
        try {
            sessionStorage.setItem(cacheKey, JSON.stringify(set));
        } catch (error) {
            console.warn('Không thể lưu cache bộ đề nghe:', error);
        }
    }

    function getCachedPracticeSet() {
        if (!cacheKey) {
            return null;
        }
        try {
            const cached = sessionStorage.getItem(cacheKey);
            if (!cached) {
                return null;
            }
            const parsed = JSON.parse(cached);
            if (!parsed || !parsed.data) {
                sessionStorage.removeItem(cacheKey);
                return null;
            }
            return parsed;
        } catch (error) {
            console.warn('Không thể đọc cache bộ đề nghe:', error);
            sessionStorage.removeItem(cacheKey);
            return null;
        }
    }

    function renderPractice(set) {
        hasRendered = true;
        if (refs.loading) {
            refs.loading.style.display = 'none';
        }
        refs.content.style.display = 'block';
        state.setTitle = set.title || '';
        document.title = `${set.title || 'Bộ đề Listening'} - Mini Hippo`;
        if (refs.resultTitle) {
            refs.resultTitle.textContent = state.setTitle ? `Test and Answer Review · ${state.setTitle}` : 'Test and Answer Review';
        }

        renderPart1(set.data?.part1);
        renderPart2(set.data?.part2);
        renderPart3(set.data?.part3);
        renderPart4(set.data?.part4);

        startCountdown(set.duration_minutes);
        attachNavigation();
        showStep(1);
    }

    async function loadPracticeSet(options = {}) {
        try {
            const response = await fetch(`/api/practice_sets/get?id=${setId}`, {
                headers: getAuthorizedHeaders()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không tìm thấy bộ đề');
            }
            state.data = result.set;
            cachePracticeSet(result.set);
            if (!options.skipRenderIfLoaded || !hasRendered) {
                renderPractice(result.set);
            }
        } catch (error) {
            console.error(error);
            if (refs.loading) {
                refs.loading.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            }
        }
    }

    document.addEventListener('DOMContentLoaded', async () => {
        if (typeof requireAuth === 'function') {
            const ok = await requireAuth();
            if (!ok) {
                return;
            }
        }
        const cachedSet = getCachedPracticeSet();
        if (cachedSet) {
            state.data = cachedSet;
            renderPractice(cachedSet);
        }
        loadPracticeSet({ skipRenderIfLoaded: Boolean(cachedSet) });
    });
})();

