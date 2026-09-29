(() => {
  const CACHE_PREFIX = 'portal_report_status_v2_';
  let rows = [];
  let reportTypes = [];
  let loadSequence = 0;
  let retryTimer = 0;

  function escapeHtml(value) {
    const node = document.createElement('span');
    node.textContent = value || '';
    return node.innerHTML;
  }

  function reportLabel(type) {
    return {asetTetap:'Aset Tetap', persediaan:'Persediaan'}[type] || type;
  }

  function uploadState(value) {
    return value
      ? '<span class="public-upload-state done"><i class="bx bx-check"></i> Sudah</span>'
      : '<span class="public-upload-state missing"><i class="bx bx-minus"></i> Belum</span>';
  }

  function render() {
    const query = (document.querySelector('[data-public-report-search]').value || '').toLowerCase().trim();
    const filtered = rows.filter(row => row.name.toLowerCase().includes(query));
    const table = document.querySelector('[data-public-report-table]');
    table.innerHTML = filtered.map(row => {
      const state = row.complete ? 'Lengkap' : row.uploadedCount ? 'Sebagian' : 'Belum upload';
      const stateClass = row.complete ? 'complete' : row.uploadedCount ? 'partial' : 'empty';
      const href = `opd.html?nama=${encodeURIComponent(row.name)}`;
      return `<tr><td data-label="Perangkat Daerah"><a class="public-opd-link" href="${href}">${escapeHtml(row.name)} <i class="bx bx-right-arrow-alt"></i></a></td>${reportTypes.map(type => `<td data-label="${escapeHtml(reportLabel(type))}">${uploadState(row.uploads[type])}</td>`).join('')}<td data-label="Status"><span class="public-completion ${stateClass}">${state}</span><small>${row.uploadedCount}/${row.requiredCount} laporan</small></td></tr>`;
    }).join('') || `<tr><td colspan="${reportTypes.length + 2}" class="public-report-empty">Perangkat daerah tidak ditemukan.</td></tr>`;
    document.querySelector('[data-public-report-count]').textContent = `${filtered.length} dari ${rows.length} perangkat daerah`;
  }

  function renderSummary() {
    const complete = rows.filter(row => row.complete).length;
    const partial = rows.filter(row => !row.complete && row.uploadedCount).length;
    document.querySelector('[data-public-total]').textContent = rows.length;
    document.querySelector('[data-public-complete]').textContent = complete;
    document.querySelector('[data-public-partial]').textContent = partial;
    document.querySelector('[data-public-empty]').textContent = rows.length - complete - partial;
  }

  function readCache(period) {
    try {
      const result = JSON.parse(localStorage.getItem(`${CACHE_PREFIX}${period}`) || 'null');
      return result && Array.isArray(result.rows) ? result : null;
    } catch (_) { return null; }
  }

  function writeCache(period, result) {
    try { localStorage.setItem(`${CACHE_PREFIX}${period}`, JSON.stringify(result)); } catch (_) {}
  }

  function applyResult(result) {
    rows = result.rows || [];
    reportTypes = result.reports || [];
    document.querySelector('[data-public-report-head]').innerHTML = `<th>Perangkat Daerah</th>${reportTypes.map(type => `<th>${escapeHtml(reportLabel(type))}</th>`).join('')}<th>Status</th>`;
    renderSummary();
    render();
  }

  async function requestStatus(period) {
    return window.PortalApi.request('publicReportStatus', {period});
  }

  async function load(period, options = {}) {
    const sequence = options.sequence || ++loadSequence;
    const allowRetry = options.allowRetry !== false;
    const section = document.querySelector('[data-public-report-section]');
    const message = document.querySelector('[data-public-report-message]');
    const refresh = document.querySelector('[data-public-report-refresh]');
    const loading = document.querySelector('[data-public-loading]');
    const cached = readCache(period);
    section.classList.add('loading');
    loading.hidden = Boolean(cached);
    document.body.setAttribute('aria-busy', 'true');
    refresh.disabled = true;
    if (cached) applyResult(cached);
    message.textContent = cached ? 'Menampilkan data terakhir sambil memeriksa pembaruan...' : 'Memuat status pengumpulan...';
    message.className = 'public-report-message';
    try {
      const result = await requestStatus(period);
      if (sequence !== loadSequence) return;
      applyResult(result);
      writeCache(period, result);
      const updated = result.generatedAt ? new Intl.DateTimeFormat('id-ID', {dateStyle:'medium', timeStyle:'short'}).format(new Date(result.generatedAt)) : '';
      message.textContent = updated ? `Data diperbarui ${updated}` : '';
    } catch (error) {
      if (sequence !== loadSequence) return;
      if (!cached && allowRetry) {
        message.textContent = 'Koneksi sementara terputus. Menghubungkan ulang otomatis...';
        message.className = 'public-report-message';
        retryTimer = window.setTimeout(() => {
          const selectedPeriod = document.querySelector('[data-public-report-period]').value;
          if (sequence === loadSequence && selectedPeriod === period) {
            load(period, {sequence, allowRetry:false});
          }
        }, 2500);
        return;
      }
      if (!cached) {
        rows = [];
        renderSummary();
        document.querySelector('[data-public-report-table]').innerHTML = '<tr><td colspan="4" class="public-report-empty">Status belum dapat dimuat. Silakan coba kembali.</td></tr>';
        document.querySelector('[data-public-report-count]').textContent = 'Data tidak tersedia';
      }
      message.textContent = cached ? 'Pembaruan belum terhubung. Data terakhir tetap ditampilkan.' : error.message;
      message.className = 'public-report-message error';
    } finally {
      if (sequence !== loadSequence) return;
      if (retryTimer && allowRetry && !cached) return;
      retryTimer = 0;
      section.classList.remove('loading');
      loading.hidden = true;
      document.body.removeAttribute('aria-busy');
      refresh.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    ['I','II','III','IV'].forEach(period => localStorage.removeItem(`portal_report_status_v1_${period}`));
    const period = document.querySelector('[data-public-report-period]');
    document.querySelector('[data-public-report-search]').addEventListener('input', render);
    const startLoad = () => {
      window.clearTimeout(retryTimer);
      retryTimer = 0;
      load(period.value);
    };
    document.querySelector('[data-public-report-refresh]').addEventListener('click', startLoad);
    period.addEventListener('change', startLoad);
    load(period.value);
  });
})();
