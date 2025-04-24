const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, MinLength: 6 },
    role: {
        type: String,
        enum: ['admin', 'teamLead', 'student'],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
