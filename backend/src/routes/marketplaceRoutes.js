const express = require("express");
const router = express.Router();
const marketplaceController = require("../controllers/marketplaceController");

// Public routes (no auth required)
router.get("/organizations", marketplaceController.listOrganizations);
router.get("/organizations/:slug", marketplaceController.getOrganizationBySlug);
router.post("/track", marketplaceController.trackEvent);

// Reviews
const reviewController = require("../controllers/reviewController");
router.post("/reviews/submit", reviewController.submitReview);
router.get(
  "/reviews/booking/:bookingId",
  reviewController.getBookingInfoForReview,
);
router.get("/orgs/:orgId/reviews", reviewController.getOrgReviews);

module.exports = router;
