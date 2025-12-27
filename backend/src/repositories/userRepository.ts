import User from "../models/User";
import { IUser } from "../models/User";
// import { FilterQuery } from "mongoose";

const findByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

const findByEmailWithPassword = async (
  email: string
): Promise<IUser | null> => {
  return await User.findOne({ email }).select("+password");
};

const create = async (userData: Partial<IUser>): Promise<IUser> => {
  return await User.create(userData);
};

const findById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

const findPartners = async (): Promise<IUser[]> => {
  return await User.find({ role: "partner" }).select("-password");
};

const deleteById = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};

export default {
  findByEmail,
  findByEmailWithPassword,
  create,
  findById,
  findPartners,
  deleteById,
};
