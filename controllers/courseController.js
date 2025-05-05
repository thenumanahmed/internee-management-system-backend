const Course = require('../models/Course');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const addCourse = async(req, res) => {
    try {
        const { name, desc } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Course name is required' });
        }

        let pdfUrl = null;

        if (req.files && req.files.roadmapPdf) {
            const file = req.files.roadmapPdf;

            // Upload the PDF to Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'course-roadmaps',
                resource_type: 'raw', // for PDF and other files
                public_id: `roadmap_${Date.now()}`,
            });

            pdfUrl = result.secure_url;

            // Delete the temp file
            fs.unlink(file.tempFilePath, (err) => {
                if (err) console.error('Error deleting temp file:', err);
            });
        }

        const newCourse = new Course({
            name,
            desc,
            roadmapPdf: pdfUrl,
        });

        await newCourse.save();

        return res.status(201).json({
            message: 'Course added successfully',
            course: newCourse,
        });
    } catch (error) {
        console.error('Error adding course:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
// add course - end

const editCourse = async(req, res) => {
    try {
        const { name, desc } = req.body;

        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        // Update fields if provided
        if (name) course.name = name;
        if (desc !== undefined) course.desc = desc;

        // Handle new roadmap PDF upload
        if (req.files && req.files.roadmapPdf) {
            const file = req.files.roadmapPdf;

            // Delete old roadmap from Cloudinary if exists
            if (course.roadmapPdf) {
                const publicId = course.roadmapPdf.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`course-roadmaps/${publicId}`, {
                    resource_type: 'raw',
                });
            }

            // Upload new roadmap
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'course-roadmaps',
                resource_type: 'raw',
                public_id: `roadmap_${Date.now()}`,
            });

            course.roadmapPdf = result.secure_url;

            // Delete temp file
            fs.unlink(file.tempFilePath, (err) => {
                if (err) console.error('Temp file deletion error:', err);
            });
        }

        await course.save();

        res.status(200).json({ success: true, course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// edit course - end

const deleteCourse = async(req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        // Delete roadmap PDF from Cloudinary if exists
        if (course.roadmapPdf) {
            const publicId = course.roadmapPdf.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`course-roadmaps/${publicId}`, {
                resource_type: 'raw',
            });
        }

        await course.deleteOne();

        res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
// delete course - end

const getAllCourses = async(req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// get all courses - end

module.exports = {
    addCourse,
    editCourse,
    deleteCourse,
    getAllCourses
}