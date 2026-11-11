const mongoose = require("mongoose");
const config = require("./env.config");
const logger = require("./logger.config");

const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info("Conexión a MongoDB establecida");
  } catch (error) {
    logger.fatal(`Falló la conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
