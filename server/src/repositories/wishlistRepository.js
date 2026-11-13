const { db } = require('../config/db');

/**
 * A user's saved products, joined to the product for display.
 *
 * @param {string|number} userId
 * @returns {Promise<Object[]>}
 */
async function findByUser(userId) {
    const query = `
        SELECT wishlist.id, products.name, products.price, products.image_url
        FROM wishlist
        JOIN products ON wishlist.product_id = products.id
        WHERE wishlist.user_id = ?`;

    const [rows] = await db.query(query, [userId]);
    return rows;
}

/**
 * Used to detect an already-saved product before inserting. The unique key on
 * (user_id, product_id) is the real guarantee; this read is what lets the API
 * answer politely instead of erroring.
 *
 * @param {string|number} userId
 * @param {string|number} productId
 * @returns {Promise<Object|undefined>}
 */
async function findByUserAndProduct(userId, productId) {
    const [rows] = await db.query(
        'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
        [userId, productId]
    );
    return rows[0];
}

/**
 * @param {Object} entry
 * @returns {Promise<void>}
 */
async function insert({ userId, productId }) {
    await db.query(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
        [userId, productId]
    );
}

module.exports = { findByUser, findByUserAndProduct, insert };
