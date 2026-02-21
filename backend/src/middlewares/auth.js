const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader) {
    token = authHeader.split(" ")[1];
  } else if (req.query.token) {
    // Fallback for file downloads (CSV, PDF)
    token = req.query.token;
  }

  if (!token) {
    return res.unauthorized(null, "Token missing");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_dev_key",
    );
    req.user = decoded;

    console.log("Decoded token:", decoded);

    // Safety check: ensure token matches current tenant if tenant is resolved
    // EXCEPTION: Consumers (Mobile App Users) are not tied to an org
    if (
      req.orgId &&
      req.user.role !== "consumer" &&
      req.user.orgId !== req.orgId
    ) {
      return res.forbidden(
        null,
        "Access denied: User does not belong to this organization.",
      );
    }

    next();
  } catch (err) {
    return res.unauthorized(null, "Invalid token");
  }
};
