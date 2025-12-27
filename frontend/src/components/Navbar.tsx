import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount, toggleCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [isMenuOpen, setFixedMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link
        to={
          user?.role === "customer"
            ? "/customer"
            : user?.role === "partner"
            ? "/partner"
            : user?.role === "admin"
            ? "/admin"
            : "/"
        }
        className="nav-brand"
      >
        QuickMato
      </Link>

      <button
        className="hamburger"
        onClick={() => setFixedMenu(!isMenuOpen)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <div className={`nav-items ${isMenuOpen ? "open" : ""}`}>
        {user ? (
          <>
            {user?.role === "customer" && (
              <div className="cart-icon-container" onClick={toggleCart}>
                <span style={{ fontSize: "1.5rem" }}>🛒</span>
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </div>
            )}

            {user?.role === "customer" && (
              <Link to="/orders" className="nav-link">
                My Orders
              </Link>
            )}

            <span className="user-greeting">
              Hello, {user.name} ({user.role})
            </span>

            <button onClick={handleLogout} className="btn-primary logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn-primary">Login</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary register-btn">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
