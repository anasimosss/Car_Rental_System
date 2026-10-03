const Location = require("../models/Location");

// Create location (admin only)
exports.createLocation = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    const location = new Location({ name, city, address });
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: "Failed to create location", error });
  }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: "Failed to get locations", error });
  }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: "Failed to get location", error });
  }
};

// Update location (admin only)
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    await location.update(req.body);
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: "Failed to update location", error });
  }
};

// Delete location (admin only)
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });
    await location.destroy();
    res.json({ message: "Location deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete location", error });
  }
};