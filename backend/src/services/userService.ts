import userRepository from "../repositories/userRepository";
import { IUser } from "../models/User";

const getPartners = async (): Promise<IUser[]> => {
  return await userRepository.findPartners();
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error("User not found");
  return await userRepository.deleteById(id);
};

export default {
  getPartners,
  deleteUser,
};
