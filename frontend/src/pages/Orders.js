import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import SocketContext from "../context/SocketContext";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("order_update", (updatedOrder) => {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
        toast.info(
          `Order #${updatedOrder._id.slice(-6)} updated: ${updatedOrder.status}`
        );
      });

      return () => {
        socket.off("order_update");
      };
    }
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders"); // Endpoint returns orders for logged-in user
      // Sort by date desc
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await API.delete(`/orders/${orderId}`);
      // socket.emit("cancel_order"); // Backend now handles emission in deleteOrder controller
      toast.success("Order Cancelled");
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (error) {
      console.error("Cancel failed:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Loading orders...
      </div>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "var(--text-secondary)",
            marginTop: "2rem",
          }}
        >
          <p>No orders found.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => toggleExpand(order._id)}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    Order #{order._id.slice(-6)}
                  </p>
                  <p
                    style={{
                      margin: "0.25rem 0",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontWeight: "bold" }}>
                    ${order.totalAmount}
                  </p>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      background:
                        order.status === "delivered" ? "#d1fae5" : "#e0f2fe",
                      color:
                        order.status === "delivered" ? "#065f46" : "#0369a1",
                      marginTop: "0.25rem",
                      display: "inline-block",
                    }}
                  >
                    {order.status}
                  </span>
                  {order.status === "placed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log("Cancel clicked for:", order._id);
                        handleCancelOrder(order._id);
                      }}
                      className="btn-primary"
                      style={{
                        background: "var(--danger-color)",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.75rem",
                        marginLeft: "auto", // Align to right
                        display: "block",
                        marginTop: "0.5rem",
                        zIndex: 10, // Ensure it's on top
                        position: "relative",
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {expandedOrderId === order._id && (
                <div
                  style={{
                    marginTop: "1rem",
                    borderTop: "1px solid #f1f5f9",
                    paddingTop: "1rem",
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0" }}>Items</h4>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span>
                        {item.product?.name || "Unknown Product"} x{" "}
                        {item.quantity}
                      </span>
                      <span>${item.product?.price * item.quantity}</span>
                    </div>
                  ))}
                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    Total: ${order.totalAmount}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
