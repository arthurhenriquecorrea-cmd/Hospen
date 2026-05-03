/* =====================================================
   CART.JS — Gerenciamento do carrinho de compras
   ===================================================== */

const Cart = (() => {
  const STORAGE_KEY = 'hospen_cart';

  // Carregar carrinho do localStorage
  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  // Salvar carrinho no localStorage
  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  // Obter todos os itens
  function getItems() {
    return load();
  }

  // Adicionar produto ao carrinho
  function addItem(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const items = load();
    const existingIndex = items.findIndex(i => i.id === productId);

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
      if (items[existingIndex].quantity > product.stock) {
        items[existingIndex].quantity = product.stock;
      }
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.categoryLabel,
        quantity: Math.min(quantity, product.stock),
        stock: product.stock,
      });
    }

    save(items);
    updateCartUI();
    showToast(`"${product.name}" adicionado ao carrinho! 🛍️`);
  }

  // Remover produto do carrinho
  function removeItem(productId) {
    const items = load().filter(i => i.id !== productId);
    save(items);
    updateCartUI();
  }

  // Alterar quantidade
  function updateQuantity(productId, delta) {
    const items = load();
    const idx = items.findIndex(i => i.id === productId);
    if (idx < 0) return;

    items[idx].quantity += delta;
    if (items[idx].quantity <= 0) {
      items.splice(idx, 1);
    } else if (items[idx].quantity > items[idx].stock) {
      items[idx].quantity = items[idx].stock;
    }

    save(items);
    updateCartUI();
  }

  // Limpar carrinho
  function clear() {
    save([]);
    updateCartUI();
  }

  // Total de itens
  function getTotalItems() {
    return load().reduce((acc, i) => acc + i.quantity, 0);
  }

  // Subtotal
  function getSubtotal() {
    return load().reduce((acc, i) => acc + i.price * i.quantity, 0);
  }

  // Frete
  function getShipping() {
    const sub = getSubtotal();
    if (sub === 0) return 0;
    return sub >= STORE_CONFIG.freeShippingThreshold ? 0 : STORE_CONFIG.shippingCost;
  }

  // Total final
  function getTotal() {
    return getSubtotal() + getShipping();
  }

  // Atualizar toda a UI do carrinho
  function updateCartUI() {
    const items = load();
    const totalItems = getTotalItems();

    // Badge
    const badge = document.getElementById('cart-badge');
    if (badge) {
      badge.textContent = totalItems;
      badge.classList.toggle('visible', totalItems > 0);
    }

    // Lista de itens
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartFooter = document.getElementById('cart-footer');

    if (!cartItemsEl) return;

    if (items.length === 0) {
      if (cartEmpty) cartEmpty.style.display = '';
      if (cartFooter) cartFooter.style.display = 'none';
      cartItemsEl.innerHTML = '';
      cartItemsEl.appendChild(cartEmpty || createEmptyEl());
      return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = '';

    cartItemsEl.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatCurrency(item.price * item.quantity)}</div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, -1)" aria-label="Diminuir quantidade">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" onclick="Cart.updateQuantity(${item.id}, 1)" aria-label="Aumentar quantidade">+</button>
            <button class="btn-remove-item" onclick="Cart.removeItem(${item.id})" aria-label="Remover item">
              <i class="fa-solid fa-trash-can"></i> Remover
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Totais
    const subtotal = getSubtotal();
    const shipping = getShipping();
    const total = getTotal();

    const elSub = document.getElementById('cart-subtotal');
    const elShip = document.getElementById('cart-freight');
    const elTotal = document.getElementById('cart-total');

    if (elSub) elSub.textContent = formatCurrency(subtotal);
    if (elShip) elShip.textContent = shipping === 0 ? 'Grátis 🎉' : formatCurrency(shipping);
    if (elTotal) elTotal.textContent = formatCurrency(total);
  }

  function createEmptyEl() {
    const div = document.createElement('div');
    div.className = 'cart-empty';
    div.innerHTML = `<i class="fa-solid fa-bag-shopping"></i><p>Seu carrinho está vazio</p>`;
    return div;
  }

  // Inicializar
  function init() {
    updateCartUI();
  }

  return { addItem, removeItem, updateQuantity, clear, getItems, getSubtotal, getShipping, getTotal, getTotalItems, init, updateCartUI };
})();

/* =====================================================
   TOAST
   ===================================================== */
let toastTimer;
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}
