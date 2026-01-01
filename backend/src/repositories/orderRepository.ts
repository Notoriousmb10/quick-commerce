import Order, { IOrder } from "../models/Order";
import { UpdateQuery } from "mongoose";

const create = async (orderData: Partial<IOrder>): Promise<IOrder> => {
  const order = new Order(orderData);
  return await order.save();
};

const findById = async (id: string): Promise<IOrder | null> => {
  return await Order.findById(id);
};

const findByIdPopulated = async (id: string): Promise<IOrder | null> => {
  return await Order.findById(id)
    .populate("customer", "name email")
    .populate("deliveryPartner", "name email")
    .populate("items.product", "name image price");
};

const findByCustomer = async (customerId: string): Promise<IOrder[]> => {
  return await Order.find({ customer: customerId as any })
    .populate("items.product", "name price image")
    .sort({ createdAt: -1 } as any);
};

const findAllAdmin = async (): Promise<IOrder[]> => {
  return await Order.find({})
    .populate("customer", "name")
    .populate("deliveryPartner", "name")
    .sort({ createdAt: -1 });
};

const findAvailableForPartners = async (): Promise<IOrder[]> => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  return await Order.find({
    status: "placed",
    createdAt: {
      $gte: oneHourAgo,
      $lte: now,
    },
  })
    .populate("customer", "name")
    .populate("items.product", "name")
    .sort({ createdAt: 1 });
};

const findByPartner = async (partnerId: string): Promise<IOrder[]> => {
  return await Order.find({ deliveryPartner: partnerId as any })
    .populate("customer", "name")
    .populate("items.product", "name")
    .sort({ createdAt: -1 });
};

const update = async (
  id: string,
  updateData: UpdateQuery<IOrder>
): Promise<IOrder | null> => {
  return await Order.findByIdAndUpdate(id, updateData, { new: true });
};

const updateWithPopulation = async (
  id: string,
  updateData: UpdateQuery<IOrder>,
  populateFields: { path: string; select?: string }[] = []
): Promise<IOrder | null> => {
  let query = Order.findByIdAndUpdate(id, updateData, { new: true });
  populateFields.forEach((field) => {
    query = query.populate(field.path, field.select);
  });
  return await query;
};

const deleteById = async (id: string): Promise<IOrder | null> => {
  return await Order.findByIdAndDelete(id);
};

export default {
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
