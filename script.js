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
  cart.push({ name, priceUSD });
  updateCart();
}

function formatLocalPrice(priceUSD) {
  const value = priceUSD * exchangeRate;
  return `${value.toFixed(2)} ${visitorSymbol}`;
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
        — $${item.priceUSD.toFixed(2)} USD
        <button onclick="removeItem(${index})">حذف</button>
      </div>
    `;
  }).join("");

  totalElement.innerHTML =
    `${formatLocalPrice(totalUSD)} — $${totalUSD.toFixed(2)} USD`;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateProductPrices() {
  const prices = [
    { id: "price-1", usd: 25 },
    { id: "price-2", usd: 40 },
    { id: "price-3", usd: 60 }
  ];

  prices.forEach(item => {
    const element = document.getElementById(item.id);
    if (element) {
      element.textContent =
        `${formatLocalPrice(item.usd)} — $${item.usd.toFixed(2)} USD`;
    }
  });
}

async function loadCurrency() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const locationResponse = await fetch(
      "https://ipapi.co/json/",
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    if (!locationResponse.ok) {
      throw new Error("Location unavailable");
    }

    const location = await locationResponse.json();

    visitorCurrency = location.currency || "USD";
    visitorSymbol = currencySymbols[visitorCurrency] || visitorCurrency;

    if (visitorCurrency === "USD") {
      exchangeRate = 1;
    } else {
      const rateController = new AbortController();
      const rateTimeout = setTimeout(() => rateController.abort(), 5000);

      const rateResponse = await fetch(
        `https://api.frankfurter.dev/v2/rate/USD/${visitorCurrency}`,
        { signal: rateController.signal }
      );

      clearTimeout(rateTimeout);

      if (!rateResponse.ok) {
        throw new Error("Exchange rate unavailable");
      }

      const rateData = await rateResponse.json();
      exchangeRate = rateData.rate;
    }

    updateProductPrices();
    updateCart();

  } catch (error) {
    console.log("Currency detection failed:", error);

    visitorCurrency = "USD";
    visitorSymbol = "$";
    exchangeRate = 1;

    updateProductPrices();
    updateCart();
  }
}


function showPayment() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  const totalUSD = cart.reduce((sum, item) => sum + item.priceUSD, 0);
  const rate = 120;
  const totalUSDT = totalUSD;
  const totalTND = totalUSDT * rate;

  document.getElementById("paymentTnd").textContent = totalTND.toFixed(2);
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
