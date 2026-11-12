import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { AuthResponse } from "../types/auth";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokenStorage";

const api = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

api.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean; _retries?: number };

const MAX_RETRIES = 2;
const RETRY_STATUSES = [502, 503, 504];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function canRetry(error: AxiosError, config: RetryConfig) {
  const recoverable = error.code === "ERR_NETWORK" || RETRY_STATUSES.includes(error.response?.status ?? 0);
  return config.method === "get" && recoverable && (config._retries ?? 0) < MAX_RETRIES && !config.signal?.aborted;
}

interface QueuedRequest {
  resolve: () => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let queue: QueuedRequest[] = [];

function processQueue(error: unknown) {
  queue.forEach((request) => (error ? request.reject(error) : request.resolve()));
  queue = [];
}

async function refreshAccessToken(refreshToken: string) {
  const { data } = await axios.post<AuthResponse>(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
  await setTokens(data.accessToken, data.refreshToken);
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    if (original && canRetry(error, original)) {
      original._retries = (original._retries ?? 0) + 1;
      await wait(500 * 2 ** (original._retries - 1));
      return api(original);
    }

    if (error.response?.status !== 401 || !original || original._retry || original.url?.startsWith("/auth/")) {
      return Promise.reject(error);
    }

    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve: () => resolve(api(original)), reject });
      });
    }

    isRefreshing = true;
    try {
      await refreshAccessToken(refreshToken);
      processQueue(null);
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError);
      await clearTokens();
      onSessionExpired?.();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
