const express = require('express');
const { createBlog ,getBlogs,getBlogById ,getMyBlogs,deleteBlog,updateBlog} = require('../controllers/blogController');
const multer = require('multer'); // Assuming you're using multer for file uploads
const { protect } = require('../middleware/authMiddleware.js');
const path = require('path');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });


router.get('/blogs', getBlogs);

router.delete('/blogs/:id', protect,deleteBlog);

router.put('/blogs/:id' ,upload.single('image'),protect,updateBlog);



router.get('/myblogs',protect, getMyBlogs, );

// Route to create a new blog
router.post('/blogs', upload.single('image'),  protect,createBlog);

// API to get a single blog by ID
router.get('/blogs/:id', getBlogById);
 


module.exports = router;
