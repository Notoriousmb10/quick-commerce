const userService = require("../services/userService");

const getPartners = async (req, res) => {
  try {
    const partners = await userService.getPartners();
    res.json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User removed" });
  } catch (error) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
};

module.exports = {
  getPartners,
  deleteUser,
};
