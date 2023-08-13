// checking if the currentUser._id equals the id of the campgrounds requested
const Campground = require("../models/Campgrounds");

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission 😆. . .");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports = isAuthor;
