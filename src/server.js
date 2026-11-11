const app = require("./app");
const config = require("./config/env.config");
const connectDatabase = require("./config/database.config");

const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`ShipNow está escuchando en http://localhost:${config.port}`);
  });
};

startServer();
