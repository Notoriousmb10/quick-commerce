import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  brandName?: string;
  restaurantType: string;
  avgCost: string;
  cuisines: string[];
  description: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  latitude?: string;
  longitude?: string;
  ownerName: string;
  mobileNumber: string;
  email: string;
  openingTime: string;
  closingTime: string;
  workingDays: string[];
  status: "pending" | "approved" | "rejected";

  // Bank Details
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    accountHolderName: string;
  };
}

const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    brandName: { type: String }, // Optional
    restaurantType: { type: String, required: true },
    avgCost: { type: String, required: true },
    cuisines: { type: [String], required: true },
    description: { type: String, required: true },

    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    latitude: { type: String }, // Optional for now
    longitude: { type: String }, // Optional for now

    ownerName: { type: String, required: true },
    mobileNumber: { type: String, required: true }, // Changed to String for flexibility
    email: { type: String, required: true },

    openingTime: { type: String, required: true },
    closingTime: { type: String, required: true },
    workingDays: { type: [String], required: true },

    status: {
      type: String,
      default: "pending",
      enum: ["pending", "approved", "rejected"],
    },

    bankDetails: {
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: { type: String, required: true },
      accountHolderName: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
