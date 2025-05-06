const express = require('express');
const { createTechStack, getAllTechStacks, getTechStackById, updateTechStack, deleteTechStack } = require('../controllers/techStackController');
const { authorizeRoles, isAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

// Create a new TechStack
router.post('/', authorizeRoles('admin', 'superAdmin'), createTechStack);

// Get all TechStacks
router.get('/', isAuthenticated, getAllTechStacks);

// Get TechStack by ID
router.get('/:id', getTechStackById);

// Update a TechStack
router.put('/:id', updateTechStack);

// Delete a TechStack
router.delete('/:id', deleteTechStack);

module.exports = router;