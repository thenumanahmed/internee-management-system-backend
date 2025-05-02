const Task = require("../models/Task");
const TUser = require("../models/User");

// Submit a task (Internee)
exports.submitTask = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const task = await Task.create({
            title,
            description,
            date,
            submittedBy: req.user._id,
        });
        res.status(201).json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Approve task (TeamLead)
exports.approveTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.taskId,
            { status: 'approved' },
            { new: true }
        );
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Reject task (TeamLead)
exports.rejectTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.taskId,
            { status: 'rejected', feedback: req.body.feedback || '' },
            { new: true }
        );
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
        res.json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get my tasks (Internee)
exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ submittedBy: req.user._id }).sort({ date: -1 });
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get tasks of a specific user
exports.getTasksByUser = async (req, res) => {
    try {
        const tasks = await Task.find({ submittedBy: req.params.userId }).sort({ date: -1 });
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all pending tasks
exports.getPendingTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ status: 'pending' }).populate('submittedBy', 'name email');
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get all tasks (Admin/SuperAdmin)
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate('submittedBy', 'name email');
        res.json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
