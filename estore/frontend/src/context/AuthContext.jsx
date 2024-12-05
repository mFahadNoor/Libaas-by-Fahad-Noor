import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/api";
import axios from "axios";

const AuthContext = createContext(null);
// Clear localStorage on app load to reset user data

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
     // setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      const token = userData.token;
      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"), localStorage.getItem("user"));
      // Redirect based on role
      switch (userData.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "SELLER":
          navigate("/seller");
          break;
        case "USER":
          navigate("/customer");
          break;
        default:
          navigate("/customer");
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      const token = newUser.token; // Get the token from the response
      localStorage.setItem("token", token);
      localStorage.setItem("user", newUser);
      console.log(localStorage.getItem("token"), localStorage.getItem("newUser"));
      setUser(newUser);
      // Create cart for customer
      if (newUser.role === "CUSTOMER") {
        try {
          await axios.post(
            "/api/cart", // Replace with your cart creation API endpoint
            { userId: newUser.id }, // Request body if needed
            {
              headers: {
                Authorization: `Bearer ${token}`, // Send the token as Bearer token in the Authorization header
              },
            }
          );
        } catch (error) {
          console.log("couldnt create cart: ", error);
        }
      }
      // Redirect based on role
      switch (newUser.role) {
        case "ADMIN":
          navigate("/admin");
          break;
        case "SELLER":
          navigate("/seller");
          break;
        case "CUSTOMER":
          navigate("/customer");
          break;
        default:
          navigate("/customer");
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
