import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password`,
        { token, password }
      );
      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. Try again or request a new link."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E5E5] shadow-lg rounded-lg px-6 sm:px-8 pt-8 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#14213D] text-center">
          Set New Password
        </h2>
        {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#FCA311] text-[#14213D] py-3 rounded-md font-bold hover:bg-[#14213D] hover:text-white transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}