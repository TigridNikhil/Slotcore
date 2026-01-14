const { Schedule } = require("../models");
const { Op } = require("sequelize");

// GET /api/organization/schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      where: { orgId: req.orgId },
      order: [["dayOfWeek", "ASC"]],
    });
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching schedules" });
  }
};

// PUT /api/organization/schedules
// Bulk update or create schedules (expects array of 7 days)
exports.updateSchedules = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { schedules } = req.body; // Array of objects
    if (!Array.isArray(schedules)) {
      return res.status(400).json({ error: "Schedules must be an array" });
    }

    // Transaction? Maybe overkill but safer.
    // For simplicity, we'll loop and upset.
    const results = [];
    for (const s of schedules) {
      if (s.dayOfWeek === undefined) continue;

      // Find or Create logic
      // We want to ensure one entry per dayOfWeek per Org
      const [record, created] = await Schedule.findOrCreate({
        where: { orgId: req.orgId, dayOfWeek: s.dayOfWeek },
        defaults: {
          startTime: s.startTime || "09:00",
          endTime: s.endTime || "17:00",
          isActive: s.isActive !== undefined ? s.isActive : true,
          breakStartTime: s.breakStartTime || null,
          breakEndTime: s.breakEndTime || null,
          isBreakActive: s.isBreakActive || false,
        },
      });

      if (!created) {
        await record.update({
          startTime: s.startTime,
          endTime: s.endTime,
          isActive: s.isActive,
          breakStartTime: s.breakStartTime,
          breakEndTime: s.breakEndTime,
          isBreakActive: s.isBreakActive,
        });
      }
      results.push(record);
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating schedules" });
  }
};
