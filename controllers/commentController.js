const Blog = require('../models/Blog');

const addComment = async (req, res) => {
  const { id } = req.params;  
  const { text } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Create a new comment
    const comment = {
      user: req.user._id, // Store the user ID
      text: text,
      createdAt: new Date(),
    };

    // Add comment to the blog post
    blog.comments.push(comment);
    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

const updateComment = async (req, res) => {
  const { id, commentId } = req.params;  
  const { text } = req.body;  

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = blog.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the user is the owner of the comment
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to update this comment' });
    }

    comment.text = text;  
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;

  try {
      const blog = await Blog.findById(id);
      if (!blog) {
          return res.status(404).json({ message: 'Blog post not found' });
      }

      const comment = blog.comments.id(commentId);
      if (!comment) {
          return res.status(404).json({ message: 'Comment not found' });
      }

      // Check if the user is the owner of the comment
      if (!comment.user) {
          return res.status(400).json({ message: 'Comment user not found' });
      }

      if (comment.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Unauthorized to delete this comment' });
      }

      // Use pull to remove the comment by its ID
      blog.comments.pull({ _id: commentId });
      await blog.save();

      res.status(200).json({ message: 'Comment deleted successfully', comments: blog.comments });
  } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Failed to delete comment' });
  }
};


module.exports = { addComment, updateComment, deleteComment };
