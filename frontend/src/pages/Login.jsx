import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaEnvelope, FaLock, FaCar } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store the user data in local storage if needed
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", email);
      }

      // Redirect to dashboard or home page
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response || err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials and try again.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-4">
        <div className="max-w-md w-full">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex bg-[#FCA311] p-4 rounded-lg mb-4">
              <FaCar className="text-4xl text-[#14213D]" />
            </div>
            <h2 className="text-3xl font-bold text-[#14213D] mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">Login to access your account</p>
          </div>

          {/* Login Form */}
          <div className="bg-white border border-[#E5E5E5] shadow-lg rounded-lg px-6 sm:px-8 py-8 sm:py-10">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-[#E5E5E5] border-l-4 border-[#FCA311] text-[#14213D] rounded-md">
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FCA311] text-[#14213D] py-3 rounded-md font-bold hover:bg-[#14213D] hover:text-white transition shadow-md"
              >
                Login to Account
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#14213D] hover:text-[#FCA311] font-semibold"
                >
                  Sign Up
                </Link>
              </p>
              <Link
                to="/reset-password"
                className="block text-sm text-[#14213D] hover:text-[#FCA311]"
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
