const express = require("express");
const router = express.Router();
const consumerAuth = require("../middlewares/consumerAuth");
const consumerController = require("../controllers/consumerController");

// Protect all routes
router.use(consumerAuth);

// Actions
router.put("/bookings/:id/cancel", consumerController.cancelBooking);
router.put("/bookings/:id/reschedule", consumerController.rescheduleBooking);

router.get("/bookings", consumerController.getMyBookings);
router.get("/stats", consumerController.getConsumerStats);
router.put("/profile", consumerController.updateProfile);
router.get("/profile", consumerController.getProfile);

module.exports = router;
