const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/auth"); // Optional? Usually public or auth required
const { checkFeatureEnabled } = require("../middlewares/restrictionMiddleware");

router.post(
  "/order",
  checkFeatureEnabled("onlinePayments"),
  paymentController.createOrder,
); // Public/Guest allow

// Get Org Payments (Org Admin)
router.get("/payments", authMiddleware, paymentController.getOrgPayments);

// Verify Payment
router.post(
  "/verify",
  checkFeatureEnabled("onlinePayments"),
  paymentController.verifyPayment,
);

// Mark Settlement (Admin only)
router.post("/payout/:id", authMiddleware, paymentController.markSettled);

// Get Ledger (Protected: Org Admin only)
router.get("/ledger", authMiddleware, paymentController.getLedger);

// Export CSV
router.get("/export/csv", authMiddleware, paymentController.exportLedger);

// Send Reminder (Admin only)
router.post(
  "/remind/:id",
  authMiddleware,
  paymentController.sendSettlementReminder,
);

// Send Total Outstanding Reminder (Admin only)
router.post(
  "/remind-total/:orgId",
  authMiddleware,
  paymentController.sendTotalSettlementReminder,
);

// Download Invoice
// Export Ledger PDF (Admin)
router.get(
  "/export/pdf/:orgId",
  authMiddleware,
  paymentController.exportLedgerPdf,
);

// Download Invoice
router.get(
  "/invoice/:orgId",
  authMiddleware,
  paymentController.generateMonthlyInvoice,
);

module.exports = router;
