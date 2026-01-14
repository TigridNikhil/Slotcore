const express = require("express");
const router = express.Router();
const platformController = require("../controllers/platformController");

// In a real app, add Super Admin Auth Middleware here
// router.use(requireSuperAdmin);

// Auth
router.post("/login", platformController.login);

// Protected (Ideally)
router.get("/stats", platformController.getDashboardStats);
router.get("/organizations/:id/stats", platformController.getOrgStats);
router.get("/organizations", platformController.getAllOrganizations);
router.put(
  "/organizations/:id/marketplace",
  platformController.updateMarketplaceSettings
);

router.get("/audit-logs", platformController.getAuditLogs);

const reviewController = require("../controllers/reviewController");
router.get("/reviews", reviewController.listReviews);
router.patch("/reviews/:id/moderation", reviewController.moderateReview);

module.exports = router;
