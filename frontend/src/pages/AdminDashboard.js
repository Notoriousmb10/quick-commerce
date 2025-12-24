import React, { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import SocketContext from "../context/SocketContext";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const socket = useContext(SocketContext);
  const [orders, setOrders] = useState([]);
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("admin_new_order", (order) => {
        setOrders((prev) => [order, ...prev]);
        toast.info(`New Order Placed: #${order._id.slice(-6)}`);
      });

      socket.on("admin_order_update", (updatedOrder) => {
        setOrders((prev) =>
          prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
        );
      });
      socket.on("order_cancelled", ({ orderId }) => {
        console.log("Order Cancelled", orderId);
        fetchData();
        toast.info(`Order ${orderId.slice(-6)} was cancelled`);
      });

      return () => {
        socket.off("admin_new_order");
        socket.off("admin_order_update");
        socket.off("order_cancelled");
      };
    }
  }, [socket]);

  const fetchData = async () => {
    try {
      const ordersRes = await API.get("/orders");
      const partnersRes = await API.get("/users/partners");
      setOrders(ordersRes.data);
      setPartners(partnersRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  const deletePartner = async (id) => {
    if (window.confirm("Are you sure you want to remove this partner?")) {
      try {
        await API.delete(`/users/${id}`);
        setPartners(partners.filter((p) => p._id !== id));
        toast.success("Partner removed successfully");
      } catch (error) {
        toast.error("Failed to remove partner");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "delivered":
        return "badge badge-success";
      case "cancelled":
        return "badge badge-danger";
      case "active":
        return "badge badge-success";
      case "available":
        return "badge badge-success";
      default:
        return "badge badge-info";
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <div className="card">
          <h3 className="text-secondary">Total Orders</h3>
          <p
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "0.5rem 0",
            }}
          >
            {orders.length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-secondary">Active</h3>
          <p
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "0.5rem 0",
              color: "var(--primary-color)",
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
          <h3 className="text-secondary">Delivered</h3>
          <p
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "0.5rem 0",
              color: "var(--secondary-color)",
            }}
          >
            {orders.filter((o) => o.status === "delivered").length}
          </p>
        </div>
        <div className="card">
          <h3 className="text-secondary">Revenue</h3>
          <p
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              margin: "0.5rem 0",
            }}
          >
            ${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: "1.5rem" }}>Recent Orders</h3>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Partner</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.customer?.name || "Unknown"}</td>
                  <td>{order.items.length} items</td>
                  <td>${order.totalAmount}</td>
                  <td>
                    <span className={getStatusBadge(order.status)}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.deliveryPartner?.name || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Delivery Partners Management</h3>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      fontStyle: "italic",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No active delivery partners found.
                  </td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner._id}>
                    <td>{partner.name}</td>
                    <td>{partner.email}</td>
                    <td>
                      <span className={getStatusBadge(partner.status)}>
                        {partner.status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => deletePartner(partner._id)}
                        className="btn-primary"
                        style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#f87171",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.875rem",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
