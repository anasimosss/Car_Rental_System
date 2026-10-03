import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaCar,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBookingStaff, setIsBookingStaff] = useState(false);
  const [isFleetManager, setIsFleetManager] = useState(false);
  const [isPaymentStaff, setIsPaymentStaff] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const checkAdmin = async () => {
      if (token) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/me`,
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true,
            }
          );
          setIsAdmin(res.data.role === "Admin");
          setIsBookingStaff(res.data.role === "Booking/Reservation Staff");
          setIsFleetManager(res.data.role === "Fleet Manager");
          setIsPaymentStaff(res.data.role === "Payment/Finance Staff");
          setIsManager(res.data.role === "Manager");
        } catch (err) {
          setIsAdmin(false);
          setIsBookingStaff(false);
          setIsFleetManager(false);
          setIsPaymentStaff(false);
          setIsManager(false);
        }
      }
    };
    checkAdmin();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className="bg-[#14213D] text-white fixed w-full top-0 z-50 border-b border-[#E5E5E5] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-[76px]">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-[#FCA311] p-2 rounded-md transition-colors">
              <FaCar className="text-[#14213D] text-xl" />
            </div>
            <span className="text-xl font-bold text-white">
              CarRental
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-[#FCA311] font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/vehicles"
              className="text-white hover:text-[#FCA311] font-medium transition"
            >
              Vehicles
            </Link>

            {token ? (
              <>
                <Link
                  to="/my-bookings"
                  className="text-white hover:text-[#FCA311] font-medium transition"
                >
                  My Bookings
                </Link>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-[#FCA311] font-medium transition"
                >
                  Dashboard
                </Link>
                {(isAdmin || isBookingStaff || isFleetManager || isPaymentStaff || isManager) && (
                  <Link
                    to="/admin"
                    className="bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-md hover:bg-white transition font-semibold flex items-center space-x-2"
                  >
                    <FaUserShield />
                    <span>
                      {isAdmin
                        ? "Admin Panel"
                        : isBookingStaff
                          ? "Reservations"
                          : isFleetManager
                            ? "Fleet"
                            : isPaymentStaff
                              ? "Finance"
                              : "Manager"}
                    </span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white">
                    <FaUser className="text-sm text-[#FCA311]" />
                    <span className="text-sm max-w-36 truncate">{userEmail}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 border border-white text-white px-4 py-2 rounded-md hover:bg-white hover:text-[#14213D] transition"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-[#FCA311] font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FCA311] text-[#14213D] px-5 py-2 rounded-md hover:bg-white transition font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-[#FCA311]"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#14213D] border-t border-[#E5E5E5]">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link
              to="/"
              className="block py-2 text-white hover:text-[#FCA311] font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/vehicles"
              className="block py-2 text-white hover:text-[#FCA311] font-medium"
              onClick={() => setIsOpen(false)}
            >
              Vehicles
            </Link>

            {token ? (
              <>
                <Link
                  to="/my-bookings"
                  className="block py-2 text-white hover:text-[#FCA311] font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/dashboard"
                  className="block py-2 text-white hover:text-[#FCA311] font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {(isAdmin || isBookingStaff || isFleetManager || isPaymentStaff || isManager) && (
                  <Link
                    to="/admin"
                    className="block py-2 text-[#FCA311] hover:text-white font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {isAdmin
                      ? "Admin Panel"
                      : isBookingStaff
                        ? "Reservations"
                        : isFleetManager
                          ? "Fleet"
                          : isPaymentStaff
                            ? "Finance"
                            : "Manager"}
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left py-2 text-white hover:text-[#FCA311] font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-white hover:text-[#FCA311] font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 text-[#FCA311] font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
