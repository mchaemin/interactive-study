// Dropdown 접근성 데모
(function () {
  const root = document.querySelector('[data-dropdown-app]');
  if (!root) return;
  const dropdown = root.querySelector('[data-dropdown]');
  const btn = dropdown.querySelector('.dropdown__btn');
  const list = dropdown.querySelector('.dropdown__list');
  const selectedEl = root.querySelector('[data-selected]');

  const toggle = open => {
    list.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) list.querySelector('button')?.focus();
  };

  btn.addEventListener('click', () => toggle(list.hidden));
  list.addEventListener('click', e => {
    const item = e.target.closest('button[data-value]');
    if (!item) return;
    btn.textContent = item.textContent;
    selectedEl.textContent = item.textContent;
    toggle(false);
  });
  document.addEventListener('click', e => {
    if (!dropdown.contains(e.target)) toggle(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') toggle(false);
  });
})();
