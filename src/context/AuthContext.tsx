import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Role } from "@/types/models/";
import { fetchTyped, postTyped } from "@/lib/typedApiClient";

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (newAccessToken: string, newRefreshToken: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  role: Role | null;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_TOKEN = "admin_token";
const LS_REFRESH_TOKEN = "admin_refresh_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(LS_TOKEN));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem(LS_REFRESH_TOKEN));
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!token;

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
      if(err?.response?.status === 401) {
        if(refreshToken) {
          console.info('Trying to refresh token...');
          await refreshTokens();
        } else {
          logout();
        }
      }
    }
  };

  const refreshTokens = async () => {
    if (!refreshToken) return;

    try {
      const res = await postTyped<{ accessToken: string, refreshToken: string }>(token ?? '', "auth/refresh", {
        refreshToken
      });

      if (res.accessToken && res.refreshToken) {
        localStorage.setItem(LS_TOKEN, res.accessToken);
        localStorage.setItem(LS_REFRESH_TOKEN, res.refreshToken);
        setToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        refreshUser();
      } else {
        logout();
      }
    } catch (err) {
      console.error("Ошибка при обновлении токенов:", err);
      logout();
    }
  };

  const login = (newAccessToken: string, newRefreshToken: string) => {
    localStorage.setItem(LS_TOKEN, newAccessToken);
    localStorage.setItem(LS_REFRESH_TOKEN, newRefreshToken);
    setToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    refreshUser();
  };

  const logout = () => {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_REFRESH_TOKEN);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const role = user?.admin?.role ?? null;

  const hasRole = (...roles: Role[]) => {
    return roles.includes(role as Role);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, role, hasRole, login, logout, refreshUser, refreshTokens }}
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
