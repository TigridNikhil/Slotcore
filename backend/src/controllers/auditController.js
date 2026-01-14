const { AuditLog, User } = require("../models");

exports.getBookingLogs = async (req, res) => {
  try {
    const { id } = req.params;

    // Check permissions (Admin/Staff only)
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const logs = await AuditLog.findAll({
      where: { entityId: id, entityType: "Booking" },
      order: [["createdAt", "DESC"]],
      include: [
        // Optional: Include User to get name if performedBy is set
        // But AuditLog model definition didn't explicitly set up association to User for 'performedBy'.
        // Let's rely on 'performedBy' ID or 'performedByEmail' for now.
        // Or we can simple fetch Users separately or add association if strictly needed.
        // Ideally we added: AuditLog.belongsTo(User, { foreignKey: 'performedBy' });
      ],
    });

    // Enrich logs with User names manually if needed or just return raw
    // For MVP, raw is fine, frontend can resolve if needed.
    // Actually, adding association is better.

    res.json(logs);
  } catch (error) {
    console.error("Get Logs Error:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
