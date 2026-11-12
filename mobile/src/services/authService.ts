import api from "./api";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";
import { clearTokens, getRefreshToken, setTokens } from "./tokenStorage";

async function saveSession(data: AuthResponse) {
  await setTokens(data.accessToken, data.refreshToken);
  return data;
}

export const register = (data: RegisterRequest) =>
  api.post<AuthResponse>("/auth/register", data).then(r => saveSession(r.data));

export const login = (data: LoginRequest) =>
  api.post<AuthResponse>("/auth/login", data).then(r => saveSession(r.data));

export const refresh = (refreshToken: string) =>
  api.post<AuthResponse>("/auth/refresh", { refreshToken }).then(r => saveSession(r.data));

export async function logout() {
  const refreshToken = await getRefreshToken();
  try {
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
  } finally {
    await clearTokens();
  }
}
