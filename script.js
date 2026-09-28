const products = [
  {
    id: 1,
    name: "WDL7430 Woman Business Handbag",
    price: 98.99,
    category: "handbag",
    badge: "Featured",
    image: "images/product-1.jpg",
    description: "Elegant business handbag designed for work, travel and everyday use."
  },
  {
    id: 2,
    name: "Color Blocking Shoulder Crossbody Bag",
    price: 48.99,
    category: "crossbody",
    badge: "Popular",
    image: "images/product-2.jpg",
    description: "Versatile color-block shoulder and crossbody bag with generous capacity."
  },
  {
    id: 3,
    name: "Luxury Minimalist Designer Tote Bag",
    price: 29.98,
    category: "tote",
    badge: "New",
    image: "images/product-3.jpg",
    description: "Minimalist high-end tote bag for polished daily style."
  },
  {
    id: 4,
    name: "Black Minimalist Handbag",
    price: 59.99,
    category: "handbag",
    badge: "Popular",
    image: "images/product-4.jpg",
    description: "A timeless black handbag with a clean minimalist silhouette."
  },
  {
    id: 5,
    name: "Pink Elegant Handbag",
    price: 44.99,
    category: "handbag",
    badge: "New",
    image: "images/product-5.jpg",
    description: "A soft pink handbag designed for elegant everyday looks."
  },
  {
    id: 6,
    name: "Brown Luxury Handbag",
    price: 54.99,
    category: "handbag",
    badge: "Featured",
    image: "images/product-6.jpg",
    description: "A refined brown handbag with a polished luxury-inspired finish."
  },
  {
    id: 7,
    name: "White Elegant Tote Bag",
    price: 49.99,
    category: "tote",
    badge: "New",
    image: "images/product-7.jpg",
    description: "A spacious white tote with a clean, elegant profile."
  },
  {
    id: 8,
    name: "Red Fashion Handbag",
    price: 39.99,
    category: "handbag",
    badge: "Popular",
    image: "images/product-8.jpg",
    description: "A bold red handbag made to add color to your everyday style."
  },
  {
    id: 9,
    name: "Classic Beige Leather Bag",
    price: 69.99,
    category: "handbag",
    badge: "Featured",
    image: "images/product-9.jpg",
    description: "A classic beige bag with a versatile, timeless design."
  }
];
let cart = JSON.parse(localStorage.getItem("luxecarry-cart") || "[]");
let activeCategory = "all";

const productsGrid = document.getElementById("productsGrid");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const paymentUsd = document.getElementById("paymentUsd");
const paymentUsdt = document.getElementById("paymentUsdt");
const cartSidebar = document.getElementById("cartSidebar");
const cartBackdrop = document.getElementById("cartBackdrop");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function money(value) {
  return `$${value.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("luxecarry-cart", JSON.stringify(cart));
}

function getCartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function categoryName(category) {
  if (category === "crossbody") return "Crossbody";
  if (category === "tote") return "Tote Bag";
  if (category === "shoulder") return "Shoulder Bag";
  return "Handbag";
}

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;

  let list = products.filter(product => {
    const categoryMatch =
      activeCategory === "all" || product.category === activeCategory;

    const searchMatch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    return categoryMatch && searchMatch;
  });

  if (sort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  }

  if (sort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (!list.length) {
    productsGrid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px">
        <h3 style="font-family:Georgia,serif;font-size:28px">
          No products found
        </h3>
        <p style="color:#777;margin-top:8px">
          Try another search or category.
        </p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = list.map(product => `
    <article class="product-card">
      <div class="product-image">
        <span class="product-badge">${product.badge}</span>

        <button
          class="product-fav"
          type="button"
          aria-label="Add to favorites"
          onclick="toggleFavorite(this)"
        >♡</button>

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
      </div>

      <div class="product-info">
        <span class="product-category">
          ${categoryName(product.category)}
        </span>

        <h3>${product.name}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-rating">★★★★★</div>

        <div class="product-bottom">
          <strong class="product-price">${money(product.price)}</strong>

          <button
            class="add-to-cart"
            type="button"
            onclick="addToCart(${product.id})"
          >
            Add to Bag
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function toggleFavorite(button) {
  button.classList.toggle("active");
  button.textContent = button.classList.contains("active") ? "♥" : "♡";
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }

  saveCart();
  renderCart();
  updateCartCount();

  const product = products.find(p => p.id === id);
  if (product) {
    showToast(`${product.name} added to your bag`);
  }
}

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();
  updateCartCount();

  showToast("Item removed from your bag");
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🛍️</span>
        <strong>Your cart is empty</strong>
        <p>Add your favorite handbags to continue.</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return "";

      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}">

          <div>
            <h4>${product.name}</h4>

            <div class="cart-item-price">
              ${money(product.price)}
            </div>

            <div class="quantity-controls">
              <button type="button"
                onclick="changeQuantity(${product.id}, -1)">−</button>
              <span>${item.quantity}</span>
              <button type="button"
                onclick="changeQuantity(${product.id}, 1)">+</button>
            </div>

            <button
              class="remove-item"
              type="button"
              onclick="removeFromCart(${product.id})"
            >
              Remove
            </button>
          </div>

          <strong>${money(product.price * item.quantity)}</strong>
        </div>
      `;
    }).join("");
  }

  const total = getCartTotal();

  cartSubtotal.textContent = money(total);
  paymentUsd.textContent = money(total);
  paymentUsdt.textContent = total.toFixed(2);
}

function updateCartCount() {
  cartCount.textContent = getCartCount();
}

function openCart() {
  cartSidebar.classList.add("open");
  cartBackdrop.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartSidebar.classList.remove("open");
  cartBackdrop.classList.remove("show");
  document.body.style.overflow = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

async function copyUid() {
  const uid = "950124722";

  try {
    await navigator.clipboard.writeText(uid);
    showToast("Binance UID copied");
  } catch {
    showToast("Binance UID: " + uid);
  }
}

/* HEADER CART */
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

/* CHECKOUT */
document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Your bag is empty");
    return;
  }

  document.getElementById("payment").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* FILTERS */
document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    activeCategory = button.dataset.category;

    renderProducts();
  });
});

/* SEARCH + SORT */
searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);

/* PAYMENT TABS */
document.querySelectorAll(".payment-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".payment-tab").forEach(t => {
      t.classList.remove("active");
    });

    document.querySelectorAll(".payment-content").forEach(content => {
      content.classList.remove("active");
    });

    tab.classList.add("active");

    const target =
      tab.dataset.payment === "card"
        ? document.getElementById("cardPayment")
        : document.getElementById("usdtPayment");

    target.classList.add("active");
  });
});

/* COPY UID */
document.getElementById("copyUid").addEventListener("click", copyUid);

/* USDT CONFIRM */
document.getElementById("confirmPayment").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Add products to your bag first");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const transactionId =
    document.getElementById("transactionId").value.trim();

  if (!name || !phone || !transactionId) {
    showToast("Please complete all payment details");
    return;
  }

  const total = getCartTotal();

  alert(
    "Payment details received.\n\n" +
    "Customer: " + name + "\n" +
    "Phone: " + phone + "\n" +
    "Transaction ID: " + transactionId + "\n" +
    "Total: " + money(total) + " USDT\n\n" +
    "Your payment will be checked manually."
  );

  showToast("Payment details submitted");

  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("transactionId").value = "";
});

/* CARD */
document.getElementById("cardPayBtn").addEventListener("click", () => {
  if (!cart.length) {
    showToast("Add products to your bag first");
    return;
  }

  showToast("Card checkout is being prepared");
});

/* HERO BUTTON */
document.querySelector(".hero-next").addEventListener("click", () => {
  showToast("More collection items coming soon");
});

/* ESC */
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

renderProducts();
renderCart();
updateCartCount();
