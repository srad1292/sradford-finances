class APIException extends Error {


    constructor(message, errors = [], statusCode = 400) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
module.exports = APIException;
  