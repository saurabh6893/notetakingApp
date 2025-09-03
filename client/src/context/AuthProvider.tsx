import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setTokenState(stored);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
