const express = require('express');
const router = express.Router();

const { changePassword, updateProfile,
    getUserModules, updateUserModuleStatus, reqModuleForApproval,
    getMyModules
} = require('../controllers/userController'); // Importing the getAllUsers function
const { isAuthenticated, authorizeRoles } = require('../middlewares/authMiddleware');
const { getAllUsers } = require('../controllers/adminController');

router.get('/', isAuthenticated, getAllUsers); // Route to get all users
router.put('/change-password', isAuthenticated, changePassword); // update the password
router.put('/update-profile', isAuthenticated, updateProfile); // update name 

// pending
router.get('/:userId/modules', authorizeRoles('teamLead', 'admin', 'teamLead'), getUserModules); // get any users modules
router.get('/modules', authorizeRoles('internee'), getMyModules); // view my modules

router.patch('/modules/:moduleId', authorizeRoles('internee'), reqModuleForApproval); // update my module to pending(for verification)
router.patch('/:userId/modules/:moduleId', authorizeRoles('teamLead', 'admin'), updateUserModuleStatus); // update module status

module.exports = router;