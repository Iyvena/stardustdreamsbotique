const express = require('express');
const router = express.Router();
const { createCart } = require('../controllers/cartController');
const cartController = require('../controllers/cartController');
const authenticateUser = require('../middleware/jwtAuth');

// Kosár műveletek
router.post('/create', authenticateUser, createCart);
router.delete('/items/:cart_item_id', cartController.removeItemFromCart);

module.exports = router;