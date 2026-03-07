const express = require("express");
const router = express.Router();
const apiKeyController = require("../controllers/apiKeyController");
const webhookController = require("../controllers/webhookController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

// Middleware for all platform management routes
router.use(auth);
router.use(authorize(["org_admin", "admin"]));

// API Keys
router.get("/keys", apiKeyController.listKeys);
router.post("/keys", apiKeyController.createKey);
router.delete("/keys/:id", apiKeyController.deleteKey);
router.patch("/keys/:id/toggle", apiKeyController.toggleKey);

// Webhooks
router.get("/webhooks", webhookController.listWebhooks);
router.post("/webhooks", webhookController.createWebhook);
router.delete("/webhooks/:id", webhookController.deleteWebhook);
router.get("/webhooks/:id/events", webhookController.listEvents);

module.exports = router;
