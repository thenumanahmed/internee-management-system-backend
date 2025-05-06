const mongoose = require('mongoose');

const TechStackSchema = new mongoose.Schema({
    name: { type: String, required: true },
    modules: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Module' }
    ]
});

const TechStack = mongoose.model('TechStack', TechStackSchema);

module.exports = TechStack;