// server side validation - JOI
const { campgroundSchema } = require("../joiSchemaValidations");
const ExpressError = require("../utils/ExpressError");
const validateCampground = (req, res, next) => {
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    req.flash("error", msg);
    res.redirect(redirectUrl);
  } else {
    next();
  }
};

module.exports = {
  validateCampground,
};
