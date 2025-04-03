const express = require('express');
const router = express.Router();
const { purchaseProduct, checkCart, removeItemFromCart, updateQuantity } = require('../controllers/cartController');
const authenticateUser = require('../middleware/jwtAuth');

// Kosár műveletek
router.post('/add', authenticateUser, purchaseProduct);
router.post('/cart/update-quantity', authenticateUser, updateQuantity);
router.delete('/remove/:cart_item_id', authenticateUser, removeItemFromCart);
router.get('/check-cart', authenticateUser, checkCart);

module.exports = router;