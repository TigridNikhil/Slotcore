const { Consumer } = require("../models");
const emailService = require("../services/emailService");
const jwt = require("jsonwebtoken");

// Helper to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.requestOtp = async (req, res) => {
  try {
    const { email, name, mobile, type } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find or create consumer
    let consumer = await Consumer.findOne({ where: { email } });
    if (!consumer && type !== "signup") {
      return res.status(404).json({ error: "User not found ! Please Sign Up" });
    }
    if (!consumer && type === "signup") {
      consumer = await Consumer.create({ email, name, mobile });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save OTP & Details
    consumer.otp = otp;
    consumer.otpExpiresAt = otpExpiresAt;
    await consumer.save();

    // Send Email
    const sent = await emailService.sendOtp(email, otp);
    if (!sent) {
      return res.status(500).json({ error: "Failed to send OTP email" });
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Request OTP Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const consumer = await Consumer.findOne({ where: { email } });

    if (!consumer) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check OTP
    if (consumer.otp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // Check Expiry
    if (new Date() > consumer.otpExpiresAt) {
      return res.status(401).json({ error: "OTP has expired" });
    }

    // Success: Clear OTP and Verify
    consumer.otp = null;
    consumer.otpExpiresAt = null;
    consumer.isVerified = true;
    await consumer.save();

    // Generate Token
    // Distinguish from regular users by role 'consumer'
    const token = jwt.sign(
      {
        userId: consumer.id,
        role: "consumer",
        email: consumer.email,
      },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "7d" }, // Long lived for mobile
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: consumer.id,
        email: consumer.email,
        name: consumer.name,
        role: "consumer",
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
