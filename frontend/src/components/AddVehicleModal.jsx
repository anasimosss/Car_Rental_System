import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaImage, FaPlus, FaTrash } from "react-icons/fa";

const createInitialFormData = () => ({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    locationId: "",
    category: "Compact",
    specifications: {
      mileage: "",
      fuelType: "Gasoline",
      transmission: "Automatic",
      seats: 5,
    },
    pricing: {
      daily: "",
      weekly: "",
      monthly: "",
    },
    status: "Available",
    images: [],
  });

export default function AddVehicleModal({ isOpen, onClose, onSuccess, vehicle = null, locations = [] }) {
  const [formData, setFormData] = useState(createInitialFormData);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setImageUrl("");
    if (!vehicle) {
      setFormData(createInitialFormData());
      return;
    }
    setFormData({
      make: vehicle.make || "",
      model: vehicle.model || "",
      year: vehicle.year || new Date().getFullYear(),
      color: vehicle.color || "",
      locationId: vehicle.locationId?._id || vehicle.locationId?.id || vehicle.locationId || "",
      category: vehicle.category || "Compact",
      specifications: {
        mileage: vehicle.specifications?.mileage ?? "",
        fuelType: vehicle.specifications?.fuelType || "Gasoline",
        transmission: vehicle.specifications?.transmission || "Automatic",
        seats: vehicle.specifications?.seats || 5,
      },
      pricing: {
        daily: vehicle.pricing?.daily ?? "",
        weekly: vehicle.pricing?.weekly ?? "",
        monthly: vehicle.pricing?.monthly ?? "",
      },
      status: vehicle.status || "Available",
      images: Array.isArray(vehicle.images) ? vehicle.images : [],
    });
  }, [isOpen, vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("specifications.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        specifications: {
          ...formData.specifications,
          [field]: value,
        },
      });
    } else if (name.startsWith("pricing.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        pricing: {
          ...formData.pricing,
          [field]: parseFloat(value) || "",
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl],
      });
      setImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const pricing = {
        daily: parseFloat(formData.pricing.daily),
        weekly:
          formData.pricing.weekly || parseFloat(formData.pricing.daily) * 6,
        monthly:
          formData.pricing.monthly || parseFloat(formData.pricing.daily) * 25,
      };

      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        locationId: formData.locationId ? Number(formData.locationId) : null,
        specifications: {
          ...formData.specifications,
          mileage: parseInt(formData.specifications.mileage),
          seats: parseInt(formData.specifications.seats),
        },
        pricing,
      };

      const request = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      const vehiclesUrl = `${import.meta.env.VITE_API_URL}/vehicles`;
      if (vehicle) {
        await axios.put(`${vehiclesUrl}/${vehicle._id || vehicle.id}`, vehicleData, request);
      } else {
        await axios.post(vehiclesUrl, vehicleData, request);
      }

      onSuccess();
      onClose();

      // Reset form
      setFormData(createInitialFormData());
    } catch (err) {
      console.error("Error adding vehicle:", err);
      setError(err.response?.data?.message || "Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#E5E5E5] flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-[#E5E5E5] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-[#14213D] text-white px-5 sm:px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Vehicle Images Section */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FaImage className="mr-2 text-[#FCA311]" />
              Vehicle Images
            </h4>

            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL (e.g., https://example.com/car.jpg)"
                className="flex-1 min-w-0 px-3 py-3 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-md hover:bg-[#14213D] hover:text-white transition flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Image
              </button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Vehicle ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Invalid+Image";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make *
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., Camry"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Economy">Economy</option>
                <option value="Compact">Compact</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
                <option value="Van">Van</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
              >
                <option value="">No location</option>
                {locations.map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}{location.city ? `, ${location.city}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {vehicle && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-[#E5E5E5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                >
                  <option value="Available">Available</option>
                  <option value="Rented">Rented</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="mb-6 pb-6 border-b">
            <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage (km) *
                </label>
                <input
                  type="number"
                  name="specifications.mileage"
                  value={formData.specifications.mileage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type *
                </label>
                <select
                  name="specifications.fuelType"
                  value={formData.specifications.fuelType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission *
                </label>
                <select
                  name="specifications.transmission"
                  value={formData.specifications.transmission}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats *
                </label>
                <input
                  type="number"
                  name="specifications.seats"
                  value={formData.specifications.seats}
                  onChange={handleChange}
                  min="2"
                  max="15"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Pricing (USD)</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Rate *
                </label>
                <input
                  type="number"
                  name="pricing.daily"
                  value={formData.pricing.daily}
                  onChange={handleChange}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="50.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Rate
                </label>
                <input
                  type="number"
                  name="pricing.weekly"
                  value={formData.pricing.weekly}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Auto-calculated"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Rate
                </label>
                <input
                  type="number"
                  name="pricing.monthly"
                  value={formData.pricing.monthly}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Auto-calculated"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-[#E5E5E5] rounded-md text-[#14213D] hover:bg-[#E5E5E5] transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-white font-medium transition shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FCA311] text-[#14213D] hover:bg-[#14213D] hover:text-white"
              }`}
            >
              {loading
                ? vehicle ? "Saving Vehicle..." : "Adding Vehicle..."
                : vehicle ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
