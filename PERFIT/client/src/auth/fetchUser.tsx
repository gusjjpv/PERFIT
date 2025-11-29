import { refreshAccessToken } from "../auth/auth";
import { getAccessTokenInLocalStorage } from "../storage/LocalStorage";
import type { TokenUser } from "../types";

export function setupFetchInterceptor(setUser: React.Dispatch<React.SetStateAction<TokenUser | null>>
) {
  const originalFetch = window.fetch;

  let isRefreshing = false;
  let waiting: Array<(token: string) => void> = [];

  window.fetch = async (url: RequestInfo | URL, options: RequestInit = {}) => {
    const token = getAccessTokenInLocalStorage();

    options.headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    };

    const response = await originalFetch(url, options);

    if (response.status !== 401) {
      return response;
    }

    if (isRefreshing) {
      return new Promise(resolve => {
        waiting.push((newToken: string) => {
          options.headers = {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`,
          };
          resolve(originalFetch(url, options));
        });
      });
    }

    isRefreshing = true;

    const newToken = await refreshAccessToken(setUser);

    if (!newToken) {
      isRefreshing = false;
      waiting = [];
      return response; 
    }

    waiting.forEach(cb => cb(newToken));
    waiting = [];
    isRefreshing = false;

    options.headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${newToken}`,
    };

    return originalFetch(url, options);
  };
}
