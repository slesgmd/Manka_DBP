const REFRESH_TOKEN_KEY = "manka_refresh_token";

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const getRefreshToken = () => sessionStorage.getItem(REFRESH_TOKEN_KEY);

export function setTokens(newAccessToken: string, newRefreshToken: string) {
  accessToken = newAccessToken;
  sessionStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
}

export function clearTokens() {
  accessToken = null;
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}
