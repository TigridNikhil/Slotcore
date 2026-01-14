const express = require("express");
const router = express.Router();
const integrationController = require("../controllers/integrationController");
const auth = require("../middlewares/auth");

// Common Auth Middleware for getting orgId
// Public routes (callbacks) probably can't have 'auth' middleware depending on session
// But standard "connect" button will use auth token to get URL.

// 1. Get List of Integrations (Protected)
router.get("/", auth, integrationController.getIntegrations);

// 2. Get Auth URL (Protected - needs orgId from token to pass as state)
router.get("/:provider/auth-url", auth, integrationController.getAuthUrl);

// 3. Callback (Public - Google calls this with code)
// Note: We need to handle safety here. The 'state' parameter will contain orgId.
router.get("/:provider/callback", integrationController.callback);

// 4. Disconnect (Protected)
router.delete("/:provider", auth, integrationController.disconnect);

module.exports = router;
