(() => {
  function findResource(name) {
    const requested = String(name || '').toLowerCase().trim();
    return (window.PORTAL_OPD_DIRECTORY || []).find(item => String(item.name || '').toLowerCase().trim() === requested) || null;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const resource = findResource(params.get('opd'));
    const period = ['I','II','III'].includes(params.get('triwulan')) ? params.get('triwulan') : 'I';
    const message = document.querySelector('[data-report-flow-message]');
    if (!resource || String(resource.parent || '').toLowerCase() === 'disdikbud') {
      document.querySelectorAll('[data-quarter-link],[data-report-type]').forEach(link => {
        link.removeAttribute('href'); link.setAttribute('aria-disabled','true');
      });
      if (message) { message.textContent = 'Perangkat daerah tidak valid atau tidak diwajibkan mengunggah laporan.'; message.className = 'directory-message error'; }
      return;
    }
    document.querySelectorAll('[data-report-opd]').forEach(node => { node.textContent = resource.name; });
    document.querySelectorAll('[data-period]').forEach(node => { node.textContent = `Triwulan ${period}`; });
    document.querySelectorAll('[data-quarter-link]').forEach(link => {
      link.href = `laporan-bmd.html?triwulan=${encodeURIComponent(link.dataset.quarterLink)}&opd=${encodeURIComponent(resource.name)}`;
    });
    document.querySelectorAll('[data-report-type]').forEach(link => {
      link.href = `form-laporan-bmd.html?jenis=${encodeURIComponent(link.dataset.reportType)}&triwulan=${encodeURIComponent(period)}&opd=${encodeURIComponent(resource.name)}`;
    });
    const reportBack = document.querySelector('[data-report-back]');
    if (reportBack) reportBack.href = `opd.html?nama=${encodeURIComponent(resource.name)}`;
    const periodBack = document.querySelector('[data-period-back]');
    if (periodBack) periodBack.href = `modul-pelaporan.html?opd=${encodeURIComponent(resource.name)}`;
  });
})();
