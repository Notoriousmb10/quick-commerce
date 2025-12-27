import express from "express";
import {
  placeOrder,
  getOrders,
  getAvailableOrders,
  getMyDeliveries,
  acceptOrder,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
} from "../controllers/orderController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, authorize("customer"), placeOrder);
router.get("/", protect, getOrders);
router.get("/available", protect, authorize("partner"), getAvailableOrders);
router.get("/my-deliveries", protect, authorize("partner"), getMyDeliveries);
router.get("/:id", protect, getOrderById);
router.delete("/:id", protect, authorize("customer"), deleteOrder);

router.put("/:id/accept", protect, authorize("partner"), acceptOrder);
router.put(
  "/:id/status",
  protect,
  authorize("partner", "admin"),
  updateOrderStatus
);

export default router;
