const logger = require("../config/logger.config");

const testLogger = (req, res) => {
  logger.debug("Prueba de nivel DEBUG");
  logger.http("Prueba de nivel HTTP");
  logger.info("Prueba de nivel INFO");
  logger.warning("Prueba de nivel WARNING");
  logger.error("Prueba de nivel ERROR");
  logger.fatal("Prueba de nivel FATAL");

  res.status(200).json({ message: "Se registraron los niveles del logger" });
};

module.exports = { testLogger };
