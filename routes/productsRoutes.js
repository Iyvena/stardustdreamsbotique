const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { getALLproduct, uploadProduct } = require('../controllers/productsController');
const { isAdmin } = require('../controllers/authControllers');
const { filterProducts } = require("../controllers/productsController");
const { deleteProduct } = require("../controllers/productsController");

const router = express.Router();
//termék feltöltése és ellenörzése hogy admin e
// Összes termék lekérdezése 
router.get('/getALLproduct', getALLproduct);
// Termék feltöltése (csak admin)
router.post('/uploadProduct', authenticateToken, isAdmin, upload.single('productImage'), uploadProduct);
// Termék frissítése (csak admin)
router.put('/:id', authenticateToken, upload.single('product'), updateProduct);
// Termékek szűrése
router.get("/filter", filterProducts);
// Termék törlése (csak admin)
router.delete('/:product_id', authenticateToken, deleteProduct);


module.exports = router;