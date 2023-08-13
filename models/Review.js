const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  body: {
    type: String,
  },
  rating: {
    type: Number,
    min: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
