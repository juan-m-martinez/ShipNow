const userRepository = require("../repositories/user.repository");
const mongoose = require("mongoose");
const AppError = require("../errors/app.error");
const logger = require("../config/logger.config");
const { USER_DOCUMENT_TYPE } = require("../constants");
const { buildFileMetadata, removeUploadedFile } = require("./file-metadata.service");
const { parsePagination, buildPagination } = require("./pagination.service");

const getAllUsers = async (query) => {
  const pagination = parsePagination(query);
  const { users, total } = await userRepository.findAllUsers(pagination);

  return {
    users: users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })),
    pagination: buildPagination({ ...pagination, total }),
  };
};

const ensureUserExists = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  const user = await userRepository.findUserById(id);
  if (!user) throw new AppError("USER_NOT_FOUND");
  return user;
};

const addUserDocument = async (id, file, documentType) => {
  if (!file) throw new AppError("FILE_REQUIRED");
  if (!Object.values(USER_DOCUMENT_TYPE).includes(documentType)) {
    await removeUploadedFile(file);
    logger.warning(`Tipo de documento de usuario inválido: ${documentType}`);
    throw new AppError("INVALID_DOCUMENT_TYPE");
  }

  try {
    await ensureUserExists(id);
    const user = await userRepository.appendUserDocument(
      id,
      buildFileMetadata(file, documentType),
    );
    if (!user) throw new AppError("USER_NOT_FOUND");
    logger.info(`Documento ${file.filename} asociado al usuario ${id}`);
    return user;
  } catch (error) {
    await removeUploadedFile(file);
    if (error instanceof AppError) throw error;
    logger.error(`Error al asociar documento al usuario ${id}: ${error.message}`);
    throw new AppError("FILE_SAVE_FAILED");
  }
};

module.exports = {
  getAllUsers,
  ensureUserExists,
  addUserDocument,
};
