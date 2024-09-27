const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // Array of strings for tags
    required: false,
  },
  image: {
    public_id:{
      type: String,  
      required: false,
    },
    url:{
      type: String,  
       required: false,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }
  ]
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
