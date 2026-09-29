const PORTAL_AUTH_CONFIG = {
  // Ganti dengan URL /exec hasil deploy apps-script/Auth.gs.
  apiUrl: 'https://script.google.com/macros/s/AKfycbyQAxHP1sb8an8mYr9gosGT-ui3WhyLIERl61mackTiycgaG-WhsYqiDUQTfU8_rssNpw/exec',
  loginPage: 'login.html',
  publicHome: 'index.html'
};

const PortalAuth = (() => {
  const tokenKey = 'portal_rekon_session';
  const stateKey = 'portal_aset_session_state';
  const cacheMaxAge = 5 * 60 * 1000;
  const backgroundRefreshAge = 60 * 1000;
  let currentState = null;

  function apiReady() {
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(PORTAL_AUTH_CONFIG.apiUrl);
  }

  async function request(action, payload = {}) {
    if (!apiReady()) throw new Error('Layanan login belum dikonfigurasi oleh admin.');
    const controller = new AbortController();
    // Apps Script dapat mengalami cold start dan baru merespons setelah lebih dari
    // 15 detik. Login diberi waktu lebih panjang agar proses yang sebenarnya masih
    // berjalan di server tidak diputus terlalu cepat.
    const timeoutMs = action === 'login' ? 60000 : 45000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'text/plain;charset=utf-8', 'Accept':'application/json'},
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
      body: JSON.stringify({action, ...payload})
    };
    try {
      let response = await fetch(PORTAL_AUTH_CONFIG.apiUrl, requestOptions);
      if (response.status === 404) response = await fetch(PORTAL_AUTH_CONFIG.apiUrl, {...requestOptions, cache:'reload'});
      if (!response.ok) throw new Error(`Layanan login tidak dapat dihubungi (HTTP ${response.status}).`);
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Permintaan ditolak.');
      return result;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('Layanan belum merespons. Periksa koneksi internet, lalu coba kembali.');
      throw error;
    } finally { clearTimeout(timeout); }
  }

  function token() {
    try { return localStorage.getItem(tokenKey) || ''; }
    catch (_) { return ''; }
  }
  function cachedSession() {
    try {
      const cached = JSON.parse(sessionStorage.getItem(stateKey) || 'null');
      if (!cached || cached.token !== token() || Date.now() - cached.cachedAt > cacheMaxAge || new Date(cached.expiresAt).getTime() <= Date.now()) return null;
      return cached;
    } catch (_) { return null; }
  }
  function saveSession(result, sessionToken = token()) {
    const cached = {...result, token:sessionToken, cachedAt:Date.now()};
    try { sessionStorage.setItem(stateKey, JSON.stringify(cached)); } catch (_) {}
    return cached;
  }
  function clearSession() {
    try { localStorage.removeItem(tokenKey); } catch (_) {}
    try { sessionStorage.removeItem(stateKey); } catch (_) {}
  }
  function returnUrl() {
    const value = new URLSearchParams(location.search).get('return');
    return value && !value.includes('://') && !value.startsWith('//') ? value : 'index.html';
  }
  function goToLogin() {
    const target = `${PORTAL_AUTH_CONFIG.loginPage}?return=${encodeURIComponent(location.pathname.split('/').pop() + location.search)}`;
    location.replace(target);
  }

  async function requireSession() {
    if (!token()) { goToLogin(); return null; }
    const cached = cachedSession();
    if (cached) {
      currentState = cached;
      renderAccount(cached.user);
      applyAccessNavigation(cached);
      document.documentElement.classList.add('auth-ready');
      if (Date.now() - cached.cachedAt > backgroundRefreshAge) refreshSessionInBackground();
      return cached;
    }
    try {
      const result = await request('session', {token: token()});
      currentState = saveSession(result);
      renderAccount(result.user);
      applyAccessNavigation(result);
      document.documentElement.classList.add('auth-ready');
      return currentState;
    } catch (error) {
      clearSession();
      goToLogin();
      return null;
    }
  }

  async function refreshSessionInBackground() {
    try {
      const result = await request('session', {token:token()});
      currentState = saveSession(result);
    } catch (_) {
      clearSession();
      goToLogin();
    }
  }

  async function login(username, password) {
    const result = await request('login', {username: username.trim(), password});
    try { localStorage.setItem(tokenKey, result.token); }
    catch (_) { throw new Error('Browser memblokir penyimpanan sesi pada file lokal. Buka portal melalui web server atau hosting.'); }
    currentState = saveSession(result, result.token);
    location.replace(returnUrl());
  }

  async function logout() {
    const savedToken = token();
    clearSession();
    currentState = null;
    if (savedToken && apiReady()) request('logout', {token: savedToken}).catch(() => {});
    location.replace(PORTAL_AUTH_CONFIG.publicHome);
  }

  async function changePassword(currentPassword, newPassword) {
    return request('changePassword', {token: token(), currentPassword, newPassword});
  }

  function renderAccount(user) {
    const nav = document.querySelector('.nav-links');
    if (!nav || nav.querySelector('.account-menu')) return;
    const adminAction = user.role === 'verifier' ? '<button type="button" data-manage-users><i class="bx bx-user-check"></i> Kelola akun</button><button type="button" data-manage-reconciliation><i class="bx bx-task"></i> Status rekonsiliasi</button>' : '';
    nav.insertAdjacentHTML('beforeend', `<div class="account-menu"><button type="button" class="account-button" aria-expanded="false"><i class="bx bx-user-circle"></i><span>${escapeHtml(user.name)}</span><i class="bx bx-chevron-down"></i></button><div class="account-dropdown"><small>Login sebagai</small><strong>${escapeHtml(user.name)}</strong>${adminAction}<button type="button" data-change-password><i class="bx bx-key"></i> Ubah password</button><button type="button" data-logout><i class="bx bx-log-out"></i> Keluar</button></div></div>`);
    const menu = nav.querySelector('.account-menu');
    menu.querySelector('.account-button').addEventListener('click', () => menu.classList.toggle('open'));
    menu.querySelector('[data-logout]').addEventListener('click', logout);
    menu.querySelector('[data-change-password]').addEventListener('click', () => document.querySelector('[data-password-dialog]')?.showModal());
    menu.querySelector('[data-manage-users]')?.addEventListener('click', () => { location.href = 'admin-akun.html'; });
    menu.querySelector('[data-manage-reconciliation]')?.addEventListener('click', () => { location.href = 'admin-status-rekon.html'; });
    ensurePasswordDialog();
  }

  function applyAccessNavigation(session) {
    const links = document.querySelectorAll('[data-reconciliation-link]');
    if (!links.length || session.user.role !== 'unit') return;
    links.forEach(link => {
      if (session.resources.length === 1) {
        link.href = session.resources[0].url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `Buka kertas kerja ${session.resources[0].name}`);
        const description = link.querySelector('p');
        const cta = link.querySelector('.cta');
        if (description) description.textContent = `Buka Google Sheet Rekonsiliasi Aset Tetap ${session.resources[0].name}.`;
        if (cta) cta.innerHTML = 'Buka kertas kerja <i class="bx bx-link-external"></i>';
      } else {
        link.href = '#';
        link.classList.add('disabled');
        link.addEventListener('click', event => {
          event.preventDefault();
          alert('Link kertas kerja untuk akun ini belum tersedia. Hubungi admin portal.');
        });
      }
    });
  }

  function ensurePasswordDialog() {
    if (document.querySelector('[data-password-dialog]')) return;
    document.body.insertAdjacentHTML('beforeend', `<dialog class="password-dialog" data-password-dialog><form method="dialog" data-password-form><button class="dialog-close" type="button" aria-label="Tutup">&times;</button><span class="eyebrow">Keamanan akun</span><h2>Ubah password</h2><label>Password saat ini<div class="password-field"><input name="currentPassword" type="password" autocomplete="current-password" required><button type="button" class="toggle-password" aria-label="Tampilkan password"><i class="bx bx-show"></i></button></div></label><label>Password baru<div class="password-field"><input name="newPassword" type="password" autocomplete="new-password" minlength="8" required><button type="button" class="toggle-password" aria-label="Tampilkan password"><i class="bx bx-show"></i></button></div></label><label>Ulangi password baru<div class="password-field"><input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required><button type="button" class="toggle-password" aria-label="Tampilkan password"><i class="bx bx-show"></i></button></div></label><p class="dialog-message" aria-live="polite"></p><button class="button" type="submit">Simpan password</button></form></dialog>`);
    const form = document.querySelector('[data-password-form]');
    const dialog = document.querySelector('[data-password-dialog]');
    form.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      form.reset();
      form.querySelector('.dialog-message').textContent = '';
      form.querySelectorAll('.toggle-password').forEach(button => {
        button.parentElement.querySelector('input').type = 'password';
        button.setAttribute('aria-label', 'Tampilkan password');
        button.querySelector('i').className = 'bx bx-show';
      });
    });
    bindPasswordToggles(dialog);
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const message = form.querySelector('.dialog-message');
      if (form.newPassword.value !== form.confirmPassword.value) { message.textContent = 'Konfirmasi password tidak sama.'; return; }
      const button = form.querySelector('[type="submit"]');
      button.disabled = true; message.textContent = '';
      try {
        await changePassword(form.currentPassword.value, form.newPassword.value);
        message.textContent = 'Password berhasil diubah. Anda akan keluar dari layanan.';
        setTimeout(logout, 900);
      } catch (error) { message.textContent = error.message; }
      button.disabled = false;
    });
  }

  function escapeHtml(value) {
    const node = document.createElement('span'); node.textContent = value || ''; return node.innerHTML;
  }

  function bindPasswordToggles(root = document) {
    root.querySelectorAll('.toggle-password').forEach(button => {
      if (button.dataset.bound) return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('input');
        const showing = input.type === 'text';
        input.type = showing ? 'password' : 'text';
        button.setAttribute('aria-label', showing ? 'Tampilkan password' : 'Sembunyikan password');
        button.querySelector('i').className = showing ? 'bx bx-show' : 'bx bx-hide';
      });
    });
  }

  return {request, requireSession, login, logout, changePassword, token, returnUrl, bindPasswordToggles, state: () => currentState, apiReady};
})();

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('[data-login-form]');
  if (loginForm) {
    document.documentElement.classList.add('auth-ready');
    PortalAuth.bindPasswordToggles?.(document);
    if (PortalAuth.token()) location.replace(PortalAuth.returnUrl?.() || 'index.html');
    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const message = loginForm.querySelector('[data-login-message]');
      const button = loginForm.querySelector('button[type="submit"]');
      message.textContent = ''; button.disabled = true; button.textContent = 'Memeriksa...';
      const slowNotice = setTimeout(() => {
        message.classList.add('is-info');
        message.textContent = 'Server sedang menyiapkan data. Mohon tunggu sebentar...';
      }, 8000);
      try { await PortalAuth.login(loginForm.username.value, loginForm.password.value); }
      catch (error) {
        message.classList.remove('is-info');
        message.textContent = error.message;
        button.disabled = false;
        button.textContent = 'Masuk ke layanan';
      } finally { clearTimeout(slowNotice); }
    });
  } else {
    window.portalSessionReady = PortalAuth.requireSession();
  }
});
