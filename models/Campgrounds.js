const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./Review");
const User = require("./User");

// will define imageSchema and nest it in our main Schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// setting virtual property on every image
// we are just deriving the info already stored in db
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200"); // updating the cloudinary url
});

// mongoose doesn't include virtuals when you convert a document to JSON.
// we are converting it in scripts before the actual access
// to include virtuals need to set { virtuals: true }
const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
  {
    title: {
      type: String,
    },
    image: String,
    price: {
      type: Number,
      min: [1, "Are you dumb or what?"],
      max: [10000, "Sorry Sir, Not everyone rich as you!!!"],
    },
    description: String,
    location: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: [ImageSchema],

    // { type:'Point', coordinates : [ longtitude, latitude ] }
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  opts
);

// virtual key for properties
// to show popup on index page map
campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a style="text-decoration:none;" href="/campgrounds/${
    this._id
  }">${this.title}</a></strong><p>${this.location}</p>`;
});

// deleting all the reviews associated with campground
// will run after i.e. POST of campground deletion
// after findOneAndDelete is called in Campgrounds models
campgroundSchema.post("findOneAndDelete", async (campground) => {
  if (campground.reviews.length != 0) {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

const Campground = mongoose.model("Campground", campgroundSchema);
module.exports = Campground;
