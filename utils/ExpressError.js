// throwing the error according to our need
class ExpressError extends Error {
  constructor( message,status) {
    super();
    this.status = status;
    this.message = message;
  }
}

module.exports = ExpressError;
