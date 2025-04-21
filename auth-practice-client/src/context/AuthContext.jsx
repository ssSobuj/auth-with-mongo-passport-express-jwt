"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Check if user is verified
      if (response.data.user && !response.data.user.isVerified) {
        throw new Error("Please verify your email before logging in.");
      }

      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      // Display specific error message to user
      alert(error.response?.data?.error || error.message);
    }
  };

  const register = async (email, password) => {
    try {
      const response = await axios.post(
        "/auth/register",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        // Show success message about verification email
        alert(
          "Registration successful! Please check your email to verify your account."
        );
        router.push("/login");
      }
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await axios.post("/auth/resend-verification", { email });
      if (response.status === 200) {
        alert("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      console.error("Failed to resend verification:", error);
      alert(
        error.response?.data?.error || "Failed to resend verification email"
      );
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("/auth/profile");
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        logout();
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, resendVerification, logout }}
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
