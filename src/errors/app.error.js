const ERROR_DICTIONARY = require("./error.dictionary");

class AppError extends Error {
  constructor(code, message) {
    const definition = ERROR_DICTIONARY[code];
    const isKnownCode = Boolean(definition);

    super(
      isKnownCode
        ? message || definition.message
        : ERROR_DICTIONARY.INTERNAL_SERVER_ERROR.message,
    );

    this.name = "AppError";
    this.code = isKnownCode ? code : "INTERNAL_SERVER_ERROR";
    this.statusCode = isKnownCode ? definition.statusCode : 500;
    this.isOperational = isKnownCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

