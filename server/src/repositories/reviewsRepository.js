const { db } = require('../config/db');

/**
 * A product's reviews with the reviewer's first name, newest first.
 *
 * @param {string|number} productId
 * @returns {Promise<Object[]>}
 */
async function findByProduct(productId) {
    const query = `
        SELECT reviews.*, accounts.first_name
        FROM reviews
        JOIN accounts ON reviews.user_id = accounts.id
        WHERE product_id = ?
        ORDER BY created_at DESC`;

    const [rows] = await db.query(query, [productId]);
    return rows;
}

/**
 * @param {Object} review
 * @returns {Promise<void>}
 */
async function insert({ userId, productId, rating, comment }) {
    await db.query(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
        [userId, productId, rating, comment]
    );
}

module.exports = { findByProduct, insert };
