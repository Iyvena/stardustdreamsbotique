const express = require('express');
const router = express.Router();
const { purchaseProduct, checkCart, removeItemFromCart, updateQuantity, checkout } = require('../controllers/cartController');
const authenticateUser = require('../middleware/jwtAuth');

// Kosár műveletek
router.post('/add', authenticateUser, purchaseProduct);
router.post('/cart/update-quantity', authenticateUser, updateQuantity);
router.delete('/remove/:product_id', authenticateUser, removeItemFromCart);
router.get('/check-cart', authenticateUser, checkCart);
router.post('/checkout', authenticateUser, checkout)
router.delete('/deleteCartItem/:product_id', authenticateUser, deleteCartItem);

module.exports = router;