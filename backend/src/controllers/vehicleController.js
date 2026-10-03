const Vehicle = require("../models/Vehicle");
const cloudinary = require("../config/cloudinary");

exports.createVehicle = async (req, res) => {
  try {
    const {
      make,
      model,
      year,
      color,
      category,
      specifications,
      pricing,
      locationId,
    } = req.body;
    let images = [];
    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "car-rental/vehicles",
        });
        images.push(result.secure_url);
      }
    }
    const vehicle = new Vehicle({
      make,
      model,
      year,
      color,
      category,
      specifications,
      pricing,
      locationId,
      images,
    });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getVehicles = async (req, res) => {
  const vehicles = await Vehicle.findAll();
  res.json(vehicles);
};

exports.getVehicleById = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  res.json(vehicle);
};

exports.updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
  await vehicle.update(req.body);
  res.json(vehicle);
};

exports.deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findByPk(req.params.id);
  if (vehicle) await vehicle.destroy();
  res.json({ message: "Vehicle deleted" });
};

// Update vehicle availability status
exports.updateVehicleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Available", "Rented", "Maintenance", "Unavailable"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await vehicle.update({ status });

    res.json({ message: "Vehicle status updated", vehicle });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to update vehicle status",
        error: error.message,
      });
  }
};
