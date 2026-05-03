/* =====================================================
   PRODUCT.JS — Página de detalhes do produto
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  initHeader();
  loadProduct();
});

/* --- CARREGAR PRODUTO --- */
function loadProduct() {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));

  if (!productId) {
    showProductNotFound();
    return;
  }

  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    showProductNotFound();
    return;
  }

  renderProduct(product);
}

/* --- RENDERIZAR PRODUTO --- */
function renderProduct(product) {
  const container = document.getElementById('product-detail');
  const breadcrumbName = document.getElementById('breadcrumb-name');
  const pageTitle = document.title;

  if (breadcrumbName) breadcrumbName.textContent = product.name;
  document.title = `${product.name} — Hospen`;

  // const discount = calcDiscount(product.originalPrice, product.price);
  // const badgeHTML = product.badge === 'sale'
  //   ? `<span class="badge-sale">-${discount}% OFF</span>`
  //   : product.badge === 'new'
  //   ? `<span class="badge-new">NOVO</span>`
  //   : '';

  // Todos os produtos (exceto Camisa dry fit id=1) como indefinidos na página de detalhes
  if (product.id !== 1) {
    container.innerHTML = `
      <div class="product-detail-images">
        <div class="product-main-image">
          <div style="width:100%;height:320px;display:flex;align-items:center;justify-content:center;background:#f3f3f3;color:#bbb;font-size:2rem;">Imagem indefinida</div>
        </div>
      </div>
      <div class="product-detail-info">
        <span class="product-category"></span>
        <h1 class="product-detail-name">Indefinido</h1>
        <div class="product-detail-price"></div>
        <p class="product-detail-description">Produto indefinido, novos produtos em breve.</p>
      </div>
    `;
    return;
  }
  // Produtos normais
  container.innerHTML = `
    <div class="product-detail-images">
      <div class="product-main-image">
        <img src="${product.image}" alt="${product.name}" id="main-image" />
      </div>
    </div>

    <div class="product-detail-info">
      <span class="product-category">${product.categoryLabel}</span>
      <h1 class="product-detail-name">${product.name}</h1>
      
      <div class="product-detail-rating">
        <span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
        <span class="rating-value">${product.rating}</span>
        <span class="rating-count">(${product.reviews} avaliações)</span>
      </div>

      <div class="product-detail-price">
        <span class="price-current">${formatCurrency(product.price)}</span>
      </div>

      <p class="product-detail-description">${product.description}</p>

      <div class="product-detail-sizes" style="margin-bottom:16px;">
        <label for="select-size" style="font-weight:600;">Tamanho:</label>
        <select id="select-size" style="margin-left:8px;padding:4px 8px;">
          <option value="" disabled selected>Selecione</option>
          <option value="P">P</option>
          <option value="M">M</option>
          <option value="G">G</option>
          <option value="GG">GG</option>
        </select>
      </div>

      <div class="product-detail-actions">
        <div class="quantity-selector">
          <button class="qty-btn" onclick="changeQty(-1)"><i class="fa-solid fa-minus"></i></button>
          <span id="product-qty">1</span>
          <button class="qty-btn" onclick="changeQty(1)"><i class="fa-solid fa-plus"></i></button>
        </div>
        <button class="btn btn-primary btn-add-to-cart" onclick="addToCartFromDetail(${product.id})">
          <i class="fa-solid fa-cart-plus"></i> Adicionar ao carrinho
        </button>
      </div>

      <div class="product-detail-benefits">
        <div class="benefit"><i class="fa-solid fa-truck-fast"></i> Frete grátis</div>
        <div class="benefit"><i class="fa-solid fa-shield-halved"></i> Compra segura</div>
        <div class="benefit"><i class="fa-solid fa-rotate-left"></i> Devolução em até 30 dias</div>
      </div>
    </div>
  `;
}

/* --- PRODUTO NÃO ENCONTRADO --- */
function showProductNotFound() {
  const container = document.getElementById('product-detail');
  container.innerHTML = `
    <div class="product-not-found">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <h2>Produto não encontrado</h2>
      <p>O produto que você está procurando não existe ou foi removido.</p>
      <a href="catalog.html" class="btn btn-primary">Ver todos os produtos</a>
    </div>
  `;
}

/* --- QUANTIDADE --- */
let productQty = 1;

function changeQty(delta) {
  productQty = Math.max(1, productQty + delta);
  document.getElementById('product-qty').textContent = productQty;
}

/* --- ADICIONAR AO CARRINHO --- */
function addToCartFromDetail(productId) {
  for (let i = 0; i < productQty; i++) {
    Cart.addItem(productId);
  }
  
  showToast(`✅ ${productQty} item(s) adicionado(s) ao carrinho!`);
  productQty = 1;
  document.getElementById('product-qty').textContent = 1;
}

/* --- HEADER (reutilizado de main.js) --- */
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