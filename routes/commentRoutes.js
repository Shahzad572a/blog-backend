const express = require('express');
const router = express.Router();
const { addComment,updateComment,deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/blogs/:id/comments
router.post('/blogs/:id/comments', protect, addComment);

router.put('/blogs/:id/comments/:commentId',protect, updateComment);

 
router.delete('/blogs/:id/comments/:commentId',protect, deleteComment);

module.exports = router;
