const Order = require("../models/Order");

const create = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

const findById = async (id) => {
  return await Order.findById(id);
};

const findByIdPopulated = async (id) => {
  return await Order.findById(id)
    .populate("customer", "name email")
    .populate("deliveryPartner", "name email")
    .populate("items.product", "name image price");
};

const findByCustomer = async (customerId) => {
  return await Order.find({ customer: customerId })
    .populate("items.product", "name price image")
    .sort({ createdAt: -1 });
};

const findAllAdmin = async () => {
  return await Order.find({})
    .populate("customer", "name")
    .populate("deliveryPartner", "name")
    .sort({ createdAt: -1 });
};

const findAvailableForPartners = async () => {
  return await Order.find({ status: "placed" })
    .populate("customer", "name")
    .populate("items.product", "name")
    .sort({ createdAt: 1 });
};

const findByPartner = async (partnerId) => {
  return await Order.find({ deliveryPartner: partnerId })
    .populate("customer", "name")
    .populate("items.product", "name")
    .sort({ createdAt: -1 });
};

const update = async (id, updateData) => {
  return await Order.findByIdAndUpdate(id, updateData, { new: true });
};

const updateWithPopulation = async (id, updateData, populateFields = []) => {
  let query = Order.findByIdAndUpdate(id, updateData, { new: true });
  populateFields.forEach((field) => {
    query = query.populate(field.path, field.select);
  });
  return await query;
};

const deleteById = async (id) => {
  return await Order.findByIdAndDelete(id);
};

module.exports = {
  create,
  findById,
  findByIdPopulated,
  findByCustomer,
  findAllAdmin,
  findAvailableForPartners,
  findByPartner,
  update,
  updateWithPopulation,
  deleteById,
};
