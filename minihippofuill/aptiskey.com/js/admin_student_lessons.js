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
        loadingUsers: false,
        selectedResultIds: new Set()
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

    function calculateBand(practiceType, totalScore) {
        if (!practiceType || totalScore === undefined || totalScore === null) {
            return '—';
        }
        
        const type = practiceType.toLowerCase();
        let band = '';
        
        if (type === 'listening') {
            if (totalScore >= 42) {
                band = 'C';
            } else if (totalScore >= 34) {
                band = 'B2';
            } else if (totalScore >= 24) {
                band = 'B1';
            } else if (totalScore >= 16) {
                band = 'A2';
            } else {
                band = 'Chưa đạt A2';
            }
        } else if (type === 'reading') {
            if (totalScore >= 46) {
                band = 'C';
            } else if (totalScore >= 38) {
                band = 'B2';
            } else if (totalScore >= 26) {
                band = 'B1';
            } else if (totalScore >= 16) {
                band = 'A2';
            } else {
                band = 'Chưa đạt A2';
            }
        } else {
            return '—';
        }
        
        return band;
    }

    function renderResults(results) {
        if (!refs.resultsBody) return;
        if (!results.length) {
            refs.resultsBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center text-muted py-3">Chưa có kết quả nào.</td>
                </tr>
            `;
            updateBulkDeleteButton();
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
                const band = calculateBand(item.practice_type, item.total_score);
                const isChecked = state.selectedResultIds.has(item.id);
                const detailBtn = item.id
                    ? `<button class="btn btn-sm btn-outline-primary" onclick="window.viewResultDetail('${item.id}')">
                        <i class="bi bi-eye"></i>
                    </button>`
                    : '—';
                return `
                    <tr>
                        <td>
                            <input type="checkbox" class="form-check-input result-checkbox" 
                                   data-result-id="${item.id}" 
                                   ${isChecked ? 'checked' : ''}>
                        </td>
                        <td>${submittedAt}</td>
                        <td>${practiceType}</td>
                        <td><strong>${score}</strong></td>
                        <td><span class="badge bg-info">${band}</span></td>
                        <td>${duration}</td>
                        <td>${detailBtn}</td>
                    </tr>
                `;
            })
            .join('');
        
        // Attach checkbox event listeners
        refs.resultsBody.querySelectorAll('.result-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const resultId = e.target.dataset.resultId;
                if (e.target.checked) {
                    state.selectedResultIds.add(resultId);
                } else {
                    state.selectedResultIds.delete(resultId);
                }
                updateSelectAllCheckbox();
                updateBulkDeleteButton();
            });
        });
        
        updateSelectAllCheckbox();
        updateBulkDeleteButton();
    }
    
    function updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('select-all-results');
        if (!selectAllCheckbox) return;
        
        const checkboxes = refs.resultsBody?.querySelectorAll('.result-checkbox') || [];
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        if (checkedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (checkedCount === checkboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
    
    function updateBulkDeleteButton() {
        const bulkDeleteBtn = document.getElementById('bulk-delete-results-btn');
        if (!bulkDeleteBtn) return;
        
        const selectedCount = state.selectedResultIds.size;
        if (selectedCount > 0) {
            bulkDeleteBtn.style.display = 'block';
            bulkDeleteBtn.innerHTML = `<i class="bi bi-trash me-1"></i>Xóa đã chọn (${selectedCount})`;
        } else {
            bulkDeleteBtn.style.display = 'none';
        }
    }
    
    async function bulkDeleteResults() {
        const selectedIds = Array.from(state.selectedResultIds);
        if (!selectedIds.length) {
            alert('Vui lòng chọn ít nhất một kết quả để xóa.');
            return;
        }
        
        const confirmed = confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} kết quả đã chọn?`);
        if (!confirmed) return;
        
        try {
            const response = await fetchJson('/api/practice_results/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });
            
            alert(`Đã xóa thành công ${selectedIds.length} kết quả.`);
            state.selectedResultIds.clear();
            
            // Reload results
            if (state.selectedUser) {
                loadResults(state.selectedUser.id);
            }
        } catch (error) {
            alert(error.message || 'Không thể xóa kết quả');
        }
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
    
    // Select all checkbox handler
    const selectAllCheckbox = document.getElementById('select-all-results');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            const checkboxes = refs.resultsBody?.querySelectorAll('.result-checkbox') || [];
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
                const resultId = checkbox.dataset.resultId;
                if (e.target.checked) {
                    state.selectedResultIds.add(resultId);
                } else {
                    state.selectedResultIds.delete(resultId);
                }
            });
            updateBulkDeleteButton();
        });
    }
    
    // Bulk delete button handler
    const bulkDeleteBtn = document.getElementById('bulk-delete-results-btn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', bulkDeleteResults);
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
                    <td colspan="7" class="text-center text-muted">Chọn học viên để xem kết quả bài học.</td>
                </tr>
            `;
        }
        state.selectedResultIds.clear();
        updateBulkDeleteButton();
    };
})();

