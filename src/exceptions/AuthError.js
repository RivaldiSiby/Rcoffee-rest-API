const ClientError = require("./ClientError");

class AuthError extends ClientError {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AuthError";
  }
}

module.exports = AuthError;
