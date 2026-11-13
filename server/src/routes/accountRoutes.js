const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

router.put('/update', accountController.update);

module.exports = router;
