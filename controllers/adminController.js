const cloudinary = require('../config/cloudinary.js');
const User = require('../models/User');
const fs = require('fs');

const updateUser = async (req, res) => {
    try {
        const admin = req.user;
        const userId = req.body.userId;
        let updates = JSON.parse(req.body.updates);

        // Optional: Ensure only admins can update users
        if (admin.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only admins can update users.' });
        }

        // Fetch the user to update
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const allowedFields = ['name', 'image', 'techStack', 'role']; // allowed fields to update

        // Parse updates if it is a stringified JSON object
        if (typeof updates === 'string') {
            try {
                updates = JSON.parse(updates);
            } catch (error) {
                return res.status(400).json({ message: 'Invalid updates format. Please provide valid JSON.' });
            }
        }

        // Handle the image upload
        if (req.files && req.files.image) {
            const file = req.files.image;

            // Delete the previous image URL if there is one
            if (user.image) {
                console.log('Deleting previous image...');
                const publicId = user.image.split('/').pop().split('.')[0]; // Extract public_id from URL
                try {
                    await cloudinary.uploader.destroy(publicId); // Remove the old image from Cloudinary
                } catch (error) {
                    console.error('Error deleting previous image:', error);
                    return res.status(500).json({ message: 'Error deleting old image from Cloudinary.' });
                }
            } else {
                console.log("No previous image to delete.");
            }

            // Upload new image to Cloudinary
            try {
                const result = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'user-profiles',
                    public_id: `user_${userId}_${Date.now()}`, // unique public_id based on user ID and timestamp
                    overwrite: true,
                    resource_type: 'image', // Ensure it's treated as an image
                });

                // Update user image field with the new image URL
                updates.image = result.secure_url; // Store the secure URL in the updates object

                // Delete temp file
                fs.unlink(file.tempFilePath, (err) => {
                    if (err) {
                        console.error('Error deleting temp file:', err);
                    } else {
                        console.log('Temp file deleted');
                    }
                });
            } catch (error) {
                console.error('Error uploading new image:', error);
                return res.status(500).json({ message: 'Error uploading new image to Cloudinary.' });
            }
        }

        // Apply only allowed updates
        Object.entries(updates).forEach(([key, value]) => {
            if (allowedFields.includes(key)) {
                user[key] = value;
            }
        });

        await user.save();

        res.status(200).json({ message: 'User updated successfully.', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};



module.exports = { updateUser }