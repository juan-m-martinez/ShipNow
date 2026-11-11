const app = require("./app");
const config = require("./config/env.config");
const connectDatabase = require("./config/database.config");
const logger = require("./config/logger.config");

const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`ShipNow está escuchando en http://localhost:${config.port}`);
  });
};

startServer();
