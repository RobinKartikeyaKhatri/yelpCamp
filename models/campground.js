const mongoose = require("mongoose");

// Campground Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// Campground Model
const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;