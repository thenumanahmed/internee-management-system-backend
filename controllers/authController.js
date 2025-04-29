const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const generateToken = require('../utils/generateToken');
const { sendInviteEmail, sendOTPEmail } = require('../utils/sendEmail');

const signUp = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role });
    await user.save();

    const token = generateToken(user);

    // Set token in the cookie 
    res.cookie('token', token, {
      httpOnly: true,
    });

    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    // duplicate user or any other error
    console.log(err)
    res.status(500).json({ message: 'Server error' });
  }
};

const inviteUser = async (req, res) => {
  const { name, email, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Generate random 8-character password
    const plainPassword = crypto.randomBytes(4).toString('hex'); // 8 chars
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Create new team lead user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      invitedBy: req.user._id
    });

    await user.save();

    // Send email with plain password
    await sendInviteEmail({
      to: "numanahmedmail@gmail.com",
      subject: 'Your IIFA Tech Account Credentials',
      name,
      email,
      plainPassword,
      role,
    });

    user.password = undefined; // Remove password from response

    res.status(201).json({
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== role) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    // set the token in the cookie
    res.cookie('token', token, {
      httpOnly: true,
    });

    res.status(200).json({ message: 'login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
  });

  res.status(200).json({ message: 'Logout successful' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6 digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP and expiry (10 minutes later)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = Date.now() + 10000 * 60 * 1000; // 10 minutes
    user.resetPasswordTokenExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    // Send email
    await sendOTPEmail({
      to: "numanahmedmail@gmail.com",
      // to: user.email,
      subject: 'Your Password Reset OTP',
      name: user.name,
      otp
    });

    res.status(200).json({ message: 'OTP sent to email successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check OTP and expiration
    if (
      String(user.resetPasswordOTP) !== String(otp) ||
      !user.resetPasswordOTPExpire ||
      user.resetPasswordOTPExpire < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // OTP verified → generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Clear OTP after successful verification
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;

    await user.save();

    res.status(200).json({
      message: 'OTP verified successfully.',
      resetToken
    });

  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate reset token
    if (
      String(user.resetPasswordToken) !== String(resetToken) ||
      !user.resetPasswordTokenExpire ||
      user.resetPasswordTokenExpire < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Reset password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now login.' });

  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signUp,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  inviteUser
}