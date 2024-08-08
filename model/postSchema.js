const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const PostSchema = mongoose.Schema({
  image: { type: String, required: true },
  caption: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [CommentSchema],
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
