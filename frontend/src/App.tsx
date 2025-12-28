import React, { useContext } from "react";
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
import { ProtectedRoute, PublicRoute } from "./components/RouteGuards";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import LandingPage from "./pages/HomePage";
import Orders from "./pages/Orders";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";

import { Outlet } from "react-router-dom";
import PartnerOnboarding from "./pages/PartnerOnboarding";

// Layout component for the main application
const MainLayout = () => {
  return (
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
        <Outlet />
      </div>
      <CartDrawer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <Routes>
              {/* Partner Onboarding Route - Full Page Layout */}
              <Route
                path="/partner/onboarding"
                element={<PartnerOnboarding />}
              />

              {/* Main Application Routes */}
              <Route element={<MainLayout />}>
                <Route
                  path="/home"
                  element={
                    <PublicRoute>
                      <LandingPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
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

                <Route path="/" element={<Navigate to="/home" replace />} />
              </Route>
            </Routes>

            <ToastContainer position="bottom-right" />
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
