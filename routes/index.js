const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// middleware function to check is user is loggedin or not
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

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
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, () => {
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