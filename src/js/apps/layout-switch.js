// Layout Switch: 카드 <-> 리스트 뷰 전환
(function () {
  const app = document.querySelector('[data-layout-app]');
  if (!app) return;
  const container = app.querySelector('[data-container]');
  const switcher = app.querySelector('.switch');

  const data = [
    { id:1, title:'IONIQ 6', desc:'전기 세단' },
    { id:2, title:'Palisade', desc:'대형 SUV' },
    { id:3, title:'Santa Fe', desc:'패밀리 SUV' },
    { id:4, title:'Avante', desc:'준중형 세단' },
  ];

  let view = 'card';

  const render = () => {
    container.className = `container ${view}-view`;
    container.innerHTML = data.map(item => `
      <article class="item ${view}">
        <strong>${item.title}</strong>
        <p>${item.desc}</p>
      </article>
    `).join('');
  };

  switcher.addEventListener('click', e => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    view = btn.dataset.view;
    [...switcher.querySelectorAll('button')].forEach(b => b.classList.toggle('is-active', b === btn));
    render();
  });

  render();
})();
