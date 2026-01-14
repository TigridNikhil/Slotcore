const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middlewares/auth");

router.get("/settings", authMiddleware, notificationController.getSettings);
router.put("/settings", authMiddleware, notificationController.updateSettings);

module.exports = router;
