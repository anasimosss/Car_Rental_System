const Maintenance = require("../models/Maintenance");
const Vehicle = require("../models/Vehicle");
const serializeModel = require("../utils/modelJson");

// Create maintenance record (admin only)
exports.createMaintenance = async (req, res) => {
  try {
    const { vehicleId, description, status, scheduledDate } = req.body;
    const maintenance = new Maintenance({
      vehicleId,
      description,
      status,
      scheduledDate,
    });
    await maintenance.save();
    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: "Failed to create maintenance record", error });
  }
};

// Get all maintenance records
exports.getAllMaintenance = async (req, res) => {
  try {
    const maintenanceRecords = await Maintenance.findAll({
      include: [{ model: Vehicle, as: "vehicle" }],
    });
    res.json(maintenanceRecords.map((record) => serializeModel(record, { vehicle: "vehicleId" })));
  } catch (error) {
    res.status(500).json({ message: "Failed to get maintenance records", error });
  }
};

// Get maintenance by ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: "vehicle" }],
    });
    if (!maintenance) return res.status(404).json({ message: "Maintenance record not found" });
    res.json(serializeModel(maintenance, { vehicle: "vehicleId" }));
  } catch (error) {
    res.status(500).json({ message: "Failed to get maintenance record", error });
  }
};

// Update maintenance record
exports.updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id);
    if (!maintenance) return res.status(404).json({ message: "Maintenance record not found" });
    await maintenance.update(req.body);
    const updated = await Maintenance.findByPk(req.params.id, {
      include: [{ model: Vehicle, as: "vehicle" }],
    });
    res.json(serializeModel(updated, { vehicle: "vehicleId" }));
  } catch (error) {
    res.status(500).json({ message: "Failed to update maintenance record", error });
  }
};

// Delete maintenance record
exports.deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByPk(req.params.id);
    if (!maintenance) return res.status(404).json({ message: "Maintenance record not found" });
    await maintenance.destroy();
    res.json({ message: "Maintenance record deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete maintenance record", error });
  }
};