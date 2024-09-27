 

// controllers/blogController.js
const Blog = require('../models/Blog');  
const cloudinary = require('../config/cloudinaryConfig');
const createBlog = async (req, res) => {
  const { title, description, category, tags,image  } = req.body;
  // const image = req.file ? req.file.path : null; 
  
  try {
     
    const user = req.user ? req.user._id : null; 

    const result = await cloudinary.uploader.upload(image, {
      folder: 'blog_images',
    });
    const newBlog = new Blog({
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(','),
      image :{
        public_id:result.public_id,
        url: result.secure_url,
      },
      user: user
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Failed to create blog', error });
  }
};

// Get all blog posts
const getBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });  
      res.status(200).json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Failed to fetch blogs', error });
    }
  };


// Get a single blog post by ID
const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    res.status(500).json({ message: 'Failed to fetch blog post', error });
  }
};


//    Get logged-in user's blogs 
//     Private
const getMyBlogs = async (req, res) => {
  try {  
    const blogs = await Blog.find({ user: req.user._id })  
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({ message: 'Failed to fetch user blogs', error });
  }
};




const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, tags } = req.body; // Exclude image from here

  try {
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    let imageData = existingBlog.image; // Keep existing image data
    if (req.file) { // Check if a new image file has been uploaded
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blog_images',
      });
      await cloudinary.uploader.destroy(imageData.public_id); // Remove the old image
      imageData = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',') : []),
        image: imageData,
        user: req.user ? req.user._id : null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Failed to update blog post' });
    }

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Failed to update blog', error });
  }
};






 
 
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id); 
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    } 
   
    await Blog.findByIdAndDelete(req.params.id);  
    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Failed to delete blog', error: error.message || error });
  }
};


module.exports = { createBlog ,getBlogs,getBlogById,getMyBlogs,deleteBlog,updateBlog};

