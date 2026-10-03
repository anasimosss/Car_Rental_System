const express = require('express');
const router = express.Router();
const { protect, fleetManager } = require('../middleware/auth');
const {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');

// Create location (admin and fleet manager)
router.post('/', protect, fleetManager, createLocation);

// Get all locations
router.get('/', getAllLocations);

// Get location by ID
router.get('/:id', getLocationById);

// Update location (admin and fleet manager)
router.put('/:id', protect, fleetManager, updateLocation);

// Delete location (admin and fleet manager)
router.delete('/:id', protect, fleetManager, deleteLocation);

module.exports = router;