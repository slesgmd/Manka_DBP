import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LoginRequest, RegisterRequest, User } from "../types/auth";
import { AuthContext } from "./AuthContextObject";
import * as authService from "../services/authService";
import { setSessionExpiredHandler } from "../services/api";
import { clearTokens, getRefreshToken } from "../services/tokenStorage";
import { statusOf } from "../utils/http";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          const data = await authService.refresh(refreshToken);
          setUser(data.user);
        }
      } catch (error) {
        if (statusOf(error) === 401) {
          await clearTokens();
          setExpired(true);
        }
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setExpired(true);
    });
    return () => setSessionExpiredHandler(null);
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);
    setExpired(false);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);
    setExpired(false);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("No se pudo cerrar la sesión en el servidor", error);
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, expired, login, register, logout }),
    [user, loading, expired, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
