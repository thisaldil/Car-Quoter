import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../utils/api";
import { getGoogleClientId } from "../../utils/env";

const LoginGoogle = ({
  clientId = getGoogleClientId() || undefined,
  loginEndpoint = "/auth/google/token",
  registerEndpoint = "/auth/google/register",
  onSuccess,
}) => {
  const navigate = useNavigate();
  const base = API_BASE || "";

  const loginUrl = loginEndpoint.startsWith("http")
    ? loginEndpoint
    : `${base.replace(/\/$/, "")}${loginEndpoint}`;

  const registerUrl = registerEndpoint.startsWith("http")
    ? registerEndpoint
    : `${base.replace(/\/$/, "")}${registerEndpoint}`;

  const handleSuccess = async (response) => {
    try {
      // Try login
      let res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      // If user does not exist, register
      if (!res.ok && res.status === 404) {
        res = await fetch(registerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        });
      }

      const text = await res.text();
      if (!res.ok) {
        console.error("Google auth failed:", res.status, text);
        return;
      }

      const data = JSON.parse(text || "{}");

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.userId) localStorage.setItem("userId", data.userId);

      if (onSuccess) onSuccess(data);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Google Login Error:", err);
    }
  };

  if (!clientId) {
    return (
      <p className="text-sm text-red-600">
        Google sign-in is not configured.  
        Set VITE_GOOGLE_CLIENT_ID and rebuild.
      </p>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.error("Google Login Failed")}
      />
    </GoogleOAuthProvider>
  );
};

export default LoginGoogle;
