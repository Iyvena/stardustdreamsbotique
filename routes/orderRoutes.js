const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const authenticateToken = require('../middleware/jwtAuth');

//order létrehozása
router.post('/', createOrder);
router.post('/create', authenticateToken, createOrder);

module.exports = router;