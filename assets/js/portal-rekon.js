const PORTAL_CONFIG = {
  uploadEndpoint: 'https://script.google.com/macros/s/AKfycbwU7bIGotLOEwjw_kJjZo321tNHR2Y0BIBeg7mWumTCYLEKLG_1xHjnCVL1NpXlsC0m/exec',
  uploadEndpointTriwulanII: 'https://script.google.com/macros/s/AKfycbzQLO--GbMXBfIjylriAJxeIHvvjrzaBVdMgn8En3LYizHuCMxG2Fea1gwRNDKu8I-Z/exec',
  uploadEndpointTriwulanIII: 'https://script.google.com/macros/s/AKfycbwC5d01ngfL4kAKINyFBBaMYdbclwcHoA3yhC0DOVgVAvfPK8XwsOSkeqQTprc_B4yDsQ/exec'
};

function escapeHtml(value) {
  const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML;
}

async function authorizedResources() {
  const session = await window.portalSessionReady;
  return session?.resources || [];
}

async function renderOpdList() {
  const grid = document.querySelector('[data-opd-grid]');
  if (!grid) return;
  const count = document.querySelector('[data-opd-count]');
  const search = document.querySelector('[data-opd-search]');
  const resources = await authorizedResources();
  const draw = () => {
    const query = (search?.value || '').toLowerCase().trim();
    const rows = resources.filter(item => item.name.toLowerCase().includes(query));
    grid.innerHTML = rows.map(item => `<a class="opd-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(item.name)}</span><i class="bx bx-link-external"></i></a>`).join('') || '<div class="empty-state"><i class="bx bx-folder-open"></i><p>Tidak ada kertas kerja yang dapat ditampilkan.</p></div>';
    if (count) count.textContent = `${rows.length} perangkat daerah ditampilkan`;
  };
  search?.addEventListener('input', draw); draw();
}

async function fillOpdSelect() {
  const resources = (await authorizedResources()).filter(item => item.reportRequired !== false);
  document.querySelectorAll('[data-opd-select]').forEach(select => {
    select.innerHTML = '';
    if (!resources.length) select.add(new Option('Tidak wajib mengumpulkan laporan', ''));
    resources.forEach(({name}) => select.add(new Option(name, name)));
    if (resources.length === 1) select.value = resources[0].name;
    select.disabled = resources.length === 1;
  });
}

function bindForm() {
  const form = document.querySelector('[data-report-form]');
  if (!form) return;
  const email = form.elements.email;
  const validateEmail = () => {
    const value = email.value.trim();
    email.setCustomValidity(value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? 'Masukkan alamat email yang valid.' : '');
  };
  email.addEventListener('input', validateEmail);
  form.addEventListener('submit', async event => {
    event.preventDefault(); validateEmail();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const message = form.querySelector('.form-message');
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.opd && form.elements.opd.value) data.opd = form.elements.opd.value;
    const resources = await authorizedResources();
    if (!resources.some(item => item.name === data.opd && item.reportRequired !== false)) { alert('OPD ini tidak diwajibkan atau akun Anda tidak memiliki akses untuk mengirim laporan.'); return; }
    const files = Object.values(data).filter(value => value instanceof File && value.size);
    const maxFileSize = 8 * 1024 * 1024, maxTotalSize = 24 * 1024 * 1024;
    if (files.some(file => file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf'))) { alert('Semua dokumen harus berupa file PDF.'); return; }
    if (files.some(file => file.size > maxFileSize) || files.reduce((sum, file) => sum + file.size, 0) > maxTotalSize) { alert('Ukuran maksimal adalah 8 MB per file dan 24 MB untuk seluruh dokumen.'); return; }
    for (const [key, value] of Object.entries(data)) {
      if (value instanceof File) data[key] = value.size ? await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({name:value.name,type:value.type,data:reader.result}); reader.onerror = reject; reader.readAsDataURL(value); }) : null;
    }
    data.jenis = form.dataset.type; data.triwulan = form.dataset.period; data.authToken = PortalAuth.token();
    const endpoints = {I:PORTAL_CONFIG.uploadEndpoint, II:PORTAL_CONFIG.uploadEndpointTriwulanII, III:PORTAL_CONFIG.uploadEndpointTriwulanIII};
    const endpoint = endpoints[data.triwulan];
    if (!endpoint || endpoint.includes('PASTE_URL')) { alert(`Layanan upload Triwulan ${data.triwulan} belum diaktifkan. Hubungi admin portal.`); return; }
    button.disabled = true; button.textContent = 'Mengirim...';
    try {
      const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(data)});
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || `HTTP ${response.status}`);
      message.innerHTML = '<i class="bx bx-check-circle"></i> Dokumen berhasil dikirim.'; message.style.display = 'block';
      form.reset(); if (resources.length === 1) form.elements.opd.value = resources[0].name;
    } catch (error) { alert(`Pengiriman belum berhasil: ${error.message || 'silakan coba kembali atau hubungi admin.'}`); }
    button.disabled = false; button.innerHTML = 'Kirim Dokumen <i class="bx bx-send"></i>';
  });
}

function pageContext() {
  const params = new URLSearchParams(location.search);
  const requestedPeriod = params.get('triwulan');
  const period = ['I','II','III'].includes(requestedPeriod) ? requestedPeriod : 'I';
  const requestedType = params.get('jenis') || 'aset-tetap';
  if (requestedType === 'penyusutan') { location.replace(`pelaporan.html?triwulan=${period}`); return false; }
  const type = ['aset-tetap','persediaan'].includes(requestedType) ? requestedType : 'aset-tetap';
  const labels = {'aset-tetap':'Aset Tetap',persediaan:'Persediaan'};
  document.querySelectorAll('[data-period]').forEach(el => el.textContent = `Triwulan ${period}`);
  document.querySelectorAll('[data-type]').forEach(el => el.textContent = labels[type] || type);
  const form = document.querySelector('[data-report-form]');
  if (form) { form.dataset.period = period; form.dataset.type = labels[type] || type; }
  const requirements = document.querySelector('[data-requirements]');
  if (!requirements) return;
  const periodLabel = `TW ${period} 2026`;
  const files = type === 'aset-tetap' ? [{key:'suratPengantar',name:`Surat Pengantar Laporan BMD Triwulan ${period} 2026`},{key:'baInternal',name:`BA Rekonsiliasi Aset Tetap Internal ${periodLabel}`},{key:'baEksternal',name:`BA Rekonsiliasi Aset Tetap Eksternal ${periodLabel}`},{key:'hibah',name:'BAST Hibah',optional:'Jika terdapat Hibah'},{key:'reklas',name:'Surat Reklasifikasi BMD',optional:'Jika terdapat Reklasifikasi BMD'}] : [{key:'baInternalPersediaan',name:`BA Rekonsiliasi Persediaan Internal ${periodLabel}`},{key:'baEksternalPersediaan',name:`BA Rekonsiliasi Persediaan Eksternal ${periodLabel}`},{key:'stockOpname',name:`Laporan Stock Opname dari Sibaper ${periodLabel}`},{key:'mutasi',name:`Rekap Mutasi Persediaan dari Sibaper ${periodLabel}`}];
  requirements.innerHTML = files.map((file,index) => `<div class="field full"><label for="file${index}">${file.name}${file.optional ? ` (${file.optional})` : ' *'}</label><input id="file${index}" name="${file.key}" type="file" accept="application/pdf,.pdf" ${file.optional ? '' : 'required'}><span class="hint">Unggah dalam format PDF.</span></div>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  if (pageContext() === false) return;
  await window.portalSessionReady;
  await Promise.all([renderOpdList(), fillOpdSelect()]);
  bindForm();
});
