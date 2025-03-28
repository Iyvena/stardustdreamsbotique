const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { register, login, logout, loginUser, isLoggedIn } = require('../controllers/authControllers');


const router = express.Router();

//regisztráció
router.post('/register', register);
//login
router.post('/login', login);
//logout
router.post('/logout', authenticateToken, logout);
//admin login
router.post('./login', authenticateToken, loginUser);
//isLoggedIn
router.get('/isLoggedIn', authenticateToken, isLoggedIn);

router.get('/role', authenticateToken, isLoggedIn);


module.exports = router;
//valami