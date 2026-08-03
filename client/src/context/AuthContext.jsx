import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cinevault_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('cinevault_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('cinevault_user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
