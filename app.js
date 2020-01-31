// NPM Packages
const   express         = require("express"),
        bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        app             = express();

// DB Connection
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

// Campground Schema
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

// Campground Model
const Campground = mongoose.model("Campground", campgroundSchema);

// NPM Packages Setup
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Serving Public Directory
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/campgrounds", (req, res) => {
    Campground.find((err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

app.post("/campgrounds", (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = {name: name, image: image};

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

app.listen(3000, () => console.log("yelp_camp server started..."));