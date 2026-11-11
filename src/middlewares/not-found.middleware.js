const AppError = require("../errors/app.error");

const notFoundMiddleware = (req, res, next) => {
  return next(new AppError("ROUTE_NOT_FOUND"));
};

module.exports = notFoundMiddleware;
