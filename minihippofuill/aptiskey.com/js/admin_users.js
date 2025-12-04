(() => {
    const moduleRoot = document.getElementById('user-management-module');
    if (!moduleRoot) {
        return;
    }

    const refs = {
        createForm: document.getElementById('user-create-form'),
        createAlert: document.getElementById('user-create-alert'),
        createAccountCode: document.getElementById('create-account-code'),
        createEmail: document.getElementById('create-email'),
        createPassword: document.getElementById('create-password'),
        createFullName: document.getElementById('create-full-name'),
        createPhone: document.getElementById('create-phone'),
        createDeviceLimit: document.getElementById('create-device-limit'),
        createExpiresAt: document.getElementById('create-expires-at'),
        createNotes: document.getElementById('create-notes'),
        userTableBody: document.getElementById('user-table-body'),
        searchInput: document.getElementById('user-search-input'),
        clearSearchBtn: document.getElementById('clearUserSearchBtn'),
        refreshUsersBtn: document.getElementById('refreshUsersBtn'),
        detailPanel: document.getElementById('user-detail-panel'),
        detailAccountLabel: document.getElementById('detail-account-label'),
        detailEmailLabel: document.getElementById('detail-email-label'),
        detailUpdatedLabel: document.getElementById('detail-updated-label'),
        detailStatus: document.getElementById('detail-status'),
        detailRole: document.getElementById('detail-role'),
        detailDeviceLimit: document.getElementById('detail-device-limit'),
        detailFullName: document.getElementById('detail-full-name'),
        detailPhone: document.getElementById('detail-phone'),
        detailExpiresAt: document.getElementById('detail-expires-at'),
        detailNotes: document.getElementById('detail-notes'),
        detailSaveBtn: document.getElementById('detail-save-btn'),
        detailResetDevicesBtn: document.getElementById('detail-reset-devices-btn'),
        detailDeleteUserBtn: document.getElementById('detail-delete-user-btn'),
        bulkFileInput: document.getElementById('bulk-user-file'),
        bulkImportBtn: document.getElementById('bulk-user-import-btn'),
        bulkTemplateBtn: document.getElementById('bulk-user-template-btn'),
        devicesPanel: document.getElementById('user-devices-panel'),
        devicesBody: document.getElementById('user-devices-body'),
        refreshDevicesBtn: document.getElementById('refreshDevicesBtn')
    };

    const state = {
        users: [],
        filteredUsers: [],
        selectedUser: null,
        loadingUsers: false
    };

    function showCreateAlert(message, type = 'info') {
        if (!refs.createAlert) return;
        refs.createAlert.className = `alert alert-${type} py-2 px-3`;
        refs.createAlert.textContent = message;
        refs.createAlert.style.display = 'block';
    }

    function hideCreateAlert() {
        if (refs.createAlert) {
            refs.createAlert.style.display = 'none';
        }
    }

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
                    <td colspan="6" class="text-center text-muted py-4">
                        <i class="bi bi-inboxes me-2"></i>Chưa có học viên nào.
                    </td>
                </tr>
            `;
            return;
        }

        refs.userTableBody.innerHTML = users
            .map(user => {
                const deviceInfo = `${user.device_count || 0}/${user.device_limit || 2}`;
                const statusBadge = user.status === 'active'
                    ? '<span class="badge bg-success-subtle text-success">Active</span>'
                    : '<span class="badge bg-danger-subtle text-danger">Locked</span>';
                return `
                    <tr data-user-id="${user.id}">
                        <td class="fw-semibold">${user.account_code || '-'}</td>
                        <td>${user.full_name || '-'}</td>
                        <td>${user.email || '-'}</td>
                        <td>${statusBadge}</td>
                        <td>${deviceInfo}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-primary" data-action="select-user" data-user-id="${user.id}">
                                <i class="bi bi-eye me-1"></i>Chi tiết
                            </button>
                        </td>
                    </tr>
                `;
            })
            .join('');

        refs.userTableBody.querySelectorAll('[data-action="select-user"]').forEach(btn => {
            btn.addEventListener('click', () => {
                selectUser(btn.dataset.userId);
            });
        });
    }

    function applySearchFilter() {
        const keyword = refs.searchInput?.value?.trim().toLowerCase() || '';
        if (!keyword) {
            state.filteredUsers = [...state.users];
            renderUsers(state.filteredUsers);
            return;
        }
        state.filteredUsers = state.users.filter(user => {
            const targets = [
                user.account_code,
                user.full_name,
                user.email
            ]
                .filter(Boolean)
                .map(value => value.toLowerCase());
            return targets.some(value => value.includes(keyword));
        });
        renderUsers(state.filteredUsers);
    }

    async function loadUsers() {
        if (state.loadingUsers) return;
        state.loadingUsers = true;
        renderUsers([]);
        try {
            const data = await fetchJson('/api/users/list');
            state.users = data.users || [];
            applySearchFilter();
        } catch (error) {
            console.error('loadUsers error:', error);
            refs.userTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger py-4">${error.message}</td>
                </tr>
            `;
        } finally {
            state.loadingUsers = false;
        }
    }

    function fillDetailPanel(user) {
        if (!refs.detailPanel) return;
        state.selectedUser = user;
        refs.detailAccountLabel.textContent = `Mã: ${user.account_code || '—'}`;
        refs.detailEmailLabel.textContent = `Email: ${user.email || '—'}`;
        refs.detailStatus.value = user.status || 'active';
        refs.detailRole.value = user.role || 'user';
        refs.detailDeviceLimit.value = user.device_limit || 2;
        refs.detailFullName.value = user.full_name || '';
        refs.detailPhone.value = user.phone_number || '';
        refs.detailExpiresAt.value = user.expires_at ? user.expires_at.split('T')[0] : '';
        refs.detailNotes.value = user.notes || '';
        refs.detailUpdatedLabel.textContent = user.last_login
            ? `Lần đăng nhập cuối: ${new Date(user.last_login).toLocaleString('vi-VN')}`
            : '';
        refs.detailPanel.style.display = 'block';
        refs.devicesPanel.style.display = 'block';
    }

    function setDevicesLoading() {
        if (refs.devicesBody) {
            refs.devicesBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-3">
                        <i class="spinner-border spinner-border-sm me-2"></i>Đang tải danh sách thiết bị...
                    </td>
                </tr>
            `;
        }
    }

    function renderDevices(devices) {
        if (!refs.devicesBody) return;
        if (!devices.length) {
            refs.devicesBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted py-3">Chưa có thiết bị nào.</td>
                </tr>
            `;
            return;
        }

        refs.devicesBody.innerHTML = devices
            .map(device => {
                const lastSeen = device.last_seen
                    ? new Date(device.last_seen).toLocaleString('vi-VN')
                    : '—';
                const badge = device.status === 'active'
                    ? '<span class="badge bg-success-subtle text-success">Active</span>'
                    : '<span class="badge bg-secondary-subtle text-muted">Revoked</span>';
                return `
                    <tr data-device-record="${device.id}">
                        <td>
                            <div class="fw-semibold">${device.device_name || 'Thiết bị mới'}</div>
                            <div class="text-muted small">${device.device_id}</div>
                        </td>
                        <td>${badge}</td>
                        <td>${lastSeen}</td>
                        <td class="text-end">
                            <button class="btn btn-sm btn-outline-danger" data-action="revoke-device" data-device-id="${device.id}" ${device.status === 'revoked' ? 'disabled' : ''}>
                                <i class="bi bi-x-circle"></i>
                            </button>
                        </td>
                    </tr>
                `;
            })
            .join('');

        refs.devicesBody.querySelectorAll('[data-action="revoke-device"]').forEach(btn => {
            btn.addEventListener('click', () => {
                revokeDevice(btn.dataset.deviceId);
            });
        });
    }

    async function loadDevices(userId) {
        if (!userId) return;
        setDevicesLoading();
        try {
            const data = await fetchJson(`/api/devices/list?userId=${userId}`);
            renderDevices(data.devices || []);
        } catch (error) {
            refs.devicesBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-danger py-3">${error.message}</td>
                </tr>
            `;
        }
    }

    async function revokeDevice(deviceRecordId) {
        if (!state.selectedUser) return;
        try {
            await fetchJson('/api/devices/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: state.selectedUser.id,
                    deviceRecordId
                })
            });
            loadDevices(state.selectedUser.id);
            loadUsers();
        } catch (error) {
            alert(error.message);
        }
    }

    async function resetDevices() {
        if (!state.selectedUser) return;
        const confirmed = confirm('Bạn có chắc chắn muốn reset toàn bộ thiết bị của học viên này?');
        if (!confirmed) return;
        try {
            await fetchJson('/api/devices/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: state.selectedUser.id })
            });
            loadDevices(state.selectedUser.id);
            loadUsers();
        } catch (error) {
            alert(error.message);
        }
    }

    function selectUser(userId) {
        const user = state.users.find(item => item.id === userId);
        if (!user) return;
        fillDetailPanel(user);
        loadDevices(user.id);
    }

    async function handleCreateUser(event) {
        event.preventDefault();
        hideCreateAlert();
        if (!refs.createForm) return;
        const submitBtn = refs.createForm.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang tạo...';
        }
        try {
            const payload = {
                accountCode: refs.createAccountCode.value.trim(),
                email: refs.createEmail.value.trim() || undefined,
                password: refs.createPassword.value.trim() || undefined,
                fullName: refs.createFullName.value.trim() || undefined,
                phone: refs.createPhone.value.trim() || undefined,
                deviceLimit: Number(refs.createDeviceLimit.value) || 2,
                expiresAt: refs.createExpiresAt.value || undefined,
                notes: refs.createNotes.value.trim() || undefined
            };
            const data = await fetchJson('/api/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            showCreateAlert('Tạo tài khoản thành công!', 'success');
            if (data.temporaryPassword) {
                showCreateAlert(`Mật khẩu tạm thời: ${data.temporaryPassword}`, 'success');
            }
            refs.createForm.reset();
            loadUsers();
        } catch (error) {
            showCreateAlert(error.message || 'Không thể tạo tài khoản', 'danger');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }

    async function saveUserDetail() {
        if (!state.selectedUser) return;
        refs.detailSaveBtn.disabled = true;
        refs.detailSaveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';
        try {
            await fetchJson('/api/users/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: state.selectedUser.id,
                    status: refs.detailStatus.value,
                    role: refs.detailRole.value,
                    deviceLimit: Number(refs.detailDeviceLimit.value) || 2,
                    fullName: refs.detailFullName.value.trim(),
                    phone: refs.detailPhone.value.trim(),
                    expiresAt: refs.detailExpiresAt.value || null,
                    notes: refs.detailNotes.value.trim()
                })
            });
            loadUsers();
            showCreateAlert('Đã cập nhật thông tin học viên', 'success');
        } catch (error) {
            alert(error.message);
        } finally {
            refs.detailSaveBtn.disabled = false;
            refs.detailSaveBtn.innerHTML = '<i class="bi bi-save me-2"></i>Lưu thay đổi';
        }
    }

    function downloadCsvTemplate() {
        const headers = [
            'account_code',
            'email',
            'full_name',
            'phone',
            'device_limit',
            'expires_at',
            'notes',
            'password'
        ];
        const exampleRow = [
            'M001',
            'm001@example.com',
            'Nguyen Van A',
            '0912345678',
            '2',
            '2025-12-31',
            'Lop 6A, khoa 1',
            ''
        ];
        const csvContent = [headers.join(','), exampleRow.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mini_hippo_users_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function parseCsv(text) {
        const lines = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0);
        if (!lines.length) return [];
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.trim());
            if (cols.every(c => !c)) continue;
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = cols[idx] ?? '';
            });
            rows.push(row);
        }
        return rows;
    }

    async function bulkImportUsers() {
        if (!refs.bulkFileInput || !refs.bulkFileInput.files?.length) {
            alert('Vui lòng chọn file CSV trước.');
            return;
        }
        const file = refs.bulkFileInput.files[0];
        const reader = new FileReader();
        reader.onload = async e => {
            try {
                const text = String(e.target.result || '');
                const rows = parseCsv(text);
                if (!rows.length) {
                    alert('File không có dữ liệu hoặc sai định dạng.');
                    return;
                }
                let successCount = 0;
                const failed = [];
                const total = rows.length;
                if (refs.bulkImportBtn) {
                    refs.bulkImportBtn.disabled = true;
                    refs.bulkImportBtn.innerHTML =
                        '<span class="spinner-border spinner-border-sm me-1"></span>Đang nhập... 0/' +
                        total;
                }

                // Chạy song song nhiều luồng để tăng tốc (nhưng vẫn giới hạn để tránh quá tải)
                const concurrency = 5;
                let cursor = 0;

                async function worker() {
                    while (true) {
                        const i = cursor++;
                        if (i >= rows.length) return;
                        const r = rows[i];
                        const payload = {
                            accountCode: r.account_code?.trim(),
                            email: r.email?.trim() || undefined,
                            fullName: r.full_name?.trim() || undefined,
                            phone: r.phone?.trim() || undefined,
                            deviceLimit: r.device_limit ? Number(r.device_limit) : undefined,
                            expiresAt: r.expires_at?.trim() || undefined,
                            notes: r.notes?.trim() || undefined,
                            password: r.password?.trim() || undefined
                        };
                        if (!payload.accountCode && !payload.email) {
                            failed.push({ index: i + 2, reason: 'Thiếu account_code và email' });
                            continue;
                        }
                        try {
                            await fetchJson('/api/users/create', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });
                            successCount += 1;
                        } catch (error) {
                            failed.push({
                                index: i + 2,
                                reason: error.message || 'Không rõ lỗi'
                            });
                        } finally {
                            if (refs.bulkImportBtn) {
                                const done = successCount + failed.length;
                                refs.bulkImportBtn.innerHTML =
                                    '<span class="spinner-border spinner-border-sm me-1"></span>Đang nhập... ' +
                                    done +
                                    '/' +
                                    total;
                            }
                        }
                    }
                }

                const workers = [];
                for (let w = 0; w < concurrency; w++) {
                    workers.push(worker());
                }
                await Promise.all(workers);

                let message = `Đã nhập thành công ${successCount} tài khoản.`;
                if (failed.length) {
                    const detail = failed
                        .slice(0, 10)
                        .map(item => `Dòng ${item.index}: ${item.reason}`)
                        .join('\n');
                    message += `\n${failed.length} dòng lỗi.\n${detail}${
                        failed.length > 10 ? '\n... (xem thêm trong Console)' : ''
                    }`;
                    console.warn('Bulk import errors:', failed);
                }
                alert(message);
                refs.bulkFileInput.value = '';
                loadUsers();
            } catch (err) {
                console.error('bulkImportUsers error:', err);
                alert(err.message || 'Không thể đọc file CSV');
            } finally {
                if (refs.bulkImportBtn) {
                    refs.bulkImportBtn.disabled = false;
                    refs.bulkImportBtn.innerHTML =
                        '<i class="bi bi-upload me-1"></i>Nhập từ file';
                }
            }
        };
        reader.onerror = () => {
            alert('Không thể đọc file. Vui lòng thử lại.');
        };
        reader.readAsText(file, 'utf-8');
    }

    async function deleteCurrentUser() {
        if (!state.selectedUser) return;
        const confirmed = confirm(
            `Bạn có chắc chắn muốn xóa tài khoản này?\n\nMã: ${state.selectedUser.account_code || '-'}\nEmail: ${state.selectedUser.email || '-'}`
        );
        if (!confirmed) return;
        try {
            if (refs.detailDeleteUserBtn) {
                refs.detailDeleteUserBtn.disabled = true;
                refs.detailDeleteUserBtn.innerHTML =
                    '<span class="spinner-border spinner-border-sm me-2"></span>Đang xóa...';
            }
            await fetchJson(`/api/users/delete?id=${encodeURIComponent(state.selectedUser.id)}`, {
                method: 'DELETE'
            });
            showCreateAlert('Đã xóa tài khoản học viên.', 'success');
            state.selectedUser = null;
            if (refs.detailPanel) {
                refs.detailPanel.style.display = 'none';
            }
            if (refs.devicesPanel) {
                refs.devicesPanel.style.display = 'none';
            }
            loadUsers();
        } catch (error) {
            alert(error.message || 'Không thể xóa tài khoản');
        } finally {
            if (refs.detailDeleteUserBtn) {
                refs.detailDeleteUserBtn.disabled = false;
                refs.detailDeleteUserBtn.innerHTML =
                    '<i class="bi bi-trash me-2"></i>Xóa tài khoản';
            }
        }
    }

    let initialized = false;
    function initUserManagementModule() {
        if (initialized) {
            loadUsers();
            if (state.selectedUser) {
                loadDevices(state.selectedUser.id);
            }
            return;
        }
        initialized = true;
        if (refs.createForm) {
            refs.createForm.addEventListener('submit', handleCreateUser);
        }
        if (refs.searchInput) {
            refs.searchInput.addEventListener('input', () => applySearchFilter());
        }
        if (refs.clearSearchBtn) {
            refs.clearSearchBtn.addEventListener('click', () => {
                refs.searchInput.value = '';
                applySearchFilter();
            });
        }
        if (refs.refreshUsersBtn) {
            refs.refreshUsersBtn.addEventListener('click', loadUsers);
        }
        if (refs.detailSaveBtn) {
            refs.detailSaveBtn.addEventListener('click', saveUserDetail);
        }
        if (refs.detailResetDevicesBtn) {
            refs.detailResetDevicesBtn.addEventListener('click', resetDevices);
        }
        if (refs.detailDeleteUserBtn) {
            refs.detailDeleteUserBtn.addEventListener('click', deleteCurrentUser);
        }
        if (refs.bulkTemplateBtn) {
            refs.bulkTemplateBtn.addEventListener('click', downloadCsvTemplate);
        }
        if (refs.bulkImportBtn) {
            refs.bulkImportBtn.addEventListener('click', bulkImportUsers);
        }
        if (refs.refreshDevicesBtn) {
            refs.refreshDevicesBtn.addEventListener('click', () => {
                if (state.selectedUser) {
                    loadDevices(state.selectedUser.id);
                }
            });
        }
        loadUsers();
    }

    window.initUserManagementModule = initUserManagementModule;
})();



