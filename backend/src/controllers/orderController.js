const orderService = require("../services/orderService");

const placeOrder = async (req, res) => {
  console.log(req.body, "data");
  const { items, deliveryLocation } = req.body;

  try {
    const createdOrder = await orderService.placeOrder(
      req.user.id,
      items,
      deliveryLocation
    );

    const io = req.app.get("io");
    io.emit("new_order_available", createdOrder);
    io.emit("admin_new_order", createdOrder);

    res.status(201).json(createdOrder);
  } catch (error) {
    if (
      error.message === "Insufficient stock" ||
      error.message.includes("not found")
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrdersForUser(
      req.user.id,
      req.user.role
    );
    return res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableOrders = async (req, res) => {
  try {
    const orders = await orderService.getAvailableOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDeliveries = async (req, res) => {
  try {
    const orders = await orderService.getPartnerDeliveries(req.user.id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const order = await orderService.acceptOrder(req.params.id, req.user.id);

    const io = req.app.get("io");
    io.emit("order_accepted_by_partner", { orderId: order._id });
    // Notify Customer
    io.to(`order_${order._id}`).emit("order_update", order);
    // Notify Admin
    io.emit("admin_order_update", order);

    res.json(order);
  } catch (error) {
    if (error.message === "Order already accepted or not available") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      req.user.id,
      req.user.role
    );

    const io = req.app.get("io");
    io.to(`order_${order._id}`).emit("order_update", order);
    io.emit("admin_order_update", order);

    res.json(order);
  } catch (error) {
    if (error.message === "Order not found") {
      res.status(404).json({ message: error.message });
    } else if (
      error.message === "Not authorized to update this order" ||
      error.message === "Invalid status"
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    res.json(order);
  } catch (error) {
    if (error.message === "Order not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Not authorized") {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const deleteOrder = async (req, res) => {
  try {
    await orderService.cancelOrder(req.params.id, req.user.id);
    const io = req.app.get("io");
    io.emit("order_cancelled", { orderId: req.params.id });
    io.emit("admin_order_update", {
      orderId: req.params.id,
      status: "cancelled",
    });
    res.json({ message: "Order removed" });
  } catch (error) {
    if (error.message === "Order not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Not authorized") {
      res.status(401).json({ message: error.message });
    } else if (
      error.message === "Cannot cancel order that is already processed"
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  placeOrder,
  getOrders,
  getAvailableOrders,
  getMyDeliveries,
  acceptOrder,
  updateOrderStatus,
  getOrderById,
  deleteOrder,
};
