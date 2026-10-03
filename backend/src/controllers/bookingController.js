const Booking = require("../models/Booking");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const Location = require("../models/Location");
const serializeModel = require("../utils/modelJson");

const bookingRelations = [
  { model: User, as: "user" },
  { model: User, as: "verifier" },
  { model: Vehicle, as: "vehicle" },
  { model: Location, as: "pickupLocation" },
  { model: Location, as: "dropoffLocation" },
];

const bookingRelationNames = {
  user: "userId",
  verifier: "verifiedBy",
  vehicle: "vehicleId",
  pickupLocation: "pickupLocationId",
  dropoffLocation: "dropoffLocationId",
};

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    console.log("=== CREATE BOOKING REQUEST ===");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const {
      vehicleId,
      pickupDate,
      returnDate,
      pickupLocationId,
      dropoffLocationId,
      customerInfo,
    } = req.body;

    // Validate required fields
    if (
      !vehicleId ||
      !pickupDate ||
      !returnDate ||
      !pickupLocationId ||
      !dropoffLocationId ||
      !customerInfo
    ) {
      return res.status(400).json({
        message: "All fields are required including customer information",
        missing: {
          vehicleId: !vehicleId,
          pickupDate: !pickupDate,
          returnDate: !returnDate,
          pickupLocationId: !pickupLocationId,
          dropoffLocationId: !dropoffLocationId,
          customerInfo: !customerInfo,
        },
      });
    }

    // Validate customer info fields
    if (customerInfo) {
      const requiredFields = [
        "idNumber",
        "idType",
        "driverLicenseNumber",
        "licenseExpiryDate",
        "emergencyContact",
        "emergencyPhone",
      ];
      const missingFields = requiredFields.filter(
        (field) => !customerInfo[field]
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "Missing required customer information",
          missingFields,
        });
      }
    }

    // Get vehicle to calculate price
    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    console.log("Vehicle found:", vehicle.make, vehicle.model);
    console.log("Vehicle pricing:", vehicle.pricing);

    // Calculate total days
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const totalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      return res
        .status(400)
        .json({ message: "Return date must be after pickup date" });
    }

    // Calculate total price - check if pricing exists
    if (!vehicle.pricing || !vehicle.pricing.daily) {
      return res.status(500).json({
        message: "Vehicle pricing not configured",
        vehicleId: vehicle._id,
      });
    }

    const totalPrice = totalDays * vehicle.pricing.daily;

    // Use _id if id is not available
    const userId = req.user._id || req.user.id;

    console.log("Creating booking with userId:", userId);

    const booking = new Booking({
      userId: userId,
      vehicleId,
      pickupDate,
      returnDate,
      pickupLocationId,
      dropoffLocationId,
      customerInfo,
      totalDays,
      totalPrice,
      status: "Pending",
      verificationStatus: "Pending",
    });

    await booking.save();
    console.log("Booking created successfully:", booking._id);
    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

// Get all bookings (admin and booking staff)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: bookingRelations.slice(0, 3).filter((relation) => relation.as !== "verifier"),
    });
    res.json(bookings.map((booking) => serializeModel(booking, bookingRelationNames)));
  } catch (error) {
    res.status(500).json({ message: "Failed to get bookings", error });
  }
};

// Get my bookings (user)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Vehicle, as: "vehicle" }],
    });
    res.json(bookings.map((booking) => serializeModel(booking, { vehicle: "vehicleId" })));
  } catch (error) {
    res.status(500).json({ message: "Failed to get your bookings", error });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: bookingRelations.filter((relation) => ["user", "vehicle"].includes(relation.as)),
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(serializeModel(booking, bookingRelationNames));
  } catch (error) {
    res.status(500).json({ message: "Failed to get booking", error });
  }
};

// Admin or booking staff: Verify/Approve booking
exports.verifyBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body; // status: 'Approved' or 'Rejected'

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.verificationStatus = status;
    booking.verifiedBy = req.user._id || req.user.id;
    booking.verificationDate = new Date();
    booking.verificationNotes = notes || "";

    if (status === "Approved") {
      booking.status = "Confirmed";
    } else if (status === "Rejected") {
      booking.status = "Cancelled";
    }

    await booking.save();

    const updatedBooking = await Booking.findByPk(id, {
      include: bookingRelations.filter((relation) => ["user", "vehicle", "verifier"].includes(relation.as)),
    });
    res.json({
      message: `Booking ${status.toLowerCase()} successfully`,
      booking: serializeModel(updatedBooking, bookingRelationNames),
    });
  } catch (error) {
    console.error("Verification error:", error);
    res
      .status(500)
      .json({ message: "Failed to verify booking", error: error.message });
  }
};

// Admin or booking staff: Get pending bookings for verification
exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { verificationStatus: "Pending" },
      include: bookingRelations.filter((relation) => relation.as !== "verifier"),
      order: [["createdAt", "DESC"]],
    });
    res.json(bookings.map((booking) => serializeModel(booking, bookingRelationNames)));
  } catch (error) {
    res.status(500).json({ message: "Failed to get pending bookings", error });
  }
};
