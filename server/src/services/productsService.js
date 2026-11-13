const productsRepository = require('../repositories/productsRepository');
const AppError = require('../utils/AppError');

// Applied when a caller does not specify stock, matching the original
// `stock || 10` default.
const DEFAULT_STOCK = 10;

/**
 * @param {Object} criteria search, minPrice, maxPrice, sort
 * @returns {Promise<Object[]>}
 */
function list(criteria) {
    return productsRepository.findAll(criteria);
}

/**
 * @param {string|number} id
 * @returns {Promise<Object|undefined>} undefined when no product matches.
 */
function getById(id) {
    return productsRepository.findById(id);
}

/**
 * @param {Object} input
 * @returns {Promise<number>} The new product's id.
 * @throws {AppError} 400 when a required field is missing.
 */
function create({ name, price, category, description, image_url, stock }) {
    if (!name || !price || !category) {
        throw AppError.badRequest('Missing required fields');
    }

    return productsRepository.insert({
        name,
        price,
        category,
        description,
        image_url,
        stock: stock || DEFAULT_STOCK,
    });
}

module.exports = { list, getById, create };
