const express = require('express');
const router = express.Router();
const { purchaseProduct, checkCart, removeItemFromCart } = require('../controllers/cartController');
const authenticateUser = require('../middleware/jwtAuth');

// Kosár műveletek
router.post('/cart/add', authenticateUser, cartController.purchaseProduct);
router.delete('/cart/:cart_item_id', authenticateUser, cartController.removeItemFromCart);
router.get('/cart', authenticateUser, cartController.checkCart);

module.exports = router;