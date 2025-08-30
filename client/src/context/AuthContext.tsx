// client/src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<{
  token: string | null;
  setToken: (token: string) => void;
}>({
  token: null,
  setToken: () => {},
});

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

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setTokenState(stored);
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
