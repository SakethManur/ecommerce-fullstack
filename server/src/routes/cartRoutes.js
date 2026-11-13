const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartController.list);
router.post('/', cartController.add);
router.delete('/:id', cartController.remove);

module.exports = router;
