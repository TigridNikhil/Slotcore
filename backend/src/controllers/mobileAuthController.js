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
      return res.badRequest("Email is required");
    }

    // Find or create consumer
    let consumer = await Consumer.findOne({ where: { email } });
    if (!consumer && type !== "signup") {
      return res.notFound("User not found ! Please Sign Up");
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
      return res.serverError(null, "Failed to send OTP email");
    }

    res.successResponse(null, "OTP sent successfully");
  } catch (error) {
    console.error("Request OTP Error:", error);
    res.serverError(error.message, "Internal Server Error");
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.badRequest("Email and OTP are required");
    }

    const consumer = await Consumer.findOne({ where: { email } });

    if (!consumer) {
      return res.notFound("User not found");
    }

    // Check OTP
    if (consumer.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    // Check Expiry
    if (new Date() > consumer.otpExpiresAt) {
      return res
        .status(401)
        .json({ success: false, message: "OTP has expired" });
    }

    // Success: Clear OTP and Verify
    consumer.otp = null;
    consumer.otpExpiresAt = null;
    consumer.isVerified = true;
    await consumer.save();

    // Generate Tokens
    const accesstoken = jwt.sign(
      {
        userId: consumer.id,
        role: "consumer",
        email: consumer.email,
      },
      process.env.JWT_SECRET || "secret_dev_key",
      { expiresIn: "1d" },
    );

    const refreshtoken = jwt.sign(
      { userId: consumer.id },
      process.env.JWT_REFRESH_SECRET || "refresh_secret_dev_key",
      { expiresIn: "7d" },
    );

    res.successResponse(
      {
        accesstoken,
        refreshtoken,
        user: {
          id: consumer.id,
          email: consumer.email,
          name: consumer.name,
          role: "consumer",
        },
      },
      "Login successful",
    );
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.serverError(error.message, "Internal Server Error");
  }
};
