(() => {
  const ENDPOINTS = {
    I:'https://script.google.com/macros/s/AKfycbwU7bIGotLOEwjw_kJjZo321tNHR2Y0BIBeg7mWumTCYLEKLG_1xHjnCVL1NpXlsC0m/exec',
    II:'https://script.google.com/macros/s/AKfycbzQLO--GbMXBfIjylriAJxeIHvvjrzaBVdMgn8En3LYizHuCMxG2Fea1gwRNDKu8I-Z/exec',
    III:'https://script.google.com/macros/s/AKfycbwC5d01ngfL4kAKINyFBBaMYdbclwcHoA3yhC0DOVgVAvfPK8XwsOSkeqQTprc_B4yDsQ/exec'
  };
  const LABELS = {'aset-tetap':'Aset Tetap', persediaan:'Persediaan'};

  function findResource(name) {
    const requested = String(name || '').toLowerCase().trim();
    return (window.PORTAL_OPD_DIRECTORY || []).find(item => String(item.name || '').toLowerCase().trim() === requested) || null;
  }

  function fileFields(type, period) {
    const periodLabel = `TW ${period} 2026`;
    return type === 'aset-tetap'
      ? [
          {key:'suratPengantar', name:`Surat Pengantar Laporan BMD Triwulan ${period} 2026`},
          {key:'baInternal', name:`BA Rekonsiliasi Aset Tetap Internal ${periodLabel}`},
          {key:'baEksternal', name:`BA Rekonsiliasi Aset Tetap Eksternal ${periodLabel}`},
          {key:'hibah', name:'BAST Hibah', optional:'Jika terdapat Hibah'},
          {key:'reklas', name:'Surat Reklasifikasi BMD', optional:'Jika terdapat Reklasifikasi BMD'}
        ]
      : [
          {key:'baInternalPersediaan', name:`BA Rekonsiliasi Persediaan Internal ${periodLabel}`},
          {key:'baEksternalPersediaan', name:`BA Rekonsiliasi Persediaan Eksternal ${periodLabel}`},
          {key:'stockOpname', name:`Laporan Stock Opname dari Sibaper ${periodLabel}`},
          {key:'mutasi', name:`Rekap Mutasi Persediaan dari Sibaper ${periodLabel}`}
        ];
  }

  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({name:file.name, type:file.type, data:reader.result});
      reader.onerror = () => reject(new Error(`File ${file.name} tidak dapat dibaca.`));
      reader.readAsDataURL(file);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const period = ['I','II','III'].includes(params.get('triwulan')) ? params.get('triwulan') : 'I';
    const type = Object.hasOwn(LABELS, params.get('jenis')) ? params.get('jenis') : 'aset-tetap';
    const resource = findResource(params.get('opd'));
    const form = document.querySelector('[data-report-form]');
    const message = document.querySelector('[data-form-message]');
    const select = document.querySelector('[data-opd-select]');

    document.querySelectorAll('[data-period]').forEach(node => { node.textContent = `Triwulan ${period}`; });
    document.querySelectorAll('[data-type]').forEach(node => { node.textContent = LABELS[type]; });
    document.querySelector('[data-form-back]').href = `laporan-bmd.html?triwulan=${encodeURIComponent(period)}&opd=${encodeURIComponent(resource?.name || '')}`;

    if (!resource || String(resource.parent || '').toLowerCase() === 'disdikbud') {
      select.innerHTML = '<option value="">Perangkat daerah tidak valid</option>';
      form.querySelector('button[type="submit"]').disabled = true;
      message.textContent = 'Perangkat daerah tidak valid atau tidak diwajibkan mengunggah laporan.';
      message.style.display = 'block';
      return;
    }

    select.innerHTML = '';
    select.add(new Option(resource.name, resource.name, true, true));
    document.querySelector('[data-requirements]').innerHTML = fileFields(type, period).map((file, index) => `<div class="field full"><label for="file${index}">${file.name}${file.optional ? ` (${file.optional})` : ' *'}</label><input id="file${index}" name="${file.key}" type="file" accept="application/pdf,.pdf" ${file.optional ? '' : 'required'}><span class="hint">Unggah dalam format PDF, maksimal 8 MB.</span></div>`).join('');

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const button = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);
      const files = [...form.querySelectorAll('input[type="file"]')].map(input => input.files[0]).filter(Boolean);
      if (files.some(file => file.type !== 'application/pdf' || !file.name.toLowerCase().endsWith('.pdf'))) { alert('Semua dokumen harus berupa file PDF.'); return; }
      if (files.some(file => file.size > 8 * 1024 * 1024) || files.reduce((sum, file) => sum + file.size, 0) > 24 * 1024 * 1024) { alert('Ukuran maksimal 8 MB per file dan 24 MB untuk seluruh dokumen.'); return; }

      const payload = {email:String(formData.get('email') || '').trim(), opd:resource.name, jenis:type, triwulan:period};
      for (const input of form.querySelectorAll('input[type="file"]')) {
        if (input.files[0]) payload[input.name] = await toDataUrl(input.files[0]);
      }
      button.disabled = true;
      button.innerHTML = 'Mengirim... <i class="bx bx-loader-alt bx-spin"></i>';
      message.style.display = 'none';
      try {
        const response = await fetch(ENDPOINTS[period], {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify(payload)});
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error(result.error || `HTTP ${response.status}`);
        message.innerHTML = '<i class="bx bx-check-circle"></i> Dokumen berhasil dikirim.';
        message.style.display = 'block';
        form.reset();
        select.value = resource.name;
      } catch (error) {
        alert(`Pengiriman belum berhasil: ${error.message || 'silakan coba kembali atau hubungi admin.'}`);
      } finally {
        button.disabled = false;
        button.innerHTML = 'Kirim Dokumen <i class="bx bx-send"></i>';
      }
    });
  });
})();
