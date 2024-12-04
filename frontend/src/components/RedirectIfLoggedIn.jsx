import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useAuth();

  if (user) {
    // Redirect based on user role
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" />;
      case "SELLER":
        return <Navigate to="/seller" />;
      case "CUSTOMER":
      default:
        return <Navigate to="/customer" />;
    }
  }

  return children;
};

export default RedirectIfLoggedIn;
