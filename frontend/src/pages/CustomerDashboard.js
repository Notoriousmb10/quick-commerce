import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";
import CartContext from "../context/CartContext";
import { toast } from "react-toastify";

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
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
    const handleOrderPlaced = (e) => {
      setActiveOrder(e.detail);
    };
    window.addEventListener("orderPlaced", handleOrderPlaced);
    return () => window.removeEventListener("orderPlaced", handleOrderPlaced);
  }, []);

  useEffect(() => {
    if (socket.current && activeOrder) {
      socket.current.emit("join_room", `order_${activeOrder._id}`);

      socket.current.on("order_update", (updatedOrder) => {
        setActiveOrder(updatedOrder);
        toast.info(`Order Status Updated: ${updatedOrder.status}`);
      });

      return () => {
        socket.current.off("order_update");
      };
    }
  }, [socket, activeOrder]);

  const fetchActiveOrder = async () => {
    try {
      const { data } = await API.get("/orders");
      const active = data.find(
        (o) => !["delivered", "cancelled"].includes(o.status)
      );
      if (active) setActiveOrder(active);
    } catch (error) {
      console.error(error);
    }
  };

  const getProductsByCategory = (category) => {
    return products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  };

  const categories = ["Snacks", "Lunchbox", "Beverages"];

  return (
    <div>
      <h1>Customer Dashboard</h1>
      {activeOrder && (
        <div
          className="card"
          style={{
            border: "2px solid var(--secondary-color)",
            marginBottom: "2rem",
          }}
        >
          <h2>Live Order Tracking</h2>
          <p>
            <strong>Order ID:</strong> {activeOrder._id}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: "var(--secondary-color)",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {activeOrder.status}
            </span>
          </p>
          <p>
            List all your Orders at{" "}
            <a style={{ color: "var(--primary-color)" }} href="/orders">
              Orders
            </a>
          </p>
          {activeOrder.deliveryPartner && (
            <p>
              <strong>Delivery Partner:</strong>{" "}
              {activeOrder.deliveryPartner.name} (On the way)
            </p>
          )}
        </div>
      )}

      <div>
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={category} className="category-section">
              <div className="category-title">
                <span>
                  {category === "Snacks" && "🍿"}
                  {category === "Lunchbox" && "🍱"}
                  {category === "Beverages" && "🥤"}
                </span>
                {category}
              </div>
              <div className="product-grid">
                {categoryProducts.map((p) => (
                  <div key={p._id} className="product-card">
                    <img src={p.image} alt={p.name} className="product-image" />
                    <div className="product-details">
                      <h4 className="product-name">{p.name}</h4>
                      <div className="product-desc">{p.description}</div>
                      <div className="product-price">${p.price}</div>
                      <button className="add-btn" onClick={() => addToCart(p)}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDashboard;
