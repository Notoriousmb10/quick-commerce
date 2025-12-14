const express = require("express");
const router = express.Router();
const { getPartners, deleteUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/partners", protect, getPartners);
router.delete("/:id", protect, deleteUser);

module.exports = router;
