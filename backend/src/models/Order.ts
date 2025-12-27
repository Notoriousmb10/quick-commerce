import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  product: mongoose.Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrderHistory {
  status: string;
  timestamp: Date;
  updatedBy: mongoose.Schema.Types.ObjectId;
}

export interface IOrder extends Document {
  customer: mongoose.Schema.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status:
    | "placed"
    | "accepted"
    | "picked_up"
    | "on_way"
    | "delivered"
    | "cancelled";
  deliveryPartner?: mongoose.Schema.Types.ObjectId;
  deliveryLocation: {
    address: string;
  };
  history: IOrderHistory[];
  createdAt: Date;
}

const orderSchema = new Schema<IOrder>({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [
      "placed",
      "accepted",
      "picked_up",
      "on_way",
      "delivered",
      "cancelled",
    ],
    default: "placed",
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  deliveryLocation: {
    address: { type: String, required: true },
  },
  history: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
      updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IOrder>("Order", orderSchema);
