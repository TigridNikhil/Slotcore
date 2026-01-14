const { AuditLog } = require("../models");

exports.log = async (
  orgId,
  entityType,
  entityId,
  action,
  req,
  changes = null
) => {
  try {
    const performedBy = req.user ? req.user.userId : null;
    const body = req.body || {};
    const performedByEmail = body.email || body.customerEmail || null;

    // Get IP
    const ipAddress =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    await AuditLog.create({
      orgId,
      entityType,
      entityId,
      action,
      performedBy,
      performedByEmail: performedBy ? null : performedByEmail, // Prefer User ID if known
      ipAddress,
      changes,
    });
  } catch (error) {
    console.error("Audit Log Error:", error);
    // Don't crash the main flow if audit fails
  }
};
