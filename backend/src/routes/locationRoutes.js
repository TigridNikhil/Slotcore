const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const { checkPlanLimit } = require("../middlewares/restrictionMiddleware");

const { publicApiLimiter } = require("../middlewares/rateLimiter");

// Public read
router.get("/", publicApiLimiter, locationController.getLocations);

// Require Auth for management
router.use(auth);

// Manage (Admins only)
router.post(
  "/",
  authorize(["admin", "org_admin"]),
  checkPlanLimit("locations"),
  locationController.createLocation,
);
router.get(
  "/:id",
  authorize(["admin", "org_admin", "staff"]),
  locationController.getLocation,
);
router.put(
  "/:id",
  authorize(["admin", "org_admin"]),
  locationController.updateLocation,
);
router.delete(
  "/:id",
  authorize(["admin", "org_admin"]),
  locationController.deleteLocation,
);

module.exports = router;
