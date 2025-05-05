const express = require('express');
const router = express.Router();

const { editProgress, getAllProgress } = require("../controllers/progressController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/authMiddleware");

router.put('/:userId', isAuthenticated, authorizeRoles('admin', 'superAdmin'), editProgress);
router.get('/', isAuthenticated, authorizeRoles('admin', 'superAdmin'), getAllProgress);

module.exports = router;