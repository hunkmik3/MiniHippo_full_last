(function () {
    const query = new URLSearchParams(window.location.search);
    const setId = query.get('set');

    const sections = [
        { id: 'part1-section', label: 'Reading Question 1', key: 'part1' },
        { id: 'part2-section', label: 'Reading Question 2 & 3', key: 'part2' },
        { id: 'part4-section', label: 'Reading Question 4', key: 'part4' },
        { id: 'part5-section', label: 'Reading Question 5', key: 'part5' }
    ];

    const refs = {
        loading: document.getElementById('loadingState'),
        content: document.getElementById('practiceContent'),
        navigator: document.getElementById('navigator'),
        countdown: document.getElementById('countdownTimer'),
        questionStep: document.getElementById('question_step'),
        backButton: document.getElementById('backButton'),
        nextButton: document.getElementById('nextButton'),
        checkButton: document.getElementById('checkResultButton'),
        submitModal: document.getElementById('submitModal'),
        part5Toggle: document.getElementById('togglePart5ContentBtn'),
        part5TipsBtn: document.getElementById('showPart5TipsBtn'),
        part5Content: document.getElementById('part5-paragraph-container'),
        part5TipsModal: document.getElementById('part5TipsModal'),
        tipsKeyword: document.getElementById('part5-keyword'),
        tipsMemo: document.getElementById('part5-meo'),
        resultContainer: document.getElementById('result_navigation'),
        comparisonSections: document.querySelectorAll('[id^="comparisonResult_question"]'),
        totalScore: document.getElementById('totalScore'),
        scoreClassification: document.getElementById('scoreClassification'),
        resultTitle: document.getElementById('resultTitle'),
        navButtons: document.querySelectorAll('[data-review-target]')
    };

    const checkHandlers = {};
    let part5ControlsBound = false;

    const state = {
        data: null,
        currentStep: 1,
        totalSteps: sections.length,
        timeLeft: 35 * 60,
        timerInterval: null,
        setTitle: '',
        completed: false
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
        state.currentStep = Math.min(Math.max(step, 1), state.totalSteps);
        sections.forEach((sectionConfig, index) => {
            const section = document.getElementById(sectionConfig.id);
            if (!section) {
                return;
            }
            section.classList.toggle('active', index + 1 === state.currentStep);
        });

        updateQuestionStep();
        refs.backButton.disabled = state.currentStep === 1;
        refs.nextButton.textContent = state.currentStep === state.totalSteps ? 'Nộp bài' : 'Next';
        
        // Re-render Part 2 with new shuffle each time it's shown (step 2 is Reading Question 2 & 3)
        if (state.currentStep === 2 && state.data?.data?.part2) {
            renderPart2(state.data.data.part2);
        }
    }

    function attachNavigation() {
        refs.backButton.addEventListener('click', () => {
            if (state.completed) {
                return;
            }
            showStep(state.currentStep - 1);
        });

        refs.nextButton.addEventListener('click', () => {
            if (state.completed) {
                window.location.href = 'reading_bode.html';
                return;
            }

            if (state.currentStep === state.totalSteps) {
                const modal = new bootstrap.Modal(refs.submitModal);
                modal.show();
            } else {
                showStep(state.currentStep + 1);
            }
        });

        if (refs.checkButton) {
            refs.checkButton.addEventListener('click', () => {
                const current = sections[state.currentStep - 1];
                if (current && typeof checkHandlers[current.key] === 'function') {
                    checkHandlers[current.key]();
                }
            });
        }

        document.getElementById('confirmSubmitBtn').addEventListener('click', () => {
            const instance = bootstrap.Modal.getInstance(refs.submitModal);
            if (instance) {
                instance.hide();
            }
            completePractice();
        });

        if (refs.navButtons && refs.navButtons.length) {
            refs.navButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const target = button.dataset.reviewTarget;
                    if (!target) return;
                    showComparisonSection(target);
                    refs.navButtons.forEach(btn => btn.classList.remove('btn-active'));
                    button.classList.add('btn-active');
                });
            });
        }
    }

    function renderPart1(part1 = {}) {
        document.getElementById('part1-intro').textContent = part1.intro || 'Choose the word that fits in the gap. The first one is done for you.';
        const container = document.getElementById('part1-questions');
        container.innerHTML = '';
        (part1.questions || []).forEach((q, idx) => {
            const row = document.createElement('div');
            row.className = 'border rounded-3 p-3 mb-3 bg-white shadow-sm';
            row.innerHTML = `
                <div class="d-flex flex-column flex-md-row gap-3 align-items-md-center">
                    <div class="flex-grow-1">
                        <span>${q.start || ''}</span>
                        <select class="form-select d-inline-block w-auto mx-2 part1-select" data-answer="${q.answer || ''}">
                            <option value="">-- Chọn --</option>
                            ${(q.options || []).map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                        <span>${q.end || ''}</span>
                    </div>
                </div>
            `;
            container.appendChild(row);
        });
        const feedback = document.getElementById('part1-feedback');
        checkHandlers.part1 = () => {
            const selects = container.querySelectorAll('.part1-select');
            let correct = 0;
            selects.forEach(select => {
                if (select.value && select.value === select.dataset.answer) {
                    correct += 1;
                }
            });
            feedback.textContent = `Kết quả: ${correct}/${selects.length} câu đúng.`;
            feedback.classList.remove('d-none');
        };
    }

    // Fisher-Yates shuffle function
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function renderPart2(part2 = {}) {
        const topicEl = document.getElementById('part2-topic');
        topicEl.innerHTML = part2.topic ? `<strong>Topic: ${part2.topic}</strong>` : '';
        const container = document.getElementById('cardsContainer');
        container.innerHTML = '';
        
        const sentences = part2.sentences || [];
        if (sentences.length === 0) return;
        
        // Keep first sentence fixed, shuffle the rest
        // Create array with original indices
        const sentencesWithIndex = sentences.map((sentence, index) => ({ text: sentence, originalIndex: index }));
        const firstSentence = sentencesWithIndex[0];
        const restSentences = sentencesWithIndex.slice(1);
        const shuffledRest = shuffleArray(restSentences);
        const shuffledSentences = [firstSentence, ...shuffledRest];
        
        shuffledSentences.forEach((item, displayIndex) => {
            const card = document.createElement('div');
            const sentence = typeof item === 'string' ? item : item.text;
            const originalIndex = typeof item === 'string' ? sentences.indexOf(item) : item.originalIndex;
            card.dataset.correctIndex = originalIndex;
            
            if (displayIndex === 0) {
                // First sentence: fixed, not draggable, with checkmark and highlight
                card.className = 'card mb-2';
                card.style.backgroundColor = '#e3f2fd';
                card.style.border = '2px solid #1976d2';
                card.style.cursor = 'default';
                card.innerHTML = `
                    <div class="card-body d-flex align-items-center">
                        <i class="bi bi-check-circle-fill text-success me-2" style="font-size: 1.2rem;"></i>
                        <span>${sentence}</span>
                    </div>
                `;
            } else {
                // Other sentences: draggable
            card.className = 'draggable-card';
                card.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-grip-vertical me-2 text-muted" style="font-size: 1.2rem;"></i>
                        <span>${sentence}</span>
                    </div>
                `;
            }
            container.appendChild(card);
        });

        // Create Sortable, but prevent dragging the first card (fixed sentence)
        // Only draggable-card elements can be dragged, the first card has class 'card' so it won't be draggable
        Sortable.create(container, {
            animation: 150,
            draggable: '.draggable-card' // Only allow dragging draggable-card elements (first card has class 'card', not 'draggable-card')
        });

        const feedback = document.getElementById('part2-feedback');
        checkHandlers.part2 = () => {
            // Get all cards including the fixed first one
            const allCards = container.querySelectorAll('[data-correct-index]');
            let correct = 0;
            let totalCheckable = 0;
            
            allCards.forEach((card, displayIndex) => {
                const correctIndex = Number(card.dataset.correctIndex);
                // Check if the card is in the correct position
                // For the first card (displayIndex 0), it should have correctIndex 0
                // For other cards, check if their correctIndex matches their position in the original array
                if (displayIndex === correctIndex) {
                    correct += 1;
                }
                totalCheckable += 1;
            });
            
            feedback.textContent = correct === totalCheckable
                ? 'Chính xác! Bạn đã sắp xếp đúng thứ tự.'
                : `Bạn đang đúng ${correct}/${totalCheckable} vị trí. Hãy thử lại!`;
            feedback.classList.remove('d-none');
        };
    }

    function renderPart4(part4 = {}) {
        document.getElementById('part4-topic').innerHTML = part4.topic ? `<strong>Topic: ${part4.topic}</strong>` : '';
        document.getElementById('part4-intro').innerHTML = part4.intro || '';
        const paragraphs = document.getElementById('part4-paragraphs');
        paragraphs.innerHTML = '';
        ['A', 'B', 'C', 'D'].forEach(letter => {
            const text = part4.paragraphs?.[letter] || '';
            const box = document.createElement('div');
            box.className = 'mb-3';
            box.innerHTML = `<p><strong>${letter}.</strong> ${text}</p>`;
            paragraphs.appendChild(box);
        });

        const form = document.getElementById('part4-form');
        form.innerHTML = '';
        (part4.questions || []).forEach((q, idx) => {
            const group = document.createElement('div');
            group.className = 'mb-3 card card-body';
            group.innerHTML = `
                <label class="fw-semibold mb-2">Câu ${idx + 1}: ${q.prompt || ''}</label>
                <select class="form-select part4-select option-select" data-answer="${q.answer || ''}">
                    <option value="">-- Chọn --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                </select>
            `;
            form.appendChild(group);
        });

        const feedback = document.getElementById('part4-feedback');
        checkHandlers.part4 = () => {
            const selects = form.querySelectorAll('.part4-select');
            let correct = 0;
            selects.forEach(select => {
                if (select.value && select.value === select.dataset.answer) {
                    correct += 1;
                }
            });
            feedback.textContent = `Bạn trả lời đúng ${correct}/${selects.length} câu.`;
            feedback.classList.remove('d-none');
        };
    }

    function renderPart5(part5 = {}) {
        const topicEl = document.getElementById('part5-topic');
        topicEl.innerHTML = part5.topic ? `<strong>Topic: ${part5.topic}</strong>` : '';
        refs.tipsKeyword.textContent = part5.tips?.keyword || 'Chưa có dữ liệu.';
        refs.tipsMemo.textContent = part5.tips?.meo || 'Chưa có dữ liệu.';

        // Filter out empty, null, undefined values from options
        const rawOptions = Array.isArray(part5.options) && part5.options.length 
            ? part5.options.filter(opt => opt && opt.trim && opt.trim() !== '' && opt !== null && opt !== undefined)
            : [];
        const normalizedOptions = rawOptions.length > 0 && rawOptions[0] !== '-- Chọn --' 
            ? ['-- Chọn --', ...rawOptions] 
            : (rawOptions.length > 0 ? rawOptions : ['-- Chọn --']);
        const container = document.getElementById('part5-paragraphs');
        container.innerHTML = '';
        
        // Ensure container is visible (remove collapsed class if exists)
        if (refs.part5Content) {
            refs.part5Content.classList.remove('collapsed');
        }
        
        // Reset button text to "Xem nội dung" when rendering
        if (refs.part5Toggle) {
            refs.part5Toggle.textContent = 'Xem nội dung';
        }

        (part5.paragraphs || []).forEach((paragraph, idx) => {
            const col = document.createElement('div');
            col.className = 'col-12';
            const card = document.createElement('div');
            card.className = 'border rounded-3 p-3 bg-white shadow-sm mb-3';
            
            // Create row with number label and select dropdown
            const selectRow = document.createElement('div');
            selectRow.className = 'd-flex flex-column flex-md-row align-items-md-center gap-3 mb-2';
            
            // Create number label
            const label = document.createElement('label');
            label.className = 'mb-0 fw-semibold';
            label.textContent = `${idx + 1}.`;
            label.style.minWidth = '30px';
            
            // Create select dropdown
            const select = document.createElement('select');
            select.className = 'form-select part5-select option-select';
            select.setAttribute('data-answer', paragraph.answer || '');
            normalizedOptions.forEach(opt => {
                // Skip empty, null, undefined values
                if (!opt || (typeof opt === 'string' && opt.trim() === '')) {
                    return;
                }
                const option = document.createElement('option');
                            const value = opt === '-- Chọn --' ? '' : opt;
                option.value = value;
                option.textContent = opt;
                select.appendChild(option);
            });
            
            selectRow.appendChild(label);
            selectRow.appendChild(select);
            
            // Create paragraph (hidden by default)
            const paragraphEl = document.createElement('p');
            paragraphEl.className = 'mb-0 part5-paragraph-text mt-2';
            paragraphEl.style.display = 'none'; // Hidden by default
            paragraphEl.textContent = paragraph.text || '';
            
            card.appendChild(selectRow);
            card.appendChild(paragraphEl);
            col.appendChild(card);
            container.appendChild(col);
        });

        const feedback = document.getElementById('part5-feedback');
        checkHandlers.part5 = () => {
            const selects = container.querySelectorAll('.part5-select');
            let correct = 0;
            selects.forEach(select => {
                if (select.value && select.value === select.dataset.answer) {
                    correct += 1;
                }
            });
            feedback.textContent = `Bạn chọn đúng ${correct}/${selects.length} đoạn.`;
            feedback.classList.remove('d-none');
        };

        setupPart5Buttons();
    }

    function setupPart5Buttons() {
        if (part5ControlsBound) return;

        if (refs.part5Toggle) {
            refs.part5Toggle.addEventListener('click', () => {
                // Toggle visibility of all paragraph texts
                const paragraphTexts = document.querySelectorAll('.part5-paragraph-text');
                if (paragraphTexts.length === 0) return;
                
                // Check current state - if first paragraph is visible, hide all; otherwise show all
                const firstParagraph = paragraphTexts[0];
                const computedStyle = window.getComputedStyle(firstParagraph);
                const isCurrentlyVisible = firstParagraph && 
                    (firstParagraph.style.display !== 'none' && 
                     computedStyle.display !== 'none');
                
                // Toggle visibility
                paragraphTexts.forEach(p => {
                    if (isCurrentlyVisible) {
                        // Hide paragraphs
                        p.style.display = 'none';
                    } else {
                        // Show paragraphs
                        p.style.display = 'block';
                    }
                });
                
                // Update button text
                refs.part5Toggle.textContent = isCurrentlyVisible ? 'Xem nội dung' : 'Ẩn nội dung';
            });
        }

        if (refs.part5TipsBtn && refs.part5TipsModal) {
            const modal = new bootstrap.Modal(refs.part5TipsModal);
            refs.part5TipsBtn.addEventListener('click', () => modal.show());
        }

        part5ControlsBound = true;
    }

    function formatAnswer(value) {
        if (!value || !value.trim()) {
            return '(không chọn)';
        }
        return value.trim();
    }

    function evaluatePart1(part1 = {}) {
        const questions = part1.questions || [];
        const selects = document.querySelectorAll('#part1-questions .part1-select');
        let score = 0;
        const rows = questions.map((question, index) => {
            const select = selects[index];
            const rawValue = select ? select.value : '';
            const isCorrect = rawValue && rawValue === question.answer;
            if (isCorrect) {
                score += 1;
            }
            return {
                start: question.start || '',
                end: question.end || '',
                user: formatAnswer(rawValue),
                correct: question.answer || '',
                isCorrect
            };
        });
        return { score, total: questions.length || 0, rows };
    }

    function evaluatePart2(part2 = {}) {
        const correctOrder = part2.sentences || [];
        // Get all cards including the fixed first one (they all have data-correct-index)
        // Cards are in DOM order (display order)
        const allCards = document.querySelectorAll('#cardsContainer [data-correct-index]');
        
        let score = 0;
        const rows = Array.from(allCards).map((card, displayIndex) => {
            // Get text from card - both card types have text in a <span> element
            let actualText = '';
            const span = card.querySelector('span');
            if (span) {
                actualText = span.textContent.trim();
            } else {
                // Fallback: get from textContent and clean it
                actualText = card.textContent.trim();
            }
            
            // The correct sentence for position displayIndex should be correctOrder[displayIndex]
            const correctSentence = correctOrder[displayIndex] || '';
            
            // Normalize both strings for comparison (trim and compare)
            const normalizedUserText = actualText.trim();
            const normalizedCorrectText = correctSentence.trim();
            
            // Check if the card at this display position has the correct sentence
            const isCorrect = normalizedUserText === normalizedCorrectText;
            if (isCorrect) {
                score += 1;
            }
            
            return {
                user: formatAnswer(actualText),
                correct: correctSentence,
                isCorrect
            };
        });
        return { score, total: correctOrder.length || 0, rows };
    }

    function evaluatePart4(part4 = {}) {
        const questions = part4.questions || [];
        const selects = document.querySelectorAll('#part4-form .part4-select');
        let score = 0;
        const rows = questions.map((question, index) => {
            const select = selects[index];
            const rawValue = select ? select.value : '';
            const isCorrect = rawValue && rawValue === question.answer;
            if (isCorrect) {
                score += 1;
            }
            return {
                prompt: question.prompt || '',
                user: formatAnswer(rawValue),
                correct: question.answer || '',
                isCorrect
            };
        });
        return { score, total: questions.length || 0, rows };
    }

    function evaluatePart5(part5 = {}) {
        const paragraphs = part5.paragraphs || [];
        const selects = document.querySelectorAll('#part5-paragraphs .part5-select');
        let score = 0;
        const rows = paragraphs.map((paragraph, index) => {
            const select = selects[index];
            const rawValue = select ? select.value : '';
            const correctAnswer = paragraph.answer || '';
            const isCorrect = rawValue && rawValue === correctAnswer;
            if (isCorrect) {
                score += 1;
            }
            return {
                label: `Đoạn ${index + 1}`,
                user: formatAnswer(rawValue),
                correct: correctAnswer,
                isCorrect
            };
        });
        return { score, total: paragraphs.length || 0, rows };
    }

    function renderPart1Comparison(result) {
        const body = document.getElementById('comparisonBody_question1');
        const totalEl = document.getElementById('totalScore_question1');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach(row => {
            const tr = document.createElement('tr');
            const userTd = document.createElement('td');
            userTd.innerHTML = `${row.start} <span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span> ${row.end}`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `${row.start} <span class="correct">${row.correct}</span> ${row.end}`;
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total || result.rows.length}</strong>`;
    }

    function renderPart2Comparison(result) {
        const body = document.getElementById('comparisonBody_question2');
        const totalEl = document.getElementById('totalScore_question2');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach(row => {
            const tr = document.createElement('tr');
            const userTd = document.createElement('td');
            userTd.innerHTML = `<span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span>`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `<span class="correct">${row.correct}</span>`;
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total || result.rows.length}</strong>`;
    }

    function renderPart4Comparison(result) {
        const body = document.getElementById('comparisonBody_question3');
        const totalEl = document.getElementById('totalScore_question3');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach((row, index) => {
            const tr = document.createElement('tr');
            const questionTd = document.createElement('td');
            questionTd.textContent = `Câu ${index + 1}: ${row.prompt}`;
            const userTd = document.createElement('td');
            userTd.innerHTML = `<span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span>`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `<span class="correct">${row.correct}</span>`;
            tr.appendChild(questionTd);
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total || result.rows.length}</strong>`;
    }

    function renderPart5Comparison(result) {
        const body = document.getElementById('comparisonBody_question4');
        const totalEl = document.getElementById('totalScore_question4');
        if (!body || !totalEl) return;
        body.innerHTML = '';
        result.rows.forEach(row => {
            const tr = document.createElement('tr');
            const labelTd = document.createElement('td');
            labelTd.textContent = row.label;
            const userTd = document.createElement('td');
            userTd.innerHTML = `<span class="${row.isCorrect ? 'correct' : 'incorrect'}">${row.user}</span>`;
            const correctTd = document.createElement('td');
            correctTd.innerHTML = `<span class="correct">${row.correct}</span>`;
            tr.appendChild(labelTd);
            tr.appendChild(userTd);
            tr.appendChild(correctTd);
            body.appendChild(tr);
        });
        totalEl.innerHTML = `<strong>Your score: ${result.score} / ${result.total || result.rows.length}</strong>`;
    }

    function determineGrade(score, total) {
        if (!total || total === 0) return 'A1';
        const percent = score / total;
        if (percent >= 0.9) return 'C2';
        if (percent >= 0.75) return 'C1';
        if (percent >= 0.6) return 'B2';
        if (percent >= 0.45) return 'B1';
        if (percent >= 0.3) return 'A2';
        return 'A1';
    }

    function showComparisonSection(targetId) {
        if (!targetId || !refs.comparisonSections) return;
        refs.comparisonSections.forEach(section => {
            section.style.display = section.id === targetId ? 'block' : 'none';
        });
    }

    function completePractice() {
        const data = state.data?.data || {};
        const part1Result = evaluatePart1(data.part1);
        const part2Result = evaluatePart2(data.part2);
        const part4Result = evaluatePart4(data.part4);
        const part5Result = evaluatePart5(data.part5);

        renderPart1Comparison(part1Result);
        renderPart2Comparison(part2Result);
        renderPart4Comparison(part4Result);
        renderPart5Comparison(part5Result);

        const totalScore = part1Result.score + part2Result.score + part4Result.score + part5Result.score;
        const totalPossible = part1Result.total + part2Result.total + part4Result.total + part5Result.total;

        if (refs.totalScore) {
            refs.totalScore.textContent = `Total Score: ${totalScore} / ${totalPossible}`;
        }
        if (refs.scoreClassification) {
            refs.scoreClassification.textContent = `Your grade: ${determineGrade(totalScore, totalPossible)}`;
        }

        refs.content.style.display = 'none';
        refs.resultContainer.style.display = 'block';
        refs.navigator.style.display = 'block';
        refs.backButton.style.display = 'none';
        if (refs.checkButton) {
            refs.checkButton.style.display = 'none';
        }
        refs.nextButton.textContent = 'Back to home';
        state.completed = true;

        showComparisonSection('comparisonResult_question1');
        if (refs.navButtons && refs.navButtons.length) {
            refs.navButtons.forEach((btn, index) => {
                btn.classList.toggle('btn-active', index === 0);
            });
        }
    }

    function renderPractice(set) {
        if (refs.loading) {
            refs.loading.style.display = 'none';
        }
        refs.content.style.display = 'block';
        refs.navigator.style.display = 'block';
        state.setTitle = set.title || '';
        document.title = `${set.title || 'Bộ đề Reading'} - Mini Hippo`;
        if (refs.resultTitle) {
            refs.resultTitle.textContent = state.setTitle ? `Test and Answer Review · ${state.setTitle}` : 'Test and Answer Review';
        }

        renderPart1(set.data?.part1);
        renderPart2(set.data?.part2);
        renderPart4(set.data?.part4);
        renderPart5(set.data?.part5);

        startCountdown(set.duration_minutes);
        attachNavigation();
        showStep(1);
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
            refs.loading.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    }

    document.addEventListener('DOMContentLoaded', loadPracticeSet);
})();


