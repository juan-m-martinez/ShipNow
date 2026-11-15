const path = require("node:path");
const fs = require("node:fs/promises");
const { getUploadRoot } = require("../config/upload.config");

const buildFileMetadata = (file, documentType) => ({
  originalName: path.basename(file.originalname.replaceAll("\\", "/")),
  generatedName: file.filename,
  path: path.relative(getUploadRoot(), file.path).split(path.sep).join("/"),
  mimeType: file.mimetype,
  size: file.size,
  documentType,
  uploadedAt: new Date(),
});

const removeUploadedFile = async (file) => {
  if (!file?.path) return;
  try {
    await fs.unlink(file.path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
};

module.exports = { buildFileMetadata, removeUploadedFile };
