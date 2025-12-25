const authService = require("../services/authService");

const registerUser = async (req, res) => {
  try {
    const user = await authService.register(
      req.body,
      req.ip,
      req.get("User-Agent")
    );
    res.status(201).json(user);
  } catch (error) {
    if (error.message === "User already exists") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await authService.login(
      email,
      password,
      req.ip,
      req.get("User-Agent")
    );
    res.json(user);
  } catch (error) {
    if (error.message === "Invalid email or password") {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe };
