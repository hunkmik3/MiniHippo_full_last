(function () {
    const listContainer = document.getElementById('writing-upload-sets');
    const placeholder = document.getElementById('writing-upload-placeholder');

    if (!listContainer) return;

    function setPlaceholder(message) {
        if (placeholder) {
            placeholder.textContent = message;
            placeholder.style.display = 'block';
        } else {
            listContainer.innerHTML = `<div class="col-12 text-center text-muted small">${message}</div>`;
        }
    }

    function extractSetOrder(lesson) {
        const sources = [
            lesson && lesson.title ? lesson.title : '',
            lesson && lesson.file_path ? lesson.file_path : '',
            lesson && lesson.topic ? lesson.topic : ''
        ];

        for (const source of sources) {
            const sharpMatch = String(source).match(/#\s*(\d+)/i);
            if (sharpMatch) return Number(sharpMatch[1]);

            const setMatch = String(source).match(/set\s*(\d+)/i);
            if (setMatch) return Number(setMatch[1]);

            const fileMatch = String(source).match(/(\d{1,4})/);
            if (fileMatch) return Number(fileMatch[1]);
        }

        return Number.MAX_SAFE_INTEGER;
    }

    function createSetCard(lesson) {
        const col = document.createElement('div');
        col.className = 'col-sm-6 col-lg-4 col-xl-3 mb-3';

        const card = document.createElement('div');
        card.className = 'p-3 h-100 rounded-3 text-white d-flex flex-column justify-content-between';
        // Purple gradient for Writing
        card.style.background = 'linear-gradient(135deg, #7c3aed, #6d28d9)';
        card.style.boxShadow = '0 12px 24px rgba(124, 58, 237, 0.25)';

        const title = document.createElement('div');
        title.className = 'fw-semibold fs-5 text-truncate';
        // Cleanup title if needed
        let displayTitle = lesson.title || 'Bài Writing';
        title.setAttribute('title', displayTitle); // Tooltip for long titles
        title.textContent = displayTitle;

        const meta = document.createElement('div');
        meta.className = 'text-white-50 small mt-2';
        const dateStr = lesson.created_at ? new Date(lesson.created_at).toLocaleDateString('vi-VN') : '';
        // If club name exists in metadata (not in lessons table usually, but maybe passed in json?), we don't have it here directly unless API returns it.
        // Assuming lessons table structure from `admin_upload.js`, it has title, topic, etc.
        const topic = lesson.topic ? ` · ${lesson.topic}` : '';
        meta.textContent = `Writing Practice${topic} · ${dateStr}`;

        // Extract filename from file_path: js/writing/writingkey041.js -> writingkey041
        let filename = '';
        if (lesson.file_path) {
            filename = lesson.file_path.split('/').pop().replace('.js', '');
        }

        const button = document.createElement('a');
        button.href = filename ? `writing_question.html?lesson=${filename}` : '#';
        button.className = 'btn btn-light fw-bold mt-3 w-100 border-0';
        button.style.color = '#6d28d9'; // Purple text
        button.textContent = 'Vào bộ đề';
        if (!filename) button.classList.add('disabled');

        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(button);
        col.appendChild(card);
        return col;
    }

    async function loadWritingSets() {
        setPlaceholder('Đang tải danh sách bộ đề upload...');
        try {
            // Note: We use the lessons list API, filtering by part=writing
            const response = await fetch('/api/lessons/list?part=writing');
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Không thể tải dữ liệu');
            }

            const lessons = result.lessons || [];
            listContainer.innerHTML = '';

            if (!lessons.length) {
                setPlaceholder('Chưa có bộ đề upload nào.');
                return;
            }

            lessons.sort((a, b) => {
                const orderDiff = extractSetOrder(a) - extractSetOrder(b);
                if (orderDiff !== 0) return orderDiff;

                return String(a.title || '').localeCompare(String(b.title || ''), 'vi', {
                    numeric: true,
                    sensitivity: 'base'
                });
            });

            if (placeholder) placeholder.style.display = 'none';
            lessons.forEach(lesson => listContainer.appendChild(createSetCard(lesson)));
        } catch (error) {
            console.error('writing_sets error:', error);
            setPlaceholder('Không thể tải bộ đề upload. Vui lòng thử lại sau.');
        }
    }

    document.addEventListener('DOMContentLoaded', loadWritingSets);
})();
