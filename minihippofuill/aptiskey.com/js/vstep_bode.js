(function () {
    // ===========================================================
    // VSTEP – Ôn thi (practice flow) — trang vstep_bode.html
    // và vstep_full_test.html dùng chung file này. Sau khi tách:
    // KHÔNG còn xử lý flow=lesson_exam ở đây nữa; phần Học tập đã
    // chuyển sang js/vstep_lessons.js riêng biệt.
    // ===========================================================

    const FLOW = 'practice';
    const copy = {
        noun: 'đề VSTEP',
        empty: 'Chưa có đề ôn thi VSTEP published nào.',
        loading: 'Đang tải danh sách đề ôn thi VSTEP...',
        badge: 'VSTEP ôn thi',
        fallback: 'VSTEP Mock Test'
    };
    const refs = {
        state: document.getElementById('vstepListState'),
        grid: document.getElementById('vstepListGrid'),
        reload: document.getElementById('reloadVstepListBtn')
    };

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function setState(message, type = 'info') {
        if (!refs.state) return;
        refs.state.className = `alert alert-${type}`;
        refs.state.textContent = message;
        refs.state.style.display = message ? 'block' : 'none';
    }

    function authorizedHeaders(extra = {}) {
        const token = typeof getAuthToken === 'function' ? getAuthToken() : '';
        const headers = { ...extra };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (typeof buildDeviceHeaders === 'function') {
            return buildDeviceHeaders(headers);
        }
        return headers;
    }

    function cacheSet(set) {
        if (!set || !set.id) return;
        try {
            sessionStorage.setItem('vstep_last_set_id', set.id);
            sessionStorage.setItem(`practice_set_cache_vstep_${set.id}`, JSON.stringify(set));
        } catch (error) {
            console.warn('Không thể cache đề VSTEP:', error);
        }
    }

    function renderSets(sets) {
        if (!sets.length) {
            refs.grid.innerHTML = '';
            setState(copy.empty, 'warning');
            return;
        }

        setState('', 'info');
        refs.grid.innerHTML = sets.map(set => {
            const data = set.data || {};
            const durations = data.durations || {};
            const total = Number(durations.listening || 0)
                + Number(durations.reading || 0)
                + Number(durations.writing || 0)
                + Number(durations.speaking || 0);
            const dateText = set.created_at ? new Date(set.created_at).toLocaleDateString('vi-VN') : '';
            return `
                <div class="col-sm-6 col-lg-4 col-xl-3">
                    <article class="vstep-list-card h-100">
                        <div>
                            <div class="small text-white-50 text-uppercase fw-bold">${escapeHtml(copy.badge)}</div>
                            <h2 class="h5 mt-2 mb-2">${escapeHtml(set.title || copy.fallback)}</h2>
                            <p class="small text-white-50 mb-0">${escapeHtml(set.description || 'Listening, Reading, Writing, Speaking')}</p>
                        </div>
                        <div>
                            <div class="small mb-3">
                                <i class="bi bi-clock me-1"></i>${total || set.duration_minutes || 177} phút
                                <span class="ms-2"><i class="bi bi-grid-3x3-gap me-1"></i>4 kỹ năng</span>
                                ${dateText ? `<span class="d-block text-white-50 mt-1"><i class="bi bi-calendar3 me-1"></i>${escapeHtml(dateText)}</span>` : ''}
                            </div>
                            <a class="btn btn-light text-primary fw-bold w-100 vstep-start-link" href="/vstep_exam?set=${encodeURIComponent(set.id)}" data-id="${escapeHtml(set.id)}">
                                Vào thi
                            </a>
                        </div>
                    </article>
                </div>
            `;
        }).join('');

        refs.grid.querySelectorAll('.vstep-start-link').forEach(link => {
            link.addEventListener('click', event => {
                const set = sets.find(item => item.id === link.dataset.id);
                if (!set?.id) return;
                event.preventDefault();
                cacheSet(set);
                window.location.href = `/vstep_exam?set=${encodeURIComponent(set.id)}`;
            });
        });
    }

    async function loadSets() {
        setState(copy.loading, 'info');
        refs.grid.innerHTML = '';
        try {
            const response = await fetch(`/api/vstep/contents/list?flow=${encodeURIComponent(FLOW)}&status=published`, {
                headers: authorizedHeaders()
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || `Không thể tải danh sách ${copy.noun}.`);
            const sets = (result.sets || [])
                .filter(set => !set.data?.vstep_practice_skill || set.data.vstep_practice_skill === 'full_test')
                .sort((a, b) => String(a.title || '').localeCompare(String(b.title || ''), 'vi', { numeric: true }));
            renderSets(sets);
        } catch (error) {
            setState(error.message, 'danger');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        refs.reload?.addEventListener('click', loadSets);
        loadSets();
    });
})();
