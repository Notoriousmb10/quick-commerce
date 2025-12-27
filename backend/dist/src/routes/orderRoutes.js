"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("customer"), orderController_1.placeOrder);
router.get("/", authMiddleware_1.protect, orderController_1.getOrders);
router.get("/available", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("partner"), orderController_1.getAvailableOrders);
router.get("/my-deliveries", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("partner"), orderController_1.getMyDeliveries);
router.get("/:id", authMiddleware_1.protect, orderController_1.getOrderById);
router.delete("/:id", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("customer"), orderController_1.deleteOrder);
router.put("/:id/accept", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("partner"), orderController_1.acceptOrder);
router.put("/:id/status", authMiddleware_1.protect, (0, authMiddleware_1.authorize)("partner", "admin"), orderController_1.updateOrderStatus);
exports.default = router;
