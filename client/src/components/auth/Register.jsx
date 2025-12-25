import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import bg from "../../images/bg.png";
import toast from "react-hot-toast";
import { API_BASE } from "../../utils/api";
import { getGoogleClientId } from "../../utils/env";

const Register = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busyLocal, setBusyLocal] = useState(false);
  const [errLocal, setErrLocal] = useState("");

  const GOOGLE_CLIENT_ID = getGoogleClientId();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSuccess = async (response) => {
    try {
      const endpoint = "/auth/google/register";
      const url = endpoint && (endpoint.startsWith("http") || API_BASE === "") ? endpoint : `${API_BASE.replace(/\/$/,"")}${endpoint}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // do not send credentials by default; token-based flow uses JSON response
        body: JSON.stringify({ token: response.credential }),
      });

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        if (res.status === 409) {
          toast.error("User already exists. Try logging in.");
        } else {
          toast.error(msg.message || "Registration failed. Please try again.");
        }
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || data?.error || "Registration failed";
        toast.error(msg);
        return;
      }

      if (data.token) localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      if (data.userId) localStorage.setItem("userId", data.userId);

      toast.success("Registration successful! Welcome to Car Invoicing Pro!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Registration Error:", error);
      // More specific error handling
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error(
          "Connection error. Please check your internet and try again."
        );
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleError = (error) => {
    console.error("Google OAuth Error:", error);
    toast.error("Google authentication failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative flex h-screen w-full overflow-hidden bg-gray-100"
      >
        <div className="hidden md:block absolute left-0 top-0 h-full w-1/2 text-white z-0">
          <div className="flex flex-col justify-center items-center h-full px-12">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              src="/carquoterlogo.png"
              alt="Logo"
              className="w-72 mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl leading-relaxed font-medium text-center max-w-lg text-gray-700"
            >
              Join CAR QUOTER to manage your invoices with ease. Automate,
              track, and send invoices effortlessly.
            </motion.p>
          </div>
        </div>

        <div className="w-full md:w-1/2 z-10 flex justify-center items-center ml-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-10 rounded-lg shadow-xl text-center w-full max-w-sm"
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Register</h1>
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="outline"
              size="large"
              text="signup_with"
            />
            
              <div className="my-6 border-t pt-6">
                <h2 className="text-lg font-medium mb-3">Or create account with email</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setErrLocal("");
                    if (!name || !email || !password) {
                      setErrLocal("Name, email and password are required");
                      return;
                    }
                    if (password.length < 6) {
                      setErrLocal("Password must be at least 6 characters");
                      return;
                    }
                    if (password !== confirmPassword) {
                      setErrLocal("Passwords do not match");
                      return;
                    }
                    try {
                      setBusyLocal(true);
                      const endpoint = "/auth/register";
                      const url = endpoint && (endpoint.startsWith("http") || API_BASE === "") ? endpoint : `${API_BASE.replace(/\/$/,"")}${endpoint}`;
                      const res = await fetch(url, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, email, password }),
                      });
                      let data = {};
                      try {
                        data = await res.json();
                      } catch (_) {
                        const txt = await res.text().catch(() => "");
                        data = { message: txt };
                      }
                      if (!res.ok) {
                        const msg = data?.message || data?.error || "Registration failed";
                        setErrLocal(msg);
                        setBusyLocal(false);
                        return;
                      }

                      if (data.token) localStorage.setItem("token", data.token);
                      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
                      if (data.userId) localStorage.setItem("userId", data.userId);

                      toast.success("Registration successful! Redirecting...");
                      navigate("/dashboard", { replace: true });
                    } catch (err) {
                      console.error("Register error:", err);
                      setErrLocal("Network error");
                    } finally {
                      setBusyLocal(false);
                    }
                  }}
                  className="text-left space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Choose a password"
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                  </div>
                  {errLocal ? <p className="text-sm text-red-600">{errLocal}</p> : null}
                  <button
                    type="submit"
                    disabled={busyLocal}
                    className="w-full rounded-md bg-orange-600 px-4 py-2 text-white font-medium hover:bg-orange-700"
                  >
                    {busyLocal ? "Creating account..." : "Create account"}
                  </button>
                </form>
              </div>
            <div className="mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-500 hover:underline">
                Login here
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
