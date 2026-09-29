(() => {
  const CACHE_PREFIX = 'portal_opd_detail_v2_';

  function escapeHtml(value) {
    const node = document.createElement('span');
    node.textContent = value || '';
    return node.innerHTML;
  }

  function groupLabel(parent) {
    const value = String(parent || '').toLowerCase().trim();
    if (value === 'disdikbud') return 'UPT di bawah Disdikbud';
    if (value === 'dinkes') return 'UPT di bawah Dinkes';
    return value ? `Unit ${parent}` : 'Perangkat Daerah';
  }

  function isDisdikbudUnit(parent) {
    return String(parent || '').toLowerCase().trim() === 'disdikbud';
  }

  function applyPageMode(parent) {
    const worksheetOnly = isDisdikbudUnit(parent);
    document.querySelector('[data-opd-status-section]').hidden = worksheetOnly;
    document.querySelector('[data-report-upload-link]').hidden = worksheetOnly;
    document.querySelector('[data-opd-description]').textContent = worksheetOnly
      ? 'Buka kertas kerja Rekonsiliasi Aset Tetap melalui tautan di bawah ini.'
      : 'Pantau status Rekonsiliasi dan pengumpulan laporan BMD setiap triwulan.';
  }

  function reconciliationState(value) {
    const state = String(value || '').toLowerCase().trim();
    if (['selesai','complete','completed'].includes(state)) return {key:'complete', label:'Rekon selesai', icon:'bx-check-circle'};
    if (['proses','sedang berjalan','berjalan','in progress'].includes(state)) return {key:'in-progress', label:'Sedang berjalan', icon:'bx-loader-circle'};
    return {key:'not-started', label:'Belum rekon', icon:'bx-minus-circle'};
  }

  function reportState(done, quarter) {
    if (!quarter.reportRequired) return {key:'not-required', label:'Tidak wajib', icon:'bx-check-shield'};
    if (!quarter.reportConfigured) return {key:'not-started', label:'Belum tersedia', icon:'bx-time-five'};
    return done
      ? {key:'report-done', label:'Sudah upload', icon:'bx-check-circle'}
      : {key:'report-missing', label:'Belum upload', icon:'bx-x-circle'};
  }

  function completionState(quarter) {
    if (!quarter.reportRequired) return {key:'not-required', label:'Tidak wajib', icon:'bx-check-shield'};
    if (!quarter.reportConfigured) return {key:'not-started', label:'Belum tersedia', icon:'bx-time-five'};
    const completed = ['asetTetap','persediaan'].filter(type => quarter.reports?.[type] === true).length;
    if (completed === 2) return {key:'complete', label:'Lengkap', icon:'bx-check-circle'};
    if (completed === 1) return {key:'in-progress', label:'Sebagian', icon:'bx-time-five'};
    return {key:'report-missing', label:'Belum upload', icon:'bx-x-circle'};
  }

  function badge(state) {
    return `<span class="asset-status-badge ${state.key}"><i class="bx ${state.icon}"></i> ${escapeHtml(state.label)}</span>`;
  }

  function formatDate(value) {
    if (!value) return 'Status belum diperbarui';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Status belum diperbarui';
    return `Diperbarui ${new Intl.DateTimeFormat('id-ID', {dateStyle:'medium', timeStyle:'short'}).format(date)}`;
  }

  function localResource(name) {
    const requested = String(name || '').toLowerCase().trim();
    return (window.PORTAL_OPD_DIRECTORY || []).find(item => String(item.name || '').toLowerCase().trim() === requested) || null;
  }

  function readDetailCache(name) {
    try {
      const result = JSON.parse(localStorage.getItem(`${CACHE_PREFIX}${String(name).toLowerCase()}`) || 'null');
      return result && result.name ? result : null;
    } catch (_) { return null; }
  }

  function writeDetailCache(name, result) {
    try { localStorage.setItem(`${CACHE_PREFIX}${String(name).toLowerCase()}`, JSON.stringify(result)); } catch (_) {}
  }

  function detailFromReportCaches(resource) {
    if (!resource) return null;
    let found = false;
    let latest = '';
    const quarters = {};
    ['I','II','III','IV'].forEach(period => {
      let report = null;
      try { report = JSON.parse(localStorage.getItem(`portal_report_status_v2_${period}`) || 'null'); } catch (_) {}
      const row = report?.rows?.find(item => String(item.name || '').toLowerCase() === String(resource.name).toLowerCase());
      if (report && Array.isArray(report.rows)) found = true;
      if (report?.generatedAt && report.generatedAt > latest) latest = report.generatedAt;
      quarters[period] = {
        reconciliation:row?.reconciliation || 'belum',
        reportRequired:true,
        reportConfigured:report?.configured === true,
        reports:{
          asetTetap:row?.uploads?.asetTetap === true,
          persediaan:row?.uploads?.persediaan === true
        }
      };
    });
    return found ? {name:resource.name, url:resource.url, parent:resource.parent, reportRequired:true, updatedAt:latest, quarters} : null;
  }

  function renderStaticResource(resource) {
    document.title = `${resource.name} | Portal Rekonsiliasi BMD`;
    document.querySelector('[data-opd-name]').textContent = resource.name;
    document.querySelector('[data-opd-group]').textContent = groupLabel(resource.parent);
    document.querySelector('[data-sheet-title]').textContent = `Kertas Kerja Form 5 ${resource.name}`;
    document.querySelector('[data-sheet-link]').href = resource.url;
    document.querySelector('[data-report-upload-link]').href = `modul-pelaporan.html?opd=${encodeURIComponent(resource.name)}`;
    applyPageMode(resource.parent);
  }

  async function requestDetail(name) {
    return window.PortalApi.request('publicOpdDetail', {name});
  }

  function render(result) {
    document.title = `${result.name} | Portal Rekonsiliasi BMD`;
    document.querySelector('[data-opd-name]').textContent = result.name;
    document.querySelector('[data-opd-group]').textContent = groupLabel(result.parent);
    document.querySelector('[data-sheet-title]').textContent = `Kertas Kerja Form 5 ${result.name}`;
    document.querySelector('[data-sheet-link]').href = result.url;
    document.querySelector('[data-report-upload-link]').href = `modul-pelaporan.html?opd=${encodeURIComponent(result.name)}`;
    document.querySelector('[data-opd-updated]').textContent = formatDate(result.updatedAt);
    document.querySelector('[data-opd-message]').textContent = '';
    applyPageMode(result.parent);
    document.querySelector('[data-opd-quarter-table]').innerHTML = ['I','II','III','IV'].map(period => {
      const quarter = result.quarters?.[period] || {reconciliation:'belum', reportRequired:true, reportConfigured:false, reports:{}};
      return `<tr><td data-label="Periode"><strong>Triwulan ${period}</strong></td><td data-label="Status Rekon Aset Tetap">${badge(reconciliationState(quarter.reconciliation))}</td><td data-label="Laporan Aset Tetap">${badge(reportState(quarter.reports?.asetTetap, quarter))}</td><td data-label="Laporan Persediaan">${badge(reportState(quarter.reports?.persediaan, quarter))}</td><td data-label="Status Pengumpulan">${badge(completionState(quarter))}</td></tr>`;
    }).join('');
  }

  function showError(message) {
    document.querySelector('[data-opd-name]').textContent = 'Data tidak ditemukan';
    document.querySelector('[data-opd-message]').textContent = message;
    document.querySelector('[data-opd-message]').className = 'directory-message error';
    document.querySelector('[data-sheet-link]').hidden = true;
    document.querySelector('[data-report-upload-link]').hidden = true;
    document.querySelector('[data-opd-quarter-table]').innerHTML = '<tr><td colspan="5" class="directory-empty">Kembali ke Rekon Aset Tetap dan pilih perangkat daerah kembali.</td></tr>';
  }

  document.addEventListener('DOMContentLoaded', async () => {
    Object.keys(localStorage).filter(key => key.startsWith('portal_opd_detail_v1_')).forEach(key => localStorage.removeItem(key));
    const name = new URLSearchParams(location.search).get('nama');
    if (!name) { showError('Nama perangkat daerah belum dipilih.'); return; }
    const resource = localResource(name);
    if (resource) renderStaticResource(resource);
    if (resource && isDisdikbudUnit(resource.parent)) return;
    const cached = readDetailCache(name) || detailFromReportCaches(resource);
    if (cached) render(cached);
    try {
      const result = await requestDetail(name);
      render(result);
      writeDetailCache(name, result);
    }
    catch (error) {
      if (!resource && !cached) { showError(error.message); return; }
      document.querySelector('[data-opd-message]').textContent = cached
        ? 'Data status terakhir tetap ditampilkan. Pembaruan akan dicoba kembali saat halaman dibuka.'
        : 'Form 5 siap digunakan. Status triwulan sementara belum terhubung.';
      document.querySelector('[data-opd-message]').className = 'directory-message';
      if (!cached) document.querySelector('[data-opd-quarter-table]').innerHTML = '<tr><td colspan="5" class="directory-empty">Status triwulan sementara belum tersedia.</td></tr>';
    }
  });
})();
