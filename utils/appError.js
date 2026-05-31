class AppError extends Error {
  constructor(message, statusCode, status) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
  }
}

module.exports = AppError;
