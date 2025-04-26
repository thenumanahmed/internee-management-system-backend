const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, inviteUser, loginInternee, loginTeamLead } = require('../controllers/authController');
const { protectAdmin, protectTeamLead } = require('../middlewares/authMiddleware');

router.post('/admin/signup', registerAdmin);
router.post('/admin/login', loginAdmin);

router.post('/admin/invite-user', protectAdmin, inviteUser);
// router.post('/teamLead/signup', registerTeamLead); // not implemented yet
router.post('/teamLead/login', loginTeamLead);

// router.post('/signup', registerInternee); // not implemented yet
router.post('/login', loginInternee);

module.exports = router;
