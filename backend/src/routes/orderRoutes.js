const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrders,
  getAvailableOrders,
  getMyDeliveries,
  acceptOrder,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("customer"), placeOrder);
router.get("/", protect, getOrders); // Admin sees all, Customer sees theirs
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

module.exports = router;
