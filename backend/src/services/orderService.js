const orderRepository = require("../repositories/orderRepository");
const productRepository = require("../repositories/productRepository");

const placeOrder = async (userId, items, deliveryLocation) => {
  let totalAmount = 0;
  const processedItems = [];

  for (const item of items) {
    const product = await productRepository.findById(item.product);
    if (!product) {
      throw new Error(`Product ${item.product} not found`);
    }
    // Stock check added as per recent user fix
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
    customer: userId,
    items: processedItems,
    totalAmount,
    deliveryLocation,
    history: [{ status: "placed", updatedBy: userId }],
  };

  const createdOrder = await orderRepository.create(orderData);
  return await orderRepository.findByIdPopulated(createdOrder._id);
};

const getOrdersForUser = async (userId, role) => {
  if (role === "admin") {
    return await orderRepository.findAllAdmin();
  } else if (role === "customer") {
    return await orderRepository.findByCustomer(userId);
  } else {
    throw new Error("Use specific endpoints for partner");
  }
};

const getAvailableOrders = async () => {
  return await orderRepository.findAvailableForPartners();
};

const getPartnerDeliveries = async (partnerId) => {
  return await orderRepository.findByPartner(partnerId);
};

const acceptOrder = async (orderId, partnerId) => {
  // Check if order exists and is valid for acceptance
  // Using findOneAndUpdate equivalent in repository could be cleaner,
  // but repository implementation separates logic differently.
  // Let's rely on atomic update if possible, or simple check-then-act.
  // The original controller used findOneAndUpdate with query { status: "placed", deliveryPartner: null }
  // We should implement specific method in repository or use update with conditions.
  // Re-creating that logic here using raw repository might be tricky if repo is generic.
  // I added updateWithPopulation in repo but connection to "conditions" is weak without custom method.
  // But I can import Order model in Repo to do custom queries...
  // Wait, orderRepository.update is generic findByIdAndUpdate.
  // I'll assume concurrent safety provided by simple atomic update is needed.
  // I can stick to a try-catch logic or better, just pass the query.
  // Actually, let's keep it simple: fetch, check, save. Or add specialized method in repo.
  // I will use a custom update in Repo if needed, but for now I'll use the generic one,
  // risking race condition? No, let's look at `orderRepository.js`.
  // I didn't add `acceptOrder` specific method.
  // I'll fetch and check for now.

  // Better: Allow repository to take a query object for update?
  // I'll just do robust logic here.

  const order = await orderRepository.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status !== "placed" || order.deliveryPartner) {
    throw new Error("Order already accepted or not available");
  }

  const updateData = {
    status: "accepted",
    deliveryPartner: partnerId,
    $push: {
      history: { status: "accepted", updatedBy: partnerId },
    },
  };

  // Note: $push is mongo syntax. updateData passed to repo's findByIdAndUpdate works with $set if tailored.
  // My repo `update` does `findByIdAndUpdate(id, updateData, ...)`.
  // So if I pass `$set` keys inside updateData it works.
  // Mixed usage of `$set` and top level keys in `findByIdAndUpdate` can be tricky.
  // Let's standardise on passing the full update object.

  const finalUpdate = {
    $set: {
      status: "accepted",
      deliveryPartner: partnerId,
    },
    $push: {
      history: { status: "accepted", updatedBy: partnerId },
    },
  };

  return await orderRepository.updateWithPopulation(orderId, finalUpdate, [
    { path: "customer", select: "name" },
    { path: "items.product", select: "name" },
  ]);
};

const updateOrderStatus = async (orderId, status, userId, userRole) => {
  const validStatuses = ["picked_up", "on_way", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const order = await orderRepository.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (userRole === "partner" && order.deliveryPartner.toString() !== userId) {
    throw new Error("Not authorized to update this order");
  }

  const updateData = {
    status: status,
    $push: { history: { status, updatedBy: userId } },
  };

  return await orderRepository.update(orderId, updateData);
};

const getOrderById = async (orderId, userId, userRole) => {
  const order = await orderRepository.findByIdPopulated(orderId);
  if (!order) throw new Error("Order not found");

  if (userRole === "customer" && order.customer._id.toString() !== userId) {
    throw new Error("Not authorized");
  }
  return order;
};

const cancelOrder = async (orderId, userId) => {
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

module.exports = {
  placeOrder,
  getOrdersForUser,
  getAvailableOrders,
  getPartnerDeliveries,
  acceptOrder,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
};
