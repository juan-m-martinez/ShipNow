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

const config = Object.freeze({
  port,
  mongoUri: process.env.MONGODB_URI.trim(),
  nodeEnv: process.env.NODE_ENV.trim(),
});

module.exports = config;
