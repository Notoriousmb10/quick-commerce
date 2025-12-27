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
    <div style={{ padding: "1rem", maxWidth: "1600px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "2rem",
              background: "linear-gradient(to right, #fff, #94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Dashboard
          </h1>
          <p className="text-secondary" style={{ marginTop: "0.5rem" }}>
            Overview of store performance and management
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={fetchData}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <span>↻</span> Refresh Data
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "rgba(59, 130, 246, 0.1)",
              fontSize: "2rem",
            }}
          >
            📦
          </div>
          <div>
            <h3
              className="text-secondary"
              style={{
                margin: 0,
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Total Orders
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0.25rem 0 0 0",
                color: "var(--text-primary)",
              }}
            >
              {orders.length}
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "rgba(16, 185, 129, 0.1)",
              fontSize: "2rem",
            }}
          >
            🔥
          </div>
          <div>
            <h3
              className="text-secondary"
              style={{
                margin: 0,
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Active Orders
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0.25rem 0 0 0",
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
        </div>

        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "rgba(244, 63, 94, 0.1)",
              fontSize: "2rem",
            }}
          >
            🚚
          </div>
          <div>
            <h3
              className="text-secondary"
              style={{
                margin: 0,
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Delivered
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0.25rem 0 0 0",
                color: "#f43f5e",
              }}
            >
              {orders.filter((o) => o.status === "delivered").length}
            </p>
          </div>
        </div>

        <div
          className="card"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
        >
          <div
            style={{
              padding: "1rem",
              borderRadius: "12px",
              background: "rgba(234, 179, 8, 0.1)",
              fontSize: "2rem",
            }}
          >
            💰
          </div>
          <div>
            <h3
              className="text-secondary"
              style={{
                margin: 0,
                fontSize: "0.875rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Revenue
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                margin: "0.25rem 0 0 0",
                color: "#eab308",
              }}
            >
              ${orders.reduce((acc, o) => acc + o.totalAmount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          gap: "1.5rem",
          alignItems: "start",
        }}
      >
        {/* Recent Orders Section */}
        <div className="card" style={{ padding: "0" }}>
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--card-border)",
            }}
          >
            <h3 style={{ margin: 0 }}>Recent Orders</h3>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.5rem" }}>ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Partner</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        fontStyle: "italic",
                        color: "var(--text-secondary)",
                      }}
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 10).map((order) => (
                    <tr key={order._id}>
                      <td
                        style={{
                          paddingLeft: "1.5rem",
                          fontFamily: "monospace",
                          color: "var(--primary-color)",
                        }}
                      >
                        #{order._id.slice(-6)}
                      </td>
                      <td>
                        <div style={{ fontWeight: "500" }}>
                          {order.customer?.name || "Unknown"}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {order.customer?.email}
                        </div>
                      </td>
                      <td>{order.items.length} items</td>
                      <td style={{ fontWeight: "bold" }}>
                        ${order.totalAmount}
                      </td>
                      <td>
                        <span className={getStatusBadge(order.status)}>
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td
                        style={{
                          color: order.deliveryPartner
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                          fontStyle: order.deliveryPartner
                            ? "normal"
                            : "italic",
                        }}
                      >
                        {order.deliveryPartner?.name || "Unassigned"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid var(--card-border)",
              textAlign: "center",
            }}
          >
            <button
              style={{
                background: "transparent",
                color: "var(--primary-color)",
                fontSize: "0.875rem",
              }}
            >
              View All Orders &rarr;
            </button>
          </div>
        </div>

        {/* Delivery Partners Section */}
        <div className="card" style={{ padding: "0" }}>
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid var(--card-border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Delivery Partners</h3>
            <span className="badge badge-info">{partners.length} Active</span>
          </div>
          <div style={{ overflowX: "auto", maxHeight: "600px" }}>
            <table style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ paddingLeft: "1.5rem" }}>Partner</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {partners.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        fontStyle: "italic",
                        color: "var(--text-secondary)",
                      }}
                    >
                      No active partners.
                    </td>
                  </tr>
                ) : (
                  partners.map((partner) => (
                    <tr key={partner._id}>
                      <td style={{ paddingLeft: "1.5rem" }}>
                        <div style={{ fontWeight: "500" }}>{partner.name}</div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {partner.email}
                        </div>
                      </td>
                      <td>
                        <span
                          className={getStatusBadge(
                            partner.status || "available"
                          )}
                        >
                          {partner.status || "available"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => deletePartner(partner._id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#f87171",
                            padding: "0.4rem",
                            borderRadius: "8px",
                            transition: "all 0.2s",
                          }}
                          title="Remove Partner"
                        >
                          ✕
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
    </div>
  );
};

export default AdminDashboard;
