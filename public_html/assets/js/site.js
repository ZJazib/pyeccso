// Minimal helpers used across the site
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-toggle="nav"]');
  if (t) document.querySelector('.nav')?.classList.toggle('open');

  const openM = e.target.closest('[data-modal-open]');
  if (openM) {
    const m = document.getElementById(openM.getAttribute('data-modal-open'));
    m?.classList.add('open');
  }
  const closeM = e.target.closest('[data-modal-close]');
  if (closeM) closeM.closest('.modal-backdrop')?.classList.remove('open');
  if (e.target.classList?.contains('modal-backdrop')) e.target.classList.remove('open');

  const tab = e.target.closest('[data-tab]');
  if (tab) {
    const key = tab.dataset.tab;
    const scope = tab.closest('[data-tabs]') || document;
    scope.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
    scope.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === key));
  }
});

document.querySelectorAll('.lang-switch select').forEach(sel => {
  sel.addEventListener('change', () => {
    const u = new URL(window.location.href);
    u.searchParams.set('lang', sel.value);
    window.location.href = u.toString();
  });
});
