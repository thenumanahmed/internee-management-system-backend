const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, default: null },
    roadmapPdf: { type: String, default: null },
})

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;