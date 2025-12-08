import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Respect Vite or CRA env vars for backend base URL if present
const API_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BACKEND_URL) || process.env.REACT_APP_API_URL || "";

const LoginForm = ({
  action = "/auth/login", // default to local API route (use full URL in prod if needed)
  onSuccess, // optional callback(userData)
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) {
      setErr("Email and password are required");
      return;
    }
    try {
      setBusy(true);
      const url = action && (action.startsWith("http") || API_BASE === "") ? action : `${API_BASE.replace(/\/$/,"")}${action}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        // fallback to text
        const txt = await res.text();
        try {
          data = JSON.parse(txt || "{}");
        } catch (_) {
          data = { message: txt };
        }
      }

      if (!res.ok) {
        const message = data?.message || data?.error || data?.msg || "Login failed";
        setErr(message);
        return;
      }
      // Adjust the keys below to your API response shape
      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.userId) localStorage.setItem("userId", data.userId);
      if (data.user && (data.user.id || data.user._id)) {
        localStorage.setItem("userId", data.user.id || data.user._id);
      }

      console.log("Login successful, token stored:", data.token);

      if (onSuccess) onSuccess(data);

      // Use React Router navigation instead of window.location.href
      navigate("/dashboard", { replace: true });
    } catch (e) {
      setErr("Network error");
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="text-left">
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          autoComplete="current-password"
        />
      </div>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default LoginForm;
