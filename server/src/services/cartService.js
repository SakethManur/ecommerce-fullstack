const cartRepository = require('../repositories/cartRepository');

const DEFAULT_QUANTITY = 1;

/**
 * @param {string|number} userId
 * @returns {Promise<Object[]>}
 */
function list(userId) {
    return cartRepository.findByUser(userId);
}

/**
 * Adds an item. Size is optional and stored as NULL when absent; a missing
 * quantity means one.
 *
 * @param {Object} input
 * @returns {Promise<void>}
 */
function add({ userId, productId, quantity, size }) {
    return cartRepository.insert({
        userId,
        productId,
        quantity: quantity || DEFAULT_QUANTITY,
        size: size || null,
    });
}

/**
 * @param {string|number} id Cart row id.
 * @returns {Promise<void>}
 */
function remove(id) {
    return cartRepository.deleteById(id);
}

module.exports = { list, add, remove };
