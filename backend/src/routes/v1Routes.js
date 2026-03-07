const express = require("express");
const router = express.Router();
const availabilityController = require("../controllers/v1/availabilityController");
const bookingController = require("../controllers/v1/bookingController");

/**
 * Public Platform Availability API
 */
router.get("/availability", availabilityController.getAvailability);

/**
 * Public Platform Booking API
 */
router.post("/bookings", bookingController.createBooking);

module.exports = router;
