import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function BookingPayment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const paymentMethod = location.state?.paymentMethod || "Stripe";

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const bookingData = res.data;

      // Check if booking is approved
      if (bookingData.verificationStatus !== "Approved") {
        setError(
          "This booking has not been approved yet. Please wait for admin approval."
        );
        setLoading(false);
        return;
      }

      // Check if already paid
      if (bookingData.paymentStatus === "Paid") {
        setError("This booking has already been paid.");
        setLoading(false);
        return;
      }

      setBooking(bookingData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking:", err);
      setError("Failed to load booking details.");
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (paymentMethod === "Stripe") {
        // Stripe payment - redirect to Stripe checkout
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/payments/stripe-session`,
          { bookingId },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        window.location.href = res.data.url;
      } else {
        // Ethiopian payment methods (Telebirr, CBE Birr, E-Birr)
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/payments/ethiopian-payment`,
          {
            bookingId,
            paymentMethod,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setSuccess(
          `Payment initiated with ${paymentMethod}. Reference: ${res.data.paymentReference}`
        );

        // Show payment instructions
        alert(`Payment Instructions for ${paymentMethod}:

Amount: $${booking.totalPrice}
Reference: ${res.data.paymentReference}

Please complete the payment and keep your reference number.`);

        setTimeout(() => navigate("/my-bookings"), 3000);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message || "Payment failed. Please try again."
      );
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-3">Loading payment details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg border border-[#E5E5E5] shadow-md text-center max-w-md">
          <div className="text-[#FCA311] text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-4">Payment Initiated</h2>
          <p className="text-gray-600 mb-4">{success}</p>
          <p className="text-sm text-gray-500">
            Redirecting to your bookings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-md p-5 sm:p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Complete Payment
          </h2>

          {/* Booking Summary */}
          <div className="bg-[#E5E5E5] rounded-md p-4 sm:p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicle:</span>
                <span className="font-semibold">
                  {booking.vehicleId?.make} {booking.vehicleId?.model}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pickup Date:</span>
                <span className="font-semibold">
                  {new Date(booking.pickupDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Return Date:</span>
                <span className="font-semibold">
                  {new Date(booking.returnDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{booking.totalDays} days</span>
              </div>
              <div className="border-t border-[#E5E5E5] pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-[#14213D]">${booking.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Payment Method</h3>
            <div className="bg-[#E5E5E5] border border-[#FCA311] rounded-md p-4">
              <p className="font-semibold text-[#14213D]">{paymentMethod}</p>
              <p className="text-sm text-[#14213D] mt-1">
                {paymentMethod === "Stripe"
                  ? "You will be redirected to secure Stripe checkout"
                  : `Complete payment via ${paymentMethod} mobile wallet`}
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={processing}
            className={`w-full py-4 rounded-lg font-bold text-white text-lg transition ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FCA311] text-[#14213D] hover:bg-[#14213D] hover:text-white"
            }`}
          >
            {processing
              ? "Processing..."
              : `Pay $${booking.totalPrice} with ${paymentMethod}`}
          </button>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/my-bookings")}
              className="text-[#14213D] hover:text-[#FCA311] hover:underline text-sm"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
