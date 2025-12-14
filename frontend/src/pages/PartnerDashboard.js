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

  // Socket Listeners
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

      // Order accepted by someone (remove from list)
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
      // Find one that is active
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
      fetchAvailableOrders(); // Refresh to sync
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
        fetchAvailableOrders(); // Go back to pool
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
    </div>
  );
};

export default PartnerDashboard;
