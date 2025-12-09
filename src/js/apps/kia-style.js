// Kia 스타일 검색/카드 페이지 간단 버전
(function () {
  const app = document.querySelector('[data-kia-app]');
  if (!app) return;

  const searchEl = app.querySelector('[data-search]');
  const searchBtn = app.querySelector('[data-search-btn]');
  const countEl = app.querySelector('[data-count]');
  const keywordEl = app.querySelector('[data-keyword]');

  const menuList = app.querySelector('[data-menu-list]');
  const vehicleList = app.querySelector('[data-vehicle-list]');
  const pageList = app.querySelector('[data-page-list]');

  const menuMore = app.querySelector('[data-menu-more]');
  const vehicleMore = app.querySelector('[data-vehicle-more]');
  const pageMore = app.querySelector('[data-page-more]');

  const data = {
    menus: [
      { path: 'PBV > PBV Electric Vans Vision' },
      { path: 'Special PBV > PBV Electric Vans Vision' },
      { path: 'menu02 > PBV Electric Vans Vision' },
      { path: 'PBV > PBV Electric Vans Vision' },
      { path: 'PBV > PBV Electric Vans Vision' },
    ],
    vehicles: [
      { title: '2024 The Sportage', price: '₩54,000', desc: '패밀리 SUV', badges:['New','Promotion'] },
      { title: '2024 The Sportage', price: '₩54,000', desc: '패밀리 SUV', badges:['Promotion'] },
      { title: '2024 The Sportage', price: '₩54,000', desc: '패밀리 SUV', badges:['New'] },
      { title: '2024 The Sportage', price: '₩54,000', desc: '패밀리 SUV', badges:[] },
    ],
    pages: [
      { title:'Kia Signs MOU...', desc:'Kia Corporation and Uber ...' },
      { title:'Kia Signs MOU...', desc:'Kia Corporation and Uber ...' },
      { title:'Kia Signs MOU...', desc:'Kia Corporation and Uber ...' },
      { title:'Kia Signs MOU...', desc:'Kia Corporation and Uber ...' },
      { title:'Kia Signs MOU...', desc:'Kia Corporation and Uber ...' },
    ]
  };

  let state = {
    keyword: '',
    menuLimit: 4,
    vehicleLimit: 3,
    pageLimit: 3,
  };

  const renderMenus = items => {
    menuList.innerHTML = items.slice(0, state.menuLimit).map(m => `
      <div class="menu-card">
        <span class="path">${m.path}</span>
        <span class="arrow">›</span>
      </div>
    `).join('');
    menuMore.hidden = items.length <= state.menuLimit;
  };

  const renderVehicles = items => {
    vehicleList.innerHTML = items.slice(0, state.vehicleLimit).map(v => `
      <article class="vehicle-card">
        <div class="thumb"></div>
        <strong>${v.title}</strong>
        <div class="price">${v.price}</div>
        <div class="meta">${v.desc}</div>
        <div class="badges">
          ${v.badges.map(b => `<span class="badge${b==='Promotion'?' promo':''}">${b}</span>`).join('')}
        </div>
      </article>
    `).join('');
    vehicleMore.hidden = items.length <= state.vehicleLimit;
  };

  const renderPages = items => {
    pageList.innerHTML = items.slice(0, state.pageLimit).map(p => `
      <div class="page-item">
        <strong>${p.title}</strong>
        <p>${p.desc}</p>
      </div>
    `).join('');
    pageMore.hidden = items.length <= state.pageLimit;
  };

  const applySearch = () => {
    const kw = state.keyword.toLowerCase();
    const menus = kw ? data.menus.filter(m => m.path.toLowerCase().includes(kw)) : data.menus;
    const vehicles = kw ? data.vehicles.filter(v => v.title.toLowerCase().includes(kw) || v.desc.toLowerCase().includes(kw)) : data.vehicles;
    const pages = kw ? data.pages.filter(p => p.title.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw)) : data.pages;

    renderMenus(menus);
    renderVehicles(vehicles);
    renderPages(pages);

    countEl.textContent = menus.length + vehicles.length + pages.length;
    keywordEl.textContent = state.keyword || '전체';
  };

  searchBtn.addEventListener('click', () => {
    state.keyword = searchEl.value.trim();
    state.menuLimit = 4; state.vehicleLimit = 3; state.pageLimit = 3;
    applySearch();
  });
  searchEl.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); searchBtn.click(); }});

  menuMore.addEventListener('click', () => { state.menuLimit += 4; applySearch(); });
  vehicleMore.addEventListener('click', () => { state.vehicleLimit += 3; applySearch(); });
  pageMore.addEventListener('click', () => { state.pageLimit += 3; applySearch(); });

  // 초기 렌더
  applySearch();
})();
