const userService = require("../services/user.service");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers,
};
