const express = require('express');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middlewares/authMiddleware');
const {
    submitTask,
    approveTask,
    rejectTask,
    getMyTasks,
    getAllTasks,
    editTask,
} = require('../controllers/taskController');
const { getTasksByUser } = require('../controllers/taskController');
const { getPendingTasks } = require('../controllers/taskController');

// Internee submits task
router.post('/submit', isAuthenticated, authorizeRoles('internee'), submitTask);

// TeamLead approves/rejects task
router.put('/approve/:taskId', isAuthenticated, authorizeRoles('teamLead'), approveTask);
router.put('/reject/:taskId', isAuthenticated, authorizeRoles('teamLead'), rejectTask);

// Task Views
router.get('/my-tasks', isAuthenticated, authorizeRoles('internee'), getMyTasks);
router.get('/all', isAuthenticated, authorizeRoles('admin', 'superAdmin'), getAllTasks);

// Get tasks of a specific user (by ID)
router.get('/user/:userId', isAuthenticated, authorizeRoles('admin', 'superAdmin', 'teamLead'), getTasksByUser);

// Get all pending tasks
router.get('/pending', isAuthenticated, authorizeRoles('admin', 'superAdmin', 'teamLead'), getPendingTasks);

// Internee — Edit own task (status will reset to pending)
router.put('/edit/:taskId', isAuthenticated, editTask);

module.exports = router;