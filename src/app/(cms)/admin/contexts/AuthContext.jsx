"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
  
      const res = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        setLoggedIn(false);
        setUser(null);
        return;
      }
  
      const data = await res.json();
      setLoggedIn(data.loggedIn || false);
      setUser(data.user || null);
      
      // Store in localStorage as backup
      if (data.loggedIn) {
        localStorage.setItem("cms_auth", JSON.stringify({ 
          loggedIn: true, 
          user: data.user,
          timestamp: Date.now() 
        }));
      } else {
        localStorage.removeItem("cms_auth");
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem("cms_auth");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing session in localStorage
    const storedAuth = localStorage.getItem("cms_auth");
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);
        const isExpired = Date.now() - auth.timestamp > 24 * 60 * 60 * 1000; // 24 hours
        if (!isExpired && auth.loggedIn) {
          setLoggedIn(true);
          setUser(auth.user);
          setLoading(false);
          return; // Skip API call if we have valid stored auth
        }
      } catch (e) {
        console.error("Error parsing stored auth:", e);
      }
    }
    
    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    setLoggedIn(false);
    setUser(null);
    localStorage.removeItem("cms_auth");
    sessionStorage.removeItem("cms_auth");
    
    // Redirect to login
    window.location.href = "/cms-login";
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
  // Return default values instead of throwing error for SSR/fallback
  if (!context) {
    console.warn("useAuth must be used within an AuthProvider - returning default values");
    return {
      loggedIn: false,
      user: null,
      loading: false,
      logout: () => {},
      checkAuth: () => {},
    };
  }
  return context;
};