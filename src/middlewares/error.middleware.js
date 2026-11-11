const AppError = require("../errors/app.error");

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

    if (!isInvalidData) {
      console.error(error);
    }
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
