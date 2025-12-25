// src/utils/api.js
// Safe API base resolver for Vite + CRA + Vercel

function resolveApiBase() {
  // Vite
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const viteUrl = import.meta.env.VITE_BACKEND_URL;
    if (viteUrl) return viteUrl.trim();
  }

  // CRA fallback
  if (typeof process !== "undefined") {
    const craUrl =
      process.env.REACT_APP_API_URL ||
      process.env.REACT_APP_API_BASE_URL;
    if (craUrl) return craUrl.trim();
  }

  // Production fallback (last resort)
  if (typeof window !== "undefined") {
    return "https://car-quoter-server.vercel.app";
  }

  return "";
}

export const API_BASE = resolveApiBase();

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
