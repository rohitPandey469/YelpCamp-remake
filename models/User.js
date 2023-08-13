// integrating passport - section
const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// username:{},password:{} - added to schema
// will make sure that the username are unique
userSchema.plugin(passportLocalMongoose); 

// STATIC methods are added automatically - search on docs
module.exports = mongoose.model("User", userSchema);
