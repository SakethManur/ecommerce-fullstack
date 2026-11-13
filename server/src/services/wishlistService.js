const wishlistRepository = require('../repositories/wishlistRepository');

/**
 * @param {string|number} userId
 * @returns {Promise<Object[]>}
 */
function list(userId) {
    return wishlistRepository.findByUser(userId);
}

/**
 * Saves a product unless the user already saved it.
 *
 * Re-adding is treated as success rather than a conflict, because the client
 * calls this from a toggle and has no way to know the current state. The
 * unique key on (user_id, product_id) is the real guard; this check is what
 * lets the API answer without erroring.
 *
 * @param {Object} input
 * @returns {Promise<{alreadyPresent: boolean}>}
 */
async function add({ userId, productId }) {
    const existing = await wishlistRepository.findByUserAndProduct(userId, productId);

    if (existing) {
        return { alreadyPresent: true };
    }

    await wishlistRepository.insert({ userId, productId });
    return { alreadyPresent: false };
}

module.exports = { list, add };
