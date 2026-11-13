const express = require('express');
const wishlistController = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', wishlistController.list);
router.post('/', wishlistController.add);

module.exports = router;
