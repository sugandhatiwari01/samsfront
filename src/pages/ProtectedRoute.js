// src/pages/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("userId");
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}
