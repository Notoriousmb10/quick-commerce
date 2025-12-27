import productRepository from "../repositories/productRepository";
import { IProduct } from "../models/Product";
import { UpdateQuery } from "mongoose";

const getAvailableProducts = async (): Promise<IProduct[]> => {
  return await productRepository.findAvailable();
};

const getProductById = async (id: string): Promise<IProduct> => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");
  return product;
};

const createProducts = async (
  productsData: Partial<IProduct>[]
): Promise<IProduct[]> => {
  return await productRepository.createMany(productsData);
};

const updateProduct = async (
  id: string,
  updateData: any
): Promise<IProduct | null> => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");

  // Only update fields that are provided
  const fields = ["name", "description", "price", "image", "category", "stock"];
  const finalUpdate: UpdateQuery<IProduct> = {};

  fields.forEach((field) => {
    if (updateData[field] !== undefined) {
      (finalUpdate as any)[field] = updateData[field];
    }
  });

  return await productRepository.update(id, finalUpdate);
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  const product = await productRepository.findById(id);
  if (!product) throw new Error("Product not found");
  return await productRepository.deleteById(id);
};

export default {
  getAvailableProducts,
  getProductById,
  createProducts,
  updateProduct,
  deleteProduct,
};
