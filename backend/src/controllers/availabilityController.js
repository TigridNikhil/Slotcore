const { AvailabilityOverride } = require("../models");
const { Op } = require("sequelize");

// GET /api/organization/overrides
exports.getOverrides = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { orgId: req.orgId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }

    const overrides = await AvailabilityOverride.findAll({
      where,
      order: [["date", "ASC"]],
    });
    res.successResponse(overrides);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Error fetching overrides");
  }
};

// POST /api/organization/overrides
exports.createOverride = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.forbidden(null, "Admin access required");
    }

    const { date, startTime, endTime, isOff } = req.body;
    if (!date) {
      return res.badRequest("Date is required");
    }

    const override = await AvailabilityOverride.create({
      orgId: req.orgId,
      date,
      startTime,
      endTime,
      isOff: isOff || false,
    });

    res.status(201).successResponse(override);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Error creating override");
  }
};

// DELETE /api/organization/overrides/:id
exports.deleteOverride = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.forbidden(null, "Admin access required");
    }

    const { id } = req.params;
    const deleted = await AvailabilityOverride.destroy({
      where: { id, orgId: req.orgId },
    });

    if (!deleted) return res.notFound("Override not found");

    res.successResponse(null, "Override deleted");
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Error deleting override");
  }
};
