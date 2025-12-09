// Tab UI Demo: 이벤트 위임으로 탭 토글
(function () {
  const root = document.querySelector('[data-tabs-app]');
  if (!root) return;
  const tabs = root.querySelector('[data-tabs]');
  const panels = root.querySelectorAll('[data-panel]');

  tabs.addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    const target = btn.dataset.tab;
    tabs.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('is-active', b === btn));
    panels.forEach(panel => panel.classList.toggle('is-active', panel.dataset.panel === target));
  });
})();
