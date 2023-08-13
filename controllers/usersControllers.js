const User = require("../models/User");

const getRegisterForm = (req, res) => {
  res.render("users/registerForm");
};
const getLoginForm = (req, res) => {
  res.render("users/loginForm");
};
const register = async (req, res) => {
  // duplicate users - will use extra wrapper or try and catch block
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    // after registring we dont want user to logged in
    // to login automatically
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
const login = async (req, res) => {
  req.flash("success", `Welcome back ${req.user.username}!`);
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};
const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye! Hope to see you again...");
    res.redirect("/");
  });
};
module.exports = {
  getRegisterForm,
  getLoginForm,
  register,
  login,
  logout,
};
