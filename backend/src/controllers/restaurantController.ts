import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";

export const onboardRestaurant = async (req: Request, res: Response) => {
  try {
    const {
      restaurantName,
      brandName,
      restaurantType,
      avgCost,
      cuisines,
      description,
      address,
      city,
      state,
      zip,
      ownerName,
      mobile,
      email,
      openingTime,
      closingTime,
      workingDays,
      accountNumber,
      ifscCode,
      bankName,
      accountHolderName,
    } = req.body;

    // Basic validation (can be enhanced)
    if (!restaurantName || !ownerName || !mobile || !email || !accountNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newRestaurant = new Restaurant({
      name: restaurantName,
      brandName,
      restaurantType,
      avgCost,
      cuisines, // Assuming array of strings
      description,
      address,
      city,
      state,
      zip,
      latitude: "0", // Mock for now
      longitude: "0", // Mock for now
      ownerName,
      mobileNumber: mobile,
      email,
      openingTime,
      closingTime,
      workingDays, // Assuming array of strings from frontend
      status: "pending",
      bankDetails: {
        accountNumber,
        ifscCode,
        bankName,
        accountHolderName,
      },
    });

    await newRestaurant.save();

    res.status(201).json({
      message: "Restaurant onboarding request submitted successfully",
      restaurantId: newRestaurant._id,
    });
  } catch (error) {
    console.error("Onboarding Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
