const express = require('express');
const router = express.Router();
const { getAllUsers, changePassword, updateProfile } = require('../controllers/userController'); // Importing the getAllUsers function
const { isAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', isAuthenticated, getAllUsers); // Route to get all users
router.put('/change-password', isAuthenticated, changePassword); // update the password
router.put('/update-profile', isAuthenticated, updateProfile); // update name, role etc

module.exports = router;