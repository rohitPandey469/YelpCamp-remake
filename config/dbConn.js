const mongoose = require("mongoose");

const DB_URL =
  process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/yelpcamp-remake";
const dbConn = () => {
  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = dbConn;
