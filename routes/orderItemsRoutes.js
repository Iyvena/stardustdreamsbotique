const express = require('express');
const router = express.Router();
const { createOrderItem } = require('../controllers/orderItemsController');

//order létrehozása
router.post('/', createOrderItem);

module.exports = router;