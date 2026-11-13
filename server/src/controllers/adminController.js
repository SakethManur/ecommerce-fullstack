const adminService = require('../services/adminService');

/** GET /admin/orders */
async function listOrders(req, res) {
    const orders = await adminService.listOrders();
    res.json(orders);
}

/** PUT /admin/order/:id/status */
async function updateOrderStatus(req, res) {
    const { status } = req.body;
    await adminService.updateOrderStatus(req.params.id, status);
    res.json({ message: 'Order status updated!' });
}

module.exports = { listOrders, updateOrderStatus };
