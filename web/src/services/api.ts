import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../types/auth";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokenStorage";

export const SESSION_EXPIRED_EVENT = "session-expired";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let queue: QueuedRequest[] = [];

function processQueue(error: unknown, token: string | null) {
  queue.forEach((request) => (token ? request.resolve(token) : request.reject(error)));
  queue = [];
}

async function refreshAccessToken(refreshToken: string) {
  const { data } = await axios.post<AuthResponse>(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const refreshToken = getRefreshToken();

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      original.url?.startsWith("/auth/") ||
      !refreshToken
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      const token = await refreshAccessToken(refreshToken);
      processQueue(null, token);
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
