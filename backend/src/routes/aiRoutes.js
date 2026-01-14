const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const auth = require("../middlewares/auth");

// Protected routes (Org Admins only)
router.post("/generate-site-content", auth, aiController.generateSiteContent);
router.post(
  "/generate-service-desc",
  auth,
  aiController.generateServiceDescriptions
);

module.exports = router;
