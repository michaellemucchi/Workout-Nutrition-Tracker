const jwt = require('jsonwebtoken');

const generateToken = (userId, username) => {
  return jwt.sign(
    { id: userId, username },  // Include additional claims if needed
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || '24h' }  // Configurable expiration time
  );
};

module.exports = { generateToken };
