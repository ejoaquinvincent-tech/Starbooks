// GRANDE_EXTRA at VENTI_EXTRA yung dagdag sa tall price para makuha ang grande at venti price.
// e.g. kung tall = 145, grande = 145 + 15 = 160, venti = 145 + 30 = 175
const GRANDE_EXTRA = 15;
const VENTI_EXTRA = 30;

// ID_TO_PRODUCT_MAP yung list ng lahat ng products, naka-index sa ID nila.
// e.g. ID_TO_PRODUCT_MAP[0] ay:
// {
//     name: "Iced Raspberry Chocolate Mousse Oatmilk Latte",
//     price: 205
// }
// tapos pwede mong i-access ganito:
//   ID_TO_PRODUCT_MAP[0].name     → "Iced Raspberry Chocolate Mousse Oatmilk Latte"
//   ID_TO_PRODUCT_MAP[0].price    → 205  (tall/base price ito)
//
// para sa grande/venti prices, gamitin mo na lang yung getPrice() helper sa baba
// para hindi mo na kailangang manu-manong i-add yung offset.
//
// const ito kasi hindi naman nagbabago yung product data habang tumatakbo ang app.
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

// getPrice(productId, size) — dito na hawak yung offset math, hindi mo na kailangang gawin pa.
// e.g.
//   getPrice(0, "tall")   → 205
//   getPrice(0, "grande") → 220
//   getPrice(0, "venti")  → 235
function getPrice(productId, size) {
    const product = ID_TO_PRODUCT_MAP[productId];

    // espresso lang yung may object na price (solo/doppio), lahat ng iba number lang
    if (typeof product.price === "object") return product.price[size];

    if (size === "grande") return product.price + GRANDE_EXTRA;
    if (size === "venti") return product.price + VENTI_EXTRA;

    return product.price; // tall
}

// cart yung Map na nag-hold ng lahat ng order ng user.
// key = productId, value = { quantity, size }
// e.g. cart.get(0) → { quantity: 2, size: "grande" }
// Map ginagamit natin dito para consistent ang order at madaling mag-add/delete.
let cart = new Map();

// addToCart(productId, event) — nagdadagdag ng item sa cart.
// kung bago pa yung product, mag-iinit muna ng entry na may quantity 0 at size "tall",
// tapos dagdag ng 1. yung event param ay optional, para lang ma-prevent yung
// default form submit kung kinukuha ito mula sa button click.
function addToCart(productId, event) {
    if (event) event.preventDefault();

    if (!cart.has(productId))
        cart.set(productId, { quantity: 0, size: "tall" });

    cart.get(productId).quantity++;
    updateCartDisplay();
}

// changeSize(productId, newSize) — nagpapalit ng size ng item sa cart.
// tinatawag ito kapag nag-click ang user sa Tall / Grande / Venti buttons.
// wala itong ginagawa kung hindi pa nandoon yung item.
function changeSize(productId, newSize) {
    if (!cart.has(productId)) return;

    cart.get(productId).size = newSize;
    updateCartDisplay();
}

// decreaseQuantity(productId) — nagbabawas ng 1 sa quantity.
// kung 1 na lang yung quantity at bababaan pa, tanggalin na lang yung item sa cart.
function decreaseQuantity(productId) {
    if (!cart.has(productId)) return;

    const item = cart.get(productId);

    if (item.quantity > 1) item.quantity--;
    else cart.delete(productId);

    updateCartDisplay();
}

// buildSizeBtn(productId, size, current) — gumagawa ng size button (Tall/Grande/Venti).
// kapag yung size ay yung currently selected, may "active" class siya.
// nag-o-onclick ng changeSize() para ma-update yung cart.
function buildSizeBtn(productId, size, current) {
    return `<button class="cart-size-btn ${size === current ? 'active' : ''}" onclick="changeSize(${productId}, '${size}')">
        ${size.charAt(0).toUpperCase() + size.slice(1)}
    </button>`;
}

// buildCartItemHtml(productId, { quantity, size }) — binubuo yung HTML ng isang cart item.
// kasama yung product name, size buttons, quantity controls, at subtotal (price × quantity).
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

// updateCartDisplay() — ino-update yung buong cart UI.
// tatlong ginagawa nito:
//   1. sine-save yung cart sa localStorage para hindi mawala kapag nag-refresh
//   2. ina-update yung listahan ng items at yung total sa DOM
//   3. dini-disable yung checkout button kung wala sa cart
// tinatawag ito pagkatapos ng bawat cart change (add, remove, size change).
function updateCartDisplay() {
    localStorage.setItem('cart', JSON.stringify(Array.from(cart.entries())));

    const cartItems = document.getElementById('cart-items-container');
    const cartTotal = document.getElementById('cart-total');

    document.getElementById('checkout-button').disabled = cart.size === 0;

    // kung wala sa cart, ipakita lang yung empty message at i-reset yung total
    if (cart.size === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
        cartTotal.textContent = 'Total: P 0';
        return;
    }

    let total = 0;
    let html = '';

    // binaliktad yung order para yung pinakabagong item ay nasa itaas
    const reversedEntries = Array.from(cart.entries()).reverse();
    for (const [id, data] of reversedEntries) {
        total += getPrice(id, data.size) * data.quantity;
        html += buildCartItemHtml(id, data);
    }

    cartItems.innerHTML = html;
    cartTotal.textContent = `Total: P ${total}`;
}


// kapag na-load yung page, kinukuha yung saved cart mula sa localStorage (kung meron).
// kailangan i-parse yung JSON string at i-convert yung entries pabalik sa Map.
const savedCart = JSON.parse(localStorage.getItem('cart'));
if (savedCart) {
    for (const [id, data] of savedCart) {
        cart.set(parseInt(id), data);
    }
}

// i-render agad yung cart after ma-restore yung data (o empty state kung wala)
updateCartDisplay();
