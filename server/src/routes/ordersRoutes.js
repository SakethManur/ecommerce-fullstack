const express = require('express');
const ordersController = require('../controllers/ordersController');

// Mounted at the root, because these three paths do not share a prefix and
// renaming them would change the public API.
const router = express.Router();

router.post('/order', ordersController.place);
router.get('/ordered-items', ordersController.history);
router.get('/tax-on-product/:country', ordersController.taxRate);

module.exports = router;
