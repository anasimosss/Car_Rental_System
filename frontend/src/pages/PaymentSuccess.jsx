import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg p-8 text-center max-w-lg">
        <h2 className="text-2xl font-bold text-[#14213D] mb-4">Payment Successful!</h2>
        <p className="mb-4">Your booking is confirmed. Thank you for renting with us!</p>
        <button
          className="bg-[#FCA311] text-[#14213D] py-3 px-6 rounded-md font-bold hover:bg-[#14213D] hover:text-white transition"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}