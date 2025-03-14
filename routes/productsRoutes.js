const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { getALLproduct, uploadProduct } = require('../controllers/productsController');
const { isAdmin } = require('../controllers/authControllers');
const { filterProducts } = require("../controllers/productsController");

const router = express.Router();
//termék feltöltése és ellenörzése hogy admin e 
router.get('/getALLproduct', getALLproduct);
router.post('/uploadProduct', authenticateToken, isAdmin, upload.single('product'), uploadProduct);
router.get("/filter", filterProducts);


module.exports = router;