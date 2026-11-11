const fs = require("node:fs");
const path = require("node:path");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("./env.config");

const levels = Object.freeze({
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
});

const colors = Object.freeze({
  fatal: "red",
  error: "red",
  warning: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
});

winston.addColors(colors);

const isDevelopment = config.nodeEnv === "development";
const minimumLevel = isDevelopment ? "debug" : "info";
const logsDirectory = path.resolve(__dirname, "../../logs");

fs.mkdirSync(logsDirectory, { recursive: true });

const timestamp = winston.format.timestamp({
  format: "YYYY-MM-DD HH:mm:ss",
});

const fileFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  timestamp,
  winston.format.printf(
    ({ timestamp: time, level, message, stack }) =>
      `${time} [${level}] ${stack || message}`,
  ),
);

const consoleFormat = winston.format.combine(
  winston.format.errors({ stack: true }),
  timestamp,
  winston.format.colorize({ all: true }),
  winston.format.printf(
    ({ timestamp: time, level, message, stack }) =>
      `${time} [${level}] ${stack || message}`,
  ),
);

const logger = winston.createLogger({
  levels,
  level: minimumLevel,
  transports: [
    new winston.transports.Console({
      level: minimumLevel,
      format: consoleFormat,
    }),
    new DailyRotateFile({
      filename: path.join(logsDirectory, "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      level: minimumLevel,
      format: fileFormat,
    }),
    new DailyRotateFile({
      filename: path.join(logsDirectory, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      zippedArchive: true,
      level: "error",
      format: fileFormat,
    }),
  ],
});

module.exports = logger;
