let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("total");

  if (cart.length === 0) {
    container.innerHTML = "السلة فارغة";
    totalElement.textContent = "0";
    return;
  }

  let total = 0;

  container.innerHTML = cart.map((item, index) => {
    total += item.price;

    return `
      <div>
        ${item.name} — ${item.price} د.ت
        <button onclick="removeItem(${index})">حذف</button>
      </div>
    `;
  }).join("");

  totalElement.textContent = total;
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

function sendOrder() {
  if (cart.length === 0) {
    alert("السلة فارغة");
    return;
  }

  let message = "السلام عليكم، أريد طلب:%0A%0A";

  cart.forEach(item => {
    message += `- ${item.name} : ${item.price} د.ت%0A`;
  });

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  message += `%0Aالمجموع: ${total} د.ت`;

  // سنضع رقم WhatsApp الخاص بك لاحقًا
  const phone = "21600000000";

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank"
  );
}
