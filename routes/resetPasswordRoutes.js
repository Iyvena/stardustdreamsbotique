const express = require('express');
const router = express.Router();
const { resetPassword } = require('../controllers/resetPasswordController');

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;