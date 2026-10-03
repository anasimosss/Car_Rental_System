import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [booking, setBooking] = useState({
    pickupDate: "",
    returnDate: "",
    pickupLocationId: "",
    dropoffLocationId: "",
    customerInfo: {
      idNumber: "",
      idType: "National ID",
      driverLicenseNumber: "",
      licenseExpiryDate: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
  });
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/vehicles/${id}`
        );
        setVehicle(res.data);
        const locRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/locations`
        );
        setLocations(locRes.data);
      } catch {
        setError("Failed to load vehicle details.");
      }
    }
    fetchDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("customerInfo.")) {
      const field = name.split(".")[1];
      setBooking({
        ...booking,
        customerInfo: {
          ...booking.customerInfo,
          [field]: value,
        },
      });
    } else {
      setBooking({ ...booking, [name]: value });
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to book a vehicle.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      console.log("Sending booking request:", { ...booking, vehicleId: id });

      // Call backend booking endpoint
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        { ...booking, vehicleId: id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking successful:", res.data);
      setSuccess(
        "Booking submitted! Waiting for admin approval. Check 'My Bookings' for status."
      );
      setTimeout(() => navigate("/my-bookings"), 3000);
    } catch (err) {
      console.error("Booking error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Booking failed. Please check your details and try again.";

      setError(errorMessage);

      // Show detailed error in development
      if (err.response?.data?.details) {
        console.error("Error details:", err.response.data.details);
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-[#14213D] px-4">
        {error}
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCA311]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto mt-6 md:mt-10 bg-white p-4 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vehicle Image */}
            <div>
              {vehicle.images?.[0] ? (
                <img
                  src={vehicle.images[0]}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full aspect-[4/3] object-cover rounded-lg border border-[#E5E5E5] mb-4"
                />
              ) : (
                <div className="w-full aspect-[4/3] bg-[#E5E5E5] rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              <div className="bg-[#E5E5E5] p-4 rounded-md">
                <h2 className="text-2xl font-bold text-[#14213D]">
                  {vehicle.make} {vehicle.model}
                </h2>
                <p className="text-gray-600">
                  {vehicle.year} • {vehicle.category}
                </p>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-[#14213D]">
                    ${vehicle.pricing?.daily || "N/A"}
                    <span className="text-sm font-normal text-gray-500">
                      {" "}
                      / day
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Book This Vehicle
              </h2>

              {/* Login Notice */}
              {!localStorage.getItem("token") && (
                <div className="mb-4 p-4 bg-[#E5E5E5] border border-[#E5E5E5] rounded-md">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Please login to book this vehicle</strong>
                  </p>
                  <Link
                    to="/login"
                    className="inline-block bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-md hover:bg-[#14213D] hover:text-white transition text-sm font-semibold"
                  >
                    Login Now
                  </Link>
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    value={booking.pickupDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    name="returnDate"
                    className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    value={booking.returnDate}
                    onChange={handleChange}
                    min={
                      booking.pickupDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    disabled={!booking.pickupDate}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location
                  </label>
                  <select
                    name="pickupLocationId"
                    className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    value={booking.pickupLocationId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select pickup location</option>
                    {locations.map((loc) => (
                      <option key={loc._id} value={loc._id}>
                        {loc.name} ({loc.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dropoff Location
                  </label>
                  <select
                    name="dropoffLocationId"
                    className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                    value={booking.dropoffLocationId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select dropoff location</option>
                    {locations.map((loc) => (
                      <option key={loc._id} value={loc._id}>
                        {loc.name} ({loc.city})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer Information Section */}
                <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                  <h3 className="text-lg font-semibold text-[#14213D] mb-4">
                    Customer Information
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Type
                        </label>
                        <select
                          name="customerInfo.idType"
                          className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                          value={booking.customerInfo.idType}
                          onChange={handleChange}
                          required
                        >
                          <option value="National ID">National ID</option>
                          <option value="Passport">Passport</option>
                          <option value="Driver License">Driver License</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID Number
                        </label>
                        <input
                          type="text"
                          name="customerInfo.idNumber"
                          className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                          value={booking.customerInfo.idNumber}
                          onChange={handleChange}
                          placeholder="Enter your ID number"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Driver License Number
                        </label>
                        <input
                          type="text"
                          name="customerInfo.driverLicenseNumber"
                          className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                          value={booking.customerInfo.driverLicenseNumber}
                          onChange={handleChange}
                          placeholder="License number"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          License Expiry Date
                        </label>
                        <input
                          type="date"
                          name="customerInfo.licenseExpiryDate"
                          className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                          value={booking.customerInfo.licenseExpiryDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split("T")[0]}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          name="customerInfo.emergencyContact"
                          className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                          value={booking.customerInfo.emergencyContact}
                          onChange={handleChange}
                          placeholder="Contact name"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Phone
                        </label>
                        <input
                          type="tel"
                          name="customerInfo.emergencyPhone"
                          className="w-full px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                          value={booking.customerInfo.emergencyPhone}
                          onChange={handleChange}
                          placeholder="+251..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FCA311] text-[#14213D] py-3 px-4 rounded-md font-bold hover:bg-[#14213D] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FCA311] transition-colors mt-4"
                >
                  Book Now
                </button>

                {success && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
