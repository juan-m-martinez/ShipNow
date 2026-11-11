const AppError = require("../errors/app.error");
const logger = require("../config/logger.config");

const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let appError = error;

  if (!(error instanceof AppError)) {
    const isInvalidData =
      error?.name === "ValidationError" ||
      error?.name === "CastError" ||
      error?.code === 11000 ||
      error?.type === "entity.parse.failed";

    appError = isInvalidData
      ? new AppError("INVALID_DATA")
      : new AppError("INTERNAL_SERVER_ERROR");
  }

  const logMessage =
    `${req.method} ${req.originalUrl} - ` +
    `${appError.code}: ${appError.message}`;

  if (appError.statusCode >= 500) {
    logger.error(logMessage, { stack: error?.stack });
  } else {
    logger.warning(logMessage);
  }

  return res.status(appError.statusCode).json({
    status: "error",
    error: {
      code: appError.code,
      message: appError.message,
    },
  });
};

module.exports = errorMiddleware;
