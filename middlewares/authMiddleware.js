const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user || (allowedRoles.length && !allowedRoles.includes(user.role))) {
        return res.status(403).json({ message: `Access denied: Only for ${allowedRoles.join(', ')}` });
      }

      req.user = user;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = protect;


module.exports = { protect };
