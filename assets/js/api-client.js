(() => {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyQAxHP1sb8an8mYr9gosGT-ui3WhyLIERl61mackTiycgaG-WhsYqiDUQTfU8_rssNpw/exec';
  const DEFAULT_TIMEOUT = 10000;
  const PUBLIC_REPORT_SHEETS = Object.freeze({
    I:'1erQ2J98vhvlEYM6zZuFMYaaYqV29Xkll_R1u5bZMmt0',
    II:'1u7MuM3oIPp_eIjZZtd-c8mejsNsfRHa7ZWNwqJ5XHXM',
    III:'1eHEB3mNIwdE9bdlo2k-zdLr3hyj55fVtdRw-ZWEy4G8'
  });
  let jsonpSequence = 0;

  async function fetchJson(url, options, timeoutMs) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs || DEFAULT_TIMEOUT);
    try {
      const response = await fetch(url, {...options, signal:controller.signal, redirect:'follow', cache:'no-store'});
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.status = response.status;
        throw error;
      }
      const result = await response.json();
      if (!result || result.success !== true) throw new Error(result?.error || 'Respons layanan tidak valid.');
      return result;
    } finally { clearTimeout(timeout); }
  }

  function fetchJsonp(params, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const callback = `__portalPublic_${Date.now()}_${++jsonpSequence}`;
      const script = document.createElement('script');
      let settled = false;
      const cleanup = () => {
        window.clearTimeout(timeout);
        script.remove();
        try { delete window[callback]; } catch (_) { window[callback] = undefined; }
      };
      const finish = (handler, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        handler(value);
      };
      const timeout = window.setTimeout(() => finish(reject, new Error('Waktu tunggu layanan habis.')), timeoutMs);
      window[callback] = result => {
        if (!result || result.success !== true) return finish(reject, new Error(result?.error || 'Respons layanan tidak valid.'));
        finish(resolve, result);
      };
      script.async = true;
      script.onerror = () => finish(reject, new Error('Jalur layanan publik tidak tersedia.'));
      script.onload = () => window.setTimeout(() => {
        if (!settled) finish(reject, new Error('Deployment belum mendukung jalur layanan publik.'));
      }, 0);
      script.src = `${API_URL}?${params}&callback=${encodeURIComponent(callback)}`;
      document.head.appendChild(script);
    });
  }

  function normalizeStatusName(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
  }

  function canonicalStatusName(value) {
    const name = String(value || '').trim();
    const aliases = {dislautkan:'DKP'};
    return aliases[normalizeStatusName(name)] || name;
  }

  function gvizCell(row, index) {
    const cell = row && Array.isArray(row.c) ? row.c[index] : null;
    return cell && cell.v != null ? cell.v : null;
  }

  function gvizBoolean(value) {
    return value === true || ['true','ya','sudah','1'].includes(String(value || '').trim().toLowerCase());
  }

  function gvizReconciliation(value) {
    const status = String(value || '').trim().toLowerCase();
    if (['sudah rekon','rekon selesai','selesai','complete','completed'].includes(status)) return 'selesai';
    if (['sedang berjalan','proses','berjalan','in progress'].includes(status)) return 'proses';
    return 'belum';
  }

  function fetchGvizStatus(period, timeoutMs = 8000) {
    const spreadsheetId = PUBLIC_REPORT_SHEETS[String(period || '').toUpperCase()];
    if (!spreadsheetId) {
      return Promise.resolve({success:true, configured:false, period, reports:['asetTetap','persediaan'], rows:[], generatedAt:new Date().toISOString()});
    }
    return new Promise((resolve, reject) => {
      const callback = `__portalGviz_${Date.now()}_${++jsonpSequence}`;
      const script = document.createElement('script');
      let settled = false;
      const cleanup = () => {
        window.clearTimeout(timeout);
        script.remove();
        try { delete window[callback]; } catch (_) { window[callback] = undefined; }
      };
      const finish = (handler, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        handler(value);
      };
      const timeout = window.setTimeout(() => finish(reject, new Error('Waktu tunggu Google Sheet habis.')), timeoutMs);
      window[callback] = payload => {
        if (!payload || payload.status !== 'ok' || !payload.table || !Array.isArray(payload.table.rows)) {
          finish(reject, new Error('Respons Google Sheet tidak valid.'));
          return;
        }
        const rows = payload.table.rows.map(row => {
          const name = canonicalStatusName(gvizCell(row, 1));
          const uploads = {
            asetTetap:gvizBoolean(gvizCell(row, 2)),
            persediaan:gvizBoolean(gvizCell(row, 3))
          };
          const uploadedCount = Object.values(uploads).filter(Boolean).length;
          return {
            name,
            reconciliation:gvizReconciliation(gvizCell(row, 4)),
            uploads,
            uploadedCount,
            requiredCount:2,
            complete:uploadedCount === 2
          };
        }).filter(row => row.name && normalizeStatusName(row.name) !== 'total');
        finish(resolve, {success:true, configured:true, period:String(period).toUpperCase(), reports:['asetTetap','persediaan'], rows, generatedAt:new Date().toISOString()});
      };
      script.async = true;
      script.onerror = () => finish(reject, new Error('Google Sheet tidak dapat dihubungi.'));
      const tqx = `out:json;responseHandler:${callback}`;
      script.src = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=${encodeURIComponent(tqx)}&headers=3&sheet=${encodeURIComponent('Rekap Pengumpulan')}`;
      document.head.appendChild(script);
    });
  }

  async function fetchGvizOpdDetail(name) {
    const requested = normalizeStatusName(name);
    const resource = (window.PORTAL_OPD_DIRECTORY || []).find(item => normalizeStatusName(item.name) === requested);
    if (!resource) throw new Error('Perangkat daerah tidak ditemukan.');
    const periods = ['I','II','III','IV'];
    const settled = await Promise.allSettled(periods.map(period => fetchGvizStatus(period)));
    const quarters = {};
    settled.forEach((entry, index) => {
      const period = periods[index];
      const result = entry.status === 'fulfilled'
        ? entry.value
        : {configured:false, rows:[]};
      const row = (result.rows || []).find(item => normalizeStatusName(item.name) === requested);
      quarters[period] = {
        reconciliation:row?.reconciliation || 'belum',
        reportRequired:true,
        reportConfigured:result.configured === true,
        reports:{
          asetTetap:row?.uploads?.asetTetap === true,
          persediaan:row?.uploads?.persediaan === true
        }
      };
    });
    return {
      success:true,
      name:resource.name,
      url:resource.url,
      parent:resource.parent || '',
      reportRequired:true,
      updatedAt:new Date().toISOString(),
      quarters
    };
  }

  async function request(action, data = {}) {
    const payload = {action, ...data};
    const query = new URLSearchParams(Object.entries(payload).reduce((values, [key, value]) => {
      if (value != null) values[key] = String(value);
      return values;
    }, {}));
    const attempts = [];
    const period = String(data.period || '').toUpperCase();
    if (action === 'publicReportStatus' && ['I','II'].includes(period)) attempts.push(() => fetchGvizStatus(period));
    attempts.push(
      () => fetchJson(`${API_URL}?${query}`, {method:'GET', headers:{Accept:'application/json'}}, 30000)
    );
    if (action === 'publicOpdDetail') attempts.push(() => fetchGvizOpdDetail(data.name));
    attempts.push(
      () => fetchJsonp(query, 8000),
      () => fetchJson(API_URL, {
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8', Accept:'application/json'},
        body:JSON.stringify(payload)
      }, 30000)
    );
    if (action === 'publicReportStatus' && !['I','II'].includes(period)) attempts.push(() => fetchGvizStatus(period));

    let lastError;
    for (let index = 0; index < attempts.length; index += 1) {
      try {
        const result = await attempts[index]();
        if (action === 'publicReportStatus' && (!Array.isArray(result.rows) || !Array.isArray(result.reports))) throw new Error('Respons status belum didukung deployment ini.');
        if (action === 'publicOpdDetail' && (!result.name || !result.quarters)) throw new Error('Respons detail belum didukung deployment ini.');
        if (action === 'publicOpdDirectory' && !Array.isArray(result.rows)) throw new Error('Respons direktori belum didukung deployment ini.');
        return result;
      }
      catch (error) {
        lastError = error;
        if (index < attempts.length - 1) await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
    const unavailable = new Error('Pembaruan status sedang tidak terhubung.');
    unavailable.cause = lastError;
    throw unavailable;
  }

  window.PortalApi = Object.freeze({request, url:API_URL});
})();
