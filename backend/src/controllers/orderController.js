const Order = require("../models/Order");
const Product = require("../models/Product");

const placeOrder = async (req, res) => {
  const { items, deliveryLocation } = req.body;

  try {
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.product} not found` });
      }
      totalAmount += product.price * item.quantity;
      processedItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = new Order({
      customer: req.user.id,
      items: processedItems,
      totalAmount,
      deliveryLocation,
      history: [{ status: "placed", updatedBy: req.user.id }],
    });

    const createdOrder = await order.save();

    const io = req.app.get("io");
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate("customer", "name email")
      .populate("items.product", "name image");

    io.emit("new_order_available", populatedOrder);
    io.emit("admin_new_order", populatedOrder);

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "customer") {
      query.customer = req.user.id;
    } else if (req.user.role === "partner") {
      //
    }

    if (req.user.role === "admin") {
      const orders = await Order.find({})
        .populate("customer", "name")
        .populate("deliveryPartner", "name")
        .sort({ createdAt: -1 });
      return res.json(orders);
    } else if (req.user.role === "customer") {
      const orders = await Order.find({ customer: req.user.id })
        .populate("items.product", "name price image")
        .sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      return res
        .status(400)
        .json({ message: "Use specific endpoints for partner" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "placed" })
      .populate("customer", "name")
      .populate("items.product", "name")
      .sort({ createdAt: 1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user.id })
      .populate("customer", "name")
      .populate("items.product", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: "placed", deliveryPartner: null },
      {
        $set: {
          status: "accepted",
          deliveryPartner: req.user.id,
        },
        $push: {
          history: { status: "accepted", updatedBy: req.user.id },
        },
      },
      { new: true }
    )
      .populate("customer", "name")
      .populate("items.product", "name");

    if (order) {
      const io = req.app.get("io");
      io.emit("order_accepted_by_partner", { orderId: order._id });
      // Notify Customer
      io.to(`order_${order._id}`).emit("order_update", order);
      // Notify Admin
      io.emit("admin_order_update", order);

      res.json(order);
    } else {
      res
        .status(400)
        .json({ message: "Order already accepted or not available" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["picked_up", "on_way", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role === "partner" &&
      order.deliveryPartner.toString() !== req.user.id
    ) {
      return res
        .status(401)
        .json({ message: "Not authorized to update this order" });
    }

    order.status = status;
    order.history.push({ status, updatedBy: req.user.id });
    await order.save();

    const io = req.app.get("io");
    io.to(`order_${order._id}`).emit("order_update", order);
    io.emit("admin_order_update", order);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("deliveryPartner", "name email")
      .populate("items.product", "name image price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      req.user.role === "customer" &&
      order.customer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (order.status !== "placed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel order that is already processed" });
    }

    await Order.findByIdAndDelete(req.params.id);
    const io = req.app.get("io");
    io.emit("order_cancelled", { orderId: order._id });
    io.emit("admin_order_update", {
      orderId: order._id,
      status: "cancelled",
    });
    res.json({ message: "Order removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
