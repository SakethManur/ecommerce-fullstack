const { db } = require('../config/db');

/**
 * Stores an order. The purchased items are serialised here rather than by the
 * caller, because how they are persisted is this layer's concern -- the column
 * is JSON and holds a snapshot of what was bought.
 *
 * @param {Object} order
 * @param {string|number} order.userId
 * @param {Object[]} order.items
 * @param {number} order.totalPrice
 * @param {string} order.address
 * @param {Date} order.deliveryDate
 * @returns {Promise<void>}
 */
async function insert({ userId, items, totalPrice, address, deliveryDate }) {
    await db.query(
        'INSERT INTO orders (user_id, items, total_price, delivery_address, delivery_date) VALUES (?, ?, ?, ?, ?)',
        [userId, JSON.stringify(items), totalPrice, address, deliveryDate]
    );
}

/**
 * @param {string|number} userId
 * @returns {Promise<Object[]>} Newest first.
 */
async function findByUser(userId) {
    const [rows] = await db.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
        [userId]
    );
    return rows;
}

/**
 * Every order with the buyer's email and first name attached, for the admin
 * dashboard.
 *
 * @returns {Promise<Object[]>} Newest first.
 */
async function findAllWithBuyer() {
    const query = `
        SELECT orders.*, accounts.email, accounts.first_name
        FROM orders
        JOIN accounts ON orders.user_id = accounts.id
        ORDER BY order_date DESC`;

    const [rows] = await db.query(query);
    return rows;
}

/**
 * @param {string|number} id
 * @param {string} status
 * @returns {Promise<void>}
 */
async function updateStatus(id, status) {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
}

module.exports = { insert, findByUser, findAllWithBuyer, updateStatus };
