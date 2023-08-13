// to authenticate local - build in middleware by passport
// can even use for google or twitter or instagram login
const passport = require("passport");
const loginPassport = passport.authenticate("local", {
  failureFlash: true,
  failureRedirect: "/login",
});

module.exports = loginPassport;
