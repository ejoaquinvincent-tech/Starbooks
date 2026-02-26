// GRANDE_EXTRA and VENTI_EXTRA are the price offsets added on top of the tall (base) price
// e.g. if tall = 145, then grande = 145 + 15 = 160, venti = 145 + 30 = 175
const GRANDE_EXTRA = 15;
const VENTI_EXTRA = 30;

// ID_TO_PRODUCT_MAP maps an id to a product's data.
// say we call ID_TO_PRODUCT_MAP[0], this will return:
// {
//     name: "Iced Raspberry Chocolate Mousse Oatmilk Latte",
//     price: 205
// }
// which we can then access using:
//   ID_TO_PRODUCT_MAP[0].name     → "Iced Raspberry Chocolate Mousse Oatmilk Latte"
//   ID_TO_PRODUCT_MAP[0].price    → 205  (this is the tall/base price)
//
// to get grande/venti prices, use the getPrice() helper below instead of
// accessing .price directly, so the offsets are handled for you.
//
// it's const because product data doesn't change on runtime.
const ID_TO_PRODUCT_MAP = [
    // Featured Drinks
    { name: "Iced Raspberry Chocolate Mousse Oatmilk Latte", price: 205 }, // ID: 0
    { name: "Raspberry Chocolate Mousse Oatmilk Latte", price: 195 },      // ID: 1
    { name: "Raspberry Chocolate Mousse Oatmilk Frappuccino", price: 210 }, // ID: 2

    // Brewed Coffee — Hot
    { name: "Hot Brewed Coffee", price: 125 }, // ID: 3

    // Brewed Coffee — Iced
    { name: "Vanilla Sweet Cream Cold Brew", price: 185 },          // ID: 4
    { name: "Dark Caramel Nitro Cold Brew", price: 195 },           // ID: 5
    { name: "Nitro Vanilla Sweet Cream Cold Brew", price: 195 },    // ID: 6

    // Espresso — Hot
    { name: "Flat White", price: 175 },         // ID: 7
    { name: "Espresso Con Panna", price: 145 }, // ID: 8

    // Espresso — Iced
    { name: "Iced Cappuccino", price: 175 },  // ID: 9
    { name: "Iced Americano", price: 155 },   // ID: 10

    // Blended Beverage — Cream-based Frappuccino
    { name: "Pure Matcha Cream Frappuccino", price: 200 },       // ID: 11
    { name: "Chocolate Chip Cream Frappuccino", price: 195 },    // ID: 12

    // Blended Beverage — Coffee-based Frappuccino
    { name: "Java Chip Frappuccino", price: 210 },       // ID: 13
    { name: "Triple Mocha Frappuccino", price: 215 },    // ID: 14

    // Teavana Tea — Hot
    { name: "Full Leaf Brewed Tea", price: 155 }, // ID: 15

    // Teavana Tea — Iced
    { name: "Iced Pure Matcha Latte", price: 185 },                      // ID: 16
    { name: "Iced Vanilla Cold Foam Coffee Jelly Black Tea", price: 195 }, // ID: 17
    { name: "Iced Black Tea Latte", price: 175 },                         // ID: 18
];

// getPrice(productId, size) handles the offset math for you.
// e.g.
//   getPrice(0, "tall")   → 205
//   getPrice(0, "grande") → 220
//   getPrice(0, "venti")  → 235
function getPrice(productId, size) {
    const product = ID_TO_PRODUCT_MAP[productId];

    // handle espresso's solo/doppio pricing
    if (typeof product.price === "object") return product.price[size];

    if (size === "grande") return product.price + GRANDE_EXTRA;
    if (size === "venti") return product.price + VENTI_EXTRA;

    return product.price; // tall
}

// the cart
let cart = new Map();

function addToCart(productId, event) {
    if (event) event.preventDefault();

    if (!cart.has(productId))
        cart.set(productId, { quantity: 0, size: "tall" });

    cart.get(productId).quantity++;
    updateCartDisplay();
}

function changeSize(productId, newSize) {
    if (!cart.has(productId)) return;

    cart.get(productId).size = newSize;
    updateCartDisplay();
}

function decreaseQuantity(productId) {
    if (!cart.has(productId)) return;

    const item = cart.get(productId);

    if (item.quantity > 1) item.quantity--;
    else cart.delete(productId);

    updateCartDisplay();
}

function buildSizeBtn(productId, size, current) {
    return `<button class="cart-size-btn ${size === current ? 'active' : ''}" onclick="changeSize(${productId}, '${size}')">
        ${size.charAt(0).toUpperCase() + size.slice(1)}
    </button>`;
}

function buildCartItemHtml(productId, { quantity, size }) {
    const { name } = ID_TO_PRODUCT_MAP[productId];
    const itemTotal = getPrice(productId, size) * quantity;

    return `<div class="cart-item">
        <h4 class="cart-item-name">${name}</h4>
        <div class="cart-size-selector">
            ${['tall', 'grande', 'venti'].map(s => buildSizeBtn(productId, s, size)).join('')}
        </div>
        <div class="cart-item-bottom">
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="decreaseQuantity(${productId})">-</button>
                <span>x${quantity}</span>
                <button class="quantity-btn" onclick="addToCart(${productId})">+</button>
            </div>
            <span class="cart-item-price">P ${itemTotal}</span>
        </div>
    </div>`;
}

function updateCartDisplay() {
    localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));

    const cartItems = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');

    document.getElementById('checkout-button').disabled = cart.size === 0;

    if (cart.size === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        cartTotal.textContent = 'Total: P 0';
        return;
    }

    let total = 0;
    let html = '';

    const reversedEntries = Array.from(cart.entries()).reverse();
    for (const [id, data] of reversedEntries) {
        total += getPrice(id, data.size) * data.quantity;
        html += buildCartItemHtml(id, data);
    }

    cartItems.innerHTML = html;
    cartTotal.textContent = `Total: P ${total}`;
}


const savedCart = JSON.parse(localStorage.getItem('cart'));
if (savedCart) {
    for (const [id, data] of savedCart) {
        cart.set(parseInt(id), data);
    }
}

updateCartDisplay();
