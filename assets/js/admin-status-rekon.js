(() => {
  let resources = [];
  const pendingChanges = new Map();

  function escapeHtml(value) {
    const node = document.createElement('span');
    node.textContent = value || '';
    return node.innerHTML;
  }

  function normalizedStatus(value) {
    const status = String(value || '').toLowerCase().trim();
    return ['belum','proses','selesai'].includes(status) ? status : 'belum';
  }

  function statusLabel(status) {
    return {belum:'Belum rekon', proses:'Sedang berjalan', selesai:'Rekon selesai'}[normalizedStatus(status)];
  }

  function isDisdikbudUpt(resource) {
    return String(resource?.parent || '').trim().toLowerCase() === 'disdikbud';
  }

  function changeKey(name, period) { return `${period}|${name}`; }

  function selectedStatus(resource, period) {
    return pendingChanges.get(changeKey(resource.name, period))?.status || normalizedStatus(resource.statuses?.[period]);
  }

  function formatDate(value) {
    if (!value) return 'Belum diperbarui';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Belum diperbarui';
    return new Intl.DateTimeFormat('id-ID', {dateStyle:'medium', timeStyle:'short'}).format(date);
  }

  function showMessage(text, type = 'success') {
    const message = document.querySelector('[data-recon-message]');
    message.textContent = text;
    message.className = `admin-message ${type}`;
  }

  function statusOptions(selected) {
    return [['belum','Belum rekon'],['proses','Sedang berjalan'],['selesai','Rekon selesai']]
      .map(([value,label]) => `<option value="${value}" ${selected === value ? 'selected' : ''}>${label}</option>`).join('');
  }

  function renderSummary(period) {
    const statuses = resources.map(resource => selectedStatus(resource, period));
    document.querySelector('[data-recon-total]').textContent = resources.length;
    document.querySelector('[data-recon-not-started]').textContent = statuses.filter(status => status === 'belum').length;
    document.querySelector('[data-recon-progress]').textContent = statuses.filter(status => status === 'proses').length;
    document.querySelector('[data-recon-complete]').textContent = statuses.filter(status => status === 'selesai').length;
  }

  function updatePendingUi() {
    const count = pendingChanges.size;
    const saveAll = document.querySelector('[data-recon-save-all]');
    saveAll.disabled = count === 0;
    saveAll.innerHTML = `<i class="bx bx-save"></i> Simpan semua perubahan${count ? ` (${count})` : ''}`;
    document.querySelector('[data-recon-pending]').textContent = count ? `${count} perubahan belum disimpan` : 'Belum ada perubahan';
  }

  function render() {
    const period = document.querySelector('[data-recon-period]').value;
    const query = document.querySelector('[data-recon-search]').value.toLowerCase().trim();
    const statusFilter = document.querySelector('[data-recon-filter]').value;
    const filtered = resources.filter(resource => {
      const matchesQuery = `${resource.name} ${resource.parent}`.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'all' || selectedStatus(resource, period) === statusFilter;
      return matchesQuery && matchesStatus;
    });
    renderSummary(period);
    updatePendingUi();
    document.querySelector('[data-recon-count]').textContent = `${filtered.length} dari ${resources.length} unit ditampilkan`;
    document.querySelector('[data-recon-table]').innerHTML = filtered.map(resource => {
      const savedStatus = normalizedStatus(resource.statuses?.[period]);
      const selection = selectedStatus(resource, period);
      const pending = pendingChanges.has(changeKey(resource.name, period));
      const encodedName = encodeURIComponent(resource.name);
      return `<tr><td><strong>${escapeHtml(resource.name)}</strong><small>${escapeHtml(resource.parent || 'Perangkat Daerah')}</small></td><td><span class="recon-state ${savedStatus}">${escapeHtml(statusLabel(savedStatus))}</span></td><td><select class="recon-status-select" data-recon-select="${encodedName}" data-period="${period}">${statusOptions(selection)}</select></td><td>${escapeHtml(formatDate(resource.updatedAt))}</td><td><span class="recon-change-state ${pending ? 'pending' : ''}" data-change-state="${encodedName}">${pending ? '<i class="bx bx-time-five"></i> Belum disimpan' : '<i class="bx bx-check"></i> Tersimpan'}</span></td></tr>`;
    }).join('') || '<tr><td colspan="5">Perangkat daerah atau unit tidak ditemukan.</td></tr>';
    bindSelectActions();
  }

  function bindSelectActions() {
    document.querySelectorAll('[data-recon-select]').forEach(select => select.addEventListener('change', () => {
      const name = decodeURIComponent(select.dataset.reconSelect);
      const period = select.dataset.period;
      const resource = resources.find(item => item.name === name);
      const key = changeKey(name, period);
      if (select.value === normalizedStatus(resource.statuses?.[period])) pendingChanges.delete(key);
      else pendingChanges.set(key, {name, period, status:select.value});
      const state = document.querySelector(`[data-change-state="${select.dataset.reconSelect}"]`);
      const pending = pendingChanges.has(key);
      state.classList.toggle('pending', pending);
      state.innerHTML = pending ? '<i class="bx bx-time-five"></i> Belum disimpan' : '<i class="bx bx-check"></i> Tersimpan';
      renderSummary(document.querySelector('[data-recon-period]').value);
      updatePendingUi();
      if (document.querySelector('[data-recon-filter]').value !== 'all') render();
    }));
  }

  async function saveAllChanges() {
    if (!pendingChanges.size) return;
    const saveAll = document.querySelector('[data-recon-save-all]');
    const refresh = document.querySelector('[data-recon-refresh]');
    saveAll.disabled = true; refresh.disabled = true;
    saveAll.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Menyimpan semua perubahan...';
    try {
      const result = await PortalAuth.request('updateReconciliationStatuses', {token:PortalAuth.token(), changes:[...pendingChanges.values()]});
      (result.updates || []).forEach(update => {
        const resource = resources.find(item => item.name === update.name);
        if (!resource) return;
        resource.statuses[update.period] = update.status;
        resource.updatedAt = update.updatedAt;
      });
      pendingChanges.clear();
      showMessage(result.message);
      render();
    } catch (error) {
      showMessage(error.message, 'error');
      updatePendingUi();
    }
    refresh.disabled = false;
  }

  async function loadStatuses(discardPending = false) {
    if (pendingChanges.size && discardPending && !confirm('Muat ulang dan batalkan seluruh perubahan yang belum disimpan?')) return;
    const refresh = document.querySelector('[data-recon-refresh]');
    refresh.disabled = true;
    try {
      const result = await PortalAuth.request('listReconciliationStatuses', {token:PortalAuth.token()});
      // Filter di frontend menjadi pengaman tambahan jika deployment backend
      // lama masih mengirim seluruh UPT di bawah Disdikbud.
      resources = (result.resources || []).filter(resource => !isDisdikbudUpt(resource));
      if (discardPending) pendingChanges.clear();
      render();
    } catch (error) { showMessage(error.message, 'error'); }
    refresh.disabled = false;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const session = await window.portalSessionReady;
    if (!session || session.user.role !== 'verifier') { location.replace('index.html'); return; }
    document.querySelector('[data-recon-period]').addEventListener('change', render);
    document.querySelector('[data-recon-search]').addEventListener('input', render);
    document.querySelector('[data-recon-filter]').addEventListener('change', render);
    document.querySelector('[data-recon-refresh]').addEventListener('click', () => loadStatuses(true));
    document.querySelector('[data-recon-save-all]').addEventListener('click', saveAllChanges);
    addEventListener('beforeunload', event => {
      if (!pendingChanges.size) return;
      event.preventDefault(); event.returnValue = '';
    });
    await loadStatuses();
  });
})();
