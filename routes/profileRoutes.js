const express = require('express');
const authenticateToken = require('../middleware/jwtAuth');
const upload = require('../middleware/multer');
const { editProfileName, editProfilePassword, editProfileAdress, editProfilePic, getProfilePic, getUsername, getAddress } = require('../controllers/profileController');

const router = express.Router();

router.put("/editProfileName", authenticateToken, editProfileName);
router.put('/editProfilePassword', authenticateToken, editProfilePassword);
router.put('/editProfileAdress', authenticateToken, editProfileAdress);
router.put('/editProfilePic', authenticateToken, upload.single('profile_pic'), editProfilePic);
router.get('/pic', authenticateToken, getProfilePic);
router.get('/username', authenticateToken, getUsername);
router.get('/address', authenticateToken, getAddress);

module.exports = router;