"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_LOGIN_API_URL?.replace(/\/$/, ''); // Remove trailing slash

  const checkAuth = async () => {
    try {
      setLoading(true);
  
      const res = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });
  
      if (!res.ok) {
        setLoggedIn(false);
        setUser(null);
        return;
      }
  
      const data = await res.json();
  
      setLoggedIn(data.loggedIn);
      setUser(data.user || null);
    } catch (err) {
      console.error(err);
      setLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setLoggedIn(false);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, user, loading, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};