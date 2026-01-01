import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import {
  Search,
  Home,
  ShoppingBag,
  ShoppingCart,
  ChevronDown,
  Menu,
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount, toggleCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setFixedMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <header className="navbar">
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" className="nav-brand">
          <span style={{ color: "#ff5200" }}>ϟ</span> QuickMato
        </Link>

        {user?.role === "customer" && (
          <div className="location-selector">
            <span style={{ fontWeight: 700, color: "#1c1c1c" }}>Home</span>
            <span>B-402, Green Valley Apts...</span>
            <ChevronDown size={16} color="#ff5200" />
          </div>
        )}
      </div>

      <div className="nav-search-bar">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search for restaurants, cuisine or a dish"
          className="nav-search-input"
        />
      </div>

      <button className="hamburger" onClick={() => setFixedMenu(!isMenuOpen)}>
        <Menu />
      </button>

      <div className={`nav-items ${isMenuOpen ? "open" : ""}`}>
        {user ? (
          <>
            {user.role === "customer" ? (
              <>
                <Link to="/home" className={isActive("/home")}>
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                <Link to="/orders" className={isActive("/orders")}>
                  <ShoppingBag size={20} />
                  <span>Orders</span>
                </Link>
                <div onClick={toggleCart} className={isActive("/cart")}>
                  <div style={{ position: "relative" }}>
                    <ShoppingCart size={20} />
                    {itemCount > 0 && (
                      <span className="nav-icon-badge">{itemCount}</span>
                    )}
                  </div>
                  <span>Cart</span>
                </div>
              </>
            ) : (
              // Logic for Admin/Partner
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/partner"}
                  className="nav-link"
                >
                  Dashboard
                </Link>
              </>
            )}

            <div
              onClick={handleLogout}
              className="nav-link"
              style={{ cursor: "pointer" }}
            >
              <div className="user-avatar">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                  alt="User"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <span style={{ fontSize: "0.7rem" }}>Logout</span>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button
                className="btn-primary"
                style={{ padding: "0.5rem 1rem" }}
              >
                Login
              </button>
            </Link>
            <Link to="/register">
              <button
                className="btn-primary"
                style={{
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  color: "var(--primary)",
                  border: "1px solid var(--primary)",
                }}
              >
                Register
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
