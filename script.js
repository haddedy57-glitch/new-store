let cart = [];

let visitorCurrency = "USD";
let visitorSymbol = "$";
let exchangeRate = 1;

const currencySymbols = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  TND: "د.ت",
  CAD: "C$",
  AUD: "A$",
  CHF: "CHF",
  JPY: "¥",
  CNY: "¥",
  AED: "د.إ",
  SAR: "ر.س",
  QAR: "ر.ق",
  KWD: "د.ك",
  TRY: "₺",
  MAD: "د.م",
  DZD: "دج",
  EGP: "ج.م"
};

function addToCart(name, priceUSD) {
  window.addToCart = addToCart;
  cart.push({ name, priceUSD });
  updateCart();
}

function formatLocalPrice(priceUSD) {
  return `$${priceUSD.toFixed(2)} USD`;
}

function updateCart() {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("total");

  if (cart.length === 0) {
    container.innerHTML = "السلة فارغة";
    totalElement.textContent = "0";
    return;
  }

  let totalUSD = 0;

  container.innerHTML = cart.map((item, index) => {
    totalUSD += item.priceUSD;

    return `
      <div>
        <strong>${item.name}</strong><br>
        ${formatLocalPrice(item.priceUSD)}
        <button onclick="removeItem(${index})">حذف</button>
      </div>
    `;
  }).join("");

  totalElement.textContent = formatLocalPrice(totalUSD);
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateProductPrices() {
  const prices = [
    { id: "price-1", usd: 1 },
    { id: "price-2", usd: 2 },
    { id: "price-3", usd: 3 }
  ];

  prices.forEach(item => {
    const element = document.getElementById(item.id);
    if (element) {
      element.textContent =
        `${formatLocalPrice(item.usd)} — $${item.usd.toFixed(2)} USD`;
    }
  });
}

function loadCurrency() {}

function showPayment() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  const totalUSD = cart.reduce((sum, item) => sum + item.priceUSD, 0);
  const rate = 120;
  const totalUSDT = totalUSD;
  const totalTND = totalUSDT * rate;

  document.getElementById("paymentUsd").textContent = totalUSD.toFixed(2);
  document.getElementById("paymentUsdt").textContent = totalUSDT.toFixed(2);
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
    alert("الرجاء إدخال الاسم ورقم الهاتف و TxID");
    return;
  }

  const totalUSD = cart.reduce((sum, item) => sum + item.priceUSD, 0);
  const rate = 120;
  const totalUSDT = totalUSD;
  const totalTND = totalUSDT * rate;

  alert("تم تأكيد معلومات الطلب. سيتم التحقق من الدفع يدويًا.");
}
