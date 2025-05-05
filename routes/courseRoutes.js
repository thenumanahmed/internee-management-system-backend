const express = require('express');
const router = express.Router();
const { isAuthenticated, authorizeRoles } = require('../middlewares/authMiddleware');
const {
    addCourse,
    editCourse,
    deleteCourse,
    getAllCourses
} = require('../controllers/courseController');

// admin and super admin only
router.post('/add', isAuthenticated, authorizeRoles('admin', 'superAdmin'), addCourse);
router.put('/edit/:courseId', isAuthenticated, authorizeRoles('admin', 'superAdmin'), editCourse);
router.delete('/delete/:courseId', isAuthenticated, authorizeRoles('admin', 'superAdmin'), deleteCourse);

// Get all courses (any authenticated user can view)
router.get('/all', isAuthenticated, getAllCourses);

module.exports = router;