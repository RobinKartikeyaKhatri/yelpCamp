// NPM Packages
const   express                 = require("express"),
        flash                   = require("connect-flash"),
        bodyParser              = require("body-parser"),
        methodOverride          = require("method-override"),
        mongoose                = require("mongoose"),
        passport                = require("passport"),
        LocalStrategy           = require("passport-local"),
        passportLocalMongoose   = require("passport-local-mongoose"),
        expressSession          = require("express-session"),
        expressSanitizer        = require("express-sanitizer"),
        Campground              = require("./models/campground"),
        Comment                 = require("./models/comment"),
        User                    = require("./models/user");
        seedDB                  = require("./seeds");
        app                     = express();

// Requring Routes
const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments"),
      indexRoutes       = require("./routes/index");

// Seed the DataBase
// seedDB();

// DB Connection
// mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://robinkartik:ironmaidenjan1985@yelpcamp-gfwwp.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.log('ERROR:', err.message);
});



// Flash Messages
app.use(flash());

app.use(methodOverride("_method"));
app.use(expressSession({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// NPM Packages Setup
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({extended: true}));

// Serving Public Directory
app.use(express.static(__dirname + "/public"));



// middleware to pass current user info
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, () => console.log("yelp_camp server started..."));