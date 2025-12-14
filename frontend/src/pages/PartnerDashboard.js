import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";
import SocketContext from "../context/SocketContext";
import { toast } from "react-toastify";

const PartnerDashboard = () => {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [completedDeliveries, setCompletedDeliveries] = useState([]);
  useEffect(() => {
    fetchAvailableOrders();
    fetchMyActiveDelivery();
  }, []);

  useEffect(() => {
    if (socket) {
      console.log("Setting up socket listeners...");

      socket.on("new_order_available", (order) => {
        console.log("new order received");
        setAvailableOrders((prev) => [...prev, order]);
        toast.info("New Order Available!");
      });

      socket.on("order_cancelled", ({ orderId }) => {
        fetchAvailableOrders();
        toast.info(`Order ${orderId.slice(-6)} was cancelled`);
      });

      socket.on("order_accepted_by_partner", ({ orderId }) => {
        setAvailableOrders((prev) => prev.filter((o) => o._id !== orderId));
      });

      return () => {
        socket.off("new_order_available");
        socket.off("order_accepted_by_partner");
        socket.off("order_cancelled");
      };
    }
  }, [socket]);

  const fetchAvailableOrders = async () => {
    try {
      const { data } = await API.get("/orders/available");
      setAvailableOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyActiveDelivery = async () => {
    try {
      const { data } = await API.get("/orders/my-deliveries");

      const active = data.find(
        (o) => !["delivered", "cancelled"].includes(o.status)
      );
      const delivered = data.filter((o) => o.status === "delivered");
      if (active) setActiveDelivery(active);
      if (delivered) setCompletedDeliveries(delivered);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const { data } = await API.put(`/orders/${orderId}/accept`);
      setActiveDelivery(data);
      setAvailableOrders((prev) => prev.filter((o) => o._id !== orderId));
      toast.success("Order Accepted!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to accept order (maybe already taken)"
      );
      fetchAvailableOrders();
    }
  };

  const updateStatus = async (status) => {
    if (!activeDelivery) return;
    try {
      const { data } = await API.put(`/orders/${activeDelivery._id}/status`, {
        status,
      });
      setActiveDelivery(data);
      toast.success(`Status updated to ${status}`);
      if (status === "delivered") {
        setActiveDelivery(null);
        fetchAvailableOrders();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Delivery Partner Dashboard</h1>

      {activeDelivery ? (
        <div
          className="card"
          style={{
            border: "2px solid var(--accent-color)",
            background: "#ecfdf5",
          }}
        >
          <h2>Current Delivery</h2>
          <p>
            <strong>Order ID:</strong> {activeDelivery._id}
          </p>
          <p>
            <strong>Customer:</strong> {activeDelivery.customer?.name}
          </p>
          <p>
            <strong>Address:</strong> {activeDelivery.deliveryLocation?.address}
          </p>
          <p>
            <strong>Current Status:</strong> {activeDelivery.status}
          </p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            {activeDelivery.status === "accepted" && (
              <button
                className="btn-primary"
                onClick={() => updateStatus("picked_up")}
              >
                Mark Picked Up
              </button>
            )}
            {activeDelivery.status === "picked_up" && (
              <button
                className="btn-primary"
                onClick={() => updateStatus("on_way")}
              >
                Mark On Way
              </button>
            )}
            {activeDelivery.status === "on_way" && (
              <button
                className="btn-success"
                onClick={() => updateStatus("delivered")}
              >
                Mark Delivered
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h3>Available Orders Pool</h3>
          {availableOrders.length === 0 ? (
            <p>No orders available. Waiting...</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1rem",
              }}
            >
              {availableOrders.map((order) => (
                <div key={order._id} className="card">
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <p>Items: {order.items.length}</p>
                  <p>Total: ${order.totalAmount}</p>
                  <p>Location: {order.deliveryLocation?.address}</p>
                  <button
                    className="btn-primary"
                    onClick={() => acceptOrder(order._id)}
                  >
                    Accept Order
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: "2rem" }}>
        <h3>Delivered Orders History</h3>
        {completedDeliveries.length === 0 ? (
          <p>No delivered orders yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}
              >
                <th style={{ padding: "1rem" }}>Order ID</th>
                <th style={{ padding: "1rem" }}>Customer</th>
                <th style={{ padding: "1rem" }}>Address</th>
                <th style={{ padding: "1rem" }}>Amount</th>
                <th style={{ padding: "1rem" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {completedDeliveries.map((order) => (
                <tr
                  key={order._id}
                  style={{ borderBottom: "1px solid #f1f5f9" }}
                >
                  <td style={{ padding: "1rem" }}>#{order._id.slice(-6)}</td>
                  <td style={{ padding: "1rem" }}>{order.customer?.name}</td>
                  <td style={{ padding: "1rem" }}>
                    {order.deliveryLocation?.address}
                  </td>
                  <td style={{ padding: "1rem" }}>${order.totalAmount}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        background: "#dcfce7",
                        color: "#166534",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;
