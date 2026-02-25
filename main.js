// ===========================
//   WIDAP — main.js
//   Tienda de polos urbanos
// ===========================

// ──────────────────────────────
// PRODUCTOS CON IMÁGENES REALES
// ──────────────────────────────
const PRODUCTS = [
  {
    id: 1,
    name: "Classic White",
    category: "basico",
    price: 59.90,
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    badge: null,
    description: "El básico que nunca falla. Algodón pima 180g, corte regular perfecto para cualquier ocasión."
  },
  {
    id: 2,
    name: "Urban Black",
    category: "grafico",
    price: 79.90,
    imagen: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    badge: "Nuevo",
    description: "Diseño gráfico exclusivo en serigrafía. Estilo urbano que hace hablar donde vayas."
  },
  {
    id: 3,
    name: "Oversized Drop",
    category: "oversize",
    price: 89.90,
    imagen: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80",
    badge: "Top",
    description: "Corte oversize con hombros caídos. Tendencia actual para un look relajado y cómodo."
  },
  {
    id: 4,
    name: "Vintage Wash",
    category: "grafico",
    price: 75.90,
    imagen: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80",
    badge: null,
    description: "Lavado enzimático para un efecto vintage auténtico. Cada pieza es única e irrepetible."
  },
  {
    id: 5,
    name: "Pima Premium",
    category: "premium",
    price: 129.90,
    imagen: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80",
    badge: "Premium",
    description: "La joya de nuestra colección. Algodón pima extra-largo certificado, tejido de punto compacto."
  },
  {
    id: 6,
    name: "Sage Minimal",
    category: "basico",
    price: 59.90,
    imagen: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80",
    badge: null,
    description: "Tono sage verde tendencia. Básico versátil con acabado suave al tacto y larga durabilidad."
  },
  {
    id: 7,
    name: "Street Art Collab",
    category: "grafico",
    price: 85.90,
    imagen: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    badge: "Nuevo",
    description: "Colaboración con artistas locales peruanos. Arte callejero impreso en alta resolución."
  },
  {
    id: 8,
    name: "Box Fit Heavy",
    category: "oversize",
    price: 95.90,
    imagen: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    badge: null,
    description: "Estilo box-fit en tela french terry 280g. El oversize más llevado de la temporada."
  }
];

const SIZES = {
  basico:   ["XS", "S", "M", "L", "XL", "XXL"],
  grafico:  ["S", "M", "L", "XL"],
  oversize: ["S/M", "L/XL", "XXL"],
  premium:  ["S", "M", "L", "XL", "XXL"]
};

// ──────────────────────────────
// ESTADO
// ──────────────────────────────
let cart = JSON.parse(localStorage.getItem('widap_cart') || '[]');
let currentCategory = 'todos';
let selectedSize = null;
let openProductId = null;

// ──────────────────────────────
// DOM REFS
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
const navbar        = document.getElementById('navbar');

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
    card.style.animationDelay = `${index * 0.08}s`;

    card.innerHTML = `
      <div class="card-img">
        ${product.badge ? `<span class="card-badge">${product.badge}</span>` : ''}
        <img 
          src="${product.imagen}" 
          alt="${product.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="card-body">
        <div class="card-cat">${categoryLabel(product.category)}</div>
        <div class="card-name">${product.name}</div>
        <div class="card-footer">
          <span class="card-price">S/ ${product.price.toFixed(2)}</span>
          <button class="btn-add" data-id="${product.id}" aria-label="Agregar al carrito">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Click en imagen o nombre → modal
    card.querySelector('.card-img').addEventListener('click', () => openModal(product.id));
    card.querySelector('.card-name').addEventListener('click', () => openModal(product.id));

    // Click en "+" → agregar con talla por defecto
    card.querySelector('.btn-add').addEventListener('click', (e) => {
      e.stopPropagation();
      const sizes = SIZES[product.category];
      addToCart(product.id, sizes[Math.floor(sizes.length / 2)]);
    });

    productsGrid.appendChild(card);
  });
}

function categoryLabel(cat) {
  const map = { basico: 'Básicos', grafico: 'Gráficos', oversize: 'Oversize', premium: 'Premium' };
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
// MODAL DETALLE
// ──────────────────────────────
function openModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  openProductId = productId;
  const sizes = SIZES[product.category];
  selectedSize = sizes[0];

  modalBody.innerHTML = `
    <div class="modal-img">
      <img src="${product.imagen}" alt="${product.name}" />
    </div>
    <div class="modal-info">
      <div class="modal-cat">${categoryLabel(product.category)}</div>
      <div class="modal-name">${product.name}</div>
      <div class="modal-price">S/ ${product.price.toFixed(2)}</div>
      <p class="modal-desc">${product.description}</p>
      <div class="size-label">Selecciona tu talla</div>
      <div class="size-options" id="sizeOptions">
        ${sizes.map(s => `
          <button class="size-btn ${s === selectedSize ? 'selected' : ''}" data-size="${s}">${s}</button>
        `).join('')}
      </div>
      <button class="modal-add-btn" id="modalAddBtn">
        Agregar al carrito
      </button>
    </div>
  `;

  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = btn.dataset.size;
    });
  });

  document.getElementById('modalAddBtn').addEventListener('click', () => {
    addToCart(openProductId, selectedSize);
    closeModalFn();
  });

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModalFn() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  openProductId = null;
  selectedSize = null;
}

modalClose.addEventListener('click', closeModalFn);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModalFn(); });

// ──────────────────────────────
// CARRITO — LÓGICA
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
      imagen: product.imagen,
      size,
      qty: 1
    });
  }

  saveCart();
  updateCartUI();
  showToast(`✅ ${product.name} — Talla ${size} agregado`);
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.key !== key);
  }
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('widap_cart', JSON.stringify(cart));
}

function getTotalItems() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function getTotalPrice() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function updateCartUI() {
  // Badge
  const total = getTotalItems();
  cartCount.textContent = total;
  cartCount.classList.add('bump');
  setTimeout(() => cartCount.classList.remove('bump'), 300);

  // Items
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '';
    cartItemsEl.appendChild(cartEmpty);
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';
    cartItemsEl.innerHTML = '';

    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="item-img">
          <img src="${item.imagen}" alt="${item.name}" />
        </div>
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

    cartItemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        changeQty(btn.dataset.key, parseInt(btn.dataset.delta));
      });
    });
  }

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
// CHECKOUT
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
// TOAST
// ──────────────────────────────
let toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimeout = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

// ──────────────────────────────
// NAVBAR SCROLL
// ──────────────────────────────
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ──────────────────────────────
// KEYBOARD CLOSE
// ──────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModalFn();
    closeCartSidebar();
  }
});

// ──────────────────────────────
// INIT
// ──────────────────────────────
renderProducts();
updateCartUI();
