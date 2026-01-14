const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    // Role Hierarchy Mapping (Higher value = more permissions)
    const roles = {
      viewer: 1,
      staff: 2,
      org_admin: 3,
      super_admin: 4,
      admin: 3, // Legacy support
    };

    const userRole = req.user.role;
    const userLevel = roles[userRole] || 0;

    // Check if user has at least one of the allowed roles
    // OR if we want hierarchy-based check?
    // Usually "allowedRoles" implies specific roles.
    // implementation: if allow ['org_admin'], staff (lower) cannot access.

    // Simplest: Check if allowedRoles includes userRole.
    // Enhanced: Check logic.

    // If allowedRoles is empty, allow all authenticated? No, usually implies open to all roles.
    if (allowedRoles.length === 0) {
      return next();
    }

    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Hierarchy Support:
    // If allowed is 'staff', org_admin should also pass.
    // Find min level required
    const levelsRequired = allowedRoles.map((r) => roles[r]);
    const minLevel = Math.min(...levelsRequired); // e.g. Staff(2)

    if (userLevel >= minLevel) {
      return next();
    }

    return res
      .status(403)
      .json({ error: "Forbidden: Insufficient permissions" });
  };
};

module.exports = authorize;
