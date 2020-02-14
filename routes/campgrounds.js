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

const checkCampgroundOwnerShip = (req, res, next) => {
    // is user logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                res.redirect("back");
            } else {
                // does the user own campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
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

// Edit Campground Route
router.get("/:id/edit", checkCampgroundOwnerShip, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// Update Campground Route
router.put("/:id", checkCampgroundOwnerShip, (req, res) => {
    // find and update the current campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Campground Route
router.delete("/:id", checkCampgroundOwnerShip, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;