// NPM Packages
const   express             = require("express"),
        bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        expressSanitizer    = require("express-sanitizer"),
        Campground          = require("./models/campground"),
        Comment             = require("./models/comment"),
        seedDB              = require("./seeds");
        app                 = express();


seedDB();
// DB Connection
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});



// NPM Packages Setup
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));

// Serving Public Directory
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("landing");
});

// INDEX ROUTE
app.get("/campgrounds", (req, res) => {
    Campground.find((err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

// CREATE ROUTE
app.post("/campgrounds", (req, res) => {
    const name = req.sanitize(req.body.name);
    const image = req.sanitize(req.body.image);
    const description = req.sanitize(req.body.description);
    const newCampground = {name: name, image: image, description: description};

    Campground.create(newCampground, (err, newlyCreatedCampground) => {
        if (err) {
            console.log(err);
        } else {
            console.log("A new campground added successfully");
            console.log(newlyCreatedCampground);
            res.redirect("/campgrounds");
        }
    });
});

// NEW ROUTE
app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

// SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
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

// Comments NEW ROUTE
app.get("/campgrounds/:id/comments/new", (req, res) => {
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
app.post("/campgrounds/:id/comments", (req, res) => {
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

app.listen(3000, () => console.log("yelp_camp server started..."));