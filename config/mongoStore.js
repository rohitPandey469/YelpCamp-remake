const MongoStore = require("connect-mongo");
const DB_URL =
  process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/yelpcamp-remake";

// will store the information in session collections
// so that user can stay logged in on the page
const store = MongoStore.create({
  mongoUrl: DB_URL,
  touchAfter: 24 * 60 * 60, // 24 hrs
  crypto: {
    secret: process.env.SECRET || "secret",
  },
});

module.exports = store;
