import express from "express";
import { onboardRestaurant } from "../controllers/restaurantController";

const router = express.Router();

router.post("/onboard", onboardRestaurant);

export default router;
