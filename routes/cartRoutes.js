const express = require('express');
const router = express.Router();
const { addToCart, checkCart, removeItemFromCart } = require('../controllers/cartController');
const authenticateUser = require('../middleware/jwtAuth');

// Kosár műveletek
router.post('/create', authenticateUser, addToCart);
router.delete('/remove/:cart_item_id', authenticateUser, removeItemFromCart);
router.get('/check-cart', authenticateUser, checkCart);

module.exports = router;