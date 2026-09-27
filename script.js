let cart = [];

function addToCart(name, priceUSD) {
  cart.push({ name, priceUSD });
  updateCart();
}

function formatPrice(priceUSD) {
  return `$${priceUSD.toFixed(2)} USD`;
}

function updateCart() {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("total");

  if (cart.length === 0) {
    container.innerHTML = "Your cart is empty";
    totalElement.textContent = "$0.00 USD";
    return;
  }

  let totalUSD = 0;

  container.innerHTML = cart.map((item, index) => {
    totalUSD += item.priceUSD;

    return `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        ${formatPrice(item.priceUSD)}
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  }).join("");

  totalElement.textContent = formatPrice(totalUSD);
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function showPayment() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const totalUSD = cart.reduce(
    (sum, item) => sum + item.priceUSD,
    0
  );

  document.getElementById("paymentUsd").textContent =
    totalUSD.toFixed(2);

  document.getElementById("paymentUsdt").textContent =
    totalUSD.toFixed(2);

  document.getElementById("paymentSection").style.display = "block";

  document.getElementById("paymentSection").scrollIntoView({
    behavior: "smooth"
  });
}

function sendPaymentOrder() {
  const name = document.getElementById("customerName").value.trim();
  const phoneCustomer = document.getElementById("customerPhone").value.trim();
  const txid = document.getElementById("txid").value.trim();

  if (!name || !phoneCustomer || !txid) {
    alert("Please enter your name, phone number and TxID");
    return;
  }

  alert("Order information confirmed. Your payment will be verified manually.");
}
