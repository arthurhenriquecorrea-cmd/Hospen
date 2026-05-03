/* =====================================================
   CHECKOUT.JS — Lógica da página de checkout
   ===================================================== */

let couponDiscount = 0;
const VALID_COUPONS = {
  'DESCONTO10': 0.10,
  'PRIMEIRA': 0.10,
  'FRETE': 'frete',
  'HOSPEN20': 0.20,
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.init();
  checkEmptyCart();
  renderOrderSummary();
  updateInstallments();
  maskInputs();
});

/* --- VERIFICAR CARRINHO VAZIO --- */
function checkEmptyCart() {
  const items = Cart.getItems();
  if (items.length === 0) {
    const main = document.getElementById('checkout-main');
    if (main) {
      main.innerHTML = `
        <div class="success-page">
          <div class="success-card">
            <i class="fa-solid fa-bag-shopping" style="font-size:3.5rem;color:var(--text-muted);opacity:.3;margin-bottom:20px;display:block"></i>
            <h2>Carrinho vazio</h2>
            <p>Adicione produtos ao carrinho antes de finalizar a compra.</p>
            <a href="catalog.html" class="btn btn-primary">Ver produtos</a>
          </div>
        </div>
      `;
    }
  }
}

/* --- RENDER ORDER SUMMARY --- */
function renderOrderSummary() {
  const items = Cart.getItems();
  const listEl = document.getElementById('order-items-list');
  const totalsEl = document.getElementById('order-totals');

  if (!listEl || !totalsEl) return;

  listEl.innerHTML = items.map(item => `
    <div class="order-item">
      <div class="order-item-img">
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="order-item-info">
        <div class="order-item-name">${item.name}</div>
        <div class="order-item-qty">Qtd: ${item.quantity}</div>
      </div>
      <div class="order-item-price">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join('');

  renderTotals();
}

/* --- RENDER TOTALS --- */
function renderTotals() {
  const totalsEl = document.getElementById('order-totals');
  if (!totalsEl) return;

  const subtotal = Cart.getSubtotal();
  const shipping = Cart.getShipping();
  const pixMethod = document.querySelector('.payment-option[data-method="pix"]');
  const isPixActive = pixMethod && pixMethod.classList.contains('active');
  const pixDiscount = isPixActive ? subtotal * 0.05 : 0;
  const couponVal = couponDiscount === 'frete' ? shipping : subtotal * (couponDiscount || 0);
  const total = Math.max(0, subtotal + shipping - pixDiscount - (couponDiscount === 'frete' ? shipping : couponVal));

  totalsEl.innerHTML = `
    <div class="order-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
    <div class="order-row"><span>Frete</span><span style="color:${shipping === 0 ? 'var(--success)' : 'inherit'}">${shipping === 0 ? 'Grátis 🎉' : formatCurrency(shipping)}</span></div>
    ${pixDiscount > 0 ? `<div class="order-row" style="color:var(--success)"><span>Desconto PIX (5%)</span><span>-${formatCurrency(pixDiscount)}</span></div>` : ''}
    ${couponVal > 0 ? `<div class="order-row" style="color:var(--success)"><span>Cupom de desconto</span><span>-${formatCurrency(couponVal)}</span></div>` : ''}
    ${couponDiscount === 'frete' ? `<div class="order-row" style="color:var(--success)"><span>Cupom frete grátis</span><span>-${formatCurrency(shipping)}</span></div>` : ''}
    <div class="order-row total"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
    <p style="text-align:right;font-size:0.78rem;color:var(--text-muted);margin-top:4px">
      ${subtotal >= 150 ? '✅ Frete grátis aplicado' : `Falta ${formatCurrency(150 - subtotal)} para frete grátis`}
    </p>
  `;
}

/* --- PAYMENT METHOD --- */
function selectPayment(method) {
  document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
  document.querySelectorAll('.payment-fields').forEach(field => field.classList.remove('visible'));

  const selectedOpt = document.querySelector(`.payment-option[data-method="${method}"]`);
  const selectedField = document.getElementById(`payment-${method}`);

  if (selectedOpt) selectedOpt.classList.add('active');
  if (selectedField) selectedField.classList.add('visible');

  // PIX: atualizar totais com desconto
  renderTotals();
}

/* --- COUPON --- */
function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;

  const code = input.value.trim().toUpperCase();
  const discount = VALID_COUPONS[code];

  if (!discount) {
    showToast('❌ Cupom inválido ou expirado');
    return;
  }

  couponDiscount = discount;
  input.disabled = true;

  if (discount === 'frete') {
    showToast('🎉 Cupom aplicado! Frete grátis nesta compra.');
  } else {
    showToast(`🎉 Cupom aplicado! ${(discount * 100).toFixed(0)}% de desconto.`);
  }

  renderTotals();
}

/* --- INSTALLMENTS --- */
function updateInstallments() {
  const total = Cart.getTotal();
  const select = document.getElementById('card-installments');
  if (!select) return;

  const options = [
    { value: 1, label: `1x de ${formatCurrency(total)} sem juros` },
    { value: 2, label: `2x de ${formatCurrency(total / 2)} sem juros` },
    { value: 3, label: `3x de ${formatCurrency(total / 3)} sem juros` },
    { value: 6, label: `6x de ${formatCurrency(total / 6)} sem juros` },
    { value: 12, label: `12x de ${formatCurrency((total * 1.0799) / 12)} (juros de 7,99% a.m.)` },
  ];

  select.innerHTML = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
}

/* --- FORM MASKS --- */
function maskInputs() {
  const cpfInput = document.getElementById('input-cpf');
  if (cpfInput) cpfInput.addEventListener('input', () => { cpfInput.value = maskCPF(cpfInput.value); });

  const phoneInput = document.getElementById('input-phone');
  if (phoneInput) phoneInput.addEventListener('input', () => { phoneInput.value = maskPhone(phoneInput.value); });

  const cepInput = document.getElementById('input-cep');
  if (cepInput) cepInput.addEventListener('input', () => { cepInput.value = maskCEP(cepInput.value); });
}

function maskCPF(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  return v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function maskPhone(v) {
  v = v.replace(/\D/g, '').slice(0, 11);
  return v.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d{4})$/, '$1-$2');
}

function maskCEP(v) {
  v = v.replace(/\D/g, '').slice(0, 8);
  return v.replace(/(\d{5})(\d)/, '$1-$2');
}

function formatCardNumber(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  input.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
}

/* --- CEP AUTO-FILL --- */
function handleCEP(input) {
  input.value = maskCEP(input.value);
  const cep = input.value.replace(/\D/g, '');
  if (cep.length === 8) fetchCEP(cep);
}

async function fetchCEP(cep) {
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) return;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('input-street', data.logradouro);
    set('input-neighborhood', data.bairro);
    set('input-city', data.localidade);
    set('input-state', data.uf);

    const numberInput = document.getElementById('input-number');
    if (numberInput) numberInput.focus();
  } catch (e) {
    // silencioso
  }
}

/* --- FORM VALIDATION --- */
function validateForm() {
  const requiredFields = [
    { id: 'input-name', label: 'Nome completo' },
    { id: 'input-email', label: 'E-mail' },
    { id: 'input-cpf', label: 'CPF' },
    { id: 'input-phone', label: 'Telefone' },
    { id: 'input-cep', label: 'CEP' },
    { id: 'input-street', label: 'Rua' },
    { id: 'input-number', label: 'Número' },
    { id: 'input-neighborhood', label: 'Bairro' },
    { id: 'input-city', label: 'Cidade' },
    { id: 'input-state', label: 'Estado' },
  ];

  for (const field of requiredFields) {
    const el = document.getElementById(field.id);
    if (!el || !el.value.trim()) {
      showToast(`⚠️ Preencha o campo: ${field.label}`);
      el?.focus();
      return false;
    }
  }

  // Validação de e-mail
  const email = document.getElementById('input-email');
  if (email && !/\S+@\S+\.\S+/.test(email.value)) {
    showToast('⚠️ Informe um e-mail válido');
    email.focus();
    return false;
  }

  // Validação de pagamento (cartão)
  const activeMethod = document.querySelector('.payment-option.active')?.dataset.method;
  if (activeMethod === 'credit' || activeMethod === 'debit') {
    const prefix = activeMethod === 'credit' ? 'card' : 'debit';
    const cardNum = document.getElementById(`${prefix}-number`);
    const cardName = document.getElementById(`${prefix}-name`);
    const cardExpiry = document.getElementById(`${prefix}-expiry`);
    const cardCvv = document.getElementById(`${prefix}-cvv`);

    if (!cardNum?.value || cardNum.value.replace(/\D/g, '').length < 16) {
      showToast('⚠️ Informe um número de cartão válido');
      cardNum?.focus();
      return false;
    }
    if (!cardName?.value.trim()) {
      showToast('⚠️ Informe o nome no cartão');
      cardName?.focus();
      return false;
    }
    if (!cardExpiry?.value || cardExpiry.value.length < 5) {
      showToast('⚠️ Informe a validade do cartão');
      cardExpiry?.focus();
      return false;
    }
    if (!cardCvv?.value || cardCvv.value.length < 3) {
      showToast('⚠️ Informe o CVV do cartão');
      cardCvv?.focus();
      return false;
    }
  }

  return true;
}

/* --- PLACE ORDER --- */
async function placeOrder() {
  if (!validateForm()) return;

  const btn = document.getElementById('btn-place-order');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processando pedido...';
  }

  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Gerar número do pedido
  const orderNumber = 'ML' + Date.now().toString().slice(-8);

  // Limpar carrinho
  Cart.clear();

  // Redirecionar para página de sucesso
  window.location.href = `success.html?order=${orderNumber}`;
}
