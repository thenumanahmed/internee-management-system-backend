const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/adminController');
const { authorizeRoles } = require('../middlewares/authMiddleware');

router.put('/update-user', authorizeRoles('admin', 'superAdmin','teamLead'), updateUser); 

module.exports = router;