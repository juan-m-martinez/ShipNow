const userRepository = require("../repositories/user.repository");

const getAllUsers = async () => {
  const users = await userRepository.findAllUsers();

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }));
};

module.exports = {
  getAllUsers,
};
