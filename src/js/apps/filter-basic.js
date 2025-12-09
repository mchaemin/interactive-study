// Filter + Card List (분리 버전)
(function () {
  const app = document.querySelector('[data-app-filter-basic]');
  if (!app) return;

  const searchEl = app.querySelector('[data-search]');
  const categoryEl = app.querySelector('[data-category]');
  const tagsEl = app.querySelector('[data-tags]');
  const sortEl = app.querySelector('[data-sort]');
  const listEl = app.querySelector('[data-list]');
  const stateEl = app.querySelector('[data-state]');
  const emptyEl = app.querySelector('[data-empty]');
  const errorEl = app.querySelector('[data-error]');
  const countEl = app.querySelector('[data-count]');
  const keywordEl = app.querySelector('[data-keyword]');
  const recentEl = app.querySelector('[data-recent]');
  const sentinel = app.querySelector('[data-sentinel]');

  const STORAGE_KEY = 'filter_basic_recent';
  const storage = sessionStorage;
  const data = [
    { id: 1, title: 'IONIQ 6', category: 'ev', tags: ['new'], price: 62000, desc: '전기 세단', badges: ['New'] },
    { id: 2, title: 'Kona Electric', category: 'ev', tags: ['promo'], price: 48000, desc: '컴팩트 EV', badges: ['Promotion'] },
    { id: 3, title: 'Palisade', category: 'suv', tags: ['awd'], price: 58000, desc: '대형 SUV', badges: ['AWD'] },
    { id: 4, title: 'Sonata', category: 'sedan', tags: [], price: 41000, desc: '세단', badges: [] },
    { id: 5, title: 'Santa Fe', category: 'suv', tags: ['awd', 'promo'], price: 54000, desc: '패밀리 SUV', badges: ['Promotion', 'AWD'] },
    { id: 6, title: 'Avante', category: 'sedan', tags: ['new'], price: 32000, desc: '준중형 세단', badges: ['New'] },
    { id: 7, title: 'Venue', category: 'suv', tags: [], price: 29000, desc: '도심형 SUV', badges: [] },
    { id: 8, title: 'IONIQ 5', category: 'ev', tags: ['promo'], price: 55000, desc: '전기 SUV', badges: ['Promotion'] },
    { id: 9, title: 'Tucson', category: 'suv', tags: ['awd'], price: 51000, desc: 'SUV', badges: ['AWD'] },
    { id: 10, title: 'Grandeur', category: 'sedan', tags: ['promo'], price: 45000, desc: '준대형 세단', badges: ['Promotion'] },
    { id: 11, title: 'Kona Hybrid', category: 'suv', tags: ['new'], price: 47000, desc: '하이브리드 SUV', badges: ['New'] },
    { id: 12, title: 'Nexo', category: 'ev', tags: [], price: 60000, desc: '수소 전기차', badges: [] },
  ];

  let state = {
    keyword: '',
    category: 'all',
    tags: new Set(),
    sort: 'recent',
    page: 1,
    pageSize: 6,
    loading: false,
    error: false,
    total: data.length,
  };

  const debounce = (fn, delay = 200) => { let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }; };
  const formatPrice = num => `₩${num.toLocaleString()}`;

  const createSkeletons = count => {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i += 1) {
      const div = document.createElement('div');
      div.className = 'skeleton';
      frag.appendChild(div);
    }
    const wrap = document.createElement('div');
    wrap.className = 'skeletons is-active';
    wrap.appendChild(frag);
    wrap.setAttribute('aria-hidden', 'true');
    return wrap;
  };

  const setLoading = flag => {
    state.loading = flag;
    const exist = app.querySelector('.skeletons');
    if (flag) {
      if (exist) exist.remove();
      const sk = createSkeletons(state.pageSize);
      listEl.insertAdjacentElement('beforebegin', sk);
      listEl.innerHTML = '';
    } else if (exist) {
      exist.remove();
    }
  };

  const sortItems = (items, sort) => {
    if (sort === 'price-asc') return [...items].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...items].sort((a, b) => b.price - a.price);
    return items;
  };

  const filterItems = () => {
    const q = state.keyword.trim().toLowerCase();
    return data.filter(item => {
      const matchQ = q ? item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) : true;
      const matchCat = state.category === 'all' ? true : item.category === state.category;
      const matchTags = state.tags.size
        ? [...state.tags].every(tag => item.tags.some(t => t.toLowerCase() === tag.toLowerCase()))
        : true;
      return matchQ && matchCat && matchTags;
    });
  };

  const saveRecent = kw => {
    if (!kw) return;
    const recents = loadRecent().filter(v => v !== kw);
    recents.unshift(kw);
    storage.setItem(STORAGE_KEY, JSON.stringify(recents.slice(0, 6)));
  };
  const loadRecent = () => { try { return JSON.parse(storage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } };

  const renderRecent = () => {
    const recents = loadRecent();
    recentEl.innerHTML = recents.map(r => `<button type="button" data-recent-key="${r}">${r}</button>`).join('') || '<span class="none">없음</span>';
  };

  const render = () => {
    if (state.loading) return;
    stateEl.textContent = '';
    errorEl.hidden = !state.error;
    if (state.error) return;

    const filtered = sortItems(filterItems(), state.sort);
    state.total = filtered.length;
    const end = state.page * state.pageSize;
    const pageItems = filtered.slice(0, end);

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
    countEl.textContent = filtered.length;
    keywordEl.textContent = state.keyword.trim() || '전체';
  };

  const handleSearch = debounce(value => {
    state.keyword = value.trim();
    state.page = 1;
    saveRecent(state.keyword);
    renderRecent();
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

  recentEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-recent-key]');
    if (!btn) return;
    state.keyword = btn.dataset.recentKey;
    searchEl.value = state.keyword;
    state.page = 1;
    render();
  });

  resetEl?.addEventListener('click', () => {
    state = { ...state, keyword:'', category:'all', tags:new Set(), sort:'recent', page:1 };
    searchEl.value = '';
    categoryEl.value = 'all';
    sortEl.value = 'recent';
    tagsEl.querySelectorAll('button').forEach(b => b.classList.remove('is-active'));
    render();
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const filteredLength = filterItems().length;
        if (state.page * state.pageSize < filteredLength) {
          state.page += 1;
          render();
        }
      }
    });
  });
  io.observe(sentinel);

  renderRecent();
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    render();
  }, 400);
})();
