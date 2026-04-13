// app/(cms)/admin/contexts/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frontbackend.amphlo.com";
      
      // First check localStorage
      const storedAuth = localStorage.getItem('cms_auth');
      if (storedAuth) {
        const auth = JSON.parse(storedAuth);
        // Check if not expired (24 hours)
        if (auth.loggedIn && auth.user && (Date.now() - auth.timestamp) < 86400000) {
          setLoggedIn(true);
          setUser(auth.user);
          setLoading(false);
          return true;
        }
      }
      
      // Check for token in localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      if (token) {
        // Try to verify token with backend
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        
        if (res.ok) {
          const userData = await res.json();
          setLoggedIn(true);
          setUser(userData);
          localStorage.setItem('cms_auth', JSON.stringify({ 
            loggedIn: true, 
            user: userData,
            timestamp: Date.now() 
          }));
          setLoading(false);
          return true;
        }
      }
      
      // No valid auth found
      setLoggedIn(false);
      setUser(null);
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      setLoggedIn(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://frontbackend.amphlo.com";
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all storage
      localStorage.removeItem('cms_auth');
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      
      // Clear cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      setLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, user, loading, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};