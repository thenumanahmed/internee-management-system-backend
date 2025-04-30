const bcrypt = require('bcryptjs');

const cloudinary = require('../config/cloudinary.js');
const User = require("../models/User");
const fs = require('fs')

// Get all the users
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await User.find();

        // Check if there are no users
        if (!users || users.length === 0) {
            return res.status(404).json({
                message: 'No users found',
            });
        }

        // Return the list of users
        return res.status(200).json({
            message: 'Users retrieved successfully',
            data: users,
        });
    } catch (error) {
        // Handle any errors during the database query
        console.error(error);
        return res.status(500).json({
            message: 'Server error',
            error: error.message,
        });
    }
};

// edit own profile
const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const updates = JSON.parse(req.body.updatedData); // Parse JSON if sent as string (from multipart/form-data)
        const allowedFields = ['name', 'techStack'];

        // Upload image if file exists
        if (req.files && req.files.image) {
            const file = req.files.image;

            // If user already has a profile image, delete it from Cloudinary
            if (user.image) {
                const publicId = user.image.split('/').pop().split('.')[0]; // Extract public_id from URL
                try {
                    await cloudinary.uploader.destroy(publicId); // Remove the old image from Cloudinary
                    console.log('Previous image deleted successfully');
                } catch (err) {
                    console.error('Error deleting previous image:', err);
                    return res.status(500).json({ message: 'Error deleting previous image from Cloudinary.' });
                }
            } else {
                console.log("No previous image to delete.");
            }

            // Upload new image to Cloudinary
            try {
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'user-profiles',
                    public_id: `user_${user._id}_${Date.now()}`, // Unique public_id
                    overwrite: true,
                    resource_type: 'image', // Ensure it's treated as an image
                });

                // Update user image field with the new image URL
                user.image = result.secure_url;

                // Delete temp file
                fs.unlink(file.tempFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temp file:', err);
                    } else {
                        console.log('Temp file deleted');
                    }
                });
            } catch (err) {
                console.error('Error uploading new image:', err);
                return res.status(500).json({ message: 'Error uploading new image to Cloudinary.' });
            }
        }

        // Update other allowed fields
        Object.entries(updates).forEach(([key, value]) => {
            if (allowedFields.includes(key)) {
                user[key] = value;
            }
        });

        await user.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role,
                techStack: user.techStack,
            },
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// change own password
const changePassword = async (req, res) => {
    const user = req.user;
    const { oldPass, newPass } = req.body;

    if (!oldPass || !newPass) {
        return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    try {
        const existingUser = await User.findById(user._id);

        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPass, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }

        if (newPass.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        existingUser.password = await bcrypt.hash(newPass, salt);
        await existingUser.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    updateProfile,
    changePassword
};
