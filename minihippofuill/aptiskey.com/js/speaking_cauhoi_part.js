(function () {
    var query = new URLSearchParams(window.location.search);
    var setId = query.get('set');
    var buoiId = query.get('buoi'); // e.g. "B2-5"
    var classId = query.get('classId') || '';
    var sessionFromQuery = Number(query.get('session')) || 0;
    var bandFromQuery = query.get('band') || '';
    var CACHE_PREFIX = 'speaking_cauhoi_cache_';
    var cacheKey = setId ? CACHE_PREFIX + setId : null;

    // ── Inline data for Lớp Học buổi speaking ──
    var BUOI_SPEAKING_DATA = {
        'B1-6': {
            id: 'buoi-b1-6', title: 'B1 Buổi 6 - Speaking Part 1',
            type: 'speaking',
            data: {
                part: 1,
                pages: [{
                    questions: [
                        { prompt: 'What do you enjoy doing in your free time?' },
                        { prompt: 'Tell me about your favourite place to visit.' },
                        { prompt: 'What kind of food do you like? Why?' },
                        { prompt: 'Do you prefer studying alone or with other people? Why?' },
                        { prompt: 'What would you like to do in the future?' }
                    ]
                }]
            }
        },
        'B2-5': {
            id: 'buoi-b2-5', title: 'B2 Buổi 5 - Speaking Part 1',
            type: 'speaking',
            data: {
                part: 1,
                pages: [{
                    questions: [
                        { prompt: 'What do you like to do on weekends?' },
                        { prompt: 'Tell me about a teacher who influenced you.' },
                        { prompt: 'Do you prefer living in the city or the countryside? Why?' },
                        { prompt: 'What is the most useful thing you have learned recently?' },
                        { prompt: 'If you could travel anywhere, where would you go and why?' }
                    ]
                }]
            }
        }
    };

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
        recordings: {},
        recordingActive: null,
        recorderRefs: {},
        setId: '',
        setTitle: '',
        headerTitle: '',
        startAt: Date.now(),
        currentAudioElements: []
    };

    var accessContext = {
        user: null,
        classSet: null,
        sessionMeta: null,
        locked: false,
        lockReason: ''
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

    function supportsAudioRecording() {
        return Boolean(window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    function pickRecordingMimeType() {
        if (!window.MediaRecorder || typeof window.MediaRecorder.isTypeSupported !== 'function') {
            return '';
        }
        var preferred = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/ogg;codecs=opus',
            'audio/mp4'
        ];
        for (var i = 0; i < preferred.length; i += 1) {
            if (window.MediaRecorder.isTypeSupported(preferred[i])) {
                return preferred[i];
            }
        }
        return '';
    }

    function extensionFromMimeType(mimeType) {
        var value = String(mimeType || '').toLowerCase();
        if (value.indexOf('audio/mpeg') >= 0) return 'mp3';
        if (value.indexOf('audio/ogg') >= 0) return 'ogg';
        if (value.indexOf('audio/wav') >= 0) return 'wav';
        if (value.indexOf('audio/mp4') >= 0 || value.indexOf('audio/x-m4a') >= 0) return 'm4a';
        return 'webm';
    }

    function sanitizeFileSegment(value, fallback) {
        var safe = String(value || '')
            .trim()
            .replace(/[^\w.-]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return safe || String(fallback || 'item');
    }

    function buildRecordingFilePath(key, extension) {
        var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        var userCode = sanitizeFileSegment(
            (user && (user.accountCode || user.username || user.id)) || 'user',
            'user'
        );
        var setCode = sanitizeFileSegment(practiceState.setId || (buoiId || 'speaking_part'), 'set');
        var answerCode = sanitizeFileSegment(key || 'answer', 'answer');
        var stamp = new Date().toISOString().replace(/[:.]/g, '-');
        var dateFolder = stamp.slice(0, 10);
        return 'audio/speaking_submissions/' + dateFolder + '/' + userCode + '/' + setCode + '_' + answerCode + '_' + stamp + '.' + extension;
    }

    function extractApiErrorMessage(data, fallback) {
        if (data && typeof data === 'object') {
            if (data.error && data.details) return data.error + ' (' + data.details + ')';
            if (data.error) return data.error;
            if (data.details) return data.details;
        }
        return fallback;
    }

    function blobToBase64(blob) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function () {
                var result = String(reader.result || '');
                var marker = 'base64,';
                var markerIndex = result.indexOf(marker);
                if (markerIndex < 0) {
                    reject(new Error('Không thể chuyển bản ghi âm sang base64.'));
                    return;
                }
                resolve(result.slice(markerIndex + marker.length));
            };
            reader.onerror = function () {
                reject(new Error('Không thể đọc file ghi âm.'));
            };
            reader.readAsDataURL(blob);
        });
    }

    function revokeRecordingObjectUrl(recording) {
        if (recording && recording.objectUrl) {
            try {
                URL.revokeObjectURL(recording.objectUrl);
            } catch (error) {
                console.warn('Revoke recording url failed:', error);
            }
        }
    }

    function setRecordingStatusForKey(key, message, level) {
        var refs = practiceState.recorderRefs[key];
        if (!refs || !refs.status) return;

        refs.status.className = 'recording-status';
        if (level === 'success') refs.status.classList.add('text-success');
        if (level === 'warning') refs.status.classList.add('text-warning');
        if (level === 'danger') refs.status.classList.add('text-danger');
        refs.status.textContent = message;
    }

    function renderRecordingForKey(key) {
        var refs = practiceState.recorderRefs[key];
        if (!refs) return;

        var recording = practiceState.recordings[key] || null;
        var active = practiceState.recordingActive;
        var isCurrentRecording = Boolean(active && active.key === key);
        var supported = supportsAudioRecording();

        if (!supported) {
            refs.start.disabled = true;
            refs.stop.disabled = true;
            refs.clear.disabled = true;
            if (refs.audio) {
                refs.audio.pause();
                refs.audio.removeAttribute('src');
                refs.audio.style.display = 'none';
            }
            setRecordingStatusForKey(key, 'Trình duyệt này không hỗ trợ ghi âm trực tiếp.', 'danger');
            return;
        }

        refs.start.disabled = isCurrentRecording;
        refs.stop.disabled = !isCurrentRecording;
        refs.clear.disabled = !recording;

        if (refs.audio) {
            var source = recording && (recording.uploadedUrl || recording.objectUrl);
            if (source) {
                if (refs.audio.src !== source) refs.audio.src = source;
                refs.audio.style.display = 'block';
            } else {
                refs.audio.pause();
                refs.audio.removeAttribute('src');
                refs.audio.style.display = 'none';
            }
        }

        if (isCurrentRecording) {
            setRecordingStatusForKey(key, 'Đang ghi âm... Nhấn "Dừng" để kết thúc.', 'danger');
            return;
        }

        if (recording && recording.uploadedUrl) {
            setRecordingStatusForKey(key, 'Đã lưu file ghi âm thành công.', 'success');
            return;
        }

        if (recording && recording.blob) {
            setRecordingStatusForKey(key, 'Đã ghi âm xong. File sẽ được lưu khi nộp bài.', 'warning');
            return;
        }

        setRecordingStatusForKey(key, 'Chưa có bản ghi âm cho câu này.', 'muted');
    }

    async function uploadRecordingForKey(key) {
        var recording = practiceState.recordings[key];
        if (!recording || !recording.blob) return null;
        if (recording.uploadedUrl) return recording;
        if (recording.uploadPromise) return recording.uploadPromise;

        recording.uploadPromise = (async function () {
            var base64 = await blobToBase64(recording.blob);
            var extension = extensionFromMimeType(recording.mimeType);
            var fileName = (practiceState.setId || 'speaking_part') + '_' + key + '_' + Date.now() + '.' + extension;
            var filePath = buildRecordingFilePath(key, extension);
            var primaryPayload = {
                contentBase64: base64,
                fileName: fileName,
                mimeType: recording.mimeType || 'audio/webm',
                speakingSetId: practiceState.setId || (buoiId || 'speaking_part'),
                speakingPart: 'part' + String(practiceState.partNum || ''),
                answerKey: key
            };
            var primaryResult = await postJsonWithAuthRetry('/api/upload-speaking-recording', primaryPayload);
            var response = primaryResult.response;
            var data = primaryResult.data;

            if (!response.ok && response.status === 404) {
                var fallbackPayload = {
                    filePath: filePath,
                    content: base64,
                    message: 'Upload speaking recording ' + (practiceState.setId || 'speaking_part') + ' ' + key
                };
                var fallbackResult = await postJsonWithAuthRetry('/api/upload-audio', fallbackPayload);
                response = fallbackResult.response;
                data = fallbackResult.data;
                if (response.ok) {
                    recording.uploadedUrl = data.rawUrl || '';
                    recording.filePath = filePath;
                }
            }

            if (!response.ok) {
                throw new Error(extractApiErrorMessage(data, 'Không thể upload file ghi âm.'));
            }
            if (!recording.uploadedUrl) {
                recording.uploadedUrl = data.rawUrl || '';
            }
            if (!recording.filePath) {
                recording.filePath = data.filePath || filePath;
            }
            recording.uploadedAt = new Date().toISOString();
            return recording;
        })();

        try {
            return await recording.uploadPromise;
        } finally {
            recording.uploadPromise = null;
            renderRecordingForKey(key);
        }
    }

    async function postJsonWithAuthRetry(url, payload, allowRetry) {
        var retry = allowRetry !== false;
        var response = await fetch(url, {
            method: 'POST',
            headers: getAuthorizedHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify(payload || {})
        });

        if (response.status === 401 && retry && typeof refreshAuthToken === 'function') {
            var refreshedToken = await refreshAuthToken();
            if (refreshedToken) {
                return postJsonWithAuthRetry(url, payload, false);
            }
        }

        var data = await response.json().catch(function () { return {}; });
        return { response: response, data: data };
    }

    async function ensureRecordingsUploaded(answerRows) {
        var errors = [];
        var rows = Array.isArray(answerRows) ? answerRows : [];

        for (var i = 0; i < rows.length; i += 1) {
            var key = rows[i] && rows[i].key ? rows[i].key : '';
            var recording = key ? practiceState.recordings[key] : null;
            if (!recording || !recording.blob || recording.uploadedUrl) {
                continue;
            }
            try {
                setRecordingStatusForKey(key, 'Đang lưu file ghi âm lên server...', 'warning');
                await uploadRecordingForKey(key);
            } catch (error) {
                errors.push(key + ': ' + (error.message || 'Upload thất bại'));
            }
        }

        if (errors.length) {
            throw new Error('Không thể lưu một số file ghi âm:\n' + errors.join('\n'));
        }
    }

    async function stopActiveRecording(reason) {
        var active = practiceState.recordingActive;
        if (!active) return null;

        var recorder = active.mediaRecorder;
        var stream = active.stream;

        if (recorder && recorder.state !== 'inactive') {
            try {
                recorder.stop();
            } catch (error) {
                console.warn('Stop recording error:', error);
            }
        }

        var result = await active.stopPromise.catch(function (error) {
            console.warn('Stop recording promise error:', error);
            return null;
        });

        if (stream && typeof stream.getTracks === 'function') {
            stream.getTracks().forEach(function (track) {
                try { track.stop(); } catch (error) { }
            });
        }

        if (reason && reason !== 'manual' && reason !== 'submit') {
            setRecordingStatusForKey(active.key, 'Ghi âm đã dừng khi chuyển trang.', 'warning');
        }

        return result;
    }

    async function startRecordingForKey(key) {
        if (!key) return;

        if (!supportsAudioRecording()) {
            setRecordingStatusForKey(key, 'Trình duyệt không hỗ trợ ghi âm trực tiếp.', 'danger');
            return;
        }

        if (practiceState.recordingActive && practiceState.recordingActive.key !== key) {
            await stopActiveRecording('switch');
        }
        if (practiceState.recordingActive && practiceState.recordingActive.key === key) {
            return;
        }

        try {
            var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            var preferredType = pickRecordingMimeType();
            var options = preferredType ? { mimeType: preferredType } : undefined;
            var mediaRecorder = options ? new MediaRecorder(stream, options) : new MediaRecorder(stream);
            var chunks = [];
            var startedAt = Date.now();
            var resolveStop;
            var rejectStop;
            var stopPromise = new Promise(function (resolve, reject) {
                resolveStop = resolve;
                rejectStop = reject;
            });

            practiceState.recordingActive = {
                key: key,
                stream: stream,
                mediaRecorder: mediaRecorder,
                chunks: chunks,
                startedAt: startedAt,
                mimeType: mediaRecorder.mimeType || preferredType || 'audio/webm',
                stopPromise: stopPromise
            };

            mediaRecorder.addEventListener('dataavailable', function (event) {
                if (event.data && event.data.size > 0) {
                    chunks.push(event.data);
                }
            });

            mediaRecorder.addEventListener('error', function (event) {
                var err = event && event.error ? event.error : new Error('MediaRecorder error');
                if (typeof rejectStop === 'function') rejectStop(err);
                setRecordingStatusForKey(key, 'Không thể ghi âm. Vui lòng thử lại.', 'danger');
            });

            mediaRecorder.addEventListener('stop', function () {
                var active = practiceState.recordingActive;
                var elapsed = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
                if (!active || active.key !== key) {
                    if (typeof resolveStop === 'function') resolveStop(null);
                    practiceState.recordingActive = null;
                    return;
                }

                var blob = chunks.length ? new Blob(chunks, { type: active.mimeType || 'audio/webm' }) : null;
                if (blob && blob.size > 0) {
                    var previous = practiceState.recordings[key];
                    if (previous) revokeRecordingObjectUrl(previous);
                    practiceState.recordings[key] = {
                        blob: blob,
                        mimeType: blob.type || active.mimeType || 'audio/webm',
                        objectUrl: URL.createObjectURL(blob),
                        sizeBytes: blob.size,
                        durationSeconds: elapsed,
                        uploadedUrl: '',
                        filePath: '',
                        uploadedAt: '',
                        updatedAt: new Date().toISOString(),
                        uploadPromise: null
                    };
                    if (typeof resolveStop === 'function') resolveStop(practiceState.recordings[key]);
                } else if (typeof resolveStop === 'function') {
                    resolveStop(null);
                }

                practiceState.recordingActive = null;
                renderRecordingForKey(key);
            });

            mediaRecorder.start(250);
            renderRecordingForKey(key);
        } catch (error) {
            console.error('Start recording failed:', error);
            setRecordingStatusForKey(key, 'Không thể mở microphone. Hãy cấp quyền và thử lại.', 'danger');
        }
    }

    async function clearRecordingForKey(key) {
        if (!key) return;
        if (practiceState.recordingActive && practiceState.recordingActive.key === key) {
            await stopActiveRecording('clear');
        }
        var recording = practiceState.recordings[key];
        if (recording) {
            revokeRecordingObjectUrl(recording);
            delete practiceState.recordings[key];
        }
        renderRecordingForKey(key);
    }

    function cleanupRecordings() {
        Object.keys(practiceState.recordings).forEach(function (key) {
            revokeRecordingObjectUrl(practiceState.recordings[key]);
        });
        practiceState.recordings = {};
        if (practiceState.recordingActive && practiceState.recordingActive.stream) {
            practiceState.recordingActive.stream.getTracks().forEach(function (track) {
                try { track.stop(); } catch (error) { }
            });
        }
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

    function normalizeTextLower(value) {
        return typeof value === 'string' ? value.trim().toLowerCase() : '';
    }

    function normalizeBand(value) {
        var band = normalizeTextLower(value).toUpperCase();
        return band === 'B1' || band === 'B2' ? band : '';
    }

    function normalizeRole(value) {
        return typeof value === 'string' ? value.trim().toLowerCase() : '';
    }

    function isAdminUser(user) {
        return normalizeRole(user && user.role) === 'admin';
    }

    function resolveSessionNumber() {
        if (sessionFromQuery > 0) return sessionFromQuery;
        if (!buoiId) return 0;
        var parts = String(buoiId).split('-');
        if (parts.length < 2) return 0;
        return Number(parts[1]) || 0;
    }

    function resolveBand() {
        var fromBuoi = '';
        if (buoiId) {
            var parts = String(buoiId).split('-');
            fromBuoi = parts[0] || '';
        }
        return normalizeBand(bandFromQuery || fromBuoi);
    }

    function toDate(value) {
        if (!value) return null;
        var date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return date;
    }

    function dateDistanceDays(a, b) {
        if (!a || !b) return 9999;
        return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
    }

    async function apiGet(url, retryWithRefresh) {
        var retry = retryWithRefresh !== false;
        var response = await fetch(url, {
            method: 'GET',
            headers: getAuthorizedHeaders()
        });

        if (response.status === 401 && retry && typeof refreshAuthToken === 'function') {
            var refreshed = await refreshAuthToken();
            if (refreshed) return apiGet(url, false);
        }

        var data = await response.json().catch(function () { return {}; });
        if (!response.ok) {
            throw new Error(data.error || data.message || ('HTTP ' + response.status));
        }
        return data;
    }

    function scoreClassForBand(cls, band, user) {
        var data = cls && cls.data ? cls.data : {};
        var configuredBand = normalizeBand(data.band || data.band_code);
        if (configuredBand && configuredBand !== band) return -9999;

        var note = normalizeTextLower(user && user.notes);
        var title = normalizeTextLower((cls && (cls.title || data.name)) || '');
        var firstDate = toDate(data.first_date);
        var startedOn = toDate(user && (user.startedOn || user.started_on));
        var now = new Date();

        var score = 0;
        if (configuredBand === band) score += 90;
        if (!configuredBand) score += 20;
        if (note && title && note.indexOf(title) >= 0) score += 35;
        if (startedOn && firstDate && startedOn.toDateString() === firstDate.toDateString()) score += 40;
        if (startedOn && firstDate) score += Math.max(0, 20 - dateDistanceDays(startedOn, firstDate));
        if (!startedOn && firstDate && firstDate <= now) score += 8;
        return score;
    }

    function pickClassForBand(classes, band, user) {
        var ranked = (classes || [])
            .map(function (cls) {
                return { cls: cls, score: scoreClassForBand(cls, band, user) };
            })
            .filter(function (entry) {
                return entry.score > -9999;
            })
            .sort(function (a, b) {
                if (b.score !== a.score) return b.score - a.score;
                var ta = new Date((a.cls && (a.cls.updated_at || a.cls.created_at)) || 0).getTime();
                var tb = new Date((b.cls && (b.cls.updated_at || b.cls.created_at)) || 0).getTime();
                return tb - ta;
            });

        return ranked.length ? ranked[0].cls : null;
    }

    function resolveSessionMeta(classSet, sessionNumber) {
        var sessions = classSet && classSet.data && Array.isArray(classSet.data.sessions)
            ? classSet.data.sessions
            : [];
        return sessions.find(function (session) {
            return Number(session && session.number) === Number(sessionNumber);
        }) || null;
    }

    function formatDateTimeVi(date) {
        if (!date) return '';
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    async function resolveAccessContext() {
        if (!buoiId) return accessContext;

        var authOk = typeof checkAuth === 'function' ? await checkAuth() : true;
        if (!authOk) {
            accessContext.locked = true;
            accessContext.lockReason = 'Bạn cần đăng nhập lại để tiếp tục.';
            return accessContext;
        }

        var user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
        var isAdmin = isAdminUser(user);
        accessContext.user = user || null;
        var userBand = normalizeBand(user && user.band);
        var requestedBand = resolveBand();

        if (isAdmin) {
            var adminClasses = [];
            try {
                var adminPayload = await apiGet('/api/practice_sets/list?type=homework_class');
                adminClasses = Array.isArray(adminPayload && adminPayload.sets) ? adminPayload.sets : [];
            } catch (adminError) {
                console.warn('Load homework classes failed for admin:', adminError);
            }

            var adminBand = requestedBand || userBand || 'B1';
            var adminSessionNumber = resolveSessionNumber();
            var adminClass = null;

            if (classId) {
                adminClass = adminClasses.find(function (cls) {
                    return String(cls && cls.id) === String(classId);
                }) || null;
            }
            if (!adminClass) {
                adminClass = pickClassForBand(adminClasses, adminBand, user);
            }

            accessContext.classSet = adminClass || null;
            accessContext.sessionMeta = resolveSessionMeta(adminClass, adminSessionNumber) || null;
            accessContext.locked = false;
            accessContext.lockReason = '';
            return accessContext;
        }

        var course = normalizeTextLower(user && user.course);
        if (course === 'lớp ôn thi') {
            window.location.replace('home.html');
            accessContext.locked = true;
            accessContext.lockReason = 'Tài khoản này dùng giao diện ôn thi.';
            return accessContext;
        }

        if (course !== 'lớp học') {
            window.location.replace('home.html');
            accessContext.locked = true;
            accessContext.lockReason = 'Tài khoản này không thuộc module lớp học.';
            return accessContext;
        }

        if (!userBand) {
            accessContext.locked = true;
            accessContext.lockReason = 'Tài khoản lớp học chưa được gán band (B1/B2).';
            return accessContext;
        }

        if (requestedBand && requestedBand !== userBand) {
            window.location.replace('lop_hoc.html');
            accessContext.locked = true;
            accessContext.lockReason =
                'Bạn thuộc band ' + userBand + ', không thể truy cập band ' + requestedBand + '.';
            return accessContext;
        }

        var classes = [];
        try {
            var payload = await apiGet('/api/practice_sets/list?type=homework_class');
            classes = Array.isArray(payload && payload.sets) ? payload.sets : [];
        } catch (error) {
            console.warn('Load homework classes failed:', error);
        }

        var band = userBand || requestedBand || '';
        var sessionNumber = resolveSessionNumber();
        var selectedClass = null;

        if (classId) {
            selectedClass = classes.find(function (cls) {
                return String(cls && cls.id) === String(classId);
            }) || null;
        }
        if (!selectedClass) {
            selectedClass = pickClassForBand(classes, band, user);
        }

        var sessionMeta = resolveSessionMeta(selectedClass, sessionNumber);
        var deadline = toDate(sessionMeta && sessionMeta.deadline);
        var locked = !!deadline && Date.now() > deadline.getTime();

        accessContext.classSet = selectedClass || null;
        accessContext.sessionMeta = sessionMeta || null;
        accessContext.locked = locked;
        accessContext.lockReason = locked
            ? ('Buổi ' + sessionNumber + ' đã quá deadline (' + formatDateTimeVi(deadline) + ').')
            : '';

        return accessContext;
    }

    function ensureAccessOrFail() {
        if (!accessContext.locked) return true;
        showError(accessContext.lockReason || 'Buổi học đã bị khóa.');
        return false;
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
        if (practiceState.recordingActive) {
            stopActiveRecording('page-change');
        }
        clearTimer();
        stopCurrentAudios();
        practiceState.currentPage = index;

        renderCurrentPage();
        updatePageDots();
        updateNav();

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goNext() {
        if (!ensureAccessOrFail()) return;
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

        var recordingPanel = document.createElement('div');
        recordingPanel.className = 'recording-panel';

        var actions = document.createElement('div');
        actions.className = 'recording-actions';

        var startBtn = document.createElement('button');
        startBtn.type = 'button';
        startBtn.className = 'btn btn-sm btn-outline-danger';
        startBtn.innerHTML = '<i class="bi bi-mic-fill me-1"></i>Bắt đầu ghi âm';

        var stopBtn = document.createElement('button');
        stopBtn.type = 'button';
        stopBtn.className = 'btn btn-sm btn-outline-secondary';
        stopBtn.innerHTML = '<i class="bi bi-stop-fill me-1"></i>Dừng';
        stopBtn.disabled = true;

        var clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'btn btn-sm btn-outline-warning';
        clearBtn.innerHTML = '<i class="bi bi-trash me-1"></i>Xóa bản ghi';
        clearBtn.disabled = true;

        actions.appendChild(startBtn);
        actions.appendChild(stopBtn);
        actions.appendChild(clearBtn);
        recordingPanel.appendChild(actions);

        var status = document.createElement('div');
        status.className = 'recording-status';
        status.textContent = 'Chưa có bản ghi âm cho câu này.';
        recordingPanel.appendChild(status);

        var preview = document.createElement('audio');
        preview.className = 'recording-audio';
        preview.controls = true;
        preview.preload = 'none';
        recordingPanel.appendChild(preview);

        wrap.appendChild(recordingPanel);

        practiceState.recorderRefs[item.key] = {
            start: startBtn,
            stop: stopBtn,
            clear: clearBtn,
            status: status,
            audio: preview
        };

        startBtn.addEventListener('click', async function () {
            await startRecordingForKey(item.key);
        });

        stopBtn.addEventListener('click', async function () {
            await stopActiveRecording('manual');
            var recording = practiceState.recordings[item.key];
            if (recording && recording.blob && !recording.uploadedUrl) {
                setRecordingStatusForKey(item.key, 'Đang lưu file ghi âm lên server...', 'warning');
                try {
                    await uploadRecordingForKey(item.key);
                    renderRecordingForKey(item.key);
                } catch (error) {
                    setRecordingStatusForKey(item.key, error.message || 'Không thể lưu file ghi âm.', 'danger');
                }
            }
        });

        clearBtn.addEventListener('click', async function () {
            await clearRecordingForKey(item.key);
        });

        renderRecordingForKey(item.key);

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
            practiceState.recorderRefs = {};

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
                var recording = practiceState.recordings[item.key] || null;
                answers.push({
                    key: item.key,
                    page: page.title || item.key,
                    prompt: item.prompt || '',
                    answer: answerText,
                    word_count: getWordCount(answerText),
                    recording_url: recording && recording.uploadedUrl ? recording.uploadedUrl : '',
                    recording_duration_seconds: recording && recording.durationSeconds ? recording.durationSeconds : 0,
                    recording_mime_type: recording && recording.mimeType ? recording.mimeType : '',
                    recording_file_path: recording && recording.filePath ? recording.filePath : '',
                    recording_size_bytes: recording && recording.sizeBytes ? recording.sizeBytes : 0
                });
            });
        });

        return answers;
    }

    async function submitHomeworkStatus() {
        if (!buoiId) return true;
        if (accessContext.locked) return false;

        var classSet = accessContext.classSet;
        var sessionNumber = resolveSessionNumber();
        var band = resolveBand();
        if (!classSet || !classSet.id || !sessionNumber) return true;

        var payload = {
            practiceType: 'homework',
            mode: 'session',
            setId: classSet.id,
            setTitle: (classSet.title || (classSet.data && classSet.data.name) || ('Lớp ' + band)),
            totalScore: 0,
            maxScore: 0,
            durationSeconds: Math.max(1, Math.round((Date.now() - practiceState.startAt) / 1000)),
            metadata: {
                class_id: classSet.id,
                class_title: classSet.title || (classSet.data && classSet.data.name) || '',
                session_key: buoiId,
                session_number: sessionNumber,
                band: band,
                homework_submitted_at: new Date().toISOString()
            }
        };

        try {
            var response = await fetch('/api/practice_results/submit', {
                method: 'POST',
                headers: getAuthorizedHeaders({ 'Content-Type': 'application/json' }),
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                var data = await response.json().catch(function () { return {}; });
                throw new Error(data.error || 'Không thể ghi nhận trạng thái nộp BTVN');
            }
            return true;
        } catch (error) {
            console.warn('Submit homework status failed:', error);
            return false;
        }
    }

    async function submitResult(set, partNum) {
        if (!ensureAccessOrFail()) return;

        try {
            await stopActiveRecording('submit');

            var answers = collectAllAnswers();
            await ensureRecordingsUploaded(answers);
            var classSet = accessContext && accessContext.classSet ? accessContext.classSet : null;
            var sessionNumber = resolveSessionNumber();
            var sessionKey = buoiId || (sessionNumber ? (resolveBand() + '-' + sessionNumber) : '');
            var resolvedBand = resolveBand() || (accessContext && accessContext.user && accessContext.user.band) || 'Pending';

            var payload = {
                practiceType: 'speaking',
                mode: 'part',
                setId: (classSet && classSet.id) || set.id || null,
                setTitle: (set.title || '') + ' - ' + (PART_LABELS[partNum] || 'Part ' + partNum),
                totalScore: 0,
                maxScore: 50,
                durationSeconds: Math.max(1, Math.round((Date.now() - practiceState.startAt) / 1000)),
                metadata: {
                    submission_kind: 'homework',
                    band: resolvedBand,
                    session_type: 'speaking',
                    class_id: classSet ? classSet.id : null,
                    class_title: classSet ? (classSet.title || (classSet.data && classSet.data.name) || '') : '',
                    session_key: sessionKey || null,
                    session_number: sessionNumber || null,
                    admin_note: null,
                    speaking_answers: answers,
                    speaking_part: partNum,
                    speaking_mode: 'part',
                    speaking_page_count: practiceState.totalPages,
                    speaking_submitted_at: new Date().toISOString()
                }
            };

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

            var homeworkOk = await submitHomeworkStatus();
            if (!homeworkOk) {
                alert('Bài đã nộp nhưng chưa ghi nhận trạng thái BTVN, vui lòng báo admin kiểm tra.');
            }

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
        // If buoi param, return inline data
        if (buoiId && BUOI_SPEAKING_DATA[buoiId]) {
            return BUOI_SPEAKING_DATA[buoiId];
        }
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
        if (!setId && !buoiId) {
            showError('Thiếu tham số. Vui lòng quay lại danh sách.');
            return;
        }

        try {
            await resolveAccessContext();
            if (!ensureAccessOrFail()) return;

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
            practiceState.setId = set.id || (buoiId || '');
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
                        window.location.href = buoiId ? 'lop_hoc.html' : 'speaking_cauhoi.html';
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

            window.addEventListener('beforeunload', cleanupRecordings);
        } catch (error) {
            showError(error.message || 'Không thể tải bài Speaking.');
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
