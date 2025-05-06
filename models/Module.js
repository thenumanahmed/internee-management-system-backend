const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    techStackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TechStack',
        required: true
    }
});

const Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;