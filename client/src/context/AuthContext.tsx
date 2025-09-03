import { createContext } from "react";

export const AuthContext = createContext<{
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}>({
  token: null,
  setToken: () => {},
  logout: () => {},
});
