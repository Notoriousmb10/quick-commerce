"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.getOrderById = exports.updateOrderStatus = exports.acceptOrder = exports.getMyDeliveries = exports.getAvailableOrders = exports.getOrders = exports.placeOrder = void 0;
const orderService_1 = __importDefault(require("../services/orderService"));
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, "data");
    const { items, deliveryLocation } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const createdOrder = yield orderService_1.default.placeOrder(req.user.id, items, deliveryLocation);
        const io = req.app.get("io");
        io.emit("new_order_available", createdOrder);
        io.emit("admin_new_order", createdOrder);
        res.status(201).json(createdOrder);
    }
    catch (error) {
        if (error.message === "Insufficient stock" ||
            error.message.includes("not found")) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: error.message });
        }
    }
});
exports.placeOrder = placeOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const orders = yield orderService_1.default.getOrdersForUser(req.user.id, req.user.role);
        return res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getOrders = getOrders;
const getAvailableOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield orderService_1.default.getAvailableOrders();
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAvailableOrders = getAvailableOrders;
const getMyDeliveries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const orders = yield orderService_1.default.getPartnerDeliveries(req.user.id);
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMyDeliveries = getMyDeliveries;
const acceptOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const order = yield orderService_1.default.acceptOrder(req.params.id, req.user.id);
        if (!order) {
            throw new Error("Order not found");
        }
        const io = req.app.get("io");
        io.emit("order_accepted_by_partner", { orderId: order._id });
        // Notify Customer
        io.to(`order_${order._id}`).emit("order_update", order);
        // Notify Admin
        io.emit("admin_order_update", order);
        res.json(order);
    }
    catch (error) {
        if (error.message === "Order already accepted or not available") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
});
exports.acceptOrder = acceptOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const order = yield orderService_1.default.updateOrderStatus(req.params.id, status, req.user.id, req.user.role);
        if (!order) {
            // Should be caught by service error but safe check
            throw new Error("Order not found");
        }
        const io = req.app.get("io");
        io.to(`order_${order._id}`).emit("order_update", order);
        io.emit("admin_order_update", order);
        res.json(order);
    }
    catch (error) {
        if (error.message === "Order not found") {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === "Not authorized to update this order" ||
            error.message === "Invalid status") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
});
exports.updateOrderStatus = updateOrderStatus;
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        const order = yield orderService_1.default.getOrderById(req.params.id, req.user.id, req.user.role);
        res.json(order);
    }
    catch (error) {
        if (error.message === "Order not found") {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === "Not authorized") {
            res.status(403).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
});
exports.getOrderById = getOrderById;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
        yield orderService_1.default.cancelOrder(req.params.id, req.user.id);
        const io = req.app.get("io");
        io.emit("order_cancelled", { orderId: req.params.id });
        io.emit("admin_order_update", {
            orderId: req.params.id,
            status: "cancelled",
        });
        res.json({ message: "Order removed" });
    }
    catch (error) {
        if (error.message === "Order not found") {
            res.status(404).json({ message: error.message });
        }
        else if (error.message === "Not authorized") {
            res.status(401).json({ message: error.message });
        }
        else if (error.message === "Cannot cancel order that is already processed") {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: error.message });
        }
    }
});
exports.deleteOrder = deleteOrder;
