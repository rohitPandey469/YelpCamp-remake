const { userSchema } = require("../joiSchemaValidations");
const ExpressError = require("../utils/ExpressError");
const validateRegister = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    req.flash("error", msg);
    res.redirect("/register");
  } else {
    next();
  }
};

module.exports = {
  validateRegister,
};
