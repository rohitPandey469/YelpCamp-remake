if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const dbConn = require("./config/dbConn");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const campgroundRoutes = require("./routes/campgrounds");
const ExpressError = require("./utils/ExpressError");
const reveiwRoutes = require("./routes/reviews");
const session = require("express-session");
const sessionConfig = require("./config/sessionConfig");
const flash = require("connect-flash");
const flashLocals = require("./middleware/flashLocals");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User");
const userRoutes = require("./routes/users");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const store = require("./config/mongoStore");

const PORT = process.env.PORT || 3000;

dbConn(); // mongo connection

app.use(logger); // custom middleware logger

app.engine("ejs", ejsMate); // for using include keyword in views directory
app.set("view engine", "ejs"); // ejs set-up
app.set("views", path.join(__dirname, "views")); // look inside the views dir

app.use(express.urlencoded({ extended: true })); // built-in middleware to handle urlencoded form data
app.use(express.json()); // built in middleware for json
app.use("/", express.static(path.join(__dirname, "/public"))); // serving static files in public directory
app.use(mongoSanitize()); // to filter out the "$gt"
app.use(methodOverride("_method")); // To set routes other than post and get

store.on("error", function (e) {
  console.log("Session store error : ", e);
});

app.use(session(sessionConfig)); // to send cookies + to use Flash + . . .
app.use(flash()); // can flash when some task completed + use it only after setting up something
app.use(helmet()); // extra layer of security

// config's for helmet
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.umd.min.js",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/css/bootstrap.min.css",
  "https://cdn.maptiler.com/maptiler-sdk-js/latest/maptiler-sdk.css",
  "https://fonts.googleapis.com/",
  "https://api.maptiler.com/maps/dataviz-dark/style.json",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.maptiler.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
];
const fontSrcUrls = [];
// configuring helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dlvkf6kgm/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://api.maptiler.com/resources/logo.svg",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// >>>>> after session <<<<<
// passport configuration in server.js
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // specifying authentication method

passport.serializeUser(User.serializeUser()); // how to serialize a user - to store a user in session
passport.deserializeUser(User.deserializeUser()); // how to get that user out of the session - unstore
// after serializing and deserializing will get req.user info
app.use(flashLocals); // hitting it before any routes i.e. setting flash locals, accessible through all templates

// routes
app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reveiwRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// If not hit any routes
app.all("*", (req, res, next) => {
  return next(new ExpressError("Page not found", 404));
});

// catch the error
app.use(errorHandler);

// Server started
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error : "));
db.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
