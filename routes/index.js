const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// ROOT Route
router.get("/", (req, res) => {
    res.render("landing");
});

// ----------------------------
    // Auth Routes
// ----------------------------

// Register Route Shows registration form
router.get("/register", (req, res) => {
    res.render("register");
});

// Handle Register Logic
router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show Login Form
router.get("/login", (req, res) => {
    res.render("login");
});

// Logout Logic
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// Handle Login Logic
router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), (req, res) => {});

module.exports = router;