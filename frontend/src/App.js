import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { CartProvider } from "./context/CartContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import Orders from "./pages/Orders";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <div className="App">
              <Navbar />
              <div
                className="container"
                style={{
                  padding: "20px",
                  maxWidth: "1200px",
                  margin: "0 auto",
                }}
              >
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/customer"
                    element={
                      <ProtectedRoute allowedRoles={["customer"]}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute allowedRoles={["customer"]}>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/partner"
                    element={
                      <ProtectedRoute allowedRoles={["partner"]}>
                        <PartnerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
                <ToastContainer position="bottom-right" />
              </div>
              <CartDrawer />
            </div>
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
