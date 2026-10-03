import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCar } from "react-icons/fa";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verificationLink, setVerificationLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setIsSubmitting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        form,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setMessage(
        res.data.message ||
          "Registration successful! Please check your email to verify your account."
      );

      if (res.data.verificationLink) {
        setVerificationLink(res.data.verificationLink);
      }

      if (!res.data.verificationLink) {
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      if (!err.response) {
        setError("Network error. Please check your connection.");
      } else {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
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
              Join CarRental
            </h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Register Form */}
          <div className="bg-white border border-[#E5E5E5] shadow-lg rounded-lg px-6 sm:px-8 py-8 sm:py-10">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-[#E5E5E5] border-l-4 border-[#14213D] text-[#14213D] rounded-md">
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {message && (
                <div className="mb-6 p-4 bg-[#E5E5E5] border-l-4 border-[#FCA311] text-[#14213D] rounded-md">
                  <p className="font-semibold">Success!</p>
                  <p className="text-sm">{message}</p>
                </div>
              )}

              {verificationLink && (
                <div className="mb-6 p-4 bg-[#E5E5E5] border-l-4 border-[#FCA311] rounded-md">
                  <p className="text-sm text-gray-700 mb-3 font-semibold">
                    Verify Your Email
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const url = new URL(verificationLink);
                      const token = url.searchParams.get("token");
                      navigate(`/verify-email?token=${token}`);
                    }}
                    className="w-full bg-[#FCA311] text-[#14213D] py-2 rounded-md hover:bg-[#14213D] hover:text-white transition font-semibold"
                  >
                    Click to Verify Email
                  </button>
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    placeholder="Enter a strong password"
                    required
                    minLength="6"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    placeholder="+251 91 234 5678"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg font-bold text-white transition shadow-lg transform hover:-translate-y-0.5 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FCA311] text-[#14213D] hover:bg-[#14213D] hover:text-white"
                }`}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#14213D] hover:text-[#FCA311] font-semibold"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
