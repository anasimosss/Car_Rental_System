import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaCar,
  FaUser,
  FaSignOutAlt,
  FaCalendar,
  FaDollarSign,
} from "react-icons/fa";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        };

        const userRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/me`,
          config
        );
        setUser(userRes.data);

        try {
          const bookingsRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/bookings/my`,
            config
          );
          setBookings(bookingsRes.data);
        } catch (bookingErr) {
          console.log("No bookings yet");
          setBookings([]);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message || "Failed to load dashboard data."
          );
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#14213D]">My Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          {user && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="bg-[#E5E5E5] p-3 rounded-md">
                    <FaUser className="text-[#14213D] text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-gray-900">
                    Profile
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Name</label>
                    <p className="text-gray-900 font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <label className="text-sm text-gray-500">Phone</label>
                      <p className="text-gray-900 font-medium">{user.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p className="text-gray-900 font-medium">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {user.role}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">
                      Email Verified
                    </label>
                    <p className="text-gray-900 font-medium">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.emailVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.emailVerified ? "Verified" : "Not Verified"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-[#E5E5E5] p-3 rounded-md">
                    <FaCalendar className="text-[#14213D] text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold ml-3 text-gray-900">
                    My Bookings
                  </h3>
                </div>
                <Link
                  to="/vehicles"
                  className="bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#14213D] hover:text-white transition"
                >
                  Book a Vehicle
                </Link>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <FaCar className="text-gray-300 text-6xl mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No bookings yet.</p>
                  <Link
                    to="/vehicles"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Browse Available Vehicles
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-[#E5E5E5] rounded-md p-4 hover:border-[#FCA311] transition"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">
                            {booking.vehicleId?.make} {booking.vehicleId?.model}
                          </h4>
                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FaCalendar className="mr-2 text-gray-400" />
                              <span>
                                {new Date(
                                  booking.pickupDate
                                ).toLocaleDateString()}
                                {" to "}
                                {new Date(
                                  booking.returnDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <FaDollarSign className="mr-2 text-gray-400" />
                              <span className="font-semibold text-gray-900">
                                ${booking.totalPrice}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "Completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
