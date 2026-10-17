const products = [
  {
    id: 1,
    name: "The Small Business Digital Handbook",
    price: 9.99,
    category: "business",
    image: "images/ebook-covers/ebook-cover-1.jpg",
    description: "A practical digital guide for planning and organizing a small business."
  },
  {
    id: 2,
    name: "Digital Marketing Essentials",
    price: 7.99,
    category: "marketing",
    image: "images/ebook-covers/ebook-cover-2.jpg",
    description: "An introductory guide to online marketing strategies and content planning."
  },
  {
    id: 3,
    name: "Personal Finance Basics",
    price: 6.99,
    category: "finance",
    image: "images/ebook-covers/ebook-cover-3.jpg",
    description: "A beginner-friendly guide to budgeting and understanding personal finances."
  },
  {
    id: 4,
    name: "Productivity and Time Management",
    price: 5.99,
    category: "productivity",
    image: "images/ebook-covers/ebook-cover-4.jpg",
    description: "Digital reading material about organizing tasks and managing time."
  },
  {
    id: 5,
    name: "The Beginner's Guide to E-commerce",
    price: 8.99,
    category: "business",
    image: "images/ebook-covers/ebook-cover-5.jpg",
    description: "An introduction to setting up and managing an online business."
  },
  {
    id: 6,
    name: "Social Media Content Planner",
    price: 4.99,
    category: "marketing",
    image: "images/ebook-covers/ebook-cover-6.jpg",
    description: "A digital planning resource for organizing social media content."
  },
  {
    id: 7,
    name: "Freelancing Starter Guide",
    price: 7.49,
    category: "business",
    image: "images/ebook-covers/ebook-cover-7.jpg",
    description: "An introduction to planning freelance work and organizing client projects."
  },
  {
    id: 8,
    name: "Study Skills and Learning",
    price: 5.49,
    category: "education",
    image: "images/ebook-covers/ebook-cover-8.jpg",
    description: "A guide to study planning, note-taking, and learning techniques."
  },
  {
    id: 9,
    name: "Creative Writing Workbook",
    price: 6.49,
    category: "education",
    image: "images/ebook-covers/ebook-cover-9.jpg",
    description: "A digital workbook with writing prompts and planning activities."
  }
];
let cart = JSON.parse(localStorage.getItem("digitalbookstore-cart") || "[]");
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
  localStorage.setItem("digitalbookstore-cart", JSON.stringify(cart));
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
  const names = {
    business: "Business",
    marketing: "Marketing",
    finance: "Finance",
    productivity: "Productivity",
    education: "Education"
  };
  return names[category] || "Digital Book";
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
        <span class="product-badge">Digital Book</span>

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
            Add to Cart
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
    showToast(`${product.name} added to your cart`);
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

  showToast("Item removed from your cart");
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <span>🛍️</span>
        <strong>Your cart is empty</strong>
        <p>Add your favorite ebooks to continue.</p>
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
    showToast("Your cart is empty");
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
    showToast("Add products to your cart first");
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
    showToast("Add products to your cart first");
    return;
  }

  const paymentBox = document.getElementById("helioCheckoutContainer");

  if (paymentBox) {
    paymentBox.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
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
