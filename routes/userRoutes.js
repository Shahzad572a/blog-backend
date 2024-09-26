const express = require('express');
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/').post(registerUser) ;
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  
 

  module.exports = router;