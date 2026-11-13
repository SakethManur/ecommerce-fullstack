const cartService = require('../services/cartService');

/** GET /cart */
async function list(req, res) {
    const items = await cartService.list(req.query.userId);
    res.json(items);
}

/** POST /cart */
async function add(req, res) {
    const { userId, productId, quantity, size } = req.body;
    await cartService.add({ userId, productId, quantity, size });
    res.json({ message: 'Added to cart' });
}

/** DELETE /cart/:id */
async function remove(req, res) {
    await cartService.remove(req.params.id);
    res.json({ message: 'Item removed' });
}

module.exports = { list, add, remove };
