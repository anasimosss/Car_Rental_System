import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaCar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/my`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings");
      setLoading(false);
    }
  };

  const handlePayNow = (bookingId, paymentMethod) => {
    navigate(`/bookings/${bookingId}/pay`, { state: { paymentMethod } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-3">Loading your bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-24 pb-10 px-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#14213D]">My Bookings</h1>
            <Link
              to="/vehicles"
              className="bg-[#FCA311] text-[#14213D] px-5 py-2.5 rounded-md font-semibold hover:bg-[#14213D] hover:text-white transition"
            >
              Browse Vehicles
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm p-8 sm:p-12 text-center">
              <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No bookings yet</p>
              <Link
                to="/vehicles"
                className="inline-block bg-[#FCA311] text-[#14213D] px-6 py-3 rounded-md font-semibold hover:bg-[#14213D] hover:text-white transition"
              >
                Book a Vehicle
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <FaCar className="text-[#FCA311] text-3xl mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {booking.vehicleId?.make} {booking.vehicleId?.model}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {booking.vehicleId?.year} •{" "}
                          {booking.vehicleId?.category}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        {booking.verificationStatus === "Approved" && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <FaCheckCircle className="mr-1" />
                            Approved
                          </span>
                        )}
                        {booking.verificationStatus === "Pending" && (
                          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <FaClock className="mr-1" />
                            Pending Approval
                          </span>
                        )}
                        {booking.verificationStatus === "Rejected" && (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <FaTimesCircle className="mr-1" />
                            Rejected
                          </span>
                        )}
                      </div>
                      <p className="text-2xl font-bold text-[#14213D]">
                        ${booking.totalPrice}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-500">Pickup Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.pickupDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Return Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(booking.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-900">
                        {booking.totalDays} days
                      </p>
                    </div>
                  </div>

                  {/* Show payment status and action */}
                  <div className="border-t border-[#E5E5E5] pt-4">
                    {booking.verificationStatus === "Pending" && (
                      <div className="bg-[#E5E5E5] border border-[#E5E5E5] rounded-md p-4">
                        <p className="text-sm text-[#14213D]">
                          <strong>⏳ Waiting for Admin Approval</strong>
                          <br />
                          Your booking is under review. You'll be able to
                          proceed with payment once approved.
                        </p>
                      </div>
                    )}

                    {booking.verificationStatus === "Rejected" && (
                      <div className="bg-[#E5E5E5] border border-[#14213D] rounded-md p-4">
                        <p className="text-sm text-[#14213D]">
                          <strong>❌ Booking Rejected</strong>
                          <br />
                          {booking.verificationNotes ||
                            "Please contact support for more information."}
                        </p>
                      </div>
                    )}

                    {booking.verificationStatus === "Approved" &&
                      booking.paymentStatus === "Pending" && (
                        <div className="bg-[#E5E5E5] border border-[#FCA311] rounded-md p-4">
                          <p className="text-sm text-[#14213D] mb-3">
                            <strong>
                              ✅ Approved! Choose your payment method:
                            </strong>
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() =>
                                handlePayNow(booking._id, "Telebirr")
                              }
                              className="bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-md hover:bg-[#14213D] hover:text-white transition flex items-center"
                            >
                              <FaMoneyBillWave className="mr-2" />
                              Pay with Telebirr
                            </button>
                            <button
                              onClick={() =>
                                handlePayNow(booking._id, "CBE Birr")
                              }
                              className="bg-[#14213D] text-white px-4 py-2 rounded-md hover:bg-[#FCA311] hover:text-[#14213D] transition flex items-center"
                            >
                              <FaMoneyBillWave className="mr-2" />
                              Pay with CBE Birr
                            </button>
                            <button
                              onClick={() =>
                                handlePayNow(booking._id, "E-Birr")
                              }
                              className="bg-white text-[#14213D] border border-[#14213D] px-4 py-2 rounded-md hover:bg-[#E5E5E5] transition flex items-center"
                            >
                              <FaMoneyBillWave className="mr-2" />
                              Pay with E-Birr
                            </button>
                            <button
                              onClick={() =>
                                handlePayNow(booking._id, "Stripe")
                              }
                              className="bg-white text-[#14213D] border border-[#E5E5E5] px-4 py-2 rounded-md hover:bg-[#E5E5E5] transition flex items-center"
                            >
                              <FaMoneyBillWave className="mr-2" />
                              Pay with Card (Stripe)
                            </button>
                          </div>
                        </div>
                      )}

                    {booking.paymentStatus === "Paid" && (
                      <div className="bg-[#E5E5E5] border border-[#FCA311] rounded-md p-4">
                        <p className="text-sm text-[#14213D]">
                          <strong>💳 Payment Completed</strong>
                          <br />
                          Paid via {booking.paymentMethod} on{" "}
                          {new Date(booking.paymentDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
