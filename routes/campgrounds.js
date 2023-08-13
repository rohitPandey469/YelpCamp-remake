const express = require("express");
const router = express.Router();
const campgroundsContollers = require("../controllers/campgroundsControllers");
const catchAsyncWrapper = require("../utils/catchAsyncWrapper");
const { validateCampground } = require("../middleware/validateCampground");
const isLoggedIn = require("../middleware/isLoggedIn");
const isAuthor = require("../middleware/isAuthor");
const multer = require("multer"); // to handle multipart form data primarily images
const {storage}=require("../cloudinary")
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsyncWrapper(campgroundsContollers.getAllCampgrounds))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsyncWrapper(campgroundsContollers.createNewCampground)
  );

router.get("/new", isLoggedIn, campgroundsContollers.getNewCampgroundForm);

router
  .route("/:id")
  .get(catchAsyncWrapper(campgroundsContollers.getCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsyncWrapper(campgroundsContollers.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsyncWrapper(campgroundsContollers.deleteCampground)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  campgroundsContollers.getEditCampgroundForm
);

module.exports = router;
