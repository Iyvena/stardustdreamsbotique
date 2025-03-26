const express = require('express');
const router = express.Router();
const { addToCart } = require('../controllers/cartItemsController');
const authenticateUser = require('../middleware/jwtAuth');

// Új termék hozzáadása a kosárhoz
router.post('/add', authenticateUser, addToCart);

module.exports = router;