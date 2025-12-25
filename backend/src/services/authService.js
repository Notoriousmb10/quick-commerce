const userRepository = require("../repositories/userRepository");
const loginLogRepository = require("../repositories/loginLogRepository");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const register = async (userData, ip, userAgent) => {
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
    user: user._id,
    role: user.role,
    ipAddress: ip,
    userAgent: userAgent,
  });

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

const login = async (email, password, ip, userAgent) => {
  const user = await userRepository.findByEmailWithPassword(email);

  if (user && (await user.matchPassword(password))) {
    await loginLogRepository.create({
      user: user._id,
      role: user.role,
      ipAddress: ip,
      userAgent: userAgent,
    });

    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Invalid email or password");
  }
};

const getUserProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");
  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

module.exports = {
  register,
  login,
  getUserProfile,
};
