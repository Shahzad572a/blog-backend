const asyncHandler = require('../middleware/asyncHandler.js');
const generateToken = require('../utils/generateToken.js');
const User = require('../models/User.js');

 
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token 
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

 
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
     
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

 
const logoutUser = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

 
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
     
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
 
 

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  
 
};