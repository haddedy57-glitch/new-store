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

async function loadCurrency() {
  try {
    const locationResponse = await fetch("https://ipapi.co/json/");
    const location = await locationResponse.json();

    if (location.currency) {
      visitorCurrency = location.currency;
      visitorSymbol = currencySymbols[visitorCurrency] || visitorCurrency;
    }

    if (visitorCurrency === "USD") {
      exchangeRate = 1;
    } else {
      const rateResponse = await fetch(
        `https://api.frankfurter.dev/v2/rate/USD/${visitorCurrency}`
      );

      if (!rateResponse.ok) {
        throw new Error("Exchange rate unavailable");
      }

      const rateData = await rateResponse.json();
      exchangeRate = rateData.rate;
    }

    updateCart();

  } catch (error) {
    console.log("Currency detection failed:", error);

    visitorCurrency = "USD";
    visitorSymbol = "$";
    exchangeRate = 1;

    updateCart();
  }
}

function sendOrder() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  let message = "السلام عليكم، أريد طلب:%0A%0A";

  cart.forEach(item => {
    message += `- ${item.name} : $${item.priceUSD.toFixed(2)} USD%0A`;
  });

  const totalUSD = cart.reduce(
    (sum, item) => sum + item.priceUSD,
    0
  );

  message += `%0Aالمجموع: $${totalUSD.toFixed(2)} USD`;

  const phone = "21600000000";

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank"
  );
}

loadCurrency();
updateCart();
