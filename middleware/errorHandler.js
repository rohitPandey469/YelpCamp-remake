// Custom error handler
const { logEvents } = require("./logEvents");
const errorHandler = function (err, req, res, next) {
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  const { status = 500 } = err;
  if (!err.message)
    err.message = "Something went wrong and we can't seem to catch it!!!";
  req.flash("You are not strong hmmm, cant seem to crack it");
  if (status != 404) return res.status(status).render("error", { err });
  res.status(status).render("404");
};

module.exports = errorHandler;

// Handling the error before it hits the default error handler of express
