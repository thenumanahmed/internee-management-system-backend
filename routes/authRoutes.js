const express = require('express');
const router = express.Router();
const { signUp, login, inviteUser, forgotPassword, resetPassword, verifyOtp } = require('../controllers/authController.js');
const { protect } = require('../middlewares/authMiddleware');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgot-pass', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.put('/reset-pass', resetPassword);

router.post('/invite-user', protect('admin', 'teamLead'), inviteUser);

module.exports = router;