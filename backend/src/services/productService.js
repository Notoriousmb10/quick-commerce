const productRepository = require("../repositories/productRepository");

const getAvailableProducts = async () => {
  return await productRepository.findAvailable();
};

const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
};

const createProducts = async (productsData) => {
  return await productRepository.createMany(productsData);
};

const updateProduct = async (id, updateData) => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");

  // Only update fields that are provided
  const fields = ["name", "description", "price", "image", "category", "stock"];
  const finalUpdate = {};
  fields.forEach((field) => {
    if (updateData[field] !== undefined) {
      finalUpdate[field] = updateData[field];
    }
  });

  return await productRepository.update(id, finalUpdate);
};

const deleteProduct = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");
  return await productRepository.deleteById(id);
};

module.exports = {
  getAvailableProducts,
  getProductById,
  createProducts,
  updateProduct,
  deleteProduct,
};
