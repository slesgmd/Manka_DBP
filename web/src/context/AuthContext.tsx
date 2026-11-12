import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { LoginRequest, RegisterRequest, RoleName, User } from "../types/auth";
import { AuthContext } from "./AuthContextObject";
import * as authService from "../services/authService";
import { SESSION_EXPIRED_EVENT } from "../services/api";
import { clearTokens, getRefreshToken } from "../services/tokenStorage";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => getRefreshToken() !== null);
  const started = useRef(false);

  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (started.current || !refreshToken) return;
    started.current = true;

    authService.refresh(refreshToken)
      .then(data => setUser(data.user))
      .catch(() => clearTokens())
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const hasRole = (role: RoleName) => !!user?.roles.includes(role);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}
