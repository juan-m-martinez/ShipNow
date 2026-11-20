const User = require("../models/user.model");

const findAllUsers = async ({ skip, limit }) => {
  const [users, total] = await Promise.all([
    User.find({})
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments({}),
  ]);
  return { users, total };
};

const findUserById = async (id) => {
  return User.findById(id).select("_id role").lean();
};

const appendUserDocument = async (id, metadata) =>
  User.findByIdAndUpdate(
    id,
    { $push: { documents: metadata } },
    { returnDocument: "after", runValidators: true },
  ).lean();

module.exports = {
  findAllUsers,
  findUserById,
  appendUserDocument,
};
