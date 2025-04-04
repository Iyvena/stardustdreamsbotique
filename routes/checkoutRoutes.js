const express = require("express");
const router = express.Router();
const { checkout } = require('../controllers/cartController');

// Checkout végpont
router.post('/checkout', checkout)

module.exports = router;
