import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db";
import authRoutes from "./src/routes/authRoutes";
import productRoutes from "./src/routes/productRoutes";
import orderRoutes from "./src/routes/orderRoutes";
import userRoutes from "./src/routes/userRoutes";
import restaurantRoutes from "./src/routes/restaurantRoutes";
import cron from "node-cron";
import { updateFailedOrders } from "./src/utils/update-failed-order.cron";
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.get("/api", (req, res) => {
  res.send("Quick Commerce API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);

cron.schedule("*/5 * * * *", updateFailedOrders);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
