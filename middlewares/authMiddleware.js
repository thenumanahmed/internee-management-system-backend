const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated. Token missing.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    // Get token from cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || (allowedRoles.length && !allowedRoles.includes(user.role))) {
        return res.status(403).json({ message: `Access denied: Only for ${allowedRoles.join(', ')}` });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Error in authorizeRoles:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = { authorizeRoles, isAuthenticated };
