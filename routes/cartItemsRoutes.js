const express = require('express');
const router = express.Router();
const { addToCart } = require('../controllers/cartItemsController');

// Új termék hozzáadása a kosárhoz
router.post('/add', addToCart);

module.exports = router;