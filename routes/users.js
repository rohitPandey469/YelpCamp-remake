const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/usersControllers");
const catchAsyncWrapper = require("../utils/catchAsyncWrapper");
const loginPassport = require("../middleware/loginPassport");
const storeReturnTo = require("../middleware/storeReturnTo");
const { validateRegister } = require("../middleware/validateRegister");

router
  .route("/register")
  .get(usersControllers.getRegisterForm)
  .post(validateRegister, catchAsyncWrapper(usersControllers.register));

router.route("/login").get(usersControllers.getLoginForm).post(
  // using the storeReturnTo middleware to save the returnTo value from session to res.locals
  storeReturnTo,
  // passport.authenticate logs the user and clears req.session
  loginPassport,
  // Now, can use res.locals to redirect the user after login
  usersControllers.login
);

router.get("/logout", usersControllers.logout);

module.exports = router;
