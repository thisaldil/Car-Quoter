// src/utils/api.js
// Determine backend base URL from env (Vite or CRA)
//
// For Create React App builds on Vercel, env vars must be prefixed with REACT_APP_
// and are baked in at build time.
function resolveApiBase() {
  const viteUrl =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_BACKEND_URL
      : "";
  const craUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_BASE_URL || "";
  const fromEnv = (viteUrl || craUrl || "").trim();
  if (fromEnv) return fromEnv;

  // Sensible production fallback for this repo's split client/server deployments.
  // Prefer setting REACT_APP_API_URL in the frontend Vercel project.
  if (typeof window !== "undefined") {
    const isProd = process.env.NODE_ENV === "production";
    if (isProd) return "https://car-quoter-server.vercel.app";
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
  const res = await fetch(url, { ...options, headers });
  return res;
}

export async function authFetchJSON(path, options) {
  const res = await authFetch(path, options);
  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  return text ? JSON.parse(text) : {};
}
