import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('maxret_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (_) {}
    setLoading(false);
  }, []);

  const login = (userData) => {
    const session = { ...userData, loggedInAt: new Date().toISOString() };
    localStorage.setItem('maxret_user', JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem('maxret_user');
    setUser(null);
  };

  const updatePortfolio = (analysisResult) => {
    if (!user) return;
    const existing = JSON.parse(localStorage.getItem('maxret_portfolio') || '[]');
    const entry = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...analysisResult,
    };
    const updated = [entry, ...existing].slice(0, 10); // keep last 10
    localStorage.setItem('maxret_portfolio', JSON.stringify(updated));
    return entry;
  };

  const getPortfolio = () => {
    try {
      return JSON.parse(localStorage.getItem('maxret_portfolio') || '[]');
    } catch (_) { return []; }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updatePortfolio, getPortfolio }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);