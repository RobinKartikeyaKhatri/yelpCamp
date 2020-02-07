// NPM Packages
const   express             = require("express"),
        bodyParser          = require("body-parser"),
        mongoose            = require("mongoose"),
        expressSanitizer    = require("express-sanitizer"),
        Campground          = require("./models/campground"),
        seedDB                = require("./seeds");
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

// Campground.create({
//     name: "Granite Hill",
//     image: "https://images.unsplash.com/photo-1551256817-e6099a18ad79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1158&q=80",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
// });

app.get("/", (req, res) => {
    res.render("landing");
});

// INDEX ROUTE
app.get("/campgrounds", (req, res) => {
    Campground.find((err, campgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: campgrounds});
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
    res.render("new");
});

// SHOW ROUTE
app.get("/campgrounds/:id", (req, res) => {
    const id = req.params.id;
    Campground.findById(id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(3000, () => console.log("yelp_camp server started..."));