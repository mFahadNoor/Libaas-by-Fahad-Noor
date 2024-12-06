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
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const userData = await authService.login(credentials);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

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

  const googleLogin = async (credential) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token: credential,
        }
      );
      const userData = response.data;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

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
        error: error.response?.data?.message || "Google login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const newUser = await authService.register(userData);
      const token = newUser.token;
      localStorage.setItem("token", token);
      setUser(newUser);

      if (newUser.role === "CUSTOMER") {
        try {
          await axios.post(
            "/api/cart",
            { userId: newUser.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.log("couldnt create cart: ", error);
        }
      }

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
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, googleLogin }}
    >
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
