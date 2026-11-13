const ordersRepository = require('../repositories/ordersRepository');

/**
 * Every order with the buyer attached, for the admin dashboard.
 *
 * NOTE: nothing here checks that the caller is an admin. The API has never
 * enforced that -- the client simply hides the page from non-admins -- so
 * these routes are open to anyone who knows the path. Adding real
 * authorisation needs the auth work (hashing, tokens) and is out of scope for
 * a refactor that must not change responses.
 *
 * @returns {Promise<Object[]>} Newest first.
 */
function listOrders() {
    return ordersRepository.findAllWithBuyer();
}

/**
 * @param {string|number} orderId
 * @param {string} status One of the values the orders.status enum allows.
 * @returns {Promise<void>}
 */
function updateOrderStatus(orderId, status) {
    return ordersRepository.updateStatus(orderId, status);
}

module.exports = { listOrders, updateOrderStatus };
