import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/api";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there is a token in localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      // If token and user exist in localStorage, set them in state
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData); // Set the user state
      const token = userData.token;
      localStorage.setItem("token", token); // Save token to localStorage
      localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage

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
      localStorage.setItem("token", token); // Save token to localStorage
      localStorage.setItem("user", JSON.stringify(newUser)); // Save user data to localStorage

      setUser(newUser);

      // Create cart for customer if role is "CUSTOMER"
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
          console.log("Couldn't create cart: ", error);
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
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("user"); // Remove user from localStorage
    setUser(null); // Reset user state
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
