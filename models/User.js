const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true, minLength: 6 },
    image: { type: String, default: null },
    role: {
        type: String,
        enum: ['superAdmin', 'admin', 'teamLead', 'internee'],
        default: 'internee'
    },
    techStack: Array,
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    resetPasswordOTP: { type: String },
    resetPasswordOTPExpire: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpire: { type: Date },

}, { timestamps: true });

const User = mongoose.model('User', userSchema)
module.exports = User
