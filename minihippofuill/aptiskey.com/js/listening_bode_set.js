(function () {
    const query = new URLSearchParams(window.location.search);
    const setId = query.get('set');

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
        navButtons: document.querySelectorAll('[data-review-target]'),
        questionHeading: document.getElementById('question-heading'),
        questionContainer: document.getElementById('question-container'),
        audioPlayerBar: document.getElementById('audio-player-bar'),
        transcriptButtonContainer: document.getElementById('transcript-button-container'),
        transcriptBox: document.getElementById('question-transcriptBox'),
        transcriptContent: document.getElementById('question-transcriptContent'),
        showTranscriptButton: document.getElementById('question-showTranscriptButton'),
        audioPlayer: document.getElementById('question-audioPlayer'),
        playButton: document.getElementById('question-playButton'),
        playIcon: document.getElementById('question-playIcon'),
        playCountLabel: document.getElementById('question-playCountLabel')
    };

    const checkHandlers = {};
    const audioPlayCounts = {}; // Track play counts for each audio

    // Flattened questions array
    let flattenedQuestions = [];
    let questionTypeMap = {}; // Map question index to original part info

    const state = {
        data: null,
        currentQuestionIndex: 0,
        totalQuestions: 0,
        timeLeft: 35 * 60,
        timerInterval: null,
        setTitle: '',
        completed: false,
        userAnswers: {} // Will store answers by question index
    };

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
        refs.questionStep.textContent = `Question ${state.currentQuestionIndex + 1} / ${state.totalQuestions}${suffix}`;
    }

    function showQuestion(index) {
        // Stop all audio when switching questions
        stopAllAudio();
        
        state.currentQuestionIndex = Math.min(Math.max(index, 0), state.totalQuestions - 1);
        
        const question = flattenedQuestions[state.currentQuestionIndex];
        if (!question) return;

        // Update heading
        if (refs.questionHeading) {
            refs.questionHeading.textContent = `Question ${state.currentQuestionIndex + 1} / ${state.totalQuestions}`;
        }

        // Render question based on type
        renderQuestion(question, state.currentQuestionIndex);

        updateQuestionStep();
        if (refs.backButton) {
            refs.backButton.disabled = state.currentQuestionIndex === 0;
        }
        if (refs.nextButton) {
            refs.nextButton.textContent = state.currentQuestionIndex === state.totalQuestions - 1 ? 'Nộp bài' : 'Next';
        }
    }

    function attachNavigation() {
        if (refs.backButton) {
            refs.backButton.addEventListener('click', () => {
                if (state.completed) {
                    return;
                }
                showQuestion(state.currentQuestionIndex - 1);
            });
        }

        if (refs.nextButton) {
            refs.nextButton.addEventListener('click', () => {
                if (state.completed) {
                    return;
                }
                if (state.currentQuestionIndex === state.totalQuestions - 1) {
                    const modal = new bootstrap.Modal(refs.submitModal);
                    modal.show();
                } else {
                    showQuestion(state.currentQuestionIndex + 1);
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
                // Close modal first
                if (refs.submitModal) {
                    const modalInstance = bootstrap.Modal.getInstance(refs.submitModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
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
    function setupAudioPlayer(audioId, playButtonId, playIconId, playCountLabelId, maxPlays = 2, questionIndex = null) {
        const audio = document.getElementById(audioId);
        const playBtn = document.getElementById(playButtonId);
        const playIcon = document.getElementById(playIconId);
        const playCountLabel = document.getElementById(playCountLabelId);
        
        if (!audio || !playBtn || !playIcon) return;

        // Stop audio first
        audio.pause();
        audio.currentTime = 0;
        audio.volume = 0.5; // Set default volume to 50%
        playIcon.classList.remove('bi-pause-fill');
        playIcon.classList.add('bi-play-fill');

        // Use unique key for question-audioPlayer based on question index
        const countKey = (audioId === 'question-audioPlayer' && questionIndex !== null) 
            ? `question-audioPlayer-${questionIndex}` 
            : audioId;

        if (!audioPlayCounts[countKey]) {
            audioPlayCounts[countKey] = { count: 0, maxPlays };
        }

        const updatePlayCount = () => {
            const remaining = audioPlayCounts[countKey].maxPlays - audioPlayCounts[countKey].count;
            if (playCountLabel) {
                playCountLabel.textContent = `${remaining} of ${audioPlayCounts[countKey].maxPlays} plays remaining`;
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
            if (audioPlayCounts[countKey].count >= audioPlayCounts[countKey].maxPlays) {
                return;
            }

            if (audio.paused) {
                audioPlayCounts[countKey].count += 1;
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
        let audioRangeId = audioId.replace('Player', 'Range');
        // Handle special case for question-audioPlayer
        if (audioId === 'question-audioPlayer') {
            audioRangeId = 'question-audioRange';
        }
        const audioRange = document.getElementById(audioRangeId);
        if (audioRange) {
            // Set default volume to 50%
            audio.volume = 0.5;
            audioRange.value = 0.5;
            audioRange.addEventListener('input', (e) => {
                audio.volume = parseFloat(e.target.value);
            });
        } else {
            // If no range control, still set default volume to 50%
            audio.volume = 0.5;
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
                audio.volume = 0.5; // Set default volume to 50%
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
            audio.volume = 0.5; // Set default volume to 50%
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
            audio.volume = 0.5; // Set default volume to 50%
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
                        <input type="range" class="form-range" id="part4-audioRange${questionNum}" min="0" max="1" step="0.01" value="0.5" style="width: 200px;">
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
                audio.volume = 0.5; // Set default volume to 50%
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
        
        // Evaluate all questions from flattened array
        const results = {
            part1: { rows: [], score: 0, total: 0 },
            part2: { rows: [], score: 0, total: 0 },
            part3: { rows: [], score: 0, total: 0 },
            part4: { rows: [], score: 0, total: 0 }
        };

        let part2Evaluated = false;
        let part3Evaluated = false;

        flattenedQuestions.forEach((question, index) => {
            const userAnswer = state.userAnswers[index];
            
            switch (question.type) {
                case 'part1':
                    const part1Q = question.data;
                    const isCorrect = userAnswer === part1Q.correctAnswer;
                    results.part1.rows.push({
                        question: `Question ${question.originalIndex + 1}`,
                        user: userAnswer || 'No answer',
                        correct: part1Q.correctAnswer || '',
                        isCorrect
                    });
                    results.part1.total++;
                    if (isCorrect) results.part1.score++;
                    break;
                    
                case 'part2':
                    if (!part2Evaluated) {
                        // Only evaluate once for part2
                        part2Evaluated = true;
                        const part2 = question.data;
                        const correctAnswers = part2.correctAnswers || [];
                        for (let i = 0; i < 4; i++) {
                            const answerKey = `part2_${i}`;
                            const userAns = userAnswer && userAnswer[answerKey] ? userAnswer[answerKey] : '';
                            const correctAns = correctAnswers[i] || '';
                            const isCorrect = userAns === correctAns;
                            results.part2.rows.push({
                                question: `Person ${i + 1}`,
                                user: userAns || 'No answer',
                                correct: correctAns,
                                isCorrect
                            });
                            results.part2.total++;
                            if (isCorrect) results.part2.score++;
                        }
                    }
                    break;
                    
                case 'part3':
                    if (!part3Evaluated) {
                        // Only evaluate once for part3
                        part3Evaluated = true;
                        const part3 = question.data;
                        const questions = part3.questions || [];
                        const correctAnswers = part3.correctAnswers || [];
                        questions.forEach((q, qIdx) => {
                            const answerKey = `part3_${qIdx}`;
                            const userAns = userAnswer && userAnswer[answerKey] ? userAnswer[answerKey] : '';
                            const correctAns = correctAnswers[qIdx] || '';
                            const isCorrect = userAns === correctAns;
                            results.part3.rows.push({
                                question: q,
                                user: userAns || 'No answer',
                                correct: correctAns,
                                isCorrect
                            });
                            results.part3.total++;
                            if (isCorrect) results.part3.score++;
                        });
                    }
                    break;
                    
                case 'part4':
                    const part4Data = question.data;
                    const part4Question = part4Data.question;
                    const subQuestions = part4Question.questions || [];
                    const questionNum = part4Data.questionNum;
                    
                    // Evaluate all sub-questions for this question
                    subQuestions.forEach((subQ, subIndex) => {
                        const userAns = userAnswer && userAnswer[subIndex] ? userAnswer[subIndex] : '';
                        const correctAns = subQ.correctAnswer || '';
                        const isCorrect4 = userAns === correctAns;
                        results.part4.rows.push({
                            question: `${questionNum}.${subIndex + 1} ${subQ.question || ''}`,
                            user: userAns || 'No answer',
                            correct: correctAns,
                            isCorrect: isCorrect4
                        });
                        results.part4.total++;
                        if (isCorrect4) results.part4.score++;
                    });
                    break;
            }
        });

        const totalScore = results.part1.score + results.part2.score + results.part3.score + results.part4.score;
        const totalPossible = results.part1.total + results.part2.total + results.part3.total + results.part4.total;

        renderPart1Comparison(results.part1);
        renderPart2Comparison(results.part2);
        renderPart3Comparison(results.part3);
        renderPart4Comparison(results.part4);

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
            refs.nextButton.textContent = 'Back to home';
            refs.nextButton.onclick = () => {
                window.location.href = '/listening_bode.html';
            };
        }
        state.completed = true;

        showComparisonSection('comparisonResult_question1');
        if (refs.navButtons && refs.navButtons.length) {
            refs.navButtons.forEach((btn, index) => {
                btn.classList.toggle('btn-active', index === 0);
            });
        }
    }

    // Flatten all questions into a single array
    function flattenQuestions(data) {
        flattenedQuestions = [];
        questionTypeMap = {};
        let questionIndex = 0;

        const part1 = data?.part1 || {};
        const part2 = data?.part2 || {};
        const part3 = data?.part3 || {};
        const part4 = data?.part4 || {};

        // Part 1: Questions 1-13 (each question is a separate item)
        if (part1.questions && part1.questions.length > 0) {
            part1.questions.forEach((q, idx) => {
                flattenedQuestions.push({
                    type: 'part1',
                    data: q,
                    originalIndex: idx
                });
                questionTypeMap[questionIndex] = { type: 'part1', originalIndex: idx };
                questionIndex++;
            });
        }

        // Part 2: Question 14 (1 question with 4 matching answers)
        if (part2.topic) {
            flattenedQuestions.push({
                type: 'part2',
                data: part2
            });
            questionTypeMap[questionIndex] = { type: 'part2' };
            questionIndex++;
        }

        // Part 3: Question 15 (1 question with 4 opinion answers)
        if (part3.topic) {
            flattenedQuestions.push({
                type: 'part3',
                data: part3
            });
            questionTypeMap[questionIndex] = { type: 'part3' };
            questionIndex++;
        }

        // Part 4: Questions 16-17 (each question with all sub-questions is one item)
        if (part4.questions && part4.questions.length > 0) {
            part4.questions.forEach((q, qIndex) => {
                if (q.questions && q.questions.length > 0) {
                    flattenedQuestions.push({
                        type: 'part4',
                        data: {
                            question: q,
                            questionNum: 16 + qIndex
                        }
                    });
                    questionTypeMap[questionIndex] = { 
                        type: 'part4', 
                        questionIndex: qIndex
                    };
                    questionIndex++;
                }
            });
        }

        state.totalQuestions = flattenedQuestions.length;
        state.userAnswers = new Array(state.totalQuestions).fill(null);
    }

    // Render a single question based on its type
    function renderQuestion(question, index) {
        if (!question || !refs.questionContainer) return;

        // Stop all audio first
        stopAllAudio();

        // Reset play count for this question (create unique key per question)
        const questionAudioId = `question-audioPlayer-${index}`;
        if (audioPlayCounts[questionAudioId]) {
            audioPlayCounts[questionAudioId].count = 0;
        } else {
            audioPlayCounts[questionAudioId] = { count: 0, maxPlays: 2 };
        }

        // Hide/show audio player bar based on question type
        const hasAudio = ['part1', 'part2', 'part3', 'part4'].includes(question.type);
        if (refs.audioPlayerBar) {
            refs.audioPlayerBar.style.display = hasAudio ? 'flex' : 'none';
        }
        if (refs.transcriptButtonContainer) {
            refs.transcriptButtonContainer.style.display = hasAudio ? 'block' : 'none';
        }

        // Update play count label
        if (hasAudio && refs.playCountLabel) {
            refs.playCountLabel.textContent = `2 of 2 plays remaining`;
        }
        if (hasAudio && refs.playButton) {
            refs.playButton.disabled = false;
            refs.playButton.style.opacity = '1';
        }

        // Clear previous content
        refs.questionContainer.innerHTML = '';

        switch (question.type) {
            case 'part1':
                renderPart1QuestionItem(question.data, index);
                break;
            case 'part2':
                renderPart2QuestionItem(question.data, index);
                break;
            case 'part3':
                renderPart3QuestionItem(question.data, index);
                break;
            case 'part4':
                renderPart4QuestionItem(question.data, index);
                break;
        }
    }

    // Render Part 1 question item (single question)
    function renderPart1QuestionItem(question, index) {
        if (!question) return;

        refs.questionContainer.innerHTML = `
            <p class="mb-4"><strong>${(question.question || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong></p>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="question-answer" id="q-option0" value="${(question.options?.[0] || '').replace(/"/g, '&quot;')}">
                <label class="form-check-label" for="q-option0">${(question.options?.[0] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="question-answer" id="q-option1" value="${(question.options?.[1] || '').replace(/"/g, '&quot;')}">
                <label class="form-check-label" for="q-option1">${(question.options?.[1] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</label>
            </div>
            <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="question-answer" id="q-option2" value="${(question.options?.[2] || '').replace(/"/g, '&quot;')}">
                <label class="form-check-label" for="q-option2">${(question.options?.[2] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</label>
            </div>
        `;

        // Set audio
        if (refs.audioPlayer && question.audioUrl) {
            refs.audioPlayer.src = question.audioUrl;
            refs.audioPlayer.volume = 0.5; // Set default volume to 50%
        }

        // Set transcript
        if (refs.transcriptContent) {
            refs.transcriptContent.textContent = question.transcript || '';
        }

        // Setup audio player
        setupAudioPlayer('question-audioPlayer', 'question-playButton', 'question-playIcon', 'question-playCountLabel', 2, index);

        // Setup transcript toggle
        if (refs.showTranscriptButton && refs.transcriptBox) {
            refs.showTranscriptButton.onclick = () => {
                const isHidden = refs.transcriptBox.style.display === 'none';
                refs.transcriptBox.style.display = isHidden ? 'block' : 'none';
                refs.showTranscriptButton.textContent = isHidden ? 'Hide paragraph' : 'Show paragraph';
            };
        }

        // Restore saved answer
        const savedAnswer = state.userAnswers[index];
        if (savedAnswer) {
            const radio = refs.questionContainer.querySelector(`input[value="${savedAnswer}"]`);
            if (radio) radio.checked = true;
        }

        // Store answer on change
        refs.questionContainer.querySelectorAll('input[name="question-answer"]').forEach(radio => {
            radio.addEventListener('change', () => {
                state.userAnswers[index] = radio.value;
            });
        });
    }

    // Render Part 2 question item
    function renderPart2QuestionItem(part2, index) {
        if (!part2.topic) return;

        const options = part2.options || [];
        const correctAnswers = part2.correctAnswers || [];

        let html = `
            <h5 class="mb-4"><strong>${part2.topic}</strong></h5>
            <p class="mb-4">Four people are discussing their views on the topic above. Complete the sentences. Use each answer only once. You will not need two of the answers.</p>
        `;

        // Create 4 person selects
        for (let i = 0; i < 4; i++) {
            html += `
                <div class="d-flex align-items-center mb-3 gap-3">
                    <label for="q-person${i + 1}" class="form-label mb-0" style="width: 80px;">Person ${i + 1}</label>
                    <select id="q-person${i + 1}" class="form-select" style="border: 1px solid #cccc99;">
                        <option value="">-- Select an answer --</option>
                        ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        refs.questionContainer.innerHTML = html;

        // Set audio
        if (refs.audioPlayer && part2.audioUrl) {
            refs.audioPlayer.src = part2.audioUrl;
            refs.audioPlayer.volume = 0.5; // Set default volume to 50%
        }

        // Set transcript
        if (refs.transcriptContent) {
            refs.transcriptContent.textContent = part2.transcript || '';
        }

        // Setup audio player
        setupAudioPlayer('question-audioPlayer', 'question-playButton', 'question-playIcon', 'question-playCountLabel', 2, index);

        // Setup transcript toggle
        if (refs.showTranscriptButton && refs.transcriptBox) {
            refs.showTranscriptButton.onclick = () => {
                const isHidden = refs.transcriptBox.style.display === 'none';
                refs.transcriptBox.style.display = isHidden ? 'block' : 'none';
                refs.showTranscriptButton.textContent = isHidden ? 'Hide Paragraph' : 'Show Paragraph';
            };
        }

        // Restore and store answers
        for (let i = 0; i < 4; i++) {
            const select = document.getElementById(`q-person${i + 1}`);
            if (select) {
                const answerKey = `part2_${i}`;
                if (state.userAnswers[index] && state.userAnswers[index][answerKey]) {
                    select.value = state.userAnswers[index][answerKey];
                }
                select.addEventListener('change', () => {
                    if (!state.userAnswers[index]) {
                        state.userAnswers[index] = {};
                    }
                    state.userAnswers[index][answerKey] = select.value;
                });
            }
        }
    }

    // Render Part 3 question item
    function renderPart3QuestionItem(part3, index) {
        if (!part3.topic) return;

        const questions = part3.questions || [];
        const correctAnswers = part3.correctAnswers || [];

        let html = `
            <h5 class="mb-4"><strong>${part3.topic}</strong></h5>
            <p class="mb-4">Listen to two people discussing potential modifications to the topic above. Read the statements and decide whose opinion matches best: the man's, the woman's, or both. Who expresses which opinion?</p>
        `;

        questions.forEach((q, qIdx) => {
            html += `
                <div class="d-flex align-items-center mb-3 gap-3">
                    <label for="q-opinion${qIdx + 1}" class="form-label mb-0" style="min-width: 200px;">${q}</label>
                    <select id="q-opinion${qIdx + 1}" class="form-select" style="border: 1px solid #cccc99; max-width: 250px;">
                        <option value="">-- Select an answer --</option>
                        <option value="Man">Man</option>
                        <option value="Woman">Woman</option>
                        <option value="Both">Both</option>
                    </select>
                </div>
            `;
        });

        refs.questionContainer.innerHTML = html;

        // Set audio
        if (refs.audioPlayer && part3.audioUrl) {
            refs.audioPlayer.src = part3.audioUrl;
            refs.audioPlayer.volume = 0.5; // Set default volume to 50%
        }

        // Set transcript
        if (refs.transcriptContent) {
            refs.transcriptContent.textContent = part3.transcript || '';
        }

        // Setup audio player
        setupAudioPlayer('question-audioPlayer', 'question-playButton', 'question-playIcon', 'question-playCountLabel', 2, index);

        // Setup transcript toggle
        if (refs.showTranscriptButton && refs.transcriptBox) {
            refs.showTranscriptButton.onclick = () => {
                const isHidden = refs.transcriptBox.style.display === 'none';
                refs.transcriptBox.style.display = isHidden ? 'block' : 'none';
                refs.showTranscriptButton.textContent = isHidden ? 'Hide Paragraph' : 'Show Paragraph';
            };
        }

        // Restore and store answers
        questions.forEach((q, qIdx) => {
            const select = document.getElementById(`q-opinion${qIdx + 1}`);
            if (select) {
                const answerKey = `part3_${qIdx}`;
                if (state.userAnswers[index] && state.userAnswers[index][answerKey]) {
                    select.value = state.userAnswers[index][answerKey];
                }
                select.addEventListener('change', () => {
                    if (!state.userAnswers[index]) {
                        state.userAnswers[index] = {};
                    }
                    state.userAnswers[index][answerKey] = select.value;
                });
            }
        });
    }

    // Render Part 4 question item (all sub-questions in one page)
    function renderPart4QuestionItem(data, index) {
        if (!data || !data.question) return;

        const question = data.question;
        const questionNum = data.questionNum;
        const subQuestions = question.questions || [];

        // Set audio
        if (refs.audioPlayer && question.audioUrl) {
            refs.audioPlayer.src = question.audioUrl;
            refs.audioPlayer.volume = 0.5; // Set default volume to 50%
        }

        // Set transcript
        if (refs.transcriptContent) {
            refs.transcriptContent.textContent = question.transcript || '';
        }

        let html = `
            <h5 class="mb-4"><strong>Question ${questionNum}</strong></h5>
            <h6 class="mb-3"><strong>${question.topic || ''}</strong></h6>
        `;

        // Render all sub-questions
        subQuestions.forEach((subQ, subIndex) => {
            const subQId = subQ.id || `${questionNum}.${subIndex + 1}`;
            html += `
                <div class="mb-4">
                    <label class="form-label mb-2 fw-bold">${subQId} ${subQ.question || ''}</label>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="part4-answer-${subIndex}" id="q${questionNum}-${subIndex}-A" value="A">
                        <label class="form-check-label" for="q${questionNum}-${subIndex}-A">${subQ.options?.[0] || ''}</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="part4-answer-${subIndex}" id="q${questionNum}-${subIndex}-B" value="B">
                        <label class="form-check-label" for="q${questionNum}-${subIndex}-B">${subQ.options?.[1] || ''}</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="part4-answer-${subIndex}" id="q${questionNum}-${subIndex}-C" value="C">
                        <label class="form-check-label" for="q${questionNum}-${subIndex}-C">${subQ.options?.[2] || ''}</label>
                    </div>
                </div>
            `;
        });

        refs.questionContainer.innerHTML = html;

        // Setup audio player
        setupAudioPlayer('question-audioPlayer', 'question-playButton', 'question-playIcon', 'question-playCountLabel', 2, index);

        // Setup transcript toggle
        if (refs.showTranscriptButton && refs.transcriptBox) {
            refs.showTranscriptButton.onclick = () => {
                const isHidden = refs.transcriptBox.style.display === 'none';
                refs.transcriptBox.style.display = isHidden ? 'block' : 'none';
                refs.showTranscriptButton.textContent = isHidden ? 'Hide Paragraph' : 'Show Paragraph';
            };
        }

        // Initialize answer object if not exists
        if (!state.userAnswers[index]) {
            state.userAnswers[index] = {};
        }

        // Restore and store answers for each sub-question
        subQuestions.forEach((subQ, subIndex) => {
            const savedAnswer = state.userAnswers[index][subIndex];
            if (savedAnswer) {
                const radio = refs.questionContainer.querySelector(`input[name="part4-answer-${subIndex}"][value="${savedAnswer}"]`);
                if (radio) radio.checked = true;
            }

            // Store answer on change
            refs.questionContainer.querySelectorAll(`input[name="part4-answer-${subIndex}"]`).forEach(radio => {
                radio.addEventListener('change', () => {
                    if (!state.userAnswers[index]) {
                        state.userAnswers[index] = {};
                    }
                    state.userAnswers[index][subIndex] = radio.value;
                });
            });
        });
    }

    function renderPractice(set) {
        if (refs.loading) {
            refs.loading.style.display = 'none';
        }
        refs.content.style.display = 'block';
        state.setTitle = set.title || '';
        state.data = set; // Store full set data for evaluation
        document.title = `${set.title || 'Bộ đề Listening'} - Mini Hippo`;
        if (refs.resultTitle) {
            refs.resultTitle.textContent = state.setTitle ? `Test and Answer Review · ${state.setTitle}` : 'Test and Answer Review';
        }

        // Flatten all questions
        flattenQuestions(set.data);

        startCountdown(set.duration_minutes);
        attachNavigation();
        showQuestion(0);
    }

    async function loadPracticeSet() {
        try {
            const response = await fetch(`/api/practice_sets/get?id=${setId}`);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không tìm thấy bộ đề');
            }
            state.data = result.set;
            renderPractice(result.set);
        } catch (error) {
            console.error(error);
            if (refs.loading) {
                refs.loading.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
            }
        }
    }

    document.addEventListener('DOMContentLoaded', loadPracticeSet);
})();

