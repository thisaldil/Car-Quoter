// src/utils/api.js
// Determine backend base URL from env (Vite or CRA)
export const API_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BACKEND_URL) || process.env.REACT_APP_API_URL || "";

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
  const res = await fetch(url, { ...options, headers });
  return res;
}

export async function authFetchJSON(path, options) {
  const res = await authFetch(path, options);
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text ? JSON.parse(text) : {};
}
