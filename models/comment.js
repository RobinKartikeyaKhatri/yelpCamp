const mongoose = require("mongoose");

// commentSchema
const commentSchema = new mongoose.Schema({
    text: String,
    author: String,
});

// Comment Model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;