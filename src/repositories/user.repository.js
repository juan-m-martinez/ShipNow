const User = require("../models/user.model");

const findAllUsers = async () => {
  return User.find({})
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

const findUserById = async (id) => {
  return User.findById(id).select("_id").lean();
};

module.exports = {
  findAllUsers,
  findUserById,
};
