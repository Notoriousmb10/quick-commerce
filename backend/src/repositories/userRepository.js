const User = require("../models/User");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const findByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};

const create = async (userData) => {
  return await User.create(userData);
};

const findById = async (id) => {
  return await User.findById(id);
};

const findPartners = async () => {
  return await User.find({ role: "partner" }).select("-password");
};

const deleteById = async (id) => {
  return await User.findByIdAndDelete(id);
};

module.exports = {
  findByEmail,
  findByEmailWithPassword,
  create,
  findById,
  findPartners,
  deleteById,
};
