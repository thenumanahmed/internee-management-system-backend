const express = require('express');
const router = express.Router();
const { signUp,
    logout,
    login,
    inviteUser,
    forgotPassword,
    resetPassword,
    verifyOtp } = require('../controllers/authController.js');
const { authorizeRoles } = require('../middlewares/authMiddleware');

// router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-pass', forgotPassword);
router.post('/logout', logout);
router.post('/verify-otp', verifyOtp);
router.put('/reset-pass', resetPassword);

router.post('/invite-user', authorizeRoles('admin', 'teamLead'), inviteUser);

module.exports = router;