const { Booking, Resource, Service, Customer } = require("../../models");
const sequelize = require("../../config/database");

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
        resourceId: resource_id || null, // Optional
        customerId: customerRecord.id,
        startTime: start_time,
        endTime: actualEndTime,
        customerName: customer.name,
        customerEmail: customer.email,
        customerMobile: customer.mobile,
        status: "confirmed",
      };

      // Handle metadata if column exists
      if (metadata) {
        bookingData.metadata = metadata;
      }

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
};

module.exports = bookingController;
