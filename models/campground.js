const mongoose = require("mongoose");

// Campground Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// Campground Model
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;