const ClientError = require("./ClientError");

class ForbiddenError extends ClientError {
  constructor(message, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ForbiddenError";
  }
}

module.exports = ForbiddenError;
