const fs = require("node:fs");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
const multer = require("multer");
const AppError = require("../errors/app.error");
const logger = require("./logger.config");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILES = Object.freeze({
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
});

const getUploadRoot = () =>
  process.env.UPLOADS_DIR
    ? path.resolve(process.env.UPLOADS_DIR)
    : path.resolve(__dirname, "../../uploads");

const createUpload = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      const destination = path.join(getUploadRoot(), folder);
      fs.mkdir(destination, { recursive: true }, (error) => {
        callback(error ? new AppError("FILE_SAVE_FAILED") : null, destination);
      });
    },
    filename: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${randomUUID()}${extension}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE, files: 1, fields: 5, parts: 10 },
    fileFilter: (req, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      if (ALLOWED_FILES[extension] !== file.mimetype) {
        logger.warning(
          `Intento de carga con tipo de archivo no permitido: ${file.mimetype}`,
        );
        return callback(new AppError("INVALID_FILE_TYPE"));
      }
      return callback(null, true);
    },
  });
};

module.exports = {
  MAX_FILE_SIZE,
  getUploadRoot,
  userDocumentUpload: createUpload(path.join("users", "documents")),
  orderProofUpload: createUpload(path.join("orders", "receipts")),
  deliveryProofUpload: createUpload(path.join("deliveries", "receipts")),
};
