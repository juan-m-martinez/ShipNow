const userService = require("../services/user.service");

const ensureUserExists = async (req, res, next) => {
  try {
    await userService.ensureUserExists(req.params.userId);
    return next();
  } catch (error) {
    return next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const result = await userService.getAllUsers(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const uploadDocument = async (req, res, next) => {
  try {
    const user = await userService.addUserDocument(
      req.params.userId,
      req.file,
      req.body.documentType,
    );
    return res.status(201).json({ user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers,
  ensureUserExists,
  uploadDocument,
};
