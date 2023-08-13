const { reviewSchema } = require("../joiSchemaValidations");
const ExpressError = require("../utils/ExpressError");
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = {
  validateReview,
};
