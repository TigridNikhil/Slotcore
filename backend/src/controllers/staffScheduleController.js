const { StaffSchedule, User } = require("../models");

// GET /api/staff/:userId/schedule
exports.getStaffSchedule = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify user belongs to this org
    const user = await User.findOne({
      where: { id: userId, orgId: req.orgId },
    });
    if (!user) return res.notFound("Staff not found");

    const schedules = await StaffSchedule.findAll({
      where: { userId },
      order: [["dayOfWeek", "ASC"]],
    });

    res.successResponse(schedules);
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Failed to fetch staff schedule");
  }
};

// PUT /api/staff/:userId/schedule
exports.updateStaffSchedule = async (req, res) => {
  try {
    const { userId } = req.params;
    const { schedules } = req.body; // Array of day configs

    // Verify user belongs to this org
    const user = await User.findOne({
      where: { id: userId, orgId: req.orgId },
    });
    if (!user) return res.notFound("Staff not found");

    // Validation
    if (!Array.isArray(schedules)) {
      return res.badRequest("Schedules must be an array");
    }

    // Upsert logic
    const transaction = await StaffSchedule.sequelize.transaction();
    try {
      for (const day of schedules) {
        await StaffSchedule.upsert(
          {
            userId: userId,
            dayOfWeek: day.dayOfWeek,
            startTime: day.startTime || "09:00",
            endTime: day.endTime || "17:00",
            isActive: day.isActive,
            // Postgres requires NULL for empty time, not empty string
            breakStartTime: day.breakStartTime ? day.breakStartTime : null,
            breakEndTime: day.breakEndTime ? day.breakEndTime : null,
            isBreakActive: day.isBreakActive,
          },
          { transaction },
        );
      }
      await transaction.commit();
      res.successResponse(null, "Schedule updated successfully");
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error(error);
    res.serverError(error.message, "Failed to update staff schedule");
  }
};
