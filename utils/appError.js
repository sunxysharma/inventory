class AppError extends Error {
    constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // if its a 404 or 400 kindog error then log fail else the error itself
    this.isOperational = true;  // operational or programming error

    Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;