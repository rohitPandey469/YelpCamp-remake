const Campground = require("../models/Campgrounds");
const Review = require("../models/Review");

const createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id; // storing the author id to review.author
  campground.reviews.push(review);
  await campground.save();
  await review.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${req.params.id}`);
};
const deleteReview = async (req, res) => {
  console.log("hit");
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports = {
  createReview,
  deleteReview,
};
