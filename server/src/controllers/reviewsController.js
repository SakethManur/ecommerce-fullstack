const reviewsService = require('../services/reviewsService');

/** GET /products/:productId/reviews */
async function list(req, res) {
    const reviews = await reviewsService.listForProduct(req.params.productId);
    res.json(reviews);
}

/** POST /products/:productId/reviews */
async function add(req, res) {
    const { userId, rating, comment } = req.body;

    await reviewsService.add({
        userId,
        productId: req.params.productId,
        rating,
        comment,
    });

    res.json({ message: 'Review added!' });
}

module.exports = { list, add };
