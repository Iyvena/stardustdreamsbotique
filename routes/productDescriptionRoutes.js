const express = require('express');
const { updateProductDescription } = require('../controllers/productsDescriptionController');
const router = express.Router();

router.post('/update-description', updateProductDescription);

module.exports = router;
