const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');  // Assuming you're sending the token via headers

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verify the token
    req.user = decoded.user;  // Attach the decoded user info to the request object
    next();  // Proceed to the next middleware
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });  // Handle token verification failure
  }
};

module.exports = authMiddleware;
