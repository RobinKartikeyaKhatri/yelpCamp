const express = require("express");
const router  = express.Router();
const Campground = require("../models/campground");

// middleware function to check is user is loggedin or not
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// INDEX ROUTE
router.get("/", (req, res) => {
    Campground.find((err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// CREATE ROUTE
router.post("/", isLoggedIn, (req, res) => {
    const name = req.sanitize(req.body.name);
    const image = req.sanitize(req.body.image);
    const description = req.sanitize(req.body.description);
    const author = {id: req.user._id, username: req.user.username}
    const newCampground = {name: name, image: image, description: description, author: author};

    Campground.create(newCampground, (err, newlyCreatedCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log(newCampground);
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", (req, res) => {
    const id = req.params.id;
    Campground.findById(id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


module.exports = router;