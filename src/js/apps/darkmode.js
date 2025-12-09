// Dark Mode Toggle (localStorage 저장)
(function () {
  const app = document.querySelector('[data-dark-app]');
  if (!app) return;
  const toggleBtn = app.querySelector('[data-toggle]');
  const THEME_KEY = 'demo_theme';

  const applyTheme = theme => {
    document.body.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      toggleBtn.textContent = '☀️ 라이트 모드';
    } else {
      toggleBtn.textContent = '🌙 다크 모드';
    }
    localStorage.setItem(THEME_KEY, theme);
  };

  const current = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(current);

  toggleBtn.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
})();
