const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/create-account', authController.register);
router.post('/login', authController.login);

module.exports = router;
