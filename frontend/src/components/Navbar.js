import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount, toggleCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "var(--card-bg)",
        padding: "1rem 2rem",
        boxShadow: "var(--shadow)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to={
          user?.role === "customer"
            ? "/customer"
            : user?.role === "partner"
            ? "/partner"
            : "/"
        }
        style={{
          textDecoration: "none",
          color: "red",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Yashomato
      </Link>

      <div style={{ display: "flex", alignItems: "center" }}>
        {user
          ? user?.role === "customer" && (
              <div className="cart-icon-container" onClick={toggleCart}>
                <span style={{ fontSize: "1.5rem" }}>🛒</span>
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </div>
            )
          : null}

        {user ? (
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {user?.role === "customer" && (
              <Link
                to="/orders"
                style={{
                  textDecoration: "none",
                  color: "var(--primary-color)",
                  fontWeight: "600",
                }}
              >
                My Orders
              </Link>
            )}
            <span style={{ color: "var(--text-secondary)" }}>
              Hello, {user.name} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="btn-primary"
              style={{ background: "var(--danger-color)" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "1rem" }}>
            <Link to="/login">
              <button className="btn-primary">Login</button>
            </Link>
            <Link to="/register">
              <button
                style={{
                  background: "transparent",
                  color: "var(--primary-color)",
                  border: "1px solid var(--primary-color)",
                }}
              >
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
