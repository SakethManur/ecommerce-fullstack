const express = require('express');

const healthRoutes = require('./healthRoutes');
const productsRoutes = require('./productsRoutes');
const reviewsRoutes = require('./reviewsRoutes');
const authRoutes = require('./authRoutes');
const cartRoutes = require('./cartRoutes');
const ordersRoutes = require('./ordersRoutes');
const accountRoutes = require('./accountRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

// Mount points reproduce the existing public paths exactly. Nothing here
// renames, prefixes or versions an endpoint.
router.use('/health', healthRoutes);
router.use('/products', productsRoutes);
router.use('/products/:productId/reviews', reviewsRoutes);
router.use('/authentication', authRoutes);
router.use('/cart', cartRoutes);
router.use('/account', accountRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);

// Last, and at the root: /order, /ordered-items and /tax-on-product/:country
// have no common prefix to mount under.
router.use('/', ordersRoutes);

module.exports = router;
