/* =====================================================
   CATALOG.JS — Página de catálogo de produtos
   ===================================================== */

const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let filteredProducts = [...PRODUCTS];

document.addEventListener('DOMContentLoaded', () => {
  parseURLParams();
  buildCategoryFilters();
  applyFilters();
  showMobileFilterToggle();
});

/* --- PARSE URL PARAMS --- */
function parseURLParams() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const filter = params.get('filter');
  const search = params.get('search');

  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  if (search) {
    const input = document.getElementById('search-input');
    if (input) input.value = search;
    if (pageTitle) pageTitle.textContent = `Resultados para: "${search}"`;
  } else if (category) {
    const cat = CATEGORIES.find(c => c.id === category);
    if (cat) {
      if (pageTitle) pageTitle.textContent = `${cat.icon} ${cat.name}`;
      if (pageSubtitle) pageSubtitle.textContent = `Produtos da categoria ${cat.name}`;
    }
  } else if (filter === 'sale') {
    if (pageTitle) pageTitle.textContent = '🏷️ Promoções';
    if (pageSubtitle) pageSubtitle.textContent = 'Produtos com desconto especial';
  } else if (filter === 'new') {
    if (pageTitle) pageTitle.textContent = '✨ Novidades';
    if (pageSubtitle) pageSubtitle.textContent = 'Os produtos mais recentes da loja';
  }
}

/* --- BUILD CATEGORY FILTERS --- */
function buildCategoryFilters() {
  const container = document.getElementById('filter-categories');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const activeCategory = params.get('category');

  container.innerHTML = `
    <div class="filter-option">
      <input type="checkbox" id="cat-all" value="all" ${!activeCategory ? 'checked' : ''} onchange="handleCatFilter(this)" />
      <label for="cat-all">Todas as categorias</label>
    </div>
    ${CATEGORIES.map(cat => `
      <div class="filter-option">
        <input type="checkbox" id="cat-${cat.id}" value="${cat.id}" ${activeCategory === cat.id ? 'checked' : ''} onchange="handleCatFilter(this)" />
        <label for="cat-${cat.id}">${cat.icon} ${cat.name}</label>
      </div>
    `).join('')}
  `;
}

/* --- HANDLE CATEGORY FILTER --- */
function handleCatFilter(el) {
  const allCheckbox = document.getElementById('cat-all');

  if (el.value === 'all') {
    // Desmarcar todas as outras
    CATEGORIES.forEach(cat => {
      const cb = document.getElementById(`cat-${cat.id}`);
      if (cb) cb.checked = false;
    });
    el.checked = true;
  } else {
    // Desmarcar "Todas"
    if (allCheckbox) allCheckbox.checked = false;
    // Se nenhuma está marcada, marcar "Todas" de volta
    const anyChecked = CATEGORIES.some(cat => {
      const cb = document.getElementById(`cat-${cat.id}`);
      return cb && cb.checked;
    });
    if (!anyChecked && allCheckbox) allCheckbox.checked = true;
  }

  currentPage = 1;
  applyFilters();
}

/* --- APPLY FILTERS --- */
function applyFilters() {
  const params = new URLSearchParams(window.location.search);
  const searchParam = params.get('search');

  // Categorias selecionadas
  const selectedCats = CATEGORIES
    .filter(cat => {
      const cb = document.getElementById(`cat-${cat.id}`);
      return cb && cb.checked;
    })
    .map(cat => cat.id);

  const allChecked = document.getElementById('cat-all')?.checked;

  // Preços selecionados
  const priceFilters = [];
  ['0-100', '100-200', '200-300', '300+'].forEach(v => {
    const el = document.getElementById(`price-${v.replace('+', '')}`);
    if (el && el.checked) priceFilters.push(v);
  });

  // Badge filters
  const saleCb = document.getElementById('filter-sale');
  const newCb = document.getElementById('filter-new');

  // Sort
  const sortEl = document.getElementById('catalog-sort');
  const sortVal = sortEl ? sortEl.value : 'default';

  // URL filter (sale/new/category)
  const urlFilter = params.get('filter');
  const urlCategory = params.get('category');

  let products = [...PRODUCTS];

  // Filtro URL
  if (urlFilter === 'sale') products = products.filter(p => p.badge === 'sale');
  if (urlFilter === 'new') products = products.filter(p => p.badge === 'new');
  if (urlCategory && !selectedCats.length) products = products.filter(p => p.category === urlCategory);

  // Filtro de categoria (checkboxes)
  if (!allChecked && selectedCats.length > 0) {
    products = products.filter(p => selectedCats.includes(p.category));
  } else if (!allChecked && !urlCategory) {
    // Nada selecionado — mostrar tudo
  }

  // Filtro de preço
  if (priceFilters.length > 0) {
    products = products.filter(p => priceFilters.some(pf => {
      if (pf === '0-100') return p.price <= 100;
      if (pf === '100-200') return p.price > 100 && p.price <= 200;
      if (pf === '200-300') return p.price > 200 && p.price <= 300;
      if (pf === '300+') return p.price > 300;
    }));
  }

  // Filtro badge
  const badgeFilters = [];
  if (saleCb && saleCb.checked) badgeFilters.push('sale');
  if (newCb && newCb.checked) badgeFilters.push('new');
  if (badgeFilters.length > 0) {
    products = products.filter(p => badgeFilters.includes(p.badge));
  }

  // Busca por texto
  if (searchParam) {
    const q = searchParam.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  // Ordenação
  products = sortProducts(products, sortVal);

  filteredProducts = products;
  renderCatalog();
}

/* --- SORT --- */
function sortProducts(products, sort) {
  switch (sort) {
    case 'price-asc': return [...products].sort((a, b) => a.price - b.price);
    case 'price-desc': return [...products].sort((a, b) => b.price - a.price);
    case 'rating': return [...products].sort((a, b) => b.rating - a.rating);
    case 'reviews': return [...products].sort((a, b) => b.reviews - a.reviews);
    default: return products;
  }
}

/* --- RENDER CATALOG --- */
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('catalog-count');

  if (!grid) return;

  const total = filteredProducts.length;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, total);
  const pageProducts = filteredProducts.slice(start, end);

  if (countEl) {
    countEl.textContent = total === 0
      ? 'Nenhum produto encontrado'
      : `Mostrando ${start + 1}–${end} de ${total} produto${total !== 1 ? 's' : ''}`;
  }

  if (pageProducts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted);">
        <i class="fa-solid fa-magnifying-glass" style="font-size:3rem;opacity:.3;display:block;margin-bottom:16px"></i>
        <p style="font-size:1rem;font-weight:600;margin-bottom:8px">Nenhum produto encontrado</p>
        <p style="font-size:0.88rem">Tente outros filtros ou termos de busca</p>
        <button class="btn btn-primary" style="margin-top:20px" onclick="clearFilters()">Limpar filtros</button>
      </div>
    `;
    renderPagination(total);
    return;
  }

  grid.innerHTML = pageProducts.map(renderProductCard).join('');
  renderPagination(total);

  // Scroll ao topo da grade ao trocar página
  if (currentPage > 1) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* --- PAGINATION --- */
function renderPagination(total) {
  const container = document.getElementById('pagination');
  if (!container) return;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) { container.innerHTML = ''; return; }

  let html = '';

  // Prev
  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled style="opacity:.4"' : ''} onclick="goToPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;

  // Pages
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7 && p > 3 && p < totalPages - 2 && Math.abs(p - currentPage) > 1) {
      if (p === 4 || p === totalPages - 3) html += `<span style="padding:0 4px;align-self:center;color:var(--text-muted)">…</span>`;
      continue;
    }
    html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>`;
  }

  // Next
  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled style="opacity:.4"' : ''} onclick="goToPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;

  container.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderCatalog();
}

/* --- CLEAR FILTERS --- */
function clearFilters() {
  // Checkboxes de categoria
  const allCb = document.getElementById('cat-all');
  if (allCb) allCb.checked = true;
  CATEGORIES.forEach(cat => {
    const cb = document.getElementById(`cat-${cat.id}`);
    if (cb) cb.checked = false;
  });

  // Checkboxes de preço
  ['0-100', '100-200', '200-300', '300+'].forEach(v => {
    const el = document.getElementById(`price-${v.replace('+', '')}`);
    if (el) el.checked = false;
  });

  // Badges
  const saleCb = document.getElementById('filter-sale');
  const newCb = document.getElementById('filter-new');
  if (saleCb) saleCb.checked = false;
  if (newCb) newCb.checked = false;

  // Sort
  const sortEl = document.getElementById('catalog-sort');
  if (sortEl) sortEl.value = 'default';

  currentPage = 1;
  applyFilters();
}

/* --- MOBILE FILTER TOGGLE --- */
function showMobileFilterToggle() {
  if (window.innerWidth <= 1024) {
    const toggleEl = document.getElementById('mobile-filter-toggle');
    if (toggleEl) toggleEl.style.display = 'block';
  }
}

function toggleMobileFilters() {
  const sidebar = document.getElementById('filters-sidebar');
  if (!sidebar) return;
  const isOpen = sidebar.style.display === 'block';
  sidebar.style.display = isOpen ? '' : 'block';
}
