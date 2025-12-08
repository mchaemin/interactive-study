// Filter with URL sync: 검색/카테고리/태그/정렬/페이지 상태를 쿼리에 반영
(function () {
  const app = document.querySelector('[data-app-sync]');
  if (!app) return;

  const searchEl = app.querySelector('[data-search]');
  const categoryEl = app.querySelector('[data-category]');
  const tagsEl = app.querySelector('[data-tags]');
  const sortEl = app.querySelector('[data-sort]');
  const prevEl = app.querySelector('[data-prev]');
  const nextEl = app.querySelector('[data-next]');
  const resetEl = app.querySelector('[data-reset]');
  const listEl = app.querySelector('[data-list]');
  const stateEl = app.querySelector('[data-state]');
  const emptyEl = app.querySelector('[data-empty]');
  const errorEl = app.querySelector('[data-error]');
  const countEl = app.querySelector('[data-count]');
  const keywordEl = app.querySelector('[data-keyword]');
  const pageEl = app.querySelector('[data-page]');

  const data = [
    { id: 1, title: 'IONIQ 6', category: 'ev', tags: ['new'], price: 62000, desc: '전기 세단', badges: ['New'] },
    { id: 2, title: 'Kona Electric', category: 'ev', tags: ['promo'], price: 48000, desc: '컴팩트 EV', badges: ['Promotion'] },
    { id: 3, title: 'Palisade', category: 'suv', tags: ['awd'], price: 58000, desc: '대형 SUV', badges: [] },
    { id: 4, title: 'Sonata', category: 'sedan', tags: [], price: 41000, desc: '세단', badges: [] },
    { id: 5, title: 'Santa Fe', category: 'suv', tags: ['awd','promo'], price: 54000, desc: '패밀리 SUV', badges: ['Promotion'] },
    { id: 6, title: 'Avante', category: 'sedan', tags: ['new'], price: 32000, desc: '준중형 세단', badges: ['New'] },
    { id: 7, title: 'Venue', category: 'suv', tags: [], price: 29000, desc: '도심형 SUV', badges: [] },
    { id: 8, title: 'IONIQ 5', category: 'ev', tags: ['promo'], price: 55000, desc: '전기 SUV', badges: ['Promotion'] },
  ];

  let state = {
    keyword: '',
    category: 'all',
    tags: new Set(),
    sort: 'recent',
    page: 1,
    pageSize: 4,
    loading: false,
    error: false,
  };

  const debounce = (fn, delay = 200) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  };

  const formatPrice = num => `₩${num.toLocaleString()}`;

  const applyURL = () => {
    const params = new URLSearchParams();
    if (state.keyword) params.set('q', state.keyword);
    if (state.category !== 'all') params.set('cat', state.category);
    if (state.tags.size) params.set('tags', [...state.tags].join(','));
    if (state.sort !== 'recent') params.set('sort', state.sort);
    if (state.page > 1) params.set('page', state.page);
    const query = params.toString();
    history.replaceState(null, '', query ? `?${query}` : location.pathname);
  };

  const loadFromURL = () => {
    const params = new URLSearchParams(location.search);
    state.keyword = params.get('q') || '';
    state.category = params.get('cat') || 'all';
    const tags = params.get('tags');
    state.tags = new Set(tags ? tags.split(',').filter(Boolean) : []);
    state.sort = params.get('sort') || 'recent';
    state.page = Number(params.get('page')) || 1;
    searchEl.value = state.keyword;
    categoryEl.value = state.category;
    sortEl.value = state.sort;
    tagsEl.querySelectorAll('button[data-tag]').forEach(btn => {
      btn.classList.toggle('is-active', state.tags.has(btn.dataset.tag));
    });
  };

  const sortItems = (items, sort) => {
    if (sort === 'price-asc') return [...items].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...items].sort((a, b) => b.price - a.price);
    return items;
  };

  const filterItems = () => {
    const q = state.keyword.toLowerCase();
    return data.filter(item => {
      const matchQ = q ? item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) : true;
      const matchCat = state.category === 'all' ? true : item.category === state.category;
      const matchTags = state.tags.size ? [...state.tags].every(tag => item.tags.includes(tag)) : true;
      return matchQ && matchCat && matchTags;
    });
  };

  const render = () => {
    if (state.loading) {
      stateEl.textContent = '로딩중...';
      return;
    }
    stateEl.textContent = '';
    errorEl.hidden = !state.error;
    if (state.error) return;

    const filtered = sortItems(filterItems(), state.sort);
    const start = (state.page - 1) * state.pageSize;
    const end = start + state.pageSize;
    const pageItems = filtered.slice(start, end);

    listEl.innerHTML = pageItems.map(item => `
      <article class="card" data-id="${item.id}">
        <strong>${item.title}</strong>
        <div class="meta">${item.desc}</div>
        <div class="meta price">${formatPrice(item.price)}</div>
        <div class="badges">
          ${item.badges.map(b => `<span class="badge${b === 'Promotion' ? ' promo' : ''}${b === 'AWD' ? ' awd' : ''}">${b}</span>`).join('')}
        </div>
      </article>
    `).join('');

    emptyEl.hidden = filtered.length > 0;
    prevEl.disabled = state.page === 1;
    nextEl.disabled = end >= filtered.length;
    pageEl.textContent = state.page;
    countEl.textContent = filtered.length;
    keywordEl.textContent = state.keyword || '전체';
    applyURL();
  };

  const handleSearch = debounce(value => {
    state.keyword = value.trim();
    state.page = 1;
    render();
  });

  searchEl.addEventListener('input', e => handleSearch(e.target.value));
  categoryEl.addEventListener('change', e => { state.category = e.target.value; state.page = 1; render(); });
  sortEl.addEventListener('change', e => { state.sort = e.target.value; state.page = 1; render(); });
  tagsEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-tag]');
    if (!btn) return;
    const tag = btn.dataset.tag;
    if (state.tags.has(tag)) state.tags.delete(tag); else state.tags.add(tag);
    btn.classList.toggle('is-active');
    state.page = 1;
    render();
  });
  prevEl.addEventListener('click', () => { if (state.page > 1) { state.page -= 1; render(); } });
  nextEl.addEventListener('click', () => { state.page += 1; render(); });
  resetEl.addEventListener('click', () => {
    state = { ...state, keyword:'', category:'all', tags:new Set(), sort:'recent', page:1 };
    searchEl.value = '';
    categoryEl.value = 'all';
    sortEl.value = 'recent';
    tagsEl.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
    render();
  });

  loadFromURL();
  render();
})();
