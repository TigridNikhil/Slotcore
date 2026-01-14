const { Location } = require("../models");

exports.createLocation = async (req, res) => {
  try {
    const { name, address, timezone, contactEmail, contactPhone } = req.body;

    // Check permissions ? Assumed handled by middleware
    const location = await Location.create({
      orgId: req.tenant.id,
      name,
      address,
      timezone,
      contactEmail,
      contactPhone,
    });

    res.status(201).json(location);
  } catch (error) {
    console.error("Create Location Error:", error);
    res.status(500).json({ error: "Failed to create location" });
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      where: { orgId: req.tenant.id },
      order: [["name", "ASC"]],
    });
    res.json(locations);
  } catch (error) {
    console.error("Get Locations Error:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

exports.getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!location) return res.status(404).json({ error: "Location not found" });

    res.json(location);
  } catch (error) {
    res.status(500).json({ error: "Error fetching location" });
  }
};

exports.updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, timezone, contactEmail, contactPhone, isActive } =
      req.body;

    const location = await Location.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!location) return res.status(404).json({ error: "Location not found" });

    await location.update({
      name,
      address,
      timezone,
      contactEmail,
      contactPhone,
      isActive,
    });

    res.json(location);
  } catch (error) {
    console.error("Update Location Error:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!location) return res.status(404).json({ error: "Location not found" });

    await location.destroy();
    res.json({ success: true, message: "Location deleted" });
  } catch (error) {
    console.error("Delete Location Error:", error);
    res.status(500).json({ error: "Failed to delete location" });
  }
};
