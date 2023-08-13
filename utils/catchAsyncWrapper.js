// An alternative of try and catch block
// Saving ourselves from crashing the server
const catchAsyncWrapper = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsyncWrapper;
