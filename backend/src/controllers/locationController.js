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

    res.status(201).successResponse(location);
  } catch (error) {
    console.error("Create Location Error:", error);
    res.serverError(error.message, "Failed to create location");
  }
};

exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      where: { orgId: req.tenant.id },
      order: [["name", "ASC"]],
    });
    res.successResponse(locations);
  } catch (error) {
    console.error("Get Locations Error:", error);
    res.serverError(error.message, "Failed to fetch locations");
  }
};

exports.getLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!location) return res.notFound("Location not found");

    res.successResponse(location);
  } catch (error) {
    res.serverError(error.message, "Error fetching location");
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

    if (!location) return res.notFound("Location not found");

    await location.update({
      name,
      address,
      timezone,
      contactEmail,
      contactPhone,
      isActive,
    });

    res.successResponse(location);
  } catch (error) {
    console.error("Update Location Error:", error);
    res.serverError(error.message, "Failed to update location");
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({
      where: { id, orgId: req.tenant.id },
    });

    if (!location) return res.notFound("Location not found");

    await location.destroy();
    res.successResponse(null, "Location deleted");
  } catch (error) {
    console.error("Delete Location Error:", error);
    res.serverError(error.message, "Failed to delete location");
  }
};
