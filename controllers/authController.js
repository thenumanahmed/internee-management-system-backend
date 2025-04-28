
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role: 'admin' });
    await user.save();

    const token = generateToken(user);
    // signup successfull
    res.status(201).json({ token, user });
  } catch (err) {
    // duplicate user or any other error
    res.status(500).json({ message: 'Server error' });
  }
};

const inviteUser = async (req, res) => {
  const { name, email, invitedBy, role } = req.body;

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
      role, // role can be 'teamLead' or 'internee'
      invitedBy
    });

    await user.save();

    // Send email with plain password
    await sendEmail({
      to: to,
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

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    // login successfull
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const loginTeamLead = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'teamLead') return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    // login successfull
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const loginInternee = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.role !== 'internee') return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    // login successfull
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerAdmin, loginAdmin, loginTeamLead, loginInternee, inviteUser };
