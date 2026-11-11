const express = require("express");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const mockRoutes = require("./routes/mock.routes");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const loggerRoutes = require("./routes/logger.routes");
const app = express();

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mocks", mockRoutes);
app.use("/api/logger", loggerRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
