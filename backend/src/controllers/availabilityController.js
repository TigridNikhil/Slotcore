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
    res.json(overrides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching overrides" });
  }
};

// POST /api/organization/overrides
exports.createOverride = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { date, startTime, endTime, isOff } = req.body;
    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const override = await AvailabilityOverride.create({
      orgId: req.orgId,
      date,
      startTime,
      endTime,
      isOff: isOff || false,
    });

    res.status(201).json(override);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating override" });
  }
};

// DELETE /api/organization/overrides/:id
exports.deleteOverride = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { id } = req.params;
    const deleted = await AvailabilityOverride.destroy({
      where: { id, orgId: req.orgId },
    });

    if (!deleted) return res.status(404).json({ error: "Override not found" });

    res.json({ message: "Override deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting override" });
  }
};
