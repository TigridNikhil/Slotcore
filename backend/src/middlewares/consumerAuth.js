const jwt = require("jsonwebtoken");
const { Consumer } = require("../models");

const consumerAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_dev_key",
    );

    if (decoded.role !== "consumer") {
      return res
        .status(403)
        .json({ error: "Access denied. Consumer role required." });
    }

    const consumer = await Consumer.findByPk(decoded.userId);
    if (!consumer) {
      return res.status(404).json({ error: "Consumer profile not found" });
    }

    req.consumer = consumer;
    req.user = { email: consumer.email, role: "consumer", id: consumer.id }; // Compatibility
    next();
  } catch (error) {
    console.error("Consumer Auth Error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = consumerAuth;
