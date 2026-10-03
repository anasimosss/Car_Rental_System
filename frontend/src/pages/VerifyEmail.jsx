import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    
    const verify = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`
        );
        setMessage(res.data.message || "Email verified successfully! You can now log in.");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Verification failed. The link may have expired or is invalid. Please try again or contact support."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verify();
    } else {
      setError("Invalid verification link. Please use the link sent to your email.");
      setIsLoading(false);
    }
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="bg-white border border-[#E5E5E5] shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCA311] mb-4"></div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Verifying Your Email</h2>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-white border border-[#E5E5E5] shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {message ? "Email Verified!" : "Verification Failed"}
          </h2>
          <div className="w-16 h-1 bg-[#FCA311] mx-auto my-4"></div>
        </div>
        
        {message && (
          <div className="mb-6">
            <div className="w-16 h-16 bg-[#E5E5E5] rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-[#14213D]"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <p className="text-gray-700 mb-6">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        )}
        
        {error && (
          <div className="mb-6">
            <div className="w-16 h-16 bg-[#E5E5E5] rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-[#14213D]"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </div>
            <p className="text-gray-700 mb-6">{error}</p>
            <a
              href="/register"
              className="inline-block px-6 py-2 bg-[#FCA311] text-[#14213D] rounded-md hover:bg-[#14213D] hover:text-white transition-colors text-sm font-semibold"
            >
              Back to Registration
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;