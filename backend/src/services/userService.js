const userRepository = require("../repositories/userRepository");

const getPartners = async () => {
  return await userRepository.findPartners();
};

const deleteUser = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error("User not found");
  return await userRepository.deleteById(id);
};

module.exports = {
  getPartners,
  deleteUser,
};
