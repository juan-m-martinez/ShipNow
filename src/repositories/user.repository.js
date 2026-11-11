const User = require("../models/user.model");

const findAllUsers = async () => {
  return User.find({})
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .lean();
};

module.exports = {
  findAllUsers,
};
