const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { likeProduct, unlikeProduct, checkLike } = require('../controllers/likeController');

const router = express.Router();
//kedvencekhez adás
router.post('/:product_id', authenticateToken, likeProduct);
//kedvencek checkolása
router.get('/check', authenticateToken, checkLike);
//kedvenc eltávolítása
router.delete('/likes/:product_id', authenticateToken, unlikeProduct);


module.exports = router;