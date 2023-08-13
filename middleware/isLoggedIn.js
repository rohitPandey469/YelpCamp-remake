// protecting the routes - checking if isLoggedIn
// built in method - provided by passport
const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo=req.originalUrl; 
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
