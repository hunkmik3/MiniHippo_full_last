(function () {
    const moduleRoot = document.getElementById('reading-set-module');
    if (!moduleRoot) {
        return;
    }

    const switchButtons = document.querySelectorAll('.module-switch .switch-btn');
    const singlePartModule = document.getElementById('single-part-module');
    const readingSetModule = document.getElementById('reading-set-module');

    const refs = {
        list: document.getElementById('reading-set-list'),
        emptyState: document.getElementById('reading-set-empty'),
        formCard: document.getElementById('reading-set-form-card'),
        formTitle: document.getElementById('reading-set-form-title'),
        titleInput: document.getElementById('reading-set-title'),
        durationInput: document.getElementById('reading-set-duration'),
        descriptionInput: document.getElementById('reading-set-description'),
        part1Intro: document.getElementById('reading-part1-intro'),
        part1Container: document.getElementById('reading-part1-questions'),
        part2Topic: document.getElementById('reading-part2-topic'),
        part2Sentences: document.getElementById('reading-part2-sentences'),
        part3Topic: document.getElementById('reading-part3-topic'),
        part3Sentences: document.getElementById('reading-part3-sentences'),
        part4Topic: document.getElementById('reading-part4-topic'),
        part4Intro: document.getElementById('reading-part4-intro'),
        part4TextA: document.getElementById('reading-part4-text-a'),
        part4TextB: document.getElementById('reading-part4-text-b'),
        part4TextC: document.getElementById('reading-part4-text-c'),
        part4TextD: document.getElementById('reading-part4-text-d'),
        part4Questions: document.getElementById('reading-part4-questions'),
        part5Topic: document.getElementById('reading-part5-topic'),
        part5Options: document.getElementById('reading-part5-options'),
        part5Paragraphs: document.getElementById('reading-part5-paragraphs'),
        part5Keyword: document.getElementById('reading-part5-keyword'),
        part5Meo: document.getElementById('reading-part5-meo'),
        saveBtn: document.getElementById('saveReadingSetBtn'),
        createBtn: document.getElementById('createReadingSetBtn'),
        refreshBtn: document.getElementById('refreshReadingSetsBtn'),
        cancelBtn: document.getElementById('cancelReadingSetBtn'),
        addPart1Btn: document.getElementById('addReadingPart1QuestionBtn'),
        addPart4Btn: document.getElementById('addReadingPart4QuestionBtn'),
        addPart5Btn: document.getElementById('addReadingPart5ParagraphBtn')
    };

    const state = {
        sets: [],
        editingId: null
    };

    // Helper function to build authorized headers
    function buildAuthHeaders(additionalHeaders = {}) {
        // Try to use global function if available
        if (typeof window.buildAuthorizedHeaders === 'function') {
            return window.buildAuthorizedHeaders(additionalHeaders);
        }
        
        // Fallback: get token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
            window.location.href = '/login.html';
            throw new Error('AUTH_TOKEN_MISSING');
        }
        
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...additionalHeaders
        };
    }

    function toggleModules(targetId) {
        if (!singlePartModule || !readingSetModule) return;
        if (targetId === 'reading-set-module') {
            singlePartModule.style.display = 'none';
            readingSetModule.style.display = 'block';
        } else {
            singlePartModule.style.display = 'block';
            readingSetModule.style.display = 'none';
        }
    }

    function bindModuleSwitch() {
        if (!switchButtons.length) return;
        switchButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                switchButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                toggleModules(btn.dataset.target);
            });
        });
    }

    function createPart1QuestionRow(data = {}) {
        const wrapper = document.createElement('div');
        wrapper.className = 'reading-part1-item border rounded p-3 mb-3';
        wrapper.innerHTML = `
            <div class="d-flex justify-content-between mb-2">
                <h6 class="mb-0">Câu <span class="reading-part1-index"></span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-6">
                    <label class="form-label small fw-semibold">Phần đầu câu</label>
                    <input type="text" class="form-control reading-part1-start" value="${data.start || ''}" placeholder="Ví dụ: Where is the train">
                </div>
                <div class="col-md-6">
                    <label class="form-label small fw-semibold">Phần cuối câu</label>
                    <input type="text" class="form-control reading-part1-end" value="${data.end || ''}" placeholder="Ví dụ: in this town?">
                </div>
                <div class="col-md-8">
                    <label class="form-label small fw-semibold">Các lựa chọn (mỗi dòng một từ)</label>
                    <textarea class="form-control reading-part1-options" rows="2" placeholder="station&#10;school&#10;market">${(data.options || []).join('\n')}</textarea>
                </div>
                <div class="col-md-4">
                    <label class="form-label small fw-semibold">Đáp án đúng</label>
                    <input type="text" class="form-control reading-part1-answer" value="${data.answer || ''}">
                </div>
            </div>
        `;

        const removeBtn = wrapper.querySelector('button');
        removeBtn.addEventListener('click', () => {
            wrapper.remove();
            refreshPart1Indexes();
        });

        return wrapper;
    }

    function refreshPart1Indexes() {
        const items = refs.part1Container.querySelectorAll('.reading-part1-item');
        items.forEach((item, index) => {
            const badge = item.querySelector('.reading-part1-index');
            if (badge) badge.textContent = index + 1;
        });
    }

    function createPart4QuestionRow(data = {}) {
        const wrapper = document.createElement('div');
        wrapper.className = 'reading-part4-item border rounded p-3 mb-3';
        wrapper.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Câu hỏi <span class="reading-part4-index"></span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-9">
                    <label class="form-label small fw-semibold">Nội dung câu hỏi</label>
                    <input type="text" class="form-control reading-part4-prompt" value="${data.prompt || ''}">
                </div>
                <div class="col-md-3">
                    <label class="form-label small fw-semibold">Đáp án đúng (A/B/C/D)</label>
                    <input type="text" class="form-control reading-part4-answer text-uppercase" maxlength="1" value="${data.answer || ''}">
                </div>
            </div>
        `;

        wrapper.querySelector('button').addEventListener('click', () => {
            wrapper.remove();
            refreshPart4Indexes();
        });

        return wrapper;
    }

    function refreshPart4Indexes() {
        const items = refs.part4Questions.querySelectorAll('.reading-part4-item');
        items.forEach((item, index) => {
            const label = item.querySelector('.reading-part4-index');
            if (label) label.textContent = index + 1;
        });
    }

    function createPart5ParagraphRow(data = {}) {
        const wrapper = document.createElement('div');
        wrapper.className = 'reading-part5-paragraph border rounded p-3 mb-3';
        wrapper.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">Đoạn <span class="reading-part5-index"></span></h6>
                <button type="button" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            <div class="row g-2">
                <div class="col-md-9">
                    <label class="form-label small fw-semibold">Nội dung đoạn</label>
                    <textarea class="form-control reading-part5-text" rows="3">${data.text || ''}</textarea>
                </div>
                <div class="col-md-3">
                    <label class="form-label small fw-semibold">Đáp án (tiêu đề)</label>
                    <input type="text" class="form-control reading-part5-answer" value="${data.answer || ''}" placeholder="Ví dụ: The unique feeling of achievement">
                </div>
            </div>
        `;
        wrapper.querySelector('button').addEventListener('click', () => {
            wrapper.remove();
            refreshPart5Indexes();
        });
        return wrapper;
    }

    function refreshPart5Indexes() {
        const items = refs.part5Paragraphs.querySelectorAll('.reading-part5-paragraph');
        items.forEach((item, index) => {
            const badge = item.querySelector('.reading-part5-index');
            if (badge) badge.textContent = index + 1;
        });
    }

    function resetForm() {
        state.editingId = null;
        refs.formTitle.textContent = 'Tạo bộ đề Reading';
        refs.titleInput.value = '';
        refs.durationInput.value = 35;
        refs.descriptionInput.value = '';
        refs.part1Intro.value = '';
        refs.part1Container.innerHTML = '';
        refs.part2Topic.value = '';
        refs.part2Sentences.value = '';
        if (refs.part3Topic) {
            refs.part3Topic.value = '';
        }
        if (refs.part3Sentences) {
            refs.part3Sentences.value = '';
        }
        refs.part4Topic.value = '';
        refs.part4Intro.value = '';
        refs.part4TextA.value = '';
        refs.part4TextB.value = '';
        refs.part4TextC.value = '';
        refs.part4TextD.value = '';
        refs.part4Questions.innerHTML = '';
        refs.part5Topic.value = '';
        refs.part5Options.value = '-- Chọn --';
        refs.part5Paragraphs.innerHTML = '';
        refs.part5Keyword.value = '';
        refs.part5Meo.value = '';

        for (let i = 0; i < 5; i += 1) {
            refs.part1Container.appendChild(createPart1QuestionRow());
        }
        refreshPart1Indexes();

        for (let i = 0; i < 7; i += 1) {
            refs.part4Questions.appendChild(createPart4QuestionRow());
        }
        refreshPart4Indexes();

        for (let i = 0; i < 7; i += 1) {
            refs.part5Paragraphs.appendChild(createPart5ParagraphRow());
        }
        refreshPart5Indexes();
    }

    async function loadReadingSets() {
        try {
            refs.list.innerHTML = '<div class="text-muted small"><i class="spinner-border spinner-border-sm me-2"></i>Đang tải bộ đề...</div>';
            const response = await fetch('/api/practice_sets/list?type=reading');
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể tải danh sách');
            }
            state.sets = result.sets || [];
            renderReadingSetList();
        } catch (error) {
            console.error('Load practice sets error:', error);
            refs.list.innerHTML = `<div class="alert alert-danger">Lỗi tải danh sách: ${error.message}</div>`;
        }
    }

    function renderReadingSetList() {
        refs.list.innerHTML = '';
        if (!state.sets.length) {
            refs.emptyState.style.display = 'block';
            return;
        }
        refs.emptyState.style.display = 'none';

        state.sets.forEach(set => {
            const card = document.createElement('div');
            card.className = 'reading-set-card';
            card.innerHTML = `
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                    <div>
                        <h5 class="mb-1">${set.title}</h5>
                        <p class="mb-1 text-muted small">Thời lượng: ${set.duration_minutes || 35} phút · Ngày tạo: ${new Date(set.created_at).toLocaleDateString('vi-VN')}</p>
                        ${set.description ? `<p class="mb-0">${set.description}</p>` : ''}
                    </div>
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-outline-primary btn-sm" data-action="open" data-id="${set.id}">
                            <i class="bi bi-pencil me-1"></i>Chỉnh sửa
                        </button>
                        <button class="btn btn-outline-success btn-sm" data-action="view" data-id="${set.id}">
                            <i class="bi bi-box-arrow-up-right me-1"></i>Mở trang học
                        </button>
                        <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${set.id}">
                            <i class="bi bi-trash me-1"></i>Xoá
                        </button>
                    </div>
                </div>
            `;
            refs.list.appendChild(card);
        });

        refs.list.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', async e => {
                const setId = e.currentTarget.dataset.id;
                const action = e.currentTarget.dataset.action;
                if (!setId) return;
                if (action === 'view') {
                    window.open(`reading_bode_set.html?set=${setId}`, '_blank');
                } else if (action === 'open') {
                    openReadingSetForm(setId);
                } else if (action === 'delete') {
                    deleteReadingSet(setId);
                }
            });
        });
    }

    async function openReadingSetForm(setId) {
        refs.formCard.style.display = 'block';
        refs.saveBtn.disabled = false;
        refs.saveBtn.innerHTML = '<i class="bi bi-cloud-arrow-up me-2"></i>Lưu bộ đề';

        if (!setId) {
            resetForm();
            return;
        }

        try {
            refs.formTitle.textContent = 'Đang tải dữ liệu bộ đề...';
            const response = await fetch(`/api/practice_sets/get?id=${setId}`, {
                headers: buildAuthHeaders()
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể tải bộ đề');
            }
            patchFormWithData(result.set);
        } catch (error) {
            alert(`Lỗi tải bộ đề: ${error.message}`);
        }
    }

    function patchFormWithData(set) {
        if (!set || !set.data) {
            resetForm();
            return;
        }
        const data = set.data || {};
        state.editingId = set.id;
        refs.formTitle.textContent = `Chỉnh sửa: ${set.title}`;
        refs.titleInput.value = set.title || '';
        refs.durationInput.value = set.duration_minutes || 35;
        refs.descriptionInput.value = set.description || '';

        refs.part1Intro.value = data.part1?.intro || '';
        refs.part1Container.innerHTML = '';
        (data.part1?.questions || []).forEach(q => refs.part1Container.appendChild(createPart1QuestionRow(q)));
        if (!refs.part1Container.children.length) {
            for (let i = 0; i < 5; i += 1) {
                refs.part1Container.appendChild(createPart1QuestionRow());
            }
        }
        refreshPart1Indexes();

        const part2Question2 = data.part2?.question2 || {
            topic: data.part2?.topic || '',
            sentences: data.part2?.sentences || []
        };
        const part2Question3 = data.part2?.question3 || null;
        refs.part2Topic.value = part2Question2.topic || '';
        refs.part2Sentences.value = (part2Question2.sentences || []).join('\n');
        if (refs.part3Topic) {
            refs.part3Topic.value = part2Question3?.topic || '';
        }
        if (refs.part3Sentences) {
            refs.part3Sentences.value = (part2Question3?.sentences || []).join('\n');
        }

        refs.part4Topic.value = data.part4?.topic || '';
        refs.part4Intro.value = data.part4?.intro || '';
        refs.part4TextA.value = data.part4?.paragraphs?.A || '';
        refs.part4TextB.value = data.part4?.paragraphs?.B || '';
        refs.part4TextC.value = data.part4?.paragraphs?.C || '';
        refs.part4TextD.value = data.part4?.paragraphs?.D || '';
        refs.part4Questions.innerHTML = '';
        (data.part4?.questions || []).forEach(q => refs.part4Questions.appendChild(createPart4QuestionRow(q)));
        if (!refs.part4Questions.children.length) {
            for (let i = 0; i < 7; i += 1) {
                refs.part4Questions.appendChild(createPart4QuestionRow());
            }
        }
        refreshPart4Indexes();

        refs.part5Topic.value = data.part5?.topic || '';
        refs.part5Options.value = (data.part5?.options || ['-- Chọn --']).join('\n');
        refs.part5Paragraphs.innerHTML = '';
        (data.part5?.paragraphs || []).forEach(p => refs.part5Paragraphs.appendChild(createPart5ParagraphRow(p)));
        if (!refs.part5Paragraphs.children.length) {
            for (let i = 0; i < 7; i += 1) {
                refs.part5Paragraphs.appendChild(createPart5ParagraphRow());
            }
        }
        refreshPart5Indexes();
        refs.part5Keyword.value = data.part5?.tips?.keyword || '';
        refs.part5Meo.value = data.part5?.tips?.meo || '';
    }

    function collectFormData() {
        const title = refs.titleInput.value.trim();
        if (!title) {
            throw new Error('Vui lòng nhập tiêu đề bộ đề');
        }

        const part1Questions = Array.from(refs.part1Container.querySelectorAll('.reading-part1-item')).map(item => {
            const start = item.querySelector('.reading-part1-start')?.value.trim();
            const end = item.querySelector('.reading-part1-end')?.value.trim();
            const answer = item.querySelector('.reading-part1-answer')?.value.trim();
            const optionsRaw = item.querySelector('.reading-part1-options')?.value || '';
            const options = optionsRaw
                .split(/\r?\n|,/)
                .map(opt => opt.trim())
                .filter(Boolean);
            if (!start || !end || !answer) {
                throw new Error('Part 1: mỗi câu cần đủ phần đầu/cuối và đáp án.');
            }
            if (options.length < 2) {
                throw new Error('Part 1: mỗi câu cần ít nhất 2 lựa chọn.');
            }
            if (!options.includes(answer)) {
                options.push(answer);
            }
            return { start, end, answer, options };
        });

        if (part1Questions.length < 3) {
            throw new Error('Part 1 cần ít nhất 3 câu.');
        }

        const part2Question2 = {
            topic: refs.part2Topic.value.trim(),
            sentences: (refs.part2Sentences.value || '')
                .split(/\r?\n/)
                .map(sentence => sentence.trim())
                .filter(Boolean)
        };
        if (!part2Question2.topic || part2Question2.sentences.length < 4) {
            throw new Error('Part 2 (Question 2) cần topic và tối thiểu 4 câu.');
        }

        const part2Question3 = {
            topic: refs.part3Topic?.value.trim() || '',
            sentences: (refs.part3Sentences?.value || '')
            .split(/\r?\n/)
            .map(sentence => sentence.trim())
                .filter(Boolean)
        };
        if (!part2Question3.topic || part2Question3.sentences.length < 4) {
            throw new Error('Part 2 (Question 3) cần topic và tối thiểu 4 câu.');
        }

        const part4Topic = refs.part4Topic.value.trim();
        const part4Intro = refs.part4Intro.value.trim();
        const paragraphs = {
            A: refs.part4TextA.value.trim(),
            B: refs.part4TextB.value.trim(),
            C: refs.part4TextC.value.trim(),
            D: refs.part4TextD.value.trim()
        };
        if (!part4Topic || !paragraphs.A || !paragraphs.B || !paragraphs.C || !paragraphs.D) {
            throw new Error('Part 4 cần đủ topic và 4 đoạn A/B/C/D.');
        }
        const part4Questions = Array.from(refs.part4Questions.querySelectorAll('.reading-part4-item')).map(item => {
            const prompt = item.querySelector('.reading-part4-prompt')?.value.trim();
            const answer = (item.querySelector('.reading-part4-answer')?.value || '').trim().toUpperCase();
            if (!prompt || !['A', 'B', 'C', 'D'].includes(answer)) {
                throw new Error('Part 4: mỗi câu hỏi cần nội dung và đáp án A/B/C/D.');
            }
            return { prompt, answer };
        });
        if (part4Questions.length < 4) {
            throw new Error('Part 4 nên có tối thiểu 4 câu hỏi.');
        }

        const part5Topic = refs.part5Topic.value.trim();
        let options = (refs.part5Options.value || '')
            .split(/\r?\n/)
            .map(opt => opt.trim())
            .filter(Boolean);
        if (!options.length) {
            options = ['-- Chọn --'];
        }
        if (options[0] !== '' && options[0] !== '-- Chọn --') {
            options.unshift('');
        }
        const part5Paragraphs = Array.from(refs.part5Paragraphs.querySelectorAll('.reading-part5-paragraph')).map(item => {
            const text = item.querySelector('.reading-part5-text')?.value.trim();
            const answer = item.querySelector('.reading-part5-answer')?.value.trim();
            if (!text || !answer) {
                throw new Error('Part 5: mỗi đoạn cần nội dung và đáp án.');
            }
            return { text, answer };
        });
        if (!part5Topic || part5Paragraphs.length < 5) {
            throw new Error('Part 5 cần topic và tối thiểu 5 đoạn.');
        }

        return {
            title,
            description: refs.descriptionInput.value.trim(),
            duration_minutes: parseInt(refs.durationInput.value, 10) || 35,
            data: {
                part1: {
                    intro: refs.part1Intro.value.trim(),
                    questions: part1Questions
                },
                part2: {
                    question2: part2Question2,
                    question3: part2Question3,
                    topic: part2Question2.topic,
                    sentences: part2Question2.sentences
                },
                part4: {
                    topic: part4Topic,
                    intro: part4Intro,
                    paragraphs,
                    questions: part4Questions
                },
                part5: {
                    topic: part5Topic,
                    options,
                    paragraphs: part5Paragraphs,
                    tips: {
                        keyword: refs.part5Keyword.value.trim(),
                        meo: refs.part5Meo.value.trim()
                    }
                }
            }
        };
    }

    async function saveReadingSet() {
        try {
            refs.saveBtn.disabled = true;
            refs.saveBtn.innerHTML = '<i class="spinner-border spinner-border-sm me-2"></i>Đang lưu...';
            const payload = collectFormData();
            const isEditing = Boolean(state.editingId);
            const url = isEditing ? `/api/practice_sets/update?id=${state.editingId}` : '/api/practice_sets/create';
            const method = isEditing ? 'PUT' : 'POST';
            const headers = buildAuthHeaders({
                'Content-Type': 'application/json'
            });
            
            console.log('Saving practice set:', { url, method, payload: { ...payload, data: '...' } });
            
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload)
            });
            // Check if response is ok before parsing JSON
            if (!response.ok) {
                let errorMessage = 'Không thể lưu bộ đề';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                    // If response is not JSON, try to get text
                    try {
                        const errorText = await response.text();
                        errorMessage = errorText || errorMessage;
                    } catch (textError) {
                        errorMessage = `Server error: ${response.status} ${response.statusText}`;
                    }
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.error || 'Không thể lưu bộ đề');
            }

            alert('Lưu bộ đề thành công!');
            refs.formCard.style.display = 'none';
            await loadReadingSets();
        } catch (error) {
            console.error('Save practice set error:', error);
            
            // Handle specific error types
            let errorMessage = error.message || 'Có lỗi xảy ra khi lưu bộ đề';
            
            if (error.message === 'AUTH_TOKEN_MISSING') {
                errorMessage = 'Bạn chưa đăng nhập. Vui lòng đăng nhập lại.';
            } else if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra:\n' +
                    '1. Server đang chạy (vercel dev)\n' +
                    '2. Kết nối mạng\n' +
                    '3. Console để xem lỗi chi tiết';
            }
            
            alert(errorMessage);
        } finally {
            refs.saveBtn.disabled = false;
            refs.saveBtn.innerHTML = '<i class="bi bi-cloud-arrow-up me-2"></i>Lưu bộ đề';
        }
    }

    async function deleteReadingSet(setId) {
        if (!confirm('Bạn có chắc muốn xoá bộ đề này?')) return;
        try {
            const headers = buildAuthHeaders();
            const response = await fetch(`/api/practice_sets/delete?id=${setId}`, {
                method: 'DELETE',
                headers
            });
            
            if (!response.ok) {
                let errorMessage = 'Không thể xoá bộ đề';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (parseError) {
                    errorMessage = `Server error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            alert('Đã xoá bộ đề');
            await loadReadingSets();
        } catch (error) {
            console.error('Delete practice set error:', error);
            if (error.message === 'AUTH_TOKEN_MISSING') {
                alert('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
            } else {
                alert(error.message || 'Có lỗi xảy ra khi xoá bộ đề');
            }
        }
    }

    function initEventListeners() {
        if (refs.createBtn) {
            refs.createBtn.addEventListener('click', () => {
                resetForm();
                refs.formCard.style.display = 'block';
                state.editingId = null;
            });
        }
        if (refs.refreshBtn) {
            refs.refreshBtn.addEventListener('click', loadReadingSets);
        }
        if (refs.cancelBtn) {
            refs.cancelBtn.addEventListener('click', () => {
                refs.formCard.style.display = 'none';
            });
        }
        if (refs.addPart1Btn) {
            refs.addPart1Btn.addEventListener('click', () => {
                refs.part1Container.appendChild(createPart1QuestionRow());
                refreshPart1Indexes();
            });
        }
        if (refs.addPart4Btn) {
            refs.addPart4Btn.addEventListener('click', () => {
                refs.part4Questions.appendChild(createPart4QuestionRow());
                refreshPart4Indexes();
            });
        }
        if (refs.addPart5Btn) {
            refs.addPart5Btn.addEventListener('click', () => {
                refs.part5Paragraphs.appendChild(createPart5ParagraphRow());
                refreshPart5Indexes();
            });
        }
        if (refs.saveBtn) {
            refs.saveBtn.addEventListener('click', saveReadingSet);
        }
    }

    function init() {
        toggleModules('single-part-module');
        bindModuleSwitch();
        resetForm();
        initEventListeners();
        loadReadingSets();
    }

    document.addEventListener('DOMContentLoaded', init);
})();


