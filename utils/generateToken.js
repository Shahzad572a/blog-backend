const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, 'abcd123', {
    expiresIn: '30d',
  });

  // Set JWT as an HTTP-Only cookie (if needed)
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return token; // You may not need to return this if you're setting the cookie
};

module.exports = generateToken;
