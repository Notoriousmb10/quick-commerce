import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/home" replace />;
  }

  const role = user.role;

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "customer") return <Navigate to="/customer" replace />;
    if (role === "partner") return <Navigate to="/partner" replace />;
    if (role === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (token && user) {
    if (user.role === "customer") return <Navigate to="/customer" replace />;
    if (user.role === "partner") return <Navigate to="/partner" replace />;
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  return children ? children : <Outlet />;
};
