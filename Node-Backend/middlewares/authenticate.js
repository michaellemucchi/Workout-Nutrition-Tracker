const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ error: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1];  // Expecting 'Bearer <token>'
    
    if (!token) {
      return res.status(401).send({ error: 'Token is missing or improperly formatted.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, username: decoded.username };  // Attach user info to the request

    next();  // Continue to the next middleware

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ error: 'Token has expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ error: 'Invalid token. Please log in again.' });
    }

    console.error('Authentication error:', error);
    res.status(500).send({ error: 'Internal server error during authentication.' });
  }
};

module.exports = authenticate;
