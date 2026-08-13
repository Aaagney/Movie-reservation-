import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("cinevault_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);

  function persistSession(token, userData) {
    localStorage.setItem("cinevault_token", token);
    localStorage.setItem("cinevault_user", JSON.stringify(userData));
    setUser(userData);
  }

  // Returns { user } on success. Throws an Error with a friendly message on failure.
  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      persistSession(data.token, data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || "Unable to sign in. Please try again.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password, role) {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });
      persistSession(data.token, data.user);
      return data.user;
    } catch (err) {
      const message = err.response?.data?.message || "Unable to create account. Please try again.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("cinevault_token");
    localStorage.removeItem("cinevault_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
