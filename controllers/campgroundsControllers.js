const Campground = require("../models/Campgrounds");
const { ObjectId } = require("mongodb");
const { cloudinary } = require("../cloudinary/index");
const maptilerClient = require("@maptiler/client");
const maptilerToken = process.env.MAPTILER_API_KEY;
maptilerClient.config.apiKey = maptilerToken;

const getAllCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/getAllCampgrounds.ejs", { campgrounds });
};
const createNewCampground = async (req, res) => {
  const newCamp = new Campground({ ...req.body.campground });
  // req.files is holding the image file information
  // saving the files
  newCamp.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // saving the author's id
  newCamp.author = req.user._id;
  // saving the geocodes
  const geoData = await maptilerClient.geocoding.forward(
    req.body.campground.location
  );
  // saving the geocode of very first option
  newCamp.geometry = geoData.features[0].geometry;
  // saving the camp
  await newCamp.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${newCamp._id}`);
};
const updateCampground = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    req.flash("error", "C'mon don't think yourself, a hacker 😆");
    return res.redirect("/campgrounds");
  }
  const campground = await Campground.findByIdAndUpdate(
    id,
    req.body.campground
  );
  let imgs;
  if (req.files) {
    imgs = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
  }
  // adding the images
  campground.images.push(...imgs);
  // deleting the images present in deleteImages array
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      // deleting from cloudinary database
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      // pull from the images array
      // all the images with a filename
      // is in req.body.deleteImages array
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  await campground.save();
  req.flash("success", "Successfully update campground!");
  res.redirect(`/campgrounds/${id}`);
};
const deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
};

const getCampground = async (req, res) => {
  const { id } = req.params;
  // throw an error if typed something unusual after '/campgrounds'

  if (!ObjectId.isValid(id)) {
    req.flash("error", "C'mon don't think yourself, a hacker 😆");
    return res.redirect("/campgrounds");
  }
  const campground = await Campground.findById(id)
    // populating reviews for all campgrounds +
    .populate({ path: "reviews", populate: { path: "author" } }) // + populating the author field for that particular review
    .populate("author");
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/showCampground", { campground });
};

const getNewCampgroundForm = (req, res) => {
  res.render("campgrounds/newCampgroundForm");
};
const getEditCampgroundForm = async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    req.flash("error", "C'mon don't think yourself, a hacker 😆");
    return res.redirect("/campgrounds");
  }
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/editCampgroundForm", { campground });
};

module.exports = {
  getAllCampgrounds,
  createNewCampground,
  updateCampground,
  deleteCampground,
  getCampground,
  getNewCampgroundForm,
  getEditCampgroundForm,
};
