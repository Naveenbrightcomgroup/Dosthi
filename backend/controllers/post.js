const Post = require("../models/post");
exports.createPost = async (req, res) => {
  try {
    const post = await new Post(req.body).save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user")
    res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
