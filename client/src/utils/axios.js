import axios from "axios";
import { API_BASE } from "./api";

const base = API_BASE || undefined;
const api = axios.create({ baseURL: base });
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
export default api;
