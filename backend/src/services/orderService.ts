import orderRepository from "../repositories/orderRepository";
import productRepository from "../repositories/productRepository";
import { PlaceOrderItemDto } from "../dtos/order.dto";
import { IOrder } from "../models/Order";

const placeOrder = async (
  userId: string,
  items: PlaceOrderItemDto[],
  deliveryLocation: { address: string }
): Promise<IOrder | null> => {
  let totalAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await productRepository.findById(item.product);
    if (!product) {
      throw new Error(`Product ${item.product} not found`);
    }
    // Stock check
    if (product.stock < item.quantity) {
      throw new Error("Insufficient stock");
    }

    product.stock -= item.quantity;
    await productRepository.save(product);

    totalAmount += product.price * item.quantity;
    processedItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const orderData = {
    customer: userId as any,
    items: processedItems,
    totalAmount,
    deliveryLocation,
    history: [{ status: "placed", updatedBy: userId as any }],
  };

  const createdOrder = await orderRepository.create(orderData as any);
  return await orderRepository.findByIdPopulated(
    (createdOrder._id as any).toString()
  );
};

const getOrdersForUser = async (
  userId: string,
  role: string
): Promise<IOrder[]> => {
  if (role === "admin") {
    return await orderRepository.findAllAdmin();
  } else if (role === "customer") {
    return await orderRepository.findByCustomer(userId);
  } else {
    throw new Error("Use specific endpoints for partner");
  }
};

const getAvailableOrders = async (): Promise<IOrder[]> => {
  return await orderRepository.findAvailableForPartners();
};

const getPartnerDeliveries = async (partnerId: string): Promise<IOrder[]> => {
  return await orderRepository.findByPartner(partnerId);
};

const acceptOrder = async (
  orderId: string,
  partnerId: string
): Promise<IOrder | null> => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new Error("Order not found");
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

  return await orderRepository.updateWithPopulation(
    orderId,
    finalUpdate as any,
    [
      { path: "customer", select: "name" },
      { path: "items.product", select: "name" },
    ]
  );
};

const updateOrderStatus = async (
  orderId: string,
  status: string,
  userId: string,
  userRole: string
): Promise<IOrder | null> => {
  const validStatuses = ["picked_up", "on_way", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (
    userRole === "partner" &&
    order.deliveryPartner &&
    order.deliveryPartner.toString() !== userId
  ) {
    throw new Error("Not authorized to update this order");
  }

  const updateData = {
    status: status,
    $push: { history: { status, updatedBy: userId } },
  };

  return await orderRepository.update(orderId, updateData as any);
};

const getOrderById = async (
  orderId: string,
  userId: string,
  userRole: string
): Promise<IOrder | null> => {
  const order = await orderRepository.findByIdPopulated(orderId);
  if (!order) throw new Error("Order not found");

  if (
    userRole === "customer" &&
    order.customer &&
    (order.customer as any)._id.toString() !== userId
  ) {
    // Note: customer might be populated or ObjectId. If populated, ._id. If not, .toString() works on ObjectId.
    // Since findByIdPopulated is used, customer is populated object.
    throw new Error("Not authorized");
  }
  return order;
};

const cancelOrder = async (
  orderId: string,
  userId: string
): Promise<IOrder | null> => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new Error("Order not found");

  if (order.customer.toString() !== userId) {
    throw new Error("Not authorized");
  }

  if (order.status !== "placed") {
    throw new Error("Cannot cancel order that is already processed");
  }

  return await orderRepository.deleteById(orderId);
};

export default {
  placeOrder,
  getOrdersForUser,
  getAvailableOrders,
  getPartnerDeliveries,
  acceptOrder,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
};
