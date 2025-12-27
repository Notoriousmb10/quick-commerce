import { Request, Response } from "express";
import authService from "../services/authService";
import { AuthRequest } from "../middleware/authMiddleware";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(
      req.body,
      req.ip || "",
      req.get("User-Agent") || ""
    );
    res.status(201).json(user);
  } catch (error: any) {
    if (error.message === "User already exists") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await authService.login(
      email,
      password,
      req.ip || "",
      req.get("User-Agent") || ""
    );
    res.json(user);
  } catch (error: any) {
    if (error.message === "Invalid email or password") {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }
    const user = await authService.getUserProfile((req.user as any).id);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
