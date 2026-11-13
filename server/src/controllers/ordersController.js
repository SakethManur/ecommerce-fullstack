const ordersService = require('../services/ordersService');

/** POST /order */
async function place(req, res) {
    const { userId, items, address } = req.body;

    const { deliveryDate } = await ordersService.place({ userId, items, address });

    res.json({ message: `Order placed. Arriving: ${deliveryDate.toDateString()}` });
}

/** GET /ordered-items */
async function history(req, res) {
    const orders = await ordersService.historyFor(req.query.userId);
    res.json(orders);
}

/** GET /tax-on-product/:country */
function taxRate(req, res) {
    // The country is echoed back exactly as given, while the lookup itself is
    // case-insensitive.
    res.json({
        country: req.params.country,
        taxRate: ordersService.taxRateFor(req.params.country),
    });
}

module.exports = { place, history, taxRate };
