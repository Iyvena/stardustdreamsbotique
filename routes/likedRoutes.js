const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { likeProduct, unlikeProduct, checkLike } = require('../controllers/likeController');

const router = express.Router();
//kedvencekhez adás
router.post('/like', authenticateToken, likeProduct);
//kedvencek checkolása
router.get('/likes/check/:product_id', authenticateToken, checkLike);
//kedvenc eltávolítása
router.delete('/unlike', authenticateToken, unlikeProduct);

module.exports = router;