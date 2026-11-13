const wishlistService = require('../services/wishlistService');

/** GET /wishlist */
async function list(req, res) {
    const items = await wishlistService.list(req.query.userId);
    res.json(items);
}

/** POST /wishlist */
async function add(req, res) {
    const { userId, productId } = req.body;
    const { alreadyPresent } = await wishlistService.add({ userId, productId });

    res.json({
        message: alreadyPresent ? 'Already in wishlist' : 'Added to wishlist',
    });
}

module.exports = { list, add };
