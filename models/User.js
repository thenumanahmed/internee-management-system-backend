const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minLength: 6 },
    image: { type: String, default: null },
    role: {
        type: String,
        enum: ['admin', 'teamLead', 'internee'],
        default: 'internee',
        required: true
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,default: null },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
