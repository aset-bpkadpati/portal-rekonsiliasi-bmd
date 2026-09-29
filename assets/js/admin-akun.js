(() => {
  let users = [];
  let reportRows = [], reportTypes = [], reportsLoaded = false;

  function escapeHtml(value) {
    const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML;
  }

  function formatDate(value) {
    if (!value) return 'Belum tercatat';
    return new Intl.DateTimeFormat('id-ID', {dateStyle:'medium', timeStyle:'short'}).format(new Date(value));
  }

  function roleLabel(user) {
    if (user.role === 'verifier') return 'Verifikator';
    if (user.role === 'parent') return `Induk ${user.parent === 'dinkes' ? 'Dinkes' : 'Disdikbud'}`;
    return user.parent ? `UPT ${user.parent === 'dinkes' ? 'Dinkes' : 'Disdikbud'}` : 'Perangkat Daerah';
  }

  function showMessage(text, type = 'success') {
    const message = document.querySelector('[data-admin-message]');
    message.textContent = text; message.className = `admin-message ${type}`;
  }

  function render() {
    const query = (document.querySelector('[data-user-search]').value || '').toLowerCase().trim();
    const filtered = users.filter(user => `${user.name} ${user.username}`.toLowerCase().includes(query));
    const tbody = document.querySelector('[data-user-table]');
    tbody.innerHTML = filtered.map(user => {
      const encoded = encodeURIComponent(user.username);
      const self = user.role === 'verifier';
      return `<tr><td><strong>${escapeHtml(user.name)}</strong><small>${escapeHtml(user.parent || '—')}</small></td><td>${escapeHtml(user.username)}</td><td>${escapeHtml(roleLabel(user))}</td><td>${escapeHtml(formatDate(user.passwordChangedAt))}</td><td><span class="status-badge ${user.active ? '' : 'inactive'}">${user.active ? 'Aktif' : 'Nonaktif'}</span></td><td><div class="table-actions">${self ? '<small>Akun utama</small>' : `<button type="button" class="table-action" data-reset-user="${encoded}"><i class="bx bx-key"></i> Reset</button><button type="button" class="table-action ${user.active ? 'danger' : 'activate'}" data-toggle-user="${encoded}" data-active="${user.active}">${user.active ? 'Nonaktifkan' : 'Aktifkan'}</button>`}</div></td></tr>`;
    }).join('') || '<tr><td colspan="6">Tidak ada akun yang cocok.</td></tr>';
    document.querySelector('[data-user-count]').textContent = `${filtered.length} akun ditampilkan`;
    bindRowActions();
  }

  function bindRowActions() {
    document.querySelectorAll('[data-reset-user]').forEach(button => button.addEventListener('click', () => openReset(decodeURIComponent(button.dataset.resetUser))));
    document.querySelectorAll('[data-toggle-user]').forEach(button => button.addEventListener('click', async () => {
      const username = decodeURIComponent(button.dataset.toggleUser), currentlyActive = button.dataset.active === 'true';
      const user = users.find(item => item.username === username);
      if (!confirm(`${currentlyActive ? 'Nonaktifkan' : 'Aktifkan'} akun ${user.name}?${currentlyActive ? ' Sesi aktif pengguna akan langsung dihentikan.' : ''}`)) return;
      button.disabled = true;
      try {
        const result = await PortalAuth.request('setUserActive', {token:PortalAuth.token(), username, active:!currentlyActive});
        showMessage(result.message); await loadUsers();
      } catch (error) { showMessage(error.message, 'error'); button.disabled = false; }
    }));
  }

  function openReset(username) {
    const user = users.find(item => item.username === username), dialog = document.querySelector('[data-reset-dialog]');
    dialog.querySelector('[data-reset-name]').textContent = `${user.name} (${user.username})`;
    dialog.querySelector('[name="username"]').value = username;
    dialog.showModal();
  }

  async function loadUsers() {
    const result = await PortalAuth.request('listUsers', {token:PortalAuth.token()});
    users = result.users;
    document.querySelector('[data-user-total]').textContent = users.length;
    document.querySelector('[data-user-active]').textContent = users.filter(user => user.active).length;
    document.querySelector('[data-user-inactive]').textContent = users.filter(user => !user.active).length;
    render();
  }

  function bindResetDialog() {
    const dialog = document.querySelector('[data-reset-dialog]'), form = document.querySelector('[data-reset-form]');
    PortalAuth.bindPasswordToggles(dialog);
    form.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      form.reset(); form.querySelector('.dialog-message').textContent = '';
      form.querySelectorAll('.toggle-password').forEach(button => {
        button.parentElement.querySelector('input').type = 'password'; button.setAttribute('aria-label','Tampilkan password'); button.querySelector('i').className='bx bx-show';
      });
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const message = form.querySelector('.dialog-message');
      if (form.temporaryPassword.value !== form.confirmPassword.value) { message.textContent = 'Konfirmasi password tidak sama.'; return; }
      const button = form.querySelector('[type="submit"]'); button.disabled = true; message.textContent = '';
      try {
        const result = await PortalAuth.request('adminResetPassword', {token:PortalAuth.token(), username:form.username.value, temporaryPassword:form.temporaryPassword.value});
        dialog.close(); showMessage(result.message); await loadUsers();
      } catch (error) { message.textContent = error.message; }
      button.disabled = false;
    });
  }

  function reportLabel(type) {
    return {asetTetap:'Aset Tetap', persediaan:'Persediaan', penyusutan:'Penyusutan'}[type] || type;
  }

  function uploadCell(value) {
    if (!value) return '<span class="upload-state missing"><i class="bx bx-minus"></i> Belum</span>';
    const detail = value === true ? '' : `<small>${escapeHtml(formatDate(value))}</small>`;
    return `<span class="upload-state done"><i class="bx bx-check"></i> Sudah</span>${detail}`;
  }

  function renderReportStatus() {
    const query = (document.querySelector('[data-report-search]').value || '').toLowerCase().trim();
    const rows = reportRows.filter(row => row.name.toLowerCase().includes(query));
    document.querySelector('[data-report-head]').innerHTML = `<th>Perangkat Daerah</th>${reportTypes.map(type => `<th>${escapeHtml(reportLabel(type))}</th>`).join('')}<th>Status</th>`;
    document.querySelector('[data-report-table]').innerHTML = rows.map(row => {
      const state = row.complete ? 'Lengkap' : row.uploadedCount ? 'Sebagian' : 'Belum upload';
      const stateClass = row.complete ? 'complete' : row.uploadedCount ? 'partial' : 'empty';
      return `<tr><td><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.parent || 'Perangkat Daerah')}</small></td>${reportTypes.map(type => `<td>${uploadCell(row.uploads[type])}</td>`).join('')}<td><span class="completion-badge ${stateClass}">${state}</span><small>${row.uploadedCount}/${row.requiredCount} laporan</small></td></tr>`;
    }).join('') || `<tr><td colspan="${reportTypes.length + 2}">Tidak ada perangkat daerah yang cocok.</td></tr>`;
    document.querySelector('[data-report-count]').textContent = `${rows.length} perangkat daerah ditampilkan`;
  }

  async function loadReportStatus() {
    const period = document.querySelector('[data-report-period]').value;
    const refresh = document.querySelector('[data-refresh-status]');
    refresh.disabled = true;
    const message = document.querySelector('[data-report-message]'); message.className = 'admin-message'; message.textContent = '';
    try {
      const result = await PortalAuth.request('reportStatus', {token:PortalAuth.token(), period});
      reportTypes = result.reports || []; reportRows = result.rows || [];
      if (!result.configured) {
        document.querySelector('[data-report-table]').innerHTML = '<tr><td>Database upload untuk triwulan ini belum dikonfigurasi.</td></tr>';
        document.querySelector('[data-report-head]').innerHTML = '<th>Status upload</th>';
        message.textContent = `Database upload Triwulan ${period} belum dikonfigurasi pada Auth.gs.`; message.className = 'admin-message error';
      } else renderReportStatus();
      const complete = reportRows.filter(row => row.complete).length;
      const partial = reportRows.filter(row => !row.complete && row.uploadedCount).length;
      document.querySelector('[data-report-total]').textContent = reportRows.length;
      document.querySelector('[data-report-complete]').textContent = complete;
      document.querySelector('[data-report-partial]').textContent = partial;
      document.querySelector('[data-report-empty]').textContent = reportRows.length - complete - partial;
      reportsLoaded = true;
    } catch (error) { message.textContent = error.message; message.className = 'admin-message error'; }
    refresh.disabled = false;
  }

  function bindAdminTabs() {
    document.querySelectorAll('[data-admin-tab]').forEach(button => button.addEventListener('click', () => {
      const target = button.dataset.adminTab;
      document.querySelectorAll('[data-admin-tab]').forEach(item => item.classList.toggle('active', item === button));
      document.querySelectorAll('[data-admin-panel]').forEach(panel => panel.hidden = panel.dataset.adminPanel !== target);
      if (target === 'reports' && !reportsLoaded) loadReportStatus();
    }));
    document.querySelector('[data-report-period]').addEventListener('change', loadReportStatus);
    document.querySelector('[data-refresh-status]').addEventListener('click', loadReportStatus);
    document.querySelector('[data-report-search]').addEventListener('input', renderReportStatus);
    if (location.hash === '#reports') document.querySelector('[data-admin-tab="reports"]').click();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const session = await window.portalSessionReady;
    if (!session || session.user.role !== 'verifier') { location.replace('index.html'); return; }
    bindResetDialog();
    bindAdminTabs();
    document.querySelector('[data-user-search]').addEventListener('input', render);
    try { await loadUsers(); } catch (error) { showMessage(error.message, 'error'); }
  });
})();
