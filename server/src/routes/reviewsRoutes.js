const express = require('express');
const reviewsController = require('../controllers/reviewsController');

// mergeParams, because the product id comes from the mount path
// (/products/:productId/reviews) rather than from the routes below.
const router = express.Router({ mergeParams: true });

router.get('/', reviewsController.list);
router.post('/', reviewsController.add);

module.exports = router;
