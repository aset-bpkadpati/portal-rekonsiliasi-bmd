(() => {
  const API_URL = 'https://script.google.com/macros/s/AKfycbyQAxHP1sb8an8mYr9gosGT-ui3WhyLIERl61mackTiycgaG-WhsYqiDUQTfU8_rssNpw/exec';
  const DEFAULT_TIMEOUT = 10000;
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

  async function request(action, data = {}) {
    const payload = {action, ...data};
    const query = new URLSearchParams(Object.entries(payload).reduce((values, [key, value]) => {
      if (value != null) values[key] = String(value);
      return values;
    }, {}));
    const attempts = [
      () => fetchJsonp(query, 8000),
      () => fetchJson(`${API_URL}?${query}`, {method:'GET', headers:{Accept:'application/json'}}, DEFAULT_TIMEOUT),
      () => fetchJson(API_URL, {
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8', Accept:'application/json'},
        body:JSON.stringify(payload)
      }, DEFAULT_TIMEOUT)
    ];

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
