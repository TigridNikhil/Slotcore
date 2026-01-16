const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auditController = require("../controllers/auditController");
const invoiceController = require("../controllers/invoiceController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const {
  bookingLimiter,
  publicApiLimiter,
} = require("../middlewares/rateLimiter");
const { body, query } = require("express-validator");

const validateSlots = [
  query("date")
    .isISO8601()
    .toDate()
    .withMessage("Valid date required (YYYY-MM-DD)"),
  query("serviceId")
    .optional()
    .isUUID()
    .withMessage("Valid Service ID required"),
  query("serviceIds")
    .optional()
    .isString()
    .withMessage("Service IDs must be a comma-separated string"),
];

const validateBooking = [
  body("serviceId")
    .optional()
    .isUUID()
    .withMessage("Valid Service ID required"),
  body("serviceIds")
    .optional()
    .isArray()
    .withMessage("Service IDs must be an array"),
  body("startTime")
    .isISO8601()
    .toDate()
    .withMessage("Valid start time required"),
  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required"),
  body("customerEmail")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("notes").optional().trim().escape(),
];

// Custom Middleware for mixed Auth (Admin OR Public Token)
const jwt = require("jsonwebtoken");
const requireBookingPermission = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bookingToken = req.headers["x-booking-token"];

  // 1. Try Admin Auth
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret_dev_key"
      );
      req.user = decoded;
      return next();
    } catch (e) {
      // Continue to check booking token
    }
  }

  // 2. Try Public Booking Token
  if (bookingToken) {
    try {
      const decoded = jwt.verify(
        bookingToken,
        process.env.JWT_SECRET || "secret_dev_key"
      );
      if (decoded.role === "public_customer") {
        req.bookingAuth = decoded;
        return next();
      }
    } catch (e) {
      // Invalid token
    }
  }

  return res.status(401).json({ error: "Unauthorized access to booking" });
};

// Public endpoints (Client Booking Flow)
router.get(
  "/slots",
  publicApiLimiter,
  validateSlots,
  bookingController.getAvailableSlots
);
router.post(
  "/",
  bookingLimiter,
  validateBooking,
  bookingController.createBooking
);

// Public Booking Management Verification
router.post(
  "/public/verify",
  publicApiLimiter,
  bookingController.verifyPublicAccess
);

router.post(
  "/public/cancel",
  publicApiLimiter,
  bookingController.cancelPublicBookingBatch
);

// Booking Management (Admin or Verified Public)
router.put(
  "/:id/cancel",
  requireBookingPermission,
  bookingController.cancelBooking
);
router.put(
  "/:id/reschedule",
  requireBookingPermission,
  bookingController.rescheduleBooking
);
router.put(
  "/:id/noshow",
  auth,
  authorize(["admin", "org_admin", "staff"]),
  bookingController.markNoShow
);
router.put(
  "/:id/complete",
  auth,
  authorize(["admin", "org_admin", "staff"]),
  bookingController.markCompleted
);

// Protected endpoints (Admin Dashboard)
router.get("/", auth, bookingController.listBookings);
router.get(
  "/:id/logs",
  auth,
  authorize(["admin", "org_admin", "staff"]),
  auditController.getBookingLogs
);

// Invoices
router.get(
  "/:id/invoice",
  auth, // Or requireBookingPermission if Public wants to download
  invoiceController.generateInvoice
);

module.exports = router;
