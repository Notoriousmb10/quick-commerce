import userRepository from "../repositories/userRepository";
import loginLogRepository from "../repositories/loginLogRepository";
import jwt from "jsonwebtoken";
import { RegisterUserDto, UserResponseDto } from "../dtos/auth.dto";

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d",
  });
};

const register = async (
  userData: RegisterUserDto,
  ip: string,
  userAgent: string
): Promise<UserResponseDto> => {
  const { name, email, password, role } = userData;

  const userExists = await userRepository.findByEmail(email);

  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await userRepository.create({
    name,
    email,
    password,
    role: role || "customer",
  });

  await loginLogRepository.create({
    user: user._id as any,
    role: user.role,
    ipAddress: ip,
    userAgent: userAgent,
  });

  return {
    _id: (user._id as any).toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken((user._id as any).toString()),
  };
};

const login = async (
  email: string,
  password: string,
  ip: string,
  userAgent: string
): Promise<UserResponseDto> => {
  const user = await userRepository.findByEmailWithPassword(email);

  // Since matchPassword is on the document, we need to ensure user is typed as IUser
  if (user && (await user.matchPassword(password))) {
    await loginLogRepository.create({
      user: user._id as any,
      role: user.role,
      ipAddress: ip,
      userAgent: userAgent,
    });

    return {
      _id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken((user._id as any).toString()),
    };
  } else {
    throw new Error("Invalid email or password");
  }
};

const getUserProfile = async (userId: string): Promise<UserResponseDto> => {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return {
    _id: (user._id as any).toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export default {
  register,
  login,
  getUserProfile,
};
