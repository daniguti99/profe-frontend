import { createContext, useContext, useState, type ReactNode } from "react";
import { getCurrentUserRequest, type UserInfo } from "../services/authservice";

const TOKEN_KEY = "profe_token";
const USER_KEY = "profe_user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  getCurrentUser: () => Promise<UserInfo | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) !== null;
  });
  const [user, setUser] = useState<UserInfo | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const login = (token: string, user: UserInfo) => {
    setIsAuthenticated(true);
    setToken(token);
    setUser(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const getCurrentUser = async (): Promise<UserInfo | null> => {
    if (!token) return null;
    try {
      const userData = await getCurrentUserRequest(token);
      setUser(userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      return userData;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
