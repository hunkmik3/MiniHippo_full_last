(() => {
    const moduleRoot = document.getElementById('student-lessons-module');
    if (!moduleRoot) {
        return;
    }

    const refs = {
        searchInput: document.getElementById('student-lessons-search-input'),
        clearSearchBtn: document.getElementById('clear-student-lessons-search-btn'),
        refreshUsersBtn: document.getElementById('refresh-student-lessons-btn'),
        userTableBody: document.getElementById('student-lessons-user-table-body'),
        selectedUserLabel: document.getElementById('student-lessons-selected-user-label'),
        resultsBody: document.getElementById('student-lessons-results-body'),
        refreshResultsBtn: document.getElementById('refresh-student-lessons-results-btn')
    };

    const state = {
        users: [],
        filteredUsers: [],
        selectedUser: null,
        loadingUsers: false
    };

    function getAuthHeaders(extra = {}) {
        if (typeof window.buildAuthorizedHeaders === 'function') {
            return window.buildAuthorizedHeaders(extra);
        }
        return extra;
    }

    async function fetchJson(url, options = {}) {
        const response = await fetch(url, {
            ...options,
            headers: getAuthHeaders(options.headers || {})
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            const message = error.error || error.message || 'Yêu cầu thất bại';
            const err = new Error(message);
            err.status = response.status;
            throw err;
        }
        return response.json();
    }

    function renderUsers(users) {
        if (!refs.userTableBody) return;
        if (!users.length) {
            refs.userTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-4">
                        <i class="bi bi-inboxes me-2"></i>Chưa có học viên nào.
                    </td>
                </tr>
            `;
            return;
        }
        refs.userTableBody.innerHTML = users
            .map(user => {
                const accountCode = user.username || user.account_code || '—';
                const fullName = user.full_name || '—';
                const email = user.email || '—';
                const isActive = user.status === 'active';
                const rowClass = state.selectedUser?.id === user.id ? 'table-active' : '';
                return `
                    <tr class="${rowClass}" style="cursor: pointer;" onclick="window.selectStudentLessonUser('${user.id}')">
                        <td><code style="white-space: nowrap;">${accountCode}</code></td>
                        <td style="white-space: nowrap;">${fullName}</td>
                        <td class="text-muted" style="word-break: break-word; max-width: 250px;">${email}</td>
                    </tr>
                `;
            })
            .join('');
    }

    async function loadUsers() {
        if (state.loadingUsers) return;
        state.loadingUsers = true;
        if (refs.userTableBody) {
            refs.userTableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center text-muted py-3">
                        <i class="spinner-border spinner-border-sm me-2"></i>Đang tải danh sách học viên...
                    </td>
                </tr>
            `;
        }
        try {
            const data = await fetchJson('/api/users/list');
            state.users = data.users || [];
            applySearchFilter();
        } catch (error) {
            if (refs.userTableBody) {
                refs.userTableBody.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-center text-danger py-3">${error.message}</td>
                    </tr>
                `;
            }
        } finally {
            state.loadingUsers = false;
        }
    }

    function applySearchFilter() {
        const query = (refs.searchInput?.value || '').toLowerCase().trim();
        if (!query) {
            state.filteredUsers = state.users;
        } else {
            state.filteredUsers = state.users.filter(user => {
                const accountCode = (user.username || user.account_code || '').toLowerCase();
                const fullName = (user.full_name || '').toLowerCase();
                const email = (user.email || '').toLowerCase();
                return accountCode.includes(query) || fullName.includes(query) || email.includes(query);
            });
        }
        renderUsers(state.filteredUsers);
    }

    function renderResults(results) {
        if (!refs.resultsBody) return;
        if (!results.length) {
            refs.resultsBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-3">Chưa có kết quả nào.</td>
                </tr>
            `;
            return;
        }
        refs.resultsBody.innerHTML = results
            .map(item => {
                const submittedAt = item.submitted_at
                    ? new Date(item.submitted_at).toLocaleString('vi-VN')
                    : '—';
                const score = `${item.total_score || 0}/${item.max_score || 0}`;
                const practiceType = item.practice_type
                    ? item.practice_type.charAt(0).toUpperCase() + item.practice_type.slice(1)
                    : '—';
                const duration = item.duration_seconds
                    ? `${Math.round(item.duration_seconds / 60)}p`
                    : '—';
                const detailBtn = item.id
                    ? `<button class="btn btn-sm btn-outline-primary" onclick="window.viewResultDetail('${item.id}')">
                        <i class="bi bi-eye"></i>
                    </button>`
                    : '—';
                return `
                    <tr>
                        <td>${submittedAt}</td>
                        <td>${practiceType}</td>
                        <td><strong>${score}</strong></td>
                        <td>${duration}</td>
                        <td>${detailBtn}</td>
                    </tr>
                `;
            })
            .join('');
    }

    async function loadResults(userId) {
        if (!userId) return;
        if (refs.resultsBody) {
            refs.resultsBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted py-3">
                        <i class="spinner-border spinner-border-sm me-2"></i>Đang tải kết quả...
                    </td>
                </tr>
            `;
        }
        try {
            const data = await fetchJson(`/api/practice_results/list?userId=${userId}&limit=50`);
            renderResults(data.results || []);
        } catch (error) {
            if (refs.resultsBody) {
                refs.resultsBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-danger py-3">${error.message}</td>
                    </tr>
                `;
            }
        }
    }

    window.selectStudentLessonUser = function(userId) {
        const user = state.users.find(item => item.id === userId);
        if (!user) return;
        state.selectedUser = user;
        
        // Update label
        if (refs.selectedUserLabel) {
            const accountCode = user.username || user.account_code || '—';
            const fullName = user.full_name || '—';
            refs.selectedUserLabel.textContent = `${accountCode} - ${fullName}`;
        }
        
        // Show refresh button
        if (refs.refreshResultsBtn) {
            refs.refreshResultsBtn.style.display = 'block';
        }
        
        // Load results
        loadResults(user.id);
        
        // Re-render users to highlight selected
        renderUsers(state.filteredUsers);
    };

    window.viewResultDetail = function(resultId) {
        // TODO: Implement detail view modal if needed
        alert(`Xem chi tiết kết quả ID: ${resultId}`);
    };

    // Event listeners
    if (refs.searchInput) {
        refs.searchInput.addEventListener('input', applySearchFilter);
    }

    if (refs.clearSearchBtn) {
        refs.clearSearchBtn.addEventListener('click', () => {
            if (refs.searchInput) {
                refs.searchInput.value = '';
                applySearchFilter();
            }
        });
    }

    if (refs.refreshUsersBtn) {
        refs.refreshUsersBtn.addEventListener('click', loadUsers);
    }

    if (refs.refreshResultsBtn) {
        refs.refreshResultsBtn.addEventListener('click', () => {
            if (state.selectedUser) {
                loadResults(state.selectedUser.id);
            }
        });
    }

    // Initialize module
    window.initStudentLessonsModule = function() {
        loadUsers();
        state.selectedUser = null;
        if (refs.selectedUserLabel) {
            refs.selectedUserLabel.textContent = 'Chọn học viên để xem kết quả';
        }
        if (refs.refreshResultsBtn) {
            refs.refreshResultsBtn.style.display = 'none';
        }
        if (refs.resultsBody) {
            refs.resultsBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">Chọn học viên để xem kết quả bài học.</td>
                </tr>
            `;
        }
    };
})();

