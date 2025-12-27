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
const orderRepository_1 = __importDefault(require("../repositories/orderRepository"));
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const placeOrder = (userId, items, deliveryLocation) => __awaiter(void 0, void 0, void 0, function* () {
    let totalAmount = 0;
    const processedItems = [];
    for (const item of items) {
        const product = yield productRepository_1.default.findById(item.product);
        if (!product) {
            throw new Error(`Product ${item.product} not found`);
        }
        // Stock check
        if (product.stock < item.quantity) {
            throw new Error("Insufficient stock");
        }
        product.stock -= item.quantity;
        yield productRepository_1.default.save(product);
        totalAmount += product.price * item.quantity;
        processedItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
        });
    }
    const orderData = {
        customer: userId,
        items: processedItems,
        totalAmount,
        deliveryLocation,
        history: [{ status: "placed", updatedBy: userId }],
    };
    const createdOrder = yield orderRepository_1.default.create(orderData);
    return yield orderRepository_1.default.findByIdPopulated(createdOrder._id.toString());
});
const getOrdersForUser = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    if (role === "admin") {
        return yield orderRepository_1.default.findAllAdmin();
    }
    else if (role === "customer") {
        return yield orderRepository_1.default.findByCustomer(userId);
    }
    else {
        throw new Error("Use specific endpoints for partner");
    }
});
const getAvailableOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield orderRepository_1.default.findAvailableForPartners();
});
const getPartnerDeliveries = (partnerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield orderRepository_1.default.findByPartner(partnerId);
});
const acceptOrder = (orderId, partnerId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderRepository_1.default.findById(orderId);
    if (!order)
        throw new Error("Order not found");
    if (order.status !== "placed" || order.deliveryPartner) {
        throw new Error("Order already accepted or not available");
    }
    const finalUpdate = {
        $set: {
            status: "accepted",
            deliveryPartner: partnerId,
        },
        $push: {
            history: { status: "accepted", updatedBy: partnerId },
        },
    };
    return yield orderRepository_1.default.updateWithPopulation(orderId, finalUpdate, [
        { path: "customer", select: "name" },
        { path: "items.product", select: "name" },
    ]);
});
const updateOrderStatus = (orderId, status, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = ["picked_up", "on_way", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
    }
    const order = yield orderRepository_1.default.findById(orderId);
    if (!order) {
        throw new Error("Order not found");
    }
    if (userRole === "partner" &&
        order.deliveryPartner &&
        order.deliveryPartner.toString() !== userId) {
        throw new Error("Not authorized to update this order");
    }
    const updateData = {
        status: status,
        $push: { history: { status, updatedBy: userId } },
    };
    return yield orderRepository_1.default.update(orderId, updateData);
});
const getOrderById = (orderId, userId, userRole) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderRepository_1.default.findByIdPopulated(orderId);
    if (!order)
        throw new Error("Order not found");
    if (userRole === "customer" &&
        order.customer &&
        order.customer._id.toString() !== userId) {
        // Note: customer might be populated or ObjectId. If populated, ._id. If not, .toString() works on ObjectId.
        // Since findByIdPopulated is used, customer is populated object.
        throw new Error("Not authorized");
    }
    return order;
});
const cancelOrder = (orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderRepository_1.default.findById(orderId);
    if (!order)
        throw new Error("Order not found");
    if (order.customer.toString() !== userId) {
        throw new Error("Not authorized");
    }
    if (order.status !== "placed") {
        throw new Error("Cannot cancel order that is already processed");
    }
    return yield orderRepository_1.default.deleteById(orderId);
});
exports.default = {
    placeOrder,
    getOrdersForUser,
    getAvailableOrders,
    getPartnerDeliveries,
    acceptOrder,
    updateOrderStatus,
    getOrderById,
    cancelOrder,
};
