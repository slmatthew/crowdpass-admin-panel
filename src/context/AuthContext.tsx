import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Role } from "@/types/models/";
import { fetchTyped } from "@/lib/typedApiClient";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  role: Role | null;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("admin_token")
  );
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!token;

  // Загружаем user при наличии токена
  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token]);

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await fetchTyped<User>(token, "admin/dashboard/me");
      setUser(res);
    } catch (err: any) {
      console.error("Ошибка при загрузке пользователя:", err);
      if (err?.response?.status === 401) {
        logout();
      }
    }
  };  

  const login = (newToken: string) => {
    localStorage.setItem("admin_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setUser(null);
  };

  const role = user?.admin?.role ?? null;

  const hasRole = (...roles: Role[]) => {
    return roles.includes(role as Role);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, role, hasRole, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth должен использоваться внутри <AuthProvider>");
  }
  return context;
}
