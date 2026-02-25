// ===========================
//   POLOX — main.js
//   Lógica de tienda + carrito
// ===========================

// ──────────────────────────────
// DATOS DE PRODUCTOS
// ──────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Classic White",
    category: "basico",
    price: 59.90,
    emoji: "👕",
    bg: "#f0ede6",
    badge: null,
    description: "El básico que nunca falla. Algodón pima 180g, corte regular. Ideal para cualquier ocasión.",
    sizes: ["XS","S","M","L","XL","XXL"]
  },
  {
    id: 2,
    name: "Urban Black",
    category: "grafico",
    price: 79.90,
    emoji: "🖤",
    bg: "#1a1a1a",
    badge: "Nuevo",
    description: "Diseño gráfico exclusivo en técnica serigrafía. Estilo urbano que hace hablar.",
    sizes: ["S","M","L","XL"]
  },
  {
    id: 3,
    name: "Oversized Drop",
    category: "oversize",
    price: 89.90,
    emoji: "🛹",
    bg: "#1e2a3a",
    badge: "Top",
    description: "Corte oversize con hombros caídos. Tendencia actual para un look relajado y cómodo.",
    sizes: ["S/M","L/XL","XXL"]
  },
  {
    id: 4,
    name: "Sunset Graphic",
    category: "grafico",
    price: 75.90,
    emoji: "🌅",
    bg: "#3a1e1e",
    badge: null,
    description: "Print full-color de alta resolución. Tela 100% algodón peinado, suave al tacto.",
    sizes: ["XS","S","M","L","XL"]
  },
  {
    id: 5,
    name: "Pima Premium",
    category: "premium",
    price: 129.90,
    emoji: "✨",
    bg: "#1a2a1e",
    badge: "Premium",
    description: "La joya de nuestra colección. Algodón pima extra-largo, certificado, tejido de punto.",
    sizes: ["S","M","L","XL","XXL"]
  },
  {
    id: 6,
    name: "Sage Basic",
    category: "basico",
    price: 59.90,
    emoji: "🌿",
    bg: "#1e2a1e",
    badge: null,
    description: "Básico en tono sage verde. Versátil, cómodo y de larga durabilidad.",
    sizes: ["XS","S","M","L","XL","XXL"]
  },
  {
    id: 7,
    name: "Street Art",
    category: "grafico",
    price: 85.90,
    emoji: "🎨",
    bg: "#2a1e3a",
    badge: "Nuevo",
    description: "Colaboración con artistas locales. Arte callejero impreso en alta calidad.",
    sizes: ["S","M","L","XL"]
  },
  {
    id: 8,
    name: "Box Oversize",
    category: "oversize",
    price: 95.90,
    emoji: "📦",
    bg: "#2a2a1e",
    badge: null,
    description: "Estilo box-fit con caída perfecta. El oversize más llevado de la temporada.",
    sizes: ["S/M","L/XL","XXL"]
  }
];

// ──────────────────────────────
// ESTADO
// ──────────────────────────────
let cart = JSON.parse(localStorage.getItem('polox_cart') || '[]');
let currentCategory = 'todos';
let selectedSize = null;
let openProductId = null;

// ──────────────────────────────
// REFERENCIAS DOM
// ──────────────────────────────
const productsGrid  = document.getElementById('productsGrid');
const cartCount     = document.getElementById('cartCount');
const cartBtn       = document.getElementById('cartBtn');
const cartSidebar   = document.getElementById('cartSidebar');
const cartOverlay   = document.getElementById('cartOverlay');
const closeCart     = document.getElementById('closeCart');
const cartItemsEl   = document.getElementById('cartItems');
const cartEmpty     = document.getElementById('cartEmpty');
const totalPriceEl  = document.getElementById('totalPrice');
const checkoutBtn   = document.getElementById('checkoutBtn');
const modalOverlay  = document.getElementById('modalOverlay');
const modalClose    = document.getElementById('modalClose');
const modalBody     = document.getElementById('modalBody');
const toastEl       = document.getElementById('toast');
const catBtns       = document.querySelectorAll('.cat-btn');

// ──────────────────────────────
// RENDER PRODUCTOS
// ──────────────────────────────
function renderProducts() {
  const filtered = currentCategory === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentCategory);

  productsGrid.innerHTML = '';

  filtered.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.07}s`;
    card.innerHTML = `
      <div class="card-img" style="background:${product.bg}">
        ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
        <span style="font-size:4.5rem;user-select:none">${product.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-cat">${categoryLabel(product.category)}</div>
        <div class="card-name">${product.name}</div>
        <div class="card-footer">
          <span class="card-price">S/ ${product.price.toFixed(2)}</span>
          <button class="btn-add" data-id="${product.id}" aria-label="Agregar al carrito">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>
      </div>
    `;

    // Click en la imagen → abrir modal
    card.querySelector('.card-img').addEventListener('click', () => openModal(product.id));
    card.querySelector('.card-name').addEventListener('click', () => openModal(product.id));
    card.querySelector('.card-cat').addEventListener('click', () => openModal(product.id));

    // Click en "+" → agrega con primer size
    card.querySelector('.btn-add').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product.id, product.sizes[0]);
    });

    productsGrid.appendChild(card);
  });
}

function categoryLabel(cat) {
  const map = { basico:'Básicos', grafico:'Gráficos', oversize:'Oversize', premium:'Premium' };
  return map[cat] || cat;
}

// ──────────────────────────────
// CATEGORÍAS
// ──────────────────────────────
catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCategory = btn.dataset.cat;
    renderProducts();
  });
});

// ──────────────────────────────
// MODAL PRODUCTO
// ──────────────────────────────
function openModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  openProductId = productId;
  selectedSize = product.sizes[0];

  modalBody.innerHTML = `
    <div class="modal-img" style="background:${product.bg}">
      <span>${product.emoji}</span>
    </div>
    <div class="modal-info">
      <div class="modal-cat">${categoryLabel(product.category)}</div>
      <div class="modal-name">${product.name}</div>
      <div class="modal-price">S/ ${product.price.toFixed(2)}</div>
      <p class="modal-desc">${product.description}</p>
      <div class="size-label">Talla</div>
      <div class="size-options" id="sizeOptions">
        ${product.sizes.map(s => `
          <button class="size-btn${s === selectedSize ? ' selected' : ''}" data-size="${s}">${s}</button>
        `).join('')}
      </div>
      <button class="modal-add-btn" id="modalAddBtn">
        Agregar al carrito
      </button>
    </div>
  `;

  // Selección de talla
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
    });
  });

  document.getElementById('modalAddBtn').addEventListener('click', () => {
    addToCart(openProductId, selectedSize);
    closeModal();
  });

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  openProductId = null;
  selectedSize = null;
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// ──────────────────────────────
// CARRITO
// ──────────────────────────────
function addToCart(productId, size) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const key = `${productId}_${size}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      key,
      productId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      size,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`✅ ${product.name} — Talla ${size} agregado`);
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveCart();
  updateCartUI();
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(key);
  else {
    saveCart();
    updateCartUI();
  }
}

function saveCart() {
  localStorage.setItem('polox_cart', JSON.stringify(cart));
}

function getTotalItems() {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}

function getTotalPrice() {
  return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function updateCartUI() {
  const total = getTotalItems();

  // Counter badge
  cartCount.textContent = total;
  cartCount.classList.add('bump');
  setTimeout(() => cartCount.classList.remove('bump'), 300);

  // Items en sidebar
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(cartEmpty);
  } else {
    cartEmpty.style.display = 'none';
    cartItemsEl.innerHTML = '';
    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-info">
          <div class="item-name">${item.name}</div>
          <div class="item-size">Talla: ${item.size}</div>
          <div class="item-price">S/ ${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <div class="item-controls">
          <button class="qty-btn" data-key="${item.key}" data-delta="-1">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-key="${item.key}" data-delta="1">+</button>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });

    // Event delegation
    cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        changeQty(btn.dataset.key, parseInt(btn.dataset.delta));
      });
    });
  }

  // Total precio
  totalPriceEl.textContent = `S/ ${getTotalPrice().toFixed(2)}`;
}

// ──────────────────────────────
// ABRIR / CERRAR CARRITO
// ──────────────────────────────
function openCartSidebar() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartSidebar() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCartSidebar);
closeCart.addEventListener('click', closeCartSidebar);
cartOverlay.addEventListener('click', closeCartSidebar);

// ──────────────────────────────
// CHECKOUT (simulado)
// ──────────────────────────────
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('⚠️ Tu carrito está vacío');
    return;
  }
  const total = getTotalPrice().toFixed(2);
  cart = [];
  saveCart();
  updateCartUI();
  closeCartSidebar();
  showToast(`🎉 ¡Pedido realizado! Total: S/ ${total}`);
});

// ──────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────
let toastTimeout;

function showToast(msg) {
  clearTimeout(toastTimeout);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ──────────────────────────────
// NAVBAR SCROLL EFFECT
// ──────────────────────────────
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.padding = '0.6rem 3rem';
  } else {
    navbar.style.padding = '1rem 3rem';
  }
});

// ──────────────────────────────
// INIT
// ──────────────────────────────
renderProducts();
updateCartUI();