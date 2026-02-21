const { Schedule } = require("../models");
const { Op } = require("sequelize");

// GET /api/organization/schedules
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      where: { orgId: req.orgId },
      order: [["dayOfWeek", "ASC"]],
    });
    res.successResponse(schedules);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Error fetching schedules");
  }
};

// PUT /api/organization/schedules
// Bulk update or create schedules (expects array of 7 days)
exports.updateSchedules = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.forbidden(null, "Admin access required");
    }

    const { schedules } = req.body; // Array of objects
    if (!Array.isArray(schedules)) {
      return res.badRequest("Schedules must be an array");
    }

    const results = [];
    for (const s of schedules) {
      if (s.dayOfWeek === undefined) continue;

      // Find or Create logic
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
          breakStartTime: s.breakStartTime || null,
          breakEndTime: s.breakEndTime || null,
          isBreakActive: s.isBreakActive || false,
        });
      }
      results.push(record);
    }

    res.successResponse(results);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Error updating schedules");
  }
};
