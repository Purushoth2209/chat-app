const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Attempt to extract the token from cookies or authorization header
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    // Verify the token and decode its content
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded; // Attach the decoded user information to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateToken;
