import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaCar,
  FaGasPump,
  FaCog,
  FaUsers,
  FaStar,
  FaSearch,
} from "react-icons/fa";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All");

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [searchTerm, categoryFilter, priceFilter, vehicles]);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/vehicles`);
      // Filter only available vehicles
      const availableVehicles = res.data.filter(
        (v) => v.status === "Available"
      );
      setVehicles(availableVehicles);
      setFilteredVehicles(availableVehicles);
      setLoading(false);
    } catch (err) {
      setError("Failed to load vehicles");
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "All") {
      filtered = filtered.filter((v) => v.category === categoryFilter);
    }

    // Price filter
    if (priceFilter !== "All") {
      if (priceFilter === "low") {
        filtered = filtered.filter((v) => v.pricing?.daily <= 50);
      } else if (priceFilter === "medium") {
        filtered = filtered.filter(
          (v) => v.pricing?.daily > 50 && v.pricing?.daily <= 100
        );
      } else if (priceFilter === "high") {
        filtered = filtered.filter((v) => v.pricing?.daily > 100);
      }
    }

    setFilteredVehicles(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading vehicles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-[#14213D] text-white pt-28 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm uppercase tracking-[0.16em] text-[#FCA311] font-semibold mb-3">Available vehicles</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white">Our Fleet</h1>
          <p className="text-lg text-white">
            Choose from our wide selection of premium vehicles
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Vehicles
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-[#14213D]" />
                <input
                  type="text"
                  placeholder="Search by make or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
              >
                <option value="All">All Categories</option>
                <option value="Economy">Economy</option>
                <option value="Compact">Compact</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Van">Van</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
              >
                <option value="All">All Prices</option>
                <option value="low">Under $50/day</option>
                <option value="medium">$50 - $100/day</option>
                <option value="high">Over $100/day</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-600">
              {filteredVehicles.length} vehicle
              {filteredVehicles.length !== 1 ? "s" : ""} available
            </p>
            {(searchTerm ||
              categoryFilter !== "All" ||
              priceFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("All");
                  setPriceFilter("All");
                }}
                className="text-[#14213D] hover:text-[#FCA311] font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm p-8 sm:p-12 text-center">
            <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setPriceFilter("All");
              }}
              className="bg-[#FCA311] text-[#14213D] px-6 py-3 rounded-md font-semibold hover:bg-[#14213D] hover:text-white transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className="bg-white border border-[#E5E5E5] rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition group"
              >
                {/* Vehicle Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#E5E5E5]">
                  {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaCar className="text-6xl text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-[#FCA311] text-[#14213D] px-3 py-1 rounded-md text-sm font-semibold">
                    {vehicle.category}
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#14213D] mb-2">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-gray-600 mb-4">{vehicle.year}</p>

                  {/* Specifications */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FaGasPump className="mr-2 text-[#FCA311] shrink-0" />
                      <span>{vehicle.specifications?.fuelType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCog className="mr-2 text-[#FCA311] shrink-0" />
                      <span>{vehicle.specifications?.transmission}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUsers className="mr-2 text-[#FCA311] shrink-0" />
                      <span>{vehicle.specifications?.seats} Seats</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-[#14213D]">
                        ${vehicle.pricing?.daily}
                      </span>
                      <span className="text-gray-500 ml-2">/day</span>
                    </div>
                    {vehicle.pricing?.weekly && (
                      <p className="text-sm text-gray-600 mt-1">
                        ${vehicle.pricing.weekly}/week • $
                        {vehicle.pricing.monthly}/month
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to={`/vehicles/${vehicle._id}`}
                    className="block w-full bg-[#FCA311] text-[#14213D] text-center py-3 rounded-md font-bold hover:bg-[#14213D] hover:text-white transition shadow-sm"
                  >
                    View Details & Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaCar className="text-3xl text-yellow-400" />
                <span className="text-2xl font-bold">CarRental</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for car rentals in Ethiopia
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/vehicles" className="hover:text-white">
                    Vehicles
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@carrental.com</li>
                <li>Phone: +251 11 123 4567</li>
                <li>Addis Ababa, Ethiopia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CarRental. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
