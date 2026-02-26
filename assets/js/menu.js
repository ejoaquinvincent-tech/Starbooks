// GRANDE_EXTRA and VENTI_EXTRA are the price offsets added on top of the tall (base) price
// e.g. if tall = 145, then grande = 145 + 15 = 160, venti = 145 + 30 = 175
const GRANDE_EXTRA = 15;
const VENTI_EXTRA = 30;

// ID_TO_PRODUCT_MAP maps an id to a product's data.
// say we call ID_TO_PRODUCT_MAP[0], this will return:
// {
//     name: "Hot Tea (Teavana)",
//     price: 145
// }
// which we can then access using:
//   ID_TO_PRODUCT_MAP[0].name     → "Hot Tea (Teavana)"
//   ID_TO_PRODUCT_MAP[0].price    → 145  (this is the tall/base price)
//
// to get grande/venti prices, use the getPrice() helper below instead of
// accessing .price directly, so the offsets are handled for you.
//
// it's const because product data doesn't change on runtime.
const ID_TO_PRODUCT_MAP = [
    // Teas
    { name: "Hot Tea (Teavana)", price: 145 }, // ID: 0
    { name: "Full Leaf Brewed Tea", price: 155 }, // ID: 1
    { name: "Iced Tea", price: 165 }, // ID: 2

    // Frappuccinos
    { name: "Cream-Based Frappuccino (Classic Vanilla/Caramel Cream)", price: 185 }, // ID: 3
    { name: "Chai Tea Cream Frappuccino", price: 195 }, // ID: 4
    { name: "White Chocolate Cream Frappuccino", price: 205 }, // ID: 5
    { name: "Raspberry Chocolate Mousse Oatmilk Frappuccino", price: 210 }, // ID: 6

    // Espresso & Lattes
    { name: "Hot Espresso", price: { solo: 110, doppio: 125 } }, // ID: 7  (uses solo/doppio instead of sizes)
    { name: "Hot Latte / Cappuccino", price: 165 },                        // ID: 8
    { name: "Iced Latte", price: 175 },                        // ID: 9
    { name: "Iced Raspberry Chocolate Mousse Oatmilk Latte", price: 205 },                        // ID: 10
    { name: "Raspberry Chocolate Mousse Oatmilk Latte (Hot)", price: 195 },                        // ID: 11

    // Brewed Coffee
    { name: "Hot Brewed Coffee", price: 125 }, // ID: 12
    { name: "Iced Coffee", price: 145 }, // ID: 13
];

// getPrice(productId, size) handles the offset math for you.
// e.g.
//   getPrice(0, "tall")   → 145
//   getPrice(0, "grande") → 160
//   getPrice(0, "venti")  → 175
//   getPrice(7, "doppio") → 125
function getPrice(productId, size) {
    const product = ID_TO_PRODUCT_MAP[productId];

    // handle espresso's solo/doppio pricing
    if (typeof product.price === "object") return product.price[size];

    if (size === "grande") return product.price + GRANDE_EXTRA;
    if (size === "venti") return product.price + VENTI_EXTRA;

    return product.price; // tall
}

function computeIfAbsent(map, key, mappingFunction) {
    if (map.has(key)) {
        return map.get(key);
    } else {
        const newValue = mappingFunction(key);
        if (newValue !== null && newValue !== undefined) {
            map.set(key, newValue);
            return newValue;
        }
    }
}

// the cart
let cart = {}

function addToCart(productId, event) {
    event.preventDefault(); // prevents the page from snapping to the top when you click a product

    computeIfAbsent(
        cart, productId,
        () => { quantity: 1 }
    ).quantity++;

    updateCartDisplay();
}

function updateCartDisplay() {
    for (const [id, data] in cart) {
        
    }
}
