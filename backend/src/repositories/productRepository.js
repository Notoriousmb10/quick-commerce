const Product = require("../models/Product");

const findAvailable = async () => {
  return await Product.find({ stock: { $gt: 0 } });
};

const findById = async (id) => {
  return await Product.findById(id);
};

const createMany = async (productsData) => {
  return await Product.insertMany(productsData);
};

const update = async (id, updateData) => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteById = async (id) => {
  return await Product.findByIdAndDelete(id);
};

const save = async (product) => {
  return await product.save();
};

module.exports = {
  findAvailable,
  findById,
  createMany,
  update,
  deleteById,
  save,
};
