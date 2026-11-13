const reviewsRepository = require('../repositories/reviewsRepository');

/**
 * @param {string|number} productId
 * @returns {Promise<Object[]>} Newest first.
 */
function listForProduct(productId) {
    return reviewsRepository.findByProduct(productId);
}

/**
 * Records a review. The 1-5 bound on the rating is enforced by a CHECK
 * constraint in the schema.
 *
 * @param {Object} input
 * @returns {Promise<void>}
 */
function add({ userId, productId, rating, comment }) {
    return reviewsRepository.insert({ userId, productId, rating, comment });
}

module.exports = { listForProduct, add };
