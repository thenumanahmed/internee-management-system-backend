const Progress = require('../models/Progress');
const User = require('../models/User');

const editProgress = async(req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const allowedFields = ['coreProgrammingConcepts', 'roadmap', 'project', 'attendence'];
        const updateData = {};

        // Filter only allowed fields
        for (let key of allowedFields) {
            if (updates[key] !== undefined) {
                updateData[key] = updates[key];
            }
        }

        const progress = await Progress.findOneAndUpdate({ userId }, { $set: updateData }, { new: true, runValidators: true });

        if (!progress) {
            return res.status(404).json({ success: false, message: 'Progress not found for user' });
        }

        res.status(200).json({ success: true, progress });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAllProgress = async(req, res) => {
    try {
        const progressList = await Progress.find()
            .populate('userId', 'name email') // only include selected user fields
            .exec();

        if (!progressList || progressList.length === 0) {
            return res.status(404).json({ success: false, message: 'No progress data found.' });
        }

        res.status(200).json({
            success: true,
            progress: progressList,
        });
    } catch (error) {
        console.error('Error getting all progress:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching progress',
            error: error.message
        });
    }
};


module.exports = { editProgress, getAllProgress };