const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/auth/register-org
router.post("/register-org", authController.registerOrganization);

// POST /api/auth/login
router.post("/login", authController.login);

module.exports = router;
