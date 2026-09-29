(() => {
  const resources = [...(window.PORTAL_OPD_DIRECTORY || [])]
    .sort((a, b) => a.name.localeCompare(b.name, 'id'));

  function escapeHtml(value) {
    const node = document.createElement('span');
    node.textContent = value || '';
    return node.innerHTML;
  }

  function groupLabel(parent) {
    const value = String(parent || '').toLowerCase().trim();
    if (value === 'disdikbud') return 'UPT Disdikbud';
    if (value === 'dinkes') return 'UPT Dinkes';
    return value ? `Unit ${parent}` : 'Perangkat Daerah';
  }

  function render() {
    const query = (document.querySelector('[data-opd-search]').value || '').toLowerCase().trim();
    const filtered = resources.filter(resource => `${resource.name} ${resource.parent}`.toLowerCase().includes(query));
    document.querySelector('[data-opd-count]').textContent = `${filtered.length} dari ${resources.length} perangkat daerah/unit`;
    document.querySelector('[data-opd-table]').innerHTML = filtered.map((resource, index) => {
      const href = `opd.html?nama=${encodeURIComponent(resource.name)}`;
      return `<tr data-opd-row="${encodeURIComponent(resource.name)}"><td class="asset-row-number" data-label="No.">${index + 1}</td><td class="asset-resource-name" data-label="Perangkat daerah/unit"><a href="${href}">${escapeHtml(resource.name)}</a><small>${escapeHtml(groupLabel(resource.parent))}</small></td><td class="asset-table-action-cell" data-label="Aksi"><a class="asset-table-action" href="${href}">Lihat detail <i class="bx bx-right-arrow-alt"></i></a></td></tr>`;
    }).join('') || '<tr><td colspan="3" class="directory-empty">Perangkat daerah atau unit tidak ditemukan.</td></tr>';

    document.querySelectorAll('[data-opd-row]').forEach(row => row.addEventListener('click', event => {
      if (event.target.closest('a')) return;
      location.href = `opd.html?nama=${encodeURIComponent(decodeURIComponent(row.dataset.opdRow))}`;
    }));
  }

  function init() {
    document.querySelector('[data-opd-search]').addEventListener('input', render);
    document.querySelector('[data-opd-total]').textContent = resources.length;
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
