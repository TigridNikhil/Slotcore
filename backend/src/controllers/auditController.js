const { AuditLog, User } = require("../models");

exports.getBookingLogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Check permissions (Admin/Staff only)
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const logs = await AuditLog.findAll({
      where: { entityId: id, entityType: "Booking" },
      order: [["createdAt", "DESC"]],
    });

    res.successResponse(logs);
  } catch (error) {
    console.error("Get Logs Error:", error);
    res.serverError(error.message, "Failed to fetch logs");
  }
};
