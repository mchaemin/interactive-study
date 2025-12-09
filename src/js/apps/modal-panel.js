// Modal / Detail Panel UI: 카드 클릭 -> 오른쪽 패널 오픈, ESC/닫기 지원
(function () {
  const app = document.querySelector('[data-modal-app]');
  if (!app) return;

  const listEl = app.querySelector('[data-list]');
  const detail = app.querySelector('[data-detail]');
  const detailBody = app.querySelector('[data-detail-body]');
  const closeBtn = app.querySelector('[data-close]');

  const data = [
    { id:1, title:'IONIQ 6', desc:'전기 세단', price:'₩62,000', spec:'배터리 77kWh · AWD' },
    { id:2, title:'Palisade', desc:'대형 SUV', price:'₩58,000', spec:'3.8 가솔린 · 7인승' },
    { id:3, title:'Santa Fe', desc:'패밀리 SUV', price:'₩54,000', spec:'하이브리드 · AWD' },
    { id:4, title:'Avante', desc:'준중형 세단', price:'₩32,000', spec:'1.6 가솔린' },
  ];

  const renderCards = () => {
    listEl.innerHTML = data.map(item => `
      <article class="card" data-id="${item.id}" tabindex="0">
        <strong>${item.title}</strong>
        <div class="meta">${item.desc}</div>
        <div class="meta">${item.price}</div>
      </article>
    `).join('');
  };

  const openDetail = item => {
    if (!item) return;
    detailBody.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <p>${item.price}</p>
      <p>${item.spec}</p>
    `;
    detail.hidden = false;
  };

  const closeDetail = () => { detail.hidden = true; };

  listEl.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const id = Number(card.dataset.id);
    openDetail(data.find(d => d.id === id));
  });

  listEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const card = e.target.closest('.card');
      if (!card) return;
      const id = Number(card.dataset.id);
      openDetail(data.find(d => d.id === id));
    }
  });

  closeBtn.addEventListener('click', closeDetail);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetail();
  });

  renderCards();
})();
