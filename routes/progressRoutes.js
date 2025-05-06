const express = require('express');
const router = express.Router();

const { editProgress, getAllProgress } = require("../controllers/progressController");
const { authorizeRoles } = require("../middlewares/authMiddleware");

router.put('/:userId', authorizeRoles('admin', 'superAdmin'), editProgress);
router.get('/', authorizeRoles('admin', 'superAdmin'), getAllProgress);

module.exports = router;