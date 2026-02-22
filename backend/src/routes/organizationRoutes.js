const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const availabilityController = require("../controllers/availabilityController");
const organizationController = require("../controllers/organizationController");
const { publicApiLimiter } = require("../middlewares/rateLimiter");
const { checkPlanLimit } = require("../middlewares/restrictionMiddleware");

const auth = require("../middlewares/auth");

// GET /api/organization/public
// Requires tenant context (subdomain)
router.get("/public", publicApiLimiter, organizationController.getPublicInfo);

// GET /api/organization/stats
// Protected (Admin only)
router.get("/overview", auth, organizationController.getOverview);
router.get("/stats", auth, organizationController.getStats);
router.get("/settings", auth, organizationController.getSettings);
router.get("/report", auth, organizationController.generateReport);

// PUT /api/organization
// Protected (Admin only)
router.put("/", auth, organizationController.updateOrganization);
router.post("/upgrade", auth, organizationController.upgradePlan);

// Schedules
router.get("/schedules", auth, scheduleController.getSchedules);
router.put("/schedules", auth, scheduleController.updateSchedules);

// Availability Overrides
router.get("/overrides", auth, availabilityController.getOverrides);
router.post("/overrides", auth, availabilityController.createOverride);
router.delete("/overrides/:id", auth, availabilityController.deleteOverride);

// Team Management
const teamController = require("../controllers/teamController");
const authorize = require("../middlewares/authorize");

router.get(
  "/team",
  auth,
  authorize(["org_admin"]),
  teamController.getTeamMembers,
);
router.post(
  "/team",
  auth,
  authorize(["org_admin"]),
  checkPlanLimit("users"),
  teamController.addTeamMember,
);
router.put(
  "/team/:userId",
  auth,
  authorize(["org_admin"]),
  teamController.updateTeamMember,
);
router.delete(
  "/team/:userId",
  auth,
  authorize(["org_admin"]),
  teamController.removeTeamMember,
);

// Staff Schedules
const staffScheduleController = require("../controllers/staffScheduleController");
router.get(
  "/team/:userId/schedule",
  auth,
  authorize(["org_admin", "staff"]),
  staffScheduleController.getStaffSchedule,
);
router.put(
  "/team/:userId/schedule",
  auth,
  authorize(["org_admin"]),
  staffScheduleController.updateStaffSchedule,
);

// Reviews
const reviewController = require("../controllers/reviewController");
router.get(
  "/reviews",
  auth,
  authorize(["org_admin", "staff"]),
  reviewController.getVendorReviews,
);
router.patch(
  "/reviews/:id/moderation",
  auth,
  authorize(["org_admin"]),
  reviewController.moderateReview,
);

module.exports = router;
