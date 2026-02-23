const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingController");
const authorize = require("../middlewares/authorize");
const auth = require("../middlewares/auth");

// Create Razorpay order for plan subscription
router.post(
  "/create-order",
  auth,
  authorize(["org_admin", "admin"]),
  billingController.createSubscriptionOrder,
);

// Verify Razorpay payment
router.post(
  "/verify",
  auth,
  authorize(["org_admin", "admin"]),
  billingController.verifySubscriptionPayment,
);

// Get billing history
router.get(
  "/history",
  auth,
  authorize(["org_admin", "admin"]),
  billingController.getBillingHistory,
);

// Switch billing cycle (yearly → monthly, free)
router.post(
  "/switch-cycle",
  auth,
  authorize(["org_admin", "admin"]),
  billingController.switchCycle,
);

module.exports = router;
