// src/api/apiClient.ts
import { getAccessToken } from "../utils/storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

function getFullUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(
  method: string,
  url: string,
  body?: any,
  requireAuth: boolean = true
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(requireAuth ? await getAuthHeaders() : {}),
  };

  const res = await fetch(getFullUrl(url), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "API request failed");
  return data;
}

export const apiClient = {
  get: (url: string, requireAuth: boolean = true) =>
    request("GET", url, undefined, requireAuth),
  post: (url: string, body?: any, requireAuth: boolean = true) =>
    request("POST", url, body, requireAuth),
  put: (url: string, body?: any, requireAuth: boolean = true) =>
    request("PUT", url, body, requireAuth),
  patch: (url: string, body?: any, requireAuth: boolean = true) =>
    request("PATCH", url, body, requireAuth),
  delete: (url: string, requireAuth: boolean = true) =>
    request("DELETE", url, undefined, requireAuth),
};
