import { Response } from "express";
import orderService from "../services/orderService";
import { AuthRequest } from "../middleware/authMiddleware";

export const placeOrder = async (req: AuthRequest, res: Response) => {
  console.log(req.body, "data");
  const { items, deliveryLocation } = req.body;

  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const createdOrder = await orderService.placeOrder(
      (req.user as any).id,
      items,
      deliveryLocation,
      req.body.couponCode
    );

    const io = req.app.get("io");
    io.emit("new_order_available", createdOrder);
    io.emit("admin_new_order", createdOrder);

    res.status(201).json(createdOrder);
  } catch (error: any) {
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

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const orders = await orderService.getOrdersForUser(
      (req.user as any).id,
      req.user.role
    );
    return res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await orderService.getAvailableOrders();
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyDeliveries = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const orders = await orderService.getPartnerDeliveries(
      (req.user as any).id
    );
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const order = await orderService.acceptOrder(
      req.params.id,
      (req.user as any).id
    );

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
  } catch (error: any) {
    if (error.message === "Order already accepted or not available") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      (req.user as any).id,
      req.user.role
    );

    if (!order) {
      // Should be caught by service error but safe check
      throw new Error("Order not found");
    }

    const io = req.app.get("io");
    io.to(`order_${order._id}`).emit("order_update", order);
    io.emit("admin_order_update", order);

    res.json(order);
  } catch (error: any) {
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

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const order = await orderService.getOrderById(
      req.params.id,
      (req.user as any).id,
      req.user.role
    );
    res.json(order);
  } catch (error: any) {
    if (error.message === "Order not found") {
      res.status(404).json({ message: error.message });
    } else if (error.message === "Not authorized") {
      res.status(403).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    await orderService.cancelOrder(req.params.id, (req.user as any).id);
    const io = req.app.get("io");
    io.emit("order_cancelled", { orderId: req.params.id });
    io.emit("admin_order_update", {
      orderId: req.params.id,
      status: "cancelled",
    });
    res.json({ message: "Order removed" });
  } catch (error: any) {
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
