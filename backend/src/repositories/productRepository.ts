import Product, { IProduct } from "../models/Product";
import { UpdateQuery } from "mongoose";

const findAvailable = async (): Promise<IProduct[]> => {
  return await Product.find({ stock: { $gt: 0 } });
};

const findById = async (id: string): Promise<IProduct | null> => {
  return await Product.findById(id);
};

const createMany = async (
  productsData: Partial<IProduct>[]
): Promise<IProduct[]> => {
  return (await Product.insertMany(
    productsData as any
  )) as unknown as IProduct[];
};

const update = async (
  id: string,
  updateData: UpdateQuery<IProduct>
): Promise<IProduct | null> => {
  return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteById = async (id: string): Promise<IProduct | null> => {
  return await Product.findByIdAndDelete(id);
};

const save = async (product: IProduct): Promise<IProduct> => {
  return await product.save();
};

export default {
  findAvailable,
  findById,
  createMany,
  update,
  deleteById,
  save,
};
