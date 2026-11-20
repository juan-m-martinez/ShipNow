require("dotenv").config();

const requiredVariables = ["PORT", "MONGODB_URI", "NODE_ENV"];
const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]?.trim(),
);

if (missingVariables.length > 0) {
  throw new Error(
    `Faltan variables obligatorias en .env: ${missingVariables.join(", ")}`,
  );
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT debe ser un número entero entre 1 y 65535.");
}

const mongoUri = process.env.MONGODB_URI.trim();
try {
  const parsedMongoUri = new URL(mongoUri);
  if (
    !["mongodb:", "mongodb+srv:"].includes(parsedMongoUri.protocol) ||
    !parsedMongoUri.hostname
  ) {
    throw new Error("scheme or host missing");
  }
} catch {
  throw new Error("MONGODB_URI debe ser una URI mongodb:// o mongodb+srv:// válida.");
}

const nodeEnv = process.env.NODE_ENV.trim();
if (!["development", "test", "production"].includes(nodeEnv)) {
  throw new Error("NODE_ENV debe ser development, test o production.");
}

const allowedLogLevels = ["fatal", "error", "warning", "info", "http", "debug"];
const logLevel = (process.env.LOG_LEVEL || (nodeEnv === "development" ? "debug" : "info"))
  .trim()
  .toLowerCase();
if (!allowedLogLevels.includes(logLevel)) {
  throw new Error(`LOG_LEVEL inválido. Valores permitidos: ${allowedLogLevels.join(", ")}.`);
}

const config = Object.freeze({
  port,
  mongoUri,
  nodeEnv,
  logLevel,
});

module.exports = config;
