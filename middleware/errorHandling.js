class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class InvalidError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class MongoError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  NotFoundError, InvalidError, AuthError, MongoError, PermissionError,
};
