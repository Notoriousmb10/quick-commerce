const express = require("express");
const router = express.Router();
const { getPartners, deleteUser } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/partners", protect, authorize("admin"), getPartners);
router.delete("/:id", protect, authorize("admin"), deleteUser);

module.exports = router;
