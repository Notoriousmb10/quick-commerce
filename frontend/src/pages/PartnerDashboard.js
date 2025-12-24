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

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "badge badge-success";
      case "cancelled":
        return "badge badge-danger";
      case "picked_up":
        return "badge badge-info";
      case "on_way":
        return "badge badge-warning";
      default:
        return "badge badge-info";
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Delivery Partner Dashboard</h1>

      {activeDelivery ? (
        <div
          className="card"
          style={{
            border: "1px solid var(--secondary-color)",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ margin: 0, color: "var(--secondary-color)" }}>
              Current Delivery
            </h2>
            <span className={getStatusBadge(activeDelivery.status)}>
              {activeDelivery.status}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <p className="text-secondary" style={{ margin: "0 0 0.25rem 0" }}>
                Order ID
              </p>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                #{activeDelivery._id.slice(-6)}
              </p>
            </div>
            <div>
              <p className="text-secondary" style={{ margin: "0 0 0.25rem 0" }}>
                Customer
              </p>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {activeDelivery.customer?.name}
              </p>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <p className="text-secondary" style={{ margin: "0 0 0.25rem 0" }}>
                Delivery Address
              </p>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {activeDelivery.deliveryLocation?.address}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
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
          <h3 style={{ marginBottom: "1.5rem" }}>Available Orders Pool</h3>
          {availableOrders.length === 0 ? (
            <p className="text-secondary">
              No orders available at the moment. Waiting for new orders...
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {availableOrders.map((order) => (
                <div key={order._id} className="card">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "1rem",
                    }}
                  >
                    <h4 style={{ margin: 0 }}>Order #{order._id.slice(-6)}</h4>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "var(--primary-color)",
                      }}
                    >
                      ${order.totalAmount}
                    </span>
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <p
                      className="text-secondary"
                      style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}
                    >
                      {order.items.length} items
                    </p>
                    <p style={{ fontSize: "0.9rem" }}>
                      <span className="text-secondary">To: </span>
                      {order.deliveryLocation?.address}
                    </p>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ width: "100%" }}
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
        <h3 style={{ marginBottom: "1.5rem" }}>Delivered Orders History</h3>
        <div style={{ overflowX: "auto" }}>
          {completedDeliveries.length === 0 ? (
            <p className="text-secondary">No delivered orders yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {completedDeliveries.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-6)}</td>
                    <td>{order.customer?.name}</td>
                    <td>{order.deliveryLocation?.address}</td>
                    <td>${order.totalAmount}</td>
                    <td>
                      <span className="badge badge-success">
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
    </div>
  );
};

export default PartnerDashboard;
