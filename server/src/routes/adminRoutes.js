const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/orders', adminController.listOrders);
router.put('/order/:id/status', adminController.updateOrderStatus);

module.exports = router;
