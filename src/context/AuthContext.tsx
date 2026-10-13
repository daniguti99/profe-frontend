import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { getCurrentUserRequest, type UserInfo } from "../services/authservice";
import { SESSION_EXPIRED_EVENT } from "../services/http";
import { getTokenExpiryMs } from "../utils/jwt";

const TOKEN_KEY = "profe_token";
const USER_KEY = "profe_user";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setLoading(false);
  }, []);

  // Validación de la sesión al montar y cierre automático al caducar el token.
  // Un solo efecto cubre ambos casos: si el token ya está caducado no hace
  // falta llamar a /me, y si caduca mientras el usuario está inactivo, el
  // temporizador lo cierra en el instante exacto de la caducidad.
  useEffect(() => {
    let ignored = false;
    let timer: number | undefined;

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    // Constante local: así TypeScript mantiene el tipo `string` dentro del
    // closure asíncrono de validación.
    const sessionToken = token;

    const expiry = getTokenExpiryMs(sessionToken);

    // Token ya caducado: se cierra al instante sin consumir la petición
    if (expiry !== null && expiry <= Date.now()) {
      logout();
      return;
    }

    async function validateSession() {
      try {
        const userData = await getCurrentUserRequest(sessionToken);
        if (!ignored) {
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
        }
      } catch {
        if (!ignored) logout();
      }
    }
    validateSession();

    // Cierre exacto en el instante de caducidad, aunque no haya actividad
    if (expiry !== null) {
      timer = window.setTimeout(() => {
        if (!ignored) logout();
      }, expiry - Date.now());
    }

    return () => {
      ignored = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [token, logout]);

  // Cierre de sesión global: cualquier servicio que reciba 401/403 lo lanza
  useEffect(() => {
    const onSessionExpired = () => logout();
    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  }, [logout]);

  const login = (token: string, user: UserInfo) => {
    setIsAuthenticated(true);
    setToken(token);
    setUser(user);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    setLoading(false);
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
    <AuthContext.Provider value={{ isAuthenticated, user, token, loading, login, logout, getCurrentUser }}>
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
