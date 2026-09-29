(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('[data-back-to-top]');
    if (!button) return;

    function updateVisibility() {
      const visible = window.scrollY > 420;
      button.classList.toggle('visible', visible);
      button.setAttribute('aria-hidden', String(!visible));
      button.tabIndex = visible ? 0 : -1;
    }

    button.addEventListener('click', () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({top:0, behavior:reducedMotion ? 'auto' : 'smooth'});
    });

    window.addEventListener('scroll', updateVisibility, {passive:true});
    updateVisibility();
  });
})();
