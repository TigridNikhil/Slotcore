const express = require("express");
const router = express.Router();
const authController = require("../controllers/v1/authController");
const orgController = require("../controllers/v1/orgController");
const serviceController = require("../controllers/v1/serviceController");
const staffController = require("../controllers/v1/staffController");
const availabilityController = require("../controllers/v1/availabilityController");
const bookingController = require("../controllers/v1/bookingController");
const customerController = require("../controllers/v1/customerController");
const webhookController = require("../controllers/v1/webhookController");
const locationController = require("../controllers/v1/locationController");

/**
 * Auth (API Keys)
 */
router.get("/auth/keys", authController.listKeys);
router.post("/auth/keys", authController.createKey);
router.delete("/auth/keys/:id", authController.deleteKey);
router.patch("/auth/keys/:id/toggle", authController.toggleKey);

/**
 * Orgs
 */
router.get("/orgs/me", orgController.getMe);
router.patch("/orgs/me", orgController.updateMe);

/**
 * Services
 */
router.get("/services", serviceController.listServices);
router.get("/services/:id", serviceController.getService);
router.post("/services", serviceController.createService);
router.patch("/services/:id", serviceController.updateService);
router.delete("/services/:id", serviceController.deleteService);

/**
 * Staff
 */
router.get("/staff", staffController.listStaff);
router.get("/staff/:id", staffController.getStaff);
router.get("/staff/:id/availability", staffController.getStaffAvailability);

/**
 * Availability
 */
router.get("/availability", availabilityController.getAvailability);

/**
 * Bookings
 */
router.get("/bookings", bookingController.listBookings);
router.post("/bookings", bookingController.createBooking);
router.get("/bookings/:id", bookingController.getBooking);
router.patch("/bookings/:id", bookingController.updateBooking);
router.patch("/bookings/:id/cancel", bookingController.cancelBooking);

/**
 * Customers
 */
router.get("/customers", customerController.listCustomers);
router.get("/customers/:id", customerController.getCustomer);
router.post("/customers", customerController.createOrUpdateCustomer);

/**
 * Webhooks
 */
router.get("/webhooks", webhookController.listWebhooks);
router.post("/webhooks", webhookController.createWebhook);
router.delete("/webhooks/:id", webhookController.deleteWebhook);
router.get("/webhooks/events", webhookController.listSupportedEvents);
router.get("/webhooks/:id/events", webhookController.listEvents);

/**
 * Locations
 */
router.get("/locations", locationController.listLocations);
router.get("/locations/:id", locationController.getLocation);

module.exports = router;
