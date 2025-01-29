const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const { register, login, logout, loginUser } = require('../controllers/authControllers');


const router = express.Router();

//regisztráció
router.post('/register', register);
//login
router.post('/login', login);
//logout
router.post('/logout', authenticateToken, logout);
//admin login
router.post('./login', authenticateToken, loginUser);


module.exports = router;
//valami