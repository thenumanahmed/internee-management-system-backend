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
    status: {
        type: String,
        enum: ['join', 'left'],
        default: 'join'
    },
    joiningDate: { type: Date, default: null },
    leavingDate: { type: Date, default: null },

    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // isVerified: { type: Boolean, default: false }, // when invite link is opened it will be set to true

    techStack: { type: mongoose.Schema.Types.ObjectId, ref: 'TechStack', default: null },
    modules: [{
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module',
            required: true
        },
        status: {
            type: String,
            enum: ['notStarted', 'pending', 'approved', 'rejected'],
            default: 'notStarted',
            required: true
        },
    }],

    // when the user reset password
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpire: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpire: { type: Date },

}, { timestamps: true });

// Static method for safe updates
userSchema.statics.safeUpdateUser = async function (userId, updateData) {
    const original = await this.findById(userId);
    const updatedUser = await this.findByIdAndUpdate(userId, updateData, { new: true });

    if (
        updateData.techStack &&
        String(updateData.techStack) !== String(original.techStack)
    ) {
        const { assignModulesToTheUser } = require('../controllers/userController');
        await assignModulesToTheUser(updatedUser._id, updateData.techStack);
    }

    return updatedUser;
};

userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('techStack') && this.techStack) {
            const { assignModulesToTheUser } = require('../controllers/userController');
            await assignModulesToTheUser(this._id, this.techStack);
        }
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;