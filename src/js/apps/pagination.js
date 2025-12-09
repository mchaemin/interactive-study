// Pagination UI 데모
(function () {
  const app = document.querySelector('[data-pagination-app]');
  if (!app) return;

  const listEl = app.querySelector('[data-list]');
  const stateEl = app.querySelector('[data-state]');
  const emptyEl = app.querySelector('[data-empty]');
  const errorEl = app.querySelector('[data-error]');
  const pagesEl = app.querySelector('[data-pages]');
  const prevEl = app.querySelector('[data-prev]');
  const nextEl = app.querySelector('[data-next]');

  const data = Array.from({ length: 28 }, (_, i) => ({ id: i + 1, title: `아이템 ${i + 1}`, desc: `설명 ${i + 1}` }));

  let state = {
    page: 1,
    pageSize: 6,
    loading: false,
    error: false,
  };

  const setLoading = flag => {
    state.loading = flag;
    stateEl.textContent = flag ? '로딩중...' : '';
  };

  const renderList = items => {
    listEl.innerHTML = items.map(item => `
      <article class="card">
        <strong>${item.title}</strong>
        <div class="meta">${item.desc}</div>
      </article>
    `).join('');
  };

  const renderPager = total => {
    const totalPages = Math.ceil(total / state.pageSize);
    pagesEl.innerHTML = Array.from({ length: totalPages }, (_, i) => i + 1).map(num => `
      <button type="button" data-page="${num}" class="${num === state.page ? 'is-active' : ''}">${num}</button>
    `).join('');
    prevEl.disabled = state.page === 1;
    nextEl.disabled = state.page === totalPages;
  };

  const render = () => {
    if (state.loading) return;
    errorEl.hidden = !state.error;
    if (state.error) return;

    const start = (state.page - 1) * state.pageSize;
    const pageItems = data.slice(start, start + state.pageSize);
    renderList(pageItems);
    emptyEl.hidden = data.length > 0;
    renderPager(data.length);
  };

  pagesEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-page]');
    if (!btn) return;
    state.page = Number(btn.dataset.page);
    render();
  });
  prevEl.addEventListener('click', () => { if (state.page > 1) { state.page -= 1; render(); } });
  nextEl.addEventListener('click', () => {
    const totalPages = Math.ceil(data.length / state.pageSize);
    if (state.page < totalPages) { state.page += 1; render(); }
  });

  // 초기 렌더 (모킹)
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    render();
  }, 300);
})();
