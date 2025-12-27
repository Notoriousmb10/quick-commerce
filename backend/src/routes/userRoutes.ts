import express from "express";
import { getPartners, deleteUser } from "../controllers/userController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/partners", protect, authorize("admin"), getPartners);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
