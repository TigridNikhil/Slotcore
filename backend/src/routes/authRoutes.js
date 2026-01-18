const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const mobileAuthController = require("../controllers/mobileAuthController");

// POST /api/auth/register-org
router.post("/register-org", authController.registerOrganization);

// POST /api/auth/login
router.post("/login", authController.login);

// Mobile OTP Routes
router.post("/mobile/otp/request", mobileAuthController.requestOtp);
router.post("/mobile/otp/verify", mobileAuthController.verifyOtp);

module.exports = router;
