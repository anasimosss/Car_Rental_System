const express = require('express');
const router = express.Router();
const { protect, admin, fleetManager, fleetReader } = require('../middleware/auth');
const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance
} = require('../controllers/maintenanceController');

// Create maintenance record (admin and fleet manager)
router.post('/', protect, fleetManager, createMaintenance);

// Get all maintenance records (admin and fleet manager)
router.get('/', protect, fleetReader, getAllMaintenance);

// Get maintenance by ID (admin and fleet manager)
router.get('/:id', protect, fleetReader, getMaintenanceById);

// Update maintenance record (admin and fleet manager)
router.put('/:id', protect, fleetManager, updateMaintenance);

// Delete maintenance record (admin only)
router.delete('/:id', protect, admin, deleteMaintenance);

module.exports = router;