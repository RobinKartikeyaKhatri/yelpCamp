const express       = require("express");
const router        = express.Router({mergeParams: true});
const Campground    = require("../models/campground");
const Comment       = require("../models/comment");

// middleware function to check is user is loggedin or not
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Comments NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    // find campground by id and then send this id to comments/new route
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

// Comments Create ROUTE
router.post("/", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

module.exports = router;