const express = require('express');
const { createModule, getAllModules, getModuleById, updateModule, deleteModule, getModulesByTechStackId } = require('../controllers/moduleController');
const { authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new Module
router.post('/', authorizeRoles('admin', 'superAdmin'), createModule);

// Get all Modules
router.get('/', authorizeRoles('admin', 'superAdmin'), getAllModules);

// Get Module by ID
router.get('/:id', authorizeRoles('admin', 'superAdmin'), getModuleById);

// Get all Modules by TechStack ID
router.get('/by-techstack/:techStackId', getModulesByTechStackId);

// Update a Module
router.put('/:id', authorizeRoles('admin', 'superAdmin'), updateModule);

// Delete a Module
router.delete('/:id', authorizeRoles('admin', 'superAdmin'), deleteModule);

module.exports = router;


/// specific course modules