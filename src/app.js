const express = require("express");
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const mockRoutes = require("./routes/mock.routes");
const notFoundMiddleware = require("./middlewares/not-found.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const loggerRoutes = require("./routes/logger.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");
const config = require("./config/env.config");
const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: config.nodeEnv,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);
if (config.nodeEnv !== "production") {
  app.use("/api/mocks", mockRoutes);
  app.use("/api/logger", loggerRoutes);
}
const visibleSwaggerSpec = config.nodeEnv === "production"
  ? {
      ...swaggerSpec,
      paths: Object.fromEntries(
        Object.entries(swaggerSpec.paths).filter(
          ([route]) => !route.startsWith("/api/mocks") && !route.startsWith("/api/logger"),
        ),
      ),
    }
  : swaggerSpec;
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(visibleSwaggerSpec));
app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
