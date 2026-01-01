import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";
import CartContext from "../context/CartContext";
import { toast } from "react-toastify";
import "./Dashboard.css"; // Import the styles

import OffersSection from "../components/Dashboard/OffersSection";
import CategorySection from "../components/Dashboard/CategorySection";
import RestaurantList from "../components/Dashboard/RestaurantList";

const CustomerDashboard = () => {
  const socket = useContext(SocketContext);
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
    fetchActiveOrder();
  }, []);

  useEffect(() => {
    const handleOrderPlaced = (e: any) => {
      setActiveOrder(e.detail);
      toast.success("Order Placed Successfully!");
    };
    window.addEventListener("orderPlaced", handleOrderPlaced);
    return () => window.removeEventListener("orderPlaced", handleOrderPlaced);
  }, []);

  useEffect(() => {
    if (socket && activeOrder) {
      // @ts-ignore
      socket.emit("join_room", `order_${activeOrder._id}`);

      // @ts-ignore
      socket.on("order_update", (updatedOrder) => {
        setActiveOrder(updatedOrder);
        toast.info(`Order Status Updated: ${updatedOrder.status}`);
      });

      return () => {
        socket.off("order_update");
      };
    }
  }, [socket, activeOrder]);

  const fetchActiveOrder = async () => {
    try {
      const { data } = await API.get("/orders");
      const active = data.find(
        (o: any) => !["delivered", "cancelled"].includes(o.status)
      );
      if (active) setActiveOrder(active);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-container">
      <OffersSection />

      <CategorySection />

      <RestaurantList products={products} addToCart={addToCart} />

      {activeOrder && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#333",
            color: "white",
            padding: "1rem 2rem",
            borderRadius: "50px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <span>
            Live Order: <strong>{activeOrder.status}</strong>
          </span>
          {/* @ts-ignore */}
          <a
            href="/orders"
            style={{
              color: "#ff5200",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Track
          </a>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setActiveOrder(null)}
          >
            x
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
