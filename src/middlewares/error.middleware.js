const AppError = require("../errors/app.error");
const logger = require("../config/logger.config");
const multer = require("multer");

const normalizeUploadError = (error) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") return new AppError("FILE_TOO_LARGE");
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return new AppError("INVALID_FILE_FIELD");
    }
    return new AppError("FILE_UPLOAD_FAILED");
  }

  if (["EACCES", "EPERM", "ENOSPC", "EIO"].includes(error?.code)) {
    return new AppError("FILE_SAVE_FAILED");
  }

  return error;
};

const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const normalizedError = normalizeUploadError(error);
  let appError = normalizedError;

  if (!(normalizedError instanceof AppError)) {
    const isInvalidData =
      normalizedError?.name === "ValidationError" ||
      normalizedError?.name === "CastError" ||
      normalizedError?.code === 11000 ||
      normalizedError?.type === "entity.parse.failed";

    appError = isInvalidData
      ? new AppError("INVALID_DATA")
      : new AppError("INTERNAL_SERVER_ERROR");
  }

  const logMessage =
    `${req.method} ${req.originalUrl} - ` +
    `${appError.code}: ${appError.message}`;

  if (appError.statusCode >= 500) {
    logger.error(logMessage, { stack: normalizedError?.stack });
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
