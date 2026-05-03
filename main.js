/* =====================================================
   MAIN.JS — Inicialização da página principal
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initHeader();
  renderCategories();
  renderFeaturedProducts();
  renderBestSellers();
  initNewsletter();
});

/* --- HEADER --- */
function initHeader() {
  const btnCart = document.getElementById('btn-cart-header');
  const cartSidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('overlay');
  const btnCloseCart = document.getElementById('btn-close-cart');
  const btnContinue = document.getElementById('btn-continue-shopping');
  const btnMenuMobile = document.getElementById('btn-menu-mobile');
  const navMobile = document.getElementById('nav-mobile');
  const btnSearch = document.querySelector('.btn-search');
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input');
  const btnSearchClose = document.getElementById('btn-search-close');

  function openCart() {
    cartSidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnCart) btnCart.addEventListener('click', openCart);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
  if (btnContinue) btnContinue.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', () => {
    closeCart();
    if (navMobile) navMobile.classList.remove('open');
  });

  if (btnMenuMobile && navMobile) {
    btnMenuMobile.addEventListener('click', () => {
      navMobile.classList.toggle('open');
    });
  }

  if (btnSearch && searchBar) {
    btnSearch.addEventListener('click', () => {
      searchBar.classList.toggle('open');
      if (searchBar.classList.contains('open') && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (btnSearchClose && searchBar) {
    btnSearchClose.addEventListener('click', () => {
      searchBar.classList.remove('open');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}

/* --- CATEGORIAS --- */
function renderCategories() {
  const grid = document.getElementById('categories-grid');
  if (!grid) return;

  grid.innerHTML = CATEGORIES.map(cat => `
    <a href="catalog.html?category=${cat.id}" class="category-card">
      <div class="cat-icon">${cat.icon}</div>
      <span>${cat.name}</span>
    </a>
  `).join('');
}

/* --- PRODUTOS EM DESTAQUE --- */
function renderFeaturedProducts() {
  const grid = document.getElementById('featured-products');
  if (!grid) return;

  const featured = PRODUCTS.filter(p => p.featured).slice(0, 4);
  grid.innerHTML = featured.map(renderProductCard).join('');
}

/* --- MAIS VENDIDOS --- */
function renderBestSellers() {
  const grid = document.getElementById('best-sellers');
  if (!grid) return;

  const sellers = PRODUCTS.filter(p => p.bestSeller).slice(0, 4);
  grid.innerHTML = sellers.map(renderProductCard).join('');
}

/* --- CARD DE PRODUTO --- */
function renderProductCard(product) {
  // const discount = calcDiscount(product.originalPrice, product.price);
  // const badgeHTML = product.badge === 'sale'
  //   ? `<span class="badge-sale">-${discount}%</span>`
  //   : product.badge === 'new'
  //   ? `<span class="badge-new">NOVO</span>`
  //   : '';

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-img-wrap">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </a>
        <button class="btn-wishlist" aria-label="Adicionar aos favoritos">
          <i class="fa-regular fa-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoryLabel}</span>
        <h3 class="product-name">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-rating">
          <span class="stars-sm">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatCurrency(product.price)}</span>
        </div>
        ${product.name === 'Camisa dry fit' ? `
        <div class="product-sizes">
          <label for="size-select-${product.id}" style="font-size:0.95em;margin-bottom:2px;display:block;">Tamanho:</label>
          <select id="size-select-${product.id}" class="size-select">
            <option value="P">P</option>
            <option value="M">M</option>
            <option value="G">G</option>
            <option value="GG">GG</option>
          </select>
        </div>
        ` : ''}
        <button class="btn-add-cart" onclick="handleAddToCart(${product.id}, this)" aria-label="Adicionar ao carrinho">
          <i class="fa-solid fa-cart-plus"></i> Adicionar ao carrinho
        </button>
      </div>
    </article>
  `;
}

/* --- ADICIONAR AO CARRINHO COM FEEDBACK --- */
function handleAddToCart(productId, btn) {
  Cart.addItem(productId);
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.classList.add('added');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Adicionado!';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = originalHTML;
    }, 1500);
  }
}

/* --- NEWSLETTER --- */
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast('🎉 Sucesso! Você receberá seu cupom de 10% OFF no e-mail em breve.');
      input.value = '';
    }
  });
}
