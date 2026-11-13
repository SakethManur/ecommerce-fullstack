const ordersRepository = require('../repositories/ordersRepository');
const productsRepository = require('../repositories/productsRepository');
const cartRepository = require('../repositories/cartRepository');

// Flat rate applied to every order's subtotal, regardless of the country the
// tax lookup below would report. Preserved from the original implementation.
const ORDER_TAX_MULTIPLIER = 1.08;

// Days from today to the promised delivery date.
const DELIVERY_DAYS = 7;

// Rates advertised by GET /tax-on-product/:country. Note these are *not* what
// an order is actually charged -- see ORDER_TAX_MULTIPLIER.
const TAX_RATES = {
    india: 18,
    usa: 8,
    uk: 20,
};
const DEFAULT_TAX_RATE = 10;

/**
 * The advertised tax rate for a country, matched case-insensitively.
 *
 * @param {string} country
 * @returns {number} Percentage.
 */
function taxRateFor(country) {
    const key = country.toLowerCase();
    return Object.prototype.hasOwnProperty.call(TAX_RATES, key)
        ? TAX_RATES[key]
        : DEFAULT_TAX_RATE;
}

/**
 * Places an order: records it, reduces stock for each line, then empties the
 * user's cart.
 *
 * These are three separate statements rather than one transaction, which is
 * how the original worked -- a failure partway through can leave stock reduced
 * for an order that was recorded but a cart that was not cleared. Wrapping it
 * in a transaction is a behavioural fix, deliberately not bundled into this
 * refactor.
 *
 * @param {Object} input
 * @param {string|number} input.userId
 * @param {Object[]} input.items Each with price, quantity and an id.
 * @param {string} input.address
 * @returns {Promise<{deliveryDate: Date, totalPrice: number}>}
 */
async function place({ userId, items, address }) {
    let subtotal = 0;
    items.forEach((item) => {
        subtotal += item.price * item.quantity;
    });

    const totalPrice = subtotal * ORDER_TAX_MULTIPLIER;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + DELIVERY_DAYS);

    await ordersRepository.insert({
        userId,
        items,
        totalPrice,
        address,
        deliveryDate,
    });

    for (const item of items) {
        // Cart rows carry product_id; a buy-it-now item carries id.
        const productId = item.product_id || item.id;
        await productsRepository.decrementStock(productId, item.quantity);
    }

    await cartRepository.deleteByUser(userId);

    return { deliveryDate, totalPrice };
}

/**
 * @param {string|number} userId
 * @returns {Promise<Object[]>} Newest first.
 */
function historyFor(userId) {
    return ordersRepository.findByUser(userId);
}

module.exports = { taxRateFor, place, historyFor };
