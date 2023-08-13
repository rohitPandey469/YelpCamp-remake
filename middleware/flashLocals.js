const flashLocals = (req, res, next) => {
  res.locals.currentUser=req.user;
  res.locals.success = req.flash("success");
  res.locals.error=req.flash("error");
  next();
};

module.exports = flashLocals;
