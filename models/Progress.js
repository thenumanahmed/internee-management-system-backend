const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coreProgrammingConcepts: {
        type: Number,
        min: 0,
        max: 30,
        default: 0
    },
    roadmap: {
        type: Number,
        min: 0,
        max: 30,
        default: 0
    },
    project: {
        type: Number,
        min: 0,
        max: 30,
        default: 0
    },
    attendence: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    }
})

const Progress = mongoose.model('Progress', ProgressSchema);
module.exports = Progress;