const express = require("express");
// mergeParams for merging the params
const router = express.Router({ mergeParams: true });
const reviewsContollers = require("../controllers/reviewsControllers");
const catchAsyncWrapper = require("../utils/catchAsyncWrapper");
const { validateReview } = require("../middleware/validateReview");
const isLoggedIn = require("../middleware/isLoggedIn");
const isReviewAuthor = require("../middleware/isReviewAuthor");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsyncWrapper(reviewsContollers.createReview)
);
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsyncWrapper(reviewsContollers.deleteReview)
);

module.exports = router;
