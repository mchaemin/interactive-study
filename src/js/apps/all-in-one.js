// All-in-one: 기존 데모(필터/페이징/드롭다운/다크모드/레이아웃)를 간략 버전으로 통합
(function () {
  const app = document.querySelector('[data-all-app]');
  if (!app) return;

  // 필터 슬롯: 간단히 카드 4개 렌더
  const filterSlot = app.querySelector('[data-slot="filter"]');
  filterSlot.innerHTML = `
    <div class="cards">
      <article class="card"><strong>IONIQ 6</strong><p>전기 세단</p></article>
      <article class="card"><strong>Palisade</strong><p>대형 SUV</p></article>
      <article class="card"><strong>Santa Fe</strong><p>패밀리 SUV</p></article>
      <article class="card"><strong>Avante</strong><p>준중형 세단</p></article>
    </div>
  `;

  // 페이징 슬롯: 페이지 번호 mock
  const paginationSlot = app.querySelector('[data-slot="pagination"]');
  paginationSlot.innerHTML = `
    <div class="pager">
      <button type="button" disabled>이전</button>
      <div class="pages">
        <button type="button" class="is-active">1</button>
        <button type="button">2</button>
        <button type="button">3</button>
      </div>
      <button type="button">다음</button>
    </div>
  `;

  // 드롭다운 슬롯: 간단 드롭다운
  const dropdownSlot = app.querySelector('[data-slot="dropdown"]');
  dropdownSlot.innerHTML = `
    <div class="dropdown" data-dropdown>
      <button class="dropdown__btn" aria-expanded="false">선택하세요</button>
      <ul class="dropdown__list" hidden>
        <li><button type="button" data-value="all">전체</button></li>
        <li><button type="button" data-value="suv">SUV</button></li>
        <li><button type="button" data-value="ev">전기차</button></li>
      </ul>
    </div>
    <p>선택값: <span data-selected>없음</span></p>
  `;
  const dd = dropdownSlot.querySelector('[data-dropdown]');
  if (dd) {
    const btn = dd.querySelector('.dropdown__btn');
    const list = dd.querySelector('.dropdown__list');
    const selectedEl = dropdownSlot.querySelector('[data-selected]');
    const toggle = open => { list.hidden = !open; btn.setAttribute('aria-expanded', String(open)); if (open) list.querySelector('button')?.focus(); };
    btn.addEventListener('click', () => toggle(list.hidden));
    list.addEventListener('click', e => {
      const item = e.target.closest('button[data-value]');
      if (!item) return;
      btn.textContent = item.textContent;
      selectedEl.textContent = item.textContent;
      toggle(false);
    });
    document.addEventListener('click', e => { if (!dd.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  }

  // 레이아웃 전환 슬롯
  const layoutSlot = app.querySelector('[data-slot="layout"]');
  layoutSlot.innerHTML = `
    <div class="switch">
      <button type="button" data-view="card" class="is-active">카드 뷰</button>
      <button type="button" data-view="list">리스트 뷰</button>
    </div>
    <div class="container card-view" data-container>
      <article class="item card"><strong>IONIQ 6</strong><p>전기 세단</p></article>
      <article class="item card"><strong>Palisade</strong><p>대형 SUV</p></article>
    </div>
  `;
  const switcher = layoutSlot.querySelector('.switch');
  const container = layoutSlot.querySelector('[data-container]');
  switcher.addEventListener('click', e => {
    const btn = e.target.closest('button[data-view]');
    if (!btn) return;
    const view = btn.dataset.view;
    [...switcher.querySelectorAll('button')].forEach(b => b.classList.toggle('is-active', b === btn));
    container.className = `container ${view}-view`;
    container.innerHTML = view === 'card'
      ? `
        <article class="item card"><strong>IONIQ 6</strong><p>전기 세단</p></article>
        <article class="item card"><strong>Palisade</strong><p>대형 SUV</p></article>
      `
      : `
        <article class="item list"><strong>IONIQ 6</strong> - 전기 세단</article>
        <article class="item list"><strong>Palisade</strong> - 대형 SUV</article>
      `;
  });

  // 다크모드 토글
  const toggleBtn = app.querySelector('[data-toggle]');
  const THEME_KEY = 'all_in_one_theme';
  const applyTheme = theme => {
    document.body.setAttribute('data-theme', theme);
    toggleBtn.textContent = theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드';
    localStorage.setItem(THEME_KEY, theme);
  };
  const current = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(current);
  toggleBtn.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
})();
