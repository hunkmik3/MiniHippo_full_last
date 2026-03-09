(() => {
    const moduleRoot = document.getElementById('speaking-set-module');
    if (!moduleRoot) {
        return;
    }

    const refs = {
        list: document.getElementById('speaking-set-list'),
        empty: document.getElementById('speaking-set-empty'),
        formCard: document.getElementById('speaking-set-form-card'),
        formTitle: document.getElementById('speaking-set-form-title'),
        titleInput: document.getElementById('speaking-set-title'),
        durationInput: document.getElementById('speaking-set-duration'),
        descriptionInput: document.getElementById('speaking-set-description'),
        createBtn: document.getElementById('createSpeakingSetBtn'),
        refreshBtn: document.getElementById('refreshSpeakingSetsBtn'),
        cancelBtn: document.getElementById('cancelSpeakingSetBtn'),
        saveBtn: document.getElementById('saveSpeakingSetBtn')
    };

    const state = {
        sets: [],
        editingId: null,
        initialized: false,
        uploadControls: new Map()
    };

    const MEDIA_UPLOAD_CONFIGS = [
        { inputId: 'sp-intro-image', kind: 'image', dir: 'images/speaking/intro' },
        { inputId: 'sp-part1-intro-audio', kind: 'audio', dir: 'audio/speaking/part1' },
        { inputId: 'sp-part1-q1-audio', kind: 'audio', dir: 'audio/speaking/part1' },
        { inputId: 'sp-part1-q2-audio', kind: 'audio', dir: 'audio/speaking/part1' },
        { inputId: 'sp-part1-q3-audio', kind: 'audio', dir: 'audio/speaking/part1' },
        { inputId: 'sp-part2-intro-audio', kind: 'audio', dir: 'audio/speaking/part2' },
        { inputId: 'sp-part2-intro-image', kind: 'image', dir: 'images/speaking/part2' },
        { inputId: 'sp-part2-q1-audio', kind: 'audio', dir: 'audio/speaking/part2' },
        { inputId: 'sp-part2-q2-audio', kind: 'audio', dir: 'audio/speaking/part2' },
        { inputId: 'sp-part3-intro-audio', kind: 'audio', dir: 'audio/speaking/part3' },
        { inputId: 'sp-part3-left-image', kind: 'image', dir: 'images/speaking/part3' },
        { inputId: 'sp-part3-right-image', kind: 'image', dir: 'images/speaking/part3' },
        { inputId: 'sp-part3-q1-audio', kind: 'audio', dir: 'audio/speaking/part3' },
        { inputId: 'sp-part3-q2-audio', kind: 'audio', dir: 'audio/speaking/part3' },
        { inputId: 'sp-part4-intro-audio', kind: 'audio', dir: 'audio/speaking/part4' },
        { inputId: 'sp-part4-prep-image', kind: 'image', dir: 'images/speaking/part4' },
        { inputId: 'sp-part4-prep-question-audio', kind: 'audio', dir: 'audio/speaking/part4' },
        { inputId: 'sp-part4-prep-audio', kind: 'audio', dir: 'audio/speaking/part4' },
        { inputId: 'sp-part4-final-image', kind: 'image', dir: 'images/speaking/part4' },
        { inputId: 'sp-part4-final-audio', kind: 'audio', dir: 'audio/speaking/part4' }
    ];

    function escapeHtml(value) {
        if (value === undefined || value === null) return '';
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function getValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.value = value || '';
        }
    }

    function buildAuthHeaders(additionalHeaders = {}) {
        if (typeof window.buildAuthorizedHeaders === 'function') {
            return window.buildAuthorizedHeaders(additionalHeaders);
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            throw new Error('AUTH_TOKEN_MISSING');
        }

        return {
            Authorization: `Bearer ${token}`,
            ...additionalHeaders
        };
    }

    function sanitizeFileName(name) {
        const base = String(name || 'file')
            .toLowerCase()
            .replace(/[^\w.\-]+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '');
        return base || 'file';
    }

    function getFileExtension(name) {
        const match = String(name || '').toLowerCase().match(/(\.[a-z0-9]+)$/);
        return match ? match[1] : '';
    }

    function isAcceptedFile(file, kind) {
        if (!file) return false;
        const ext = getFileExtension(file.name);
        if (kind === 'audio') {
            return file.type.includes('audio/mpeg') || ext === '.mp3';
        }
        return ['.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext)
            || file.type.startsWith('image/');
    }

    function showUploadStatus(statusEl, type, message) {
        if (!statusEl) return;
        const classMap = {
            loading: 'text-info',
            success: 'text-success',
            error: 'text-danger',
            info: 'text-muted'
        };
        statusEl.className = `small mt-1 ${classMap[type] || 'text-muted'}`;
        statusEl.textContent = message || '';
    }

    function createPreviewElement(url, kind) {
        if (!url) return null;
        if (kind === 'audio') {
            const audio = document.createElement('audio');
            audio.controls = true;
            audio.src = url;
            audio.style.width = '100%';
            audio.style.maxWidth = '420px';
            return audio;
        }
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'preview';
        img.style.maxWidth = '220px';
        img.style.maxHeight = '150px';
        img.style.border = '1px solid #cbd5e1';
        img.style.borderRadius = '8px';
        img.style.objectFit = 'contain';
        img.style.background = '#f8fafc';
        return img;
    }

    function renderMediaPreview(previewEl, url, kind) {
        if (!previewEl) return;
        previewEl.innerHTML = '';
        const value = (url || '').trim();
        if (!value) return;
        const node = createPreviewElement(value, kind);
        if (node) previewEl.appendChild(node);
    }

    async function uploadMediaFile(file, filePath, message) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = String(reader.result || '').split(',')[1];
                if (!base64) {
                    reject(new Error('Không thể đọc nội dung file.'));
                    return;
                }

                try {
                    const response = await fetch('/api/upload-audio', {
                        method: 'POST',
                        headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
                        body: JSON.stringify({
                            filePath,
                            content: base64,
                            message
                        })
                    });

                    const text = await response.text();
                    if (!response.ok) {
                        let errorMessage = `Upload thất bại (${response.status})`;
                        try {
                            const errorJson = JSON.parse(text);
                            errorMessage = errorJson.error || errorJson.details || errorMessage;
                        } catch (parseError) {
                            errorMessage = text || errorMessage;
                        }
                        throw new Error(errorMessage);
                    }

                    let result;
                    try {
                        result = JSON.parse(text);
                    } catch (parseError) {
                        throw new Error(`Phản hồi không hợp lệ từ server: ${text.slice(0, 200)}`);
                    }

                    if (!result.rawUrl) {
                        throw new Error('Server không trả về URL file.');
                    }

                    resolve(result.rawUrl);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Không thể đọc file từ máy.'));
            reader.readAsDataURL(file);
        });
    }

    function setupMediaUploadControls() {
        MEDIA_UPLOAD_CONFIGS.forEach((config) => {
            const urlInput = document.getElementById(config.inputId);
            if (!urlInput || urlInput.dataset.uploadEnhanced === '1') {
                return;
            }

            urlInput.dataset.uploadEnhanced = '1';

            const helperWrap = document.createElement('div');
            helperWrap.className = 'mt-2';

            const helperText = document.createElement('div');
            helperText.className = 'form-text';
            helperText.textContent = `Hoặc upload ${config.kind === 'audio' ? 'audio' : 'ảnh'} từ máy:`;

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.className = 'form-control form-control-sm mt-1';
            fileInput.accept = config.kind === 'audio'
                ? 'audio/mp3,audio/mpeg,.mp3'
                : 'image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp,.gif';

            const statusEl = document.createElement('div');
            statusEl.className = 'small mt-1 text-muted';

            const previewEl = document.createElement('div');
            previewEl.className = 'mt-2';

            helperWrap.appendChild(helperText);
            helperWrap.appendChild(fileInput);
            helperWrap.appendChild(statusEl);
            helperWrap.appendChild(previewEl);

            const parent = urlInput.parentElement;
            if (parent) {
                parent.appendChild(helperWrap);
            }

            const refreshPreview = () => {
                renderMediaPreview(previewEl, urlInput.value, config.kind);
                if (urlInput.value && urlInput.value.trim()) {
                    showUploadStatus(statusEl, 'info', 'Đang dùng URL đã nhập.');
                } else {
                    showUploadStatus(statusEl, 'info', '');
                }
            };

            urlInput.addEventListener('input', refreshPreview);

            fileInput.addEventListener('change', async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                if (!isAcceptedFile(file, config.kind)) {
                    showUploadStatus(
                        statusEl,
                        'error',
                        config.kind === 'audio'
                            ? 'Vui lòng chọn file MP3.'
                            : 'Vui lòng chọn file ảnh (png/jpg/jpeg/webp/gif).'
                    );
                    fileInput.value = '';
                    return;
                }

                const ext = getFileExtension(file.name);
                const fileName = `${Date.now()}_${sanitizeFileName(file.name)}`;
                const finalFileName = ext && !fileName.endsWith(ext) ? `${fileName}${ext}` : fileName;
                const filePath = `${config.dir}/${finalFileName}`;

                showUploadStatus(statusEl, 'loading', 'Đang upload...');
                try {
                    const rawUrl = await uploadMediaFile(
                        file,
                        filePath,
                        `Upload ${config.kind} speaking: ${filePath}`
                    );
                    urlInput.value = rawUrl;
                    refreshPreview();
                    showUploadStatus(statusEl, 'success', 'Upload thành công.');
                } catch (error) {
                    showUploadStatus(statusEl, 'error', error.message || 'Upload thất bại.');
                } finally {
                    fileInput.value = '';
                }
            });

            state.uploadControls.set(config.inputId, {
                refreshPreview,
                statusEl
            });

            refreshPreview();
        });
    }

    function refreshAllUploadPreviews() {
        state.uploadControls.forEach((control) => {
            control.refreshPreview();
        });
    }

    function normalizeData(data) {
        const source = data && typeof data === 'object' ? data : {};
        const part1 = source.part1 && typeof source.part1 === 'object' ? source.part1 : {};
        const part2 = source.part2 && typeof source.part2 === 'object' ? source.part2 : {};
        const part3 = source.part3 && typeof source.part3 === 'object' ? source.part3 : {};
        const part4 = source.part4 && typeof source.part4 === 'object' ? source.part4 : {};
        const prepPage = part4.prepPage && typeof part4.prepPage === 'object' ? part4.prepPage : {};
        const finalPage = part4.finalPage && typeof part4.finalPage === 'object' ? part4.finalPage : {};

        function normalizeQuestions(rawQuestions, expectedCount) {
            const list = Array.isArray(rawQuestions) ? rawQuestions : [];
            return Array.from({ length: expectedCount }, (_, idx) => {
                const item = list[idx] || {};
                return {
                    prompt: item.prompt || item.question || '',
                    audioUrl: item.audioUrl || item.audio || ''
                };
            });
        }

        return {
            introPage: {
                title: source.introPage?.title || '',
                description: source.introPage?.description || '',
                imageUrl: source.introPage?.imageUrl || ''
            },
            part1: {
                introText: part1.introText || '',
                introAudioUrl: part1.introAudioUrl || '',
                questions: normalizeQuestions(part1.questions, 3)
            },
            part2: {
                introText: part2.introText || '',
                introAudioUrl: part2.introAudioUrl || '',
                imageUrl: part2.imageUrl || '',
                questions: normalizeQuestions(part2.questions, 2)
            },
            part3: {
                introText: part3.introText || '',
                introAudioUrl: part3.introAudioUrl || '',
                leftImageUrl: part3.leftImageUrl || '',
                rightImageUrl: part3.rightImageUrl || '',
                questions: normalizeQuestions(part3.questions, 2)
            },
            part4: {
                introText: part4.introText || '',
                introAudioUrl: part4.introAudioUrl || '',
                prepPage: {
                    instruction: prepPage.instruction || '',
                    imageUrl: prepPage.imageUrl || '',
                    questionAudioUrl: prepPage.questionAudioUrl || '',
                    prepAudioUrl: prepPage.prepAudioUrl || ''
                },
                finalPage: {
                    prompt: finalPage.prompt || '',
                    imageUrl: finalPage.imageUrl || '',
                    audioUrl: finalPage.audioUrl || ''
                }
            }
        };
    }

    function collectFormData() {
        return {
            introPage: {
                title: getValue('sp-intro-title'),
                description: getValue('sp-intro-description'),
                imageUrl: getValue('sp-intro-image')
            },
            part1: {
                introText: getValue('sp-part1-intro-text'),
                introAudioUrl: getValue('sp-part1-intro-audio'),
                questions: [1, 2, 3].map((index) => ({
                    prompt: getValue(`sp-part1-q${index}-prompt`),
                    audioUrl: getValue(`sp-part1-q${index}-audio`)
                }))
            },
            part2: {
                introText: getValue('sp-part2-intro-text'),
                introAudioUrl: getValue('sp-part2-intro-audio'),
                imageUrl: getValue('sp-part2-intro-image'),
                questions: [1, 2].map((index) => ({
                    prompt: getValue(`sp-part2-q${index}-prompt`),
                    audioUrl: getValue(`sp-part2-q${index}-audio`)
                }))
            },
            part3: {
                introText: getValue('sp-part3-intro-text'),
                introAudioUrl: getValue('sp-part3-intro-audio'),
                leftImageUrl: getValue('sp-part3-left-image'),
                rightImageUrl: getValue('sp-part3-right-image'),
                questions: [1, 2].map((index) => ({
                    prompt: getValue(`sp-part3-q${index}-prompt`),
                    audioUrl: getValue(`sp-part3-q${index}-audio`)
                }))
            },
            part4: {
                introText: getValue('sp-part4-intro-text'),
                introAudioUrl: getValue('sp-part4-intro-audio'),
                prepPage: {
                    instruction: getValue('sp-part4-prep-instruction'),
                    imageUrl: getValue('sp-part4-prep-image'),
                    questionAudioUrl: getValue('sp-part4-prep-question-audio'),
                    prepAudioUrl: getValue('sp-part4-prep-audio')
                },
                finalPage: {
                    prompt: getValue('sp-part4-final-prompt'),
                    imageUrl: getValue('sp-part4-final-image'),
                    audioUrl: getValue('sp-part4-final-audio')
                }
            }
        };
    }

    function fillForm(set) {
        const normalized = normalizeData(set?.data);

        setValue('speaking-set-title', set?.title || '');
        setValue('speaking-set-duration', set?.duration_minutes || 15);
        setValue('speaking-set-description', set?.description || '');

        setValue('sp-intro-title', normalized.introPage.title);
        setValue('sp-intro-description', normalized.introPage.description);
        setValue('sp-intro-image', normalized.introPage.imageUrl);

        setValue('sp-part1-intro-text', normalized.part1.introText);
        setValue('sp-part1-intro-audio', normalized.part1.introAudioUrl);
        [1, 2, 3].forEach((index) => {
            setValue(`sp-part1-q${index}-prompt`, normalized.part1.questions[index - 1]?.prompt || '');
            setValue(`sp-part1-q${index}-audio`, normalized.part1.questions[index - 1]?.audioUrl || '');
        });

        setValue('sp-part2-intro-text', normalized.part2.introText);
        setValue('sp-part2-intro-audio', normalized.part2.introAudioUrl);
        setValue('sp-part2-intro-image', normalized.part2.imageUrl);
        [1, 2].forEach((index) => {
            setValue(`sp-part2-q${index}-prompt`, normalized.part2.questions[index - 1]?.prompt || '');
            setValue(`sp-part2-q${index}-audio`, normalized.part2.questions[index - 1]?.audioUrl || '');
        });

        setValue('sp-part3-intro-text', normalized.part3.introText);
        setValue('sp-part3-intro-audio', normalized.part3.introAudioUrl);
        setValue('sp-part3-left-image', normalized.part3.leftImageUrl);
        setValue('sp-part3-right-image', normalized.part3.rightImageUrl);
        [1, 2].forEach((index) => {
            setValue(`sp-part3-q${index}-prompt`, normalized.part3.questions[index - 1]?.prompt || '');
            setValue(`sp-part3-q${index}-audio`, normalized.part3.questions[index - 1]?.audioUrl || '');
        });

        setValue('sp-part4-intro-text', normalized.part4.introText);
        setValue('sp-part4-intro-audio', normalized.part4.introAudioUrl);
        setValue('sp-part4-prep-instruction', normalized.part4.prepPage.instruction);
        setValue('sp-part4-prep-image', normalized.part4.prepPage.imageUrl);
        setValue('sp-part4-prep-question-audio', normalized.part4.prepPage.questionAudioUrl);
        setValue('sp-part4-prep-audio', normalized.part4.prepPage.prepAudioUrl);
        setValue('sp-part4-final-prompt', normalized.part4.finalPage.prompt);
        setValue('sp-part4-final-image', normalized.part4.finalPage.imageUrl);
        setValue('sp-part4-final-audio', normalized.part4.finalPage.audioUrl);

        refreshAllUploadPreviews();
    }

    function resetForm() {
        state.editingId = null;
        if (refs.formTitle) {
            refs.formTitle.textContent = 'Tạo bộ đề Speaking';
        }
        fillForm({
            title: '',
            duration_minutes: 15,
            description: '',
            data: {}
        });
    }

    function showForm() {
        if (refs.formCard) {
            refs.formCard.style.display = 'block';
        }
    }

    function hideForm() {
        if (refs.formCard) {
            refs.formCard.style.display = 'none';
        }
    }

    function renderList() {
        if (!refs.list) return;

        if (!state.sets.length) {
            refs.list.innerHTML = '';
            if (refs.empty) refs.empty.style.display = 'block';
            return;
        }

        if (refs.empty) refs.empty.style.display = 'none';
        refs.list.innerHTML = state.sets.map((set) => {
            const dateText = set.created_at ? new Date(set.created_at).toLocaleString('vi-VN') : '—';
            return `
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                        <div>
                            <h5 class="mb-1 text-primary"><i class="bi bi-mic me-2"></i>${escapeHtml(set.title || 'Bộ đề Speaking')}</h5>
                            <div class="small text-muted">
                                <span class="me-3"><i class="bi bi-clock me-1"></i>${escapeHtml(String(set.duration_minutes || 15))} phút</span>
                                <span><i class="bi bi-calendar3 me-1"></i>${escapeHtml(dateText)}</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <a href="speaking_question.html?set=${encodeURIComponent(set.id)}" target="_blank" class="btn btn-sm btn-outline-info">
                                <i class="bi bi-eye me-1"></i>Preview
                            </a>
                            <button class="btn btn-sm btn-outline-primary" onclick="window.editSpeakingSet('${set.id}')">
                                <i class="bi bi-pencil me-1"></i>Sửa
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="window.deleteSpeakingSet('${set.id}')">
                                <i class="bi bi-trash me-1"></i>Xóa
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    async function loadSpeakingSets() {
        if (!refs.list) return;
        refs.list.innerHTML = '<div class="text-center py-4 text-muted"><span class="spinner-border spinner-border-sm me-2"></span>Đang tải bộ đề Speaking...</div>';
        if (refs.empty) refs.empty.style.display = 'none';

        try {
            const response = await fetch('/api/practice_sets/list?type=speaking');
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Không thể tải bộ đề Speaking');
            }
            state.sets = Array.isArray(result.sets) ? result.sets : [];
            renderList();
        } catch (error) {
            refs.list.innerHTML = `<div class="alert alert-danger mb-0">${escapeHtml(error.message || 'Lỗi tải dữ liệu')}</div>`;
        }
    }

    async function saveSpeakingSet() {
        const title = refs.titleInput?.value.trim();
        if (!title) {
            alert('Vui lòng nhập tiêu đề bộ đề Speaking.');
            return;
        }

        const payload = {
            title,
            type: 'speaking',
            description: refs.descriptionInput?.value.trim() || '',
            duration_minutes: Number(refs.durationInput?.value || 15) || 15,
            data: collectFormData()
        };

        const isUpdate = Boolean(state.editingId);
        const url = isUpdate
            ? `/api/practice_sets/update?id=${encodeURIComponent(state.editingId)}`
            : '/api/practice_sets/create';
        const method = isUpdate ? 'PUT' : 'POST';

        if (refs.saveBtn) {
            refs.saveBtn.disabled = true;
            refs.saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';
        }

        try {
            const response = await fetch(url, {
                method,
                headers: buildAuthHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Không thể lưu bộ đề Speaking');
            }

            alert('Đã lưu bộ đề Speaking thành công.');
            hideForm();
            resetForm();
            await loadSpeakingSets();
        } catch (error) {
            if (error.message === 'AUTH_TOKEN_MISSING') {
                alert('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.');
            } else {
                alert(error.message || 'Không thể lưu bộ đề Speaking.');
            }
        } finally {
            if (refs.saveBtn) {
                refs.saveBtn.disabled = false;
                refs.saveBtn.innerHTML = '<i class="bi bi-save me-2"></i>Lưu bộ đề Speaking';
            }
        }
    }

    window.editSpeakingSet = function (id) {
        const set = state.sets.find(item => item.id === id);
        if (!set) {
            alert('Không tìm thấy bộ đề cần chỉnh sửa.');
            return;
        }
        state.editingId = set.id;
        if (refs.formTitle) {
            refs.formTitle.textContent = `Chỉnh sửa bộ đề Speaking: ${set.title || ''}`;
        }
        fillForm(set);
        showForm();
    };

    window.deleteSpeakingSet = async function (id) {
        if (!confirm('Bạn có chắc muốn xóa bộ đề Speaking này?')) {
            return;
        }

        try {
            const response = await fetch(`/api/practice_sets/delete?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
                headers: buildAuthHeaders()
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Không thể xóa bộ đề Speaking');
            }
            await loadSpeakingSets();
        } catch (error) {
            if (error.message === 'AUTH_TOKEN_MISSING') {
                alert('Bạn chưa đăng nhập hoặc phiên đã hết hạn. Vui lòng đăng nhập lại.');
            } else {
                alert(error.message || 'Không thể xóa bộ đề Speaking.');
            }
        }
    };

    function bindEvents() {
        refs.createBtn?.addEventListener('click', () => {
            resetForm();
            showForm();
        });

        refs.cancelBtn?.addEventListener('click', () => {
            hideForm();
            resetForm();
        });

        refs.refreshBtn?.addEventListener('click', loadSpeakingSets);
        refs.saveBtn?.addEventListener('click', saveSpeakingSet);
    }

    window.initSpeakingSetsModule = function () {
        if (!state.initialized) {
            setupMediaUploadControls();
            bindEvents();
            resetForm();
            state.initialized = true;
        }
        loadSpeakingSets();
    };

    document.addEventListener('DOMContentLoaded', () => {
        window.initSpeakingSetsModule();
    });
})();
