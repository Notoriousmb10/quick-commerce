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
      const { data } = await API.get("/orders");
      const sorted = data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "badge badge-success";
      case "cancelled":
        return "badge badge-danger";
      case "placed":
        return "badge badge-info";
      case "active":
        return "badge badge-success";
      default:
        return "badge badge-info";
    }
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          color: "var(--text-secondary)",
        }}
      >
        Loading orders...
      </div>
    );

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "2rem" }}>My Orders</h1>
      {orders.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--text-secondary)",
          }}
        >
          <p style={{ margin: 0, fontSize: "1.1rem" }}>
            No orders found yet. Start shopping!
          </p>
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
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
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
                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    ${order.totalAmount}
                  </p>
                  <span className={getStatusBadge(order.status)}>
                    {order.status}
                  </span>
                  {order.status === "placed" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleCancelOrder(order._id);
                      }}
                      className="btn-primary"
                      style={{
                        background: "rgba(239, 68, 68, 0.2)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        padding: "0.25rem 0.5rem",
                        fontSize: "0.75rem",
                        boxShadow: "none",
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
                    marginTop: "1.5rem",
                    borderTop: "1px solid var(--card-border)",
                    paddingTop: "1.5rem",
                  }}
                >
                  <h4
                    style={{
                      margin: "0 0 1rem 0",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Order Items
                  </h4>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.75rem",
                        paddingBottom: "0.75rem",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <span style={{ color: "var(--text-primary)" }}>
                        {item.product?.name || "Unknown Product"}{" "}
                        <span style={{ color: "var(--text-secondary)" }}>
                          x {item.quantity}
                        </span>
                      </span>
                      <span style={{ fontWeight: "500" }}>
                        ${item.product?.price * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "var(--primary-color)",
                    }}
                  >
                    <span>Total Amount</span>
                    <span>${order.totalAmount}</span>
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
