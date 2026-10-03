import React, { useState } from "react";
import axios from "axios";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/request-password-reset`,
        { email }
      );
      setMessage(res.data.message || "If this email exists, a reset link will be sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E5E5] shadow-lg rounded-lg px-6 sm:px-8 pt-8 pb-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#14213D] text-center">
          Reset Password
        </h2>
        {message && <div className="mb-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#FCA311] text-[#14213D] py-3 rounded-md font-bold hover:bg-[#14213D] hover:text-white transition"
        >
          Send Reset Link
        </button>
        <div className="mt-4 text-sm text-center">
          <a href="/login" className="text-[#14213D] hover:text-[#FCA311] hover:underline">
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}