const { Booking, Resource, Service, Customer } = require("../../models");
const sequelize = require("../../config/database");
const { Op } = require("sequelize");

const bookingController = {
  /**
   * POST /v1/bookings
   */
  createBooking: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const {
        service_id,
        resource_id,
        staff_id,
        start_time,
        end_time,
        customer,
        metadata,
        org_id, // Allow explicit org_id for API calls
      } = req.body;

      if (!service_id || !start_time || !customer) {
        await transaction.rollback();
        return res.badRequest(
          "service_id, start_time, and customer are required",
        );
      }

      // Determine Org ID (robustly)
      const resolvedOrgId =
        org_id ||
        req.headers["x-organization-id"] ||
        req.tenant?.id ||
        req.orgId;

      if (!resolvedOrgId) {
        await transaction.rollback();
        return res.badRequest(
          "Organization identification required (org_id or slug)",
        );
      }

      // 1. Fetch Service
      const service = await Service.findByPk(service_id);
      if (!service) {
        await transaction.rollback();
        return res.notFound("Service not found");
      }

      const duration = service.durationMin || service.duration || 30;
      const actualEndTime =
        end_time || new Date(new Date(start_time).getTime() + duration * 60000);

      // 2. Find or Create Customer
      const [customerRecord] = await Customer.findOrCreate({
        where: { email: customer.email, orgId: resolvedOrgId },
        defaults: {
          name: customer.name,
          mobile: customer.mobile,
          orgId: resolvedOrgId,
        },
        transaction,
      });

      // 3. Create Booking
      const bookingData = {
        orgId: resolvedOrgId,
        serviceId: service_id,
        resourceId: resource_id || null,
        staffId: staff_id || null,
        customerId: customerRecord.id,
        startTime: start_time,
        endTime: actualEndTime,
        customerName: customer.name,
        customerEmail: customer.email,
        customerMobile: customer.mobile,
        status: "confirmed",
        metadata: metadata || {},
      };

      const booking = await Booking.create(bookingData, { transaction });

      await transaction.commit();

      // Trigger Webhook Event (Async)
      try {
        const WebhookDispatcher = require("../../utils/webhookDispatcher");
        WebhookDispatcher.dispatch(resolvedOrgId, "booking.created", {
          booking_id: booking.id,
          service_id: booking.serviceId,
          start_time: booking.startTime,
          customer_email: booking.customerEmail,
        });
      } catch (webhookErr) {
        console.error("Webhook Dispatch Failed:", webhookErr);
      }

      return res.apiResponse(booking, "booking");
    } catch (error) {
      if (transaction && !transaction.finished) await transaction.rollback();
      console.error("Platform Booking Error:", error);
      return res.serverError(error.message, "Error creating booking");
    }
  },

  /**
   * GET /v1/bookings
   */
  listBookings: async (req, res) => {
    try {
      const { status, customer_id, service_id, from, to } = req.query;
      const where = { orgId: req.orgId };

      if (status) where.status = status;
      if (customer_id) where.customerId = customer_id;
      if (service_id) where.serviceId = service_id;
      if (from || to) {
        where.startTime = {};
        if (from) where.startTime[Op.gte] = new Date(from);
        if (to) where.startTime[Op.lte] = new Date(to);
      }

      const bookings = await Booking.findAll({
        where,
        order: [["startTime", "DESC"]],
        include: [
          { model: Service, attributes: ["name", "durationMin"] },
          { model: Customer, as: "customer", attributes: ["name", "email"] },
        ],
      });
      return res.successResponse(bookings);
    } catch (error) {
      return res.serverError(error);
    }
  },

  /**
   * GET /v1/bookings/:id
   */
  getBooking: async (req, res) => {
    try {
      const booking = await Booking.findOne({
        where: { id: req.params.id, orgId: req.orgId },
        include: ["Service", "customer", "staff"],
      });
      if (!booking) return res.notFound("Booking not found");
      return res.successResponse(booking);
    } catch (error) {
      return res.serverError(error);
    }
  },

  /**
   * PATCH /v1/bookings/:id
   */
  updateBooking: async (req, res) => {
    try {
      const { metadata, notes, status } = req.body;
      const booking = await Booking.findOne({
        where: { id: req.params.id, orgId: req.orgId },
      });
      if (!booking) return res.notFound("Booking not found");

      if (metadata) booking.metadata = { ...booking.metadata, ...metadata };
      if (notes) booking.notes = notes;
      if (status) booking.status = status;

      await booking.save();
      return res.successResponse(booking, "Booking updated");
    } catch (error) {
      return res.serverError(error);
    }
  },

  /**
   * PATCH /v1/bookings/:id/cancel
   */
  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findOne({
        where: { id: req.params.id, orgId: req.orgId },
      });
      if (!booking) return res.notFound("Booking not found");

      booking.status = "cancelled";
      await booking.save();

      // Dispatch webhook
      try {
        const WebhookDispatcher = require("../../utils/webhookDispatcher");
        WebhookDispatcher.dispatch(req.orgId, "booking.cancelled", {
          booking_id: booking.id,
        });
      } catch (e) {}

      return res.successResponse(null, "Booking cancelled");
    } catch (error) {
      return res.serverError(error);
    }
  },
};

module.exports = bookingController;
