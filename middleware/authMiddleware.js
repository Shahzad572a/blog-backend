const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token; 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
    
      token = req.headers.authorization.split(' ')[1];
      // console.log('Token received:', token);  

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Decoded token:', decoded);  

      // Find the user associated with the token and attach to the request
      req.user = await User.findById(decoded.userId).select('-password'); 
      console.log('User found:', req.user);  
      console.log('User ID to find:', decoded.userId);

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error('Error in token verification:', error);  
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No token provided in headers');  
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
