import { Request, Response } from "express";
import userService from "../services/userService";

export const getPartners = async (req: Request, res: Response) => {
  try {
    const partners = await userService.getPartners();
    res.json(partners);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User removed" });
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  }
};
