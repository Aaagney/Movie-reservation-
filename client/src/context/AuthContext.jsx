import React, { createContext, useContext, useState } from 'react';

// 💡 Exporting AuthContext so pages using useContext(AuthContext) won't fail
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);