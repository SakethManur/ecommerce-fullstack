const { db } = require('../config/db');

/**
 * A user's cart, joined to the product so the client has a name, price and
 * image to render. The selected columns are exactly those the response has
 * always contained.
 *
 * @param {string|number} userId
 * @returns {Promise<Object[]>}
 */
async function findByUser(userId) {
    const query = `
        SELECT cart.id, products.name, products.price, products.image_url, cart.quantity
        FROM cart
        JOIN products ON cart.product_id = products.id
        WHERE cart.user_id = ?`;

    const [rows] = await db.query(query, [userId]);
    return rows;
}

/**
 * @param {Object} item
 * @returns {Promise<void>}
 */
async function insert({ userId, productId, quantity, size }) {
    await db.query(
        'INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
        [userId, productId, quantity, size]
    );
}

/**
 * @param {string|number} id Cart row id, not a product id.
 * @returns {Promise<void>}
 */
async function deleteById(id) {
    await db.query('DELETE FROM cart WHERE id = ?', [id]);
}

/**
 * Empties a user's cart, used once an order has been placed.
 *
 * @param {string|number} userId
 * @returns {Promise<void>}
 */
async function deleteByUser(userId) {
    await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
}

module.exports = { findByUser, insert, deleteById, deleteByUser };
