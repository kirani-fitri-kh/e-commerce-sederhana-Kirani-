const CART_KEY = 'maisondesucre_cart';

function loadCart() {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : {items: []};
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartDisplay() {
  const cart = loadCart();
  const totalCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll('.cart-count').forEach((node) => {
    node.textContent = `(${totalCount})`;
  });
}

function addToCart(name, price) {
  const cart = loadCart();
  const existing = cart.items.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({name, price, quantity: 1});
  }
  saveCart(cart);
  updateCartDisplay();
  alert(`"${name}" berhasil ditambahkan ke keranjang.`);
}

function removeFromCart(name) {
  const cart = loadCart();
  cart.items = cart.items.filter((item) => item.name !== name);
  saveCart(cart);
  updateCartDisplay();
  renderCartItems();
}

function clearCart() {
  saveCart({items: []});
  updateCartDisplay();
  renderCartItems();
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) {
    return;
  }

  const cart = loadCart();
  cartItemsContainer.innerHTML = '';

  if (cart.items.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <p>Keranjangmu masih kosong. Yuk, pilih cemilan manis favoritmu!</p>
        <a class="button button-primary" href="product.html">Belanja Sekarang</a>
      </div>
    `;
    return;
  }

  const cartList = document.createElement('div');
  cartList.className = 'cart-list';

  let totalPrice = 0;
  cart.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
    const card = document.createElement('div');
    card.className = 'cart-card';
    card.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>Harga: Rp ${item.price.toLocaleString('id-ID')} × ${item.quantity}</p>
      </div>
      <div class="cart-actions">
        <button type="button" onclick="removeFromCart('${item.name}')">Hapus</button>
      </div>
    `;
    cartList.appendChild(card);
  });

  const summary = document.createElement('div');
  summary.className = 'cart-card';
  summary.innerHTML = `
    <div>
      <h3>Total</h3>
      <p>Rp ${totalPrice.toLocaleString('id-ID')}</p>
    </div>
    <div class="cart-actions">
      <button type="button" onclick="clearCart()">Kosongkan Keranjang</button>
    </div>
  `;

  cartItemsContainer.appendChild(cartList);
  cartItemsContainer.appendChild(summary);
}

window.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
  renderCartItems();
});
