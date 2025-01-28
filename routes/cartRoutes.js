const express = require('express');
const router = express.Router();
const { createCart } = require('../controllers/cartController');
const cartController = require('../controllers/cartController');

// Kosár műveletek
router.post('/create', createCart);
router.delete('/items/:cart_item_id', cartController.removeItemFromCart);

module.exports = router;