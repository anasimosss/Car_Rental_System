import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  FaCar,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import AddVehicleModal from "../components/AddVehicleModal";

const USER_ROLES = [
  "Customer",
  "Agent",
  "Admin",
  "Booking/Reservation Staff",
  "Fleet Manager",
  "Payment/Finance Staff",
  "Manager",
];

function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBookingStaff, setIsBookingStaff] = useState(false);
  const [isFleetManager, setIsFleetManager] = useState(false);
  const [isPaymentStaff, setIsPaymentStaff] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRoles, setUserRoles] = useState({});
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userStatus, setUserStatus] = useState(null);
  const [savingUserId, setSavingUserId] = useState(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedTab, setSelectedTab] = useState("pending");
  const [selectedPaymentView, setSelectedPaymentView] = useState("pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [locationForm, setLocationForm] = useState({ name: "", city: "", address: "" });
  const [editingLocationId, setEditingLocationId] = useState(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    vehicleId: "",
    description: "",
    scheduledDate: "",
    status: "Scheduled",
  });
  const [editingMaintenanceId, setEditingMaintenanceId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
      const hasAdminRole = userRes.data.role === "Admin";
      const hasBookingStaffRole =
        userRes.data.role === "Booking/Reservation Staff";
      const hasFleetManagerRole = userRes.data.role === "Fleet Manager";
      const hasPaymentStaffRole = userRes.data.role === "Payment/Finance Staff";
      const hasManagerRole = userRes.data.role === "Manager";
      setIsAdmin(hasAdminRole);
      setIsBookingStaff(hasBookingStaffRole);
      setIsFleetManager(hasFleetManagerRole);
      setIsPaymentStaff(hasPaymentStaffRole);
      setIsManager(hasManagerRole);

      if (
        !hasAdminRole &&
        !hasBookingStaffRole &&
        !hasFleetManagerRole &&
        !hasPaymentStaffRole &&
        !hasManagerRole
      ) {
        setError("Unauthorized. Please login with an authorized staff account.");
        return;
      }

      if (hasAdminRole) {
        const [vRes, bRes, pRes, mRes, lRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/vehicles`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/bookings`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/bookings/pending`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/maintenance`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/locations`, config),
        ]);
        setVehicles(vRes.data);
        setBookings(bRes.data);
        setPendingBookings(pRes.data);
        setMaintenanceRecords(mRes.data);
        setLocations(lRes.data);
      } else if (hasBookingStaffRole) {
        const [bRes, pRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/bookings`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/bookings/pending`, config),
        ]);
        setVehicles([]);
        setMaintenanceRecords([]);
        setLocations([]);
        setBookings(bRes.data);
        setPendingBookings(pRes.data);
      } else if (hasFleetManagerRole) {
        const [vRes, mRes, lRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/vehicles`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/maintenance`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/locations`, config),
        ]);
        setVehicles(vRes.data);
        setMaintenanceRecords(mRes.data);
        setLocations(lRes.data);
        setBookings([]);
        setPendingBookings([]);
        setSelectedTab("vehicles");
      } else if (hasPaymentStaffRole) {
        const bRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings`,
          config
        );
        setBookings(bRes.data);
        setPendingBookings([]);
        setVehicles([]);
        setMaintenanceRecords([]);
        setLocations([]);
        setSelectedTab("payments");
      } else if (hasManagerRole) {
        const [vRes, bRes, pRes, mRes, lRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/vehicles`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/bookings`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/bookings/pending`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/maintenance`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/locations`, config),
        ]);
        setVehicles(vRes.data);
        setBookings(bRes.data);
        setPendingBookings(pRes.data);
        setMaintenanceRecords(mRes.data);
        setLocations(lRes.data);
        setSelectedTab("overview");
      }
      setError("");
    } catch (err) {
      console.error("Admin dashboard error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized. Please login with an authorized staff account.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(
          "Failed to load admin data. " +
            (err.response?.data?.message || err.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdmin || usersLoading || usersLoaded) return;
    setUsersLoading(true);
    setUserStatus(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUsers(res.data);
      setUserRoles(
        Object.fromEntries(
          res.data.map((user) => [user._id ?? user.id, user.role])
        )
      );
      setUsersLoaded(true);
    } catch (err) {
      setUserStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to load users.",
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const saveUserRole = async (user) => {
    if (!isAdmin) return;
    const userId = user._id ?? user.id;
    const role = userRoles[userId];
    if (!USER_ROLES.includes(role)) {
      setUserStatus({ type: "error", message: "Select a valid role." });
      return;
    }

    setSavingUserId(userId);
    setUserStatus(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          String(currentUser._id ?? currentUser.id) === String(userId)
            ? { ...currentUser, role }
            : currentUser
        )
      );
      setUserStatus({ type: "success", message: `Role updated for ${user.email}.` });
    } catch (err) {
      setUserStatus({
        type: "error",
        message: err.response?.data?.message || `Failed to update ${user.email}.`,
      });
    } finally {
      setSavingUserId(null);
    }
  };

  const handleVerifyBooking = async (bookingId, status, notes = "") => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/verify`,
        { status, notes },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchData();
      alert(`Booking ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Verification error:", err);
      alert(
        "Failed to verify booking: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleVehicleStatusChange = async (vehicleId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/vehicles/${vehicleId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      fetchData();
      alert(`Vehicle status updated to ${newStatus}`);
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update vehicle status");
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Remove this vehicle from the fleet?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/vehicles/${vehicleId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove vehicle");
    }
  };

  const handleLocationChange = (event) => {
    setLocationForm({ ...locationForm, [event.target.name]: event.target.value });
  };

  const handleLocationSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const request = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      const url = `${import.meta.env.VITE_API_URL}/locations`;
      if (editingLocationId) {
        await axios.put(`${url}/${editingLocationId}`, locationForm, request);
      } else {
        await axios.post(url, locationForm, request);
      }
      setLocationForm({ name: "", city: "", address: "" });
      setEditingLocationId(null);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save location");
    }
  };

  const handleEditLocation = (location) => {
    setLocationForm({
      name: location.name || "",
      city: location.city || "",
      address: location.address || "",
    });
    setEditingLocationId(location._id);
  };

  const handleDeleteLocation = async (locationId) => {
    if (!window.confirm("Remove this location?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/locations/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove location");
    }
  };

  const handleMaintenanceChange = (event) => {
    setMaintenanceForm({
      ...maintenanceForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleMaintenanceSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = {
        ...maintenanceForm,
        vehicleId: Number(maintenanceForm.vehicleId),
        scheduledDate: maintenanceForm.scheduledDate || null,
      };
      const request = {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      };
      const url = `${import.meta.env.VITE_API_URL}/maintenance`;
      if (editingMaintenanceId) {
        await axios.put(`${url}/${editingMaintenanceId}`, data, request);
      } else {
        await axios.post(url, data, request);
      }
      setMaintenanceForm({
        vehicleId: "",
        description: "",
        scheduledDate: "",
        status: "Scheduled",
      });
      setEditingMaintenanceId(null);
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save maintenance record");
    }
  };

  const handleEditMaintenance = (record) => {
    setMaintenanceForm({
      vehicleId: record.vehicleId?._id || record.vehicleId?.id || "",
      description: record.description || "",
      scheduledDate: record.scheduledDate
        ? new Date(record.scheduledDate).toISOString().slice(0, 10)
        : "",
      status: record.status || "Scheduled",
    });
    setEditingMaintenanceId(record._id);
  };

  const handleDeleteMaintenance = async (maintenanceId) => {
    if (!window.confirm("Remove this maintenance record?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/maintenance/${maintenanceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove maintenance record");
    }
  };

  const handleConfirmPayment = async (paymentReference) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/payments/confirm-payment`,
        { paymentReference },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to confirm payment");
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = userSearch.trim().toLowerCase();
    return (
      !query ||
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  const paymentBookings = bookings.filter((booking) => booking.paymentStatus);
  const displayedPayments = paymentBookings.filter((booking) =>
    selectedPaymentView === "pending"
      ? booking.paymentStatus === "Pending"
      : booking.paymentStatus !== "Pending"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-3 text-gray-600">Loading admin dashboard...</span>
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
      {/* Navigation */}
      <nav className="bg-[#14213D] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FaCar className="text-[#FCA311] text-3xl mr-2" />
              <span className="text-xl sm:text-2xl font-bold text-white">
                {isAdmin
                  ? "Admin Panel"
                  : isBookingStaff
                    ? "Reservation Staff"
                    : isFleetManager
                      ? "Fleet Manager"
                      : isPaymentStaff
                        ? "Payment/Finance Staff"
                        : "Manager"}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-white hover:text-[#FCA311] px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-[#FCA311] px-3 py-2 rounded-md text-sm font-medium transition"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#14213D]">
          {isAdmin
            ? "Admin Dashboard"
            : isBookingStaff
              ? "Reservation Dashboard"
              : isFleetManager
                ? "Fleet Dashboard"
                : isPaymentStaff
                  ? "Finance Dashboard"
                  : "Manager Dashboard"}
        </h2>

        {/* Stats Cards */}
        <div className={`grid grid-cols-1 ${isAdmin || isFleetManager || isPaymentStaff || isManager ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6 mb-8`}>
          {(isAdmin || isFleetManager || isManager) && (
            <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Total Vehicles
              </h3>
              <p className="text-4xl font-bold text-[#14213D]">
                {vehicles.length}
              </p>
            </div>
          )}
          {(isAdmin || isBookingStaff || isManager) && (
            <>
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Total Bookings
                </h3>
                <p className="text-4xl font-bold text-[#14213D]">
                  {bookings.length}
                </p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Pending Verification
                </h3>
                <p className="text-4xl font-bold text-[#FCA311]">
                  {pendingBookings.length}
                </p>
              </div>
            </>
          )}
          {(isFleetManager || isManager) && (
            <>
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Vehicles Under Maintenance
                </h3>
                <p className="text-4xl font-bold text-[#FCA311]">
                  {vehicles.filter((vehicle) => vehicle.status === "Maintenance").length}
                </p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Maintenance Records
                </h3>
                <p className="text-4xl font-bold text-[#14213D]">
                  {maintenanceRecords.length}
                </p>
              </div>
            </>
          )}
          {(isPaymentStaff || isAdmin || isManager) && (
            <>
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Pending Payments
                </h3>
                <p className="text-4xl font-bold text-[#FCA311]">
                  {bookings.filter((booking) => booking.paymentStatus === "Pending").length}
                </p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Paid Revenue
                </h3>
                <p className="text-4xl font-bold text-[#14213D]">
                  ${bookings
                    .filter((booking) => booking.paymentStatus === "Paid")
                    .reduce((total, booking) => total + Number(booking.totalPrice || 0), 0)}
                </p>
              </div>
              <div className="bg-white p-5 sm:p-6 rounded-lg border border-[#E5E5E5] shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Payment History
                </h3>
                <p className="text-4xl font-bold text-[#14213D]">
                  {bookings.filter((booking) => booking.paymentStatus && booking.paymentStatus !== "Pending").length}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {isManager && (
                <button
                  onClick={() => setSelectedTab("overview")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "overview"
                      ? "border-[#FCA311] text-[#14213D]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Overview
                </button>
              )}
              {(isAdmin || isBookingStaff || isManager) && <button
                onClick={() => setSelectedTab("pending")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "pending"
                    ? "border-[#FCA311] text-[#14213D]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Verifications ({pendingBookings.length})
              </button>}
              {(isAdmin || isBookingStaff || isManager) && <button
                onClick={() => setSelectedTab("all")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === "all"
                    ? "border-[#FCA311] text-[#14213D]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Bookings ({bookings.length})
              </button>}
              {(isAdmin || isFleetManager || isManager) && (
                <button
                  onClick={() => setSelectedTab("vehicles")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "vehicles"
                      ? "border-[#FCA311] text-[#14213D]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Vehicles ({vehicles.length})
                </button>
              )}
              {(isAdmin || isPaymentStaff || isManager) && (
                <button
                  onClick={() => setSelectedTab("payments")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "payments"
                      ? "border-[#FCA311] text-[#14213D]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Payments ({bookings.filter((booking) => booking.paymentStatus).length})
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => {
                    setSelectedTab("users");
                    fetchUsers();
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "users"
                      ? "border-[#FCA311] text-[#14213D]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Users
                </button>
              )}
              {(isAdmin || isFleetManager || isManager) && (
                <button
                  onClick={() => setSelectedTab("maintenance")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "maintenance"
                      ? "border-[#FCA311] text-[#14213D]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Maintenance ({maintenanceRecords.length})
                </button>
              )}
              {(isAdmin || isFleetManager || isManager) && (
                <button
                  onClick={() => setSelectedTab("locations")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "locations"
                      ? "border-[#FCA311] text-[#14213D]"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Locations ({locations.length})
                </button>
              )}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {isAdmin && selectedTab === "users" && (
              <section className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#14213D]">User Management</h3>
                    <p className="text-sm text-gray-600 mt-1">{users.length} registered users</p>
                  </div>
                  <label className="w-full sm:max-w-sm text-sm font-medium text-[#14213D]">
                    Search users
                    <input
                      type="search"
                      value={userSearch}
                      onChange={(event) => setUserSearch(event.target.value)}
                      placeholder="Search by name or email"
                      className="mt-1 w-full px-3 py-2.5 border border-[#E5E5E5] rounded-md"
                    />
                  </label>
                </div>

                {userStatus && (
                  <div
                    role="status"
                    className={`rounded-md border px-4 py-3 text-sm ${
                      userStatus.type === "success"
                        ? "border-[#FCA311] bg-[#E5E5E5] text-[#14213D]"
                        : "border-[#14213D] bg-[#E5E5E5] text-[#14213D]"
                    }`}
                  >
                    {userStatus.message}
                  </div>
                )}

                {usersLoading ? (
                  <div className="py-10 text-center text-gray-600" role="status">
                    <div className="spinner mb-3" />
                    Loading users...
                  </div>
                ) : userStatus?.type === "error" && !usersLoaded ? null : (
                  <div className="overflow-x-auto border border-[#E5E5E5] rounded-lg">
                    <table className="min-w-[920px] w-full text-left text-sm">
                      <thead className="bg-[#E5E5E5] text-[#14213D]">
                        <tr>
                          <th scope="col" className="px-4 py-3 font-semibold">ID</th>
                          <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                          <th scope="col" className="px-4 py-3 font-semibold">Email</th>
                          <th scope="col" className="px-4 py-3 font-semibold">Current Role</th>
                          <th scope="col" className="px-4 py-3 font-semibold">Email Verification</th>
                          <th scope="col" className="px-4 py-3 font-semibold">Created Date</th>
                          <th scope="col" className="px-4 py-3 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E5E5E5]">
                        {filteredUsers.map((user) => {
                          const userId = user._id ?? user.id;
                          const role = userRoles[userId] ?? user.role;
                          return (
                            <tr key={userId} className="bg-white align-middle">
                              <td className="px-4 py-3 text-gray-600">{userId}</td>
                              <td className="px-4 py-3 font-medium text-[#14213D]">{user.name}</td>
                              <td className="px-4 py-3">{user.email}</td>
                              <td className="px-4 py-3">
                                <select
                                  aria-label={`Role for ${user.email}`}
                                  value={role}
                                  onChange={(event) => {
                                    setUserRoles((current) => ({
                                      ...current,
                                      [userId]: event.target.value,
                                    }));
                                    setUserStatus(null);
                                  }}
                                  className="min-w-56 px-3 py-2 border border-[#E5E5E5] rounded-md"
                                >
                                  {USER_ROLES.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-4 py-3">
                                {user.emailVerified ? "Verified" : "Not verified"}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {user.createdAt
                                  ? new Date(user.createdAt).toLocaleDateString()
                                  : "N/A"}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => saveUserRole(user)}
                                  disabled={savingUserId === userId || role === user.role}
                                  className="px-4 py-2 rounded-md bg-[#FCA311] text-[#14213D] font-semibold disabled:bg-[#E5E5E5] disabled:text-gray-600"
                                >
                                  {savingUserId === userId ? "Saving..." : "Save"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan="7" className="px-4 py-10 text-center text-gray-600">
                              {users.length === 0 ? "No users found" : "No users match your search"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {isManager && selectedTab === "overview" && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <article className="border border-[#E5E5E5] rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#14213D] mb-3">Booking status</h3>
                  {[
                    "Pending",
                    "Confirmed",
                    "Completed",
                    "Cancelled",
                  ].map((status) => (
                    <div key={status} className="flex justify-between py-1 text-sm">
                      <span>{status}</span>
                      <span className="font-semibold">{bookings.filter((booking) => booking.status === status).length}</span>
                    </div>
                  ))}
                </article>
                <article className="border border-[#E5E5E5] rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#14213D] mb-3">Fleet availability</h3>
                  {["Available", "Rented", "Maintenance", "Unavailable"].map((status) => (
                    <div key={status} className="flex justify-between py-1 text-sm">
                      <span>{status}</span>
                      <span className="font-semibold">{vehicles.filter((vehicle) => vehicle.status === status).length}</span>
                    </div>
                  ))}
                </article>
                <article className="border border-[#E5E5E5] rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#14213D] mb-3">Payment overview</h3>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Pending payments</span>
                    <span className="font-semibold">{bookings.filter((booking) => booking.paymentStatus === "Pending").length}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Paid revenue</span>
                    <span className="font-semibold">${bookings.filter((booking) => booking.paymentStatus === "Paid").reduce((total, booking) => total + Number(booking.totalPrice || 0), 0)}</span>
                  </div>
                </article>
                <article className="border border-[#E5E5E5] rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-[#14213D] mb-3">Operations</h3>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Maintenance records</span>
                    <span className="font-semibold">{maintenanceRecords.length}</span>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <span>Locations</span>
                    <span className="font-semibold">{locations.length}</span>
                  </div>
                </article>
              </section>
            )}

            {/* Pending Bookings Tab */}
            {(isAdmin || isBookingStaff || isManager) && selectedTab === "pending" && (
              <div className="space-y-4">
                {pendingBookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No pending bookings
                  </p>
                ) : (
                  pendingBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-[#E5E5E5] rounded-md p-4 sm:p-6 hover:border-[#FCA311] transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">
                            {booking.vehicleId?.make} {booking.vehicleId?.model}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Customer: {booking.userId?.name} (
                            {booking.userId?.email})
                          </p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {booking.verificationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-gray-600">
                            Pickup:{" "}
                            {new Date(booking.pickupDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            Return:{" "}
                            {new Date(booking.returnDate).toLocaleDateString()}
                          </p>
                          <p className="text-gray-600">
                            Location: {booking.pickupLocationId?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            Total Days: {booking.totalDays}
                          </p>
                          <p className="font-semibold text-gray-900">
                            Total: ${booking.totalPrice}
                          </p>
                        </div>
                      </div>

                      {/* Customer Information */}
                      {booking.customerInfo && (
                        <div className="bg-[#E5E5E5] p-4 rounded-md mb-4">
                          <h5 className="font-semibold text-gray-900 mb-2">
                            Customer Information
                          </h5>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p>
                              <span className="font-medium">ID Type:</span>{" "}
                              {booking.customerInfo.idType}
                            </p>
                            <p>
                              <span className="font-medium">ID Number:</span>{" "}
                              {booking.customerInfo.idNumber}
                            </p>
                            <p>
                              <span className="font-medium">License:</span>{" "}
                              {booking.customerInfo.driverLicenseNumber}
                            </p>
                            <p>
                              <span className="font-medium">Expiry:</span>{" "}
                              {new Date(
                                booking.customerInfo.licenseExpiryDate
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <span className="font-medium">
                                Emergency Contact:
                              </span>{" "}
                              {booking.customerInfo.emergencyContact}
                            </p>
                            <p>
                              <span className="font-medium">
                                Emergency Phone:
                              </span>{" "}
                              {booking.customerInfo.emergencyPhone}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {(isAdmin || isBookingStaff) && <div className="flex space-x-4">
                        <button
                          onClick={() =>
                            handleVerifyBooking(
                              booking._id,
                              "Approved",
                              "Approved by admin"
                            )
                          }
                          className="flex items-center bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-md hover:bg-[#14213D] hover:text-white transition"
                        >
                          <FaCheckCircle className="mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const notes = prompt("Rejection reason:");
                            if (notes)
                              handleVerifyBooking(
                                booking._id,
                                "Rejected",
                                notes
                              );
                          }}
                          className="flex items-center bg-white text-[#14213D] border border-[#14213D] px-4 py-2 rounded-md hover:bg-[#E5E5E5] transition"
                        >
                          <FaTimesCircle className="mr-2" />
                          Reject
                        </button>
                      </div>}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* All Bookings Tab */}
            {(isAdmin || isBookingStaff || isManager) && selectedTab === "all" && (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No bookings yet
                  </p>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border border-[#E5E5E5] rounded-md p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {booking.vehicleId?.make} {booking.vehicleId?.model}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {booking.userId?.name} -{" "}
                            {new Date(booking.pickupDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.verificationStatus === "Approved"
                                ? "bg-green-100 text-green-800"
                                : booking.verificationStatus === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.verificationStatus}
                          </span>
                          <p className="text-sm font-semibold text-gray-900 mt-2">
                            ${booking.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Vehicles Tab */}
            {(isAdmin || isFleetManager || isManager) && selectedTab === "vehicles" && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Vehicle Management
                  </h3>
                  {(isAdmin || isFleetManager) && <button
                    onClick={() => {
                      setEditingVehicle(null);
                      setShowAddVehicleModal(true);
                    }}
                    className="flex items-center bg-[#FCA311] text-[#14213D] px-5 py-3 rounded-md hover:bg-[#14213D] hover:text-white transition shadow-sm"
                  >
                    <FaPlus className="mr-2" />
                    Add New Vehicle
                  </button>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      className="border border-[#E5E5E5] rounded-md p-4 hover:border-[#FCA311] transition"
                    >
                      <h4 className="font-bold text-gray-900">
                        {vehicle.make} {vehicle.model}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {vehicle.year} • {vehicle.category}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Daily:</span> $
                        {vehicle.pricing?.daily}/day
                        {vehicle.pricing?.weekly != null && (
                          <span> · ${vehicle.pricing.weekly}/week</span>
                        )}
                        {vehicle.pricing?.monthly != null && (
                          <span> · ${vehicle.pricing.monthly}/month</span>
                        )}
                      </p>
                      <p className="text-sm mt-1 text-gray-600">
                        Location: {locations.find((location) =>
                          String(location._id) ===
                          String(vehicle.locationId?._id || vehicle.locationId)
                        )?.name || "Not assigned"}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        {[
                          vehicle.specifications?.fuelType,
                          vehicle.specifications?.transmission,
                          vehicle.specifications?.seats
                            ? `${vehicle.specifications.seats} seats`
                            : null,
                        ].filter(Boolean).join(" · ")}
                      </p>
                      <div className="mt-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                            vehicle.status === "Available"
                              ? "bg-green-100 text-green-800"
                              : vehicle.status === "Rented"
                                ? "bg-blue-100 text-blue-800"
                                : vehicle.status === "Maintenance"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      </div>

                      {(isAdmin || isFleetManager) && <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setShowAddVehicleModal(true);
                          }}
                          className="flex-1 border border-[#14213D] text-[#14213D] px-3 py-2 rounded-md text-sm font-semibold hover:bg-[#E5E5E5]"
                        >
                          Edit vehicle
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle._id)}
                          className="border border-[#E5E5E5] text-[#14213D] px-3 py-2 rounded-md text-sm font-semibold hover:bg-[#E5E5E5]"
                        >
                          Remove
                        </button>
                      </div>}

                      {/* Status Management Buttons */}
                      {(isAdmin || isFleetManager) && <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                          Change Status:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              handleVehicleStatusChange(
                                vehicle._id,
                                "Available"
                              )
                            }
                            disabled={vehicle.status === "Available"}
                            className={`text-xs px-2 py-1 rounded transition ${
                              vehicle.status === "Available"
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            Available
                          </button>
                          <button
                            onClick={() =>
                              handleVehicleStatusChange(vehicle._id, "Rented")
                            }
                            disabled={vehicle.status === "Rented"}
                            className={`text-xs px-2 py-1 rounded transition ${
                              vehicle.status === "Rented"
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                          >
                            Rented
                          </button>
                          <button
                            onClick={() =>
                              handleVehicleStatusChange(
                                vehicle._id,
                                "Maintenance"
                              )
                            }
                            disabled={vehicle.status === "Maintenance"}
                            className={`text-xs px-2 py-1 rounded transition ${
                              vehicle.status === "Maintenance"
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-yellow-600 text-white hover:bg-yellow-700"
                            }`}
                          >
                            Maintenance
                          </button>
                          <button
                            onClick={() =>
                              handleVehicleStatusChange(
                                vehicle._id,
                                "Unavailable"
                              )
                            }
                            disabled={vehicle.status === "Unavailable"}
                            className={`text-xs px-2 py-1 rounded transition ${
                              vehicle.status === "Unavailable"
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            Unavailable
                          </button>
                        </div>
                      </div>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(isAdmin || isFleetManager || isManager) && selectedTab === "maintenance" && (
              <section className="space-y-6">
                {(isAdmin || isFleetManager) && <form onSubmit={handleMaintenanceSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-[#E5E5E5] rounded-lg p-4 sm:p-6">
                  <h3 className="md:col-span-2 text-xl font-bold text-[#14213D]">
                    {editingMaintenanceId ? "Update maintenance record" : "Schedule maintenance"}
                  </h3>
                  <label className="text-sm font-medium text-[#14213D]">
                    Vehicle
                    <select name="vehicleId" value={maintenanceForm.vehicleId} onChange={handleMaintenanceChange} required className="mt-1 w-full px-3 py-3 border border-[#E5E5E5] rounded-md">
                      <option value="">Select a vehicle</option>
                      {vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.make} {vehicle.model} ({vehicle.licensePlate || vehicle._id})</option>)}
                    </select>
                  </label>
                  <label className="text-sm font-medium text-[#14213D]">
                    Status
                    <select name="status" value={maintenanceForm.status} onChange={handleMaintenanceChange} className="mt-1 w-full px-3 py-3 border border-[#E5E5E5] rounded-md">
                      <option value="Scheduled">Scheduled</option>
                      <option value="InProgress">In progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </label>
                  <label className="text-sm font-medium text-[#14213D]">
                    Scheduled date
                    <input type="date" name="scheduledDate" value={maintenanceForm.scheduledDate} onChange={handleMaintenanceChange} className="mt-1 w-full px-3 py-3 border border-[#E5E5E5] rounded-md" />
                  </label>
                  <label className="text-sm font-medium text-[#14213D] md:col-span-2">
                    Description
                    <textarea name="description" value={maintenanceForm.description} onChange={handleMaintenanceChange} rows="3" className="mt-1 w-full px-3 py-3 border border-[#E5E5E5] rounded-md" />
                  </label>
                  <div className="md:col-span-2 flex gap-3">
                    <button type="submit" className="bg-[#FCA311] text-[#14213D] px-5 py-2.5 rounded-md font-semibold hover:bg-[#14213D] hover:text-white">
                      {editingMaintenanceId ? "Save changes" : "Create record"}
                    </button>
                    {editingMaintenanceId && <button type="button" onClick={() => { setEditingMaintenanceId(null); setMaintenanceForm({ vehicleId: "", description: "", scheduledDate: "", status: "Scheduled" }); }} className="border border-[#E5E5E5] px-5 py-2.5 rounded-md">Cancel</button>}
                  </div>
                </form>}
                <div className="space-y-3">
                  {maintenanceRecords.map((record) => (
                    <article key={record._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-[#E5E5E5] rounded-lg p-4">
                      <div>
                        <h4 className="font-semibold text-[#14213D]">{record.vehicleId?.make} {record.vehicleId?.model}</h4>
                        <p className="text-sm">{record.description || "Maintenance record"}</p>
                        <p className="text-sm text-gray-600">{record.scheduledDate ? new Date(record.scheduledDate).toLocaleDateString() : "No scheduled date"} · {record.status}</p>
                      </div>
                      <div className="flex gap-2">
                        {(isAdmin || isFleetManager) && <button onClick={() => handleEditMaintenance(record)} className="border border-[#14213D] text-[#14213D] px-3 py-2 rounded-md text-sm font-semibold">Edit</button>}
                        {isAdmin && <button onClick={() => handleDeleteMaintenance(record._id)} className="border border-[#E5E5E5] px-3 py-2 rounded-md text-sm font-semibold">Remove</button>}
                      </div>
                    </article>
                  ))}
                  {maintenanceRecords.length === 0 && <p className="text-center py-8 text-gray-600">No maintenance records</p>}
                </div>
              </section>
            )}

            {(isAdmin || isFleetManager || isManager) && selectedTab === "locations" && (
              <section className="space-y-6">
                {(isAdmin || isFleetManager) && <form onSubmit={handleLocationSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-[#E5E5E5] rounded-lg p-4 sm:p-6">
                  <h3 className="md:col-span-3 text-xl font-bold text-[#14213D]">
                    {editingLocationId ? "Update location" : "Add location"}
                  </h3>
                  <input name="name" value={locationForm.name} onChange={handleLocationChange} placeholder="Location name" required className="px-3 py-3 border border-[#E5E5E5] rounded-md" />
                  <input name="city" value={locationForm.city} onChange={handleLocationChange} placeholder="City" className="px-3 py-3 border border-[#E5E5E5] rounded-md" />
                  <input name="address" value={locationForm.address} onChange={handleLocationChange} placeholder="Street address" className="px-3 py-3 border border-[#E5E5E5] rounded-md" />
                  <div className="md:col-span-3 flex gap-3">
                    <button type="submit" className="bg-[#FCA311] text-[#14213D] px-5 py-2.5 rounded-md font-semibold hover:bg-[#14213D] hover:text-white">
                      {editingLocationId ? "Save changes" : "Add location"}
                    </button>
                    {editingLocationId && <button type="button" onClick={() => { setEditingLocationId(null); setLocationForm({ name: "", city: "", address: "" }); }} className="border border-[#E5E5E5] px-5 py-2.5 rounded-md">Cancel</button>}
                  </div>
                </form>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {locations.map((location) => (
                    <article key={location._id} className="flex items-center justify-between gap-3 border border-[#E5E5E5] rounded-lg p-4">
                      <div>
                        <h4 className="font-semibold text-[#14213D]">{location.name}</h4>
                        <p className="text-sm text-gray-600">{[location.address, location.city].filter(Boolean).join(", ")}</p>
                      </div>
                      {(isAdmin || isFleetManager) && <div className="flex gap-2">
                        <button onClick={() => handleEditLocation(location)} className="border border-[#14213D] text-[#14213D] px-3 py-2 rounded-md text-sm font-semibold">Edit</button>
                        <button onClick={() => handleDeleteLocation(location._id)} className="border border-[#E5E5E5] px-3 py-2 rounded-md text-sm font-semibold">Remove</button>
                      </div>}
                    </article>
                  ))}
                  {locations.length === 0 && <p className="text-center py-8 text-gray-600">No locations configured</p>}
                </div>
              </section>
            )}

            {(isAdmin || isPaymentStaff || isManager) && selectedTab === "payments" && (
              <section className="space-y-5">
                <div className="flex flex-wrap gap-2 border-b border-[#E5E5E5] pb-3">
                  <button
                    onClick={() => setSelectedPaymentView("pending")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold ${
                      selectedPaymentView === "pending"
                        ? "bg-[#FCA311] text-[#14213D]"
                        : "border border-[#E5E5E5] text-[#14213D]"
                    }`}
                  >
                    Pending payments ({paymentBookings.filter((booking) => booking.paymentStatus === "Pending").length})
                  </button>
                  <button
                    onClick={() => setSelectedPaymentView("history")}
                    className={`px-4 py-2 rounded-md text-sm font-semibold ${
                      selectedPaymentView === "history"
                        ? "bg-[#FCA311] text-[#14213D]"
                        : "border border-[#E5E5E5] text-[#14213D]"
                    }`}
                  >
                    Payment history
                  </button>
                </div>

                {displayedPayments.length === 0 ? (
                  <p className="text-center py-10 text-gray-600">
                    {selectedPaymentView === "pending"
                      ? "No pending payments"
                      : "No payment history"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {displayedPayments.map((booking) => (
                      <article
                        key={booking._id}
                        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border border-[#E5E5E5] rounded-lg p-4 sm:p-5"
                      >
                        <div className="min-w-0">
                          <h4 className="font-semibold text-[#14213D]">
                            {booking.userId?.name || "Customer"} · {booking.vehicleId?.make} {booking.vehicleId?.model}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Booking #{booking._id} · {booking.totalDays} days · ${booking.totalPrice}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.paymentMethod || "Payment method not set"}
                            {booking.paymentReference ? ` · Ref ${booking.paymentReference}` : ""}
                            {booking.paymentDate ? ` · ${new Date(booking.paymentDate).toLocaleDateString()}` : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-md bg-[#E5E5E5] text-[#14213D] text-sm font-semibold">
                            {booking.paymentStatus}
                          </span>
                          {(isAdmin || isPaymentStaff) && booking.paymentStatus === "Pending" && booking.paymentReference && (
                            <button
                              onClick={() => handleConfirmPayment(booking.paymentReference)}
                              className="bg-[#FCA311] text-[#14213D] px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#14213D] hover:text-white"
                            >
                              Confirm payment
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {(isAdmin || isFleetManager) && (
        <AddVehicleModal
          isOpen={showAddVehicleModal}
          vehicle={editingVehicle}
          locations={locations}
          onClose={() => {
            setShowAddVehicleModal(false);
            setEditingVehicle(null);
          }}
          onSuccess={() => {
            fetchData();
            alert("Vehicle added successfully!");
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
