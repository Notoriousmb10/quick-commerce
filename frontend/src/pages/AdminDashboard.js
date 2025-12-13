import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import SocketContext from "../context/SocketContext";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const socket = useContext(SocketContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("admin_new_order", (order) => {
        setOrders((prev) => [order, ...prev]);
        toast.info(`New Order Placed: #${order._id.slice(-6)}`);
      });

      socket.current.on("admin_order_update", (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
      });

      return () => {
        socket.current.off("admin_new_order");
        socket.current.off("admin_order_update");
      };
    }
  }, [socket]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard - System Overview</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card">
          <h3>Total Orders</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {orders.length}
          </p>
        </div>
        <div className="card">
          <h3>Active</h3>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--secondary-color)",
            }}
          >
            {
              orders.filter(
                (o) => !["delivered", "cancelled"].includes(o.status)
              ).length
            }
          </p>
        </div>
        <div className="card">
          <h3>Delivered</h3>
          <p
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--accent-color)",
            }}
          >
            {orders.filter((o) => o.status === "delivered").length}
          </p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
            ${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <h3>Recent Orders</h3>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "var(--shadow)",
        }}
      >
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            <th style={{ padding: "1rem", textAlign: "left" }}>ID</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Customer</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Items</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Total</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
            <th style={{ padding: "1rem", textAlign: "left" }}>Partner</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "1rem" }}>{order._id.slice(-6)}</td>
              <td style={{ padding: "1rem" }}>
                {order.customer?.name || "Unknown"}
              </td>
              <td style={{ padding: "1rem" }}>{order.items.length} items</td>
              <td style={{ padding: "1rem" }}>${order.totalAmount}</td>
              <td style={{ padding: "1rem" }}>
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    fontWeight: "bold",
                    background:
                      order.status === "delivered" ? "#d1fae5" : "#e0f2fe",
                    color: order.status === "delivered" ? "#065f46" : "#0369a1",
                  }}
                >
                  {order.status}
                </span>
              </td>
              <td style={{ padding: "1rem" }}>
                {order.deliveryPartner?.name || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
