// Kia 스타일 검색 + 실습 데모 통합 스크립트

// 기존 검색 페이지: 메뉴/차량 섹션 렌더
(function () {
  const root = document.querySelector('.finder');
  if (!root) return;

  const menuList = root.querySelector('.menu-list');
  const vehicleList = root.querySelector('[data-list]');
  const emptyEl = root.querySelector('[data-empty]');
  const summaryCountEl = root.querySelector('.finder__summary .count');
  const summaryKeywordEl = root.querySelector('.finder__summary .keyword');
  const searchInput = root.querySelector('[data-search]');
  const searchBtn = root.querySelector('[data-search-btn]');
  const moreMenuBtn = root.querySelector('.finder__section--menus .more');
  const moreVehicleBtn = root.querySelector('.finder__section--vehicles .more');

  const menus = [
    { id: 1, path: 'PBV > PBV Electric Vans Vision' },
    { id: 2, path: 'Special PBV > PBV Electric Vans Vision' },
    { id: 3, path: 'PBV > PBV Electric Vans Vision' },
    { id: 4, path: 'menu02 > PBV Electric Vans Vision' },
    { id: 5, path: 'EV > EV 브랜드' },
  ];

  const vehicles = [
    {
      id: 1,
      title: '2024 The Sportage',
      price: 'From € 999,999.00 ~ (VAT included)',
      desc: 'Combined Fuel Consumption : 9.4-8.8L / 100Km | Combined CO2 Emissions : 213-201g/Km | CO2 Efficiency : A+',
      tags: ['HEV', 'HEV'],
      badges: ['New', 'Promotion'],
    },
    {
      id: 2,
      title: '2024 The Sportage',
      price: 'From € 999,999.00 ~ (VAT included)',
      desc: 'Combined Fuel Consumption : 9.4-8.8L / 100Km | Combined CO2 Emissions : 213-201g/Km | CO2 Efficiency : A+',
      tags: ['HEV', 'HEV'],
      badges: ['Promotion'],
    },
    {
      id: 3,
      title: '2024 The Sportage',
      price: 'From € 999,999.00 ~ (VAT included)',
      desc: 'Combined Fuel Consumption : 9.4-8.8L / 100Km | Combined CO2 Emissions : 213-201g/Km | CO2 Efficiency : A+',
      tags: ['HEV', 'HEV'],
      badges: ['New'],
    },
    {
      id: 4,
      title: 'EV6 GT Line',
      price: 'From € 89,000.00 ~ (VAT included)',
      desc: 'Combined Fuel Consumption : 0L / 100Km | Combined CO2 Emissions : 0g/Km | CO2 Efficiency : A+',
      tags: ['EV', 'AWD'],
      badges: ['Promotion'],
    },
  ];

  let state = {
    keyword: '',
    menuLimit: 4,
    vehicleLimit: 3,
  };

  const badgeTpl = badge => `<span class="badge${badge === 'Promotion' ? ' badge--green' : ''}">${badge}</span>`;

  const renderMenus = filtered => {
    const items = filtered.slice(0, state.menuLimit);
    menuList.innerHTML = items
      .map(
        item => `
        <div class="menu-card">
          <span class="path">${item.path}</span>
          <span class="arrow">›</span>
        </div>
      `,
      )
      .join('');
    if (moreMenuBtn) {
      moreMenuBtn.hidden = filtered.length <= state.menuLimit;
      moreMenuBtn.textContent = `More (${Math.max(filtered.length - state.menuLimit, 0)})`;
    }
  };

  const renderVehicles = filtered => {
    const items = filtered.slice(0, state.vehicleLimit);
    vehicleList.innerHTML = items
      .map(
        v => `
      <article class="card">
        ${v.badges?.length ? `<div class="badges">${v.badges.map(badgeTpl).join('')}</div>` : ''}
        <strong>${v.title}</strong>
        <div class="meta price">${v.price}</div>
        <div class="meta">${v.desc}</div>
        <div class="tags">${v.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </article>
    `,
      )
      .join('');

    emptyEl.hidden = filtered.length > 0;
    if (moreVehicleBtn) {
      moreVehicleBtn.hidden = filtered.length <= state.vehicleLimit;
      moreVehicleBtn.textContent = `More (${Math.max(filtered.length - state.vehicleLimit, 0)})`;
    }
  };

  const renderSummary = (menuCount, vehicleCount) => {
    const total = menuCount + vehicleCount;
    summaryCountEl.textContent = total;
    summaryKeywordEl.textContent = state.keyword || '전체';
  };

  const filterData = () => {
    const q = state.keyword.toLowerCase();
    const menuFiltered = menus.filter(m => !q || m.path.toLowerCase().includes(q));
    const vehicleFiltered = vehicles.filter(
      v =>
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.desc.toLowerCase().includes(q) ||
        v.tags.some(t => t.toLowerCase().includes(q)),
    );
    return { menuFiltered, vehicleFiltered };
  };

  const render = () => {
    const { menuFiltered, vehicleFiltered } = filterData();
    renderMenus(menuFiltered);
    renderVehicles(vehicleFiltered);
    renderSummary(menuFiltered.length, vehicleFiltered.length);
  };

  const handleSearch = () => {
    state.keyword = searchInput.value.trim();
    state.menuLimit = 4;
    state.vehicleLimit = 3;
    render();
  };

  const handleMoreMenu = () => {
    state.menuLimit += 4;
    render();
  };

  const handleMoreVehicle = () => {
    state.vehicleLimit += 3;
    render();
  };

  searchInput.addEventListener('input', handleSearch);
  searchBtn.addEventListener('click', handleSearch);
  if (moreMenuBtn) moreMenuBtn.addEventListener('click', handleMoreMenu);
  if (moreVehicleBtn) moreVehicleBtn.addEventListener('click', handleMoreVehicle);

  render();
})();

// --- 실습 데모 초기화들 ---
(function domToggleDemo() {
  const gnb = document.querySelector('[data-gnb]');
  if (!gnb) return;
  const btn = gnb.querySelector('.gnb__toggle');
  const list = gnb.querySelector('.gnb__list');
  btn.addEventListener('click', () => {
    const open = list.hidden;
    list.hidden = !open;
    btn.setAttribute('aria-expanded', open);
    gnb.classList.toggle('is-active', open);
  });
})();

(function renderCardsDemo() {
  const wrap = document.querySelector('[data-cards]');
  if (!wrap) return;
  const data = [{ title: 'Alpha' }, { title: 'Beta' }, { title: 'Gamma' }];
  wrap.innerHTML = data.map(item => `<li class="card">${item.title}</li>`).join('');
})();

(function tabFilterDemo() {
  const tabs = document.querySelector('[data-tabs]');
  const cards = document.querySelector('[data-cards-tab]');
  if (!tabs || !cards) return;
  const items = [
    { title: '가이드 A', type: 'guide' },
    { title: '샘플 B', type: 'sample' },
    { title: '가이드 C', type: 'guide' },
  ];
  let state = { tab: 'all' };
  const render = () => {
    cards.innerHTML = items
      .filter(i => state.tab === 'all' || i.type === state.tab)
      .map(i => `<li class="card">${i.title}</li>`)
      .join('');
  };
  tabs.addEventListener('click', e => {
    const btn = e.target.closest('[data-tab]'); if (!btn) return;
    state.tab = btn.dataset.tab;
    [...tabs.children].forEach(b => b.classList.toggle('is-active', b === btn));
    render();
  });
  render();
})();

(function formValidationDemo() {
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const msg = form.querySelector('[data-msg]');
  const validate = input =>
    input.validity.valueMissing ? '이메일을 입력하세요' :
    input.validity.typeMismatch ? '형식이 아닙니다' : '';
  form.addEventListener('input', e => {
    if (e.target.name !== 'email') return;
    const m = validate(e.target);
    msg.textContent = m;
    e.target.classList.toggle('is-error', !!m);
  });
  form.addEventListener('submit', e => {
    if (validate(form.email)) e.preventDefault();
  });
})();

(function fetchStateDemo() {
  const stateEl = document.querySelector('[data-state]');
  const listEl = document.querySelector('[data-fetch-list]');
  const emptyEl = document.querySelector('[data-fetch-empty]');
  const errorEl = document.querySelector('[data-fetch-error]');
  if (!stateEl || !listEl) return;
  const render = items => {
    listEl.innerHTML = items.map(i => `<li class="card">${i.title}</li>`).join('');
    emptyEl.hidden = items.length > 0;
  };
  (async () => {
    stateEl.textContent = '로딩중...';
    try {
      await new Promise(r => setTimeout(r, 300)); // 목업 지연
      const data = [{ title: '공지 1' }, { title: '공지 2' }];
      render(data);
      stateEl.textContent = data.length ? '' : '없음';
    } catch (err) {
      listEl.innerHTML = '';
      errorEl.hidden = false;
      stateEl.textContent = '오류';
    }
  })();
})();

(function modalDemo() {
  const modal = document.querySelector('[data-modal]');
  const openBtn = document.querySelector('[data-open]');
  if (!modal || !openBtn) return;
  const closeTargets = modal.querySelectorAll('[data-close], .backdrop');
  const openModal = open => { modal.hidden = !open; };
  openBtn.addEventListener('click', () => openModal(true));
  closeTargets.forEach(btn => btn.addEventListener('click', () => openModal(false)));
})();
