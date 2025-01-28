const express = require('express');
const { searchProducts } = require('../controllers/searchController');

const router = express.Router();

router.get('/products/:search', searchProducts);

module.exports = router;