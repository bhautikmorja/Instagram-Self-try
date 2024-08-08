const mongoose = require("mongoose");
const Post = require("../model/postSchema");

const createPost = async (req, res) => {
  try {
    const post = { ...req.body, user: req.user._id };
    post.image = req.file.filename;
    if (!post.image) {
      throw new Error("Please Enter the Image");
    }
    const addPost = await Post.create(post);
    res.status(201).json({ message: "Post Created successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllPost = async (req, res) => {
  try {
    const getPost = await Post.find().populate("user", "name email");
    res.status(200).json({ getPost });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserPost = async (req, res) => {
  try {
    const post = await Post.find({ user: req.user._id });
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    let postId = req.params.id;
    const post = await Post.findOneAndDelete({
      _id: postId,
      user: req.user._id,
    });
    if (!post) {
      throw new Error("Post is not Availabel");
    }
    res.status(200).json({ message: "Post Deleted" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const update = await Post.findOneAndUpdate(
      {
        _id: postId,
        user: req.user._id,
      },
      req.body,
      { new: true }
    );
    if (!update) {
      throw new Error("Post is not Available");
    }
    res.status(200).json({ message: "Post Updated" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
    res.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      await post.save();
    }
    res.status(200).json({ message: "Post Unliked successfully" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not availabel");
    }

    const comment = { text, user: userId };
    post.comments.push(comment);
    await post.save();
    res.status(200).json({ message: "Comment addedd" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPostInteractions = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate("likes", "name")
      .populate("comments.user", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ likes: post.likes, comments: post.comments });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPost,
  getUserPost,
  deletePost,
  updatePost,
  likePost,
  unlikePost,
  addComment,
  getPostInteractions,
};
