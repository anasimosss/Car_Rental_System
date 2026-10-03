const express = require("express");
const router = express.Router();
const { protect, fleetManager } = require("../middleware/auth");
const {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
} = require("../controllers/vehicleController");

// Create a new vehicle (admin and fleet manager)
router.post("/", protect, fleetManager, createVehicle);

// Get all vehicles
router.get("/", getVehicles);

// Get single vehicle
router.get("/:id", getVehicleById);

// Update vehicle (admin and fleet manager)
router.put("/:id", protect, fleetManager, updateVehicle);

// Update vehicle status (admin and fleet manager)
router.patch("/:id/status", protect, fleetManager, updateVehicleStatus);

// Delete vehicle (admin and fleet manager)
router.delete("/:id", protect, fleetManager, deleteVehicle);

module.exports = router;
