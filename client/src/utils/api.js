// src/utils/api.js
// Safe API base resolver for Vite
import { getBackendUrl } from "./env";

export const API_BASE = getBackendUrl();

export function buildUrl(path) {
  if (!path) return API_BASE;
  if (path.startsWith("http")) return path;

  const base = API_BASE.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function authFetch(path, options = {}) {
  const url = buildUrl(path);
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...options, headers });
}

export async function authFetchJSON(path, options = {}) {
  const res = await authFetch(path, options);
  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || `HTTP ${res.status}`);
  }

  return text ? JSON.parse(text) : {};
}
