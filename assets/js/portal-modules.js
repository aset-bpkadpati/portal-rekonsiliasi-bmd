const RECONCILIATION_MODULE = {
  name: 'Rekonsiliasi BMD',
  icon: 'bx-spreadsheet',
  description: 'Akses Aset Tetap, Persediaan (SIBAPER), pengumpulan laporan, dan video tutorial.',
  url: 'modul-rekonsiliasi.html',
  meta: '4 layanan rekonsiliasi'
};

function reconciliationCard(module) {
  return `<a class="asset-module-card blue active-module" href="${module.url}"><div class="module-card-top"><span class="module-icon"><i class="bx ${module.icon}"></i></span><span class="module-status active">Aktif</span></div><h3>${module.name}</h3><p>${module.description}</p><div class="module-card-footer"><small>${module.meta}</small><span>Buka layanan <i class="bx bx-right-arrow-alt"></i></span></div></a>`;
}

function renderPortalHome() {
  const grid = document.querySelector('[data-module-grid]');
  if (!grid) return;
  grid.innerHTML = reconciliationCard(RECONCILIATION_MODULE);
  const count = document.querySelector('[data-module-count]');
  if (count) count.textContent = '4 layanan tersedia';
}

document.addEventListener('DOMContentLoaded', renderPortalHome);
