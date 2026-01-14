const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const serviceImportController = require("../controllers/serviceImportController");
const auth = require("../middlewares/auth");
const { publicApiLimiter } = require("../middlewares/rateLimiter");

// Public read
router.get("/", publicApiLimiter, serviceController.listServices);
router.post("/", auth, serviceController.createService);
router.put("/:id", auth, serviceController.updateService);
router.delete("/:id", auth, serviceController.deleteService);

// Bulk Import
router.get("/template", auth, serviceImportController.downloadTemplate);
router.post("/import", auth, serviceImportController.importServices);

module.exports = router;
