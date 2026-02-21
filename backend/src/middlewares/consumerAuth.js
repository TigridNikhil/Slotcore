const jwt = require("jsonwebtoken");
const { Consumer } = require("../models");

const consumerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.unauthorized(null, "Authorization required");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.unauthorized(null, "Token missing");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_dev_key",
    );

    if (decoded.role !== "consumer") {
      return res.forbidden(null, "Access denied. Consumer role required.");
    }

    const consumer = await Consumer.findByPk(decoded.userId);
    if (!consumer) {
      return res.notFound("Consumer profile not found");
    }

    req.consumer = consumer;
    req.user = { email: consumer.email, role: "consumer", id: consumer.id }; // Compatibility
    next();
  } catch (error) {
    console.error("Consumer Auth Error:", error);
    return res.unauthorized(null, "Invalid token");
  }
};

module.exports = consumerAuth;
